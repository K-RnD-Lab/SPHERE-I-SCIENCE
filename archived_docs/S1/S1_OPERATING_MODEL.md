# S1 Operating Model

## Purpose

`S1` should become the long-horizon biomedical and translational oncology system inside `K-RnD Lab`, not just a container for scattered point studies.

The correct move is not to delete the current `S1-A ... S1-F` lanes. The correct move is to keep them as stable lanes, then separate:

- long-term lanes
- repeatable flagship programs
- narrower case studies
- archived one-off experiments

## Current diagnosis

### What is already strong

- The lane taxonomy is already coherent:
  - `S1-A` PHYLO-GENOMICS
  - `S1-B` PHYLO-RNA
  - `S1-C` PHYLO-DRUG
  - `S1-D` PHYLO-LNP
  - `S1-E` PHYLO-BIOMARKERS
  - `S1-F` PHYLO-RARE
- Several existing repositories are already useful as method demonstrations.
- `S1` already has a natural GitHub + Hugging Face split.

### What is currently weak

- Repeated confusion between lane, program, and single study.
- Many current folders read like isolated experiments instead of a durable research system.
- Too much simulated-output work is presented at the same structural level as future flagship programs.
- It is not yet obvious what is:
  - reusable infrastructure
  - flagship scientific program
  - disease-specific case
  - archive

## Recommended long-term frame

### Level 1: Stable lanes

Keep the existing six lanes as the stable biomedical map for years ahead.

#### `S1-A` PHYLO-GENOMICS

Clinical genomics, variant interpretation, molecular triage, and study-ready disease context.

#### `S1-B` PHYLO-RNA

RNA therapeutics logic: miRNA, siRNA, lncRNA, ASO, target prioritization, and intervention framing.

#### `S1-C` PHYLO-DRUG

Mechanism-linked molecular design, RNA-directed small molecules, and translational target-to-compound logic.

#### `S1-D` PHYLO-LNP

Delivery systems, protein corona, transport, BBB, and formulation-performance logic.

#### `S1-E` PHYLO-BIOMARKERS

Biomarkers, molecular diagnostics, liquid-biopsy logic, and clinically interpretable signal extraction.

#### `S1-F` PHYLO-RARE

Rare oncology and frontier disease programs where `S1-A ... S1-E` methods get applied to urgent or underexplored cases.

## Recommended execution hierarchy

Inside `S1`, use a consistent four-level model:

1. `Lane`
2. `Flagship program`
3. `Case study`
4. `Archive`

### Practical interpretation

- `Lane` = `S1-A ... S1-F`
- `Flagship program` = a repeated study engine that can generate multiple outputs over time
- `Case study` = one disease/gene/application-specific execution
- `Archive` = old exploratory work kept for traceability, not presented as current strategic focus

## What to do with the current folders

Do not mass-delete them now.

Do this instead:

1. Keep current folders as legacy case studies.
2. Promote only a small number into flagship status.
3. Move the rest into an archive layer only after their reusable assets are extracted.

### What counts as reusable before archival

- data schema
- notebook template
- figure template
- prompt template
- Hugging Face demo logic
- evaluation logic
- clear README framing

If a study has none of these, it is not a flagship program. It is a case study at best.

## Recommended flagship programs for S1

These are the strongest starting programs if the goal is practical scientific value plus public clarity.

### Program 1

`S1-P1 -> Oncology Variant And Biomarker Triage`

Primary lanes:

- `S1-A`
- `S1-E`

Use cases:

- variant interpretation
- mutation-context triage
- biomarker ranking
- liquid-biopsy relevance framing
- translational report generation for specific disease settings

Why this should be first:

- immediately legible to scientists
- easier to structure around real public datasets
- strongest bridge from GitHub documentation to Hugging Face demo
- can serve both rare and common oncology projects

Current studies that can feed this program:

- `R1a-openvariant`
- `R1a-liquid-biopsy`
- `R1b-protein-validator`

### Program 2

`S1-P2 -> RNA Therapeutics And Delivery Prioritization`

Primary lanes:

- `S1-B`
- `S1-D`
- secondary support from `S1-C`

Use cases:

- RNA target selection
- miRNA / siRNA / ASO prioritization
- delivery constraints
- corona and BBB reasoning
- disease-specific therapeutic hypothesis generation

Why this should be second:

- it is the most distinctive PHYLO-style line
- it creates a strong bridge between bioinformatics and translational design
- it is where GitHub, Hugging Face, and future external platform work can reinforce each other

Current studies that can feed this program:

- `R1a-brca2-mirna`
- `R2a-tp53-sirna`
- `R3a-lncrna-trem2`
- `R1a-lnp-corona-ml`
- `R3a-lnp-bbb`
- `R4a-autocorona-nlp`

## Recommended role of `S1-F`

`S1-F` should not be the first flagship program.

It should act as the disease-application layer where methods from `S1-A`, `S1-B`, `S1-D`, and `S1-E` get applied to:

- DIPG
- UVM
- pAML
- later rare or urgent disease programs

This makes `S1-F` more useful and less isolated.

## GitHub vs Hugging Face split

### GitHub should hold

- manuscripts
- reproducible notebooks
- data dictionaries
- methods notes
- case-study structure
- research roadmap
- archive and provenance

### Hugging Face should hold

- interactive demos
- narrow public explainers
- lightweight inference or exploration tools
- program-level front doors, not every tiny experiment

### Recommended S1 Hugging Face direction

Avoid one Space per tiny case.

Prefer:

- one flagship genomics/biomarker triage Space
- one flagship RNA therapeutics + delivery Space
- optionally one disease-specific showcase Space only if it is especially strong

## Archive rule

Archive a study only when one of these is true:

- it is superseded by a flagship program
- it has no reusable scientific or tooling value
- it duplicates another study with a stronger framing

Do not archive studies only because they are old.
Archive them when they no longer serve the operating model.

## Immediate next actions

1. Keep `S1-A ... S1-F` as the stable lanes.
2. Do not delete current folders yet.
3. Establish two flagship programs:
   - `S1-P1` Oncology Variant And Biomarker Triage
   - `S1-P2` RNA Therapeutics And Delivery Prioritization
4. Re-label current folders mentally as:
   - flagship feeder
   - case study
   - archive candidate
5. Use `phylo.bio` only for inputs and analyses that can strengthen these two flagship programs.
