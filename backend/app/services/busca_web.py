"""Busca web via Tavily (otimizada para LLM)."""

from dataclasses import dataclass

import httpx
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)


DOMINIOS_CONFIAVEIS = [
    "gov.br",
    "inpe.br",
    "oeco.org.br",
    "mongabay.com",
    "infoamazonia.org",
    "agenciabrasil.ebc.com.br",
    "fiocruz.br",
    "socioambiental.org",
    "ipam.org.br",
]


@dataclass
class ResultadoWeb:
    titulo: str
    url: str
    conteudo: str
    score: float


@retry(
    stop=stop_after_attempt(2),
    wait=wait_exponential(multiplier=1, min=1, max=5),
    retry=retry_if_exception_type(httpx.HTTPError),
    reraise=True,
)
async def buscar_web(
    consulta: str,
    max_resultados: int = 5,
    incluir_dominios: list[str] | None = None,
    search_depth: str = "advanced",
) -> list[ResultadoWeb]:
    """Busca web via Tavily."""
    if not settings.tavily_api_key:
        log.warning("tavily_nao_configurada")
        return []

    url = "https://api.tavily.com/search"
    payload = {
        "api_key": settings.tavily_api_key,
        "query": consulta,
        "search_depth": search_depth,
        "max_results": max_resultados,
        "include_answer": False,
        "include_raw_content": False,
    }
    if incluir_dominios:
        payload["include_domains"] = incluir_dominios

    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(url, json=payload)
        if r.status_code != 200:
            log.warning(
                "tavily_erro",
                status=r.status_code,
                body=r.text[:200],
            )
            return []
        data = r.json()

    return [
        ResultadoWeb(
            titulo=item.get("title", ""),
            url=item.get("url", ""),
            conteudo=item.get("content", ""),
            score=item.get("score", 0.0),
        )
        for item in data.get("results", [])
    ]


async def buscar_noticias_locais(
    municipio: str,
    uf: str,
    max_resultados: int = 5,
) -> list[ResultadoWeb]:
    """Busca noticias ambientais locais."""
    consulta = (
        f"contaminacao ambiental agua solo {municipio} {uf} "
        f"noticia 2026"
    )
    return await buscar_web(
        consulta,
        max_resultados=max_resultados,
        incluir_dominios=DOMINIOS_CONFIAVEIS,
    )


async def buscar_contexto_ambiental(
    problema: str,
    uf: str | None = None,
    max_resultados: int = 5,
) -> list[ResultadoWeb]:
    """Busca contexto ambiental amplo."""
    consulta = problema
    if uf:
        consulta = f"{problema} {uf} Brasil"
    return await buscar_web(
        consulta,
        max_resultados=max_resultados,
        incluir_dominios=DOMINIOS_CONFIAVEIS,
    )
