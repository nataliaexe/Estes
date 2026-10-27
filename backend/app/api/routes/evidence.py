from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.evidence import Evidence
from app.schemas.evidence import EvidenceCreate, EvidenceResponse, EvidenceUpdate

router = APIRouter(prefix="/evidence", tags=["evidence"])


@router.post("", response_model=EvidenceResponse, status_code=201)
async def create_evidence(
    evidence_data: EvidenceCreate,
    session: AsyncSession = Depends(get_session),
):
    evidence = Evidence(**evidence_data.model_dump())
    session.add(evidence)
    await session.commit()
    await session.refresh(evidence)
    return evidence


@router.get("/case/{case_id}", response_model=list[EvidenceResponse])
async def list_evidence_by_case(
    case_id: str,
    limit: int = 50,
    offset: int = 0,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Evidence)
        .where(Evidence.case_id == UUID(case_id))
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{evidence_id}", response_model=EvidenceResponse)
async def get_evidence(
    evidence_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Evidence).where(Evidence.id == UUID(evidence_id))
    )
    evidence = result.scalar_one_or_none()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return evidence


@router.put("/{evidence_id}", response_model=EvidenceResponse)
async def update_evidence(
    evidence_id: str,
    evidence_data: EvidenceUpdate,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Evidence).where(Evidence.id == UUID(evidence_id))
    )
    evidence = result.scalar_one_or_none()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    update_data = evidence_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(evidence, field, value)

    await session.commit()
    await session.refresh(evidence)
    return evidence
