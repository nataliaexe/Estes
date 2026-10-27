# Estes

Plataforma aberta de investigação ambiental. O projeto reúne uma interface web e uma API para explorar casos ambientais, consultar fontes científicas, registrar contribuições e experimentar fluxos de análise assistidos por IA.

> O Estes é um protótipo em desenvolvimento. Não substitui análise laboratorial, avaliação profissional ou políticas públicas. Hipóteses e resultados precisam de validação independente.

## Estado atual

O repositório contém:

- **Frontend:** Next.js 16 e React 19, com páginas para atlas de casos, exploração, evidências, notícias, chat, contribuição e medição.
- **API:** FastAPI com rotas para casos, ciência, clima, queimadas, notícias, documentos, contribuições e IA.
- **Busca científica:** integrações implementadas para Semantic Scholar, Crossref e OpenAlex, com persistência/cache em PostgreSQL e busca opcional na web via Tavily.
- **Extração de evidências:** fluxo que usa abstracts disponíveis e pede trechos literais, limitações e classificação à IA. Isso não equivale a revisão sistemática nem valida por si só a fidelidade da extração.
- **Infraestrutura local:** PostgreSQL com pgvector e Redis via Docker Compose; migrações Alembic.
- **Testes automatizados:** testes assíncronos da API, dos parsers científicos, da extração de evidências e do comportamento dos probes.

### Limites que devem aparecer em uma demonstração

- Os testes automatizados cobrem regras e respostas simuladas. A rota `/api/v1/health/apis` verifica dependências e APIs reais configuradas, mas disponibilidade externa pode variar.
- Não há evidência no código de validação experimental do Quantum Cell. Trate-o como hipótese de pesquisa.
- Integrações externas precisam de rede, credenciais quando aplicável e serviços locais configurados. A presença de uma integração no código não garante disponibilidade ou validação operacional.
- Semantic Scholar pode limitar tráfego com HTTP 429. Crossref e OpenAlex funcionaram no último smoke test real; Groq, Gemini, Ollama e Open-Meteo também foram verificados. Esses resultados são pontuais.
- Não há no fluxo atual um registro reprodutível completo que conecte toda evidência, hipótese, recursos, testes e resultados como descrito no pitch.
- O README e a interface não devem apresentar impactos ambientais, números de cobertura ou alegações jurídicas sem fonte primária verificável e contexto.

## Estrutura

```text
backend/
  app/                 API, modelos, esquemas, serviços e rotas
  alembic/             migrações do banco
  scripts/             seeds e verificações manuais
  docker-compose.yml   PostgreSQL/pgvector e Redis
  requirements.txt
frontend/
  app/                 páginas e componentes Next.js
```

## Desenvolvimento local

### 1. Configurar variáveis

Copie `backend/.env.example` para `backend/.env`. Crie `frontend/.env.local` com `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`. Configure uma `SECRET_KEY` forte e as chaves dos provedores que pretende usar. Não compartilhe arquivos `.env`.

### 2. Iniciar dependências e API

```bash
cd backend
docker compose up -d
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

A API e sua documentação ficam, por padrão, em `http://localhost:8000` e `http://localhost:8000/docs`.

### 3. Iniciar frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend usa `NEXT_PUBLIC_API_URL` para localizar a API. Defina essa variável em `frontend/.env.local` quando necessário.

## Verificações

```bash
# Backend
cd backend
pytest -q
ruff check app

# Frontend
cd frontend
npm run typecheck
npm run lint
npm run build
```

O build de produção usa Webpack. O lint foi ligado ao ESLint recomendado pelo Next.js; ele ainda aponta pendências herdadas no frontend. Consulte o resultado mais recente antes de tratar as verificações como critério de release.

## Pitch e Quantum Cell

O pitch deve separar claramente funcionalidades presentes, integrações configuráveis, comportamentos planejados e resultados ainda não medidos. O Quantum Cell é apresentado como linha de pesquisa em sensoriamento óptico com derivados de celulose de eucalipto; não há validação experimental concluída neste repositório.

## Licença

O README anterior indicava MIT, mas não havia arquivo de licença rastreado. A licença precisa ser definida e incluída antes de descrever o repositório como formalmente licenciado como código aberto.
