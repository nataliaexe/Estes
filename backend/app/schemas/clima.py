from pydantic import BaseModel


class ClimaOut(BaseModel):
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
    pm25: float | None = None
    pm10: float | None = None
