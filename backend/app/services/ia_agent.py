"""Agente de IA do Estes.

Fluxo:
1. Classifica intencao (PLATAFORMA / WEB / AMBAS / CONVERSA)
2. Busca na plataforma (Atlas)
3. Busca na web (Tavily)
4. Monta contexto para o LLM
5. Chama LLM em cascata (Groq -> Gemini -> Ollama)
6. Retorna resposta estruturada
"""

import re
from dataclasses import dataclass, field

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.services.busca_plataforma import (
    ResultadoPlataforma,
    buscar_plataforma,
)
from app.services.busca_web import ResultadoWeb, buscar_web
from app.services.ia_providers import (
    ProvedorIndisponivel,
    completar_cascata,
)

log = get_logger(__name__)


# ============================================================
# SYSTEM PROMPT
# ============================================================
SYSTEM_PROMPT = """Voce e o assistente da plataforma Estes.

Estes e uma plataforma de cidadania ambiental que transforma recursos
locais em solucoes ambientais (sensores de agua, filtros, biochar) e
garante direitos ambientais por meio de evidencia cientifica.

Seu papel:
1. Ajudar pessoas leigas a resolver problemas ambientais concretos.
2. Consultar o Atlas de casos quando o usuario mencionar um recurso
   local (eucalipto, casca de arroz, acai, babacu, etc).
3. Orientar passo a passo, com linguagem simples.
4. Citar fontes quando usar informacoes do Atlas ou da web.
5. Reconhecer limites (nao substituir medico, laboratorio ou orgao).
6. Se for risco de vida, orientar procurar orgao oficial (MPF, IBAMA,
   FUNAI, SESAI, Defesa Civil).

Perfis de usuario: cidadao, indigena, quilombola, agricultor, turista,
pesquisador, agente_saude, gestor_publico.

REGRAS CRITICAS (obrigatorias):
- NUNCA invente informacao que nao esteja no contexto fornecido.
- Se o contexto nao tiver a resposta, diga "nao tenho essa informacao
  no Atlas" em vez de inventar.
- NUNCA adicione casos, numeros ou detalhes que nao estejam no contexto.
- Cite a fonte no formato exato: "Caso #N do Atlas (evidencia: X)".

REGRAS CRITICAS (obrigatorias):
- NUNCA invente informacao que nao esteja no contexto fornecido.
- Se o contexto nao tiver a resposta, diga "nao tenho essa informacao
  no Atlas" em vez de inventar.
- NUNCA adicione casos, numeros ou detalhes que nao estejam no contexto.
- Cite a fonte no formato exato: "Caso #N do Atlas (evidencia: X)".

Regras de resposta:
- Simples, direto, respeitoso. Sem jargao tecnico com leigos.
- Sem emoji.
- Formatacao simples: paragrafos curtos e listas com hifen.
- Evite tabelas, titulos com # e negrito excessivo.
- Cite a fonte assim: "Caso #1 do Atlas (evidencia: demonstrado)".
- Em portugues do Brasil.
- Se nao souber, dizer que nao sabe.
- Nunca inventar dado, fonte ou numero.
- Se o usuario quiser denunciar, orientar o orgao correto.

Quando usar o Atlas (contexto fornecido):
- Sempre citar o numero do caso (ex: "Caso #1 do Atlas").
- Indicar o nivel de evidencia (demonstrado, suportado, modelado,
  hipotese).

Quando usar a web (contexto fornecido):
- Citar a fonte (veiculo) e, se possivel, o link.
- Diferenciar fato de opiniao.
"""


# ============================================================
# CONTEXTO E RESPOSTA
# ============================================================
@dataclass
class ContextoAgente:
    usuario_id: str | None = None
    perfil: str = "cidadao"
    uf: str | None = None
    municipio: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    historico: list[dict] = field(default_factory=list)


