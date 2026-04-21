# S4-C-R1 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-C Enzyme, Target & Substrate Logic`
- Research line: `S4-C-R1 Target And Enzyme Prioritization`

## Why this is the right next `S4` study

`S4-B-R1` already established how pathway perturbation maps can organize metabolomic shifts.

The next missing layer is target-centered:

- which enzymes or targets sit closest to the strongest perturbation signals
- which targets are supported by network or multi-omics structure rather than isolated speculation
- how to prioritize enzymes and targets without pretending that metabolomics alone proves mechanism

Without `S4-C-R1`, `S4` still lacks a credible target-facing layer.

## Core question

How can metabolomic and pathway signals be translated into defensible enzyme and target priorities that support later mechanism or translational work without overclaiming causality?

## Practical substudies

### `S4-C-R1a` Enzyme Relevance Ranking

Goal:

- rank enzymes most plausibly linked to observed pathway disturbances

Focus:

- enzyme adjacency to perturbed pathways
- consistency across multiple metabolites
- network support
- targetability or interpretability

### `S4-C-R1b` Candidate Target Shortlist Logic

Goal:

- move from pathway perturbation to a compact shortlist of candidate targets

Focus:

- mechanistic plausibility
- evidence depth
- cross-omics support
- translational relevance without overreach

## Why this matters now

Metabolomics is increasingly being used not only for biomarker discovery but also for target discovery and mechanism inference.

Useful references:

- general prediction of enzyme-small-molecule substrate relationships:
  - https://www.nature.com/articles/s41467-023-38347-2
- integrated inference of metabolic activity around metabolic enzymes:
  - https://www.sciencedirect.com/science/article/pii/S2211124725001469
- metabolomics accelerating target and mechanism discovery:
  - https://www.sciencedirect.com/science/article/abs/pii/S0045206825012581
- integrated metabolomics and network pharmacology for mechanism and target inference:
  - https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2025.1618584/full
- integrative metabolomics and transcriptomics for metabolic-pathway characteristics:
  - https://www.sciencedirect.com/science/article/pii/S0006291X24013913
- large-scale genetic architecture of the plasma metabolome with enzyme-linked interpretation:
  - https://www.nature.com/articles/s41467-025-62126-w

## Data classes to collect

For the first pass, prioritize:

- condition contrast
- perturbed pathway
- candidate enzyme or target
- metabolite support pattern
- network or omics support
- target rationale
- ambiguity or limitation note
- evidence source

## Required outputs

The first useful output should include:

- normalized target-prioritization table
- ranked enzyme shortlist
- one pathway-to-target bridge panel
- one concise interpretation report

## GitHub role

GitHub should hold:

- target evidence schema
- source registry
- ranking logic
- report skeleton
- figures

## Hugging Face role

Hugging Face should hold:

- target shortlist explorer
- enzyme relevance viewer
- pathway-to-target explanation layer

## Suggested first workflow

1. choose one or two strong pathway disturbance contexts
2. extract candidate enzymes or targets supported by those pathways
3. separate strong multi-signal support from weak single-paper target claims
4. rank enzyme relevance and target plausibility
5. draft a compact mechanism-facing report note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `condition_contrast`
- `candidate_enzyme_or_target`
- `linked_pathway`
- `supporting_metabolite_pattern`
- `network_or_omics_support`
- `target_rationale`
- `ambiguity_note`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- treat metabolite association as direct target proof
- rank targets without pathway context
- ignore ambiguity when multiple enzymes map to the same perturbation space
- collapse computational plausibility into validated therapeutic action

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first target-prioritization evidence table
2. define a compact target-confidence vocabulary
3. draft the first pathway-to-target interpretation note
