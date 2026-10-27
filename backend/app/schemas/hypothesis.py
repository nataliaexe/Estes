from uuid import UUID

from pydantic import BaseModel, Field

from app.core.enums import HypothesisStatus


class HypothesisCreate(BaseModel):
    case_id: UUID
    title: str = Field(..., min_length=1, max_length=500)
    description: str = Field(..., min_length=1)
    supporting_evidence_ids: list[UUID] = Field(default_factory=list)
    relevant_material_ids: list[UUID] = Field(default_factory=list)
    status: str = Field(default=HypothesisStatus.HYPOTHESIS.value, max_length=50)
    confidence: float | None = Field(None, ge=0, le=1)
    limitations: str | None = None


class HypothesisUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=500)
    description: str | None = Field(None, min_length=1)
    supporting_evidence_ids: list[UUID] | None = None
    relevant_material_ids: list[UUID] | None = None
    status: str | None = Field(None, max_length=50)
    confidence: float | None = Field(None, ge=0, le=1)
    limitations: str | None = None


class HypothesisResponse(BaseModel):
    id: UUID
    case_id: UUID
    title: str
    description: str
    supporting_evidence_ids: list[UUID]
    relevant_material_ids: list[UUID]
    status: str
    confidence: float | None
    limitations: str | None

    class Config:
        from_attributes = True
