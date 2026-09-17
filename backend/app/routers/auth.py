from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.logging import get_logger
from app.core.security import criar_token, hash_senha, verificar_senha
from app.models.usuario import Usuario
from app.schemas.usuario import (
    TokenOut,
    UsuarioCreate,
    UsuarioLogin,
    UsuarioOut,
)

log = get_logger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/registrar", response_model=TokenOut, status_code=201)
async def registrar(
    body: UsuarioCreate,
    session: AsyncSession = Depends(get_session),
):
    existente = await session.execute(
        select(Usuario).where(Usuario.email == body.email)
    )
    if existente.scalar_one_or_none():
        raise HTTPException(400, "Email ja cadastrado")

    usuario = Usuario(
        nome=body.nome,
        email=body.email,
        senha_hash=hash_senha(body.senha),
        perfil=body.perfil,
        telefone=body.telefone,
        uf=body.uf,
        municipio=body.municipio,
    )
    session.add(usuario)
    await session.flush()

    token, expires = criar_token(str(usuario.id))
    log.info("usuario_registrado", email=body.email, perfil=body.perfil)

    return TokenOut(
        access_token=token,
        expires_in=expires,
        usuario=UsuarioOut.model_validate(usuario),
    )


@router.post("/login", response_model=TokenOut)
async def login(
    body: UsuarioLogin,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Usuario).where(Usuario.email == body.email)
    )
    usuario = result.scalar_one_or_none()

    if not usuario or not verificar_senha(body.senha, usuario.senha_hash):
        raise HTTPException(401, "Credenciais invalidas")

    if not usuario.ativo:
        raise HTTPException(403, "Usuario inativo")

    token, expires = criar_token(str(usuario.id))
    return TokenOut(
        access_token=token,
        expires_in=expires,
        usuario=UsuarioOut.model_validate(usuario),
    )