@dataclass
class RespostaAgente:
    texto: str
    provedor: str
    modelo: str
    fontes: list[dict] = field(default_factory=list)
    ferramentas_usadas: list[str] = field(default_factory=list)
    sugestoes: list[str] = field(default_factory=list)
    intencao: str = "conversa"


# ============================================================
# CLASSIFICADOR DE INTENCAO
# ============================================================
async def classificar_intencao(pergunta: str) -> str:
    """Classifica a intencao em PLATAFORMA / WEB / AMBAS / CONVERSA."""
    prompt = f"""Classifique a intencao da pergunta do usuario em UMA das categorias:

PLATAFORMA: pergunta sobre solucoes, casos, recursos locais, protocolos,
como fazer sensor ou filtro, eucalipto, acai, casca de arroz, biochar,
como usar a plataforma.

WEB: pergunta sobre noticias, eventos atuais, contaminacao recente,
clima, queimadas, dados de satelite, legislacao, dados oficiais.

AMBAS: precisa de plataforma E web.

CONVERSA: saudacao, duvida geral, ajuda com a plataforma.

Pergunta: "{pergunta}"

Responda APENAS com uma palavra: PLATAFORMA, WEB, AMBAS ou CONVERSA."""

    try:
        resposta = await completar_cascata(
            [{"role": "user", "content": prompt}],
            temperatura=0.0,
            max_tokens=10,
        )
        limpo = resposta.texto.strip().upper()
        limpo = re.sub(r"[^A-Z]", "", limpo)
        if limpo not in ("PLATAFORMA", "WEB", "AMBAS", "CONVERSA"):
            log.warning("intencao_invalida", resposta=limpo)
            return "AMBAS"
        return limpo
    except ProvedorIndisponivel:
        log.warning("classificacao_falhou_fallback")
        return "AMBAS"


# ============================================================
# AGENTE PRINCIPAL
# ============================================================
async def responder(
    session: AsyncSession,
    pergunta: str,
    contexto: ContextoAgente,
) -> RespostaAgente:
    log.info(
        "agente_inicio",
        perfil=contexto.perfil,
        uf=contexto.uf,
        pergunta_len=len(pergunta),
    )

    ferramentas: list[str] = []
    fontes: list[dict] = []
    contexto_extra: list[str] = []

    # 1. Classifica
    intencao = await classificar_intencao(pergunta)
    log.info("agente_intencao", intencao=intencao)

    # 2. Busca na plataforma
    if intencao in ("PLATAFORMA", "AMBAS"):
        try:
            resultados = await buscar_plataforma(
                session, pergunta, limite=5
            )
            if resultados:
                ferramentas.append("busca_plataforma")
                contexto_extra.append(
                    _formatar_contexto_plataforma(resultados)
                )
                for r in resultados:
                    fontes.append(
                        {
                            "tipo": "atlas",
                            "titulo": r.titulo,
                            "score": round(r.score, 3),
                            "metadata": r.metadata,
                        }
                    )
                log.info(
                    "plataforma_ok",
                    total=len(resultados),
                    top_score=resultados[0].score,
                )
        except Exception as e:
            log.warning("busca_plataforma_falhou", erro=str(e)[:200])

    # 3. Busca na web
    if intencao in ("WEB", "AMBAS"):
        try:
            consulta = pergunta
            if contexto.municipio and contexto.uf:
                consulta = f"{pergunta} {contexto.municipio} {contexto.uf}"
            elif contexto.uf:
                consulta = f"{pergunta} {contexto.uf}"

            resultados = await buscar_web(consulta, max_resultados=4)
            if resultados:
                ferramentas.append("busca_web")
                contexto_extra.append(_formatar_contexto_web(resultados))
                for r in resultados:
                    fontes.append(
                        {
                            "tipo": "web",
                            "titulo": r.titulo,
                            "url": r.url,
                        }
                    )
                log.info("web_ok", total=len(resultados))
        except Exception as e:
            log.warning("busca_web_falhou", erro=str(e)[:200])

    # 4. Monta mensagens
    mensagens = [{"role": "system", "content": SYSTEM_PROMPT}]

    dados_usuario = _formatar_dados_usuario(contexto)
    if dados_usuario:
        mensagens.append(
            {"role": "system", "content": dados_usuario}
        )

    for msg in contexto.historico[-6:]:
        if msg.get("role") in ("user", "assistant"):
            mensagens.append(
                {"role": msg["role"], "content": msg["content"]}
            )

    if contexto_extra:
        mensagens.append(
            {
                "role": "system",
                "content": "\n\n".join(contexto_extra),
            }
        )

    mensagens.append({"role": "user", "content": pergunta})

    # 5. Chama LLM
    try:
        resposta = await completar_cascata(
            mensagens, temperatura=0.3, max_tokens=1500
        )
    except ProvedorIndisponivel as e:
        log.error("agente_falhou", erro=str(e)[:300])
        return RespostaAgente(
            texto=(
                "Nao consegui processar sua pergunta agora. "
                "Verifique se o Ollama esta rodando e tente novamente."
            ),
            provedor="erro",
            modelo="erro",
            fontes=fontes,
            ferramentas_usadas=ferramentas,
            sugestoes=["Tentar novamente"],
            intencao=intencao,
        )

    # 6. Sugestoes
    sugestoes = _gerar_sugestoes(intencao, ferramentas, fontes)

    return RespostaAgente(
        texto=resposta.texto,
        provedor=resposta.provedor,
        modelo=resposta.modelo,
        fontes=fontes,
        ferramentas_usadas=ferramentas,
        sugestoes=sugestoes,
        intencao=intencao,
    )


