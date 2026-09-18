"""Utilitarios de internacionalizacao para o backend."""


def traduzir(valor, idioma: str = "pt"):
    """Extrai valor do campo JSONB no idioma pedido.

    Se valor for string simples, retorna como esta.
    Se for dict {pt: ..., en: ...}, retorna valor[idioma] ou fallback pt.
    """
    if valor is None:
        return None
    if isinstance(valor, str):
        return valor
    if isinstance(valor, dict):
        # Tenta idioma pedido, cai pra pt, depois pra qualquer um
        return valor.get(idioma) or valor.get("pt") or next(iter(valor.values()), "")
    return str(valor)


def traduzir_lista(valor, idioma: str = "pt"):
    """Traduz uma lista de strings ou dicts."""
    if not isinstance(valor, list):
        return valor or []
    return [
        traduzir(item, idioma) if isinstance(item, dict) else item
        for item in valor
    ]


IDIOMAS_SUPORTADOS = {"pt", "en", "es"}


def normalizar_idioma(idioma: str | None) -> str:
    """Normaliza 'pt-BR' -> 'pt', 'en-US' -> 'en', etc."""
    if not idioma:
        return "pt"
    base = idioma.split("-")[0].lower()
    return base if base in IDIOMAS_SUPORTADOS else "pt"
