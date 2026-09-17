from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.deps import verificar_dispositivo
from app.core.logging import get_logger
from app.models.medicao import Medicao
from app.schemas.medicao import MedicaoIn, MedicaoOut, MedicaoResumo

log = get_logger(__name__)
router = APIRouter(prefix="/hardware", tags=["hardware"])


def _classificar(razao_c: float) -> tuple[str, float, str]:
    if razao_c > 0.9:
        return (
            "segura",
            0.95,
            "Agua segura para consumo. Continue monitorando.",
        )
    if razao_c > 0.7:
        return (
            "atencao",
            0.75,
            "Possivel contaminacao. Filtre antes de consumir.",
        )
    return (
        "contaminada",
        0.85,
        "Contaminacao detectada. Nao consuma. Filtre e denuncie.",
    )


@router.post("/medicao", response_model=MedicaoOut)
async def receber_medicao(
    body: MedicaoIn,
    session: AsyncSession = Depends(get_session),
):
    # Valida token de dispositivo
    device_id_token = verificar_dispositivo(body.device_token)
    if device_id_token != body.device_id:
        raise HTTPException(401, "device_id nao bate com o token")

    resultado, confianca, recomendacao = _classificar(body.razao_c)

    medicao = Medicao(
        id=uuid4(),
        device_id=body.device_id,
        razao_r=body.razao_r,
        razao_g=body.razao_g,
        razao_b=body.razao_b,
        razao_c=body.razao_c,
        resultado=resultado,
        confianca=confianca,
        latitude=body.latitude,
        longitude=body.longitude,
        metadados=body.metadados,
    )
    session.add(medicao)
    await session.flush()

    log.info(
        "medicao_recebida",
        device=body.device_id,
        resultado=resultado,
        confianca=confianca,
    )

    return MedicaoOut(
        id=medicao.id,
        device_id=medicao.device_id,
        resultado=resultado,
        confianca=confianca,
        recomendacao=recomendacao,
        fontes=["Caso #01 (Eucalipto)"],
        criado_em=datetime.utcnow(),
    )


@router.get("/medicoes", response_model=list[MedicaoResumo])
async def listar_medicoes(
    device_id: str | None = None,
    limite: int = 50,
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Medicao).order_by(Medicao.criado_em.desc()).limit(limite)
    if device_id:
        stmt = stmt.where(Medicao.device_id == device_id)
    result = await session.execute(stmt)
    return result.scalars().all()
