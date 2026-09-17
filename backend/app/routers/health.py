from fastapi import APIRouter

from app.services.health import testar_todos

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/apis")
async def health_apis():
    servicos = await testar_todos()
    return {
        "servicos": [
            {
                "nome": s.nome,
                "ok": s.ok,
                "latencia_ms": round(s.latencia_ms, 1),
                "erro": s.erro,
            }
            for s in servicos
        ],
        "todos_ok": all(s.ok for s in servicos),
    }
