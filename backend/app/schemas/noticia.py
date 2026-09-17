from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class NoticiaOut(BaseModel):
    id: UUID
    titulo: str
    resumo: str | None
    url: str
    fonte: str
    categoria: str
    severidade: str
    uf: str | None
    municipio: str | None
    publicada_em: datetime | None
    coletada_em: datetime

    model_config = {"from_attributes": True}


class FeedRequest(BaseModel):
    uf: str = Field(..., max_length=2)
    municipio: str | None = None
    limite: int = Field(10, ge=1, le=50)
    forcar_coleta: bool = False
