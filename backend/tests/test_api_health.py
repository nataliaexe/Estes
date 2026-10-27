import pytest


@pytest.mark.asyncio
async def test_root_and_health_endpoints(client):
    root = await client.get("/")
    health = await client.get("/health")

    assert root.status_code == 200
    assert root.json()["nome"] == "Estes"
    assert root.json()["docs"] == "/docs"
    assert health.status_code == 200
    assert health.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_cors_does_not_allow_credentials(client):
    response = await client.options(
        "/health",
        headers={
            "Origin": "https://example.org",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "*"
    assert "access-control-allow-credentials" not in response.headers
