# S4-B-R2 Source Registry

## Purpose

This file records the first evidence layer for:

- `S4-B-R2 Mechanism Prioritization`

It supports:

- prioritizing mechanisms from pathway evidence
- distinguishing strong perturbation logic from weak enrichment
- building a reusable confidence vocabulary for `S4-B`

## Current source set

### 1. Avoiding misuse of pathway analysis in metabolomics

Source:

- https://www.nature.com/articles/s42255-025-01283-0

Why it matters:

- discipline-setting source for preventing pathway overclaiming
- useful for defining weak evidence and annotation-risk labels

### 2. MetaboAnalystR 4.0

Source:

- https://www.nature.com/articles/s41467-024-48009-6

Why it matters:

- practical workflow source for global metabolomics and functional interpretation
- useful for standardizing analysis outputs before ranking mechanisms

### 3. Enrichment-method comparison for untargeted metabolomics

Source:

- https://pmc.ncbi.nlm.nih.gov/articles/PMC12301278/

Why it matters:

- shows that pathway results can vary by method
- useful for a method-sensitivity field in evidence tables

### 4. iMetAct metabolic activity inference

Source:

- https://www.sciencedirect.com/science/article/pii/S2211124725001469

Why it matters:

- moves from static metabolite lists toward inferred metabolic activity
- useful for process prioritization when enzyme or activity context is available

### 5. Pathway-guided mediation and interpretation

Source:

- https://arxiv.org/abs/2503.13894

Why it matters:

- helps connect metabolite signals to pathway-guided causal or mediation logic
- useful as a method-facing source, not as direct biological validation

### 6. Human metabolome-phenome atlas

Source:

- https://www.nature.com/articles/s42255-025-01371-1

Why it matters:

- large-scale evidence that metabolites can connect to many disease and trait patterns
- useful for cross-condition mechanism prioritization, with population-context limits

## Current stance

`S4-B-R2` should treat mechanism prioritization as a confidence-ranked hypothesis layer.

It should never turn pathway-enrichment output into a final mechanism claim without supporting evidence.
