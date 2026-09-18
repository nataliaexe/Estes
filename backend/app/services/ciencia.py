"""Busca cientifica com cache em banco + cache de evidencias."""

import asyncio
from dataclasses import dataclass, field

import httpx
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cache_get, cache_set
from app.core.database import SessionLocal
from app.core.logging import get_logger
from app.models.paper import Paper as PaperModel
from app.services.busca_web import buscar_web
from app.services.embeddings import gerar_embedding

log = get_logger(__name__)
CACHE_TTL = 86400


@dataclass
class Paper:
    titulo: str
    autores: list[str] = field(default_factory=list)
    ano: int | None = None
    doi: str | None = None
    url: str | None = None
    abstract: str = ""
    fonte: str = ""
    journal: str | None = None
    tipo: str | None = None
    citacoes: int = 0
    # Evidencia ja extraida (opcional - vem do cache)
    evidence: dict | None = None
    paper_id: str | None = None


async def buscar_no_cache(consulta: str, limite: int = 15) -> list[Paper]:
    """Busca papers no cache por 2 vias:
    1. Match exato/parcial em primeira_busca (garante cache-hit real)
    2. Similaridade semantica (fallback, com threshold alto)
    """
    async with SessionLocal() as session:
        # === 1. MATCH DIRETO EM primeira_busca ===
        # Pega os termos individuais (>= 4 chars)
        termos = [t.strip() for t in consulta.lower().split() if len(t.strip()) >= 4]

        if termos:
            # Papers que tem TODOS os termos no campo primeira_busca
            from sqlalchemy import and_
            condicoes = [PaperModel.primeira_busca.ilike(f"%{t}%") for t in termos[:3]]
            stmt_direto = (
                select(PaperModel)
                .where(and_(*condicoes))
                .where(PaperModel.evidence != {})
                .order_by(PaperModel.vezes_usado.desc())
                .limit(limite)
            )
            r = await session.execute(stmt_direto)
            diretos = r.scalars().all()
            log.info("cache_match_direto", total=len(diretos), termos=termos[:3])
        else:
            diretos = []

        # Se ja achou >= 5 com evidencia, retorna
        if len(diretos) >= 5:
            ids = [p.id for p in diretos]
            if ids:
                await session.execute(
                    update(PaperModel)
                    .where(PaperModel.id.in_(ids))
                    .values(vezes_usado=PaperModel.vezes_usado + 1)
                )
                await session.commit()

            return [
                Paper(
                    titulo=p.titulo,
                    autores=p.autores or [],
                    ano=p.ano,
                    doi=p.doi,
                    url=p.url,
                    abstract=p.abstract,
                    fonte=p.fonte + "_cache",
                    journal=p.journal,
                    tipo=p.tipo,
                    citacoes=p.citacoes or 0,
                    evidence=p.evidence or None,
                    paper_id=str(p.id),
                )
                for p in diretos
            ]

        # === 2. FALLBACK SEMANTICO ===
        try:
            embedding = await gerar_embedding(consulta)
        except Exception:
            return [
                Paper(
                    titulo=p.titulo, autores=p.autores or [], ano=p.ano,
                    doi=p.doi, url=p.url, abstract=p.abstract,
                    fonte=p.fonte + "_cache", journal=p.journal,
                    tipo=p.tipo, citacoes=p.citacoes or 0,
                    evidence=p.evidence or None, paper_id=str(p.id),
                )
                for p in diretos
            ]

        stmt = (
            select(PaperModel)
            .where(PaperModel.embedding.isnot(None))
            .order_by(PaperModel.embedding.cosine_distance(embedding))
            .limit(limite)
        )
        r = await session.execute(stmt)
        semanticos = r.scalars().all()

        # Dedup diretos + semanticos
        vistos = set()
        finais = []
        for p in diretos + semanticos:
            if p.id in vistos:
                continue
            vistos.add(p.id)
            finais.append(p)

        # Incrementa
        ids = [p.id for p in finais]
        if ids:
            await session.execute(
                update(PaperModel)
                .where(PaperModel.id.in_(ids))
                .values(vezes_usado=PaperModel.vezes_usado + 1)
            )
            await session.commit()

    papers = [
        Paper(
            titulo=p.titulo, autores=p.autores or [], ano=p.ano,
            doi=p.doi, url=p.url, abstract=p.abstract,
            fonte=p.fonte + "_cache", journal=p.journal,
            tipo=p.tipo, citacoes=p.citacoes or 0,
            evidence=p.evidence or None, paper_id=str(p.id),
        )
        for p in finais
    ]

    log.info(
        "cache_semantico",
        total=len(papers),
        diretos=len(diretos),
        semanticos=len(semanticos),
        com_evidencia=sum(1 for p in papers if p.evidence),
    )
    return papers


