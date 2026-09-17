from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.logging import get_logger
from app.models.noticia import Noticia
from app.schemas.noticia import FeedRequest, NoticiaOut
from app.services.noticias import coletar_noticias_por_regiao, salvar_noticias

log = get_logger(__name__)
router = APIRouter(prefix="/noticias", tags=["noticias"])

CACHE_HORAS = 6


@router.post("/feed", response_model=list[NoticiaOut])
async def feed_local(
    body: FeedRequest,
    session: AsyncSession = Depends(get_session),
):
    """Feed de noticias localizado. Coleta se cache expirado."""
    # Verifica se tem noticia recente
    limite_cache = datetime.now(UTC) - timedelta(hours=CACHE_HORAS)

    existentes = await session.execute(
        select(Noticia)
        .where(Noticia.uf == body.uf)
        .where(Noticia.coletada_em >= limite_cache)
        .order_by(Noticia.coletada_em.desc())
        .limit(body.limite)
    )
    noticias = existentes.scalars().all()

    precisa_coletar = body.forcar_coleta or len(noticias) < body.limite

    if precisa_coletar:
        log.info("coletando_noticias", uf=body.uf, municipio=body.municipio)
        try:
            coletadas = await coletar_noticias_por_regiao(
                session,
                uf=body.uf,
                municipio=body.municipio,
                max_resultados=body.limite,
            )
            salvas = await salvar_noticias(session, coletadas)
            log.info("noticias_salvas", total=salvas)

            # Recarrega
            existentes = await session.execute(
                select(Noticia)
                .where(Noticia.uf == body.uf)
                .order_by(Noticia.coletada_em.desc())
                .limit(body.limite)
            )
            noticias = existentes.scalars().all()
        except Exception as e:
            log.warning("coleta_falhou", erro=str(e)[:200])

    return noticias


@router.get("", response_model=list[NoticiaOut])
async def listar_noticias(
    uf: str | None = None,
    categoria: str | None = None,
    severidade: str | None = None,
    limite: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    stmt = (
        select(Noticia)
        .order_by(Noticia.coletada_em.desc())
        .limit(limite)
    )
    if uf:
        stmt = stmt.where(Noticia.uf == uf)
    if categoria:
        stmt = stmt.where(Noticia.categoria == categoria)
    if severidade:
        stmt = stmt.where(Noticia.severidade == severidade)

    result = await session.execute(stmt)
    return result.scalars().all()
