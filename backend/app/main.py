from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logging import configurar_logging, get_logger
from app.core.scheduler import iniciar_scheduler, parar_scheduler
from app.routers import (
    acessibilidade,
    achievements,
    auth,
    casos,
    clima,
    contribuicoes,
    dashboard,
    documentos,
    explorar,
    exportar,
    hardware,
    health,
    imagens,
    ia,
    ia_health,
    ia_imagens,
    ia_vision,
    ia_stream,
    mapa,
    memoria,
    noticias,
    noticias_stream,
    predicao,
    queimadas,
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
    yield
    parar_scheduler()
    log.info("estes_encerrando")


app = FastAPI(
    title=settings.app_name,
    version="0.4.0",
    description=(
        "Plataforma de cidadania ambiental. "
        "Transforma recursos locais em solucoes ambientais "
        "e garante direitos por meio de evidencia cientifica."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers.ia import limiter  # noqa: E402

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

PREFIX = settings.api_v1_prefix

# Routers
app.include_router(auth.router, prefix=PREFIX)
app.include_router(casos.router, prefix=PREFIX)
app.include_router(acessibilidade.router, prefix=PREFIX)
app.include_router(achievements.router, prefix=PREFIX)
app.include_router(clima.router, prefix=PREFIX)
app.include_router(queimadas.router, prefix=PREFIX)
app.include_router(predicao.router, prefix=PREFIX)
app.include_router(noticias_stream.router, prefix=PREFIX)
app.include_router(hardware.router, prefix=PREFIX)
app.include_router(noticias.router, prefix=PREFIX)
app.include_router(documentos.router, prefix=PREFIX)
app.include_router(dashboard.router, prefix=PREFIX)
app.include_router(mapa.router, prefix=PREFIX)
app.include_router(memoria.router, prefix=PREFIX)
app.include_router(exportar.router, prefix=PREFIX)
app.include_router(explorar.router, prefix=PREFIX)
app.include_router(health.router, prefix=PREFIX)
app.include_router(imagens.router, prefix=PREFIX)

# IA (ordem importa: stream antes do router principal)
app.include_router(ia_stream.router, prefix=PREFIX)
app.include_router(ia_imagens.router, prefix=PREFIX)
app.include_router(contribuicoes.router, prefix=PREFIX)
app.include_router(ia.router, prefix=PREFIX)
app.include_router(ia_health.router, prefix=PREFIX)
app.include_router(ia_vision.router, prefix=PREFIX)


@app.get("/")
async def raiz():
    return {"nome": settings.app_name, "versao": "0.4.0", "docs": "/docs"}


@app.get("/health")
async def health_raiz():
    return {"status": "ok"}
