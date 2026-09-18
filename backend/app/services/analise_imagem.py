"""Analise de imagem da tira sensoras (via celular)."""

import io
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageStat

from app.core.logging import get_logger

log = get_logger(__name__)


@dataclass
class ResultadoImagem:
    r: float
    g: float
    b: float
    intensidade: float
    classificacao: str
    confianca: float
    recomendacao: str


def analisar_imagem(conteudo: bytes) -> ResultadoImagem:
    """Analisa uma foto da tira e retorna classificacao."""
    try:
        img = Image.open(io.BytesIO(conteudo)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Imagem invalida: {e}")

    # Redimensiona pra acelerar
    img.thumbnail((512, 512))

    # Corta regiao central (onde a tira fica)
    w, h = img.size
    x1 = int(w * 0.25)
    y1 = int(h * 0.25)
    x2 = int(w * 0.75)
    y2 = int(h * 0.75)

    recorte = img.crop((x1, y1, x2, y2))

    # Estatisticas de cor
    stat = ImageStat.Stat(recorte)
    r, g, b = stat.mean
    intensidade = (r + g + b) / 3

    # Classificacao (simplificada - calibracao virá do frontend)
    # Para calibrar de verdade: comparar com foto da tira limpa
    if intensidade > 150:
        classificacao = "segura"
        confianca = 0.85
        recomendacao = "Água aparentemente segura. Continue monitorando."
    elif intensidade > 80:
        classificacao = "atencao"
        confianca = 0.75
        recomendacao = "Possível contaminação. Filtre antes de consumir."
    else:
        classificacao = "contaminada"
        confianca = 0.85
        recomendacao = "Contaminação detectada. Não consuma. Filtre e denuncie."

    log.info(
        "imagem_analisada",
        r=round(r, 1),
        g=round(g, 1),
        b=round(b, 1),
        classificacao=classificacao,
    )

    return ResultadoImagem(
        r=r,
        g=g,
        b=b,
        intensidade=intensidade,
        classificacao=classificacao,
        confianca=confianca,
        recomendacao=recomendacao,
    )
