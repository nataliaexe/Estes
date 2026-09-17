from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    nome: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    perfil: Mapped[str] = mapped_column(
        String(40), default="cidadao", nullable=False
    )
    telefone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    uf: Mapped[str | None] = mapped_column(String(2), nullable=True)
    municipio: Mapped[str | None] = mapped_column(String(120), nullable=True)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Usuario {self.email} ({self.perfil})>"
