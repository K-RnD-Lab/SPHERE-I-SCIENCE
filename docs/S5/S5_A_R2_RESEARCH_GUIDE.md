# S5-A-R2 Research Guide

## Research home

- Sphere: `S5`
- Lane: `S5-A Neuroinflammation & Biomarkers`
- Research line: `S5-A-R2 Biomarker Context And Specificity`

## Why this is the right next `S5` study

`S5-A-R2` sharpens the first `S5-A` guide by asking which neuroinflammatory and glial biomarkers are specific enough, context-aware enough, and interpretable enough to use in research panels.

## Core question

How can neuroinflammatory biomarkers be interpreted across disease stage, biomarker panel context, matrix, and specificity limits without treating every inflammatory signal as disease-specific?

## Practical substudies

### `S5-A-R2a` Compare Biomarker Patterns Across States

Goal:

- compare neuroinflammatory and glial biomarker patterns across AD stages and related dementia contexts

Focus:

- GFAP, YKL-40, sTREM2, MCP-1, cytokines
- stage and longitudinal context
- CSF vs plasma interpretation

### `S5-A-R2b` Specificity vs Overlap Interpretation Notes

Goal:

- define where biomarkers are useful, nonspecific, or only panel-supportive

Focus:

- overlap across neurodegeneration and aging states
- assay and reporting standardization
- biomarker role within broader AT(N)/ATI(N) context

## Why this matters now

Neuroinflammatory biomarkers are increasingly discussed in AD and related dementias, but many markers are nonspecific. `S5-A-R2` keeps the lane scientifically useful by separating marker signal from marker specificity.

Useful references:

- neuroinflammatory fluid biomarkers in AD: https://www.nature.com/articles/s41380-025-02939-9
- roadmap for inflammatory fluid marker interpretation: https://link.springer.com/article/10.1186/s12974-025-03432-4
- tracking neuroinflammatory biomarkers in AD: https://link.springer.com/article/10.1186/s12974-024-03163-y
- glial activation blood biomarkers in AD: https://www.sciencedirect.com/science/article/pii/S053155652500289X
- extracellular vesicle biomarkers in ADRD: https://www.nature.com/articles/s44400-024-00002-y
- imaging and fluid biomarkers as complementary tools: https://pubmed.ncbi.nlm.nih.gov/40480828/

## Data classes to collect

For the first useful pass, prioritize:

- biomarker name
- biological role
- matrix
- disease or stage context
- specificity concern
- role in panel
- longitudinal evidence note

## Required outputs

The first useful output should include:

- neuroinflammation specificity evidence table
- marker role matrix
- CSF vs plasma interpretation note
- panel-readiness summary

## GitHub role

GitHub should hold:

- biomarker specificity schema
- evidence table
- matrix and stage comparison notes
- figures
- report

## Hugging Face role

Hugging Face should hold:

- neuroinflammatory marker explorer
- biomarker specificity view
- stage and matrix comparison dashboard

## Suggested first workflow

1. separate inflammatory, glial, neurodegeneration, and core AD markers
2. extract marker matrix and disease stage
3. record specificity and overlap concerns
4. classify whether each marker is standalone, panel-supportive, or exploratory
5. write a short biomarker specificity interpretation

## Evidence fields to standardize

At minimum, track:

- `biomarker`
- `biological_role`
- `matrix`
- `state_or_stage`
- `specificity_issue`
- `panel_role`
- `evidence_source`
- `evidence_level`
- `interpretation_note`
- `limit_note`

## What not to do

Do not:

- call every inflammatory marker a neuroinflammation biomarker without context
- infer CNS inflammation solely from blood inflammation
- ignore matrix, assay, and stage differences
- treat nonspecific elevation as disease-specific evidence
