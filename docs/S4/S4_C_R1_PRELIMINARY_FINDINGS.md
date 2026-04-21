# S4-C-R1 Preliminary Findings

## Research home

- Sphere: `S4`
- Lane: `S4-C Enzyme, Target & Substrate Logic`
- Research line: `S4-C-R1 Target And Enzyme Prioritization`

## Scope v0

This first active execution pass narrows `S4-C-R1` to:

- enzyme and target relevance from pathway-backed metabolomics
- stronger vs weaker target-support patterns
- pathway-to-target bridge logic

That scope is intentionally tighter than a broad target-discovery review.

## Current target-prioritization shortlist

### Tier 1 patterns

- pathway-backed enzyme ranking with multi-metabolite support
- metabolomics plus transcriptomics or network support
- target inference grounded in enzyme-substrate logic rather than only association

### Tier 2 patterns

- large-scale metabolome-to-gene interpretation
- network pharmacology as a shortlist layer
- algorithmic substrate prediction as a support tool, not final proof

## Why these patterns matter

They jointly show three things:

- `S4-C` can be a real target-facing layer, not just a chemistry appendix
- metabolomics can help prioritize enzymes and targets if ambiguity is handled explicitly
- cross-omics support is one of the main ways to strengthen target plausibility

## Practical interpretation

The current evidence already supports three real outputs:

1. a normalized target evidence table
2. a ranked enzyme shortlist
3. a first pathway-to-target interpretation note

## Current working logic

### 1. Enzyme-substrate logic should anchor target reasoning

The Nature Communications substrate-prediction work shows that enzyme-target logic is strongest when molecule and enzyme representations are modeled explicitly rather than guessed from loose annotations.

### 2. Activity-context matters

The iMetAct paper supports that metabolic enzyme relevance should be interpreted within regulatory and network context, not as isolated enzyme names.

### 3. Cross-omics support raises confidence

The integrative metabolomics and transcriptomics papers support that target prioritization becomes more defensible when pathways, genes, and metabolite shifts point in the same direction.

### 4. Broad metabolome-to-gene studies help with plausibility, not full proof

Large-scale metabolome genetics results are useful for prioritization and interpretation, but they do not replace domain-specific validation.

## Current discipline

At this stage we may say:

- metabolomics can support enzyme and target prioritization
- pathway-backed and cross-omics-backed targets are more defensible than isolated associations
- confidence handling is part of the scientific value of `S4-C`

At this stage we should not say:

- that a ranked target list equals validated mechanism
- that one metabolite-pathway link resolves target identity
- that translational utility follows automatically from computational ranking

## Immediate next step

The next execution move for `S4-C-R1` should be:

- expand the evidence table with a few more high-value integrative papers
- keep only records that sharpen target-confidence logic
- avoid bloating the pack with generic biomarker studies that do not inform target inference
