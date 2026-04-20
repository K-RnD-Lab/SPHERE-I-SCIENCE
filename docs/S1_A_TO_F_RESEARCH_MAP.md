# S1-A To S1-F Research Map

## Purpose

This document turns `S1-A ... S1-F` into a practical lane-level map.

The goal is to keep:

- the lane stable
- two main research directions inside each lane
- one to two substudies inside each research direction

This is the cleanest way to prevent `S1` from becoming a pile of isolated case folders.

## Structural rule

Use:

- `S1-A`, `S1-B`, `S1-C`, `S1-D`, `S1-E`, `S1-F` as stable lanes
- `R1`, `R2` as the two main directions inside each lane
- `R1a`, `R1b`, `R2a`, `R2b` as substudies when needed

Current existing folders can remain as legacy or feeder cases. Over time, they should be interpreted through this map.

## S1-A PHYLO-GENOMICS

### Role

Clinical genomics, variant interpretation, and genomic triage.

### `S1-A-R1` Variant Interpretation And Pathogenicity Scoring

#### Substudies

- `S1-A-R1a` OpenVariant
- `S1-A-R1b` Somatic Classifier

#### Why this stays central

This is the clearest genomics-first bridge between domain interpretation and reusable computational logic.

### `S1-A-R2` Genomic Context And Triage Layers

#### Substudies

- `S1-A-R2a` Disease-specific variant context ranking
- `S1-A-R2b` Genomics-to-biomarker bridge

#### Why this matters

Variant scoring alone is not enough. This direction turns raw genomic findings into case-level molecular context.

## S1-B PHYLO-RNA

### Role

RNA therapeutics, regulatory RNA logic, and non-coding intervention design.

### `S1-B-R1` Regulatory RNA Silencing

#### Substudies

- `S1-B-R1a` BRCA2 miRNA
- `S1-B-R1b` TP53 siRNA synthetic lethality

#### Why this stays central

This is the strongest current RNA lane with direct translational logic.

### `S1-B-R2` Non-Coding RNA Therapeutics

#### Substudies

- `S1-B-R2a` TREM2 lncRNA networks
- `S1-B-R2b` ASO designer and prioritization

#### Why this matters

This direction expands `S1-B` from silencing logic into broader intervention design.

## S1-C PHYLO-DRUG

### Role

RNA-directed molecular design and mechanism-aware translational drug logic.

### `S1-C-R1` RNA-Directed Small Molecule Discovery

#### Substudies

- `S1-C-R1a` FGFR3 RNA-directed drug
- `S1-C-R1b` Synthetic lethal drug mapping

#### Why this stays central

This is the most direct route from disease mechanism to small-molecule hypothesis generation.

### `S1-C-R2` Frontier Mechanism-Linked Therapeutics

#### Substudies

- `S1-C-R2a` m6A / ferroptosis / circadian frontier axis
- `S1-C-R2b` translational mechanism plausibility scoring

#### Why this matters

This keeps `S1-C` from becoming only one compound-screening lane and opens room for deeper mechanism work.

## S1-D PHYLO-LNP

### Role

Delivery systems, protein corona, BBB, and formulation-performance logic.

### `S1-D-R1` Corona And Formulation Intelligence

#### Substudies

- `S1-D-R1a` Serum corona ML
- `S1-D-R1b` Flow corona

#### Why this stays central

This is the strongest route for turning formulation data into interpretable delivery logic.

### `S1-D-R2` Barrier And Context-Specific Delivery

#### Substudies

- `S1-D-R2a` Brain BBB delivery
- `S1-D-R2b` Exotic fluids and context-specific transport

#### Why this matters

This pushes `S1-D` beyond generic LNP work and into real translational constraints.

#### Note

`AutoCorona NLP` is useful, but its long-term home may become a technology mirror if it matures into a reusable platform rather than a science-specific case.

## S1-E PHYLO-BIOMARKERS

### Role

Biomarkers, diagnostics, and clinically interpretable signal discovery.

### `S1-E-R1` Liquid Biopsy And Signal Discovery

#### Substudies

- `S1-E-R1a` Liquid biopsy
- `S1-E-R1b` Protein validator

#### Why this stays central

This is the cleanest immediate translational layer for `S1-E`.

### `S1-E-R2` Biomarker Ranking And Clinical Translation

#### Substudies

- `S1-E-R2a` multi-marker prioritization
- `S1-E-R2b` assay-readiness validation layer

#### Why this matters

It prevents `S1-E` from becoming only a marker list and pushes it toward clinically usable interpretation.

## S1-F PHYLO-RARE

### Role

Rare, difficult, and underexplored oncology applications.

### `S1-F-R1` Rare High-Risk Disease Programs

#### Substudies

- `S1-F-R1a` DIPG
- `S1-F-R1b` pAML

#### Why this stays central

These represent urgent, difficult, and translationally meaningful cases.

### `S1-F-R2` Orphan And Underexplored Solid Tumors

#### Substudies

- `S1-F-R2a` UVM
- `S1-F-R2b` rare-cancer cross-case triage

#### Why this matters

This gives `S1-F` a durable structure instead of a random rare-cancer bucket.

## Operational interpretation

### What is already useful now

Many of the current S1 studies are already useful as:

- computational prototypes
- method demonstrations
- reusable research workflows
- GitHub and Hugging Face scientific assets

They are not yet direct medical solutions for patients.

That distinction should stay explicit.

## Recommended next move after this document

The next clean stage is:

1. pick one lane at a time
2. formalize `R1` and `R2`
3. decide which current folders map to those directions
4. only then clean up or archive legacy folder structures

## Immediate order inside S1

Best order of execution:

1. `S1-A`
2. `S1-B`
3. `S1-D`
4. `S1-E`
5. `S1-C`
6. `S1-F`

Reason:

- `S1-A`, `S1-B`, `S1-D`, and `S1-E` are the most structurally mature
- `S1-C` benefits from stronger upstream prioritization
- `S1-F` becomes stronger once the upstream methodological lanes are clearer