# ============================================================
# FORMATADORES
# ============================================================
def _formatar_contexto_plataforma(
    resultados: list[ResultadoPlataforma],
) -> str:
    partes = ["=== CONHECIMENTO DO ATLAS ==="]
    for r in resultados:
        partes.append(
            f"\n[{r.titulo}] (similaridade: {r.score:.3f})\n"
            f"{r.conteudo}"
        )
    return "\n".join(partes)


def _formatar_contexto_web(
    resultados: list[ResultadoWeb],
) -> str:
    partes = ["=== RESULTADOS DA WEB ==="]
    for r in resultados:
        partes.append(
            f"\n[{r.titulo}]\nURL: {r.url}\n{r.conteudo[:500]}"
        )
    return "\n".join(partes)


def _formatar_dados_usuario(contexto: ContextoAgente) -> str:
    partes = ["=== DADOS DO USUARIO ==="]
    if contexto.perfil:
        partes.append(f"Perfil: {contexto.perfil}")
    if contexto.municipio and contexto.uf:
        partes.append(f"Local: {contexto.municipio}, {contexto.uf}")
    elif contexto.uf:
        partes.append(f"UF: {contexto.uf}")
    if contexto.latitude and contexto.longitude:
        partes.append(
            f"Coordenadas: {contexto.latitude:.4f}, "
            f"{contexto.longitude:.4f}"
        )
    return "\n".join(partes) if len(partes) > 1 else ""


def _gerar_sugestoes(
    intencao: str,
    ferramentas: list[str],
    fontes: list[dict],
) -> list[str]:
    sugestoes: list[str] = []

    if "busca_plataforma" in ferramentas:
        sugestoes.append("Ver o caso completo do Atlas")
        sugestoes.append("Seguir o passo a passo do protocolo")
    if "busca_web" in ferramentas:
        sugestoes.append("Ler as noticias completas")
    if intencao in ("PLATAFORMA", "AMBAS"):
        sugestoes.append("Documentar e denunciar contaminacao")
        sugestoes.append("Ver outras solucoes no Atlas")
    if not sugestoes:
        sugestoes.append("Fazer uma nova pergunta")

    return sugestoes[:4]
