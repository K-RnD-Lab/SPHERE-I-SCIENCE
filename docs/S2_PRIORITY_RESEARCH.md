# S2 Priority Research

## S2 scientific home

`S2` = Plant Science & Phytochemistry

This sphere should stay focused on plant-intrinsic biology rather than field intervention logic.

That means:

- plant omics
- phytochemicals
- metabolite signatures
- plant stress and resilience
- plant bioactivity

not:

- biofertilizer deployment
- soil intervention strategy
- agricultural operations

Those belong in `S3`.

## Stable sub-lanes

- `S2-A` Plant Omics & Trait Signatures
- `S2-B` Phytochemicals & Natural Products
- `S2-C` Stress Biology & Resilience
- `S2-D` Plant-Pathogen & Defense Systems
- `S2-E` Translational Plant Bioactivity

## Recommended first research case

### `S2-B-R1` Phytochemical Atlas And Candidate Prioritization

#### Core question

How can plant-derived compounds be organized into a usable atlas of candidate bioactive molecules with interpretable biological relevance?

#### Why this should be first

- it is scientifically legible
- it has clear public and translational value
- it can connect chemistry, biology, and practical future applications
- it creates a strong bridge to later `S4` and `T` work

#### Data classes to use

- phytochemical compound tables
- plant species metadata
- compound class annotations
- target or activity annotations when available
- pathway context where available

#### Outputs

- structured phytochemical registry
- compound class taxonomy
- ranked candidate list
- simple bioactivity or target-prioritization logic
- figures and explainer tables

#### GitHub role

- compound registry
- methods note
- classification logic
- report and figures

#### Hugging Face role

- searchable phytochemical explorer
- simple candidate ranking demo
- plant-to-compound lookup

## Recommended second research case

### `S2-C-R1` Plant Stress Response And Resilience Signatures

#### Core question

Which molecular or metabolite patterns best characterize plant stress response and resilience under different environmental conditions?

#### Why this should be second

- it has real biological value
- it naturally supports future agriculture-facing work in `S3`
- it is broad enough to stay relevant for years
- it gives `S2` more than only a natural-product identity

#### Data classes to use

- transcriptomic or metabolomic stress datasets
- treatment condition metadata
- species and tissue metadata
- stressor labels
- optional pathway and enrichment results

#### Outputs

- differential signature tables
- stress-specific candidate markers
- pathway interpretation
- condition comparison figures
- resilience-oriented short report

#### GitHub role

- reproducible analysis
- dataset notes
- signature tables
- interpretation and figures

#### Hugging Face role

- stress signature explorer
- condition comparison interface
- pathway summary demo

## S2 and technology

`S2` itself should remain scientific.

The moment a plant-analysis workflow becomes reusable across many projects, the build layer can be mirrored into `TECHNOLOGY`.

Use this split:

- plant question and interpretation -> `S2`
- reusable compound-ranking engine or omics explorer -> `TECHNOLOGY`

## Recommended next move

If we continue after this step, the best sequence is:

1. define `S2-B-R1` more concretely
2. decide its first public datasets
3. write the repo skeleton
4. decide whether it needs a Hugging Face explorer immediately or only after the first GitHub report
