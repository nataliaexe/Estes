from pydantic import BaseModel


class RiscoOut(BaseModel):
    tipo: str
    nivel: str
    score: float
    razoes: list[str]
    recomendacao: str


class PrevisaoOut(BaseModel):
    latitude: float
    longitude: float
    uf: str | None
    riscos: list[RiscoOut]
    risco_geral: str
    gerado_em: str
