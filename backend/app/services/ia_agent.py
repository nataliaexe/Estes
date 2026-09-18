"""Agente de IA do Estes.

Fluxo:
1. Classifica intencao
2. Busca no Atlas (pgvector)
3. Se nao achar no Atlas -> busca cientifica (motor /explorar)
4. Busca web (Tavily)
5. Chama LLM em cascata
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
from app.services.ciencia import buscar_cientifico
from app.services.evidencia import extrair_evidencias
from app.services.ia_providers import (
    ProvedorIndisponivel,
    completar_cascata,
)

log = get_logger(__name__)


SYSTEM_PROMPT = """Voce e o assistente da plataforma Estes.

Estes e uma plataforma de cidadania ambiental que transforma recursos
locais em solucoes ambientais (sensores, filtros, biochar, sensores de
queimada, biodigestores, drones, eDNA, etc) e garante direitos
ambientais por meio de evidencia cientifica.

Seu papel:
1. Ajudar pessoas leigas a resolver problemas ambientais concretos.
2. Consultar o ATLAS quando o problema ja tiver caso cadastrado.
3. Consultar a LITERATURA CIENTIFICA quando o material for novo.
4. Orientar passo a passo com linguagem simples.
5. Citar fontes SEMPRE (caso do Atlas ou paper com DOI).
6. Reconhecer limites (nao substituir medico, laboratorio, orgao).
7. Se for risco de vida, orientar procurar orgao (MPF, IBAMA, FUNAI,
   SESAI, Defesa Civil).

REGRAS CRITICAS:
- NUNCA invente informacao fora do contexto.
- Se o contexto nao tiver a resposta, diga "nao tenho essa informacao".
- Cite a fonte assim: "Caso #N do Atlas (evidencia: X)" ou
  "Paper: [titulo] (DOI: ...)".
- Se for evidencia cientifica nova, sempre mostre nivel:
  demonstrado, suportado, modelado, hipotese.

Formatacao:
- Sem emoji.
- Paragrafos curtos e listas com hifen.
- Sem tabelas, sem #, sem negrito excessivo.
- Portugues do Brasil.
"""


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
    usou_motor_cientifico: bool = False


async def classificar_intencao(pergunta: str) -> str:
    prompt = f"""Classifique a intencao em UMA categoria:

PLATAFORMA: pergunta sobre solucoes, casos, recursos locais, protocolos,
como fazer sensor/filtro/biochar, eucalipto, casca de arroz, acai, etc.

WEB: noticias, eventos atuais, contaminacao recente, clima, queimadas,
dados de satelite, legislacao.

NOVO_MATERIAL: pergunta sobre MATERIAL que nao esta no Atlas tipico,
ex: "tenho casca de cafe", "tenho folha de manga", "tenho sabugo de
milho". Se o material for novo, classifique aqui.

AMBAS: precisa de mais de uma.

CONVERSA: saudacao, ajuda com a plataforma.

