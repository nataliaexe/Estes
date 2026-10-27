import pytest

from app.services import ciencia


class FakeResponse:
    status_code = 200

    def __init__(self, payload):
        self.payload = payload

    def json(self):
        return self.payload


class FakeAsyncClient:
    payload = {}
    status_code = 200

    def __init__(self, *args, **kwargs):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return None

    async def get(self, url, **kwargs):
        response = FakeResponse(self.payload)
        response.status_code = self.status_code
        return response


@pytest.mark.asyncio
async def test_semantic_scholar_response_maps_to_paper(monkeypatch):
    FakeAsyncClient.payload = {
        "data": [{
            "title": "Cellulose for water sensing",
            "authors": [{"name": "A. Researcher"}],
            "year": 2024,
            "doi": "10.1234/example",
            "url": "https://example.org/paper",
            "abstract": "A sufficiently detailed abstract about optical water sensing.",
            "venue": "Journal of Example Science",
            "citationCount": 7,
            "publicationTypes": ["JournalArticle"],
        }]
    }
    monkeypatch.setattr(ciencia.httpx, "AsyncClient", FakeAsyncClient)

    papers = await ciencia.buscar_semantic_scholar("cellulose water", limite=1)

    assert len(papers) == 1
    assert papers[0].titulo == "Cellulose for water sensing"
    assert papers[0].autores == ["A. Researcher"]
    assert papers[0].doi == "10.1234/example"
    assert papers[0].citacoes == 7
    assert papers[0].fonte == "semantic_scholar"


@pytest.mark.asyncio
async def test_crossref_response_maps_optional_fields(monkeypatch):
    FakeAsyncClient.payload = {
        "message": {"items": [{
            "title": ["Water quality study"],
            "author": [{"given": "Ana", "family": "Silva"}],
            "issued": {"date-parts": [[2023]]},
            "DOI": "10.5678/water",
            "URL": "https://doi.org/10.5678/water",
            "abstract": "An abstract.",
            "type": "journal-article",
            "container-title": ["Water Journal"],
            "is-referenced-by-count": 3,
        }]}
    }
    monkeypatch.setattr(ciencia.httpx, "AsyncClient", FakeAsyncClient)

    papers = await ciencia.buscar_crossref("water quality", limite=1)

    assert papers[0].autores == ["Ana Silva"]
    assert papers[0].ano == 2023
    assert papers[0].journal == "Water Journal"
    assert papers[0].fonte == "crossref"


@pytest.mark.asyncio
async def test_openalex_reconstructs_abstract_and_normalizes_doi(monkeypatch):
    FakeAsyncClient.payload = {
        "results": [{
            "title": "Optical water sensor",
            "publication_year": 2022,
            "doi": "https://doi.org/10.9999/sensor",
            "id": "https://openalex.org/W1",
            "abstract_inverted_index": {"Water": [1], "Optical": [0], "sensor.": [2]},
            "authorships": [],
            "cited_by_count": 4,
            "primary_location": {"source": {"display_name": "Sensors"}},
            "type": "article",
        }]
    }
    monkeypatch.setattr(ciencia.httpx, "AsyncClient", FakeAsyncClient)

    papers = await ciencia.buscar_openalex("optical water", limite=1)

    assert papers[0].abstract == "Optical Water sensor."
    assert papers[0].doi == "10.9999/sensor"
    assert papers[0].journal == "Sensors"


@pytest.mark.asyncio
async def test_scientific_source_returns_empty_on_http_error(monkeypatch):
    FakeAsyncClient.status_code = 503
    monkeypatch.setattr(ciencia.httpx, "AsyncClient", FakeAsyncClient)

    assert await ciencia.buscar_semantic_scholar("water") == []

    FakeAsyncClient.status_code = 200
