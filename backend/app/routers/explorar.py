"""Endpoint para explorar materiais NAO cadastrados no Atlas."""

import json
import re

from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.logging import get_logger
from app.schemas.explorar import (
    EvidenciaOut,
    ExplorarRequest,
    ExplorarResposta,
)
from app.services.ciencia import buscar_cientifico
from app.services.evidencia import extrair_e_cachear
from app.services.ia_providers import ProvedorIndisponivel, completar_cascata
from app.services.ia_providers import gemini_completar, groq_completar

log = get_logger(__name__)
router = APIRouter(prefix="/explorar", tags=["explorar"])
limiter = Limiter(key_func=get_remote_address)


PROMPT_CAMINHOS = """Voce e um consultor cientifico da Estes.

Recebeu um material + problema + evidencias extraidas de papers reais.

Proponha caminhos baseados APENAS nas evidencias. Nunca invente.

Retorne JSON exato:
{
  "caminhos": [
    "Passo 1: [acao] (baseado em: [fonte])",
    "Passo 2: ...",
  ],
  "limitacoes": ["..."],
  "seguranca": ["..."],
  "aviso": "nota honesta sobre nivel de evidencia"
}

Se nao houver evidencia suficiente, diga isso.
"""


def _extrair_json(texto: str) -> dict | None:
    texto = texto.strip()
    texto = re.sub(r"^```(?:json)?\s*", "", texto)
    texto = re.sub(r"\s*```$", "", texto)
    try:
        return json.loads(texto)
    except json.JSONDecodeError:
        pass
    ini = texto.find("{")
    fim = texto.rfind("}")
    if ini >= 0 and fim > ini:
        try:
            return json.loads(texto[ini:fim + 1])
        except json.JSONDecodeError:
            pass
    return None


def _fallback_caminhos(extracao) -> tuple[list, list, list, str]:
    """Se LLM falhar, gera caminhos basicos a partir das evidencias."""
    caminhos = []
    limitacoes = []
    seguranca = [
        "Consulte um especialista antes de aplicar.",
        "Use EPI ao manusear reagentes.",
        "Documente e denuncie se houver contaminacao.",
    ]
    aviso = (
        "Caminhos gerados em modo simplificado (falha na geracao via IA). "
        "Baseados apenas nas evidencias extraidas."
    )

    for i, e in enumerate(extracao.evidencias[:4]):
        caminhos.append(
            f"{i+1}. Segundo {e.source}: {e.claim} "
            f"(nivel: {e.nivel})"
        )
        if e.limitacoes:
            limitacoes.append(f"Evidencia {i+1}: {e.limitacoes}")

    if not caminhos:
        aviso = (
            "Nenhuma evidencia aplicavel foi extraida. "
            "Isso pode significar que o material/problema e muito especifico."
        )

    return caminhos, limitacoes, seguranca, aviso


@router.post("", response_model=ExplorarResposta)
@limiter.limit("10/minute")
async def explorar(request: Request, body: ExplorarRequest):
    log.info(
        "explorar_inicio",
        material=body.material,
        problema=body.problema[:60],
    )

    papers = await buscar_cientifico(
        material=body.material,
        problema=body.problema,
    )

    log.info(
        "explorar_papers",
        total=len(papers),
        com_abstract=sum(1 for p in papers if p.abstract and len(p.abstract) > 80),
    )

    if not papers:
        return ExplorarResposta(
            material=body.material,
            problema=body.problema,
            total_papers_encontrados=0,
            total_evidencias=0,
            evidencias=[],
            caminhos_possiveis=[],
            limitacoes_gerais=["Nenhum paper relevante encontrado."],
            seguranca=["Consulte um especialista antes de agir."],
            aviso="Busca sem resultados. Ajuste os termos.",
        )

    extracao = await extrair_e_cachear(
        papers, body.material, body.problema, max_papers=8
    )

    log.info(
        "explorar_extracao",
        evidencias=len(extracao.evidencias),
        sem_abstract=extracao.sem_abstract,
        nao_aplicaveis=extracao.nao_aplicaveis,
        erros=extracao.erros,
    )

    # Gera caminhos
    if extracao.evidencias:
        evidencias_texto = "\n\n".join([
            f"[{i+1}] {e.claim}\n"
            f"    Fonte: {e.source}\n"
            f"    DOI: {e.doi or 's/ DOI'}\n"
            f"    Nivel: {e.nivel}\n"
            f"    Limitacoes: {e.limitacoes}"
            for i, e in enumerate(extracao.evidencias)
        ])

        contexto = f"""MATERIAL: {body.material}
PROBLEMA: {body.problema}

EVIDENCIAS:
{evidencias_texto}
"""

        try:
            # Nao usa Ollama nos caminhos (JSON rigoroso)
            mensagens = [
                {"role": "system", "content": PROMPT_CAMINHOS},
                {"role": "user", "content": contexto},
            ]
            resposta = None
            for fn in [groq_completar, gemini_completar]:
                try:
                    resposta = await fn(mensagens, temperatura=0.2, max_tokens=1500)
                    break
                except Exception:
                    continue

            if not resposta:
                raise ProvedorIndisponivel("groq+gemini falharam")
            dados = _extrair_json(resposta.texto)
            if dados:
                caminhos = dados.get("caminhos", [])
                limitacoes = dados.get("limitacoes", [])
                seguranca = dados.get("seguranca", [])
                aviso = dados.get("aviso", "")
            else:
                log.warning(
                    "caminhos_json_invalido",
                    trecho=resposta.texto[:200],
                )
                caminhos, limitacoes, seguranca, aviso = _fallback_caminhos(
                    extracao
                )
        except ProvedorIndisponivel:
            caminhos, limitacoes, seguranca, aviso = _fallback_caminhos(
                extracao
            )
    else:
        caminhos, limitacoes, seguranca, aviso = _fallback_caminhos(extracao)

    return ExplorarResposta(
        material=body.material,
        problema=body.problema,
        total_papers_encontrados=len(papers),
        total_evidencias=len(extracao.evidencias),
        evidencias=[
            EvidenciaOut(
                claim=e.claim,
                source=e.source,
                doi=e.doi,
                url=e.url,
                trecho=e.trecho,
                tipo=e.tipo,
                limitacoes=e.limitacoes,
                aplicabilidade=e.aplicabilidade,
                nivel=e.nivel,
                forca=e.forca,
            )
            for e in extracao.evidencias
        ],
        caminhos_possiveis=caminhos,
        limitacoes_gerais=limitacoes,
        seguranca=seguranca,
        aviso=aviso,
    )
