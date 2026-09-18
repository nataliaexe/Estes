"""Popula o banco com dados de amostra para demo."""

import asyncio
import random
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import uuid4

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import delete  # noqa: E402

from app.core.database import SessionLocal  # noqa: E402
from app.core.logging import configurar_logging, get_logger  # noqa: E402
from app.models.medicao import Medicao  # noqa: E402
from app.models.noticia import Noticia  # noqa: E402

configurar_logging()
log = get_logger(__name__)

CIDADES = [
    {"nome": "Ouro Preto", "uf": "MG", "lat": -20.3856, "lon": -43.5035},
    {"nome": "Altamira", "uf": "PA", "lat": -3.2039, "lon": -52.2061},
    {"nome": "Boa Vista", "uf": "RR", "lat": 2.8235, "lon": -60.6758},
    {"nome": "Rio Branco", "uf": "AC", "lat": -9.9747, "lon": -67.8076},
    {"nome": "Cuiaba", "uf": "MT", "lat": -15.6014, "lon": -56.0979},
    {"nome": "Porto Alegre", "uf": "RS", "lat": -30.0346, "lon": -51.2177},
]

RESULTADOS = ["segura", "atencao", "contaminada"]


async def seed_medicoes(session) -> int:
    """Cria 40 medicoes espalhadas pelas cidades."""
    await session.execute(delete(Medicao))
    await session.commit()

    total = 0
    for i in range(40):
        cidade = random.choice(CIDADES)
        # Bias pra atencao (mais interessante pra demo)
        resultado = random.choices(
            RESULTADOS,
            weights=[0.4, 0.4, 0.2],
            k=1,
        )[0]

        if resultado == "segura":
            razao_c = random.uniform(0.92, 0.99)
        elif resultado == "atencao":
            razao_c = random.uniform(0.72, 0.89)
        else:
            razao_c = random.uniform(0.4, 0.69)

        medicao = Medicao(
            id=uuid4(),
            device_id=f"estes-{i % 5:03d}",
            razao_r=razao_c * random.uniform(0.9, 1.05),
            razao_g=razao_c * random.uniform(0.8, 0.95),
            razao_b=razao_c * random.uniform(0.7, 0.9),
            razao_c=razao_c,
            resultado=resultado,
            confianca=0.75 + (razao_c - 0.5) * 0.4,
            latitude=cidade["lat"] + random.uniform(-0.5, 0.5),
            longitude=cidade["lon"] + random.uniform(-0.5, 0.5),
            uf=cidade["uf"],
            municipio=cidade["nome"],
            criado_em=datetime.now(UTC) - timedelta(hours=random.randint(0, 72)),
        )
        session.add(medicao)
        total += 1

    await session.commit()
    return total


NOTICIAS_DEMO = [
    {
        "titulo": "MPF investiga contaminacao por mercurio em rio do Para",
        "resumo": "Ministerio Publico Federal abriu inquerito sobre contaminacao em territorio indigena.",
        "url": "https://exemplo.com/noticia-mpf-mercurio-pa",
        "fonte": "Agencia Brasil",
        "categoria": "mercurio",
        "severidade": "alerta",
        "uf": "PA",
        "municipio": "Altamira",
    },
    {
        "titulo": "Desmatamento cai 15% na Amazonia em 2026",
        "resumo": "Dados do INPE mostram reducao nos alertas de desmatamento.",
        "url": "https://exemplo.com/noticia-inpe-desmatamento",
        "fonte": "INPE",
        "categoria": "desmatamento",
        "severidade": "info",
        "uf": "AM",
        "municipio": None,
    },
    {
        "titulo": "Focos de queimada aumentam 40% no Pantanal",
        "resumo": "Mato Grosso lidera focos de incendio no bioma.",
        "url": "https://exemplo.com/noticia-queimadas-pantanal",
        "fonte": "NASA FIRMS",
        "categoria": "queimada",
        "severidade": "emergencia",
        "uf": "MT",
        "municipio": "Cuiaba",
    },
    {
        "titulo": "Rio Grande do Sul distribui filtros pos-enchente",
        "resumo": "Comunidades isoladas recebem filtros portateis de biochar.",
        "url": "https://exemplo.com/noticia-rs-filtros",
        "fonte": "Defesa Civil RS",
        "categoria": "enchente",
        "severidade": "atencao",
        "uf": "RS",
        "municipio": "Porto Alegre",
    },
    {
        "titulo": "Agrotoxicos em 80% dos municipios do Parana",
        "resumo": "Estudo aponta contaminacao em aguas subterraneas.",
        "url": "https://exemplo.com/noticia-agrotoxico-pr",
        "fonte": "((o))eco",
        "categoria": "agrotoxico",
        "severidade": "alerta",
        "uf": "PR",
        "municipio": None,
    },
    {
        "titulo": "Roraima registra 570 mortes em crise Yanomami",
        "resumo": "Ministerio da Saude confirma emergencia sanitaria.",
        "url": "https://exemplo.com/noticia-yanomami",
        "fonte": "Fiocruz",
        "categoria": "mercurio",
        "severidade": "emergencia",
        "uf": "RR",
        "municipio": "Boa Vista",
    },
]


async def seed_noticias(session) -> int:
    await session.execute(delete(Noticia))
    await session.commit()

    total = 0
    for n in NOTICIAS_DEMO:
        noticia = Noticia(
            id=uuid4(),
            titulo=n["titulo"],
            resumo=n["resumo"],
            url=n["url"],
            fonte=n["fonte"],
            categoria=n["categoria"],
            severidade=n["severidade"],
            uf=n["uf"],
            municipio=n["municipio"],
            publicada_em=datetime.now(UTC) - timedelta(hours=random.randint(1, 48)),
        )
        session.add(noticia)
        total += 1

    await session.commit()
    return total


async def main() -> None:
    async with SessionLocal() as session:
        medicoes = await seed_medicoes(session)
        noticias = await seed_noticias(session)

        log.info("seed_amostras_fim", medicoes=medicoes, noticias=noticias)
        print()
        print("=" * 60)
        print(f"Medicoes: {medicoes}")
        print(f"Noticias: {noticias}")
        print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
