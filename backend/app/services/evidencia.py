"""Extracao de evidencias cientificas com priorizacao de papers com abstract."""

import json
import re
from dataclasses import dataclass, field

from app.core.config import settings
from app.core.logging import get_logger
from app.services.ciencia import Paper, atualizar_evidencia_paper
from app.services.ia_providers import ProvedorIndisponivel, completar_cascata

log = get_logger(__name__)


@dataclass
class Evidencia:
    claim: str
    source: str
    doi: str | None
    url: str | None
    trecho: str
    tipo: str
    limitacoes: str
    aplicabilidade: str
    nivel: str
    forca: float


PROMPT_EXTRACAO = """Voce extrai evidencias cientificas para a plataforma Estes.

REGRAS ABSOLUTAS:
1. Se o artigo nao fala do material ou do problema, retorne {"aplicavel": false}
2. Cada claim DEVE ter TRECHO LITERAL do abstract. Sem trecho = sem claim.
3. NUNCA invente DOI, autor, ano ou numero.

Retorne JSON:
{
  "aplicavel": true,
  "claim": "afirmacao objetiva",
  "trecho": "trecho literal do abstract",
  "tipo": "experimento"|"revisao"|"modelagem"|"observacao",
  "limitacoes": "o que o artigo NAO demonstra",
  "aplicabilidade": "como se aplica ao caso",
  "nivel": "demonstrado"|"suportado"|"modelado"|"hipotese",
  "forca": 0.0-1.0
}

Se nao aplicavel: {"aplicavel": false, "motivo": "..."}
Retorne APENAS o JSON.
"""


STOPWORDS = {
    "de", "da", "do", "das", "dos", "a", "o", "as", "os", "e",
    "em", "para", "por", "com", "sem", "no", "na", "nos", "nas",
    "um", "uma", "uns", "umas", "que", "the", "of", "and", "to",
    "in", "for", "with", "on", "at", "by", "from", "this", "that",
    "is", "are", "was", "were", "been", "be", "has", "have", "had",
}


def _palavras_chave(texto: str) -> set[str]:
    palavras = re.findall(r"\b\w{4,}\b", texto.lower())
    return {p for p in palavras if p not in STOPWORDS}


def _extrair_json(texto: str) -> dict | None:
    """Extrator de JSON tolerante a truncamento e formatacao."""
    if not texto:
        return None

    texto = texto.strip()
    texto = re.sub(r"^```(?:json)?\s*", "", texto)
    texto = re.sub(r"\s*```$", "", texto)
    texto = texto.strip()

    # Tentativa direta
    try:
        return json.loads(texto)
    except json.JSONDecodeError:
        pass

    # Acha { ... }
    ini = texto.find("{")
    fim = texto.rfind("}")
    if ini >= 0 and fim > ini:
        try:
            return json.loads(texto[ini:fim + 1])
        except json.JSONDecodeError:
            pass

    # TOLERANTE A TRUNCAMENTO: tenta fechar chaves e aspas
    if ini >= 0:
        fragmento = texto[ini:]
        for tentativa in range(5):
            fragmento_fechado = _fechar_json(fragmento)
            if fragmento_fechado:
                try:
                    return json.loads(fragmento_fechado)
                except json.JSONDecodeError:
                    pass
            fragmento = fragmento[:-1]

    return None


def _fechar_json(fragmento: str) -> str | None:
    """Tenta fechar JSON truncado adicionando chaves e aspas."""
    if not fragmento:
        return None

    f = fragmento.rstrip()

    # Conta aspas nao-escapadas
    aspas = f.count('"') - f.count('\\"')
    if aspas % 2 != 0:
        f += '"'

    # Conta chaves
    abre = f.count("{")
    fecha = f.count("}")
    f += "}" * (abre - fecha)

    return f


