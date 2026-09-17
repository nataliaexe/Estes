"""Coleta noticias ambientais via Tavily e classifica via IA."""

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.noticia import Noticia
from app.services.busca_web import buscar_web
from app.services.ia_providers import completar_cascata

log = get_logger(__name__)


@dataclass
class NoticiaColetada:
    titulo: str
    url: str
    resumo: str
    fonte: str
    categoria: str
    severidade: str
    uf: str | None


async def coletar_noticias_por_regiao(
    session: AsyncSession,
    uf: str,
    municipio: str | None = None,
    max_resultados: int = 10,
) -> list[NoticiaColetada]:
    """Coleta noticias ambientais de uma regiao."""
    local = f"{municipio}, {uf}" if municipio else uf
    consultas = [
        f"contaminacao ambiental {local} 2026",
        f"queimada desmatamento {local} 2026",
        f"mineracao mercurio {local} 2026",
    ]

    todas = []
    urls_vistas = set()

    for consulta in consultas:
        try:
            resultados = await buscar_web(consulta, max_resultados=5)
            for r in resultados:
                if r.url in urls_vistas:
                    continue
                urls_vistas.add(r.url)
                todas.append(r)
        except Exception as e:
            log.warning("coleta_falhou", consulta=consulta, erro=str(e))

    # Classifica cada uma via IA
    coletadas = []
    for r in todas[:max_resultados]:
        try:
            cat, sev = await _classificar(r.titulo, r.conteudo)
            coletadas.append(
                NoticiaColetada(
                    titulo=r.titulo,
                    url=r.url,
                    resumo=r.conteudo[:500],
                    fonte=_extrair_dominio(r.url),
                    categoria=cat,
                    severidade=sev,
                    uf=uf,
                )
            )
        except Exception as e:
            log.warning("classificacao_falhou", url=r.url, erro=str(e))

    return coletadas


async def _classificar(titulo: str, conteudo: str) -> tuple[str, str]:
    """Classifica noticia em categoria + severidade via LLM."""
    prompt = f"""Classifique esta noticia ambiental.

Titulo: {titulo}
Conteudo: {conteudo[:400]}

Responda APENAS em JSON: {{"categoria": "...", "severidade": "..."}}

Categorias: agua, solo, ar, queimada, desmatamento, residuos, mercurio, agrotoxico, enchente, terras_raras
Severidade: info, atencao, alerta, emergencia"""

    try:
        resposta = await completar_cascata(
            [{"role": "user", "content": prompt}],
            temperatura=0.0,
            max_tokens=50,
        )
        import json
        texto = resposta.texto.strip()
        # Remove markdown
        texto = texto.replace("```json", "").replace("```", "").strip()
        dados = json.loads(texto)
        return dados.get("categoria", "geral"), dados.get("severidade", "info")
    except Exception:
        return "geral", "info"


def _extrair_dominio(url: str) -> str:
    from urllib.parse import urlparse
    try:
        return urlparse(url).netloc.replace("www.", "")
    except Exception:
        return "desconhecido"


async def salvar_noticias(
    session: AsyncSession,
    noticias: list[NoticiaColetada],
) -> int:
    """Salva noticias no banco (evita duplicatas por URL)."""
    salvas = 0
    for n in noticias:
        existente = await session.execute(
            select(Noticia).where(Noticia.url == n.url)
        )
        if existente.scalar_one_or_none():
            continue

        session.add(
            Noticia(
                titulo=n.titulo,
                resumo=n.resumo,
                url=n.url,
                fonte=n.fonte,
                categoria=n.categoria,
                severidade=n.severidade,
                uf=n.uf,
                municipio=None,
            )
        )
        salvas += 1

    await session.commit()
    return salvas
