"""Carrega os 22 casos do Atlas no banco e gera embeddings via Ollama."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import delete, select  # noqa: E402

from app.core.database import SessionLocal  # noqa: E402
from app.core.logging import configurar_logging, get_logger  # noqa: E402
from app.data.casos_seed import CASOS  # noqa: E402
from app.data.historias_seed import HISTORIAS  # noqa: E402
from app.models.caso import Caso  # noqa: E402
from app.services.embeddings import gerar_embedding  # noqa: E402

configurar_logging()
log = get_logger(__name__)


def _texto_para_embedding(caso: dict) -> str:
    partes = [
        f"Caso #{caso['numero']}: {caso['titulo']}",
        f"Categoria: {caso.get('categoria', 'nao definida')}",
        f"UF: {caso['uf']}",
        f"Problema: {caso['problema']}",
        f"Recurso local: {caso['recurso_local']}",
        f"Solucao: {caso['solucao']}",
        f"Evidencia: {caso['evidencia']}",
        f"Tipo de solucao: {caso.get('tipo_solucao', 'nao definido')}",
    ]
    return "\n".join(partes)


async def limpar_casos(session) -> int:
    result = await session.execute(select(Caso))
    existentes = result.scalars().all()
    if existentes:
        log.info("casos_existentes_removendo", total=len(existentes))
        await session.execute(delete(Caso))
        await session.commit()
    return len(existentes)


async def inserir_caso(session, dados: dict) -> Caso:
    texto = _texto_para_embedding(dados)

    try:
        embedding = await gerar_embedding(texto)
    except Exception as e:
        log.warning("embedding_falhou", numero=dados["numero"], erro=str(e))
        embedding = None

    caso = Caso(
        numero=dados["numero"],
        titulo=dados["titulo"],
        uf=dados["uf"],
        categoria=dados.get("categoria", "agua"),
        tipo_solucao=dados.get("tipo_solucao", "filtro"),
        precisa_hardware=dados.get("precisa_hardware", False),
        problema=dados["problema"],
        recurso_local=dados["recurso_local"],
        solucao=dados["solucao"],
        evidencia=dados["evidencia"],
        composicao=dados.get("composicao", {}),
        propriedades=dados.get("propriedades", {}),
        historia=HISTORIAS.get(dados["numero"], {}).get("historia", ""),
        fontes_historicas=HISTORIAS.get(dados["numero"], {}).get("fontes_historicas", []),
        impacto_estimado=HISTORIAS.get(dados["numero"], {}).get("impacto_estimado", {}),
        aplicacoes=dados.get("aplicacoes", {}),
        lacunas=dados.get("lacunas", []),
        referencias=dados.get("referencias", []),
        nivel_1_pronto=dados.get("nivel_1_pronto", {}),
        nivel_2_simples=dados.get("nivel_2_simples", {}),
        nivel_3_completo=dados.get("nivel_3_completo", {}),
        embedding=embedding,
    )

    session.add(caso)
    return caso


async def main() -> None:
    log.info("seed_atlas_inicio", total_casos=len(CASOS))

    async with SessionLocal() as session:
        removidos = await limpar_casos(session)
        inseridos = 0
        for dados in CASOS:
            try:
                await inserir_caso(session, dados)
                inseridos += 1
                log.info("caso_inserido", numero=dados["numero"])
            except Exception as e:
                log.error("caso_falhou", numero=dados["numero"], erro=str(e))
                await session.rollback()
                continue
        await session.commit()

    log.info("seed_atlas_fim", removidos=removidos, inseridos=inseridos)

    async with SessionLocal() as session:
        result = await session.execute(select(Caso).order_by(Caso.numero))
        casos = result.scalars().all()
        print()
        print("=" * 90)
        print(f"Total de casos no banco: {len(casos)}")
        print("=" * 90)
        for c in casos:
            hw = "HW" if c.precisa_hardware else "--"
            print(
                f"  #{c.numero:2d} | {c.uf} | {c.categoria:14s} | "
                f"{c.tipo_solucao:16s} | {hw} | {c.evidencia:12s} | "
                f"{c.titulo[:40]}"
            )
        print("=" * 90)


if __name__ == "__main__":
    asyncio.run(main())
