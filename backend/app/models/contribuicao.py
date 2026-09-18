"""Contribuicoes comunitarias: solucoes, historias, observacoes, correcoes."""

from datetime import datetime
from uuid import UUID, uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.config import settings
from app.core.database import Base


class Contribuicao(Base):
    """Contribuicao da comunidade.

    Tipos:
    - solucao: metodo/protocolo que a pessoa testou
    - historia: conhecimento tradicional, relato, memoria
    - observacao: algo que a pessoa viu no territorio
    - correcao: correcao a um caso do Atlas
    """

    __tablename__ = "contribuicoes"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    autor_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), index=True
    )

    tipo: Mapped[str] = mapped_column(String(30), index=True)
    # solucao, historia, observacao, correcao

    titulo: Mapped[str] = mapped_column(String(300), nullable=False)
    conteudo: Mapped[str] = mapped_column(Text, nullable=False)

    # Evidencias cientificas (opcional, mas reforça credibilidade)
    evidencias: Mapped[list] = mapped_column(JSONB, default=list)
    # [{tipo, titulo, doi, url, trecho}]

    # Relacao com o Atlas
    caso_relacionado: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("casos.id"), nullable=True, index=True
    )

    # Localizacao
    uf: Mapped[str | None] = mapped_column(String(2), index=True, nullable=True)
    municipio: Mapped[str | None] = mapped_column(String(120), nullable=True)

    # Curadoria
    status: Mapped[str] = mapped_column(
        String(20), default="pendente", index=True
    )
    # pendente, validado, rejeitado

    validado_por_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=True
    )
    validado_em: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    motivo_validacao: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Reputacao
    votos: Mapped[int] = mapped_column(Integer, default=0)
    visualizacoes: Mapped[int] = mapped_column(Integer, default=0)

    # Busca semantica
    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(settings.embedding_dim), nullable=True
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    comentarios: Mapped[list["Comentario"]] = relationship(
        back_populates="contribuicao", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Contribuicao {self.tipo} {self.titulo[:40]} ({self.status})>"


class Voto(Base):
    """Voto unico por usuario por contribuicao."""

    __tablename__ = "votos"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    usuario_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), index=True
    )
    contribuicao_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("contribuicoes.id"), index=True
    )
    valor: Mapped[int] = mapped_column(Integer)  # -1 ou +1
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Voto {self.valor} user={self.usuario_id}>"


class Comentario(Base):
    """Comentario em contribuicao."""

    __tablename__ = "comentarios"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    autor_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("usuarios.id"), index=True
    )
    contribuicao_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("contribuicoes.id"), index=True
    )
    conteudo: Mapped[str] = mapped_column(Text, nullable=False)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    contribuicao: Mapped["Contribuicao"] = relationship(
        back_populates="comentarios"
    )

    def __repr__(self) -> str:
        return f"<Comentario {self.conteudo[:30]}>"
