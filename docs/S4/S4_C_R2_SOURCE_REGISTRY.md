# S4-C-R2 Source Registry

## Purpose

This file records the first evidence layer for:

- `S4-C-R2 Substrate And Interaction Models`

It supports:

- substrate-family comparison
- interaction plausibility scoring
- target-candidate discipline inside `S4-C`

## Current source set

### 1. General enzyme-small-molecule substrate prediction

Source:

- https://www.nature.com/articles/s41467-023-38347-2

Why it matters:

- strong methodological anchor for enzyme-substrate prediction
- useful for separating predicted plausibility from confirmed evidence

### 2. iMetAct metabolic activity inference

Source:

- https://www.sciencedirect.com/science/article/pii/S2211124725001469

Why it matters:

- links metabolic activity to context-dependent enzyme and pathway behavior
- useful for ranking candidate interactions in biological context

### 3. ReactZyme enzyme-reaction benchmark

Source:

- https://arxiv.org/abs/2408.13659

Why it matters:

- useful benchmark-facing source for enzyme-reaction prediction
- helps keep model claims measurable rather than vague

### 4. EnzChemRED relation extraction dataset

Source:

- https://arxiv.org/abs/2404.14209

Why it matters:

- supports literature-mining logic for enzyme-chemical relationships
- useful for building future evidence extraction workflows

### 5. BRENDA enzyme database data fields

Source:

- https://www.brenda-enzymes.org/datafields.php

Why it matters:

- practical curated source for substrates, products, cofactors, inhibitors, and kinetic context
- useful for distinguishing curated evidence from model inference

### 6. Metabolomics in target and mechanism discovery

Source:

- https://www.sciencedirect.com/science/article/abs/pii/S0045206825012581

Why it matters:

- broad translational context for target and mechanism discovery
- useful for positioning `S4-C-R2` as plausibility ranking, not validation

## Current stance

`S4-C-R2` should rank interaction plausibility by evidence type.

The central distinction is:

- experimentally supported
- curated but context-limited
- model-predicted
- speculative or weakly grounded
