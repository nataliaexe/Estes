from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import EvidenceLevel, EvidenceSourceType

if TYPE_CHECKING:
    from app.models.case import Case


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    case_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), index=True
    )
    source_type: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    authors: Mapped[str] = mapped_column(String(500), nullable=True)
    year: Mapped[int] = mapped_column(nullable=True)
    doi: Mapped[str] = mapped_column(String(120), nullable=True)
    excerpt: Mapped[str] = mapped_column(Text, nullable=True)
    url: Mapped[str] = mapped_column(String(1000), nullable=True)
    evidence_level: Mapped[str] = mapped_column(String(50), nullable=True)
    confidence: Mapped[float] = mapped_column(nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    limitations: Mapped[str] = mapped_column(Text, nullable=True)

    case: Mapped["Case"] = relationship(back_populates="evidence_list")

    def __repr__(self) -> str:
        return f"<Evidence {self.title} [{self.source_type}]>"
