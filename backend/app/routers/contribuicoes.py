"""Contribuicoes comunitarias, votacao, comentarios, curadoria."""

from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.deps import usuario_atual, usuario_opcional
from app.core.logging import get_logger
from app.models.caso import Caso
from app.models.contribuicao import Comentario, Contribuicao, Voto
from app.models.usuario import Usuario
from app.schemas.contribuicao import (
    ComentarioCreate,
    ComentarioOut,
    ContribuicaoCreate,
    ContribuicaoDetalhe,
    ContribuicaoResumo,
    ContribuicaoUpdate,
    ValidacaoInput,
    ValidacaoOut,
    VotoInput,
    VotoOut,
)
from app.services.embeddings import gerar_embedding

log = get_logger(__name__)
router = APIRouter(prefix="/contribuicoes", tags=["contribuicoes"])

PERFIS_CURADOR = {"curador", "admin"}


async def _carregar_autor(session: AsyncSession, autor_id: UUID) -> Usuario:
    r = await session.execute(select(Usuario).where(Usuario.id == autor_id))
    return r.scalar_one()


def _serializar_resumo(c: Contribuicao, autor: Usuario) -> ContribuicaoResumo:
    return ContribuicaoResumo(
        id=c.id, tipo=c.tipo, titulo=c.titulo, conteudo=c.conteudo,
        status=c.status, votos=c.votos, uf=c.uf, municipio=c.municipio,
        caso_relacionado=c.caso_relacionado,
        autor=autor,
        criado_em=c.criado_em,
    )


