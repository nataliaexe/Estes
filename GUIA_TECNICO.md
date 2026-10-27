# Estes - Guia Técnico do Produto

## Definição do Produto

Estes é uma plataforma aberta para investigar problemas ambientais locais a partir de evidências científicas, materiais regionais e hipóteses rastreáveis. O foco não é gerar uma resposta final, mas organizar a investigação de forma transparente, reproduzível e acessível.

**Quantum Cell** é uma linha de pesquisa dentro do projeto para explorar materiais brasileiros, especialmente celulose de eucalipto, em aplicações de sensoriamento e filtragem de água.

## Produto Central

- Plataforma central: plataforma de investigação ambiental, com base em evidências científicas e materiais locais
- Linha de pesquisa: Quantum Cell, dentro do projeto, como estudo de caso e demonstração de uso

**Estrutura de produto:**
- Estes = plataforma
- Quantum Cell = caso/linha de pesquisa dentro do sistema

## MVP - O que o software deve entregar

O projeto, no front e no back, deve apoiar este fluxo principal:

### 1. Descrever um problema
Exemplo: contaminação da água em área rural, solo degradado, falta de dados, etc.

### 2. Buscar evidências
- literatura científica
- dados ambientais
- materiais locais
- estudos correlatos

### 3. Organizar evidências
- artigo
- DOI
- trecho relevante
- tipo de evidência
- nível de confiança
- limitações

### 4. Relacionar com materiais
- material local
- propriedade relevante
- uso potencial
- contexto regional

### 5. Gerar hipótese
- o que pode ser plausível
- o que ainda é hipótese
- o que precisa ser testado

### 6. Registrar o processo
- investigação
- fontes
- limitações
- passos seguintes

Essa deve ser a lógica do produto. Tudo o que for fora disso pode entrar depois.

## Estrutura do Projeto Técnico Ideal

### Backend

```
app/
  api/
    routes/
      cases.py
      evidence.py
      materials.py
      protocols.py
      search.py
      health.py
  domain/
    cases/
    evidence/
    materials/
    hypotheses/
    protocols/
  services/
    scientific_search.py
    evidence_extraction.py
    material_matching.py
    hypothesis_builder.py
    validation.py
  schemas/
    case.py
    evidence.py
    material.py
    hypothesis.py
    protocol.py
  db/
    models.py
    repositories.py
  core/
    config.py
    security.py
    logging.py
  data/
    atlas/
    seed_cases.json
  tests/
    test_cases.py
    test_evidence.py
    test_materials.py
```

### Frontend

```
app/
  (public)/
    page.tsx
    sobre.tsx
    casos.tsx
  (app)/
    investigar/
      page.tsx
      nova/
      [caseId]/
    evidencias/
      [id]/
    materiais/
      [id]/
    protocolo/
      [id]/
    dashboard/
    perfil/
components/
  layout/
  cards/
  forms/
  tables/
  evidence/
  tags/
  charts/
features/
  investigation/
  evidence/
  materials/
  protocol/
lib/
  api.ts
  types.ts
```

## Arquitetura de Dados Mais Importante

Você precisa definir modelos simples e muito claros. Não pode ficar "qualquer dado".

### Modelo Principal

#### Case
- id
- title
- location
- problem_type
- summary
- created_at
- status

#### Evidence
- id
- case_id
- source_type
- title
- authors
- year
- doi
- excerpt
- url
- evidence_level
- confidence
- notes
- limitations

#### Material
- id
- name
- category
- region
- availability
- properties
- relevance
- source

#### Hypothesis
- id
- case_id
- title
- description
- supporting_evidence_ids
- relevant_material_ids
- status
- confidence
- limitations

#### Protocol
- id
- case_id
- steps
- materials_needed
- equipment_needed
- objectives
- risks
- validation_plan

Esses modelos resolvem a estrutura do produto.

## O que Deve Aparecer no Frontend

Isso aqui é o mais importante.

A tela principal não deve ser um "chatbot geral". A tela principal deve ser uma tela de investigação.

O front deve incluir:

### 1. Landing / apresentação
- nome do projeto
- missão
- explicação simples do que é
- CTA principal: "Investigar um problema"
- CTA secundário: "Explorar casos"
- "Como funciona" em 3 blocos

### 2. Nova investigação
- formulário:
  - problema
  - local
  - tipo de impacto
  - contexto
  - recursos disponíveis
