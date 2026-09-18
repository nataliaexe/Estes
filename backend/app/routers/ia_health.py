"""Status do circuit breaker dos provedores de IA."""

from fastapi import APIRouter

from app.core.circuit_breaker import circuit_breaker

router = APIRouter(prefix="/ia", tags=["ia"])


@router.get("/circuit-breaker")
async def status_circuit_breaker():
    return circuit_breaker.status()
