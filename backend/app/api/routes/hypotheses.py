from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.hypothesis import Hypothesis
from app.schemas.hypothesis import HypothesisCreate, HypothesisResponse, HypothesisUpdate

router = APIRouter(prefix="/hypotheses", tags=["hypotheses"])


@router.post("", response_model=HypothesisResponse, status_code=201)
async def create_hypothesis(
    hypothesis_data: HypothesisCreate,
    session: AsyncSession = Depends(get_session),
):
    hypothesis = Hypothesis(**hypothesis_data.model_dump())
    session.add(hypothesis)
    await session.commit()
    await session.refresh(hypothesis)
    return hypothesis


@router.get("/case/{case_id}", response_model=list[HypothesisResponse])
async def list_hypotheses_by_case(
    case_id: str,
    limit: int = 50,
    offset: int = 0,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Hypothesis)
        .where(Hypothesis.case_id == UUID(case_id))
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{hypothesis_id}", response_model=HypothesisResponse)
async def get_hypothesis(
    hypothesis_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Hypothesis).where(Hypothesis.id == UUID(hypothesis_id))
    )
    hypothesis = result.scalar_one_or_none()
    if not hypothesis:
        raise HTTPException(status_code=404, detail="Hypothesis not found")
    return hypothesis


@router.put("/{hypothesis_id}", response_model=HypothesisResponse)
async def update_hypothesis(
    hypothesis_id: str,
    hypothesis_data: HypothesisUpdate,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Hypothesis).where(Hypothesis.id == UUID(hypothesis_id))
    )
    hypothesis = result.scalar_one_or_none()
    if not hypothesis:
        raise HTTPException(status_code=404, detail="Hypothesis not found")

    update_data = hypothesis_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(hypothesis, field, value)

    await session.commit()
    await session.refresh(hypothesis)
    return hypothesis
