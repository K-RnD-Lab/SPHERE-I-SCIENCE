# S1-A-R1 Research Guide

## Research home

- Sphere: `S1`
- Lane: `S1-A PHYLO-GENOMICS`
- Research line: `S1-A-R1 Variant Interpretation And Pathogenicity Scoring`

## Why this is the first guide

`S1-A-R1` is one of the strongest entry points for the whole science system because it is:

- medically legible
- computationally structured
- compatible with public genomics resources
- easy to connect to future biomarker and rare-disease work

It also gives a clear bridge from open science to future `TECHNOLOGY` mirrors without losing the scientific home.

## Core question

How can open genomic variant evidence be organized into an interpretable pathogenicity and relevance scoring layer that is useful for translational oncology research?

## Practical substudies

### `S1-A-R1a` OpenVariant

Goal:

- create an open, evidence-linked variant interpretation layer

Focus:

- variant-level evidence aggregation
- pathogenicity interpretation
- molecular relevance ranking

### `S1-A-R1b` Somatic Classifier

Goal:

- classify somatic variants into interpretable translational categories

Focus:

- likely driver vs uncertain vs weak-signal variants
- somatic relevance and context ranking
- explainable case-level prioritization

## Data classes to collect

For the first public-facing pass, prioritize:

- variant tables
- gene identifiers
- disease or cohort labels
- consequence annotations
- pathogenicity predictors
- recurrence or frequency context
- literature-linked evidence notes

Good early sources can include:

- TCGA-linked public files
- cBioPortal-exportable summaries
- ClinVar
- COSMIC-style public evidence where allowed
- Ensembl or VEP annotations
- PubMed-linked variant interpretation notes

## Required outputs

This guide should eventually produce:

- variant evidence table
- pathogenicity or relevance score logic
- ranked shortlist of notable variants
- case- or cohort-level interpretation notes
- figures
- short report

## GitHub role

GitHub should hold:

- research question
- data schema
- evidence fields
- scoring logic
- figures
- interpretation report
- README that explains what is real evidence, what is inferred, and what is exploratory

## Hugging Face role

Hugging Face should hold:

- interactive variant explorer
- ranked shortlist viewer
- explanation interface for score components
- optional case- or gene-focused lookup demo

## phylo.bio intake checklist

When using `phylo.bio`, provide:

- exact disease framing
- exact prompt used
- uploaded files
- annotation goals
- requested analyses
- returned tables
- figures
- citations
- export or session summary

For this lane, useful prompt types are:

- interpret these variants in disease context
- prioritize likely pathogenic or relevant variants
- connect variant set to likely biological mechanisms
- identify which findings are strongest vs weakest

## Suggested first workflow

1. choose one disease context
2. choose one public variant dataset or case table
3. annotate the variants
4. build an evidence table
5. define a transparent scoring logic
6. produce a ranked shortlist
7. write a short interpretation report

## Evidence fields to standardize

At minimum, track:

- `variant_id`
- `gene`
- `disease_context`
- `variant_type`
- `functional_consequence`
- `evidence_source`
- `pathogenicity_signal`
- `somatic_relevance`
- `mechanism_note`
- `confidence_level`
- `notes`

## First visible deliverable

The cleanest first deliverable is:

- one GitHub report
- one ranked variant table
- one small figure set

Do not start from a full app if the evidence layer is still unstable.

## What not to do

Do not:

- claim clinical decision support
- hide uncertainty inside a black-box score
- mix germline and somatic logic without explicit labeling
- present exploratory findings as validated medical truth

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first disease context for `S1-A-R1`
2. define a starter data schema
3. draft the first repo-level README or report skeleton