# ============================================================
# LISTAR
# ============================================================
@router.get("", response_model=list[ContribuicaoResumo])
async def listar(
    tipo: str | None = None,
    status: str | None = Query("validado"),  # por default so validados
    uf: str | None = None,
    caso_numero: int | None = None,
    autor_id: UUID | None = None,
    limite: int = Query(50, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    stmt = select(Contribuicao).order_by(desc(Contribuicao.criado_em)).limit(limite)

    if tipo:
        stmt = stmt.where(Contribuicao.tipo == tipo)
    if status:
        stmt = stmt.where(Contribuicao.status == status)
    if uf:
        stmt = stmt.where(Contribuicao.uf == uf)
    if autor_id:
        stmt = stmt.where(Contribuicao.autor_id == autor_id)
    if caso_numero:
        caso_r = await session.execute(select(Caso.id).where(Caso.numero == caso_numero))
        caso_id = caso_r.scalar_one_or_none()
        if caso_id:
            stmt = stmt.where(Contribuicao.caso_relacionado == caso_id)

    result = await session.execute(stmt)
    contribuicoes = result.scalars().all()

    # Carrega autores em batch
    autor_ids = {c.autor_id for c in contribuicoes}
    autores_result = await session.execute(
        select(Usuario).where(Usuario.id.in_(autor_ids))
    )
    autores = {u.id: u for u in autores_result.scalars().all()}

    return [
        _serializar_resumo(c, autores.get(c.autor_id))
        for c in contribuicoes
        if c.autor_id in autores
    ]


# ============================================================
# CRIAR
# ============================================================
@router.post("", response_model=ContribuicaoDetalhe, status_code=201)
async def criar(
    body: ContribuicaoCreate,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    # Se curador/admin posta, ja sai validado
    status = "validado" if usuario.perfil in PERFIS_CURADOR else "pendente"

    caso_id = None
    if body.caso_numero:
        caso_r = await session.execute(
            select(Caso.id).where(Caso.numero == body.caso_numero)
        )
        caso_id = caso_r.scalar_one_or_none()

    # Gera embedding
    try:
        emb = await gerar_embedding(f"{body.titulo} {body.conteudo[:500]}")
    except Exception:
        emb = None

    contrib = Contribuicao(
        autor_id=usuario.id,
        tipo=body.tipo,
        titulo=body.titulo,
        conteudo=body.conteudo,
        evidencias=[e.model_dump() for e in body.evidencias],
        caso_relacionado=caso_id,
        uf=body.uf or usuario.uf,
        municipio=body.municipio or usuario.municipio,
        status=status,
        embedding=emb,
    )
    if status == "validado":
        contrib.validado_por_id = usuario.id
        contrib.validado_em = datetime.now(UTC)

    session.add(contrib)
    await session.flush()

    log.info("contribuicao_criada", tipo=body.tipo, autor=usuario.email, status=status)

    return ContribuicaoDetalhe(
        id=contrib.id, tipo=contrib.tipo, titulo=contrib.titulo,
        conteudo=contrib.conteudo, status=contrib.status,
        votos=contrib.votos, uf=contrib.uf, municipio=contrib.municipio,
        caso_relacionado=contrib.caso_relacionado,
        autor=usuario,
        criado_em=contrib.criado_em,
        evidencias=contrib.evidencias,
        validado_em=contrib.validado_em,
        motivo_validacao=None,
        visualizacoes=0,
        comentarios=[],
    )


# ============================================================
# DETALHE
# ============================================================
@router.get("/{cid}", response_model=ContribuicaoDetalhe)
async def detalhe(
    cid: UUID,
    session: AsyncSession = Depends(get_session),
):
    r = await session.execute(select(Contribuicao).where(Contribuicao.id == cid))
    c = r.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Contribuicao nao encontrada")

    autor = await _carregar_autor(session, c.autor_id)

    # Incrementa visualizacoes
    c.visualizacoes += 1
    await session.flush()

    # Carrega comentarios
    coms_r = await session.execute(
        select(Comentario)
        .where(Comentario.contribuicao_id == cid)
        .order_by(Comentario.criado_em)
    )
    coms = coms_r.scalars().all()

    comentarios_out = []
    for com in coms:
        autor_com = await _carregar_autor(session, com.autor_id)
        comentarios_out.append(
            ComentarioOut(
                id=com.id, conteudo=com.conteudo,
                autor=autor_com, criado_em=com.criado_em,
            )
        )

    return ContribuicaoDetalhe(
        id=c.id, tipo=c.tipo, titulo=c.titulo, conteudo=c.conteudo,
        status=c.status, votos=c.votos, uf=c.uf, municipio=c.municipio,
        caso_relacionado=c.caso_relacionado,
        autor=autor,
        criado_em=c.criado_em,
        evidencias=c.evidencias,
        validado_em=c.validado_em,
        motivo_validacao=c.motivo_validacao,
        visualizacoes=c.visualizacoes,
        comentarios=comentarios_out,
    )


# ============================================================
# VOTAR
# ============================================================
@router.post("/{cid}/votar", response_model=VotoOut)
async def votar(
    cid: UUID,
    body: VotoInput,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    if body.valor not in (-1, 1):
        raise HTTPException(400, "Voto deve ser -1 ou +1")

    r = await session.execute(select(Contribuicao).where(Contribuicao.id == cid))
    c = r.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Contribuicao nao encontrada")

    voto_r = await session.execute(
        select(Voto)
        .where(Voto.usuario_id == usuario.id)
        .where(Voto.contribuicao_id == cid)
    )
    voto_existente = voto_r.scalar_one_or_none()

    if voto_existente:
        # Remove voto antigo, aplica novo
        c.votos -= voto_existente.valor
        if voto_existente.valor == body.valor:
            # Mesmo voto: remove (toggle)
            await session.delete(voto_existente)
            meu_voto = 0
        else:
            # Voto diferente: atualiza
            voto_existente.valor = body.valor
            c.votos += body.valor
            meu_voto = body.valor
    else:
        # Novo voto
        session.add(Voto(
            usuario_id=usuario.id,
            contribuicao_id=cid,
            valor=body.valor,
        ))
        c.votos += body.valor
        meu_voto = body.valor

    await session.flush()

    return VotoOut(votos_totais=c.votos, meu_voto=meu_voto)


# ============================================================
# COMENTAR
# ============================================================
@router.post("/{cid}/comentar", response_model=ComentarioOut, status_code=201)
async def comentar(
    cid: UUID,
    body: ComentarioCreate,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    r = await session.execute(select(Contribuicao).where(Contribuicao.id == cid))
    if not r.scalar_one_or_none():
        raise HTTPException(404, "Contribuicao nao encontrada")

    com = Comentario(
        autor_id=usuario.id,
        contribuicao_id=cid,
        conteudo=body.conteudo,
    )
    session.add(com)
    await session.flush()

    return ComentarioOut(
        id=com.id, conteudo=com.conteudo,
        autor=usuario, criado_em=com.criado_em,
    )


# ============================================================
# VALIDAR (curador)
# ============================================================
@router.post("/{cid}/validar", response_model=ValidacaoOut)
async def validar(
    cid: UUID,
    body: ValidacaoInput,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    if usuario.perfil not in PERFIS_CURADOR:
        raise HTTPException(403, "Somente curador pode validar")

    r = await session.execute(select(Contribuicao).where(Contribuicao.id == cid))
    c = r.scalar_one_or_none()
    if not c:
        raise HTTPException(404, "Contribuicao nao encontrada")

    c.status = "validado" if body.aprovado else "rejeitado"
    c.validado_por_id = usuario.id
    c.validado_em = datetime.now(UTC)
    c.motivo_validacao = body.motivo
    await session.flush()

    log.info("contribuicao_validada", id=str(cid), aprovado=body.aprovado,
             curador=usuario.email)

    return ValidacaoOut(
        contribuicao_id=cid,
        status=c.status,
        validado_em=c.validado_em,
        motivo=body.motivo,
    )


# ============================================================
# PROMOVER CURADOR (admin)
# ============================================================
@router.post("/admin/promover-curador/{user_id}", status_code=200)
async def promover_curador(
    user_id: UUID,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    if usuario.perfil != "admin":
        raise HTTPException(403, "Somente admin pode promover curador")

    r = await session.execute(select(Usuario).where(Usuario.id == user_id))
    alvo = r.scalar_one_or_none()
    if not alvo:
        raise HTTPException(404, "Usuario nao encontrado")

    alvo.perfil = "curador"
    await session.flush()

    log.info("curador_promovido", user=alvo.email, por=usuario.email)
    return {"ok": True, "usuario": alvo.email, "novo_perfil": "curador"}
