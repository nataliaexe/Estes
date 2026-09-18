"""Busca cientifica em multiplas fontes.

Fontes:
- Semantic Scholar (250M papers, sem chave)
- Crossref (DOI + metadados, sem chave)
- OpenAlex (250M trabalhos, sem chave)
- Tavily (web academico: scielo, .edu, gov.br)

Todas retornam dados estruturados com DOI/URL.
"""

import asyncio
from dataclasses import dataclass, field

import httpx

from app.core.cache import cache_get, cache_set
from app.core.config import settings
from app.core.logging import get_logger
from app.services.busca_web import buscar_web

log = get_logger(__name__)

CACHE_TTL = 86400  # 24h


@dataclass
class Paper:
    titulo: str
    autores: list[str] = field(default_factory=list)
    ano: int | None = None
    doi: str | None = None
    url: str | None = None
    abstract: str = ""
    fonte: str = ""  # semantic_scholar, crossref, openalex, tavily
    journal: str | None = None
    tipo: str | None = None  # review, article, pre-print
    citacoes: int = 0


# ============================================================
# SEMANTIC SCHOLAR
# ============================================================
async def buscar_semantic_scholar(
    consulta: str, limite: int = 10
) -> list[Paper]:
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": consulta,
        "limit": limite,
        "fields": "title,abstract,year,doi,url,authors,venue,citationCount,publicationTypes",
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as c:
            r = await c.get(url, params=params)
            if r.status_code != 200:
                log.warning("semantic_scholar_erro", status=r.status_code)
                return []
            data = r.json()
    except httpx.HTTPError as e:
        log.warning("semantic_scholar_rede", erro=str(e)[:100])
        return []

    papers = []
    for item in data.get("data", []):
        papers.append(Paper(
            titulo=item.get("title", ""),
            autores=[a.get("name", "") for a in item.get("authors", [])],
            ano=item.get("year"),
            doi=item.get("doi"),
            url=item.get("url"),
            abstract=item.get("abstract", "") or "",
            fonte="semantic_scholar",
            journal=item.get("venue"),
            tipo=",".join(item.get("publicationTypes", []) or []),
            citacoes=item.get("citationCount", 0),
        ))
    return papers


