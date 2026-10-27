from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.protocol import Protocol
from app.schemas.protocol import ProtocolCreate, ProtocolResponse, ProtocolUpdate

router = APIRouter(prefix="/protocols", tags=["protocols"])


@router.post("", response_model=ProtocolResponse, status_code=201)
async def create_protocol(
    protocol_data: ProtocolCreate,
    session: AsyncSession = Depends(get_session),
):
    protocol = Protocol(**protocol_data.model_dump())
    session.add(protocol)
    await session.commit()
    await session.refresh(protocol)
    return protocol


@router.get("/case/{case_id}", response_model=list[ProtocolResponse])
async def list_protocols_by_case(
    case_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Protocol).where(Protocol.case_id == UUID(case_id))
    )
    return result.scalars().all()


@router.get("/{protocol_id}", response_model=ProtocolResponse)
async def get_protocol(
    protocol_id: str,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Protocol).where(Protocol.id == UUID(protocol_id))
    )
    protocol = result.scalar_one_or_none()
    if not protocol:
        raise HTTPException(status_code=404, detail="Protocol not found")
    return protocol


@router.put("/{protocol_id}", response_model=ProtocolResponse)
async def update_protocol(
    protocol_id: str,
    protocol_data: ProtocolUpdate,
    session: AsyncSession = Depends(get_session),
):
    from sqlalchemy import select
    from uuid import UUID

    result = await session.execute(
        select(Protocol).where(Protocol.id == UUID(protocol_id))
    )
    protocol = result.scalar_one_or_none()
    if not protocol:
        raise HTTPException(status_code=404, detail="Protocol not found")

    update_data = protocol_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(protocol, field, value)

    await session.commit()
    await session.refresh(protocol)
    return protocol
