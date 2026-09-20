# Estes — Environmental Citizenship Platform

> **You bring what you have. Estes investigates what can be done.**

**Estes** is an open-source platform that turns local waste — eucalyptus, coffee husk, rice husk, açaí — into environmental solutions. Any material. Any problem. Always with scientific evidence and DOI.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

---

## The problem

Brazil has **5,570 municipalities**. Most have **no lab, no sensors, no data**. When a river is contaminated, people find out **weeks later** — if ever.

Meanwhile, Brazil exports **raw cellulose, raw soy, raw iron**. We export what we have. We don't transform it.

In July 2026, the Brazilian Federal Court declared a "state of unconstitutional things" for the **Maxakali people**. Four times more children die there than the national average — not because of a war, but because they don't have clean water.

> **Estes inverts this logic.** We turn local waste into local solutions.
---

## What's inside

### Backend
- **FastAPI** + Pydantic v2 + SQLAlchemy 2.0 (async)
- **PostgreSQL 16** + **pgvector** (semantic search)
- **Redis** (cache + rate limiting)
- **Alembic** (migrations)
- **APScheduler** (news collection)
- **Circuit breaker** (survives AI failures)

### AI cascade (never fails)

Groq (LLM) ─► Gemini (vision + fallback) ─► Ollama (local)
│ │ │
└──── if 429 ────────┴──── if timeout ────────┘
text

- **Groq** — main LLM (llama-3.3-70b, groq/compound)
- **Gemini** — multimodal vision (gemini-2.5-flash)
- **Ollama** — local fallback (llama3.2:1b)
- **Circuit breaker** — automatic provider switching after 3 failures

### Scientific engine
- **Semantic Scholar** (200M+ papers)
- **Crossref** (150M+ DOIs)
- **OpenAlex** (250M+ works)
- **Tavily** (academic web search)
- **NASA FIRMS** (live fire hotspots)
- **Open-Meteo** (climate + air quality)

### Frontend
- **Next.js 16** + TypeScript + Tailwind v4
- **GSAP ScrollTrigger** (story-scroll narrative)
- **Framer Motion** (animations)
- **Leaflet** (live map)
- **i18n** (PT/EN)

### Hardware (Case #01)
- **CQD sensor** — eucalyptus → carbon quantum dots → fluorescent strip
- **CNC/biochar filter** — eucalyptus → nanocellulose + activated biochar
- **Total cost:** $5 per filter, $1 per test strip

---

## The Atlas — 19 investigated cases

| # | UF | Category | Solution | Evidence |
|---|---|---|---|---|
| 01 | MG | water | Eucalyptus sensor + filter | demonstrated |
| 02 | PA | mercury | Açaí + castanha biochar | demonstrated |
| 03 | RR | mercury | Banana + babassu filter | demonstrated |
| 04 | AC | deforestation | Castanha nanocellulose | supported |
| 05 | BA | water | Babassu biochar | supported |
| 06 | PE | water | Sisal membranes | modeled |
| 07 | MT | fire | Cana sensor network | supported |
| 08 | GO | soil | Rice husk silica biochar | supported |
| 09 | MG | water | Coffee + cana biochar | supported |
| 10 | SP | deforestation | Orange nanocellulose | supported |
| 11 | RS | flood | Rice husk filter | demonstrated |
| 12 | PR | agrotoxin | Wood biochar | modeled |
| 13 | AM | air | Community air network | supported |
| 15 | MG | mercury | Biochar for Hg soil | supported |
| 16 | SP | soil | Phytoremediation | demonstrated |
| 17 | MG | waste | Community biodigester | demonstrated |
| 18 | SP | waste | Microalgae effluent | demonstrated |
| 19 | SP | waste | Recycling cooperative | demonstrated |
| 22 | AM | deforestation | eDNA biodiversity | demonstrated |

### Evidence levels

| Level | Meaning |
|---|---|---|
|**demonstrated** | Reproduced experimentally with data |
|**supported** | Literature-backed, not validated in the exact case |
|**modeled** | Simulation / computational model |
|**hypothesis** | Theoretical proposal |
|*insufficient** | No evidence yet |

---

## Quick start

### Prerequisites
- Docker + Docker Compose
- Python 3.12+ with `uv`
- Node 22+ with `npm`
- Ollama running at `localhost:11434`

### Backend

