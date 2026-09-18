"""Cache de papers cientificos encontrados pelo motor cientifico."""

from datetime import datetime
from uuid import UUID, uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.config import settings
from app.core.database import Base


class Paper(Base):
    """Cache de paper cientifico.

    Guarda o paper bruto + evidencias extraidas.
    Evita bater nas APIs externas toda vez.
    """

    __tablename__ = "papers"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )

    # Identificacao unica
    doi: Mapped[str | None] = mapped_column(
        String(200), unique=True, index=True, nullable=True
    )
    url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    titulo: Mapped[str] = mapped_column(String(500), index=True)

    # Metadados
    autores: Mapped[list] = mapped_column(JSONB, default=list)
    ano: Mapped[int | None] = mapped_column(Integer, nullable=True)
    journal: Mapped[str | None] = mapped_column(String(300), nullable=True)
    tipo: Mapped[str | None] = mapped_column(String(60), nullable=True)
    citacoes: Mapped[int] = mapped_column(Integer, default=0)

    # Conteudo
    abstract: Mapped[str] = mapped_column(Text, default="")
    fonte: Mapped[str] = mapped_column(String(60))
    # semantic_scholar, crossref, openalex, tavily_academico

    # Evidencia extraida
    evidence: Mapped[dict] = mapped_column(JSONB, default=dict)
    # {aplicavel: bool, claim: str, trecho: str, tipo: str,
    #  limitacoes: str, aplicabilidade: str, nivel: str, forca: float}

    # Busca semantica (para achar papers similares no cache)
    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(settings.embedding_dim), nullable=True
    )

    # Metricas
    vezes_usado: Mapped[int] = mapped_column(Integer, default=1)
    primeira_busca: Mapped[str] = mapped_column(String(300))
    # termo original que trouxe esse paper

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self) -> str:
        return f"<Paper {self.titulo[:50]} ({self.fonte})>"
