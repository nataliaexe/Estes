from fastapi import APIRouter, Body
from pydantic import BaseModel, Field

from app.services.ciencia import buscar_cientifico

router = APIRouter(prefix="/search", tags=["search"])


class ScientificSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    case_id: str | None = None
    limit: int = Field(default=10, ge=1, le=50)


@router.post("/scientific")
async def search_scientific(request: ScientificSearchRequest):
    """
    Search for scientific evidence based on a query.
    Integrates with Semantic Scholar, Crossref, OpenAlex, and Tavily.
    """
    try:
        papers = await buscar_cientifico(
            material=request.query,
            problema="environmental investigation",
            mecanismo=""
        )

        results = [
            {
                "title": p.titulo,
                "authors": p.autores,
                "year": p.ano,
                "doi": p.doi,
                "abstract": p.abstract,
                "url": p.url,
                "source": p.fonte,
                "journal": p.journal,
                "citations": p.citacoes,
                "evidence": p.evidence,
                "paper_id": p.paper_id,
            }
            for p in papers[:request.limit]
        ]

        return {
            "query": request.query,
            "results": results,
            "total": len(results),
        }
    except Exception as e:
        return {
            "query": request.query,
            "results": [],
            "total": 0,
            "error": str(e),
        }
