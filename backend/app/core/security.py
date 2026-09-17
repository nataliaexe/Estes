from datetime import UTC, datetime, timedelta
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_senha(senha: str) -> str:
    return pwd_context.hash(senha)


def verificar_senha(senha: str, hash_: str) -> bool:
    return pwd_context.verify(senha, hash_)


def criar_token(
    subject: str,
    tipo: str = "usuario",
    expires_minutes: int | None = None,
) -> tuple[str, int]:
    """Cria token JWT. Retorna (token, expires_in_segundos)."""
    minutos = expires_minutes or settings.access_token_expire_minutes
    expira = datetime.now(UTC) + timedelta(minutes=minutos)

    payload = {
        "sub": subject,
        "tipo": tipo,
        "exp": expira,
        "iat": datetime.now(UTC),
    }

    token = jwt.encode(
        payload,
        settings.secret_key,
        algorithm=settings.algorithm,
    )
    return token, minutos * 60


def decodificar_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except JWTError as e:
        raise ValueError(f"Token invalido: {e}")


def criar_token_dispositivo(device_id: str) -> str:
    """Cria token para ESP32 (validade longa)."""
    token, _ = criar_token(
        subject=device_id,
        tipo="dispositivo",
        expires_minutes=60 * 24 * 365,  # 1 ano
    )
    return token
