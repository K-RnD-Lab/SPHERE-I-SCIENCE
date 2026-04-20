# S2-A-R1 Research Guide

## Research home

- Sphere: `S2`
- Lane: `S2-A Plant Omics & Trait Signatures`
- Research line: `S2-A-R1 Trait Signature Discovery`

## Why this matters

`S2-A-R1` gives `S2` its plant-intrinsic molecular backbone.

Without this line, `S2` risks becoming only a phytochemical catalog. With it, the sphere can support:

- plant-state interpretation
- genotype-to-trait logic
- molecular signature discovery
- later bridges into stress biology and translational plant bioactivity

## Core question

How can plant omics signals be translated into stable, interpretable trait signatures that connect molecular features with real plant traits?

## Practical substudies

### `S2-A-R1a` Genotype-To-Trait Signal Mapping

Goal:

- identify molecular signals associated with relevant plant traits

Focus:

- trait-associated genes or markers
- signal ranking
- interpretable genotype-to-trait links

### `S2-A-R1b` Organ- Or Tissue-Specific Molecular Signatures

Goal:

- derive organ- or tissue-specific molecular signature profiles

Focus:

- leaf / root / seed / flower context
- tissue-specific signal panels
- functional interpretation

## Why this matters now

Plant trait inference and omics-based trait analysis are active areas because they create bridges between molecular biology, phenotyping, and downstream translation.

Useful references:

- global-scale plant trait inference from multimodal data: https://arxiv.org/abs/2511.06943
- integrated omics for plant stress and trait interpretation: https://www.sciencedirect.com/science/article/pii/S2352407326000065

## Data classes to collect

For the first pass, prioritize:

- transcriptomics or omics matrices
- genotype or accession metadata
- trait labels
- organ or tissue context
- experimental condition metadata

## Required outputs

The first useful output should include:

- trait-linked molecular signature table
- ranked candidate markers
- one organ- or tissue-specific signature view
- one short interpretation report
- one to two figures

## Figure plan

The first visual package should include:

- trait-vs-signature heatmap
- ranked marker bar chart
- tissue or organ comparison panel

## GitHub role

GitHub should hold:

- trait schema
- omics-to-trait logic
- marker table
- figures
- report

## Hugging Face role

Hugging Face should hold:

- trait signature explorer
- tissue signature comparison interface
- marker ranking viewer

## Suggested first workflow

1. choose one plant species or species group
2. choose one interpretable trait context
3. normalize omics and metadata tables
4. rank trait-linked signals
5. derive the first signature panel
6. produce a short figure-backed report

## What not to do

Do not:

- treat every correlation as a causal trait marker
- merge too many species and conditions before the schema is stable
- jump into deployment language before the signature layer is defensible

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first plant/trait pair
2. define the starter schema
3. draft the first report skeleton
