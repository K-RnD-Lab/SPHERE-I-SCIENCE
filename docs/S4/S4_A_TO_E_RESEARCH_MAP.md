# S4-A To S4-E Research Map

## Purpose

This document turns `S4-A ... S4-E` into a practical lane-level map.

The goal is to keep:

- the lane stable
- two main research directions inside each lane
- one to two substudies inside each research direction

`S4` should stay cross-domain and mechanism-facing, not collapse into a single application domain.

## Structural rule

Use:

- `S4-A`, `S4-B`, `S4-C`, `S4-D`, `S4-E` as stable lanes
- `R1`, `R2` as the two main directions inside each lane
- `R1a`, `R1b`, `R2a`, `R2b` as substudies when needed

## S4-A Metabolomics & Signature Discovery

### Role

Metabolite-level signal discovery, biochemical signatures, and state discrimination.

### `S4-A-R1` Metabolite Signature Classification

#### Substudies

- `S4-A-R1a` contrast-based metabolite signature panels
- `S4-A-R1b` class-aware marker ranking

#### Why this stays central

This gives `S4` a reusable biochemical signature backbone across spheres.

### `S4-A-R2` State-Specific Metabolomic Profiles

#### Substudies

- `S4-A-R2a` healthy vs perturbed biochemical state profiles
- `S4-A-R2b` sample-group metabolomic comparison views

#### Why this matters

This keeps metabolomics interpretable and not only descriptive.

## S4-B Pathway Chemistry & Perturbation

### Role

Pathway-level disturbance interpretation and mechanistic chemical mapping.

### `S4-B-R1` Pathway Perturbation Maps

#### Substudies

- `S4-B-R1a` ranked pathway disturbance panels
- `S4-B-R1b` condition-to-pathway perturbation comparisons

#### Why this stays central

This gives `S4` its clearest mechanism-facing identity.

### `S4-B-R2` Mechanism Prioritization

#### Substudies

- `S4-B-R2a` perturbation-to-mechanism ranking
- `S4-B-R2b` candidate process prioritization notes

#### Why this matters

This pushes `S4-B` beyond pathway listing into actual interpretation logic.

## S4-C Enzyme, Target & Substrate Logic

### Role

Target-centered biochemical reasoning, enzyme-substrate relationships, and candidate interaction framing.

### `S4-C-R1` Target And Enzyme Prioritization

#### Substudies

- `S4-C-R1a` enzyme relevance ranking
- `S4-C-R1b` candidate target shortlist logic

#### Why this stays central

This makes `S4-C` a strong bridge between chemistry and translational biological reasoning.

### `S4-C-R2` Substrate And Interaction Models

#### Substudies

- `S4-C-R2a` substrate-family comparison
- `S4-C-R2b` interaction plausibility scoring

#### Why this matters

This gives `S4-C` a durable structure for hypothesis generation without pretending to be wet-lab proof.

## S4-D Cross-Domain Mechanism Models

### Role

Mechanism-level logic that can bridge disease, plant, environment, and other biological domains.

### `S4-D-R1` Cross-Domain Signature Transfer

#### Substudies

- `S4-D-R1a` compare mechanism patterns across spheres
- `S4-D-R1b` transferable biochemical logic panels

#### Why this stays central

This is where `S4` becomes a real connector across the science system.

### `S4-D-R2` Shared Mechanism Interpretation

#### Substudies

- `S4-D-R2a` identify recurring response motifs
- `S4-D-R2b` rank shared perturbation logic across contexts

#### Why this matters

This gives `S4-D` a strong identity beyond simply “mixed chemistry.”

## S4-E Translational Chemical Inference

### Role

Translation from biochemical signatures and pathways into plausible candidate directions.

### `S4-E-R1` Candidate Chemical Prioritization

#### Substudies

- `S4-E-R1a` candidate shortlist from biochemical evidence
- `S4-E-R1b` mechanism-linked candidate ranking

#### Why this stays central

This is the cleanest translational output layer inside `S4`.

### `S4-E-R2` Evidence-Based Chemical Plausibility

#### Substudies

- `S4-E-R2a` evidence scoring for candidate plausibility
- `S4-E-R2b` comparative shortlist interpretation

#### Why this matters

This keeps the translational layer structured and defensible.

## Operational interpretation

### What is already useful now

Even before deep repo expansion, `S4` can become useful as:

- a metabolite signature system
- a pathway perturbation interpretation layer
- a mechanism-aware candidate prioritization framework

### What should not happen

Do not let `S4` drift into:

- plant-only framing
- disease-only framing
- a generic chemistry folder with no mechanism logic

Those belong in neighboring spheres or in mixed cases that still need a clear home.

## Recommended order inside S4

Best order of execution:

1. `S4-A`
2. `S4-B`
3. `S4-C`
4. `S4-E`
5. `S4-D`

Reason:

- `S4-A` and `S4-B` create the signature and pathway backbone
- `S4-C` adds target and substrate logic
- `S4-E` becomes stronger once biochemical interpretation is stable
- `S4-D` benefits from having the neighboring mechanism layers already defined