def _fallback_por_keyword(
    paper: Paper, material: str, problema: str
) -> Evidencia | None:
    if not paper.abstract:
        return None

    palavras_mat = _palavras_chave(material)
    palavras_prob = _palavras_chave(problema)

    frases = re.split(r"[.!?]\s+", paper.abstract)
    melhor_frase = None
    melhor_score = 0

    for frase in frases:
        frase_lower = frase.lower()
        score_mat = sum(1 for p in palavras_mat if p in frase_lower)
        score_prob = sum(1 for p in palavras_prob if p in frase_lower)
        score = score_mat + score_prob

        if score > melhor_score and len(frase) > 40:
            melhor_score = score
            melhor_frase = frase

    if not melhor_frase or melhor_score < 2:
        return None

    return Evidencia(
        claim=(
            f"O artigo menciona relacao entre {material} e {problema} "
            f"(extracao por keyword)."
        ),
        source=f"{paper.titulo} ({paper.ano or 's/d'})",
        doi=paper.doi,
        url=paper.url,
        trecho=melhor_frase.strip()[:500],
        tipo="observacao",
        limitacoes="Extracao por keyword - requer revisao humana",
        aplicabilidade="Verificar manualmente",
        nivel="hipotese",
        forca=0.3,
    )


async def extrair_evidencia(
    paper: Paper, material: str, problema: str
) -> Evidencia | None:
    if not paper.abstract or len(paper.abstract) < 80:
        return None

    contexto = f"""MATERIAL: {material}
PROBLEMA: {problema}

ARTIGO:
Titulo: {paper.titulo}
Ano: {paper.ano}
DOI: {paper.doi or 'sem DOI'}
Fonte: {paper.fonte}
Abstract: {paper.abstract[:1500]}
"""

    try:
        # Skip Ollama na extracao
        resposta = await completar_cascata(
            [
                {"role": "system", "content": PROMPT_EXTRACAO},
                {"role": "user", "content": contexto},
            ],
            temperatura=0.0,
            max_tokens=1500,
            groq_model_override=settings.groq_model_fast,
        )
    except ProvedorIndisponivel as e:
        log.warning("extracao_llm_falhou", erro=str(e)[:150])
        return _fallback_por_keyword(paper, material, problema)

    texto = resposta.texto.strip()
    dados = _extrair_json(texto)

    if not dados:
        log.warning(
            "extracao_json_invalido",
            paper=paper.titulo[:50],
            trecho=texto[:200],
        )
        return _fallback_por_keyword(paper, material, problema)

    if not dados.get("aplicavel"):
        motivo = dados.get("motivo", "sem motivo")
        log.info(
            "paper_nao_aplicavel",
            paper=paper.titulo[:50],
            motivo=motivo[:80],
        )
        return None

    claim = dados.get("claim", "").strip()
    trecho = dados.get("trecho", "").strip()

    if not claim or not trecho:
        log.warning("claim_ou_trecho_vazio", paper=paper.titulo[:50])
        return _fallback_por_keyword(paper, material, problema)

    trecho_norm = re.sub(r"\s+", " ", trecho.lower())[:80]
    abstract_norm = re.sub(r"\s+", " ", paper.abstract.lower())

    forca_base = float(dados.get("forca", 0.5))

    if trecho_norm and trecho_norm not in abstract_norm:
        log.warning(
            "trecho_nao_encontrado",
            paper=paper.titulo[:50],
            trecho=trecho_norm[:60],
        )
        forca = min(forca_base, 0.4)
        tipo_marcador = " (trecho nao verificado)"
    else:
        forca = forca_base
        tipo_marcador = ""

    return Evidencia(
        claim=claim,
        source=f"{paper.titulo} ({paper.ano or 's/d'})",
        doi=paper.doi,
        url=paper.url,
        trecho=trecho,
        tipo=dados.get("tipo", "observacao") + tipo_marcador,
        limitacoes=dados.get("limitacoes", "nao especificadas"),
        aplicabilidade=dados.get("aplicabilidade", ""),
        nivel=dados.get("nivel", "hipotese"),
        forca=forca,
    )


@dataclass
class ExtracaoResultado:
    evidencias: list[Evidencia] = field(default_factory=list)
    sem_abstract: int = 0
    nao_aplicaveis: int = 0
    erros: int = 0
    total_artigos: int = 0


