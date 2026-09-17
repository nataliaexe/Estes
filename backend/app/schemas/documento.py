from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class DocumentoCreate(BaseModel):
    tipo: str = Field(..., max_length=40)
    medicao_id: UUID | None = None
    titulo: str = Field(..., max_length=200)
    descricao: str = Field(..., min_length=20, max_length=5000)
    orgao_destino: str | None = None


class DocumentoOut(BaseModel):
    id: UUID
    tipo: str
    titulo: str
    conteudo: str
    orgao_destino: str | None
    status: str
    criado_em: datetime

    model_config = {"from_attributes": True}
