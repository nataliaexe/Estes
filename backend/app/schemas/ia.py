from pydantic import BaseModel, Field


class MensagemHistorico(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=5000)


class PerguntaIA(BaseModel):
    pergunta: str = Field(..., min_length=1, max_length=2000)
    historico: list[MensagemHistorico] = Field(default_factory=list)
    uf: str | None = Field(None, max_length=2)
    municipio: str | None = Field(None, max_length=120)
    latitude: float | None = None
    longitude: float | None = None


class FonteIA(BaseModel):
    tipo: str
    titulo: str
    url: str | None = None
    score: float | None = None
    metadata: dict | None = None


class RespostaIAOut(BaseModel):
    texto: str
    provedor: str
    modelo: str
    intencao: str
    fontes: list[FonteIA]
    ferramentas_usadas: list[str]
    sugestoes: list[str]
    usou_motor_cientifico: bool = False


class StatusIA(BaseModel):
    groq: bool
    gemini: bool
    ollama: bool
    tavily: bool
    ollama_model: str
    embedding_model: str
