# S2-B-R2 Research Guide

## Research home

- Sphere: `S2`
- Lane: `S2-B Phytochemicals & Natural Products`
- Research line: `S2-B-R2 Plant Compound Target And Mechanism Logic`

## Why this matters

`S2-B-R2` is the line that prevents `S2-B` from staying only a catalog.

This is where plant natural products become:

- target-aware
- mechanism-aware
- prioritizable
- scientifically interpretable beyond simple compound listing

## Core question

How can plant-derived compounds be linked to plausible targets and mechanisms in a way that stays transparent, evidence-aware, and useful for downstream translational reasoning?

## Practical substudies

### `S2-B-R2a` Target-Linked Candidate Compounds

Goal:

- connect phytochemical candidates to plausible biological targets

Focus:

- candidate-target association
- target family grouping
- evidence-aware prioritization

### `S2-B-R2b` Pathway-Aware Natural Product Scoring

Goal:

- rank plant compounds not only by reported activity but by mechanism plausibility

Focus:

- pathway context
- mechanism hints
- multi-factor priority score

## Why this matters now

Recent literature keeps emphasizing that natural-product research is moving from raw compound reporting toward target identification, computational prediction, and mechanism-linked prioritization.

Useful references:

- overview of recent target-identification strategies for natural products through 2025: https://www.maxapress.com/article/doi/10.48130/targetome-0026-0015
- computational methods for therapeutic application of phytochemicals: https://link.springer.com/article/10.1007/s42452-025-06772-1
- open target-prediction tooling for natural products: https://www.sciencedirect.com/science/article/pii/S0010482524014367

## Data classes to collect

For the first pass, prioritize:

- compound identifiers
- plant species source
- compound class
- target candidates
- mechanism or pathway notes
- evidence source
- confidence level

## Required outputs

The first useful output should include:

- candidate-target table
- pathway-aware ranking table
- mechanism note layer
- one concise interpretation report
- one to two explanatory figures

## Figure plan

The first visual package should include:

- compound-to-target network view
- ranked candidate bar chart
- pathway-context summary figure

## GitHub role

GitHub should hold:

- target-link schema
- scoring logic
- ranked shortlist
- figures
- report

## Hugging Face role

Hugging Face should hold:

- candidate-target explorer
- mechanism-linked ranking interface
- pathway summary viewer

## Suggested first workflow

1. choose one bioactivity or disease-relevant theme
2. take the shortlist from `S2-B-R1`
3. attach target and pathway hypotheses
4. build a transparent ranking logic
5. produce the first mechanism-focused report

## What not to do

Do not:

- treat docking or target-prediction output as validation
- collapse weak hints into overconfident mechanism claims
- mix this with drug-discovery claims that belong more naturally in downstream translational layers

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first bioactivity theme
2. define the starter target-link schema
3. draft the first mechanism report skeleton
