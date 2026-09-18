"""Achievements e gamificacao leve."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.contribuicao import Contribuicao, Voto
from app.models.medicao import Medicao
from app.models.usuario import Usuario

router = APIRouter(prefix="/achievements", tags=["achievements"])


@router.get("/{usuario_id}")
async def get_achievements(
    usuario_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Retorna conquistas de um usuario."""
    from uuid import UUID
    try:
        uid = UUID(usuario_id)
    except ValueError:
        return {"error": "invalid id"}

    # Contribuicoes
    contribs_r = await session.execute(
        select(func.count(Contribuicao.id)).where(Contribuicao.autor_id == uid)
    )
    total_contribs = contribs_r.scalar() or 0

    # Votos dados
    votos_r = await session.execute(
        select(func.count(Voto.id)).where(Voto.usuario_id == uid)
    )
    total_votos = votos_r.scalar() or 0

    # Medicoes
    med_r = await session.execute(
        select(func.count(Medicao.id))
    )
    total_medicoes = med_r.scalar() or 0

    conquistas = []

    if total_contribs >= 1:
        conquistas.append({
            "id": "primeira_contribuicao",
            "titulo": "Primeira contribuição",
            "descricao": "Você compartilhou seu primeiro conhecimento",
            "icone": "🌱",
        })
    if total_contribs >= 5:
        conquistas.append({
            "id": "curador_iniciante",
            "titulo": "Curador iniciante",
            "descricao": "5 contribuições publicadas",
            "icone": "🌿",
        })
    if total_votos >= 10:
        conquistas.append({
            "id": "apoiador",
            "titulo": "Apoiador",
            "descricao": "10 votos em contribuições",
            "icone": "🤝",
        })

    return {
        "usuario_id": usuario_id,
        "total_contribuicoes": total_contribs,
        "total_votos": total_votos,
        "conquistas": conquistas,
    }
