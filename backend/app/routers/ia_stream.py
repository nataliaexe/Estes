"""Endpoint de streaming do agente IA via Server-Sent Events."""

import json

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.core.logging import get_logger
from app.schemas.ia import PerguntaIA
from app.services.ia_agent import (
    ContextoAgente,
    _formatar_contexto_plataforma,
    _formatar_contexto_web,
    classificar_intencao,
)
from app.services.busca_plataforma import buscar_plataforma
from app.services.busca_web import buscar_web
from app.services.ia_providers import (
    ProvedorIndisponivel,
    completar_stream,
)

log = get_logger(__name__)
router = APIRouter(prefix="/ia", tags=["ia"])
limiter = Limiter(key_func=get_remote_address)


def _sse(evento: str, dados: dict) -> str:
    return f"event: {evento}\ndata: {json.dumps(dados, ensure_ascii=False)}\n\n"


@router.post("/stream")
@limiter.limit(settings.ia_rate_limit)
async def stream(
    request: Request,
    body: PerguntaIA,
    session: AsyncSession = Depends(get_session),
):
    """Streaming do agente IA. Formato: SSE."""

    async def gerar():
        try:
            intencao = await classificar_intencao(body.pergunta)
            yield _sse("intencao", {"tipo": intencao})

            contexto_extra = []
            fontes = []
            ferramentas = []

            if intencao in ("PLATAFORMA", "AMBAS"):
                try:
                    resultados = await buscar_plataforma(
                        session, body.pergunta, limite=5
                    )
                    if resultados:
                        ferramentas.append("busca_plataforma")
                        contexto_extra.append(
                            _formatar_contexto_plataforma(resultados)
                        )
                        for r in resultados:
                            fontes.append(
                                {
                                    "tipo": "atlas",
                                    "titulo": r.titulo,
                                    "score": round(r.score, 3),
                                }
                            )
                except Exception as e:
                    log.warning("stream_plataforma_falhou", erro=str(e)[:150])

            if intencao in ("WEB", "AMBAS"):
                try:
                    consulta = body.pergunta
                    if body.uf:
                        consulta = f"{consulta} {body.uf}"
                    resultados = await buscar_web(consulta, max_resultados=4)
                    if resultados:
                        ferramentas.append("busca_web")
                        contexto_extra.append(_formatar_contexto_web(resultados))
                        for r in resultados:
                            fontes.append(
                                {"tipo": "web", "titulo": r.titulo, "url": r.url}
                            )
                except Exception as e:
                    log.warning("stream_web_falhou", erro=str(e)[:150])

            yield _sse("fontes", {"fontes": fontes, "ferramentas": ferramentas})

            from app.services.ia_agent import SYSTEM_PROMPT

            mensagens = [{"role": "system", "content": SYSTEM_PROMPT}]

            dados_usuario = []
            if body.uf:
                dados_usuario.append(f"UF: {body.uf}")
            if body.municipio:
                dados_usuario.append(f"Municipio: {body.municipio}")
            if dados_usuario:
                mensagens.append(
                    {
                        "role": "system",
                        "content": "=== DADOS DO USUARIO ===\n"
                        + "\n".join(dados_usuario),
                    }
                )

            for msg in body.historico[-6:]:
                mensagens.append(
                    {"role": msg.role, "content": msg.content}
                )

            if contexto_extra:
                mensagens.append(
                    {
                        "role": "system",
                        "content": "\n\n".join(contexto_extra),
                    }
                )

            mensagens.append({"role": "user", "content": body.pergunta})

            try:
                async for pedaco in completar_stream(mensagens):
                    yield _sse("token", {"texto": pedaco})
                yield _sse("fim", {"ok": True})
            except ProvedorIndisponivel as e:
                yield _sse("erro", {"mensagem": str(e)[:300]})

        except Exception as e:
            log.error("stream_erro", erro=str(e)[:300])
            yield _sse("erro", {"mensagem": "Erro inesperado"})

    return StreamingResponse(
        gerar(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
