from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.material import Material
from app.schemas.material import MaterialCreate, MaterialResponse, MaterialUpdate

router = APIRouter(prefix="/materials", tags=["materials"])


@router.post("", response_model=MaterialResponse, status_code=201)
async def create_material(
    material_data: MaterialCreate,
    session: AsyncSession = Depends(get_session),
):
    material = Material(**material_data.model_dump())
    session.add(material)
    await session.commit()
    await session.refresh(material)
    return material


@router.get("/case/{case_id}", response_model=list[MaterialResponse])
async def list_materials_by_case(
    case_id: str,
    limit: int = 50,
    offset: int = 0,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Material)
        .where(Material.case_id == UUID(case_id))
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.get("/{material_id}", response_model=MaterialResponse)
async def get_material(
    material_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Material).where(Material.id == UUID(material_id))
    )
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material


@router.put("/{material_id}", response_model=MaterialResponse)
async def update_material(
    material_id: str,
    material_data: MaterialUpdate,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Material).where(Material.id == UUID(material_id))
    )
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    update_data = material_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(material, field, value)

    await session.commit()
    await session.refresh(material)
    return material
