from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.cache import cache_close
from app.core.config import settings
from app.core.database import engine
from app.core.logging import configurar_logging, get_logger
from app.core.scheduler import parar_scheduler
from app.api.routes import (
    cases,
    evidence,
    hypotheses,
    materials,
    protocols,
    search,
)
from app.routers import (
    health,
)

configurar_logging()
log = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info(
        "estes_iniciando",
        env=settings.app_env,
        ollama=settings.ollama_model,
        groq=bool(settings.groq_api_key),
        gemini=bool(settings.gemini_api_key),
        tavily=bool(settings.tavily_api_key),
        firms=bool(settings.firms_api_key),
    )
    # iniciar_scheduler()  # desativado em dev
    try:
        yield
    finally:
        parar_scheduler()
        await cache_close()
        await engine.dispose()
        log.info("estes_encerrando")


app = FastAPI(
    title=settings.app_name,
    version="0.5.0",
    description=(
        "Environmental investigation platform. "
        "Organizes and tracks environmental investigations based on "
        "scientific evidence, local materials, and traceable hypotheses."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = settings.api_v1_prefix

# MVP routers
app.include_router(cases.router, prefix=PREFIX)
app.include_router(evidence.router, prefix=PREFIX)
app.include_router(materials.router, prefix=PREFIX)
app.include_router(hypotheses.router, prefix=PREFIX)
app.include_router(protocols.router, prefix=PREFIX)
app.include_router(search.router, prefix=PREFIX)
app.include_router(health.router, prefix=PREFIX)


@app.get("/")
async def raiz():
    return {"nome": settings.app_name, "versao": "0.5.0", "docs": "/docs"}


@app.get("/health")
async def health_raiz():
    return {"status": "ok"}
