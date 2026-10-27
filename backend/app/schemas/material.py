from uuid import UUID

from pydantic import BaseModel, Field


class MaterialCreate(BaseModel):
    case_id: UUID
    name: str = Field(..., min_length=1, max_length=500)
    category: str = Field(..., min_length=1, max_length=200)
    region: str | None = Field(None, max_length=500)
    availability: str | None = Field(None, max_length=100)
    properties: dict = Field(default_factory=dict)
    relevance: str | None = None
    source: str | None = Field(None, max_length=500)


class MaterialUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=500)
    category: str | None = Field(None, min_length=1, max_length=200)
    region: str | None = Field(None, max_length=500)
    availability: str | None = Field(None, max_length=100)
    properties: dict | None = None
    relevance: str | None = None
    source: str | None = Field(None, max_length=500)


class MaterialResponse(BaseModel):
    id: UUID
    case_id: UUID
    name: str
    category: str
    region: str | None
    availability: str | None
    properties: dict
    relevance: str | None
    source: str | None

    class Config:
        from_attributes = True
