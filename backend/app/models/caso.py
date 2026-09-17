from datetime import datetime
from uuid import UUID, uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.config import settings
from app.core.database import Base


class Caso(Base):
    __tablename__ = "casos"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    numero: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    uf: Mapped[str] = mapped_column(String(2), index=True)

    # Categorizacao
    categoria: Mapped[str] = mapped_column(
        String(40), default="agua", index=True
    )
    tipo_solucao: Mapped[str] = mapped_column(
        String(40), default="filtro", index=True
    )
    precisa_hardware: Mapped[bool] = mapped_column(Boolean, default=False)

    # Historia (gancho emocional)
    historia: Mapped[str] = mapped_column(Text, default="")
    fontes_historicas: Mapped[list] = mapped_column(JSONB, default=list)
    impacto_estimado: Mapped[dict] = mapped_column(JSONB, default=dict)

    # Conteudo tecnico
    problema: Mapped[str] = mapped_column(Text, nullable=False)
    recurso_local: Mapped[str] = mapped_column(String(200), nullable=False)
    solucao: Mapped[str] = mapped_column(String(200), nullable=False)
    evidencia: Mapped[str] = mapped_column(String(20), default="hipotese")

    composicao: Mapped[dict] = mapped_column(JSONB, default=dict)
    propriedades: Mapped[dict] = mapped_column(JSONB, default=dict)
    aplicacoes: Mapped[dict] = mapped_column(JSONB, default=dict)
    lacunas: Mapped[list] = mapped_column(JSONB, default=list)
    referencias: Mapped[list] = mapped_column(JSONB, default=list)

    nivel_1_pronto: Mapped[dict] = mapped_column(JSONB, default=dict)
    nivel_2_simples: Mapped[dict] = mapped_column(JSONB, default=dict)
    nivel_3_completo: Mapped[dict] = mapped_column(JSONB, default=dict)

    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(settings.embedding_dim), nullable=True
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    medicoes: Mapped[list["Medicao"]] = relationship(back_populates="caso")

    def __repr__(self) -> str:
        return f"<Caso #{self.numero} [{self.categoria}] {self.titulo}>"
