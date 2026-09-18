"""Endpoint pra gerar imagens passo a passo de um caso."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.logging import get_logger
from app.models.caso import Caso
from app.services.imagem_gerador import gerar_passos_visuais

log = get_logger(__name__)
router = APIRouter(prefix="/ia", tags=["ia"])


@router.post("/gerar-passos/{caso_numero}")
async def gerar_passos(
    caso_numero: int,
    nivel: int = 2,
    session: AsyncSession = Depends(get_session),
):
    """Gera imagens passo a passo pra um caso do Atlas."""
    r = await session.execute(
        select(Caso).where(Caso.numero == caso_numero)
    )
    caso = r.scalar_one_or_none()
    if not caso:
        raise HTTPException(404, "Caso nao encontrado")

    # Pega os passos do nivel pedido
    nivel_key = f"nivel_{nivel}_" + {1: "pronto", 2: "simples", 3: "completo"}[nivel]
    nivel_dados = getattr(caso, nivel_key, None)
    if isinstance(nivel_dados, dict):
        passos = nivel_dados.get("passos", [])
    elif isinstance(nivel_dados, str):
        passos = [p.strip() for p in nivel_dados.split("\n") if p.strip()]
    else:
        passos = []

    if not passos:
        raise HTTPException(400, "Caso nao tem passos nesse nivel")

    # Contexto pra IA
    titulo_pt = caso.titulo.get("pt", "") if isinstance(caso.titulo, dict) else str(caso.titulo)
    problema_pt = caso.problema.get("pt", "") if isinstance(caso.problema, dict) else str(caso.problema)
    contexto = f"{titulo_pt}. {problema_pt}"

    log.info("gerar_passos_inicio", caso=caso_numero, nivel=nivel, total=len(passos))

    imagens = await gerar_passos_visuais(
        caso_numero=caso_numero,
        contexto=contexto,
        passos=passos,
        max_passos=8,
    )

    return {
        "caso_numero": caso_numero,
        "nivel": nivel,
        "total_geradas": len(imagens),
        "passos": imagens,
    }
