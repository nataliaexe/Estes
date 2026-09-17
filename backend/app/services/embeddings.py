"""Geracao de embeddings via Ollama (nomic-embed-text).

Nao usa sentence-transformers (que exige PyTorch).
Usa HTTP direto ao Ollama local.
"""

import httpx

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)


class EmbeddingError(Exception):
    """Erro ao gerar embedding."""


async def gerar_embedding(texto: str) -> list[float]:
    """Gera embedding de um texto via Ollama."""
    if not texto or not texto.strip():
        raise EmbeddingError("Texto vazio nao pode gerar embedding")

    url = f"{settings.ollama_host}/api/embeddings"
    payload = {
        "model": settings.embedding_model,
        "prompt": texto,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(url, json=payload)
            if r.status_code != 200:
                log.warning(
                    "ollama_embedding_erro",
                    status=r.status_code,
                    body=r.text[:200],
                )
                raise EmbeddingError(
                    f"Ollama retornou status {r.status_code}"
                )
            data = r.json()
    except httpx.HTTPError as e:
        raise EmbeddingError(f"Erro de rede ao chamar Ollama: {e}")

    if "embedding" not in data:
        raise EmbeddingError("Resposta do Ollama sem campo 'embedding'")

    vetor = data["embedding"]

    if len(vetor) != settings.embedding_dim:
        log.warning(
            "embedding_dim_inesperada",
            esperado=settings.embedding_dim,
            recebido=len(vetor),
        )

    return vetor


async def gerar_embeddings_lote(textos: list[str]) -> list[list[float]]:
    """Gera embeddings em sequencia (Ollama nao tem batch nativo).

    Para listas grandes, considere paralelizar com asyncio.gather
    (mas cuidado com a carga no Ollama).
    """
    resultados = []
    for i, texto in enumerate(textos):
        try:
            emb = await gerar_embedding(texto)
            resultados.append(emb)
            log.debug("embedding_gerado", indice=i, dim=len(emb))
        except EmbeddingError as e:
            log.warning("embedding_falhou", indice=i, erro=str(e))
            resultados.append([])

    return resultados
