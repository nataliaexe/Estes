"""Geracao de imagens passo a passo via Pollinations.ai (gratuito, sem chave)."""

import hashlib
import urllib.parse
from dataclasses import dataclass
from pathlib import Path

import httpx

from app.core.logging import get_logger

log = get_logger(__name__)

DIR_IMAGENS = Path("static/passos")
DIR_IMAGENS.mkdir(parents=True, exist_ok=True)

POLLINATIONS_URL = "https://image.pollinations.ai/prompt"


@dataclass
class ImagemGerada:
    passo: int
    descricao: str
    url: str
    caminho_local: str


async def gerar_imagem_passo(
    descricao: str,
    contexto: str,
    passo_num: int,
    caso_numero: int,
) -> ImagemGerada | None:
    """Gera UMA imagem de um passo do protocolo."""
    # Prompt otimizado pra ilustracao tecnica
    prompt = (
        f"Technical illustration: {descricao}. "
        f"Context: {contexto}. "
        f"Style: clean diagram, hand-drawn science notebook, "
        f"earth tones (green, brown, cream), simple, instructional, "
        f"no text, no watermark, minimalist, warm lighting."
    )

    # Hash unico por passo
    hash_id = hashlib.md5(
        f"{caso_numero}-{passo_num}-{descricao}".encode()
    ).hexdigest()[:16]

    nome_arquivo = f"caso{caso_numero}-passo{passo_num}-{hash_id}.jpg"
    caminho = DIR_IMAGENS / nome_arquivo

    # Se ja existe, retorna
    if caminho.exists():
        log.info("imagem_cache_hit", arquivo=nome_arquivo)
        return ImagemGerada(
            passo=passo_num,
            descricao=descricao,
            url=f"/api/v1/imagens/{nome_arquivo}",
            caminho_local=str(caminho),
        )

    # Gera via Pollinations
    url_encoded = urllib.parse.quote(prompt)
    # Modelos: flux (rapido, realista), flux-realism, dreamshaper, etc
    # flux-schnell = rapido
    # dreamshaper-8-lcm = artistico
    modelo = "flux"
    url_poll = (
        f"{POLLINATIONS_URL}/{url_encoded}"
        f"?width=512&height=512&nologo=true&model={modelo}"
    )

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.get(url_poll, follow_redirects=True)
            if r.status_code != 200:
                log.warning("pollinations_erro", status=r.status_code)
                return None
            caminho.write_bytes(r.content)
    except httpx.HTTPError as e:
        log.warning("pollinations_rede", erro=str(e)[:150])
        return None

    log.info("imagem_gerada", arquivo=nome_arquivo)

    return ImagemGerada(
        passo=passo_num,
        descricao=descricao,
        url=f"/api/v1/imagens/{nome_arquivo}",
        caminho_local=str(caminho),
    )


async def gerar_passos_visuais(
    caso_numero: int,
    contexto: str,
    passos: list[str],
    max_passos: int = 8,
) -> list[dict]:
    """Gera imagens de todos os passos."""
    resultados = []

    for i, descricao in enumerate(passos[:max_passos], 1):
        try:
            img = await gerar_imagem_passo(
                descricao=descricao,
                contexto=contexto,
                passo_num=i,
                caso_numero=caso_numero,
            )
            if img:
                resultados.append({
                    "passo": img.passo,
                    "descricao": descricao,
                    "foto_url": img.url,
                })
        except Exception as e:
            log.warning("gerar_passo_falhou", passo=i, erro=str(e)[:100])

    return resultados
