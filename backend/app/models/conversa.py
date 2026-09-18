"""Conversas persistidas e biblioteca do usuario."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Conversa(Base):
    """Conversa do usuario com o assistente."""

    __tablename__ = "conversas"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    usuario_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=True, index=True
    )
    session_id: Mapped[str] = mapped_column(String(64), index=True)

    titulo: Mapped[str] = mapped_column(String(300), default="Nova conversa")
    mensagens: Mapped[list] = mapped_column(JSONB, default=list)
    # [{role, content, fontes, timestamp}]

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ItemBiblioteca(Base):
    """Item salvo na biblioteca do usuario."""

    __tablename__ = "biblioteca"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    usuario_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), index=True
    )

    tipo: Mapped[str] = mapped_column(String(40))
    # caso, contribuicao, paper, conversa, receita

    referencia_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    titulo: Mapped[str] = mapped_column(String(300))
    resumo: Mapped[str | None] = mapped_column(Text, nullable=True)
    metadados: Mapped[dict] = mapped_column(JSONB, default=dict)

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
