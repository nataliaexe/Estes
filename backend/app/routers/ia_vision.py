"""Chat com visao: usuario manda foto, IA diagnostica."""

import base64

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

from app.core.config import settings
from app.core.database import get_session
from app.core.logging import get_logger
from app.services.ia_providers import (
    ProvedorIndisponivel,
    completar_cascata,
)

log = get_logger(__name__)
router = APIRouter(prefix="/ia", tags=["ia"])


VISION_PROMPT = """You are the Estes Assistant, specialized in environmental
diagnosis. The user sent you a photo. Analyze it carefully.

You can help with:
1. WATER STRIPS - analyze color/fluorescence of a CQD sensor strip
2. PLANT/LEAF - identify if it's a known material (eucalyptus, coffee, etc)
3. CONTAMINATION - spot signs of pollution (oil, algae, dead fish)
4. SOIL - identify signs of erosion or contamination
5. EQUIPMENT - help assemble filters or sensors

Rules:
- Be honest about uncertainty
- If it's a water strip: classify as SAFE / CAUTION / CONTAMINATED
- Cite the Atlas case when relevant (e.g., "See Case #1")
- Give concrete next steps
- Never replace a lab test - always recommend confirmation

Answer in the user's language (detect from question).
"""


async def _analisar_com_gemini_vision(
    imagem_bytes: bytes,
    pergunta: str,
    mime: str = "image/jpeg",
) -> str:
    """Usa Gemini Vision pra analisar a imagem."""
    import httpx

    if not settings.gemini_api_key:
        raise ProvedorIndisponivel("GEMINI_API_KEY nao configurada")

    b64 = base64.b64encode(imagem_bytes).decode()

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent"
        f"?key={settings.gemini_api_key}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": VISION_PROMPT + f"\n\nUser question: {pergunta}"},
                    {
                        "inline_data": {
                            "mime_type": mime,
                            "data": b64,
                        }
                    },
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1500,
        },
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(url, json=payload)
        if r.status_code != 200:
            raise ProvedorIndisponivel(f"Gemini Vision {r.status_code}: {r.text[:200]}")
        data = r.json()

    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise ProvedorIndisponivel("Gemini Vision resposta invalida")


@router.post("/vision")
async def analisar_imagem(
    arquivo: UploadFile = File(...),
    pergunta: str = Form("What do you see? What should I do?"),
    session: AsyncSession = Depends(get_session),
):
    """Recebe foto + pergunta. IA diagnostica e orienta."""
    conteudo = await arquivo.read()
    if not conteudo:
        raise HTTPException(400, "Arquivo vazio")
    if len(conteudo) > 10 * 1024 * 1024:
        raise HTTPException(400, "Imagem muito grande (max 10 MB)")

    mime = arquivo.content_type or "image/jpeg"

    log.info("vision_inicio", tamanho=len(conteudo), pergunta=pergunta[:80])

    try:
        texto = await _analisar_com_gemini_vision(conteudo, pergunta, mime)
    except ProvedorIndisponivel as e:
        log.warning("vision_falhou", erro=str(e)[:200])
        # Fallback: usa analise basica de cor
        from app.services.analise_imagem import analisar_imagem

        try:
            resultado = analisar_imagem(conteudo)
            texto = (
                f"I couldn't analyze the image in detail, but based on the "
                f"color analysis: this looks like a **{resultado.classificacao}** "
                f"result. RGB: ({resultado.r:.0f}, {resultado.g:.0f}, {resultado.b:.0f}). "
                f"{resultado.recomendacao}"
            )
        except Exception:
            raise HTTPException(500, "Nao consegui analisar a imagem")

    return {
        "texto": texto,
        "provedor": "gemini_vision",
    }