Pergunta: "{pergunta}"
Responda APENAS com uma palavra: PLATAFORMA, WEB, NOVO_MATERIAL, AMBAS ou CONVERSA."""

    try:
        resposta = await completar_cascata(
            [{"role": "user", "content": prompt}],
            temperatura=0.0,
            max_tokens=10,
        )
        limpo = re.sub(r"[^A-Z_]", "", resposta.texto.strip().upper())
        if limpo not in ("PLATAFORMA", "WEB", "NOVO_MATERIAL", "AMBAS", "CONVERSA"):
            return "AMBAS"
        return limpo
    except ProvedorIndisponivel:
        return "AMBAS"


async def responder(
    session: AsyncSession,
    pergunta: str,
    contexto: ContextoAgente,
) -> RespostaAgente:
    log.info("agente_inicio", perfil=contexto.perfil, uf=contexto.uf)

    ferramentas: list[str] = []
    fontes: list[dict] = []
    contexto_extra: list[str] = []
    usou_motor_cientifico = False

    intencao = await classificar_intencao(pergunta)
    log.info("agente_intencao", intencao=intencao)

    # 1. Plataforma
    if intencao in ("PLATAFORMA", "AMBAS", "NOVO_MATERIAL"):
        try:
            resultados = await buscar_plataforma(session, pergunta, limite=5)
            if resultados:
                ferramentas.append("busca_plataforma")
                contexto_extra.append(_fmt_plataforma(resultados))
                for r in resultados:
                    fontes.append({
                        "tipo": "atlas",
                        "titulo": r.titulo,
                        "score": round(r.score, 3),
                        "metadata": r.metadata,
                    })
        except Exception as e:
            log.warning("plataforma_falhou", erro=str(e)[:150])

    # 2. MOTOR CIENTIFICO (se material novo)
    if intencao == "NOVO_MATERIAL" or (
        intencao == "AMBAS" and _parece_material_novo(pergunta)
    ):
        try:
            material, problema = _extrair_material_problema(pergunta)
            if material:
                log.info("motor_cientifico_trigger", material=material)
                papers = await buscar_cientifico(material, problema)
                if papers:
                    extracao = await extrair_evidencias(
                        papers, material, problema, max_papers=5
                    )
                    if extracao.evidencias:
                        usou_motor_cientifico = True
                        ferramentas.append("motor_cientifico")
                        bloco = _fmt_evidencias(extracao.evidencias)
                        contexto_extra.append(bloco)
                        for e in extracao.evidencias[:3]:
                            fontes.append({
                                "tipo": "paper",
                                "titulo": e.source,
                                "doi": e.doi,
                                "url": e.url,
                                "nivel": e.nivel,
                            })
        except Exception as e:
            log.warning("motor_cientifico_falhou", erro=str(e)[:150])

    # 3. Web
    if intencao in ("WEB", "AMBAS", "NOVO_MATERIAL"):
        try:
            consulta = pergunta
            if contexto.municipio and contexto.uf:
                consulta = f"{pergunta} {contexto.municipio} {contexto.uf}"
            elif contexto.uf:
                consulta = f"{pergunta} {contexto.uf}"
            resultados = await buscar_web(consulta, max_resultados=4)
            if resultados:
                ferramentas.append("busca_web")
                contexto_extra.append(_fmt_web(resultados))
                for r in resultados:
                    fontes.append({"tipo": "web", "titulo": r.titulo, "url": r.url})
        except Exception as e:
            log.warning("web_falhou", erro=str(e)[:150])

    # 4. Mensagens
    mensagens = [{"role": "system", "content": SYSTEM_PROMPT}]

    dados_usuario = []
    if contexto.perfil:
        dados_usuario.append(f"Perfil: {contexto.perfil}")
    if contexto.municipio and contexto.uf:
        dados_usuario.append(f"Local: {contexto.municipio}, {contexto.uf}")
    elif contexto.uf:
        dados_usuario.append(f"UF: {contexto.uf}")
    if dados_usuario:
        mensagens.append({
            "role": "system",
            "content": "=== DADOS DO USUARIO ===\n" + "\n".join(dados_usuario),
        })

    for msg in contexto.historico[-6:]:
        if msg.get("role") in ("user", "assistant"):
            mensagens.append(msg)

    if contexto_extra:
        mensagens.append({
            "role": "system",
            "content": "\n\n".join(contexto_extra),
        })

    mensagens.append({"role": "user", "content": pergunta})

    # 5. LLM
    try:
        resposta = await completar_cascata(mensagens, temperatura=0.3, max_tokens=1500)
    except ProvedorIndisponivel as e:
        log.error("agente_falhou", erro=str(e)[:300])
        return RespostaAgente(
            texto="Nao consegui processar agora. Tente novamente.",
            provedor="erro", modelo="erro",
            fontes=fontes, ferramentas_usadas=ferramentas,
            sugestoes=["Tentar novamente"], intencao=intencao,
        )

    sugestoes = _sugestoes(intencao, ferramentas, usou_motor_cientifico)

    return RespostaAgente(
        texto=resposta.texto,
        provedor=resposta.provedor,
        modelo=resposta.modelo,
        fontes=fontes,
        ferramentas_usadas=ferramentas,
        sugestoes=sugestoes,
        intencao=intencao,
        usou_motor_cientifico=usou_motor_cientifico,
    )


def _parece_material_novo(pergunta: str) -> bool:
    palavras = ["tenho", "achei", "sobrou", "muita", "muito", "pilha"]
    return any(p in pergunta.lower() for p in palavras)


def _extrair_material_problema(pergunta: str) -> tuple[str, str]:
    """Extrai material e problema via heuristica melhorada."""
    import re

    pergunta_lower = pergunta.lower()

    # Material: pega ate 3 palavras depois de "tenho/achei/sobrou/etc"
    # e para antes de conectores (e/mas/que/para/com)
    padroes = [
        r"(?:tenho|achei|sobrou|tem|consegui)\s+([a-z\u00e1-\u00fa]+(?:\s+de\s+[a-z\u00e1-\u00fa]+)?)",
        r"(?:muita?|pilha de)\s+([a-z\u00e1-\u00fa]+(?:\s+de\s+[a-z\u00e1-\u00fa]+)?)",
    ]

    material = ""
    for padrao in padroes:
        m = re.search(padrao, pergunta_lower)
        if m:
            material = m.group(1).strip()
            break

    # Limpa conectores no final
    material = re.sub(r"\s+(e|mas|que|para|com|no|na)$", "", material).strip()

    # Problema: pega primeira keyword encontrada
    problema = ""
    for kw in ["agua", "solo", "ar", "queimada", "contaminacao", "contamina",
               "metais", "mercurio", "esgoto", "enchente", "desmatamento",
               "agrotoxico", "residuos"]:
        if kw in pergunta_lower:
            problema = kw
            break

    return material, problema or "problema ambiental"


def _fmt_plataforma(rs: list[ResultadoPlataforma]) -> str:
    partes = ["=== CONHECIMENTO DO ATLAS ==="]
    for r in rs:
        partes.append(f"\n[{r.titulo}] (similaridade {r.score:.3f})\n{r.conteudo}")
    return "\n".join(partes)


def _fmt_web(rs: list[ResultadoWeb]) -> str:
    partes = ["=== RESULTADOS DA WEB ==="]
    for r in rs:
        partes.append(f"\n[{r.titulo}]\nURL: {r.url}\n{r.conteudo[:400]}")
    return "\n".join(partes)


def _fmt_evidencias(evs) -> str:
    partes = ["=== EVIDENCIAS CIENTIFICAS (motor cientifico) ==="]
    for i, e in enumerate(evs[:5]):
        partes.append(
            f"\n[{i+1}] {e.claim}\n"
            f"    Fonte: {e.source}\n"
            f"    DOI: {e.doi or 's/ DOI'}\n"
            f"    Trecho literal: \"{e.trecho[:300]}\"\n"
            f"    Tipo: {e.tipo}\n"
            f"    Nivel: {e.nivel} (forca {e.forca})\n"
            f"    Limitacoes: {e.limitacoes}\n"
            f"    Aplicabilidade: {e.aplicabilidade}"
        )
    return "\n".join(partes)


def _sugestoes(intencao: str, ferramentas: list[str], usou_ciencia: bool) -> list[str]:
    s: list[str] = []
    if "busca_plataforma" in ferramentas:
        s.append("Ver o caso completo do Atlas")
    if "motor_cientifico" in ferramentas and usou_ciencia:
        s.append("Abrir os papers originais (DOI)")
        s.append("Ver limitacoes das evidencias")
    if "busca_web" in ferramentas:
        s.append("Ler as noticias completas")
    if intencao in ("PLATAFORMA", "AMBAS", "NOVO_MATERIAL"):
        s.append("Documentar e denunciar contaminacao")
    if not s:
        s.append("Fazer uma nova pergunta")
    return s[:4]
