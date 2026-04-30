# S4-E-R2 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-E Translational Chemical Inference`
- Research line: `S4-E-R2 Evidence-Based Chemical Plausibility`

## Why this study belongs here

`S4-E-R1` creates candidate chemical shortlists. `S4-E-R2` asks whether those candidates are plausible enough to keep.

This is the quality-control layer for translational chemical inference.

## Core question

How can candidate chemicals be scored by evidence strength, mechanism support, target plausibility, and translational caution?

## Practical substudies

### `S4-E-R2a` Evidence Scoring For Candidate Plausibility

Goal:

- score candidate compounds using explicit evidence layers

Focus:

- source quality
- mechanism support
- target support
- metabolomics support
- network-pharmacology risk
- validation status

### `S4-E-R2b` Comparative Shortlist Interpretation

Goal:

- compare candidate groups and explain why some should move forward before others

Focus:

- stronger vs weaker candidates
- evidence gaps
- translational feasibility
- next validation step

## Useful references

- critical evaluation of network pharmacology in herbal medicine:
  - https://www.sciencedirect.com/science/article/pii/S2090123224006180
- metabolomics in target and mechanism discovery:
  - https://www.sciencedirect.com/science/article/abs/pii/S0045206825012581
- metabolomics for biomarker and therapeutic target discovery:
  - https://www.mdpi.com/2780828
- serum pharmacochemistry, metabolomics, and network pharmacology:
  - https://www.sciencedirect.com/science/article/abs/pii/S0378874124010122
- integrated metabolomics and multi-layer candidate inference:
  - https://www.mdpi.com/3407586
- metabolic profiling of natural products:
  - https://www.sciencedirect.com/science/article/abs/pii/S0026265X24018915

## Data classes to collect

- candidate compound
- source or origin
- metabolomics support
- pathway support
- target support
- method risk
- validation status
- plausibility score
- next validation step

## Required outputs

- candidate plausibility evidence table
- comparative shortlist
- weak-claim filter
- validation-priority note

## Claim discipline

At this stage we may say:

- candidate plausibility can be scored before validation
- candidate shortlists are stronger when evidence layers converge
- weak network-pharmacology claims should be filtered

At this stage we should not say:

- that plausibility equals efficacy
- that candidate ranking equals therapeutic readiness
- that natural-product presence proves practical usefulness
