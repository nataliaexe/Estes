from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.deps import usuario_atual
from app.core.logging import get_logger
from app.models.documento import Documento
from app.models.medicao import Medicao
from app.models.usuario import Usuario
from app.schemas.documento import DocumentoCreate, DocumentoOut
from app.services.ia_providers import completar_cascata

log = get_logger(__name__)
router = APIRouter(prefix="/documentos", tags=["documentos"])


PROMPT_DENUNCIA = """Voce e um assistente juridico da plataforma Estes.

Gere uma denuncia formal para orgao ambiental brasileiro, com base nas
informacoes fornecidas. Use linguagem formal, objetiva e cidadã.

Estrutura obrigatoria:
1. Identificacao do denunciante (se fornecida)
2. Descricao do fato (detalhada)
3. Local e data
4. Evidencias disponiveis
5. Fundamentacao legal (cite Lei 9.605/98, art. 54 ou equivalente)
6. Pedido ao orgao

Orgaos possiveis: IBAMA, MPF, Ministerio Publico Estadual, FUNAI,
SESAI, Defesa Civil, Vigilancia Sanitaria.

Responda APENAS com o texto da denuncia, sem introducao.
"""


@router.post("", response_model=DocumentoOut, status_code=201)
async def criar_documento(
    body: DocumentoCreate,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    contexto = [f"Tipo: {body.tipo}", f"Titulo: {body.titulo}",
                f"Descricao: {body.descricao}"]

    if body.medicao_id:
        med = await session.execute(
            select(Medicao).where(Medicao.id == body.medicao_id)
        )
        m = med.scalar_one_or_none()
        if m:
            contexto.append(
                f"Medicao associada: resultado={m.resultado}, "
                f"confianca={m.confianca}, lat={m.latitude}, lon={m.longitude}"
            )

    contexto.append(f"Denunciante: {usuario.nome} ({usuario.email})")
    if usuario.uf:
        contexto.append(f"Local: {usuario.municipio or ''} {usuario.uf}".strip())
    if body.orgao_destino:
        contexto.append(f"Orgao sugerido: {body.orgao_destino}")

    try:
        resposta = await completar_cascata(
            [
                {"role": "system", "content": PROMPT_DENUNCIA},
                {"role": "user", "content": "\n".join(contexto)},
            ],
            temperatura=0.2,
            max_tokens=2000,
        )
        conteudo = resposta.texto
    except Exception as e:
        log.warning("ia_falhou_documento", erro=str(e)[:200])
        conteudo = (
            f"DENUNCIA AMBIENTAL\n\n"
            f"Titulo: {body.titulo}\n"
            f"Descricao: {body.descricao}\n\n"
            f"(Geracao automatica via IA falhou. Edite manualmente.)"
        )

    doc = Documento(
        usuario_id=usuario.id,
        medicao_id=body.medicao_id,
        tipo=body.tipo,
        titulo=body.titulo,
        conteudo=conteudo,
        orgao_destino=body.orgao_destino,
        status="rascunho",
    )
    session.add(doc)
    await session.flush()

    log.info("documento_criado", tipo=body.tipo, usuario=usuario.email)
    return doc


@router.get("", response_model=list[DocumentoOut])
async def listar_documentos(
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Documento)
        .where(Documento.usuario_id == usuario.id)
        .order_by(Documento.criado_em.desc())
    )
    return result.scalars().all()


@router.get("/{doc_id}", response_model=DocumentoOut)
async def detalhe_documento(
    doc_id: str,
    usuario: Usuario = Depends(usuario_atual),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(Documento)
        .where(Documento.id == doc_id)
        .where(Documento.usuario_id == usuario.id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(404, "Documento nao encontrado")
    return doc
