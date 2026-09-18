from pydantic import BaseModel, Field


class ExplorarRequest(BaseModel):
    material: str = Field(..., min_length=2, max_length=200)
    problema: str = Field(..., min_length=5, max_length=500)
    uf: str | None = Field(None, max_length=2)
    contexto_extra: str | None = Field(None, max_length=1000)


class EvidenciaOut(BaseModel):
    claim: str
    source: str
    doi: str | None
    url: str | None
    trecho: str
    tipo: str
    limitacoes: str
    aplicabilidade: str
    nivel: str
    forca: float


class ExplorarResposta(BaseModel):
    material: str
    problema: str
    total_papers_encontrados: int
    total_evidencias: int
    evidencias: list[EvidenciaOut]
    caminhos_possiveis: list[str]
    limitacoes_gerais: list[str]
    seguranca: list[str]
    aviso: str
