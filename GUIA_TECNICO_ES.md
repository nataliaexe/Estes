# Estes - Guía Técnica del Producto

## Definición del Producto

Estes es una plataforma abierta para investigar problemas ambientales locales a partir de evidencias científicas, materiales regionales e hipótesis rastreables. El enfoque no es generar una respuesta final, sino organizar la investigación de forma transparente, reproducible y accesible.

**Quantum Cell** es una línea de investigación dentro del proyecto para explorar materiales brasileños, especialmente celulosa de eucalipto, en aplicaciones de sensores y filtración de agua.

## Producto Central

- Plataforma central: plataforma de investigación ambiental, basada en evidencias científicas y materiales locales
- Línea de investigación: Quantum Cell, dentro del proyecto, como estudio de caso y demostración de uso

**Estructura del producto:**
- Estes = plataforma
- Quantum Cell = caso/línea de investigación dentro del sistema

## MVP - Lo que el software debe entregar

El proyecto, tanto en el frontend como en el backend, debe apoyar este flujo principal:

### 1. Describir un problema
Ejemplo: contaminación del agua en área rural, suelo degradado, falta de datos, etc.

### 2. Buscar evidencias
- literatura científica
- datos ambientales
- materiales locales
- estudios correlatos

### 3. Organizar evidencias
- artículo
- DOI
- fragmento relevante
- tipo de evidencia
- nivel de confianza
- limitaciones

### 4. Relacionar con materiales
- material local
- propiedad relevante
- uso potencial
- contexto regional

### 5. Generar hipótesis
- qué puede ser plausible
- qué sigue siendo hipótesis
- qué necesita ser probado

### 6. Registrar el proceso
- investigación
- fuentes
- limitaciones
- siguientes pasos

Esta debe ser la lógica del producto. Todo lo que esté fuera de esto puede entrar después.

## Estructura del Proyecto Técnico Ideal

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

## Arquitectura de Datos Más Importante

Necesitas definir modelos simples y muy claros. No puede ser "cualquier dato".

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

Estos modelos resuelven la estructura del producto.

## Lo que Debe Aparecer en el Frontend

Esto es lo más importante.

La pantalla principal no debe ser un "chatbot general". La pantalla principal debe ser una pantalla de investigación.

El frontend debe incluir:

### 1. Landing / presentación
- nombre del proyecto
- misión
- explicación simple de qué es
- CTA principal: "Investigar un problema"
- CTA secundario: "Explorar casos"
- "Cómo funciona" en 3 bloques

### 2. Nueva investigación
- formulario:
  - problema
  - local
  - tipo de impacto
  - contexto
  - recursos disponibles
- botón: "Generar investigación"
- esta es la entrada principal del producto

### 3. Dashboard de investigación
- resumen del caso
- problema
- evidencias encontradas
- materiales locales sugeridos
- hipótesis
- estado de la investigación
- nivel de confianza
- limitaciones

### 4. Página de evidencias
- lista de fuentes
- artículo / dato / patente / estudio
- DOI
- resumen
- fragmentos relevantes
- nivel de evidencia
- estado: comprobado / apoyado / hipótesis / no validado
- botón "ver detalles"

### 5. Página de materiales
- material local
- origen/región
- propiedades
- uso potencial
- relación con el problema
- limitaciones
- referencias

### 6. Página de hipótesis
- hipótesis principal
- base en evidencias
- materiales relevantes
- soporte científico
- qué falta probar
- etiqueta: "hipótesis", "sugerencia", "observación"
- siempre mostrar diferencia entre evidencia e hipótesis

### 7. Página de protocolo
- objetivo
- materiales
- pasos
- riesgo
- método
- cronograma
- validación
- observaciones

### 8. Página de atlas / casos
- lista de casos ambientales
- categoría
- región
- tipo de problema
- evidencia disponible
- estado

### 9. Página de "Quantum Cell"
- describe la línea de investigación
- materiales
- objetivo
- contexto científico
- limitaciones
- estado: investigación en desarrollo

Estos son los elementos que hacen que el producto parezca coherente.

## Lo que NO Debe Aparecer en el Frontend en el MVP

- chatbot "haz todo"
- una pantalla de IA genérica como primer enfoque
- dashboard super visual sin contexto
- muchas páginas "de marketing"
- pantallas de red social, foro, comunidad, contribuciones masivas
- muchos módulos sin conexión clara con el problema principal

En el MVP, el frontend debe hablar el lenguaje de la investigación y no el lenguaje "startup".

## Navegación Ideal

El frontend debe tener una estructura simple así:

- Home
- Investigar
- Casos
- Evidencias
- Materiales
- Hipótesis
- Protocolos
- Quantum Cell
- Sobre

Esta navegación es clara y funcional.

## Lógica de UX del Producto

La experiencia más fuerte es esta:

- Usuario entra en el problema
- el sistema organiza la investigación en un "panel"
- él ve:
  - qué fue encontrado
  - qué es evidencia
  - qué es hipótesis
  - qué aún falta verificar
- él no recibe una respuesta final lista
- él recibe una base para decidir y validar

Esta es la diferencia crucial entre "IA genérica" y "plataforma de investigación".

## Lo que el Backend Debe Entregar al Frontend

Los endpoints esenciales:

- POST /api/v1/cases
  - crear caso de investigación

- GET /api/v1/cases
  - listar casos

- GET /api/v1/cases/{id}
  - detalle del caso

- POST /api/v1/search/scientific
  - búsqueda de evidencias

- GET /api/v1/evidence/{case_id}
  - evidencias del caso

- GET /api/v1/materials/{case_id}
  - materiales relevantes

- POST /api/v1/hypotheses
  - crear hipótesis

- GET /api/v1/hypotheses/{case_id}
  - listar hipótesis

- POST /api/v1/protocols
  - generar protocolo

- GET /api/v1/protocols/{case_id}
  - protocolos del caso

- GET /api/v1/quantum-cell
  - contexto de la línea de investigación

Estos endpoints tienen sentido y atienden al producto.

## La Regla Más Importante para el Reset

La frase decisiva es esta:

Estes no es "una IA que responde soluciones".
Estes es "una plataforma para organizar y rastrear una investigación ambiental".

Esto cambia todo.

Si quieres que el producto parezca consistente, el frontend necesita presentar esto claramente:
- problema
- evidencia
- material
- hipótesis
- límite
- prueba

No necesitas vender "inteligencia ambiental" como marketing genérico. Necesitas vender "investigación ambiental en flujo".

## Versión Más Fuerte del Producto

Si yo simplificara a la forma más clara y fuerte, diría:

Estes es una plataforma abierta para investigar problemas ambientales locales a partir de evidencias científicas, materiales regionales e hipótesis rastreables. El enfoque no es generar una respuesta final, sino organizar la investigación de forma transparente, reproducible y accesible.

Quantum Cell es una línea de investigación dentro del proyecto para explorar materiales brasileños, especialmente celulosa de eucalipto, en aplicaciones de sensores y filtración de agua.

Esta es la narrativa que sustenta el repo, el frontend y el backend.
