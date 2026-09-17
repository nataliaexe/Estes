from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UsuarioCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    senha: str = Field(..., min_length=8, max_length=128)
    perfil: str = Field("cidadao", max_length=40)
    telefone: str | None = None
    uf: str | None = Field(None, max_length=2)
    municipio: str | None = Field(None, max_length=120)


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str


class UsuarioOut(BaseModel):
    id: UUID
    nome: str
    email: EmailStr
    perfil: str
    uf: str | None
    municipio: str | None
    ativo: bool
    criado_em: datetime

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    usuario: UsuarioOut
