from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Float, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Noticia(Base):
    __tablename__ = "noticias"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )

    titulo: Mapped[str] = mapped_column(String(500))
    resumo: Mapped[str | None] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String(1000), unique=True)
    fonte: Mapped[str] = mapped_column(String(120))
    categoria: Mapped[str] = mapped_column(String(60))
    severidade: Mapped[str] = mapped_column(String(20), default="info")

    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    uf: Mapped[str | None] = mapped_column(String(2), index=True, nullable=True)
    municipio: Mapped[str | None] = mapped_column(String(120), nullable=True)

    metadados: Mapped[dict] = mapped_column(JSONB, default=dict)
    publicada_em: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    coletada_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
