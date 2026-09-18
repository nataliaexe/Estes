"""Endpoints para o mapa interativo (GeoJSON)."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.caso import Caso
from app.models.medicao import Medicao
from app.models.noticia import Noticia

router = APIRouter(prefix="/mapa", tags=["mapa"])

CENTROS_UF = {
    "AC": [-9.97, -67.81],
    "AM": [-3.1, -60.0],
    "BA": [-12.97, -38.5],
    "GO": [-16.68, -49.25],
    "MG": [-18.51, -44.31],
    "MT": [-12.64, -55.42],
    "PA": [-3.79, -52.48],
    "PE": [-8.05, -34.88],
    "PR": [-25.42, -49.27],
    "RJ": [-22.9, -43.2],
    "RO": [-8.76, -63.9],
    "RR": [2.82, -60.67],
    "RS": [-30.03, -51.22],
    "SC": [-27.24, -50.21],
    "SP": [-23.55, -46.63],
    "TO": [-10.18, -48.33],
}


@router.get("/pontos")
async def pontos_mapa(
    uf: str | None = Query(None, max_length=2),
    session: AsyncSession = Depends(get_session),
):
    """Retorna todos os pontos do mapa (casos + medicoes + noticias)."""
    features = []

    # Casos
    stmt_casos = select(Caso)
    if uf:
        stmt_casos = stmt_casos.where(Caso.uf == uf)
    casos = (await session.execute(stmt_casos)).scalars().all()

    for c in casos:
        centro = CENTROS_UF.get(c.uf)
        if not centro:
            continue
        features.append(
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [centro[1], centro[0]],
                },
                "properties": {
                    "tipo": "caso",
                    "numero": c.numero,
                    "titulo": c.titulo,
                    "categoria": c.categoria,
                    "evidencia": c.evidencia,
                    "precisa_hardware": c.precisa_hardware,
                },
            }
        )

    # Medicoes
    stmt_med = select(Medicao).where(Medicao.latitude.isnot(None))
    if uf:
        stmt_med = stmt_med.where(Medicao.uf == uf)
    medicoes = (await session.execute(stmt_med)).scalars().all()

    for m in medicoes:
        features.append(
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [m.longitude, m.latitude],
                },
                "properties": {
                    "tipo": "medicao",
                    "resultado": m.resultado,
                    "confianca": m.confianca,
                    "device_id": m.device_id,
                    "criado_em": m.criado_em.isoformat(),
                },
            }
        )

    # Noticias (sem lat/lon por enquanto - só UF)
    stmt_not = select(Noticia).where(Noticia.uf.isnot(None))
    if uf:
        stmt_not = stmt_not.where(Noticia.uf == uf)
    noticias = (await session.execute(stmt_not)).scalars().all()

    for n in noticias:
        centro = CENTROS_UF.get(n.uf)
        if not centro:
            continue
        # jitter para nao sobrepor
        import random
        features.append(
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        centro[1] + random.uniform(-1, 1),
                        centro[0] + random.uniform(-1, 1),
                    ],
                },
                "properties": {
                    "tipo": "noticia",
                    "titulo": n.titulo,
                    "severidade": n.severidade,
                    "categoria": n.categoria,
                    "fonte": n.fonte,
                },
            }
        )

    return {
        "type": "FeatureCollection",
        "features": features,
        "total": len(features),
    }
