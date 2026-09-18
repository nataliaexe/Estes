"""Scheduler para coleta periodica de noticias."""

import asyncio
from contextlib import suppress
from datetime import UTC, datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.core.database import SessionLocal
from app.core.logging import get_logger
from app.services.noticias import coletar_noticias_por_regiao, salvar_noticias

log = get_logger(__name__)

_scheduler: AsyncIOScheduler | None = None

UFS_PRIORITARIAS = ["MG", "PA", "RR", "AC", "MT", "RS", "AM", "BA"]


async def coletar_todas() -> None:
    """Coleta noticias para as UFs prioritarias."""
    log.info("coleta_automatica_inicio", ufs=UFS_PRIORITARIAS)
    total = 0

    async with SessionLocal() as session:
        for uf in UFS_PRIORITARIAS:
            try:
                coletadas = await coletar_noticias_por_regiao(
                    session, uf=uf, max_resultados=5
                )
                salvas = await salvar_noticias(session, coletadas)
                total += salvas
                log.info("coleta_uf_ok", uf=uf, salvas=salvas)
            except Exception as e:
                log.warning("coleta_uf_falhou", uf=uf, erro=str(e)[:150])

    log.info("coleta_automatica_fim", total_salvas=total)


def iniciar_scheduler() -> AsyncIOScheduler:
    global _scheduler
    if _scheduler is not None:
        return _scheduler

    _scheduler = AsyncIOScheduler(timezone="UTC")
    _scheduler.add_job(
        coletar_todas,
        trigger=IntervalTrigger(minutes=30),
        id="coleta_noticias",
        max_instances=1,
        coalesce=True,
        # next_run_time=datetime.now(UTC),  # roda so no intervalo
    )
    _scheduler.start()
    log.info("scheduler_iniciado", interval="30 min")
    return _scheduler


def parar_scheduler() -> None:
    global _scheduler
    if _scheduler is not None:
        _scheduler.shutdown(wait=False)
        _scheduler = None
        log.info("scheduler_parado")