# ============================================================
# CROSSREF
# ============================================================
async def buscar_crossref(consulta: str, limite: int = 10) -> list[Paper]:
    url = "https://api.crossref.org/works"
    params = {
        "query": consulta,
        "rows": limite,
        "select": "title,author,issued,DOI,URL,abstract,type,container-title,is-referenced-by-count",
        "mailto": "estes@example.org",
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as c:
            r = await c.get(url, params=params)
            if r.status_code != 200:
                return []
            data = r.json()
    except httpx.HTTPError:
        return []

    papers = []
    for item in data.get("message", {}).get("items", []):
        titulo = item.get("title", [""])
        titulo = titulo[0] if titulo else ""

        autores_raw = item.get("author", [])
        autores = [
            f"{a.get('given', '')} {a.get('family', '')}".strip()
            for a in autores_raw
        ]

        ano = None
        issued = item.get("issued", {}).get("date-parts", [[]])
        if issued and issued[0]:
            ano = issued[0][0]

        journal = item.get("container-title", [""])
        journal = journal[0] if journal else None

        papers.append(Paper(
            titulo=titulo,
            autores=autores,
            ano=ano,
            doi=item.get("DOI"),
            url=item.get("URL"),
            abstract=item.get("abstract", "") or "",
            fonte="crossref",
            journal=journal,
            tipo=item.get("type"),
            citacoes=item.get("is-referenced-by-count", 0),
        ))
    return papers


# ============================================================
# OPENALEX
# ============================================================
async def buscar_openalex(consulta: str, limite: int = 10) -> list[Paper]:
    url = "https://api.openalex.org/works"
    params = {
        "search": consulta,
        "per-page": limite,
        "mailto": "estes@example.org",
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as c:
            r = await c.get(url, params=params)
            if r.status_code != 200:
                return []
            data = r.json()
    except httpx.HTTPError:
        return []

    papers = []
    for item in data.get("results", []):
        doi = item.get("doi", "")
        if doi and doi.startswith("https://doi.org/"):
            doi = doi.replace("https://doi.org/", "")

        autores = [
            a.get("author", {}).get("display_name", "")
            for a in item.get("authorships", [])[:10]
        ]

        titulo = item.get("title", "") or ""
        abstract_inv = item.get("abstract_inverted_index")
        abstract = _reconstruir_abstract(abstract_inv) if abstract_inv else ""

        papers.append(Paper(
            titulo=titulo,
            autores=autores,
            ano=item.get("publication_year"),
            doi=doi or None,
            url=item.get("id"),
            abstract=abstract,
            fonte="openalex",
            journal=(item.get("primary_location", {}) or {}).get(
                "source", {}
            ).get("display_name"),
            tipo=item.get("type"),
            citacoes=item.get("cited_by_count", 0),
        ))
    return papers


def _reconstruir_abstract(inverted: dict) -> str:
    """OpenAlex retorna abstract como indice invertido."""
    if not inverted:
        return ""
    max_pos = max(
        (pos for positions in inverted.values() for pos in positions),
        default=0,
    )
    palavras = [""] * (max_pos + 1)
    for palavra, posicoes in inverted.items():
        for pos in posicoes:
            if pos <= max_pos:
                palavras[pos] = palavra
    return " ".join(p for p in palavras if p)


# ============================================================
# TAVILY ACADEMICO
# ============================================================
DOMINIOS_ACADEMICOS = [
    "scielo.br",
    "scielo.org",
    "arxiv.org",
    "nature.com",
    "springer.com",
    "sciencedirect.com",
    "mdpi.com",
    "ncbi.nlm.nih.gov",
    "pubmed.ncbi.nlm.nih.gov",
    "researchgate.net",
    "academia.edu",
    "usp.br",
    "unicamp.br",
    "ufrj.br",
    "ufmg.br",
    "embrapa.br",
    "fiocruz.br",
    "inpe.br",
]


async def buscar_tavily_academico(
    consulta: str, limite: int = 5
) -> list[Paper]:
    try:
        resultados = await buscar_web(
            consulta, max_resultados=limite, incluir_dominios=DOMINIOS_ACADEMICOS
        )
    except Exception as e:
        log.warning("tavily_academico_falhou", erro=str(e)[:100])
        return []

    papers = []
    for r in resultados:
        papers.append(Paper(
            titulo=r.titulo,
            url=r.url,
            abstract=r.conteudo[:1500] if r.conteudo else "",
            fonte="tavily_academico",
            tipo="web",
        ))
    return papers


# ============================================================
# BUSCA UNIFICADA
# ============================================================
async def buscar_cientifico(
    material: str,
    problema: str,
    mecanismo: str = "",
) -> list[Paper]:
    """Busca em todas as fontes em paralelo e deduplica por DOI/URL."""
    termo_principal = f"{material} {problema}"
    if mecanismo:
        termo_principal += f" {mecanismo}"

    termo_en = f"{material} {problema} adsorption remediation"

    chave = f"ciencia:{termo_principal}"
    cached = await cache_get(chave)
    if cached:
        log.info("ciencia_cache_hit", material=material)
        return [Paper(**p) for p in cached]

    log.info("ciencia_busca_inicio", material=material, problema=problema)

    resultados = await asyncio.gather(
        buscar_semantic_scholar(termo_en, limite=8),
        buscar_crossref(termo_en, limite=8),
        buscar_openalex(termo_en, limite=8),
        buscar_tavily_academico(termo_principal, limite=5),
        return_exceptions=True,
    )

    # Junta tudo
    todos: list[Paper] = []
    for r in resultados:
        if isinstance(r, list):
            todos.extend(r)

    # Deduplica por DOI (fallback: titulo normalizado)
    vistos = set()
    unicos: list[Paper] = []
    for p in todos:
        if p.doi:
            chave_dedup = p.doi.lower()
        elif p.url:
            chave_dedup = p.url.lower()
        else:
            chave_dedup = p.titulo.lower().strip()[:80]

        if chave_dedup in vistos:
            continue
        vistos.add(chave_dedup)
        unicos.append(p)

    # Ordena por citacoes + relevancia
    unicos.sort(key=lambda p: p.citacoes, reverse=True)
    unicos = unicos[:20]

    log.info("ciencia_busca_fim", total=len(unicos))

    # Cache
    await cache_set(
        chave,
        [p.__dict__ for p in unicos],
        ttl=CACHE_TTL,
    )

    return unicos
