from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class MedicaoIn(BaseModel):
    device_id: str = Field(..., max_length=64)
    device_token: str = Field(..., max_length=128)
    razao_r: float = Field(..., ge=0)
    razao_g: float = Field(..., ge=0)
    razao_b: float = Field(..., ge=0)
    razao_c: float = Field(..., ge=0)
    latitude: float | None = None
    longitude: float | None = None
    metadados: dict = Field(default_factory=dict)


class MedicaoOut(BaseModel):
    id: UUID
    device_id: str
    resultado: str
    confianca: float
    recomendacao: str
    fontes: list[str]
    criado_em: datetime


class MedicaoResumo(BaseModel):
    id: UUID
    device_id: str
    razao_c: float
    resultado: str
    confianca: float
    latitude: float | None
    longitude: float | None
    criado_em: datetime

    model_config = {"from_attributes": True}
