from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.case import Case


class Protocol(Base):
    __tablename__ = "protocols"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    case_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), index=True
    )
    steps: Mapped[list[dict]] = mapped_column(JSONB, default=list)
    materials_needed: Mapped[list[str]] = mapped_column(
        ARRAY(String), default=list
    )
    equipment_needed: Mapped[list[str]] = mapped_column(
        ARRAY(String), default=list
    )
    objectives: Mapped[str] = mapped_column(Text, nullable=True)
    risks: Mapped[str] = mapped_column(Text, nullable=True)
    validation_plan: Mapped[str] = mapped_column(Text, nullable=True)

    case: Mapped["Case"] = relationship(back_populates="protocols")

    def __repr__(self) -> str:
        return f"<Protocol for case {self.case_id}>"
