"""Upload e analise de imagens."""

import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.core.logging import get_logger
from app.schemas.imagem import AnaliseImagemOut, UploadOut
from app.services.analise_imagem import analisar_imagem

log = get_logger(__name__)
router = APIRouter(prefix="/imagens", tags=["imagens"])

DIR_STATIC = Path("static/imagens")
DIR_STATIC.mkdir(parents=True, exist_ok=True)

EXTENSOES_OK = {".jpg", ".jpeg", ".png", ".webp"}
TAMANHO_MAX = 10 * 1024 * 1024  # 10 MB


@router.post("/upload", response_model=UploadOut)
async def upload(arquivo: UploadFile = File(...)):
    """Faz upload de imagem e retorna URL."""
    ext = Path(arquivo.filename or "").suffix.lower()
    if ext not in EXTENSOES_OK:
        raise HTTPException(400, f"Extensao nao permitida: {ext}")

    conteudo = await arquivo.read()
    if len(conteudo) > TAMANHO_MAX:
        raise HTTPException(400, "Arquivo muito grande (max 10 MB)")

    nome = f"{uuid.uuid4().hex}{ext}"
    caminho = DIR_STATIC / nome
    caminho.write_bytes(conteudo)

    log.info("upload_ok", nome=nome, tamanho=len(conteudo))

    return UploadOut(
        url=f"/api/v1/imagens/{nome}",
        nome=nome,
        tamanho=len(conteudo),
    )


@router.post("/analisar", response_model=AnaliseImagemOut)
async def analisar(arquivo: UploadFile = File(...)):
    """Recebe foto da tira, analisa e retorna classificacao."""
    conteudo = await arquivo.read()
    if not conteudo:
        raise HTTPException(400, "Arquivo vazio")

    try:
        resultado = analisar_imagem(conteudo)
    except ValueError as e:
        raise HTTPException(400, str(e))

    return AnaliseImagemOut(
        r=resultado.r,
        g=resultado.g,
        b=resultado.b,
        intensidade=resultado.intensidade,
        classificacao=resultado.classificacao,
        confianca=resultado.confianca,
        recomendacao=resultado.recomendacao,
    )


@router.get("/{nome}")
async def servir_imagem(nome: str):
    """Serve imagem salva."""
    # Sanitize contra path traversal
    if "/" in nome or ".." in nome:
        raise HTTPException(400, "Nome invalido")

    caminho = DIR_STATIC / nome
    if not caminho.exists():
        raise HTTPException(404, "Imagem nao encontrada")

    return FileResponse(caminho)
