from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Evidencia(Base):
    __tablename__ = "evidencias"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    caso_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("casos.id"), index=True
    )

    afirmacao: Mapped[str] = mapped_column(Text, nullable=False)
    nivel: Mapped[str] = mapped_column(String(20))

    fonte: Mapped[str | None] = mapped_column(String(500), nullable=True)
    doi: Mapped[str | None] = mapped_column(String(120), nullable=True)
    metadados: Mapped[dict] = mapped_column(JSONB, default=dict)

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
