from fastapi import APIRouter, HTTPException, Query

from app.schemas.clima import ClimaOut
from app.services.clima import obter_clima

router = APIRouter(prefix="/clima", tags=["clima"])


@router.get("", response_model=ClimaOut)
async def clima_atual(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
):
    clima = await obter_clima(lat, lon)
    if not clima:
        raise HTTPException(503, "Servico de clima indisponivel")
    return clima
