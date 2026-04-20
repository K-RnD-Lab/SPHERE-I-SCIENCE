# S4 Priority Research

## S4 scientific home

`S4` = Biochemistry & Metabolomics

This sphere is the chemistry-and-mechanism bridge across the rest of the science system.

It should remain focused on:

- metabolomic signatures
- biochemical pathways
- enzyme/substrate logic
- mechanism-level interpretation
- cross-domain chemical inference

It should not collapse into:

- plant-only work
- neuro-only work
- environment-only work

Those can use `S4` methods, but their domain home remains in their own spheres.

## Stable sub-lanes

- `S4-A` Metabolomics & Signature Discovery
- `S4-B` Pathway Chemistry & Perturbation
- `S4-C` Enzyme, Target & Substrate Logic
- `S4-D` Cross-Domain Mechanism Models
- `S4-E` Translational Chemical Inference

## Recommended first research case

### `S4-A-R1` Metabolite Signature Classifier And Interpretation Layer

#### Core question

How can metabolite patterns be turned into interpretable biochemical signatures that distinguish meaningful biological states?

#### Why this should be first

- strong scientific clarity
- reusable across disease, plant, and environmental contexts
- natural bridge between omics and mechanism
- suitable for both GitHub reports and interactive explainers

#### Data classes to use

- metabolite abundance matrices
- sample metadata
- contrast labels
- pathway annotations
- compound identifiers and chemical classes

#### Outputs

- metabolite signature table
- ranked markers
- pathway interpretation
- signature visualizations
- short biochemical interpretation report

#### GitHub role

- data dictionary
- signature logic
- reproducible analysis
- figures and report

#### Hugging Face role

- signature explorer
- sample-state comparison tool
- pathway summary interface

## Recommended second research case

### `S4-B-R1` Pathway Perturbation Maps And Mechanism Prioritization

#### Core question

Which pathways appear most strongly perturbed in a given biological context, and how can those perturbations be interpreted mechanistically?

#### Why this should be second

- makes `S4` more mechanistic, not only descriptive
- useful across multiple science spheres
- creates a durable bridge to future translational work

#### Data classes to use

- pathway-level activity tables
- gene or metabolite input lists
- condition contrasts
- curated pathway annotations

#### Outputs

- pathway ranking
- perturbation maps
- mechanistic summaries
- candidate target shortlist
- explanatory figures

#### GitHub role

- pathway analysis logic
- ranked outputs
- methods note
- report and figures

#### Hugging Face role

- pathway perturbation explorer
- ranked mechanism viewer
- condition comparison app

## S4 and technology

`S4` should stay science-first.

If later a pathway-mapping engine or metabolite-signature tool becomes reusable across many domains, that reusable execution layer can be mirrored into `TECHNOLOGY`.

Use the split:

- biochemical interpretation -> `S4`
- reusable inference engine -> `TECHNOLOGY`

## Recommended next move

If we continue after this step, the best sequence is:

1. define `S4-A-R1` more concretely
2. identify first public metabolomics datasets
3. choose whether the first output is report-first or app-first
