# Estes — Plataforma de Cidadania Ambiental

> Transforma **recursos locais** em **soluções ambientais** e garante **direitos** por meio de **evidência científica**.

## O que é

O Estes é uma plataforma que ajuda qualquer pessoa — em qualquer lugar do Brasil — a:

1. **Ver o que está acontecendo** na sua região (queimadas, contaminação, desmatamento, clima).
2. **Descobrir o que fazer** com o que ela já tem em casa (eucalipto, casca de arroz, açaí, banana).
3. **Testar, filtrar e agir** com protocolos científicos reproduzíveis.
4. **Documentar e denunciar** com evidência e fontes legais.

O **Atlas Brasileiro** tem **22 casos** em **5 regiões**, cobrindo água, solo, ar, resíduos, queimada, desmatamento, mercúrio, agrotóxico e enchente.

O **Caso #01 (Eucalipto → sensor + filtro de água)** é o exemplo com hardware que prova que a metodologia funciona. **Os outros 21 casos** são soluções que a pessoa reproduz **sem precisar de hardware**.

## Status

- Backend: 100% funcional (FastAPI + Postgres + pgvector + Redis + IA)
- Frontend: 80% (Next.js + Leaflet + Tailwind)
- Firmware ESP32: pendente
- Histórias dos casos: parcial (1 de 22)
- Documento técnico: 40%
- Pitch: pendente

## Stack

### Backend
- **FastAPI** + **Pydantic v2** + **SQLAlchemy 2.0 (async)**
- **PostgreSQL 16** + **pgvector** (busca semântica) + **PostGIS** (futuro)
- **Redis** (cache)
- **Alembic** (migrations)
- **Ollama** (embeddings locais + fallback LLM)
- **Groq** (LLM principal) + **Gemini** (fallback)
- **Tavily** (busca web)
- **NASA FIRMS** (focos de queimada)
- **Open-Meteo** (clima e qualidade do ar)

### Frontend
- **Next.js 16** (App Router)
- **TypeScript** + **Tailwind CSS v4**
- **Leaflet** (mapa)
- **SWR** (futuro)

### Infra
- **Docker Compose** (Postgres + Redis)
- **uv** (Python package manager)

## Como rodar

### Pré-requisitos
- Docker + Docker Compose
- Python 3.12+
- Node 22+ + pnpm
- Ollama rodando em `localhost:11434`

### Backend

```bash
cd backend

# Venv
uv venv --python 3.12 .venv
source .venv/bin/activate

# Deps
uv pip install -r requirements.txt

# Config
cp .env.example .env
# Edite o .env com suas chaves (Groq, Gemini, Tavily, FIRMS)

# Subir Postgres + Redis
docker compose up -d

# Migrations
alembic upgrade head

# Popular Atlas (22 casos)
python scripts/seed_atlas.py

# Rodar
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
API em http://localhost:8000 — docs em /docs.
Frontend
bash

cd frontend

# Deps
pnpm install

# Config
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local

# Rodar
pnpm dev

App em http://localhost:3000.
Endpoints principais
Atlas

    GET /api/v1/casos — lista (filtros: categoria, uf, evidencia, precisa_hardware)

    GET /api/v1/casos/{numero} — detalhe com história, fontes, 3 níveis

    POST /api/v1/casos/buscar — busca semântica (pgvector)

    GET /api/v1/casos/estatisticas — contagens por categoria/UF/evidência

Contexto ambiental

    GET /api/v1/clima?lat=&lon= — clima + risco de queimada/enchente (Open-Meteo)

    GET /api/v1/queimadas?lat=&lon=&raio_km=&dias= — focos NASA FIRMS

    POST /api/v1/noticias/feed — feed localizado (Tavily)

    GET /api/v1/dashboard — estatísticas gerais

IA

    POST /api/v1/ia/perguntar — agente (busca no Atlas + web, responde)

    GET /api/v1/ia/status — provedores disponíveis

Hardware

    POST /api/v1/hardware/medicao — recebe medição do ESP32 (token de dispositivo)

    GET /api/v1/hardware/medicoes — lista medições

Direitos

    POST /api/v1/auth/registrar — cadastro (JWT)

    POST /api/v1/auth/login — login

    POST /api/v1/documentos — gera denúncia via IA

    GET /api/v1/documentos — lista documentos do usuário

Saúde

    GET /api/v1/health/apis — testa disponibilidade de todas as APIs externas

Estrutura
text

Estes/
├── backend/
│   ├── app/
│   │   ├── core/          # config, db, security, cache, logging
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routers/       # endpoints
│   │   ├── services/      # lógica (IA, busca, clima, queimadas)
│   │   └── data/          # seeds do Atlas
│   ├── alembic/           # migrations
│   ├── scripts/           # utilitários
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Home com mapa
│   │   ├── atlas/             # lista do Atlas
│   │   ├── caso/[numero]/     # detalhe do caso
│   │   ├── chat/              # assistente IA
│   │   ├── componentes/       # Mapa, etc
│   │   └── lib/api.ts         # cliente da API
│   └── package.json
└── README.md

O que já funciona

    22 casos no Atlas com categorização, tipos de solução e flag de hardware

    Busca semântica (pgvector + nomic-embed-text)

    Agente IA em cascata (Groq → Gemini → Ollama) com busca web (Tavily)

    Sistema anti-alucinação (só afirma o que está no contexto)

    Clima em tempo real + risco de queimada/enchente

    Focos de queimada da NASA ao vivo

    Health check de todas as APIs

    Cache Redis (clima 30min, queimadas 1h, dashboard 5min)

    Autenticação JWT

    Endpoint de hardware para ESP32

    Geração de denúncia via IA

    Dashboard de estatísticas

    Frontend com mapa interativo + lista + detalhe + chat

O que falta

    Firmware ESP32 (C++ / Arduino)

    Histórias dos 22 casos (1 de 22 preenchida)

    Notícias em tempo real (scheduler + SSE)

    Streaming do chat (SSE)

    Mapa com clusterização

    Exportação CSV/GeoJSON

    PWA (modo offline)

    Documento técnico final

    Pitch de 5 minutos

Licença

MIT — projeto open source. Hardware pode ser comercializado futuramente, mas a plataforma é e sempre será aberta.
Reconhecimentos

    Bawendi, Brus, Ekimov (Nobel 2023) — pontos quânticos

    Förster (1948) — FRET

    NASA FIRMS — focos de queimada

    INPE — dados ambientais brasileiros

    Comunidades que inspiraram os casos (Yanomami, Kaingang, Serra da Grama)

Contato

Natalia — @nataliaexe

Estes — Soluções que nascem da raiz.
