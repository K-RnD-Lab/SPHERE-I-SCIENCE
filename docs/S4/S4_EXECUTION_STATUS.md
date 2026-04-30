# S4 Execution Status

## Why this file exists

This file separates:

- lane architecture
- ready research guides
- planned next guides

It keeps `S4` readable as a mechanism-first bridge rather than a chemistry catch-all.

## S4 lane status

### `S4-A Metabolomics & Signature Discovery`

- `R1` guide: ready
- `R2` guide: ready

### `S4-B Pathway Chemistry & Perturbation`

- `R1` guide: ready
- `R2` guide: ready

### `S4-C Enzyme, Target & Substrate Logic`

- `R1` guide: ready
- `R2` guide: ready

### `S4-D Cross-Domain Mechanism Models`

- `R1` guide: ready
- `R2` guide: ready

### `S4-E Translational Chemical Inference`

- `R1` guide: ready
- `R2` guide: ready

## Current interpretation

`S4` currently has:

- a full lane map
- one starter guide for metabolite signature work
- one active execution pack for pathway perturbation maps
- one active execution pack for mechanism prioritization
- one active execution pack for target and enzyme prioritization
- one active execution pack for substrate and interaction models
- one active execution pack for candidate chemical prioritization
- one active execution pack for evidence-based chemical plausibility
- one active execution pack for shared mechanism interpretation

This means `S4` now has:

- a metabolite-signature entry line through `S4-A`
- a deeper state-profile layer through `S4-A-R2`
- a first mechanism-facing execution line through `S4-B-R1`
- a mechanism quality-control layer through `S4-B-R2`
- a target-facing execution line through `S4-C-R1`
- a substrate and interaction plausibility layer through `S4-C-R2`
- a translational shortlist layer through `S4-E-R1`
- a translational plausibility filter through `S4-E-R2`
- a cross-domain motif-transfer layer through `S4-D-R1`
- a shared mechanism interpretation layer through `S4-D-R2`

It now has an operational active layer across signature, pathway, target, translational, and cross-domain mechanism work.

It also has a second-pass quality-control layer across mechanism prioritization, substrate plausibility, chemical plausibility, and shared-motif interpretation.

## Recommended next order inside S4

1. `S4-B-R1`
2. `S4-B-R2`
3. `S4-C-R1`
4. `S4-C-R2`
5. `S4-E-R1`
6. `S4-E-R2`
7. `S4-A-R2`
8. `S4-D-R1`
9. `S4-D-R2`

Reason:

- `S4-B-R1` makes the sphere mechanism-aware quickly
- `S4-B-R2` prevents pathway-overclaiming by ranking mechanism confidence
- `S4-C-R1` adds target and enzyme logic
- `S4-C-R2` checks substrate and interaction plausibility
- `S4-E-R1` creates the translational bridge
- `S4-E-R2` filters candidate plausibility before stronger claims
- `S4-A-R2` deepens the signature layer after that
- `S4-D-R1` benefits from the neighboring mechanism layers already being defined
- `S4-D-R2` becomes stronger once several mechanism layers can be compared

## Active execution files

Current active `S4` execution layer:

- `S4-B-R1_RESEARCH_GUIDE.md`
- `S4-B-R1_SOURCE_REGISTRY.md`
- `S4-B-R1_EVIDENCE_SCHEMA.csv`
- `S4-B-R1_REPORT_SKELETON.md`
- `S4-B-R1_PRELIMINARY_FINDINGS.md`
- `S4-B-R2_RESEARCH_GUIDE.md`
- `S4-B-R2_SOURCE_REGISTRY.md`
- `S4-B-R2_EVIDENCE_SCHEMA.csv`
- `S4-B-R2_REPORT_SKELETON.md`
- `S4-B-R2_PRELIMINARY_FINDINGS.md`
- `S4-C-R1_RESEARCH_GUIDE.md`
- `S4-C-R1_SOURCE_REGISTRY.md`
- `S4-C-R1_EVIDENCE_SCHEMA.csv`
- `S4-C-R1_REPORT_SKELETON.md`
- `S4-C-R1_PRELIMINARY_FINDINGS.md`
- `S4-C-R2_RESEARCH_GUIDE.md`
- `S4-C-R2_SOURCE_REGISTRY.md`
- `S4-C-R2_EVIDENCE_SCHEMA.csv`
- `S4-C-R2_REPORT_SKELETON.md`
- `S4-C-R2_PRELIMINARY_FINDINGS.md`
- `S4-E-R1_RESEARCH_GUIDE.md`
- `S4-E-R1_SOURCE_REGISTRY.md`
- `S4-E-R1_EVIDENCE_SCHEMA.csv`
- `S4-E-R1_REPORT_SKELETON.md`
- `S4-E-R1_PRELIMINARY_FINDINGS.md`
- `S4-E-R2_RESEARCH_GUIDE.md`
- `S4-E-R2_SOURCE_REGISTRY.md`
- `S4-E-R2_EVIDENCE_SCHEMA.csv`
- `S4-E-R2_REPORT_SKELETON.md`
- `S4-E-R2_PRELIMINARY_FINDINGS.md`
- `S4-A-R2_RESEARCH_GUIDE.md`
- `S4-A-R2_SOURCE_REGISTRY.md`
- `S4-A-R2_EVIDENCE_SCHEMA.csv`
- `S4-A-R2_REPORT_SKELETON.md`
- `S4-A-R2_PRELIMINARY_FINDINGS.md`
- `S4-D-R1_RESEARCH_GUIDE.md`
- `S4-D-R1_SOURCE_REGISTRY.md`
- `S4-D-R1_EVIDENCE_SCHEMA.csv`
- `S4-D-R1_REPORT_SKELETON.md`
- `S4-D-R1_PRELIMINARY_FINDINGS.md`
- `S4-D-R2_RESEARCH_GUIDE.md`
- `S4-D-R2_SOURCE_REGISTRY.md`
- `S4-D-R2_EVIDENCE_SCHEMA.csv`
- `S4-D-R2_REPORT_SKELETON.md`
- `S4-D-R2_PRELIMINARY_FINDINGS.md`
