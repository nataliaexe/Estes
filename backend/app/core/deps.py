from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import decodificar_token
from app.models.usuario import Usuario

bearer = HTTPBearer(auto_error=False)


async def usuario_atual(
    credenciais: HTTPAuthorizationCredentials | None = Depends(bearer),
    session: AsyncSession = Depends(get_session),
) -> Usuario:
    if not credenciais:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token nao fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decodificar_token(credenciais.credentials)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )

    if payload.get("tipo") != "usuario":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token nao e de usuario",
        )

    try:
        user_id = UUID(payload["sub"])
    except (KeyError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token mal formado",
        )

    result = await session.execute(
        select(Usuario).where(Usuario.id == user_id)
    )
    usuario = result.scalar_one_or_none()

    if not usuario or not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inativo ou nao encontrado",
        )

    return usuario


async def usuario_opcional(
    credenciais: HTTPAuthorizationCredentials | None = Depends(bearer),
    session: AsyncSession = Depends(get_session),
) -> Usuario | None:
    """Igual ao usuario_atual, mas nao obrigatorio."""
    if not credenciais:
        return None
    try:
        return await usuario_atual(credenciais, session)
    except HTTPException:
        return None


def verificar_dispositivo(token: str) -> str:
    """Valida token de dispositivo ESP32. Retorna device_id."""
    try:
        payload = decodificar_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token de dispositivo invalido: {e}",
        )
    if payload.get("tipo") != "dispositivo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Token nao e de dispositivo",
        )
    return payload["sub"]
