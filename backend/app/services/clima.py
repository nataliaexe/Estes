"""Clima em tempo real via Open-Meteo (sem chave de API)."""

from dataclasses import asdict, dataclass

import httpx

from app.core.cache import cache_get, cache_set
from app.core.logging import get_logger

log = get_logger(__name__)

CACHE_TTL = 1800
URL_FORECAST = "https://api.open-meteo.com/v1/forecast"
URL_AIR = "https://air-quality-api.open-meteo.com/v1/air-quality"


@dataclass
class Clima:
    latitude: float
    longitude: float
    temperatura_c: float
    umidade_pct: float
    vento_kmh: float
    precipitacao_mm: float
    uv_index: float
    condicao: str
    risco_queimada: str
    risco_enchente: str
    pm25: float | None
    pm10: float | None


async def obter_clima(lat: float, lon: float) -> Clima | None:
    chave = f"clima:{lat:.3f}:{lon:.3f}"
    cached = await cache_get(chave)
    if cached:
        return Clima(**cached)

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                URL_FORECAST,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": (
                        "temperature_2m,relative_humidity_2m,"
                        "wind_speed_10m,precipitation,weather_code"
                    ),
                    "daily": "precipitation_sum,uv_index_max",
                    "timezone": "America/Sao_Paulo",
                    "forecast_days": 3,
                },
            )
            r.raise_for_status()
            data = r.json()
    except httpx.HTTPError as e:
        log.warning("openmeteo_falhou", erro=str(e)[:100])
        return None

    current = data.get("current", {})
    daily = data.get("daily", {})

    temp = current.get("temperature_2m", 0) or 0
    umid = current.get("relative_humidity_2m", 0) or 0
    vento = current.get("wind_speed_10m", 0) or 0
    chuva = current.get("precipitation", 0) or 0
    codigo = current.get("weather_code", 0) or 0

    uv_list = daily.get("uv_index_max") or [0]
    uv = uv_list[0] if uv_list else 0
    chuva_prev = sum((daily.get("precipitation_sum") or [0])[:2])

    pm25 = pm10 = None
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                URL_AIR,
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": "pm2_5,pm10",
                    "timezone": "America/Sao_Paulo",
                },
            )
            if r.status_code == 200:
                ar = r.json().get("current", {})
                pm25 = ar.get("pm2_5")
                pm10 = ar.get("pm10")
    except httpx.HTTPError:
        pass

    clima = Clima(
        latitude=lat,
        longitude=lon,
        temperatura_c=temp,
        umidade_pct=umid,
        vento_kmh=vento,
        precipitacao_mm=chuva,
        uv_index=uv,
        condicao=_descricao_codigo(codigo),
        risco_queimada=_risco_queimada(temp, umid, vento, chuva_prev),
        risco_enchente=_risco_enchente(chuva_prev),
        pm25=pm25,
        pm10=pm10,
    )

    await cache_set(chave, asdict(clima), ttl=CACHE_TTL)
    return clima


def _descricao_codigo(codigo: int) -> str:
    mapa = {
        0: "ceu limpo",
        1: "predominantemente limpo",
        2: "parcialmente nublado",
        3: "nublado",
        45: "neblina",
        48: "neblina com geada",
        51: "chuvisco leve",
        53: "chuvisco moderado",
        55: "chuvisco denso",
        61: "chuva leve",
        63: "chuva moderada",
        65: "chuva forte",
        71: "neve leve",
        80: "pancadas de chuva",
        81: "pancadas moderadas",
        82: "pancadas violentas",
        95: "trovoada",
        96: "trovoada com granizo",
    }
    return mapa.get(codigo, "condicao desconhecida")


def _risco_queimada(temp: float, umid: float, vento: float, chuva: float) -> str:
    score = 0
    if temp > 30:
        score += 2
    elif temp > 25:
        score += 1
    if umid < 30:
        score += 2
    elif umid < 50:
        score += 1
    if vento > 30:
        score += 2
    elif vento > 20:
        score += 1
    if chuva > 5:
        score -= 2
    if score >= 4:
        return "alto"
    if score >= 2:
        return "medio"
    return "baixo"


def _risco_enchente(chuva_prevista: float) -> str:
    if chuva_prevista > 50:
        return "alto"
    if chuva_prevista > 20:
        return "medio"
    return "baixo"
