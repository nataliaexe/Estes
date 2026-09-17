from fastapi import APIRouter, Query

from app.schemas.queimadas import FocoOut, FocosResposta
from app.services.queimadas import obter_focos

router = APIRouter(prefix="/queimadas", tags=["queimadas"])


@router.get("", response_model=FocosResposta)
async def focos_proximos(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    raio_km: float = Query(100, ge=1, le=500),
    dias: int = Query(1, ge=1, le=10),
):
    focos = await obter_focos(lat, lon, raio_km=raio_km, dias=dias)

    aviso = None
    if not focos:
        aviso = (
            "Nenhum foco detectado nas ultimas 24h no raio informado. "
            "Se a chave FIRMS nao estiver configurada, retorna vazio."
        )

    return FocosResposta(
        total=len(focos),
        latitude=lat,
        longitude=lon,
        raio_km=raio_km,
        focos=[FocoOut(**f.__dict__) for f in focos],
        aviso=aviso,
    )