- botão: "Gerar investigação"
- esta é a entrada principal do produto

### 3. Dashboard de investigação
- resumo do caso
- problema
- evidências encontradas
- materiais locais sugeridos
- hipóteses
- status da investigação
- nível de confiança
- limitações

### 4. Página de evidências
- lista de fontes
- artigo / dado / patente / estudo
- DOI
- resumo
- trechos relevantes
- nível de evidência
- status: comprovado / apoiado / hipótese / não validado
- botão "ver detalhes"

### 5. Página de materiais
- material local
- origem/região
- propriedades
- uso potencial
- relação com o problema
- limitações
- referências

### 6. Página de hipótese
- hipótese principal
- base em evidências
- materiais relevantes
- suporte científico
- o que falta testar
- rótulo: "hipótese", "sugestão", "observação"
- sempre mostrar diferença entre evidência e hipótese

### 7. Página de protocolo
- objetivo
- materiais
- passos
- risco
- método
- cronograma
- validação
- observações

### 8. Página de atlas / casos
- lista de casos ambientais
- categoria
- região
- tipo de problema
- evidência disponível
- status

### 9. Página de "Quantum Cell"
- descreve a linha de pesquisa
- materiais
- objetivo
- contexto científico
- limitações
- status: pesquisa em desenvolvimento

Esses são os elementos que fazem o produto parecer coerente.

## O que NÃO Deve Aparecer no Frontend no MVP

- chatbot "faça tudo"
- uma tela de IA genérica como primeiro foco
- dashboard super visual sem contexto
- muitas páginas "de marketing"
- telas de rede social, fórum, comunidade, contribuições em massa
- muitos módulos sem ligação clara com o problema principal

No MVP, o front deve falar a linguagem da investigação e não a linguagem "startup".

## Navegação Ideal

O front deve ter uma estrutura simples assim:

- Home
- Investigar
- Casos
- Evidências
- Materiais
- Hipóteses
- Protocolos
- Quantum Cell
- Sobre

Essa navegação é clara e funcional.

## Lógica de UX do Produto

A experiência mais forte é esta:

- Usuário entra no problema
- o sistema organiza a investigação em um "painel"
- ele vê:
  - o que foi encontrado
  - o que é evidência
  - o que é hipótese
  - o que ainda falta verificar
- ele não recebe uma resposta final pronta
- ele recebe uma base para decidir e validar

Essa é a diferença crucial entre "IA genérica" e "plataforma de investigação".

## O que o Back Precisa Entregar ao Front

Os endpoints essenciais:

- POST /api/v1/cases
  - criar caso de investigação

- GET /api/v1/cases
  - listar casos

- GET /api/v1/cases/{id}
  - detalhe do caso

- POST /api/v1/search/scientific
  - busca de evidências

- GET /api/v1/evidence/{case_id}
  - evidências do caso

- GET /api/v1/materials/{case_id}
  - materiais relevantes

- POST /api/v1/hypotheses
  - criar hipótese

- GET /api/v1/hypotheses/{case_id}
  - listar hipóteses

- POST /api/v1/protocols
  - gerar protocolo

- GET /api/v1/protocols/{case_id}
  - protocolos do caso

- GET /api/v1/quantum-cell
  - contexto da linha de pesquisa

Esses endpoints fazem sentido e atendem ao produto.

## A Regra Mais Importante para o Reset

A frase decisiva é esta:

O Estes não é "uma IA que responde soluções".
O Estes é "uma plataforma para organizar e rastrear uma investigação ambiental".

Isso muda tudo.

Se você quiser que o produto pareça consistente, o front precisa apresentar isso claramente:
- problema
- evidência
- material
- hipótese
- limite
- teste

Não precisa vender "inteligência ambiental" como marketing genérico. Precisa vender "investigação ambiental em fluxo".

## Versão Mais Forte do Produto

Se eu fosse simplificar para a forma mais clara e forte, eu diria:

Estes é uma plataforma aberta para investigar problemas ambientais locais a partir de evidências científicas, materiais regionais e hipóteses rastreáveis. O foco não é gerar uma resposta final, mas organizar a investigação de forma transparente, reproduzível e acessível.

Quantum Cell é uma linha de pesquisa dentro do projeto para explorar materiais brasileiros, especialmente celulose de eucalipto, em aplicações de sensoriamento e filtragem de água.

Essa é a narrativa que sustenta o repo, o front e o backend.
