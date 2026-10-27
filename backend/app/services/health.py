"""Testa disponibilidade das APIs externas."""

import asyncio
import time
from dataclasses import dataclass
from collections.abc import Awaitable, Callable

import httpx
from sqlalchemy import text

from app.core.cache import cache_ping
from app.core.config import settings
from app.core.database import engine
from app.core.logging import get_logger

log = get_logger(__name__)


@dataclass
class StatusServico:
    nome: str
    ok: bool
    latencia_ms: float
    erro: str | None = None


async def _medir(
    nome: str,
    coro_factory: Callable[[], Awaitable],
    timeout: float = 8.0,
) -> StatusServico:
    inicio = time.time()
    try:
        await asyncio.wait_for(coro_factory(), timeout=timeout)
        return StatusServico(nome, True, (time.time() - inicio) * 1000)
    except Exception as e:
        if isinstance(e, httpx.HTTPStatusError):
            erro = f"HTTP {e.response.status_code}"
        else:
            erro = str(e)[:200] or type(e).__name__
        for segredo in (settings.groq_api_key, settings.gemini_api_key, settings.tavily_api_key):
            if segredo:
                erro = erro.replace(segredo, "[redacted]")
        return StatusServico(
            nome,
            False,
            (time.time() - inicio) * 1000,
            erro,
        )


async def testar_todos() -> list[StatusServico]:
    return await asyncio.gather(
        _testar_database(),
        _testar_redis(),
        _testar_ollama(),
        _testar_groq(),
        _testar_gemini(),
        _testar_openmeteo(),
        _testar_semantic_scholar(),
        _testar_crossref(),
        _testar_openalex(),
    )


async def _testar_database() -> StatusServico:
    async def _f():
        async with engine.connect() as conexao:
            await conexao.execute(text("SELECT 1"))

    return await _medir("postgresql", _f)


async def _testar_semantic_scholar() -> StatusServico:
    async def _f():
        async with httpx.AsyncClient(timeout=5.0) as c:
            resposta = await c.get(
                "https://api.semanticscholar.org/graph/v1/paper/search",
                params={"query": "water", "limit": 1, "fields": "title"},
            )
            resposta.raise_for_status()

    return await _medir("semantic_scholar", _f)


async def _testar_crossref() -> StatusServico:
    async def _f():
        async with httpx.AsyncClient(timeout=5.0) as c:
            resposta = await c.get(
                "https://api.crossref.org/works",
                params={"query": "water", "rows": 1},
            )
            resposta.raise_for_status()

    return await _medir("crossref", _f)


async def _testar_openalex() -> StatusServico:
    async def _f():
        async with httpx.AsyncClient(timeout=5.0) as c:
            resposta = await c.get(
                "https://api.openalex.org/works",
                params={"search": "water", "per-page": 1},
            )
            resposta.raise_for_status()

    return await _medir("openalex", _f)


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
            modelos = {item.get("name") for item in r.json().get("models", [])}
            configurado = settings.ollama_model
            presente = configurado in modelos or (
                ":" not in configurado
                and any(nome.startswith(f"{configurado}:") for nome in modelos if nome)
            )
            if not presente:
                raise RuntimeError("modelo Ollama configurado nao instalado")

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
                "https://generativelanguage.googleapis.com/v1beta/models",
                headers={"x-goog-api-key": settings.gemini_api_key},
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
