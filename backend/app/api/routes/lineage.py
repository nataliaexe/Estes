from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.lineage import DataLineage
from app.schemas.lineage import DataLineageCreate, DataLineageResponse, DataLineageUpdate

router = APIRouter(prefix="/lineage", tags=["lineage"])


@router.post("", response_model=DataLineageResponse, status_code=201)
async def create_lineage(
    lineage_data: DataLineageCreate,
    session: AsyncSession = Depends(get_session),
):
    lineage = DataLineage(**lineage_data.model_dump())
    session.add(lineage)
    await session.commit()
    await session.refresh(lineage)
    return lineage


@router.get("/case/{case_id}", response_model=list[DataLineageResponse])
async def list_lineage_by_case(
    case_id: str,
    limit: int = 50,
    offset: int = 0,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(DataLineage)
        .where(DataLineage.case_id == UUID(case_id))
        .order_by(DataLineage.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{lineage_id}", response_model=DataLineageResponse)
async def get_lineage(
    lineage_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(DataLineage).where(DataLineage.id == UUID(lineage_id))
    )
    lineage = result.scalar_one_or_none()
    if not lineage:
        raise HTTPException(status_code=404, detail="Lineage not found")
    return lineage


@router.put("/{lineage_id}/validate", response_model=DataLineageResponse)
async def validate_lineage(
    lineage_id: str,
    validation_data: DataLineageUpdate,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID
    from datetime import datetime, timezone

    result = await session.execute(
        select(DataLineage).where(DataLineage.id == UUID(lineage_id))
    )
    lineage = result.scalar_one_or_none()
    if not lineage:
        raise HTTPException(status_code=404, detail="Lineage not found")

    update_data = validation_data.model_dump(exclude_unset=True)
    if validation_data.human_validated:
        update_data["human_validation_timestamp"] = datetime.now(timezone.utc)

    for field, value in update_data.items():
        setattr(lineage, field, value)

    await session.commit()
    await session.refresh(lineage)
    return lineage
