"""Endpoints para o mapa interativo (GeoJSON)."""

from fastapi import APIRouter, Query
from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.logging import get_logger
from app.models.caso import Caso
from app.models.medicao import Medicao
from app.models.noticia import Noticia

log = get_logger(__name__)
router = APIRouter(prefix="/mapa", tags=["mapa"])

CENTROS_UF = {
    "AC": [-9.97, -67.81], "AL": [-9.66, -35.73], "AM": [-3.1, -60.0],
    "AP": [0.03, -51.07], "BA": [-12.97, -38.5], "CE": [-3.71, -38.54],
    "DF": [-15.78, -47.93], "ES": [-20.31, -40.31], "GO": [-16.68, -49.25],
    "MA": [-2.53, -44.3], "MG": [-18.51, -44.31], "MS": [-20.44, -54.65],
    "MT": [-12.64, -55.42], "PA": [-3.79, -52.48], "PB": [-7.12, -34.88],
    "PE": [-8.05, -34.88], "PI": [-5.09, -42.8], "PR": [-25.42, -49.27],
    "RJ": [-22.9, -43.2], "RN": [-5.79, -35.21], "RO": [-8.76, -63.9],
    "RR": [2.82, -60.67], "RS": [-30.03, -51.22], "SC": [-27.24, -50.21],
    "SE": [-10.91, -37.07], "SP": [-23.55, -46.63], "TO": [-10.18, -48.33],
}


@router.get("/pontos")
async def pontos_mapa(uf: str | None = Query(None, max_length=2)):
    features = []

    # CASOS
    try:
        async with SessionLocal() as session:
            stmt = select(Caso)
            if uf:
                stmt = stmt.where(Caso.uf == uf)
            casos = (await session.execute(stmt)).scalars().all()

        log.info("mapa_casos_ok", total=len(casos))
        for c in casos:
            uf_limpa = (c.uf or "").strip().upper()
            centro = CENTROS_UF.get(uf_limpa)
            if not centro:
                log.warning("mapa_caso_sem_centro", uf=c.uf, numero=c.numero)
                continue
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [centro[1], centro[0]]},
                "properties": {
                    "tipo": "caso",
                    "numero": c.numero,
                    "titulo": c.titulo,
                    "categoria": c.categoria,
                    "evidencia": c.evidencia,
                    "precisa_hardware": bool(c.precisa_hardware),
                },
            })
    except Exception as e:
        log.error("mapa_casos_falhou", erro=str(e)[:300])

    # MEDICOES
    try:
        async with SessionLocal() as session:
            stmt = select(Medicao).where(Medicao.latitude.isnot(None))
            if uf:
                stmt = stmt.where(Medicao.uf == uf)
            medicoes = (await session.execute(stmt)).scalars().all()

        log.info("mapa_medicoes_ok", total=len(medicoes))
        for m in medicoes:
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(m.longitude), float(m.latitude)],
                },
                "properties": {
                    "tipo": "medicao",
                    "resultado": m.resultado,
                    "confianca": float(m.confianca),
                    "device_id": m.device_id,
                    "criado_em": m.criado_em.isoformat() if m.criado_em else "",
                },
            })
    except Exception as e:
        log.error("mapa_medicoes_falhou", erro=str(e)[:300])

    # NOTICIAS
    try:
        import random
        async with SessionLocal() as session:
            stmt = select(Noticia).where(Noticia.uf.isnot(None))
            if uf:
                stmt = stmt.where(Noticia.uf == uf)
            noticias = (await session.execute(stmt)).scalars().all()

        log.info("mapa_noticias_ok", total=len(noticias))
        for n in noticias:
            uf_limpa = (n.uf or "").strip().upper()
            centro = CENTROS_UF.get(uf_limpa)
            if not centro:
                continue
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        centro[1] + random.uniform(-0.8, 0.8),
                        centro[0] + random.uniform(-0.8, 0.8),
                    ],
                },
                "properties": {
                    "tipo": "noticia",
                    "titulo": n.titulo,
                    "severidade": n.severidade,
                    "categoria": n.categoria,
                    "fonte": n.fonte,
                },
            })
    except Exception as e:
        log.error("mapa_noticias_falhou", erro=str(e)[:300])

    log.info("mapa_total", total=len(features))
    return {
        "type": "FeatureCollection",
        "features": features,
        "total": len(features),
    }