async def salvar_no_cache(papers: list[Paper], termo_busca: str) -> int:
    """Salva papers novos (com evidencia se disponivel)."""
    if not papers:
        return 0

    salvos = 0
    vistos_local = set()
    async with SessionLocal() as session:
        for p in papers:
            try:
                # Dedup na mesma chamada
                chave_local = (p.doi or p.titulo or p.url or "").lower()[:100]
                if chave_local in vistos_local:
                    continue
                vistos_local.add(chave_local)
                existe = None
                existe = None
                if p.doi:
                    r = await session.execute(
                        select(PaperModel).where(PaperModel.doi == p.doi).limit(1)
                    )
                    existe = r.scalars().first()
                elif p.titulo:
                    titulo_limpo = p.titulo[:500].strip()
                    if titulo_limpo:
                        r = await session.execute(
                            select(PaperModel)
                            .where(PaperModel.titulo == titulo_limpo)
                            .limit(1)
                        )
                        existe = r.scalars().first()

                if existe:
                    existe.vezes_usado += 1
                    # Atualiza evidencia se ainda nao tinha e agora tem
                    if p.evidence and not existe.evidence:
                        existe.evidence = p.evidence
                    continue

                texto = f"{p.titulo} {p.abstract[:500]}"
                try:
                    emb = await gerar_embedding(texto)
                except Exception:
                    emb = None

                novo = PaperModel(
                    titulo=p.titulo[:500],
                    autores=p.autores,
                    ano=p.ano,
                    doi=p.doi,
                    url=p.url,
                    abstract=p.abstract,
                    fonte=p.fonte,
                    journal=p.journal,
                    tipo=p.tipo,
                    citacoes=p.citacoes,
                    embedding=emb,
                    primeira_busca=termo_busca[:300],
                    evidence=p.evidence or {},
                )
                session.add(novo)
                salvos += 1
            except Exception as e:
                log.warning("paper_salvar_falhou", erro=str(e)[:100])
                continue

        await session.commit()

    log.info("papers_salvos", total=salvos)
    return salvos


async def atualizar_evidencia_paper(paper_id: str, evidence: dict) -> None:
    """Atualiza evidencia de um paper ja salvo."""
    if not paper_id:
        return
    try:
        from uuid import UUID
        async with SessionLocal() as session:
            await session.execute(
                update(PaperModel)
                .where(PaperModel.id == UUID(paper_id))
                .values(evidence=evidence)
            )
            await session.commit()
    except Exception as e:
        log.warning("atualizar_evidencia_falhou", erro=str(e)[:100])


