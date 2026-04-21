# S4-E-R1 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-E Translational Chemical Inference`
- Research line: `S4-E-R1 Candidate Chemical Prioritization`

## Why this is the right next `S4` study

`S4-A`, `S4-B`, and `S4-C` already give `S4`:

- signature logic
- pathway perturbation logic
- target and enzyme prioritization logic

The next missing layer is translational:

- how to turn those biochemical signals into candidate chemical shortlists
- how to rank candidates without pretending they are validated solutions
- how to keep chemical prioritization evidence-based and mechanism-aware

Without `S4-E-R1`, `S4` still lacks a usable translational output layer.

## Core question

How can metabolomic, pathway, and target signals be translated into defensible candidate chemical shortlists that are useful for research prioritization without overclaiming efficacy?

## Practical substudies

### `S4-E-R1a` Candidate Shortlist From Biochemical Evidence

Goal:

- derive compact candidate lists from pathway and metabolite evidence

Focus:

- pathway-linked metabolites
- mechanistically plausible compounds
- candidate ranking by evidence depth
- ambiguity-aware shortlist logic

### `S4-E-R1b` Mechanism-Linked Candidate Ranking

Goal:

- compare candidate chemicals by how strongly they connect to the strongest mechanism signals

Focus:

- target linkage
- pathway support
- metabolomic relevance
- translational interpretability

## Why this matters now

Many metabolomics-driven studies stop at signatures or pathways.

The next useful translational move is not to claim validated interventions, but to build defensible candidate-prioritization logic.

Useful references:

- critical review of metabolomics for biomarker discovery and therapeutic target identification:
  - https://www.mdpi.com/2780828
- metabolomics accelerating target and mechanism discovery:
  - https://www.sciencedirect.com/science/article/abs/pii/S0045206825012581
- serum pharmacochemistry plus metabolomics plus network pharmacology in cholestatic liver injury:
  - https://www.sciencedirect.com/science/article/abs/pii/S0378874124010122
- integrated metabolomics, network pharmacology, single-cell RNA-seq, and MD simulation:
  - https://www.mdpi.com/3407586
- critical evaluation of current network pharmacology in herbal medicine:
  - https://www.sciencedirect.com/science/article/pii/S2090123224006180
- metabolic profiling of plant and other natural products:
  - https://www.sciencedirect.com/science/article/abs/pii/S0026265X24018915

## Data classes to collect

For the first pass, prioritize:

- condition contrast
- candidate chemical or metabolite-derived candidate
- linked pathway
- linked target or enzyme
- translational rationale
- evidence depth
- ambiguity note
- evidence source

## Required outputs

The first useful output should include:

- normalized candidate-prioritization table
- ranked candidate shortlist
- one pathway-to-candidate bridge panel
- one concise translational interpretation report

## GitHub role

GitHub should hold:

- candidate evidence schema
- source registry
- ranking logic
- report skeleton
- figures

## Hugging Face role

Hugging Face should hold:

- candidate shortlist explorer
- mechanism-linked ranking viewer
- explanation layer for evidence strength and ambiguity

## Suggested first workflow

1. choose one strong pathway and target context
2. collect studies that connect metabolic evidence to candidate chemicals
3. normalize candidate, pathway, and target fields
4. rank candidates by evidence support and translational clarity
5. draft a compact translational note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `condition_contrast`
- `candidate_chemical`
- `linked_pathway`
- `linked_target_or_enzyme`
- `translational_rationale`
- `evidence_depth`
- `ambiguity_note`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- present shortlist ranking as validated intervention ranking
- collapse pathway, target, and candidate logic into one unsupported jump
- treat network pharmacology as automatically robust
- confuse chemical plausibility with readiness for deployment

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first candidate-prioritization evidence table
2. define a compact candidate-confidence vocabulary
3. draft the first pathway-to-candidate interpretation note
