from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseResponse, CaseUpdate

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("", response_model=CaseResponse, status_code=201)
async def create_case(
    case_data: CaseCreate,
    session: AsyncSession = Depends(get_session),
):
    case = Case(**case_data.model_dump())
    session.add(case)
    await session.commit()
    await session.refresh(case)
    return case


@router.get("", response_model=list[CaseResponse])
async def list_cases(
    status: str | None = None,
    problem_type: str | None = None,
    limit: int = 50,
    offset: int = 0,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select

    stmt = select(Case).limit(limit).offset(offset)
    if status:
        stmt = stmt.where(Case.status == status)
    if problem_type:
        stmt = stmt.where(Case.problem_type == problem_type)

    result = await session.execute(stmt)
    return result.scalars().all()


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Case).where(Case.id == UUID(case_id))
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: str,
    case_data: CaseUpdate,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Case).where(Case.id == UUID(case_id))
    )
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    update_data = case_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(case, field, value)

    await session.commit()
    await session.refresh(case)
    return case
