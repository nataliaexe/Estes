"""Endpoints de exportacao de dados abertos."""

import csv
import io

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.models.caso import Caso

router = APIRouter(prefix="/exportar", tags=["exportar"])


@router.get("/casos.csv")
async def casos_csv(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Caso).order_by(Caso.numero))
    casos = result.scalars().all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow([
        "numero", "titulo", "uf", "categoria", "tipo_solucao",
        "precisa_hardware", "evidencia", "problema",
        "recurso_local", "solucao",
    ])
    for c in casos:
        writer.writerow([
            c.numero, c.titulo, c.uf, c.categoria, c.tipo_solucao,
            c.precisa_hardware, c.evidencia, c.problema,
            c.recurso_local, c.solucao,
        ])

    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=estes_casos.csv"
        },
    )


@router.get("/casos.json")
async def casos_json(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Caso).order_by(Caso.numero))
    casos = result.scalars().all()

    return {
        "total": len(casos),
        "casos": [
            {
                "numero": c.numero,
                "titulo": c.titulo,
                "uf": c.uf,
                "categoria": c.categoria,
                "tipo_solucao": c.tipo_solucao,
                "precisa_hardware": c.precisa_hardware,
                "evidencia": c.evidencia,
                "problema": c.problema,
                "recurso_local": c.recurso_local,
                "solucao": c.solucao,
            }
            for c in casos
        ],
    }
