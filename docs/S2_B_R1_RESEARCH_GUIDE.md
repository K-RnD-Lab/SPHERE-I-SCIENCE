# S2-B-R1 Research Guide

## Research home

- Sphere: `S2`
- Lane: `S2-B Phytochemicals & Natural Products`
- Research line: `S2-B-R1 Phytochemical Atlas And Candidate Prioritization`

## Why this is a strong first `S2` study

`S2-B-R1` is one of the best first studies for `S2` because it is:

- plant-first
- translational without leaving plant science
- compatible with literature mining and structured evidence tables
- useful for later bridges into biochemistry, biotechnology, and drug-facing interpretation

## Core question

How can plant-derived compounds be organized into a transparent atlas and prioritization layer that supports real biological interpretation rather than only a compound list?

## Practical substudies

### `S2-B-R1a` Species-To-Compound Registry

Goal:

- build a structured plant-species to phytochemical knowledge layer

Focus:

- plant species
- compound classes
- evidence source
- compound occurrence context

### `S2-B-R1b` Compound Class And Bioactivity Ranking

Goal:

- rank phytochemical candidates by evidence strength and translational relevance

Focus:

- compound family
- bioactivity reports
- mechanism hints
- prioritization score

## Why this matters now

Recent work continues to push plant metabolite profiling and phytochemical genomics toward better standardization, interpretability, and translational use.

Useful references:

- plant metabolite profiling standards and reporting logic: https://www.sciencedirect.com/science/article/pii/S0031942224000414
- phytochemical genomics as an active research direction: https://www.jstage.jst.go.jp/article/pjab/101/8/101_pjab.101.030/_pdf/-char/en

## Data classes to collect

For the first pass, prioritize:

- plant species and taxonomy
- compound names and identifiers
- compound class
- source tissue or organ
- evidence source
- claimed bioactivity
- mechanism notes
- confidence or evidence level

## Required outputs

The first useful output should include:

- a normalized phytochemical table
- compound family overview
- ranked shortlist of promising candidates
- one concise interpretation report
- one or two overview figures

## GitHub role

GitHub should hold:

- atlas schema
- evidence fields
- candidate ranking logic
- source and citation registry
- figures
- short report

## Hugging Face role

Hugging Face should hold:

- phytochemical atlas explorer
- species-to-compound lookup
- candidate ranking viewer

## Suggested first workflow

1. choose one plant family or one bioactivity theme
2. collect literature-backed compound records
3. normalize species and compound identifiers
4. create a simple evidence score
5. rank the top candidates
6. write a short interpretation note

## Evidence fields to standardize

At minimum, track:

- `plant_species`
- `compound_name`
- `compound_class`
- `tissue_context`
- `bioactivity_claim`
- `mechanism_note`
- `evidence_source`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- turn the atlas into an unfiltered catalog
- treat every reported compound as equally strong
- mix plant-intrinsic and agricultural field questions
- present weak literature mentions as validated translational findings

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first plant family or bioactivity theme
2. define a starter atlas schema
3. draft the first report skeleton
