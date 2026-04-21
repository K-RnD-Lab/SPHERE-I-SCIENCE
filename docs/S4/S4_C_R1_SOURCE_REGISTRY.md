# S4-C-R1 Source Registry

## Purpose

This file records the first evidence layer for:

- `S4-C-R1 Target And Enzyme Prioritization`

It is meant to support:

- enzyme relevance ranking
- pathway-to-target reasoning
- target plausibility scoring
- limits of metabolomics-driven target inference

## Active scope

Current scope is deliberately narrow:

- enzyme and target inference from pathway and metabolite signals
- computational and integrative support for metabolic target logic
- strong vs weak target-prioritization patterns

## Current source set

### 1. General model for predicting enzyme-small-molecule substrate relationships

Source:

- https://www.nature.com/articles/s41467-023-38347-2

Why it matters:

- strong methodological anchor for enzyme-substrate plausibility
- useful for clarifying what computational target logic can and cannot do

### 2. Integrated inference of metabolic activity (iMetAct)

Source:

- https://www.sciencedirect.com/science/article/pii/S2211124725001469

Why it matters:

- explicitly connects metabolic enzyme activation to broader regulatory behavior
- useful for enzyme relevance ranking in context

### 3. Metabolomics accelerates discovery of targets and mechanisms

Source:

- https://www.sciencedirect.com/science/article/abs/pii/S0045206825012581

Why it matters:

- broad translational framing for metabolomics as a target-discovery layer
- useful context source for why `S4-C` exists

### 4. Integrated metabolomics, pharmacochemistry, and network pharmacology

Source:

- https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2025.1618584/full

Why it matters:

- concrete example of moving from metabolite change toward target and mechanism hypotheses
- useful for shortlist logic

### 5. Integrated metabolomics and transcriptomics for metabolic-pathway characteristics

Source:

- https://www.sciencedirect.com/science/article/pii/S0006291X24013913

Why it matters:

- useful bridge from pathway shifts to target inference
- strengthens cross-omics support logic

### 6. Genetic architecture of the plasma metabolome

Source:

- https://www.nature.com/articles/s41467-025-62126-w

Why it matters:

- shows how metabolite variation can connect to biologically plausible genes and enzymes at large scale
- useful for interpretation discipline and target plausibility framing

## Current research stance

At this stage, `S4-C-R1` is not trying to build a universal target-discovery engine.

It is trying to distinguish:

- enzymes and targets with stronger pathway and multi-signal support
- computationally plausible but weakly grounded candidates
- target logic worth carrying into later translational inference

## What to collect next

Next source additions should prioritize:

- studies with explicit pathway-to-target transitions
- enzyme-focused papers tied to metabolite or flux signals
- multi-omics works that improve target confidence
- cases where target inference failed or remained ambiguous

## Claim discipline

At this stage we may say:

- target prioritization is stronger when pathway and multi-omics support align
- enzyme relevance can be ranked before full wet-lab proof
- metabolomics can contribute to target discovery, but with explicit ambiguity handling

At this stage we should not say:

- that computational target ranking equals validated mechanism
- that one linked metabolite proves one specific enzyme target
- that every pathway perturbation should produce a confident target shortlist
