from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.enums import CaseStatus


class CaseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    location: str = Field(..., min_length=1, max_length=500)
    problem_type: str = Field(..., min_length=1, max_length=200)
    summary: str = Field(..., min_length=1, max_length=2000)
    status: str = Field(default=CaseStatus.DRAFT.value, max_length=50)


class CaseUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=500)
    location: str | None = Field(None, min_length=1, max_length=500)
    problem_type: str | None = Field(None, min_length=1, max_length=200)
    summary: str | None = Field(None, min_length=1, max_length=2000)
    status: str | None = Field(None, max_length=50)


class CaseResponse(BaseModel):
    id: UUID
    title: str
    location: str
    problem_type: str
    summary: str
    created_at: datetime
    status: str

    class Config:
        from_attributes = True
