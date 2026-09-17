"""Testa disponibilidade das APIs externas."""

import asyncio
import time
from dataclasses import dataclass
from collections.abc import Awaitable, Callable

import httpx

from app.core.cache import cache_ping
from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)


@dataclass
class StatusServico:
    nome: str
    ok: bool
    latencia_ms: float
    erro: str | None = None


async def _medir(nome: str, coro_factory: Callable[[], Awaitable]) -> StatusServico:
    inicio = time.time()
    try:
        await coro_factory()
        return StatusServico(nome, True, (time.time() - inicio) * 1000)
    except Exception as e:
        return StatusServico(
            nome,
            False,
            (time.time() - inicio) * 1000,
            str(e)[:200],
        )


async def testar_todos() -> list[StatusServico]:
    return await asyncio.gather(
        _testar_redis(),
        _testar_ollama(),
        _testar_groq(),
        _testar_gemini(),
        _testar_openmeteo(),
    )


async def _testar_redis() -> StatusServico:
    async def _f():
        if not await cache_ping():
            raise RuntimeError("redis nao responde")

    return await _medir("redis", _f)


async def _testar_ollama() -> StatusServico:
    async def _f():
        async with httpx.AsyncClient(timeout=5.0) as c:
            r = await c.get(f"{settings.ollama_host}/api/tags")
            r.raise_for_status()

    return await _medir("ollama", _f)


async def _testar_groq() -> StatusServico:
    async def _f():
        if not settings.groq_api_key:
            raise ValueError("sem chave")
        async with httpx.AsyncClient(timeout=10.0) as c:
            r = await c.get(
                "https://api.groq.com/openai/v1/models",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
            )
            r.raise_for_status()

    return await _medir("groq", _f)


async def _testar_gemini() -> StatusServico:
    async def _f():
        if not settings.gemini_api_key:
            raise ValueError("sem chave")
        async with httpx.AsyncClient(timeout=10.0) as c:
            r = await c.get(
                "https://generativelanguage.googleapis.com/v1beta/models"
                f"?key={settings.gemini_api_key}"
            )
            r.raise_for_status()

    return await _medir("gemini", _f)


async def _testar_openmeteo() -> StatusServico:
    async def _f():
        async with httpx.AsyncClient(timeout=5.0) as c:
            r = await c.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": -23.5,
                    "longitude": -46.6,
                    "current": "temperature_2m",
                },
            )
            r.raise_for_status()

    return await _medir("open_meteo", _f)
