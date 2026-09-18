"""Traduz os 22 casos do Atlas para ingles usando Gemini.

Salva titulo/problema/solucao/recurso_local/historia como JSONB {pt, en}.
"""

import asyncio
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import httpx  # noqa: E402
from sqlalchemy import select  # noqa: E402

from app.core.config import settings  # noqa: E402
from app.core.database import SessionLocal  # noqa: E402
from app.core.logging import configurar_logging, get_logger  # noqa: E402
from app.models.caso import Caso  # noqa: E402

configurar_logging()
log = get_logger(__name__)

PROMPT_TRADUCAO = """You are a professional translator for an environmental
citizenship platform. Translate the following Brazilian Portuguese text to
English.

Rules:
- Keep proper nouns (Maxakali, Yanomami, Waimiri Atroari, Cerrado, Pantanal,
  Eucalyptus, Açaí, etc) as-is or use standard English form
- Keep technical terms accurate (CQD = carbon quantum dots, CNC = cellulose
  nanocrystals, biochar = biochar, TDS = total dissolved solids)
- Preserve tone: accessible, direct, warm
- Do not add explanations, just the translation

Return ONLY the translation, no quotes, no comments."""


async def traduzir_texto(texto: str, tentativa: int = 1) -> str:
    """Traduz um texto via Gemini com retry."""
    if not texto or not settings.gemini_api_key:
        return texto or ""

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent"
        f"?key={settings.gemini_api_key}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{PROMPT_TRADUCAO}\n\nTEXT:\n{texto}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 2000,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(url, json=payload)

            if r.status_code == 429:
                if tentativa <= 3:
                    espera = 30 * tentativa
                    log.warning("rate_limit", espera_seg=espera, tentativa=tentativa)
                    await asyncio.sleep(espera)
                    return await traduzir_texto(texto, tentativa + 1)
                log.warning("rate_limit_esgotado")
                return texto

            if r.status_code == 503:
                if tentativa <= 3:
                    espera = 10 * tentativa
                    log.warning("servico_indisponivel", espera_seg=espera)
                    await asyncio.sleep(espera)
                    return await traduzir_texto(texto, tentativa + 1)
                log.warning("servico_indisponivel_esgotado")
                return texto

            if r.status_code != 200:
                log.warning("traducao_falhou", status=r.status_code)
                return texto

            data = r.json()
            return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        log.warning("traducao_excecao", erro=str(e)[:150])
        return texto


async def traduzir_caso(caso: Caso) -> dict:
    """Traduz todos os campos textuais do caso."""
    campos_pt = {
        "titulo": caso.titulo if isinstance(caso.titulo, str) else caso.titulo.get("pt", ""),
        "problema": caso.problema if isinstance(caso.problema, str) else caso.problema.get("pt", ""),
        "solucao": caso.solucao if isinstance(caso.solucao, str) else caso.solucao.get("pt", ""),
        "recurso_local": caso.recurso_local if isinstance(caso.recurso_local, str) else caso.recurso_local.get("pt", ""),
        "historia": caso.historia if isinstance(caso.historia, str) else caso.historia.get("pt", ""),
    }

    # Traduz sequencialmente (nao paralelo, pra nao bater rate limit)
    resultado = {}
    for campo, texto_pt in campos_pt.items():
        if not texto_pt:
            resultado[campo] = {"pt": "", "en": ""}
            continue

        log.info("traduzindo", caso=caso.numero, campo=campo)
        texto_en = await traduzir_texto(texto_pt)
        resultado[campo] = {"pt": texto_pt, "en": texto_en}
        await asyncio.sleep(5.0)

    return resultado


async def main() -> None:
    log.info("traducao_inicio")

    async with SessionLocal() as session:
        result = await session.execute(select(Caso).order_by(Caso.numero))
        casos = result.scalars().all()

        total = len(casos)
        for i, caso in enumerate(casos, 1):
            log.info("caso_traducao", atual=i, total=total, numero=caso.numero)

            traducoes = await traduzir_caso(caso)

            caso.titulo = traducoes["titulo"]
            caso.problema = traducoes["problema"]
            caso.solucao = traducoes["solucao"]
            caso.recurso_local = traducoes["recurso_local"]
            caso.historia = traducoes["historia"]

            await session.commit()

    log.info("traducao_fim", total=total)
    print()
    print("=" * 60)
    print(f"Traduduzidos {total} casos (pt + en)")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