# ============================================================
# APIs EXTERNAS
# ============================================================
async def buscar_semantic_scholar(consulta: str, limite: int = 8) -> list[Paper]:
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {
        "query": consulta, "limit": limite,
        "fields": "title,abstract,year,doi,url,authors,venue,citationCount,publicationTypes",
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as c:
            r = await c.get(url, params=params)
            if r.status_code != 200:
                return []
            data = r.json()
    except httpx.HTTPError:
        return []

    return [
        Paper(
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
        )
        for item in data.get("data", [])
    ]


async def buscar_crossref(consulta: str, limite: int = 8) -> list[Paper]:
    url = "https://api.crossref.org/works"
    params = {
        "query": consulta, "rows": limite,
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
        autores = [f"{a.get('given', '')} {a.get('family', '')}".strip()
                   for a in item.get("author", [])]
        ano = None
        issued = item.get("issued", {}).get("date-parts", [[]])
        if issued and issued[0]:
            ano = issued[0][0]
        journal = item.get("container-title", [""])
        journal = journal[0] if journal else None
        papers.append(Paper(
            titulo=titulo, autores=autores, ano=ano,
            doi=item.get("DOI"), url=item.get("URL"),
            abstract=item.get("abstract", "") or "",
            fonte="crossref", journal=journal,
            tipo=item.get("type"),
            citacoes=item.get("is-referenced-by-count", 0),
        ))
    return papers


async def buscar_openalex(consulta: str, limite: int = 8) -> list[Paper]:
    url = "https://api.openalex.org/works"
    params = {"search": consulta, "per-page": limite, "mailto": "estes@example.org"}
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
        autores = [a.get("author", {}).get("display_name", "")
                   for a in item.get("authorships", [])[:10]]
        abstract_inv = item.get("abstract_inverted_index")
        abstract = _reconstruir_abstract(abstract_inv) if abstract_inv else ""
        papers.append(Paper(
            titulo=item.get("title", "") or "",
            autores=autores, ano=item.get("publication_year"),
            doi=doi or None, url=item.get("id"),
            abstract=abstract, fonte="openalex",
            journal=(item.get("primary_location", {}) or {}).get("source", {}).get("display_name"),
            tipo=item.get("type"),
            citacoes=item.get("cited_by_count", 0),
        ))
    return papers


def _reconstruir_abstract(inverted: dict) -> str:
    if not inverted:
        return ""
    max_pos = max((pos for positions in inverted.values() for pos in positions), default=0)
    palavras = [""] * (max_pos + 1)
    for palavra, posicoes in inverted.items():
        for pos in posicoes:
            if pos <= max_pos:
                palavras[pos] = palavra
    return " ".join(p for p in palavras if p)


DOMINIOS_ACADEMICOS = [
    "scielo.br", "scielo.org", "arxiv.org", "nature.com",
    "springer.com", "sciencedirect.com", "mdpi.com",
    "ncbi.nlm.nih.gov", "pubmed.ncbi.nlm.nih.gov",
    "researchgate.net", "academia.edu", "usp.br", "unicamp.br",
    "ufrj.br", "ufmg.br", "embrapa.br", "fiocruz.br", "inpe.br",
]


async def buscar_tavily_academico(consulta: str, limite: int = 5) -> list[Paper]:
    try:
        resultados = await buscar_web(
            consulta, max_resultados=limite, incluir_dominios=DOMINIOS_ACADEMICOS
        )
    except Exception:
        return []

    return [
        Paper(
            titulo=r.titulo, url=r.url,
            abstract=r.conteudo[:1500] if r.conteudo else "",
            fonte="tavily_academico", tipo="web",
        )
        for r in resultados
    ]


# ============================================================
# BUSCA UNIFICADA
# ============================================================
async def buscar_cientifico(
    material: str, problema: str, mecanismo: str = ""
) -> list[Paper]:
    """Cache -> APIs -> mescla."""
    consulta = f"{material} {problema}"

    # 1. Cache semantico
    cache_hits = await buscar_no_cache(consulta, limite=10)
    cache_com_evidencia = [p for p in cache_hits if p.evidence]
    log.info("cache_inicial", total=len(cache_hits), com_evidencia=len(cache_com_evidencia))

    # Se tem 5+ papers com evidencia ja extraida, retorna direto
    if len(cache_com_evidencia) >= 5:
        log.info("cache_completo_hit", total=len(cache_com_evidencia))
        return cache_com_evidencia

    # 2. Busca APIs
    termo_en = f"{material} {problema} adsorption remediation"
    log.info("ciencia_busca_inicio", material=material)

    resultados = await asyncio.gather(
        buscar_semantic_scholar(termo_en, limite=8),
        buscar_crossref(termo_en, limite=8),
        buscar_openalex(termo_en, limite=8),
        buscar_tavily_academico(consulta, limite=5),
        return_exceptions=True,
    )

    novos: list[Paper] = []
    for r in resultados:
        if isinstance(r, list):
            novos.extend(r)

    # Dedup
    vistos = set()
    unicos: list[Paper] = []
    for p in novos:
        chave = (p.doi or p.url or p.titulo).lower()[:100]
        if chave in vistos:
            continue
        vistos.add(chave)
        unicos.append(p)

    unicos.sort(key=lambda p: p.citacoes, reverse=True)
    unicos = unicos[:20]

    # 3. Mescla cache + novos (cache primeiro porque ja tem evidencia)
    finais: list[Paper] = []
    vistos_final = set()
    for p in cache_hits + unicos:
        chave = (p.doi or p.url or p.titulo).lower()[:100]
        if chave in vistos_final:
            continue
        vistos_final.add(chave)
        finais.append(p)

    # 4. Salva novos no cache
    await salvar_no_cache(unicos, consulta)

    log.info("ciencia_busca_fim", total=len(finais),
             cache_hits=len(cache_hits), novos=len(unicos))
    return finais
