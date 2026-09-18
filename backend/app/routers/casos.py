"""Atlas — endpoints de casos com suporte a i18n."""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.i18n import normalizar_idioma, traduzir, traduzir_lista
from app.models.caso import Caso
from app.schemas.caso import (
    CasoBusca,
    CasoBuscaResultado,
    CasoDetalhe,
    CasoResumo,
)
from app.services.busca_plataforma import buscar_plataforma

router = APIRouter(prefix="/casos", tags=["casos"])


def _idioma(request: Request, idioma_query: str | None = None) -> str:
    """Detecta idioma da query, header Accept-Language ou default pt."""
    if idioma_query:
        return normalizar_idioma(idioma_query)
    header = request.headers.get("accept-language", "")
    return normalizar_idioma(header)


def _serializar_resumo(caso: Caso, idioma: str) -> dict:
    return {
        "id": caso.id,
        "numero": caso.numero,
        "titulo": traduzir(caso.titulo, idioma),
        "uf": caso.uf,
        "categoria": caso.categoria,
        "tipo_solucao": caso.tipo_solucao,
        "precisa_hardware": caso.precisa_hardware,
        "problema": traduzir(caso.problema, idioma),
        "recurso_local": traduzir(caso.recurso_local, idioma),
        "solucao": traduzir(caso.solucao, idioma),
        "evidencia": caso.evidencia,
    }


def _serializar_detalhe(caso: Caso, idioma: str) -> dict:
    base = _serializar_resumo(caso, idioma)
    base.update({
        "historia": traduzir(caso.historia, idioma),
        "fontes_historicas": caso.fontes_historicas or [],
        "impacto_estimado": caso.impacto_estimado or {},
        "composicao": caso.composicao or {},
        "propriedades": caso.propriedades or {},
        "aplicacoes": caso.aplicacoes or {},
        "lacunas": traduzir_lista(caso.lacunas, idioma),
        "referencias": caso.referencias or [],
        "nivel_1_pronto": caso.nivel_1_pronto or {},
        "nivel_2_simples": caso.nivel_2_simples or {},
        "nivel_3_completo": caso.nivel_3_completo or {},
        "passos_visuais": caso.passos_visuais or [],
        "criado_em": caso.criado_em,
        "atualizado_em": caso.atualizado_em,
    })
    return base


@router.get("")
async def listar_casos(
    request: Request,
    idioma: str | None = Query(None, max_length=5),
    categoria: str | None = None,
    uf: str | None = None,
    evidencia: str | None = None,
    precisa_hardware: bool | None = None,
    limite: int = Query(50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    lang = _idioma(request, idioma)

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
    casos = result.scalars().all()
    return [_serializar_resumo(c, lang) for c in casos]


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


@router.post("/buscar")
async def buscar(
    request: Request,
    body: CasoBusca,
    idioma: str | None = Query(None, max_length=5),
    session: AsyncSession = Depends(get_session),
):
    lang = _idioma(request, idioma)

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
            saida.append({
                "caso": _serializar_resumo(caso, lang),
                "similaridade": r.score,
            })
    return saida


@router.get("/{numero}")
async def detalhe_caso(
    request: Request,
    numero: int,
    idioma: str | None = Query(None, max_length=5),
    session: AsyncSession = Depends(get_session),
):
    lang = _idioma(request, idioma)

    result = await session.execute(
        select(Caso).where(Caso.numero == numero)
    )
    caso = result.scalar_one_or_none()
    if not caso:
        raise HTTPException(404, f"Caso #{numero} nao encontrado")
    return _serializar_detalhe(caso, lang)
