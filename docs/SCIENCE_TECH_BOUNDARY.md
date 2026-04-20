# Science And Technology Boundary

## Core rule

`SCIENCE` and `TECHNOLOGY` are allowed to cooperate closely, but they should not collapse into one blurry layer.

The clean split is:

- `SCIENCE` = the research home of the biological or environmental question
- `TECHNOLOGY` = the implementation home of the reusable tool, pipeline, app, or engineering layer

## What belongs in SCIENCE

Keep work in `SCIENCE` when the central object is:

- a biological question
- an environmental question
- a disease mechanism
- a biomarker signal
- a pathway or omics interpretation
- a scientific hypothesis
- a domain-specific case study

Even if machine learning, scripts, dashboards, or AI are used, the work still belongs in `SCIENCE` if the primary identity is scientific.

## What belongs in TECHNOLOGY

Move work into `TECHNOLOGY` when the central object is:

- a reusable platform
- a general-purpose pipeline
- a deployable tool
- a model framework
- an app wrapper
- engineering infrastructure
- automation logic
- a method that is no longer tied to one domain question

## Practical interpretation for K-RnD Lab

### In SCIENCE

Keep:

- disease-facing studies
- omics interpretation
- environmental monitoring logic
- biomarker cases
- plant/agro/neuro/ecology research cases

### In TECHNOLOGY

Keep:

- reusable bioinformatics pipelines
- shared ML engines
- generalized dashboard frameworks
- libraries, templates, and app shells
- automation that serves multiple science lanes

## The decision test

Ask:

### Question 1

If I removed the biological or environmental domain, would this still be meaningful?

- if no -> `SCIENCE`
- if yes -> likely `TECHNOLOGY`

### Question 2

Is the main deliverable an insight or a reusable build system?

- insight -> `SCIENCE`
- reusable build system -> `TECHNOLOGY`

### Question 3

Would another scientific lane reuse the same artifact without major redesign?

- if yes -> `TECHNOLOGY`
- if no -> keep it in its science home

## S/T bridge rule

Many of your strongest projects are naturally:

- `S + T`

That is correct.

But the rule is still:

- research question lives in `SCIENCE`
- reusable execution layer lives in `TECHNOLOGY`

## Examples

### Example 1

`OpenVariant` as a disease/variant interpretation case:

- `SCIENCE`

`OpenVariant` as a reusable variant-classification engine:

- `TECHNOLOGY`

### Example 2

`K-EcoLOGIC Lab` as environmental risk and sentinel research:

- `SCIENCE`, specifically `S6-A`

Its dashboard framework, sorting assistant architecture, or generic monitoring engine:

- `TECHNOLOGY`

### Example 3

An RNA therapeutics case for a specific disease:

- `SCIENCE`

The reusable target-ranking or delivery-prioritization platform:

- `TECHNOLOGY`

## Stable principle for years ahead

If you keep this split, the architecture should stay usable for many years:

- `SCIENCE` remains the home of knowledge and interpretation
- `TECHNOLOGY` remains the home of tools and scalable execution

This is the cleanest way to avoid future structural chaos.
