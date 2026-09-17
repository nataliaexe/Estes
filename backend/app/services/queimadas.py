"""Focos de queimada via NASA FIRMS (requer FIRMS_API_KEY)."""

from dataclasses import dataclass
from datetime import UTC, datetime

import httpx

from app.core.cache import cache_get, cache_set
from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

CACHE_TTL = 3600
URL_FIRMS = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"


@dataclass
class FocoQueimada:
    latitude: float
    longitude: float
    data: str
    hora: str
    satelite: str
    confianca: str
    frp: float


async def obter_focos(
    lat: float,
    lon: float,
    raio_km: float = 100,
    dias: int = 1,
) -> list[FocoQueimada]:
    api_key = getattr(settings, "firms_api_key", "")
    if not api_key:
        log.info("firms_nao_configurado")
        return []

    chave = f"queimadas:{lat:.2f}:{lon:.2f}:{raio_km}:{dias}"
    cached = await cache_get(chave)
    if cached:
        return [FocoQueimada(**f) for f in cached]

    delta_lat = raio_km / 111.0
    cos_lat = max(abs(lat) * 0.0175, 0.01)
    delta_lon = raio_km / (111.0 * cos_lat)

    oeste = lon - delta_lon
    leste = lon + delta_lon
    norte = lat + delta_lat
    sul = lat - delta_lat

    area = f"{oeste:.4f},{sul:.4f},{leste:.4f},{norte:.4f}"
    data = datetime.now(UTC).strftime("%Y-%m-%d")
    url = f"{URL_FIRMS}/{api_key}/VIIRS_SNPP_NRT/{area}/{dias}/{data}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.get(url)
            if r.status_code != 200:
                log.warning("firms_erro", status=r.status_code)
                return []
            texto = r.text
    except httpx.HTTPError as e:
        log.warning("firms_rede", erro=str(e)[:100])
        return []

    focos = _parse_csv(texto)
    await cache_set(chave, [f.__dict__ for f in focos], ttl=CACHE_TTL)
    return focos


def _parse_csv(texto: str) -> list[FocoQueimada]:
    linhas = texto.strip().split("\n")
    if len(linhas) < 2:
        return []

    cabecalho = linhas[0].split(",")
    idx = {nome: i for i, nome in enumerate(cabecalho)}

    def _pegar(partes, nome, default=""):
        i = idx.get(nome)
        if i is None or i >= len(partes):
            return default
        return partes[i]

    focos = []
    for linha in linhas[1:]:
        partes = linha.split(",")
        if len(partes) < 2:
            continue
        try:
            frp_str = _pegar(partes, "frp", "0")
            frp = float(frp_str) if frp_str else 0.0
            focos.append(
                FocoQueimada(
                    latitude=float(_pegar(partes, "latitude", "0")),
                    longitude=float(_pegar(partes, "longitude", "0")),
                    data=_pegar(partes, "acq_date"),
                    hora=_pegar(partes, "acq_time"),
                    satelite=_pegar(partes, "satellite"),
                    confianca=_pegar(partes, "confidence", "n"),
                    frp=frp,
                )
            )
        except (ValueError, IndexError):
            continue

    return focos
