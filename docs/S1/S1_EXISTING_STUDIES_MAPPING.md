# S1 Existing Studies Mapping

## Purpose

This document makes one thing explicit:

- the `S1-A ... S1-F` map is not meant to invent a second copy of `S1`
- it is meant to reorganize what already exists
- only some `R1/R2` items are already backed by real folders
- the rest should be treated as roadmap structure, not as finished studies

So for `S1`, the current task is:

- map existing studies cleanly
- do not create unnecessary new folders yet
- only add new case folders when there is a real study behind them

## Core rule

Interpret `S1` in two layers:

1. `existing case folders`
2. `stable long-term lane architecture`

That means:

- existing folders stay valid
- the new map tells us where they belong
- roadmap items should not be confused with completed studies

## S1-A PHYLO-GENOMICS

### Existing folders

- `S1-A-R1 Variant classification`

### Mapping

- existing `S1-A-R1 Variant classification` -> `S1-A-R1 Variant Interpretation And Pathogenicity Scoring`

### What is not yet a real existing folder

- `S1-A-R2 Genomic Context And Triage Layers`

### Interpretation

`S1-A` is already real, but only its first main direction is materially present in the repo.

## S1-B PHYLO-RNA

### Existing folders

- `S1-B-R1 miRNA silencing`
- `S1-B-R2 siRNA SL`
- `S1-B-R3 lncRNA + ASO`

### Mapping

- existing `S1-B-R1 miRNA silencing` -> `S1-B-R1 Regulatory RNA Silencing`
- existing `S1-B-R2 siRNA SL` -> still part of `S1-B-R1 Regulatory RNA Silencing`
- existing `S1-B-R3 lncRNA + ASO` -> `S1-B-R2 Non-Coding RNA Therapeutics`

### Interpretation

`S1-B` is already one of the strongest and most structurally mature lanes.

## S1-C PHYLO-DRUG

### Existing folders

- `S1-C-R1 RNA-directed drug`
- `S1-C-R2 Frontier`

### Mapping

- existing `S1-C-R1 RNA-directed drug` -> `S1-C-R1 RNA-Directed Small Molecule Discovery`
- existing `S1-C-R2 Frontier` -> `S1-C-R2 Frontier Mechanism-Linked Therapeutics`

### Interpretation

`S1-C` is already reasonably aligned with the new map and needs less restructuring than some other lanes.

## S1-D PHYLO-LNP

### Existing folders

- `S1-D-R1 Serum corona`
- `S1-D-R2 Flow corona`
- `S1-D-R3 Brain BBB`
- `S1-D-R4 NLP`
- `S1-D-R5 Exotic fluids`

### Mapping

- existing `S1-D-R1 Serum corona` -> `S1-D-R1 Corona And Formulation Intelligence`
- existing `S1-D-R2 Flow corona` -> still part of `S1-D-R1 Corona And Formulation Intelligence`
- existing `S1-D-R3 Brain BBB` -> `S1-D-R2 Barrier And Context-Specific Delivery`
- existing `S1-D-R5 Exotic fluids` -> still part of `S1-D-R2 Barrier And Context-Specific Delivery`

### Special note on `S1-D-R4 NLP`

`S1-D-R4 NLP` is useful, but it should be interpreted carefully:

- short-term: keep it as a supporting research/tool case inside `S1-D`
- long-term: if it becomes a reusable delivery-intelligence tool, it may deserve a `TECHNOLOGY` mirror

### Interpretation

`S1-D` is rich in existing work, but the old numbering should not be treated as the future long-term architecture.

## S1-E PHYLO-BIOMARKERS

### Existing folders

- `S1-E-R1 Liquid biopsy`

### Mapping

- existing `S1-E-R1 Liquid biopsy` -> `S1-E-R1 Liquid Biopsy And Signal Discovery`

### What is not yet a real existing folder

- `S1-E-R2 Biomarker Ranking And Clinical Translation`

### Interpretation

`S1-E` is real but still underbuilt compared with `S1-B` and `S1-D`.

## S1-F PHYLO-RARE

### Existing folders

- `S1-F-R1 DIPG`
- `S1-F-R2 UVM`
- `S1-F-R3 pAML`

### Mapping

- existing `S1-F-R1 DIPG` -> `S1-F-R1 Rare High-Risk Disease Programs`
- existing `S1-F-R3 pAML` -> still part of `S1-F-R1 Rare High-Risk Disease Programs`
- existing `S1-F-R2 UVM` -> `S1-F-R2 Orphan And Underexplored Solid Tumors`

### Interpretation

`S1-F` already has meaningful disease cases, but they need stronger methodological anchoring from the upstream lanes.

## What this means practically

### Existing studies should stay

Do not delete them now.

They are useful as:

- legacy case studies
- feeder cases
- proof that the lane is not empty

### The new map is not a duplicate layer

It is a normalization layer.

Its job is to answer:

- what already exists
- what belongs together
- what is mature
- what is still only a future direction

### What should happen next in S1

For `S1`, the correct next move is not to create many new folders.

It is to:

1. keep existing folders
2. define which of them are core
3. write research guides for the strongest current lines
4. only later archive, merge, or rename if needed

## Clear answer to the main question

For `S1`, most of the current work should be treated as:

- existing studies being reinterpreted and reorganized

not:

- brand-new studies being invented from nothing

Where an `R2` exists without a real folder yet, that should be read as:

- a structured future direction

not:

- a claim that the study already exists
