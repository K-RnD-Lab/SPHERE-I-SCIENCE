# S2-A-R2 Research Guide

## Research home

- Sphere: `S2`
- Lane: `S2-A Plant Omics & Trait Signatures`
- Research line: `S2-A-R2 Plant State Classification`

## Why this matters

`S2-A-R2` turns plant omics from descriptive data into state logic.

This is where `S2-A` becomes useful for:

- healthy vs stressed distinction
- developmental-state interpretation
- condition-specific signature panels
- practical comparative biology

## Core question

How can plant omics data be used to distinguish biologically meaningful plant states in a way that remains interpretable and reusable?

## Practical substudies

### `S2-A-R2a` Healthy Vs Stressed State Classification

Goal:

- build a clear molecular distinction between healthy and stressed plant states

Focus:

- stress-linked signatures
- healthy baseline panels
- interpretable state separation

### `S2-A-R2b` Developmental Or Condition-Specific Signature Panels

Goal:

- map signatures to developmental stage or condition context

Focus:

- stage-aware profiles
- condition-linked state panels
- transition logic

## Why this matters now

Plant stress and state-classification work is increasingly tied to multi-omics and AI-supported interpretation, especially under abiotic and biotic stress.

Useful references:

- AI and multi-omics integration for plant salt stress research: https://academic.oup.com/jxb/advance-article/doi/10.1093/jxb/eraf498/8322858
- oxidative stress and specialized metabolite signatures in plants: https://www.sciencedirect.com/science/article/abs/pii/S0981942825006217

## Data classes to collect

For the first pass, prioritize:

- omics matrices
- stress or condition labels
- developmental stage metadata
- tissue context
- environmental condition notes

## Required outputs

The first useful output should include:

- state-classification table
- ranked state markers
- condition comparison panel
- one short interpretation report
- one to two figures

## Figure plan

The first visual package should include:

- state separation plot
- ranked stress-marker chart
- developmental-stage comparison heatmap

## GitHub role

GitHub should hold:

- state labels and schema
- classification logic
- marker ranking
- figures
- report

## Hugging Face role

Hugging Face should hold:

- plant-state explorer
- stress-vs-healthy comparison view
- developmental signature viewer

## Suggested first workflow

1. choose one plant context
2. define healthy vs stressed labels
3. derive state-linked markers
4. compare state or stage panels
5. produce the first figure-backed summary

## What not to do

Do not:

- reduce all plant states to one binary label if the context is richer
- hide condition differences behind black-box classification
- mix field intervention logic into this lane too early

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first state contrast
2. define the starter schema
3. draft the first report skeleton
