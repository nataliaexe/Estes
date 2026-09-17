from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Medicao(Base):
    __tablename__ = "medicoes"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    device_id: Mapped[str] = mapped_column(String(64), index=True)

    caso_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("casos.id"), nullable=True
    )

    razao_r: Mapped[float] = mapped_column(Float)
    razao_g: Mapped[float] = mapped_column(Float)
    razao_b: Mapped[float] = mapped_column(Float)
    razao_c: Mapped[float] = mapped_column(Float)

    resultado: Mapped[str] = mapped_column(String(20))
    confianca: Mapped[float] = mapped_column(Float, default=0.0)

    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    uf: Mapped[str | None] = mapped_column(String(2), nullable=True)
    municipio: Mapped[str | None] = mapped_column(String(120), nullable=True)

    metadados: Mapped[dict] = mapped_column(JSONB, default=dict)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    caso: Mapped["Caso"] = relationship(back_populates="medicoes")

    def __repr__(self) -> str:
        return f"<Medicao {self.device_id} {self.resultado}>"
