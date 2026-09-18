"""Modo acessibilidade: texto-para-fala e configuracao."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.logging import get_logger
from app.models.caso import Caso

log = get_logger(__name__)
router = APIRouter(prefix="/acessibilidade", tags=["acessibilidade"])


class FalaRequest(BaseModel):
    texto: str
    idioma: str = "pt-BR"
    velocidade: float = 1.0


@router.post("/falar")
async def texto_para_fala(body: FalaRequest):
    """Retorna o texto pronto pra Web Speech API do navegador.

    O frontend usa SpeechSynthesis pra transformar em audio.
    Aqui so limpamos e formatamos o texto.
    """
    if not body.texto or len(body.texto) > 5000:
        raise HTTPException(400, "Texto vazio ou muito longo (max 5000 chars)")

    # Limpa marcacao que nao deve ser falada
    import re
    texto_limpo = re.sub(r"[*_#>`\[\]()]", "", body.texto)
    texto_limpo = re.sub(r"\s+", " ", texto_limpo).strip()

    return {
        "texto": texto_limpo,
        "idioma": body.idioma,
        "velocidade": max(0.5, min(2.0, body.velocidade)),
        "duracao_estimada_seg": len(texto_limpo.split()) / 3,
    }


@router.get("/caso/{numero}/audio")
async def caso_para_audio(
    numero: int,
    session: AsyncSession = Depends(get_session),
):
    """Retorna o texto do caso formatado pra leitura em voz alta."""
    r = await session.execute(
        __import__("sqlalchemy").select(Caso).where(Caso.numero == numero)
    )
    caso = r.scalar_one_or_none()
    if not caso:
        raise HTTPException(404, "Caso nao encontrado")

    # Monta texto curto e simples pra TTS
    partes = [f"Caso numero {caso.numero}. {caso.titulo}."]
    if caso.problema:
        partes.append(f"Problema: {caso.problema}")
    if caso.solucao:
        partes.append(f"Solucao: {caso.solucao}")
    if caso.evidencia:
        partes.append(f"Nivel de evidencia: {caso.evidencia}")

    return {
        "texto": " ".join(partes),
        "idioma": "pt-BR",
        "numero": numero,
    }


@router.get("/config")
async def config_acessibilidade():
    """Retorna as configuracoes de acessibilidade disponiveis."""
    return {
        "modos": [
            {
                "id": "padrao",
                "nome": "Padrao",
                "descricao": "Cores do tema principal (verde + dourado)",
            },
            {
                "id": "alto_contraste",
                "nome": "Alto contraste",
                "descricao": "Preto e branco puros (WCAG AAA)",
            },
            {
                "id": "daltonismo_deuteranopia",
                "nome": "Deuteranopia",
                "descricao": "Adaptado para daltonismo verde-vermelho",
            },
            {
                "id": "daltonismo_protanopia",
                "nome": "Protanopia",
                "descricao": "Adaptado para daltonismo vermelho-verde",
            },
        ],
        "tamanhos_fonte": ["pequeno", "medio", "grande", "extra_grande"],
        "idiomas_voz": ["pt-BR", "pt-PT", "en-US", "es-ES"],
        "recursos": {
            "texto_para_fala": True,
            "navegacao_teclado": True,
            "aria_labels": True,
            "modo_offline": False,  # roadmap
            "linguas_indigenas": False,  # roadmap
        },
    }
