from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.enums import MaterialAvailability, MaterialCategory

if TYPE_CHECKING:
    from app.models.case import Case


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    case_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[str] = mapped_column(String(200), nullable=False)
    region: Mapped[str] = mapped_column(String(500), nullable=True)
    availability: Mapped[str] = mapped_column(String(100), nullable=True)
    properties: Mapped[dict] = mapped_column(JSONB, default=dict)
    relevance: Mapped[str] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(500), nullable=True)

    def __repr__(self) -> str:
        return f"<Material {self.name} [{self.category}]>"
