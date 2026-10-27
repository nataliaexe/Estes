from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class DataLineageCreate(BaseModel):
    case_id: UUID
    source_type: str = Field(..., min_length=1, max_length=100)
    source_id: str | None = Field(None, max_length=500)
    source_url: str | None = Field(None, max_length=1000)
    source_metadata: dict = Field(default_factory=dict)
    processing_steps: list[dict] = Field(default_factory=list)
    ai_provider: str | None = Field(None, max_length=100)
    ai_model: str | None = Field(None, max_length=100)
    ai_confidence: float | None = Field(None, ge=0, le=1)
    extracted_text: str | None = None
    original_excerpt: str | None = None
    page_number: int | None = None
    quality_score: float | None = Field(None, ge=0, le=1)
    has_literal_quote: bool = Field(default=False)
    quote_location: str | None = Field(None, max_length=500)


class DataLineageUpdate(BaseModel):
    human_validated: bool | None = None
    human_validator_id: str | None = Field(None, max_length=500)
    human_notes: str | None = None
    quality_score: float | None = Field(None, ge=0, le=1)


class DataLineageResponse(BaseModel):
    id: UUID
    case_id: UUID
    source_type: str
    source_id: str | None
    source_url: str | None
    source_metadata: dict
    processing_steps: list[dict]
    ai_provider: str | None
    ai_model: str | None
    ai_confidence: float | None
    ai_extraction_timestamp: datetime | None
    human_validated: bool
    human_validator_id: str | None
    human_validation_timestamp: datetime | None
    human_notes: str | None
    extracted_text: str | None
    original_excerpt: str | None
    page_number: int | None
    quality_score: float | None
    has_literal_quote: bool
    quote_location: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
