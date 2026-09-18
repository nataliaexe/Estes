# Estes — Plataforma de Cidadania Ambiental

> Transforma **resíduos ambientais** em **soluções urgentes** e garante **direitos humanos** por meio de **evidência científica aberta**.

---

## Por que existe

O Brasil é feito de **cidades pequenas em vulnerabilidade ambiental** e de **povos indígenas expulsos de suas terras** — sem água potável, sem saneamento, sem informação, sem o Estado.

Exemplos documentados em 2026:

- **Povo Maxakali (Tikmũ'ũn), MG** — confinamento territorial, seca de rios, mortalidade infantil quase **4x maior** que a média brasileira. Justiça Federal decretou **"estado de coisas inconstitucional"** em julho/2026.
- **Waimiri Atroari (AM)** — rio Alalaú contaminado por rejeito de mineração. Animais mortos boiando. IBAMA confirmou ilícito.
- **Defensores ambientais no PA e RO** — **26 assassinatos em um ano**. Brasil é o 2º país mais perigoso do mundo para ativistas.
- **Terras Indígenas** são 23% da Amazônia, mas respondem por só **1,6% do desmatamento**. Protegem mais que o Estado brasileiro.

O Estes existe porque **a solução costuma estar no quintal de casa** — e falta a ponte entre ciência, comunidade e direito.

---

## A tese

**Não é um catálogo de respostas. É um motor de descoberta científica que orienta qualquer pessoa — com qualquer matéria-prima — a resolver um problema ambiental, sempre citando a fonte.**

Exemplo:

> *"Tenho casca de café e o rio está contaminado com metais pesados."*

O Estes:
1. Busca no **Atlas** (22 casos já cadastrados)
2. Se não achar, aciona o **Motor Científico** (Semantic Scholar + Crossref + OpenAlex + Tavily)
3. Extrai **evidências com trecho literal, DOI e nível** (demonstrado / suportado / modelado / hipótese)
4. Gera **caminhos reproduzíveis** baseados nas evidências
5. Cita **limitações e segurança**
6. Se for grave, orienta **documentar e denunciar** ao órgão correto (MPF, IBAMA, FUNAI, SESAI)

**Regra de ouro:** a IA nunca inventa. Cada afirmação tem fonte.

---

## O que está funcionando

### Backend (FastAPI + Postgres + pgvector + Redis + IA)

- ✅ **Atlas de 22 casos** em 5 regiões brasileiras, 9 categorias, 3 níveis de dificuldade
- ✅ **IA em cascata**: Groq → Gemini → Ollama (nunca fica sem resposta)
- ✅ **Busca semântica** (pgvector + nomic-embed-text / bge-m3)
- ✅ **Motor científico** com 4 bases (Semantic Scholar, Crossref, OpenAlex, Tavily)
- ✅ **Extração de evidências** com verificação anti-alucinação (trecho literal + DOI)
- ✅ **Clima em tempo real** (Open-Meteo) + **focos de queimada** (NASA FIRMS)
- ✅ **Previsão de risco** combinando clima + queimadas + medições + notícias
- ✅ **Notícias em tempo real** (SSE) com coleta automática (scheduler 30 min)
- ✅ **Análise de imagem** (tira sensora via celular, sem hardware)
- ✅ **Auth JWT** + endpoint de hardware (ESP32)
- ✅ **Geração de denúncia** via IA
- ✅ **Dashboard** com estatísticas agregadas
- ✅ **Mapa GeoJSON** unificado (casos + medições + notícias)
- ✅ **Exportação** CSV/JSON (dados abertos)
- ✅ **Cache Redis** (clima 30min, queimadas 1h, dashboard 5min)
- ✅ **Health check** de todas as APIs externas
- ✅ **Streaming SSE** do chat IA
- ✅ **Rate limiting** (slowapi)

### Frontend (Next.js 16 + TypeScript + Tailwind v4)

- ✅ Home com **mapa interativo** (Leaflet) — casos + focos em tempo real
- ✅ **Atlas** com filtros por categoria
- ✅ Detalhe do caso (com história, fontes, 3 níveis)
- ✅ **Chat com IA** (motor científico integrado)
- ✅ **Tela `/medir`** com análise de foto no celular

---

## A visão: plataforma ≠ produto único

O **Caso #01 (Eucalipto → sensor + filtro de água)** é o **exemplo com hardware** que prova que a metodologia funciona.

**Os outros 21 casos** são soluções que a pessoa reproduz **sem precisar de hardware**, usando só celular e o que tem em casa.

**O hardware Estes (ESP32) é opcional.** Um upgrade pra quem quer mais precisão. Mas a plataforma funciona 100% sem ele.

**Isso é o ponto:** escala sem barreira de hardware. A Maria no interior de MG não precisa comprar nada. Ela usa o celular dela, uma tira de papel, um LED UV, e uma caixinha de papelão.

---

## O Atlas — 22 casos, 5 regiões, 9 categorias

| # | UF | Categoria | Tipo de solução | HW? | Evidência | Caso |
|---|---|---|---|---|---|---|
| 01 | MG | água | sensor | sim | 🟢 demonstrado | Eucalipto: sensor e filtro |
| 02 | PA | mercúrio | biochar | não | 🟢 demonstrado | Açaí + castanha: biochar tiol |
| 03 | RR | mercúrio | filtro | não | 🟢 demonstrado | Banana + babaçu: filtro |
| 04 | AC | desmatamento | nanocelulose | não | 🟡 suportado | Castanha + bambu |
| 05 | BA | água | biochar | não | 🟡 suportado | Babaçu |
| 06 | PE | água | membrana | não | 🟠 modelado | Sisal + carnaúba |
| 07 | MT | queimada | rede_sensores | sim | 🟡 suportado | Cana + soja |
| 08 | GO | solo | biochar | não | 🟡 suportado | Arroz + cana (sílica) |
| 09 | MG | água | biochar | não | 🟡 suportado | Café + cana |
| 10 | SP | desmatamento | nanocelulose | não | 🟡 suportado | Laranja + cana |
| 11 | RS | enchente | filtro | não | 🟢 demonstrado | Casca de arroz pós-enchente |
| 12 | PR | agrotóxico | biochar | não | 🟠 modelado | Madeira + arroz |
| 13 | AM | ar | rede_sensores | sim | 🟡 suportado | Rede comunitária de ar |
| 14 | MT | queimada | drone | sim | 🟠 modelado | Drones com nariz eletrônico |
| 15 | MG | mercúrio | biochar | não | 🟡 suportado | Serra da Grama |
| 16 | SP | solo | fitorremediação | não | 🟢 demonstrado | Mamona + girassol |
| 17 | MG | resíduos | biodigestor | não | 🟢 demonstrado | Biodigestor comunitário |
| 18 | SP | resíduos | biodigestor | não | 🟢 demonstrado | Microalgas em efluentes |
| 19 | SP | resíduos | reciclagem | não | 🟢 demonstrado | Cooperativas de catadores |
| 20 | SP | desmatamento | drone | sim | 🟢 demonstrado | Reflorestamento com drones |
| 21 | AM | desmatamento | drone | sim | 🟢 demonstrado | Monitoramento indígena |
| 22 | AM | desmatamento | eDNA | não | 🟢 demonstrado | DNA ambiental |

**Níveis de evidência:**

| Símbolo | Nível | Significado |
|---|---|---|
| 🟢 | demonstrado | Experimental reproduzido, com dados |
| 🟡 | suportado | Literatura robusta, não validado no caso exato |
| 🟠 | modelado | Simulação / modelagem |
| 🔵 | hipótese | Proposta teórica sem dados |
| ⚫ | insuficiente | Sem evidência |

**Cada caso tem 3 níveis de acesso:**

1. **Pronto** — compra kit, usa em 5 minutos
2. **Simples** — faz em casa com o que tem, em 1 dia
3. **Completo** — protocolo científico, em 1 semana

---

## Stack tecnológica

### Backend
- **FastAPI** + Pydantic v2 + SQLAlchemy 2.0 (async)
- **PostgreSQL 16** + **pgvector** (busca semântica)
- **Redis** (cache)
- **Alembic** (migrations)
- **APScheduler** (coleta automática de notícias)
- **structlog** (logs estruturados)
- **slowapi** (rate limiting)

### IA
- **Groq** (`groq/compound`) — LLM principal
- **Gemini** (`gemini-3.6-flash`) — multimodal + fallback
- **Ollama** (`qwen2.5-coder:7b`) — offline + fallback final
- **bge-m3** (1024 dim) — embeddings
- **Tavily** — busca web acadêmica

### Fontes científicas
- **Semantic Scholar** (250M papers)
- **Crossref** (DOI + metadados)
- **OpenAlex** (250M trabalhos)
- **Tavily** (web acadêmico: scielo, .edu, gov.br)

### Fontes ambientais em tempo real
- **Open-Meteo** (clima, qualidade do ar)
- **NASA FIRMS** (focos de queimada, satélite VIIRS)

### Frontend
- **Next.js 16** (App Router, Turbopack)
- **TypeScript** + **Tailwind CSS v4**
- **Leaflet** + OpenStreetMap (mapa)
- **SWR** (fetch de dados)

### Infra
- **Docker Compose** (Postgres + Redis)
- **uv** (Python package manager)
- **pnpm** (Node package manager)

---

## Como rodar

### Pré-requisitos
- Docker + Docker Compose
- Python 3.12+ com `uv`
- Node 22+ com `pnpm`
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
python scripts/seed_amostras.py

# Rodar
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API em `http://localhost:8000` — docs interativas em `/docs`.

### Frontend

```bash
cd frontend
pnpm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
pnpm dev
```

App em `http://localhost:3000`.

---

## Endpoints principais

### Atlas
- `GET /api/v1/casos` — lista (filtros: categoria, uf, evidencia, precisa_hardware)
- `GET /api/v1/casos/{numero}` — detalhe com história, fontes, 3 níveis
- `POST /api/v1/casos/buscar` — busca semântica (pgvector)
- `GET /api/v1/casos/estatisticas` — contagens por categoria/UF/evidência

### IA + Motor Científico
- `POST /api/v1/ia/perguntar` — agente completo (Atlas + web + motor científico)
- `POST /api/v1/ia/stream` — streaming SSE
- `POST /api/v1/explorar` — motor científico puro (material novo)
- `GET /api/v1/ia/status` — provedores disponíveis

### Contexto ambiental
- `GET /api/v1/clima?lat=&lon=` — clima + risco de queimada/enchente
- `GET /api/v1/queimadas?lat=&lon=&raio_km=&dias=` — focos NASA FIRMS
- `GET /api/v1/predicao?lat=&lon=&uf=` — risco combinado
- `POST /api/v1/noticias/feed` — feed localizado
- `GET /api/v1/noticias/stream?uf=` — streaming SSE
- `GET /api/v1/dashboard` — estatísticas gerais
- `GET /api/v1/mapa/pontos` — GeoJSON unificado

### Imagens
- `POST /api/v1/imagens/upload` — upload
- `POST /api/v1/imagens/analisar` — análise da tira sensoras

### Hardware
- `POST /api/v1/hardware/medicao` — recebe medição do ESP32 (token de dispositivo)
- `GET /api/v1/hardware/medicoes` — lista medições

### Direitos
- `POST /api/v1/auth/registrar` — cadastro
- `POST /api/v1/auth/login` — login
- `POST /api/v1/documentos` — gera denúncia via IA
- `GET /api/v1/documentos` — lista documentos do usuário

### Saúde
- `GET /api/v1/health/apis` — disponibilidade de todas as APIs externas

### Exportação
- `GET /api/v1/exportar/casos.csv` — CSV aberto
- `GET /api/v1/exportar/casos.json` — JSON aberto

---

## Estrutura do projeto

```
Estes/
├── backend/
│   ├── app/
│   │   ├── core/          # config, db, security, cache, logging, scheduler
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routers/       # endpoints REST
│   │   ├── services/      # IA, ciência, clima, queimadas, previsão
│   │   └── data/          # seeds do Atlas + histórias
│   ├── alembic/           # migrations
│   ├── scripts/           # seed, testes
│   ├── static/            # imagens de passos visuais
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Home com mapa
│   │   ├── atlas/             # lista do Atlas
│   │   ├── caso/[numero]/     # detalhe do caso
│   │   ├── chat/              # assistente IA
│   │   ├── medir/             # análise por foto
│   │   ├── componentes/       # Mapa, etc
│   │   └── lib/api.ts         # cliente da API
│   └── package.json
└── README.md
```

---

## Histórias que inspiram

### Maxakali (Tikmũ'ũn) — Vale do Mucuri, MG

O povo Maxakali vive há séculos no vale do Mucuri. Foi cercado por fazendas de gado e desmatamento. Sem mata, a caça sumiu. Sem mata, os rios secaram. Hoje as crianças bebem córrego com agrotóxico. Em julho de 2026, a Justiça Federal decretou **"estado de coisas inconstitucional"** e exigiu intervenção urgente.

- **Número chave:** mortalidade infantil quase 4x maior que a média brasileira
- **Lacuna:** o sistema de saúde não tem intérprete. A maioria quase não fala português
- **O que pedem:** ampliação de terra + água encanada + autonomia em saúde
- **Como o Estes responde:** Caso #15 (biochar para solo com mercúrio) + Caso #1 (sensor de eucalipto feito pela própria comunidade)
- **Fonte:** G1 (27/07/2026), Fiocruz, Artigo19, AnsUnba

### Waimiri Atroari — Rio Alalaú, AM/RR

Indígenas denunciaram desastre ambiental no rio Alalaú. Dezenas de animais mortos (botos, tartarugas) boiando. IBAMA constatou indícios de vazamento de rejeito de mineração de estanho.

- **Número chave:** comprometimento total da segurança alimentar do território
- **Como o Estes responde:** Caso #3 (filtro de banana + babaçu) + Caso #21 (monitoramento com drones)
- **Fonte:** Repórter Brasil (05/2026), IBAMA

### Defensores ambientais — PA e RO

O Brasil registrou **26 assassinatos** de defensores da terra e do meio ambiente em um ano. Brasil é o **2º país mais perigoso do mundo** para ativistas ambientais, atrás só da Colômbia.

- **Número chave:** 26 mortes em 1 ano
- **Como o Estes responde:** Caso #20 (reflorestamento com drones) + Caso #22 (eDNA)
- **Fonte:** Global Witness / Blog do Pedlowski (17/09/2026)

---

## O que falta

### Backend
- Módulo de **contribuições comunitárias** (usuário posta solução, curador valida)
- **Tradução** (Yanomami, Guarani, Tupi)
- **Reputação** de medições (múltiplas no mesmo local = mais confiança)

### Frontend
- **Feed de notícias** ao vivo
- **Dashboard público** com estatísticas
- Tela `/explorar` (motor científico puro)
- **Passos visuais** com fotos reais
- PWA (modo offline)

### Conteúdo
- **Histórias dos 22 casos** (1 de 22 preenchida)
- Fotos dos passos visuais (experimento do eucalipto)

### Extras
- Firmware ESP32 (opcional — a plataforma funciona sem)
- Vídeo de pitch (3 min)

---

## Estratégia de propriedade intelectual

**Publicação defensiva.** Não patente agora.

- **Software:** MIT (open source)
- **Método:** publicação científica (prioridade registrada)
- **Hardware:** pode ser comercializado futuramente, mas a plataforma continua aberta

**Objetivo:** artigo científico + hackathon + parceria com ONG/governo.

---

## Roadmap

- ✅ **Fase 1 (set/2026):** Backend + frontend iniciais. 22 casos. Motor científico. Hackathon.
- ⏳ **Fase 2 (out/2026):** Preprint arXiv + submissão a revista.
- 🔜 **Fase 3 (nov/2026+):** Módulo de contribuições. Parceria com ONG.
- 🔜 **Fase 4 (2027):** Plataforma pública. Expansão LATAM.
- 🔜 **Fase 5 (2027+):** Startup / política pública.

---

## Licença

**MIT** — projeto open source.

---

## Reconhecimentos

- **Bawendi, Brus, Ekimov** (Nobel 2023) — pontos quânticos
- **Förster** (1948) — FRET
- **NASA FIRMS** — focos de queimada em tempo real
- **INPE**, **IBGE**, **ANA**, **FIOCRUZ** — dados ambientais brasileiros
- **ISA**, **IPAM**, **Repórter Brasil** — jornalismo ambiental
- **Comunidades** que inspiraram os casos: Maxakali (Tikmũ'ũn), Waimiri Atroari, Yanomami, Kaingang, povos do Vale do Javari

---

## Contato

**Natalia** — [@nataliaexe](https://github.com/nataliaexe)

---

**Estes — Soluções que nascem da raiz.**
