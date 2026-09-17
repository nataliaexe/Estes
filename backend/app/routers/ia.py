from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.core.logging import get_logger
from app.schemas.ia import (
    PerguntaIA,
    RespostaIAOut,
    StatusIA,
)
from app.services.ia_agent import ContextoAgente, responder

log = get_logger(__name__)
router = APIRouter(prefix="/ia", tags=["ia"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/perguntar", response_model=RespostaIAOut)
@limiter.limit(settings.ia_rate_limit)
async def perguntar(
    request: Request,
    body: PerguntaIA,
    session: AsyncSession = Depends(get_session),
) -> RespostaIAOut:
    """Pergunta para o agente. Ele busca no Atlas + web e responde."""
    log.info(
        "pergunta_recebida",
        uf=body.uf,
        municipio=body.municipio,
        tamanho=len(body.pergunta),
    )

    contexto = ContextoAgente(
        perfil="cidadao",
        uf=body.uf,
        municipio=body.municipio,
        latitude=body.latitude,
        longitude=body.longitude,
        historico=[m.model_dump() for m in body.historico],
    )

    try:
        resposta = await responder(session, body.pergunta, contexto)
    except Exception as e:
        log.error("pergunta_erro", erro=str(e)[:300])
        raise HTTPException(
            status_code=500,
            detail="Erro ao processar pergunta.",
        )

    return RespostaIAOut(
        texto=resposta.texto,
        provedor=resposta.provedor,
        modelo=resposta.modelo,
        intencao=resposta.intencao,
        fontes=resposta.fontes,
        ferramentas_usadas=resposta.ferramentas_usadas,
        sugestoes=resposta.sugestoes,
    )


@router.get("/status", response_model=StatusIA)
async def status_ia() -> StatusIA:
    """Verifica quais provedores estao configurados."""
    return StatusIA(
        groq=bool(settings.groq_api_key),
        gemini=bool(settings.gemini_api_key),
        ollama=True,
        tavily=bool(settings.tavily_api_key),
        ollama_model=settings.ollama_model,
        embedding_model=settings.embedding_model,
    )
