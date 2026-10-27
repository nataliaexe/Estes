from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import HypothesisStatus

if TYPE_CHECKING:
    from app.models.case import Case


class Hypothesis(Base):
    __tablename__ = "hypotheses"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    case_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    supporting_evidence_ids: Mapped[list[UUID]] = mapped_column(
        ARRAY(PGUUID(as_uuid=True)), default=list
    )
    relevant_material_ids: Mapped[list[UUID]] = mapped_column(
        ARRAY(PGUUID(as_uuid=True)), default=list
    )
    status: Mapped[str] = mapped_column(
        String(50), default=HypothesisStatus.HYPOTHESIS.value, nullable=False
    )
    confidence: Mapped[float] = mapped_column(nullable=True)
    limitations: Mapped[str] = mapped_column(Text, nullable=True)

    case: Mapped["Case"] = relationship(back_populates="hypotheses")

    def __repr__(self) -> str:
        return f"<Hypothesis {self.title} [{self.status}]>"