```bash
cd backend

# Virtual environment
uv venv --python 3.12 .venv
source .venv/bin/activate

# Dependencies
uv pip install -r requirements.txt

# Config
cp .env.example .env
# Edit .env with your keys: GROQ_API_KEY, GEMINI_API_KEY, TAVILY_API_KEY, FIRMS_API_KEY

# Containers (Postgres + Redis)
docker compose up -d

# Migrations
alembic upgrade head

# Seed the Atlas (19 cases)
python scripts/seed_atlas.py
python scripts/seed_amostras.py

# Run
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

API at http://localhost:8000 · docs at /docs
Frontend
bash

cd frontend

npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
npm run dev

App at http://localhost:3000
API endpoints
Atlas

    GET /api/v1/casos — list cases (filters: categoria, uf, evidencia)

    GET /api/v1/casos/{numero} — case detail with history, sources, protocols

    POST /api/v1/casos/buscar — semantic search

    GET /api/v1/casos/estatisticas — counts

AI

    POST /api/v1/ia/perguntar — agent with Atlas + web + science

    POST /api/v1/ia/stream — SSE streaming

    POST /api/v1/ia/vision — image analysis (Gemini Vision)

    POST /api/v1/explorar — scientific engine for any material

    POST /api/v1/ia/gerar-passos/{caso} — AI-generated protocol images

Context

    GET /api/v1/clima?lat=&lon= — climate + fire risk

    GET /api/v1/queimadas?lat=&lon= — NASA FIRMS hotspots

    GET /api/v1/predicao?lat=&lon= — combined risk prediction

    GET /api/v1/mapa/pontos — unified GeoJSON

    POST /api/v1/noticias/feed — localized news

Contribution

    POST /api/v1/contribuicoes — post contribution

    POST /api/v1/contribuicoes/{id}/votar — vote

    POST /api/v1/contribuicoes/{id}/validar — curator validation

Auth

    POST /api/v1/auth/registrar — register

    POST /api/v1/auth/login — login (JWT)

Project structure
text

Estes/
├── backend/
│   ├── app/
│   │   ├── core/          # config, database, security, cache, circuit breaker
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # AI agent, science engine, climate, fires
│   │   └── data/          # Atlas seeds, histories
│   ├── alembic/           # migrations
│   ├── scripts/           # utilities
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # home (story-scroll)
│   │   ├── atlas/             # case list
│   │   ├── caso/[numero]/     # case detail
│   │   ├── chat/              # AI assistant
│   │   ├── explorar/          # scientific engine
│   │   ├── medir/             # photo analysis
│   │   ├── contribuir/        # contribution form
│   │   ├── noticias/          # news
│   │   ├── componentes/       # UI components
│   │   └── lib/               # api client, i18n
│   └── package.json
└── README.md

Contributing

This project is open source and welcomes contributions from:

    Researchers — add cases to the Atlas

    Developers — improve the platform, add languages

    Communities — report real problems, test protocols

    Curators — validate contributions

How to contribute

    Fork the repository

    Create a branch (git checkout -b feature/new-case)

    Commit your changes (git commit -m "feat: add case #20")

    Push to the branch (git push origin feature/new-case)

    Open a Pull Request

See CONTRIBUTING.md for details.
Roadmap

     Phase 1 (Sep 2026): Backend + frontend + 19 cases + scientific engine

     Phase 2 (Oct 2026): Scientific preprint + journal submission

     Phase 3 (Nov 2026+): Native mobile app, indigenous language support

     Phase 4 (2027): Atlas expansion to 5 Latin American countries

     Phase 5 (2027+): Open data API for researchers and governments

Hackathon disclosure
Before NextStep Hacks 2026

    Ideation and scope definition (Sept 9, 2026)

    Initial Atlas with eucalyptus case (Sept 10, 2026)

    Patent search and initial technical document (Sept 10, 2026)

    Concept of platform + Brazilian Atlas (Sept 11, 2026)

During NextStep Hacks 2026

    Complete backend: FastAPI + PostgreSQL + pgvector + Redis

    AI cascade: Groq → Gemini → Ollama with circuit breaker

    Scientific engine: Semantic Scholar + Crossref + OpenAlex + Tavily

    19 cases in the Atlas (9 categories, 5 Brazilian regions)

    Frontend: Next.js 16 + Tailwind + Leaflet + GSAP + Framer Motion

    Real-time data: Open-Meteo (climate) + NASA FIRMS (fires)

    Contribution module: post, vote, comment, curate

    Accessibility: TTS + high contrast

    Cultural narratives: Maxakali, Waimiri Atroari, defenders

    Story-scroll narrative with 6 scenes

    Hardware prototype: CQD sensor + CNC/biochar filter

Inspiration

    "O Maxakali surgiu através da gíria, da gíria do barro. Por isso que o território para nós é muito importante. Todo local tem história e tem o canto também."

    — Maxakali elder, Vale do Mucuri, MG

In July 2026, the Brazilian Federal Court declared a "state of unconstitutional things" for the Maxakali people. Four times more children die there than the national average — not because of a war, but because they don't have clean water.

The right to keep existing.
License

MIT — open source, always free.

The platform will never be commercialized. Hardware kits may be sold to fund the platform, but the core stays open.
Acknowledgements

    Bawendi, Brus, Ekimov (Nobel Prize 2023) — quantum dots

    Förster (1948) — FRET

    NASA FIRMS — live fire hotspots

    INPE, IBGE, ANA, FIOCRUZ — Brazilian environmental data

    ISA, IPAM, Repórter Brasil — environmental journalism

    Maxakali, Waimiri Atroari, Yanomami communities — the why

Estes — Solutions that grow from the root.
