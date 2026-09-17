from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cache_get, cache_set
from app.core.database import get_session
from app.models.caso import Caso
from app.models.documento import Documento
from app.models.medicao import Medicao
from app.models.noticia import Noticia
from app.models.usuario import Usuario
from app.schemas.dashboard import DashboardOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

CACHE_TTL = 300


@router.get("", response_model=DashboardOut)
async def dashboard(session: AsyncSession = Depends(get_session)):
    chave = "dashboard:estatisticas"
    cached = await cache_get(chave)
    if cached:
        return DashboardOut(**cached)

    async def _contar(model):
        r = await session.execute(select(func.count(model.id)))
        return r.scalar() or 0

    async def _agrupar(model, campo):
        r = await session.execute(
            select(campo, func.count(model.id)).group_by(campo)
        )
        return {str(k): v for k, v in r.all()}

    total_casos = await _contar(Caso)
    total_medicoes = await _contar(Medicao)
    total_noticias = await _contar(Noticia)
    total_usuarios = await _contar(Usuario)
    total_documentos = await _contar(Documento)

    casos_por_categoria = await _agrupar(Caso, Caso.categoria)
    casos_por_uf = await _agrupar(Caso, Caso.uf)
    casos_por_evidencia = await _agrupar(Caso, Caso.evidencia)

    com_hw = await session.execute(
        select(func.count(Caso.id)).where(Caso.precisa_hardware.is_(True))
    )
    casos_com_hardware = com_hw.scalar() or 0

    medicoes_por_resultado = await _agrupar(Medicao, Medicao.resultado)
    noticias_por_severidade = await _agrupar(Noticia, Noticia.severidade)

    dados = DashboardOut(
        total_casos=total_casos,
        total_medicoes=total_medicoes,
        total_noticias=total_noticias,
        total_usuarios=total_usuarios,
        total_documentos=total_documentos,
        casos_por_categoria=casos_por_categoria,
        casos_por_uf=casos_por_uf,
        casos_por_evidencia=casos_por_evidencia,
        casos_com_hardware=casos_com_hardware,
        medicoes_por_resultado=medicoes_por_resultado,
        noticias_por_severidade=noticias_por_severidade,
    )

    await cache_set(chave, dados.model_dump(), ttl=CACHE_TTL)
    return dados
