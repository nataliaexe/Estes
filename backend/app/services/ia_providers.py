"""Provedores de LLM em cascata: Groq -> Gemini -> Ollama."""

import time
from collections.abc import AsyncGenerator
from dataclasses import dataclass

import httpx

from app.core.circuit_breaker import circuit_breaker
from app.core.config import settings
from app.core.logging import get_logger

log = get_logger(__name__)

TIMEOUT_GROQ = 30.0
TIMEOUT_GEMINI = 60.0
TIMEOUT_OLLAMA = 90.0


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
    model_override: str | None = None,
) -> RespostaIA:
    if not settings.groq_api_key:
        raise ProvedorIndisponivel("GROQ_API_KEY nao configurada")

    if not circuit_breaker.esta_disponivel("groq"):
        raise ProvedorIndisponivel("Groq bloqueado (circuit breaker)")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    modelo = model_override or settings.groq_model

    payload = {
        "model": modelo,
        "messages": mensagens,
        "temperature": temperatura,
        "max_tokens": max_tokens,
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_GROQ) as client:
            r = await client.post(url, headers=headers, json=payload)

            if r.status_code == 429:
                # Le Retry-After se existir
                retry_after = int(r.headers.get("Retry-After", 2))
                await asyncio.sleep(min(retry_after, 5))
                circuit_breaker.registrar_falha("groq")
                raise ProvedorIndisponivel(f"Groq 429 rate limit")

            if r.status_code != 200:
                circuit_breaker.registrar_falha("groq")
                raise ProvedorIndisponivel(f"Groq {r.status_code}")

            data = r.json()
            circuito_ok = True

    except httpx.HTTPError as e:
        circuit_breaker.registrar_falha("groq")
        raise ProvedorIndisponivel(f"Groq rede: {e}")

    try:
        texto = data["choices"][0]["message"]["content"]
    except (KeyError, IndexError) as e:
        circuit_breaker.registrar_falha("groq")
        raise ProvedorIndisponivel(f"Groq resposta invalida: {e}")

    if not texto or not texto.strip():
        circuit_breaker.registrar_falha("groq")
        raise ProvedorIndisponivel("Groq retornou vazio")

    circuit_breaker.registrar_sucesso("groq")

    return RespostaIA(
        texto=texto.strip(),
        provedor="groq",
        modelo=modelo,
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

    if not circuit_breaker.esta_disponivel("gemini"):
        raise ProvedorIndisponivel("Gemini bloqueado (circuit breaker)")

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
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": temperatura,
            "maxOutputTokens": max_tokens,
        },
    }
    if system_instruction:
        payload["systemInstruction"] = system_instruction

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_GEMINI) as client:
            r = await client.post(url, json=payload)

            if r.status_code == 429:
                circuit_breaker.registrar_falha("gemini")
                raise ProvedorIndisponivel("Gemini 429 rate limit")

            if r.status_code != 200:
                circuit_breaker.registrar_falha("gemini")
                raise ProvedorIndisponivel(f"Gemini {r.status_code}")

            data = r.json()

    except httpx.HTTPError as e:
        circuit_breaker.registrar_falha("gemini")
        raise ProvedorIndisponivel(f"Gemini rede: {e}")

    try:
        # Parser tolerante para diferentes formatos do Gemini
        candidates = data.get("candidates", [])
        if not candidates:
            raise ProvedorIndisponivel("Gemini sem candidates")

        content = candidates[0].get("content", {})
        parts = content.get("parts", [])
        if not parts:
            # Tenta pegar texto de estrutura alternativa
            text = content.get("text") or data.get("text")
            if text:
                texto = text
            else:
                raise ProvedorIndisponivel(f"Gemini sem parts: {list(content.keys())}")
        else:
            # Pega o texto do primeiro part que tenha 'text'
            texto = ""
            for p in parts:
                if isinstance(p, dict) and "text" in p:
                    texto += p["text"]
            if not texto:
                raise ProvedorIndisponivel("Gemini sem texto nos parts")
    except (KeyError, IndexError, TypeError) as e:
        circuit_breaker.registrar_falha("gemini")
        raise ProvedorIndisponivel(f"Gemini resposta invalida: {e}")

    if not texto or not texto.strip():
        circuit_breaker.registrar_falha("gemini")
        raise ProvedorIndisponivel("Gemini retornou vazio")

    circuit_breaker.registrar_sucesso("gemini")

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
    if not circuit_breaker.esta_disponivel("ollama"):
        raise ProvedorIndisponivel("Ollama bloqueado (circuit breaker)")

    url = f"{settings.ollama_host}/api/chat"
    payload = {
        "model": settings.ollama_model,
        "messages": mensagens,
        "stream": False,
        "options": {
            "temperature": temperatura,
            "num_predict": min(max_tokens, 500),  # limita resposta
        },
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_OLLAMA) as client:
            r = await client.post(url, json=payload)
            if r.status_code != 200:
                circuit_breaker.registrar_falha("ollama")
                raise ProvedorIndisponivel(f"Ollama {r.status_code}")
            data = r.json()
    except httpx.HTTPError as e:
        circuit_breaker.registrar_falha("ollama")
        raise ProvedorIndisponivel(f"Ollama rede: {e}")

    texto = data.get("message", {}).get("content", "").strip()

    if not texto:
        thinking = data.get("message", {}).get("thinking", "")
        if thinking:
            linhas = [ln for ln in thinking.split("\n") if ln.strip()]
            texto = linhas[-1] if linhas else ""

    if not texto:
        circuit_breaker.registrar_falha("ollama")
        raise ProvedorIndisponivel("Ollama retornou vazio")

    circuit_breaker.registrar_sucesso("ollama")

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
    groq_model_override: str | None = None,
    permitir_ollama: bool = True,
) -> RespostaIA:
    """Tenta Groq -> Gemini -> Ollama.

    Args:
        permitir_ollama: se False, nao usa Ollama (bom pra extracao JSON)
    """
    erros = []

    provedores = [
        ("groq", lambda m, **kw: groq_completar(
            m, model_override=groq_model_override, **kw
        )),
        ("gemini", gemini_completar),
    ]

    if permitir_ollama:
        provedores.append(("ollama", ollama_completar))

    for nome, fn in provedores:
        if not circuit_breaker.esta_disponivel(nome):
            log.info("ia_pulando", provedor=nome, motivo="circuit_breaker")
            continue

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
            log.warning("ia_falhou", provedor=nome, erro=erro_msg)
            erros.append(f"{nome}: {erro_msg}")
            continue

    raise ProvedorIndisponivel(
        f"Todos os provedores falharam: {'; '.join(erros)}"
    )


