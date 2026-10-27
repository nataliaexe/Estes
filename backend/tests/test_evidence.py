import pytest

from app.services import evidencia
from app.services.ciencia import Paper
from app.services.ia_providers import RespostaIA


def test_json_parser_accepts_markdown_wrapped_response():
    parsed = evidencia._extrair_json('```json\n{"aplicavel": false}\n```')
    assert parsed == {"aplicavel": False}


@pytest.mark.asyncio
async def test_extraction_with_unmatched_quote_is_rejected(monkeypatch):
    async def fake_completion(*args, **kwargs):
        return RespostaIA(
            texto=(
                '{"aplicavel": true, "claim": "Claim", '
                '"trecho": "fabricated quote not present in source", '
                '"tipo": "experimento", "limitacoes": "small sample", '
                '"aplicabilidade": "uncertain", "nivel": "hipotese", '
                '"forca": 0.9}'
            ),
            provedor="test",
            modelo="test-model",
        )

    monkeypatch.setattr(evidencia, "completar_cascata", fake_completion)
    paper = Paper(
        titulo="Source paper",
        ano=2024,
        abstract="This abstract contains enough words to pass the length guard. " * 3,
        fonte="test",
    )

    result = await evidencia.extrair_evidencia(paper, "cellulose", "water sensing")

    assert result is None


@pytest.mark.asyncio
async def test_extraction_with_exact_quote_requires_human_review(monkeypatch):
    source_quote = (
        "Lead concentration increased downstream from the industrial site."
    )

    async def fake_completion(*args, **kwargs):
        return RespostaIA(
            texto=(
                '{"aplicavel": true, "claim": "Lead concentration increased downstream.", '
                f'"trecho": "{source_quote}", '
                '"tipo": "experimento", "limitacoes": "small sample", '
                '"aplicabilidade": "uncertain", "nivel": "hipotese", '
                '"forca": 0.9}'
            ),
            provedor="test",
            modelo="test-model",
        )

    monkeypatch.setattr(evidencia, "completar_cascata", fake_completion)
    paper = Paper(
        titulo="Source paper",
        ano=2024,
        abstract=(
            "This study measured water quality in the river. "
            f"{source_quote} The method was observational."
        ),
        fonte="test",
    )

    result = await evidencia.extrair_evidencia(paper, "cellulose", "water sensing")

    assert result is not None
    assert result.trecho == source_quote
    assert "revisão humana" in result.limitacoes


@pytest.mark.asyncio
async def test_gemini_api_key_is_sent_in_header_not_url(monkeypatch):
    from app.core.config import settings
    from app.services import ia_providers

    secret = "test-gemini-key"
    captured = {}

    class FakeResponse:
        status_code = 200

        @staticmethod
        def json():
            return {"candidates": [{"content": {"parts": [{"text": "OK"}]}}]}

    class FakeClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return None

        async def post(self, url, **kwargs):
            captured["url"] = url
            captured["headers"] = kwargs.get("headers", {})
            return FakeResponse()

    monkeypatch.setattr(settings, "gemini_api_key", secret)
    monkeypatch.setattr(ia_providers.httpx, "AsyncClient", FakeClient)

    result = await ia_providers.gemini_completar(
        [{"role": "user", "content": "test"}], max_tokens=32
    )

    assert result.texto == "OK"
    assert secret not in captured["url"]
    assert captured["headers"]["x-goog-api-key"] == secret