async def extrair_evidencias(
    papers: list[Paper],
    material: str,
    problema: str,
    max_papers: int = 15,
) -> ExtracaoResultado:
    """Extrai evidencias. PRIORIZA papers com abstract."""
    resultado = ExtracaoResultado(total_artigos=len(papers))

    # SEPARA: com abstract vs sem abstract
    com_abstract = [p for p in papers if p.abstract and len(p.abstract) >= 80]
    sem_abstract = [p for p in papers if not p.abstract or len(p.abstract) < 80]

    # COM abstract primeiro (por citacoes ja ordenadas), depois os sem
    ordenados = com_abstract + sem_abstract

    log.info(
        "extracao_priorizacao",
        com_abstract=len(com_abstract),
        sem_abstract=len(sem_abstract),
        vao_ser_analisados=min(len(ordenados), max_papers),
    )

    for i, paper in enumerate(ordenados[:max_papers]):
        if not paper.abstract or len(paper.abstract) < 80:
            resultado.sem_abstract += 1
            continue

        log.info(
            "extraindo",
            indice=i + 1,
            total=min(len(ordenados), max_papers),
            titulo=paper.titulo[:50],
            fonte=paper.fonte,
            tem_doi=bool(paper.doi),
        )

        try:
            # Delay para evitar rate limit (Groq free tier)
            import asyncio
            await asyncio.sleep(5.0)
            ev = await extrair_evidencia(paper, material, problema)
            if ev:
                resultado.evidencias.append(ev)
            else:
                resultado.nao_aplicaveis += 1
        except Exception as e:
            log.warning("extracao_falhou", erro=str(e)[:150])
            resultado.erros += 1

    resultado.evidencias.sort(key=lambda e: e.forca, reverse=True)
    return resultado


async def extrair_e_cachear(
    papers: list[Paper],
    material: str,
    problema: str,
    max_papers: int = 8,
) -> ExtracaoResultado:
    """Extrai evidencias E salva de volta no cache de papers."""
    resultado = ExtracaoResultado(total_artigos=len(papers))

    # Separa os que ja tem evidencia (cache) dos que precisam extrair
    com_evidencia = [p for p in papers if p.evidence]
    sem_evidencia = [p for p in papers if not p.evidence and p.abstract and len(p.abstract) >= 80]
    sem_abstract = [p for p in papers if not p.evidence and (not p.abstract or len(p.abstract) < 80)]

    # Reconstroi evidencias do cache
    for p in com_evidencia:
        if p.evidence:
            try:
                resultado.evidencias.append(Evidencia(
                    claim=p.evidence.get("claim", ""),
                    source=f"{p.titulo} ({p.ano or 's/d'})",
                    doi=p.doi,
                    url=p.url,
                    trecho=p.evidence.get("trecho", ""),
                    tipo=p.evidence.get("tipo", "observacao"),
                    limitacoes=p.evidence.get("limitacoes", ""),
                    aplicabilidade=p.evidence.get("aplicabilidade", ""),
                    nivel=p.evidence.get("nivel", "hipotese"),
                    forca=float(p.evidence.get("forca", 0.5)),
                ))
            except Exception as e:
                log.warning("evidencia_cache_falhou", erro=str(e)[:100])

    # Extrai dos que faltam
    para_extrair = sem_evidencia[:max_papers]
    for i, p in enumerate(para_extrair):
        log.info("extraindo_e_cacheando", indice=i+1, total=len(para_extrair),
                 titulo=p.titulo[:50])
        try:
            import asyncio
            await asyncio.sleep(5.0)
            ev = await extrair_evidencia(p, material, problema)
            if ev:
                resultado.evidencias.append(ev)
                # Salva de volta no cache
                if p.paper_id:
                    await atualizar_evidencia_paper(p.paper_id, {
                        "aplicavel": True,
                        "claim": ev.claim,
                        "trecho": ev.trecho,
                        "tipo": ev.tipo,
                        "limitacoes": ev.limitacoes,
                        "aplicabilidade": ev.aplicabilidade,
                        "nivel": ev.nivel,
                        "forca": ev.forca,
                    })
            else:
                resultado.nao_aplicaveis += 1
        except Exception as e:
            log.warning("extracao_falhou", erro=str(e)[:150])
            resultado.erros += 1

    resultado.sem_abstract = len(sem_abstract)
    resultado.evidencias.sort(key=lambda e: e.forca, reverse=True)
    return resultado