# ============================================================
# STREAMING
# ============================================================
async def completar_stream(
    mensagens: list[dict],
    temperatura: float = 0.3,
    max_tokens: int = 2048,
) -> AsyncGenerator[str, None]:
    """Streaming via Groq. Fallback: resposta completa."""
    if (
        not settings.groq_api_key
        or not circuit_breaker.esta_disponivel("groq")
    ):
        r = await completar_cascata(mensagens, temperatura, max_tokens)
        yield r.texto
        return

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
        "stream": True,
    }

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream(
                "POST", url, headers=headers, json=payload
            ) as r:
                if r.status_code != 200:
                    circuit_breaker.registrar_falha("groq")
                    raise ProvedorIndisponivel(f"Groq stream {r.status_code}")

                async for linha in r.aiter_lines():
                    if not linha or not linha.startswith("data: "):
                        continue
                    dados = linha[6:]
                    if dados == "[DONE]":
                        break
                    import json
                    try:
                        obj = json.loads(dados)
                        delta = (
                            obj["choices"][0].get("delta", {}).get("content", "")
                        )
                        if delta:
                            yield delta
                    except Exception:
                        continue

                circuit_breaker.registrar_sucesso("groq")

    except Exception as e:
        log.warning("groq_stream_falhou", erro=str(e)[:150])
        r = await completar_cascata(mensagens, temperatura, max_tokens)
        yield r.texto
