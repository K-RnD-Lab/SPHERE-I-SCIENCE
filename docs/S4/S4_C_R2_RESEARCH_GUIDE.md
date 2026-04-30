# S4-C-R2 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-C Enzyme, Target & Substrate Logic`
- Research line: `S4-C-R2 Substrate And Interaction Models`

## Why this study belongs here

`S4-C-R1` prioritizes enzymes and targets. `S4-C-R2` tests whether the proposed enzyme-target logic is chemically plausible at the substrate or interaction level.

This keeps `S4-C` from naming targets without biochemical grounding.

## Core question

How can substrate-family evidence and enzyme-small-molecule interaction models be used to rank biochemical plausibility without pretending to replace experimental validation?

## Practical substudies

### `S4-C-R2a` Substrate-Family Comparison

Goal:

- compare whether candidate molecules belong to plausible substrate or metabolite families for a target enzyme

Focus:

- substrate class
- enzyme family
- reaction context
- known vs predicted relationship
- database support

### `S4-C-R2b` Interaction Plausibility Scoring

Goal:

- assign a transparent plausibility tier to enzyme-substrate or target-compound links

Focus:

- direct experimental evidence
- curated database evidence
- sequence or structure prediction support
- model confidence
- negative or ambiguous evidence

## Useful references

- enzyme-small-molecule substrate prediction:
  - https://www.nature.com/articles/s41467-023-38347-2
- integrated metabolic activity inference:
  - https://www.sciencedirect.com/science/article/pii/S2211124725001469
- ReactZyme enzyme-reaction benchmark:
  - https://arxiv.org/abs/2408.13659
- EnzChemRED enzyme chemistry relation extraction:
  - https://arxiv.org/abs/2404.14209
- BRENDA enzyme database:
  - https://www.brenda-enzymes.org/datafields.php
- metabolomics for target and mechanism discovery:
  - https://www.sciencedirect.com/science/article/abs/pii/S0045206825012581

## Data classes to collect

- enzyme or target name
- substrate or candidate compound
- substrate family
- reaction context
- evidence type
- model or database source
- plausibility tier
- ambiguity note
- validation need

## Required outputs

- substrate-family comparison table
- enzyme-substrate plausibility score
- interaction-confidence vocabulary
- short report on which links are worth validating

## Claim discipline

At this stage we may say:

- substrate and interaction evidence can improve target prioritization
- curated and predicted links should be separated
- plausibility scoring can guide validation priorities

At this stage we should not say:

- that predicted enzyme-substrate links are confirmed biology
- that target plausibility proves therapeutic effect
- that one database hit is enough for a mechanism claim
