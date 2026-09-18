"""Predicao de risco ambiental combinando multiplas fontes."""

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cache_get, cache_set
from app.core.logging import get_logger
from app.models.medicao import Medicao
from app.models.noticia import Noticia
from app.services.clima import obter_clima
from app.services.queimadas import obter_focos

log = get_logger(__name__)

CACHE_TTL = 1800


@dataclass
class Risco:
    tipo: str  # queimada, enchente, contaminacao, ar
    nivel: str  # baixo, medio, alto, critico
    score: float  # 0-1
    razoes: list[str]
    recomendacao: str


@dataclass
class Previsao:
    latitude: float
    longitude: float
    uf: str | None
    riscos: list[Risco]
    risco_geral: str
    gerado_em: str


async def prever_risco(
    session: AsyncSession,
    lat: float,
    lon: float,
    uf: str | None = None,
) -> Previsao:
    chave = f"previsao:{lat:.2f}:{lon:.2f}"
    cached = await cache_get(chave)
    if cached:
        return Previsao(**cached)

    riscos: list[Risco] = []

    # 1. CLIMA
    clima = await obter_clima(lat, lon)
    if clima:
        if clima.risco_queimada == "alto":
            riscos.append(Risco(
                tipo="queimada",
                nivel="alto",
                score=0.8,
                razoes=[
                    f"Temperatura {clima.temperatura_c}C",
                    f"Umidade {clima.umidade_pct}%",
                    f"Vento {clima.vento_kmh} km/h",
                ],
                recomendacao="Evite fogo ao ar livre. Alerta brigada.",
            ))
        elif clima.risco_queimada == "medio":
            riscos.append(Risco(
                tipo="queimada",
                nivel="medio",
                score=0.5,
                razoes=["Condicoes favoraveis a fogo"],
                recomendacao="Cuidado com fogueiras.",
            ))

        if clima.risco_enchente == "alto":
            riscos.append(Risco(
                tipo="enchente",
                nivel="alto",
                score=0.8,
                razoes=[f"Precipitacao prevista {clima.precipitacao_mm} mm"],
                recomendacao="Evite areas baixas. Alerta Defesa Civil.",
            ))

        if clima.pm25 and clima.pm25 > 50:
            riscos.append(Risco(
                tipo="ar",
                nivel="alto" if clima.pm25 > 100 else "medio",
                score=min(clima.pm25 / 150, 1.0),
                razoes=[f"PM2.5: {clima.pm25} ug/m3"],
                recomendacao="Use mascara. Evite atividade externa.",
            ))

    # 2. FOCOS DE QUEIMADA (NASA FIRMS)
    try:
        focos = await obter_focos(lat, lon, raio_km=100, dias=1)
        if len(focos) > 10:
            riscos.append(Risco(
                tipo="queimada",
                nivel="critico",
                score=1.0,
                razoes=[f"{len(focos)} focos detectados em 100 km"],
                recomendacao="Risco critico. Acione autoridades.",
            ))
        elif len(focos) > 2:
            riscos.append(Risco(
                tipo="queimada",
                nivel="alto",
                score=0.7,
                razoes=[f"{len(focos)} focos detectados em 100 km"],
                recomendacao="Atencao redobrada.",
            ))
    except Exception as e:
        log.warning("previsao_firms_falhou", erro=str(e)[:100])

    # 3. HISTORICO DE MEDICOES
    if uf:
        try:
            stmt = select(func.count(Medicao.id)).where(
                Medicao.uf == uf,
                Medicao.resultado == "contaminada",
                Medicao.criado_em >= datetime.now(UTC) - timedelta(days=7),
            )
            r = await session.execute(stmt)
            contaminadas = r.scalar() or 0

            if contaminadas > 5:
                riscos.append(Risco(
                    tipo="contaminacao",
                    nivel="alto",
                    score=min(contaminadas / 10, 1.0),
                    razoes=[f"{contaminadas} medicoes contaminadas em 7 dias"],
                    recomendacao="Teste a agua. Filtre antes de consumir.",
                ))
        except Exception as e:
            log.warning("previsao_medicoes_falhou", erro=str(e)[:100])

    # 4. NOTICIAS RECENTES
    if uf:
        try:
            stmt = select(func.count(Noticia.id)).where(
                Noticia.uf == uf,
                Noticia.severidade.in_(["alerta", "emergencia"]),
                Noticia.coletada_em >= datetime.now(UTC) - timedelta(days=3),
            )
            r = await session.execute(stmt)
            alertas = r.scalar() or 0

            if alertas > 3:
                riscos.append(Risco(
                    tipo="contexto",
                    nivel="alto",
                    score=0.7,
                    razoes=[f"{alertas} noticias de alerta/emergencia em 3 dias"],
                    recomendacao="Veja o feed de noticias.",
                ))
        except Exception as e:
            log.warning("previsao_noticias_falhou", erro=str(e)[:100])

    # LOG
    log.info(
        "previsao_gerada",
        lat=lat,
        lon=lon,
        total_riscos=len(riscos),
        tipos=[r.tipo for r in riscos],
    )

    # RISCO GERAL
    if not riscos:
        risco_geral = "baixo"
    elif any(r.nivel == "critico" for r in riscos):
        risco_geral = "critico"
    elif any(r.nivel == "alto" for r in riscos):
        risco_geral = "alto"
    else:
        risco_geral = "medio"

    previsao = Previsao(
        latitude=lat,
        longitude=lon,
        uf=uf,
        riscos=riscos,
        risco_geral=risco_geral,
        gerado_em=datetime.now(UTC).isoformat(),
    )

    await cache_set(
        chave,
        {
            "latitude": lat,
            "longitude": lon,
            "uf": uf,
            "riscos": [r.__dict__ for r in riscos],
            "risco_geral": risco_geral,
            "gerado_em": previsao.gerado_em,
        },
        ttl=CACHE_TTL,
    )

    return previsao
