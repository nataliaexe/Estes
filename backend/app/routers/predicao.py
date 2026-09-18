from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.schemas.predicao import PrevisaoOut, RiscoOut
from app.services.predicao import prever_risco

router = APIRouter(prefix="/predicao", tags=["predicao"])


@router.get("", response_model=PrevisaoOut)
async def predicao(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    uf: str | None = Query(None, max_length=2),
    session: AsyncSession = Depends(get_session),
):
    p = await prever_risco(session, lat, lon, uf)
    return PrevisaoOut(
        latitude=p.latitude,
        longitude=p.longitude,
        uf=p.uf,
        riscos=[
            RiscoOut(
                tipo=r.tipo,
                nivel=r.nivel,
                score=r.score,
                razoes=r.razoes,
                recomendacao=r.recomendacao,
            )
            for r in p.riscos
        ],
        risco_geral=p.risco_geral,
        gerado_em=p.gerado_em,
    )
