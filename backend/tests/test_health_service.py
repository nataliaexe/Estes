import asyncio

import httpx
import pytest

from app.core.config import settings
from app.core import cache
from app.services import health
from app.services.health import _medir


@pytest.mark.asyncio
async def test_service_probe_times_out():
    async def never_finishes():
        await asyncio.sleep(1)

    result = await _medir("slow", never_finishes, timeout=0.01)

    assert result.ok is False
    assert result.erro == "TimeoutError"


@pytest.mark.asyncio
async def test_service_probe_redacts_configured_api_key(monkeypatch):
    secret = "test-secret-do-not-return"
    monkeypatch.setattr(settings, "gemini_api_key", secret)

    async def raises_with_secret():
        raise RuntimeError(f"request failed for key {secret}")

    result = await _medir("gemini", raises_with_secret)

    assert result.ok is False
    assert secret not in (result.erro or "")
    assert "[redacted]" in (result.erro or "")


@pytest.mark.asyncio
async def test_http_error_does_not_return_request_url():
    secret = "sensitive-value"
    request = httpx.Request("GET", f"https://example.org/{secret}")
    response = httpx.Response(429, request=request)
    error = httpx.HTTPStatusError("limited", request=request, response=response)

    async def raises_http_status():
        raise error

    result = await _medir("source", raises_http_status)

    assert result.erro == "HTTP 429"
    assert secret not in (result.erro or "")


@pytest.mark.asyncio
async def test_cache_close_releases_client(monkeypatch):
    class FakeRedis:
        closed = False

        async def aclose(self):
            self.closed = True

    fake = FakeRedis()
    monkeypatch.setattr(cache, "_client", fake)

    await cache.cache_close()

    assert fake.closed is True
    assert cache._client is None


@pytest.mark.asyncio
async def test_ollama_probe_requires_configured_model(monkeypatch):
    class FakeResponse:
        status_code = 200

        def __init__(self, models):
            self.models = models

        def raise_for_status(self):
            return None

        def json(self):
            return {"models": [{"name": name} for name in self.models]}

    class FakeClient:
        models = []

        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return None

        async def get(self, *args, **kwargs):
            return FakeResponse(self.models)

    monkeypatch.setattr(health.httpx, "AsyncClient", FakeClient)
    FakeClient.models = ["model-that-is-not-configured:latest"]
    missing = await health._testar_ollama()
    FakeClient.models = [settings.ollama_model]
    present = await health._testar_ollama()

    assert missing.ok is False
    assert present.ok is True
