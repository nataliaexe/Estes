from uuid import UUID

from pydantic import BaseModel, Field


class ProtocolCreate(BaseModel):
    case_id: UUID
    steps: list[dict] = Field(default_factory=list)
    materials_needed: list[str] = Field(default_factory=list)
    equipment_needed: list[str] = Field(default_factory=list)
    objectives: str | None = None
    risks: str | None = None
    validation_plan: str | None = None


class ProtocolUpdate(BaseModel):
    steps: list[dict] | None = None
    materials_needed: list[str] | None = None
    equipment_needed: list[str] | None = None
    objectives: str | None = None
    risks: str | None = None
    validation_plan: str | None = None


class ProtocolResponse(BaseModel):
    id: UUID
    case_id: UUID
    steps: list[dict]
    materials_needed: list[str]
    equipment_needed: list[str]
    objectives: str | None
    risks: str | None
    validation_plan: str | None

    class Config:
        from_attributes = True
