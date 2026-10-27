from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.case import Case


class DataLineage(Base):
    __tablename__ = "data_lineage"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), primary_key=True, default=uuid4
    )
    case_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("cases.id", ondelete="CASCADE"), index=True
    )

    # Source of the data
    source_type: Mapped[str] = mapped_column(String(100), nullable=False)
    source_id: Mapped[str] = mapped_column(String(500), nullable=True)
    source_url: Mapped[str] = mapped_column(String(1000), nullable=True)
    source_metadata: Mapped[dict] = mapped_column(JSONB, default=dict)

    # Processing steps
    processing_steps: Mapped[list[dict]] = mapped_column(JSONB, default=list)

    # AI extraction details
    ai_provider: Mapped[str] = mapped_column(String(100), nullable=True)
    ai_model: Mapped[str] = mapped_column(String(100), nullable=True)
    ai_confidence: Mapped[float] = mapped_column(nullable=True)
    ai_extraction_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Human validation
    human_validated: Mapped[bool] = mapped_column(default=False)
    human_validator_id: Mapped[str] = mapped_column(String(500), nullable=True)
    human_validation_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    human_notes: Mapped[str] = mapped_column(Text, nullable=True)

    # Extracted content
    extracted_text: Mapped[str] = mapped_column(Text, nullable=True)
    original_excerpt: Mapped[str] = mapped_column(Text, nullable=True)
    page_number: Mapped[int] = mapped_column(nullable=True)

    # Quality metrics
    quality_score: Mapped[float] = mapped_column(nullable=True)
    has_literal_quote: Mapped[bool] = mapped_column(default=False)
    quote_location: Mapped[str] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default="now()"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default="now()", onupdate="now()"
    )

    def __repr__(self) -> str:
        return f"<DataLineage {self.source_type} -> validated={self.human_validated}>"
