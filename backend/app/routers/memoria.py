"""Memoria de conversas e biblioteca do usuario."""

from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.deps import usuario_atual, usuario_opcional
from app.models.conversa import Conversa, ItemBiblioteca
from app.models.usuario import Usuario

router = APIRouter(tags=["memoria"])


class MensagemInput(BaseModel):
    session_id: str
    role: str
    content: str
    fontes: list[dict] = []


class ItemBibliotecaInput(BaseModel):
    tipo: str
    referencia_id: str | None = None
    titulo: str
    resumo: str | None = None
    metadados: dict = {}


# ============================================================
# CONVERSAS
# ============================================================
@router.post("/conversas/mensagem")
async def salvar_mensagem(
    body: MensagemInput,
    usuario: Usuario | None = Depends(usuario_opcional),
    session: AsyncSession = Depends(get_session),
):
    """Salva uma mensagem na conversa (cria se nao existir)."""
    r = await session.execute(
        select(Conversa).where(Conversa.session_id == body.session_id)
    )
    conversa = r.scalar_one_or_none()

    if not conversa:
        conversa = Conversa(
            session_id=body.session_id,
            usuario_id=usuario.id if usuario else None,
            titulo=body.content[:60] if body.role == "user" else "Nova conversa",
            mensagens=[],
        )
        session.add(conversa)

    nova_msg = {
        "role": body.role,
        "content": body.content,
        "fontes": body.fontes,
        "timestamp": datetime.now(UTC).isoformat(),
    }

    conversa.mensagens = (conversa.mensagens or []) + [nova_msg]
    conversa.atualizado_em = datetime.now(UTC)

    await session.flush()
    return {"ok": True, "total_mensagens": len(conversa.mensagens)}


@router.get("/conversas/{session_id}")
async def carregar_conversa(
    session_id: str,
    session: AsyncSession = Depends(get_session),
):
    """Carrega o historico de uma conversa."""
    r = await session.execute(
        select(Conversa).where(Conversa.session_id == session_id)
    )
    conversa = r.scalar_one_or_none()
    if not conversa:
        return {"session_id": session_id, "mensagens": []}
    return {
        "session_id": conversa.session_id,
        "titulo": conversa.titulo,
        "mensagens": conversa.mensagens or [],
    }


@router.get("/conversas")
async def listar_conversas(
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    """Lista todas as conversas do usuario."""
    r = await session.execute(
        select(Conversa)
        .where(Conversa.usuario_id == usuario.id)
        .order_by(Conversa.atualizado_em.desc())
        .limit(20)
    )
    conversas = r.scalars().all()
    return [
        {
            "session_id": c.session_id,
            "titulo": c.titulo,
            "total_mensagens": len(c.mensagens or []),
            "atualizado_em": c.atualizado_em,
        }
        for c in conversas
    ]


# ============================================================
# BIBLIOTECA
# ============================================================
@router.post("/biblioteca")
async def adicionar_biblioteca(
    body: ItemBibliotecaInput,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    """Salva um item na biblioteca do usuario."""
    item = ItemBiblioteca(
        usuario_id=usuario.id,
        tipo=body.tipo,
        referencia_id=body.referencia_id,
        titulo=body.titulo,
        resumo=body.resumo,
        metadados=body.metadados,
    )
    session.add(item)
    await session.flush()
    return {"ok": True, "id": str(item.id)}


@router.get("/biblioteca")
async def listar_biblioteca(
    tipo: str | None = None,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    """Lista a biblioteca do usuario."""
    stmt = (
        select(ItemBiblioteca)
        .where(ItemBiblioteca.usuario_id == usuario.id)
        .order_by(ItemBiblioteca.criado_em.desc())
    )
    if tipo:
        stmt = stmt.where(ItemBiblioteca.tipo == tipo)

    r = await session.execute(stmt)
    itens = r.scalars().all()
    return [
        {
            "id": str(i.id),
            "tipo": i.tipo,
            "referencia_id": i.referencia_id,
            "titulo": i.titulo,
            "resumo": i.resumo,
            "metadados": i.metadados,
            "criado_em": i.criado_em,
        }
        for i in itens
    ]


@router.delete("/biblioteca/{item_id}")
async def remover_biblioteca(
    item_id: UUID,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    """Remove item da biblioteca."""
    r = await session.execute(
        select(ItemBiblioteca)
        .where(ItemBiblioteca.id == item_id)
        .where(ItemBiblioteca.usuario_id == usuario.id)
    )
    item = r.scalar_one_or_none()
    if not item:
        raise HTTPException(404, "Item nao encontrado")

    await session.delete(item)
    return {"ok": True}
