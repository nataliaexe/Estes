"""Streaming de noticias via SSE."""

import asyncio
import json
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.logging import get_logger
from app.models.noticia import Noticia
from app.services.noticias import coletar_noticias_por_regiao, salvar_noticias

log = get_logger(__name__)
router = APIRouter(prefix="/noticias", tags=["noticias"])


def _sse(evento: str, dados: dict) -> str:
    return f"event: {evento}\ndata: {json.dumps(dados, ensure_ascii=False)}\n\n"


@router.get("/stream")
async def stream_noticias(request: Request, uf: str = "MG"):
    async def gerar():
        ids_enviados = set()
        contador = 0

        while contador < 60:
            if await request.is_disconnected():
                break

            try:
                if contador % 5 == 0:
                    async with SessionLocal() as s:
                        try:
                            coletadas = await coletar_noticias_por_regiao(
                                s, uf=uf, max_resultados=3
                            )
                            await salvar_noticias(s, coletadas)
                        except Exception as e:
                            log.warning("sse_coleta_falhou", erro=str(e)[:100])

                async with SessionLocal() as s:
                    stmt = (
                        select(Noticia)
                        .where(Noticia.uf == uf)
                        .where(
                            Noticia.coletada_em
                            >= datetime.now(UTC) - timedelta(hours=12)
                        )
                        .order_by(Noticia.coletada_em.desc())
                        .limit(20)
                    )
                    noticias = (await s.execute(stmt)).scalars().all()

                for n in noticias:
                    if str(n.id) in ids_enviados:
                        continue
                    ids_enviados.add(str(n.id))
                    yield _sse("noticia", {
                        "id": str(n.id),
                        "titulo": n.titulo,
                        "resumo": n.resumo,
                        "url": n.url,
                        "fonte": n.fonte,
                        "categoria": n.categoria,
                        "severidade": n.severidade,
                        "uf": n.uf,
                        "coletada_em": n.coletada_em.isoformat() if n.coletada_em else None,
                    })

                yield _sse("ping", {"ts": datetime.now(UTC).isoformat()})
                contador += 1
                await asyncio.sleep(30)

            except Exception as e:
                log.error("sse_erro", erro=str(e)[:200])
                yield _sse("erro", {"mensagem": "Erro interno"})
                break

        yield _sse("fim", {"ok": True})

    return StreamingResponse(
        gerar(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
