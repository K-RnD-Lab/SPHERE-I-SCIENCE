# S4-A-R1 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-A Metabolomics & Signature Discovery`
- Research line: `S4-A-R1 Metabolite Signature Classification`

## Why this is a strong first `S4` study

`S4-A-R1` is a strong first `S4` study because it:

- works across multiple biological domains
- gives `S4` a clear biochemical signature identity
- is methodologically reusable
- creates a clean bridge toward pathway interpretation

## Core question

How can metabolite patterns be turned into interpretable biochemical signatures that distinguish meaningful biological states?

## Practical substudies

### `S4-A-R1a` Contrast-Based Signature Panels

Goal:

- derive ranked metabolite signatures from condition contrasts

Focus:

- discriminative metabolites
- signal stability
- contrast interpretability

### `S4-A-R1b` Class-Aware Marker Ranking

Goal:

- rank candidate markers by chemical class and biological interpretability

Focus:

- metabolite class
- pathway adjacency
- ranking transparency

## Why this matters now

Metabolomics is increasingly being used not only to describe profiles but to identify risk-linked and mechanism-linked signatures.

Useful references:

- pathway-guided mediation and metabolomics interpretation: https://arxiv.org/abs/2503.13894
- example of metabolomics linked to future disease risk: https://pubmed.ncbi.nlm.nih.gov/40910526/

## Data classes to collect

For the first pass, prioritize:

- metabolite abundance matrix
- condition labels
- sample metadata
- metabolite identifiers
- pathway annotations
- chemical class labels

## Required outputs

The first useful output should include:

- ranked metabolite signature table
- class-aware marker summary
- contrast figure set
- short biochemical interpretation report

## GitHub role

GitHub should hold:

- metabolite schema
- signature logic
- ranked outputs
- figures
- report

## Hugging Face role

Hugging Face should hold:

- metabolite signature explorer
- contrast comparison view
- marker explanation layer

## Suggested first workflow

1. choose one biological contrast
2. normalize the metabolite table
3. rank top discriminative metabolites
4. annotate classes and pathways
5. write a short interpretation note

## Evidence fields to standardize

At minimum, track:

- `metabolite_id`
- `metabolite_name`
- `chemical_class`
- `contrast`
- `signal_direction`
- `effect_rank`
- `pathway_note`
- `evidence_source`
- `confidence_level`
- `notes`

## What not to do

Do not:

- stop at raw fold-change lists
- claim mechanism without annotation support
- mix domain-specific conclusions into the core biochemical method too early

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first contrast domain
2. define the starter signature schema
3. draft the first biochemical report skeleton
