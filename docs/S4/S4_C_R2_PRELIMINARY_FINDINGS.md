# S4-C-R2 Preliminary Findings

## Research home

- Sphere: `S4`
- Lane: `S4-C Enzyme, Target & Substrate Logic`
- Research line: `S4-C-R2 Substrate And Interaction Models`

## Scope v0

This first execution pass narrows `S4-C-R2` to:

- substrate-family comparison
- enzyme-substrate plausibility
- separation of curated, predicted, and speculative links

## Current patterns

- target ranking is stronger when substrate or reaction context is visible
- prediction models are useful for narrowing validation priorities
- curated enzyme databases remain necessary for grounding
- literature extraction can help coverage but still needs review

## Practical interpretation

The useful output is not "this compound works."

The useful output is:

- this enzyme-substrate link is directly supported
- this one is model-plausible
- this one is only speculative
- this one should not be carried forward

## Current discipline

At this stage we may say:

- `S4-C-R2` can improve target plausibility scoring
- substrate-family logic can prevent weak candidate lists
- prediction tools are useful when evidence type is explicit

At this stage we should not say:

- that predicted substrate links are validated
- that target plausibility proves therapeutic action
- that database presence is enough for full mechanism proof
