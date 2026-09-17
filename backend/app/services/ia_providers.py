"""Provedores de LLM em cascata: Groq -> Gemini -> Ollama."""

from dataclasses import dataclass

import httpx

from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

TIMEOUT_GROQ = 30.0
TIMEOUT_GEMINI = 30.0
TIMEOUT_OLLAMA = 180.0


class ProvedorIndisponivel(Exception):
    """Erro quando um provedor de IA falha."""


@dataclass
class RespostaIA:
    texto: str
    provedor: str
    modelo: str


# ============================================================
# GROQ
# ============================================================
async def groq_completar(
    mensagens: list[dict],
    temperatura: float = 0.3,
    max_tokens: int = 2048,
) -> RespostaIA:
    if not settings.groq_api_key:
        raise ProvedorIndisponivel("GROQ_API_KEY nao configurada")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": settings.groq_model,
        "messages": mensagens,
        "temperature": temperatura,
        "max_tokens": max_tokens,
    }

    async with httpx.AsyncClient(timeout=TIMEOUT_GROQ) as client:
        r = await client.post(url, headers=headers, json=payload)
        if r.status_code != 200:
            raise ProvedorIndisponivel(
                f"Groq {r.status_code}: {r.text[:200]}"
            )
        data = r.json()

    try:
        texto = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        raise ProvedorIndisponivel(f"Groq resposta invalida: {e}")

    if not texto or not texto.strip():
        raise ProvedorIndisponivel("Groq retornou vazio")

    return RespostaIA(
        texto=texto.strip(),
        provedor="groq",
        modelo=settings.groq_model,
    )


# ============================================================
# GEMINI
# ============================================================
async def gemini_completar(
    mensagens: list[dict],
    temperatura: float = 0.3,
    max_tokens: int = 2048,
) -> RespostaIA:
    if not settings.gemini_api_key:
        raise ProvedorIndisponivel("GEMINI_API_KEY nao configurada")

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent"
        f"?key={settings.gemini_api_key}"
    )

    contents = []
    system_instruction = None
    for m in mensagens:
        if m["role"] == "system":
            system_instruction = {"parts": [{"text": m["content"]}]}
        else:
            role = "user" if m["role"] == "user" else "model"
            contents.append(
                {"role": role, "parts": [{"text": m["content"]}]}
            )

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": temperatura,
            "maxOutputTokens": max_tokens,
        },
    }
    if system_instruction:
        payload["systemInstruction"] = system_instruction

    async with httpx.AsyncClient(timeout=TIMEOUT_GEMINI) as client:
        r = await client.post(url, json=payload)
        if r.status_code != 200:
            raise ProvedorIndisponivel(
                f"Gemini {r.status_code}: {r.text[:200]}"
            )
        data = r.json()

    try:
        texto = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as e:
        raise ProvedorIndisponivel(f"Gemini resposta invalida: {e}")

    if not texto or not texto.strip():
        raise ProvedorIndisponivel("Gemini retornou vazio")

    return RespostaIA(
        texto=texto.strip(),
        provedor="gemini",
        modelo=settings.gemini_model,
    )


# ============================================================
# OLLAMA
# ============================================================
async def ollama_completar(
    mensagens: list[dict],
    temperatura: float = 0.3,
    max_tokens: int = 2048,
) -> RespostaIA:
    url = f"{settings.ollama_host}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "messages": mensagens,
        "stream": False,
        "options": {
            "temperature": temperatura,
            "num_predict": max_tokens,
        },
    }

    async with httpx.AsyncClient(timeout=TIMEOUT_OLLAMA) as client:
        r = await client.post(url, json=payload)
        if r.status_code != 200:
            raise ProvedorIndisponivel(f"Ollama {r.status_code}")
        data = r.json()

    texto = data.get("message", {}).get("content", "").strip()

    # deepseek-r1 as vezes retorna vazio - tenta pegar do thinking
    if not texto:
        thinking = data.get("message", {}).get("thinking", "")
        if thinking:
            linhas = [l for l in thinking.split("\n") if l.strip()]
            texto = linhas[-1] if linhas else ""

    if not texto:
        raise ProvedorIndisponivel("Ollama retornou resposta vazia")

    return RespostaIA(
        texto=texto,
        provedor="ollama",
        modelo=settings.ollama_model,
    )


# ============================================================
# CASCATA
# ============================================================
async def completar_cascata(
    mensagens: list[dict],
    temperatura: float = 0.3,
    max_tokens: int = 2048,
) -> RespostaIA:
    """Tenta Groq -> Gemini -> Ollama em ordem."""
    erros = []

    provedores = [
        ("groq", groq_completar),
        ("gemini", gemini_completar),
        ("ollama", ollama_completar),
    ]

    for nome, fn in provedores:
        try:
            log.info("ia_tentando", provedor=nome)
            resposta = await fn(
                mensagens,
                temperatura=temperatura,
                max_tokens=max_tokens,
            )
            log.info(
                "ia_sucesso",
                provedor=resposta.provedor,
                tamanho=len(resposta.texto),
            )
            return resposta
        except Exception as e:
            erro_msg = str(e)[:150]
            log.warning(
                "ia_falhou",
                provedor=nome,
                erro=erro_msg,
            )
            erros.append(f"{nome}: {erro_msg}")
            continue

    raise ProvedorIndisponivel(
        f"Todos os provedores falharam: {'; '.join(erros)}"
    )
