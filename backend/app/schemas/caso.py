from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CasoResumo(BaseModel):
    id: UUID
    numero: int
    titulo: str
    uf: str
    categoria: str
    tipo_solucao: str
    precisa_hardware: bool
    problema: str
    recurso_local: str
    solucao: str
    evidencia: str

    model_config = {"from_attributes": True}


class CasoDetalhe(CasoResumo):
    historia: str
    fontes_historicas: list[dict]
    impacto_estimado: dict
    composicao: dict
    propriedades: dict
    aplicacoes: dict
    lacunas: list
    referencias: list
    nivel_1_pronto: dict
    nivel_2_simples: dict
    nivel_3_completo: dict
    criado_em: datetime
    atualizado_em: datetime


class CasoBusca(BaseModel):
    consulta: str = Field(..., min_length=3, max_length=500)
    limite: int = Field(5, ge=1, le=20)
    categoria: str | None = None
    uf: str | None = None


class CasoBuscaResultado(BaseModel):
    caso: CasoResumo
    similaridade: float
