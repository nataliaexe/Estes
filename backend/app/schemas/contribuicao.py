from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EvidenciaInput(BaseModel):
    tipo: str = Field(..., max_length=40)  # paper, noticia, relato, video
    titulo: str = Field(..., max_length=300)
    doi: str | None = None
    url: str | None = None
    trecho: str | None = None


class ContribuicaoCreate(BaseModel):
    tipo: str = Field(..., pattern="^(solucao|historia|observacao|correcao)$")
    titulo: str = Field(..., min_length=5, max_length=300)
    conteudo: str = Field(..., min_length=20, max_length=10000)
    evidencias: list[EvidenciaInput] = Field(default_factory=list)
    caso_numero: int | None = None  # numero do caso (nao UUID)
    uf: str | None = Field(None, max_length=2)
    municipio: str | None = Field(None, max_length=120)


class ContribuicaoUpdate(BaseModel):
    titulo: str | None = Field(None, min_length=5, max_length=300)
    conteudo: str | None = Field(None, min_length=20, max_length=10000)
    evidencias: list[EvidenciaInput] | None = None


class AutorResumo(BaseModel):
    id: UUID
    nome: str
    perfil: str
    uf: str | None

    model_config = {"from_attributes": True}


class ContribuicaoResumo(BaseModel):
    id: UUID
    tipo: str
    titulo: str
    conteudo: str
    status: str
    votos: int
    uf: str | None
    municipio: str | None
    caso_relacionado: UUID | None
    autor: AutorResumo
    criado_em: datetime

    model_config = {"from_attributes": True}


class ContribuicaoDetalhe(ContribuicaoResumo):
    evidencias: list[dict]
    validado_em: datetime | None
    motivo_validacao: str | None
    visualizacoes: int
    comentarios: list["ComentarioOut"] = Field(default_factory=list)


class VotoInput(BaseModel):
    valor: int = Field(..., ge=-1, le=1)


class VotoOut(BaseModel):
    votos_totais: int
    meu_voto: int


class ComentarioCreate(BaseModel):
    conteudo: str = Field(..., min_length=2, max_length=3000)


class ComentarioOut(BaseModel):
    id: UUID
    conteudo: str
    autor: AutorResumo
    criado_em: datetime

    model_config = {"from_attributes": True}


class ValidacaoInput(BaseModel):
    aprovado: bool
    motivo: str = Field(..., min_length=5, max_length=1000)


class ValidacaoOut(BaseModel):
    contribuicao_id: UUID
    status: str
    validado_em: datetime | None
    motivo: str


ContribuicaoDetalhe.model_rebuild()
