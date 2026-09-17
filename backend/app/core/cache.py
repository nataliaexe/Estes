"""Cache com Redis (assincrono)."""

import json
from typing import Any

import redis.asyncio as redis

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

_client: redis.Redis | None = None


async def get_client() -> redis.Redis:
    global _client
    if _client is None:
        _client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
        )
    return _client


async def cache_get(chave: str) -> Any | None:
    try:
        client = await get_client()
        valor = await client.get(chave)
        if valor is None:
            return None
        return json.loads(valor)
    except Exception as e:
        log.warning("cache_get_erro", chave=chave, erro=str(e)[:100])
        return None


async def cache_set(chave: str, valor: Any, ttl: int = 300) -> bool:
    try:
        client = await get_client()
        await client.setex(chave, ttl, json.dumps(valor, default=str))
        return True
    except Exception as e:
        log.warning("cache_set_erro", chave=chave, erro=str(e)[:100])
        return False


async def cache_delete(chave: str) -> bool:
    try:
        client = await get_client()
        await client.delete(chave)
        return True
    except Exception as e:
        log.warning("cache_delete_erro", chave=chave, erro=str(e)[:100])
        return False


async def cache_ping() -> bool:
    try:
        client = await get_client()
        return bool(await client.ping())
    except Exception:
        return False
