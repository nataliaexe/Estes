# Estes - Technical Product Guide

## Product Definition

Estes is an open platform for investigating local environmental problems based on scientific evidence, regional materials, and traceable hypotheses. The focus is not to generate a final answer, but to organize the investigation in a transparent, reproducible, and accessible way.

**Quantum Cell** is a research line within the project to explore Brazilian materials, especially eucalyptus cellulose, in water sensing and filtration applications.

## Core Product

- Central platform: environmental investigation platform, based on scientific evidence and local materials
- Research line: Quantum Cell, as a case study and demonstration of use within the project

**Product structure:**
- Estes = platform
- Quantum Cell = case/research line within the system

## MVP - What the software must deliver

The project, in both frontend and backend, must support this main flow:

### 1. Describe a problem
Example: water contamination in rural area, degraded soil, lack of data, etc.

### 2. Search for evidence
- scientific literature
- environmental data
- local materials
- related studies

### 3. Organize evidence
- article
- DOI
- relevant excerpt
- evidence type
- confidence level
- limitations

### 4. Relate to materials
- local material
- relevant property
- potential use
- regional context

### 5. Generate hypothesis
- what may be plausible
- what is still hypothesis
- what needs to be tested

### 6. Register the process
- investigation
- sources
- limitations
- next steps

This should be the product logic. Anything outside this can come later.

## Ideal Technical Project Structure

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

## Most Important Data Architecture

You need to define simple and very clear models. It cannot be "any data".

### Main Model

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

These models solve the product structure.

## What Must Appear in the Frontend

This is the most important part.

The main screen should not be a "general chatbot". The main screen should be an investigation screen.

The frontend must include:

### 1. Landing / presentation
- project name
- mission
- simple explanation of what it is
- primary CTA: "Investigate a problem"
- secondary CTA: "Explore cases"
- "How it works" in 3 blocks

### 2. New investigation
- form:
  - problem
  - location
  - impact type
  - context
  - available resources
- button: "Generate investigation"
- this is the main entry point of the product

### 3. Investigation dashboard
- case summary
- problem
- evidence found
- local materials suggested
- hypotheses
- investigation status
- confidence level
- limitations

### 4. Evidence page
- list of sources
- article / data / patent / study
- DOI
- summary
- relevant excerpts
- evidence level
- status: proven / supported / hypothesis / not validated
- button "view details"

### 5. Materials page
- local material
- origin/region
- properties
- potential use
- relation to the problem
- limitations
- references

### 6. Hypothesis page
- main hypothesis
- evidence basis
- relevant materials
- scientific support
- what still needs testing
- label: "hypothesis", "suggestion", "observation"
- always show difference between evidence and hypothesis

### 7. Protocol page
- objective
- materials
- steps
- risk
- method
- schedule
- validation
- observations

### 8. Atlas / cases page
- list of environmental cases
- category
- region
- problem type
- available evidence
- status

### 9. "Quantum Cell" page
- describes the research line
- materials
- objective
- scientific context
- limitations
- status: research in development

These are the elements that make the product look coherent.

## What Must NOT Appear in the Frontend in the MVP

- "do everything" chatbot
- a generic AI screen as the first focus
- super visual dashboard without context
- many "marketing" pages
- social network screens, forum, community, mass contributions
- many modules without clear connection to the main problem

In the MVP, the frontend must speak the language of investigation and not the "startup" language.

## Ideal Navigation

The frontend should have a simple structure like this:

- Home
- Investigate
- Cases
- Evidence
- Materials
- Hypotheses
- Protocols
- Quantum Cell
- About

This navigation is clear and functional.

## Product UX Logic

The strongest experience is this:

- User enters the problem
- the system organizes the investigation in a "panel"
- they see:
  - what was found
  - what is evidence
  - what is hypothesis
  - what still needs verification
- they do not receive a ready final answer
- they receive a basis to decide and validate

This is the crucial difference between "generic AI" and "investigation platform".

## What the Backend Must Deliver to the Frontend

The essential endpoints:

- POST /api/v1/cases
  - create investigation case

- GET /api/v1/cases
  - list cases

- GET /api/v1/cases/{id}
  - case details

- POST /api/v1/search/scientific
  - evidence search

- GET /api/v1/evidence/{case_id}
  - case evidence

- GET /api/v1/materials/{case_id}
  - relevant materials

- POST /api/v1/hypotheses
  - create hypothesis

- GET /api/v1/hypotheses/{case_id}
  - list hypotheses

- POST /api/v1/protocols
  - generate protocol

- GET /api/v1/protocols/{case_id}
  - case protocols

- GET /api/v1/quantum-cell
  - research line context

These endpoints make sense and serve the product.

## The Most Important Rule for the Reset

The decisive phrase is this:

Estes is not "an AI that answers solutions".
Estes is "a platform to organize and track an environmental investigation".

This changes everything.

If you want the product to look consistent, the frontend needs to present this clearly:
- problem
- evidence
- material
- hypothesis
- limit
- test

You don't need to sell "environmental intelligence" as generic marketing. You need to sell "environmental investigation in flow".

## Strongest Version of the Product

If I were to simplify to the clearest and strongest form, I would say:

Estes is an open platform to investigate local environmental problems from scientific evidence, regional materials, and traceable hypotheses. The focus is not to generate a final answer, but to organize the investigation in a transparent, reproducible, and accessible way.

Quantum Cell is a research line within the project to explore Brazilian materials, especially eucalyptus cellulose, in water sensing and filtration applications.

This is the narrative that sustains the repo, the frontend, and the backend.
