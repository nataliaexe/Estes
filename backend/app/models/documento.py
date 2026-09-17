from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Documento(Base):
    __tablename__ = "documentos"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    usuario_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=True
    )
    medicao_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("medicoes.id"), nullable=True
    )

    tipo: Mapped[str] = mapped_column(String(40))
    titulo: Mapped[str] = mapped_column(String(200))
    conteudo: Mapped[str] = mapped_column(Text)
    orgao_destino: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="rascunho")

    metadados: Mapped[dict] = mapped_column(JSONB, default=dict)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
