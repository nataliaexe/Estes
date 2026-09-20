"""Busca na plataforma: Atlas + casos + protocolos."""

from dataclasses import dataclass

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.caso import Caso
from app.services.embeddings import EmbeddingError, gerar_embedding

log = get_logger(__name__)

# Limiares de qualidade
SCORE_MINIMO = 0.50
LIMITE_PADRAO = 3


@dataclass
class ResultadoPlataforma:
    tipo: str
    titulo: str
    conteudo: str
    score: float
    metadata: dict


async def buscar_casos_semantico(
    session: AsyncSession,
    consulta: str,
    limite: int = LIMITE_PADRAO,
) -> list[ResultadoPlataforma]:
    try:
        embedding = await gerar_embedding(consulta)
    except EmbeddingError as e:
        log.warning("embedding_falhou_fallback_textual", erro=str(e))
        return await buscar_casos_textual(session, consulta, limite)

    # Busca mais que o limite, depois filtra por score
    stmt = (
        select(
            Caso,
            Caso.embedding.cosine_distance(embedding).label("distancia"),
        )
        .where(Caso.embedding.isnot(None))
        .order_by("distancia")
        .limit(limite * 2)
    )

    result = await session.execute(stmt)
    rows = result.all()

    # Filtra por score minimo
    resultados = []
    for caso, distancia in rows:
        score = 1.0 - float(distancia)
        if score >= SCORE_MINIMO:
            resultados.append(
                ResultadoPlataforma(
                    tipo="caso",
                    titulo=f"Caso #{caso.numero} - {caso.titulo}",
                    conteudo=_formatar_caso(caso),
                    score=score,
                    metadata={
                        "numero": caso.numero,
                        "uf": caso.uf,
                        "evidencia": caso.evidencia,
                        "recurso": caso.recurso_local,
                        "solucao": caso.solucao,
                    },
                )
            )
        if len(resultados) >= limite:
            break

    return resultados


async def buscar_casos_textual(
    session: AsyncSession,
    consulta: str,
    limite: int = LIMITE_PADRAO,
) -> list[ResultadoPlataforma]:
    termo = f"%{consulta}%"
    stmt = (
        select(Caso)
        .where(
            or_(
                Caso.titulo.ilike(termo),
                Caso.problema.ilike(termo),
                Caso.recurso_local.ilike(termo),
                Caso.solucao.ilike(termo),
            )
        )
        .limit(limite)
    )

    result = await session.execute(stmt)
    casos = result.scalars().all()

    return [
        ResultadoPlataforma(
            tipo="caso",
            titulo=f"Caso #{caso.numero} - {caso.titulo}",
            conteudo=_formatar_caso(caso),
            score=0.5,
            metadata={
                "numero": caso.numero,
                "uf": caso.uf,
                "evidencia": caso.evidencia,
            },
        )
        for caso in casos
    ]


async def buscar_plataforma(
    session: AsyncSession,
    consulta: str,
    limite: int = LIMITE_PADRAO,
) -> list[ResultadoPlataforma]:
    return await buscar_casos_semantico(session, consulta, limite)


def _formatar_caso(caso: Caso) -> str:
    partes = [
        f"Problema: {caso.problema}",
        f"Recurso local: {caso.recurso_local}",
        f"Solucao: {caso.solucao}",
        f"Evidencia: {caso.evidencia}",
        f"UF: {caso.uf}",
    ]

    aplicacoes = caso.aplicacoes or {}
    if aplicacoes:
        apps = ", ".join(aplicacoes.keys())
        partes.append(f"Aplicacoes: {apps}")

    lacunas = caso.lacunas or []
    if lacunas:
        partes.append(f"Lacunas: {', '.join(lacunas[:3])}")

    n1 = caso.nivel_1_pronto or {}
    if n1:
        partes.append(f"Nivel 1 (pronto): {n1.get('tempo', '?')}")

    return "\n".join(partes)
