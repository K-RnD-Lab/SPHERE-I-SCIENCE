# S4-E-R1 Preliminary Findings

## Research home

- Sphere: `S4`
- Lane: `S4-E Translational Chemical Inference`
- Research line: `S4-E-R1 Candidate Chemical Prioritization`

## Scope v0

This first active execution pass narrows `S4-E-R1` to:

- candidate chemical ranking from metabolic evidence
- pathway-target-candidate bridging
- translational shortlist discipline

That scope is intentionally tighter than a broad drug-discovery discussion.

## Current candidate-prioritization shortlist

### Tier 1 patterns

- candidate ranking becomes more defensible when pathway and target logic align
- compound shortlists are stronger when they are supported by multiple evidence layers
- translational candidate logic benefits from explicit ambiguity handling

### Tier 2 patterns

- network pharmacology can help shortlist generation but often inflates confidence
- natural-product profiling is useful when linked to mechanism rather than only abundance
- metabolomics provides a strong starting point, but not standalone validation

## Why these patterns matter

They jointly show three things:

- `S4-E` can become the first translational output layer for `S4`
- candidate ranking is useful only if it stays evidence-aware
- criticism of weak methods is part of building stronger shortlist logic

## Practical interpretation

The current evidence already supports three real outputs:

1. a normalized candidate evidence table
2. a ranked shortlist of more defensible candidates
3. a first translational note on strong vs weak candidate inference

## Current working logic

### 1. Metabolomics can support candidate prioritization, but not alone

The review and translational overview papers support the value of metabolomics for candidate discovery while still implying clear limits.

### 2. Layered evidence is the real strength

The serum pharmacochemistry and integrated scRNA-seq papers show that candidate ranking becomes stronger when compounds, pathways, and targets converge.

### 3. Weak network pharmacology is a real risk

The critical review makes it clear that poorly constrained network-pharmacology pipelines can generate overconfident and weakly grounded candidate stories.

### 4. Translational logic should stay shortlist-level

At this stage, `S4-E-R1` should prioritize which candidates deserve more attention, not pretend to prove which candidate is best in practice.

## Current discipline

At this stage we may say:

- candidate-prioritization can be a valid translational output of `S4`
- stronger candidate shortlists require pathway and target support
- methodological caution is central to useful translational inference

At this stage we should not say:

- that candidate ranking equals intervention readiness
- that one multi-layer paper is enough to validate a compound
- that every pathway-linked compound deserves shortlist status

## Immediate next step

The next execution move for `S4-E-R1` should be:

- expand the evidence table with a few more high-value translational papers
- keep only records that sharpen shortlist confidence logic
- avoid bloating the pack with generic omics-to-compound claims
