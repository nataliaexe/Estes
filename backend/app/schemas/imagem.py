from pydantic import BaseModel


class UploadOut(BaseModel):
    url: str
    nome: str
    tamanho: int


class AnaliseImagemOut(BaseModel):
    r: float
    g: float
    b: float
    intensidade: float
    classificacao: str
    confianca: float
    recomendacao: str
