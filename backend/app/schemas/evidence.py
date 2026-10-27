from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.enums import EvidenceLevel, EvidenceSourceType


class EvidenceCreate(BaseModel):
    case_id: UUID
    source_type: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=500)
    authors: str | None = Field(None, max_length=500)
    year: int | None = None
    doi: str | None = Field(None, max_length=120)
    excerpt: str | None = None
    url: str | None = Field(None, max_length=1000)
    evidence_level: str | None = Field(None, max_length=50)
    confidence: float | None = Field(None, ge=0, le=1)
    notes: str | None = None
    limitations: str | None = None


class EvidenceUpdate(BaseModel):
    source_type: str | None = Field(None, min_length=1, max_length=100)
    title: str | None = Field(None, min_length=1, max_length=500)
    authors: str | None = Field(None, max_length=500)
    year: int | None = None
    doi: str | None = Field(None, max_length=120)
    excerpt: str | None = None
    url: str | None = Field(None, max_length=1000)
    evidence_level: str | None = Field(None, max_length=50)
    confidence: float | None = Field(None, ge=0, le=1)
    notes: str | None = None
    limitations: str | None = None


class EvidenceResponse(BaseModel):
    id: UUID
    case_id: UUID
    source_type: str
    title: str
    authors: str | None
    year: int | None
    doi: str | None
    excerpt: str | None
    url: str | None
    evidence_level: str | None
    confidence: float | None
    notes: str | None
    limitations: str | None

    class Config:
        from_attributes = True
