# S4-B-R1 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-B Pathway Chemistry & Perturbation`
- Research line: `S4-B-R1 Pathway Perturbation Maps`

## Why this is the right next `S4` study

`S4-A-R1` gives `S4` a metabolite-signature entry point.

The next missing layer is mechanistic:

- which pathways appear perturbed
- which perturbations are coherent rather than noisy
- how to connect metabolite-level shifts to interpretable biochemical process maps

Without `S4-B-R1`, `S4` stays descriptive rather than mechanism-aware.

## Core question

How can metabolite-level shifts be translated into defensible pathway perturbation maps that highlight biochemical process change without misusing pathway analysis?

## Practical substudies

### `S4-B-R1a` Ranked Pathway Disturbance Panels

Goal:

- derive compact panels of pathway-level disturbances from metabolomic contrasts

Focus:

- pathway ranking
- directional perturbation logic
- coherence across multiple metabolites
- confidence-aware filtering

### `S4-B-R1b` Condition-To-Pathway Comparison Maps

Goal:

- compare how biochemical pathways shift across different biological states or conditions

Focus:

- shared vs condition-specific pathway disruptions
- network-aware clustering
- cross-condition interpretability
- mechanism-facing summaries

## Why this matters now

Pathway interpretation is one of the most tempting but also most error-prone moves in metabolomics.

Useful references:

- critique of pathway-analysis misuse in metabolomics:
  - https://www.nature.com/articles/s42255-025-01283-0
- pathway-guided metabolomics mediation and interpretation:
  - https://arxiv.org/abs/2503.13894
- metabolomics perturbations in kidney and liver after colistin:
  - https://www.frontiersin.org/journals/molecular-biosciences/articles/10.3389/fmolb.2024.1338497/full
- integrative metabolomics and transcriptomics for metabolic-pathway characteristics:
  - https://www.sciencedirect.com/science/article/pii/S0006291X24013913
- metabolome-wide association with altered pathways in cholangiocarcinoma:
  - https://www.sciencedirect.com/science/article/pii/S2589555924000697
- integrative metabolomics-genomics networks in schizophrenia model:
  - https://www.nature.com/articles/s41380-024-02568-8

## Data classes to collect

For the first pass, prioritize:

- metabolite identifiers
- condition contrasts
- pathway assignments
- pathway evidence source
- directional signal
- pathway coherence notes
- ambiguity or annotation limits
- evidence source

## Required outputs

The first useful output should include:

- normalized pathway perturbation table
- ranked pathway disturbance panel
- one condition-to-pathway comparison map
- one concise interpretation report

## GitHub role

GitHub should hold:

- pathway evidence schema
- source registry
- perturbation ranking logic
- report skeleton
- figures

## Hugging Face role

Hugging Face should hold:

- pathway perturbation explorer
- condition comparison view
- explanation layer for pathway confidence and annotation limits

## Suggested first workflow

1. choose one contrast domain with metabolite shifts
2. standardize metabolite-to-pathway mapping logic
3. separate strong pathway support from weak enrichment-only signals
4. rank pathway disturbances by coherence and interpretability
5. draft a compact mechanism note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `condition_contrast`
- `pathway_label`
- `pathway_signal_direction`
- `supporting_metabolite_pattern`
- `coherence_signal`
- `annotation_limit`
- `mechanism_note`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- treat every enriched pathway as mechanistically meaningful
- ignore mapping ambiguity and incomplete metabolite annotation
- confuse statistical significance with biochemical coherence
- build pathway stories from one or two isolated metabolites

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first pathway perturbation evidence table
2. define a compact pathway-confidence vocabulary
3. draft the first mechanism-facing report note
