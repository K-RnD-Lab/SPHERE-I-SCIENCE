# S4-B-R2 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-B Pathway Chemistry & Perturbation`
- Research line: `S4-B-R2 Mechanism Prioritization`

## Why this study belongs here

`S4-B-R1` maps pathway perturbations. `S4-B-R2` asks which pathway signals are strong enough to become mechanism hypotheses.

This prevents `S4-B` from becoming a pathway-enrichment dump.

## Core question

How can pathway perturbation evidence be ranked into defensible mechanism priorities without overclaiming causality from metabolomics alone?

## Practical substudies

### `S4-B-R2a` Perturbation-To-Mechanism Ranking

Goal:

- convert pathway disturbance records into ranked mechanism candidates

Focus:

- pathway coherence
- metabolite annotation confidence
- cross-omics support
- repeated direction across conditions
- explicit uncertainty label

### `S4-B-R2b` Candidate Process Prioritization Notes

Goal:

- produce short mechanism notes that explain why one process deserves attention before another

Focus:

- process label
- evidence trail
- confidence tier
- competing explanations
- validation need

## Useful references

- pathway-analysis misuse in metabolomics:
  - https://www.nature.com/articles/s42255-025-01283-0
- MetaboAnalystR 4.0 workflow and functional interpretation:
  - https://www.nature.com/articles/s41467-024-48009-6
- comparison of enrichment methods for untargeted metabolomics:
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC12301278/
- integrated metabolic activity inference:
  - https://www.sciencedirect.com/science/article/pii/S2211124725001469
- pathway-guided metabolomics mediation:
  - https://arxiv.org/abs/2503.13894
- human metabolome-phenome atlas:
  - https://www.nature.com/articles/s42255-025-01371-1

## Data classes to collect

- pathway label
- pathway-analysis method
- metabolite support count
- annotation confidence
- pathway direction or coherence
- cross-omics support
- mechanism candidate
- competing explanation
- evidence source
- priority score

## Required outputs

- mechanism-priority table
- pathway-to-process summary note
- confidence vocabulary for strong, medium, and weak mechanism claims
- one compact report explaining what is ready for deeper analysis

## Claim discipline

At this stage we may say:

- some pathway perturbations are stronger mechanism candidates than others
- pathway ranking should combine coherence, annotation confidence, and independent support
- mechanism prioritization is a hypothesis-generation layer

At this stage we should not say:

- that pathway enrichment proves mechanism
- that one metabolomics contrast proves causality
- that one tool output is enough for prioritization
