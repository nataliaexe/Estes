from pydantic import BaseModel


class FocoOut(BaseModel):
    latitude: float
    longitude: float
    data: str
    hora: str
    satelite: str
    confianca: str
    frp: float


class FocosResposta(BaseModel):
    total: int
    latitude: float
    longitude: float
    raio_km: float
    focos: list[FocoOut]
    aviso: str | None = None
