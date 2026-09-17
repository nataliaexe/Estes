from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.caso import Caso
from app.schemas.caso import (
    CasoBusca,
    CasoBuscaResultado,
    CasoDetalhe,
    CasoResumo,
)
from app.services.busca_plataforma import buscar_plataforma

router = APIRouter(prefix="/casos", tags=["casos"])


@router.get("", response_model=list[CasoResumo])
async def listar_casos(
    categoria: str | None = None,
    uf: str | None = None,
    evidencia: str | None = None,
    precisa_hardware: bool | None = None,
    limite: int = Query(50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Caso).order_by(Caso.numero).limit(limite)
    if categoria:
        stmt = stmt.where(Caso.categoria == categoria)
    if uf:
        stmt = stmt.where(Caso.uf == uf)
    if evidencia:
        stmt = stmt.where(Caso.evidencia == evidencia)
    if precisa_hardware is not None:
        stmt = stmt.where(Caso.precisa_hardware == precisa_hardware)

    result = await session.execute(stmt)
    return result.scalars().all()


@router.get("/estatisticas")
async def estatisticas(session: AsyncSession = Depends(get_session)):
    por_categoria_result = await session.execute(
        select(Caso.categoria, func.count(Caso.id))
        .group_by(Caso.categoria)
        .order_by(func.count(Caso.id).desc())
    )
    por_categoria = {cat: n for cat, n in por_categoria_result.all()}

    por_uf_result = await session.execute(
        select(Caso.uf, func.count(Caso.id))
        .group_by(Caso.uf)
        .order_by(func.count(Caso.id).desc())
    )
    por_uf = {uf: n for uf, n in por_uf_result.all()}

    por_evidencia_result = await session.execute(
        select(Caso.evidencia, func.count(Caso.id))
        .group_by(Caso.evidencia)
    )
    por_evidencia = {ev: n for ev, n in por_evidencia_result.all()}

    com_hardware_result = await session.execute(
        select(func.count(Caso.id)).where(Caso.precisa_hardware.is_(True))
    )
    com_hardware = com_hardware_result.scalar() or 0

    return {
        "total": sum(por_categoria.values()),
        "por_categoria": por_categoria,
        "por_uf": por_uf,
        "por_evidencia": por_evidencia,
        "com_hardware": com_hardware,
    }


@router.post("/buscar", response_model=list[CasoBuscaResultado])
async def buscar(
    body: CasoBusca,
    session: AsyncSession = Depends(get_session),
):
    resultados = await buscar_plataforma(
        session, body.consulta, limite=body.limite
    )

    saida = []
    for r in resultados:
        numero = r.metadata.get("numero")
        if not numero:
            continue
        caso_result = await session.execute(
            select(Caso).where(Caso.numero == numero)
        )
        caso = caso_result.scalar_one_or_none()
        if caso:
            saida.append(
                CasoBuscaResultado(
                    caso=CasoResumo.model_validate(caso),
                    similaridade=r.score,
                )
            )
    return saida


@router.get("/{numero}", response_model=CasoDetalhe)
async def detalhe_caso(
    numero: int,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Caso).where(Caso.numero == numero)
    )
    caso = result.scalar_one_or_none()
    if not caso:
        raise HTTPException(404, f"Caso #{numero} nao encontrado")
    return caso
