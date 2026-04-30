# S5-C-R1 Preliminary Findings

## Research home

- Sphere: `S5`
- Lane: `S5-C Neurodegeneration Models`
- Research line: `S5-C-R1 Neurodegeneration State Models`

## Scope v0

This first active execution pass narrows `S5-C-R1` to:

- biomarker-defined neurodegeneration states
- AD as the most mature staging anchor
- non-AD proteinopathy markers as required expansion
- diagnostic vs prognostic vs monitoring role separation

## Current state-model shortlist

### Tier 1 patterns

- AD has the clearest biomarker staging logic and should be used as the first reference structure
- fluid and imaging biomarkers map different parts of pathology, neuroinflammation, and neurodegeneration
- alpha-synuclein seeding assays strengthen Lewy body disease state definition

### Tier 2 patterns

- blood biomarkers improve accessibility but still require assay and cut-point discipline
- protein aggregate PET is powerful but not uniformly available across diseases
- digital biomarkers are promising but often under-validated

## Why these patterns matter

They jointly show three things:

- `S5-C` needs disease-state logic, not just disease names
- biomarker roles must be separated by purpose
- AD maturity should not erase other neurodegenerative disorders

## Practical interpretation

The current evidence already supports three real outputs:

1. a neurodegeneration state evidence table
2. a biomarker role matrix
3. a stage-readiness note distinguishing diagnostic, prognostic, and monitoring evidence

## Current working logic

### 1. AD is the first staging anchor, not the whole lane

AD has the clearest biomarker staging framework, but `S5-C` should remain broader than AD.

### 2. Marker role matters

Amyloid, tau, NfL, GFAP, alpha-synuclein, PET imaging, and digital signals do not all answer the same question.

### 3. Clinical readiness is uneven

Some biomarkers are moving toward clinical use, while others remain research-facing or require stronger validation.

## Current discipline

At this stage we may say:

- biomarker-based state models are a practical research structure
- AD provides a mature anchor for staging logic
- Lewy body and protein-aggregate markers broaden the model beyond AD

At this stage we should not say:

- that all neurodegenerative states can be staged with the same biomarker set
- that biomarker positivity equals full clinical interpretation
- that digital biomarker models are deployment-ready without validation

## Immediate next step

The next execution move for `S5-C-R1` should be:

- add Parkinson, FTD, ALS, or mixed-dementia records
- expand the biomarker role matrix
- keep diagnostic, prognostic, and monitoring roles separate
