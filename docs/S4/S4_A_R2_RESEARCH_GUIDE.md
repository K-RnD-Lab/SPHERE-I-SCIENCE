# S4-A-R2 Research Guide

## Research home

- Sphere: `S4`
- Lane: `S4-A Metabolomics & Signature Discovery`
- Research line: `S4-A-R2 State-Specific Metabolomic Profiles`

## Why this is the right next `S4` study

`S4-A-R2` is the correct next step after `S4-A-R1` because it:

- moves from generic signature ranking into state-aware comparison
- helps distinguish healthy, perturbed, and cohort-specific biochemical profiles
- makes later pathway and target layers less abstract
- forces better discipline around confounders, platform bias, and group imbalance

## Core question

How can metabolomic data be organized into interpretable state-specific profiles without confusing biological state, cohort structure, and technical variation?

## Practical substudies

### `S4-A-R2a` Healthy vs Perturbed Biochemical State Profiles

Goal:

- define how metabolomic states differ between healthy and perturbed conditions

Focus:

- directionally coherent metabolite shifts
- profile-level state separation
- condition-aware interpretation

### `S4-A-R2b` Sample-Group Metabolomic Comparison Views

Goal:

- compare how profiles differ across subgroups, cohorts, or disease classes

Focus:

- cohort comparability
- subgroup-specific profile logic
- profile instability caused by technical or sampling differences

## Why this matters now

Metabolomics is now widely used to distinguish biological states, but the useful part is not only finding “top metabolites.” The useful part is building defensible profile views that separate:

- healthy vs perturbed states
- shared vs distinct biochemical patterns
- real biological differences vs weak cohort artifacts

Useful references:

- plasma and serum metabolomic profiles in healthy adults by sex and age: https://pubmed.ncbi.nlm.nih.gov/38491253/
- shared and distinct metabolic alterations across neurodegenerative states: https://pubmed.ncbi.nlm.nih.gov/39439201/
- healthy lifestyle signatures in untargeted metabolomics: https://www.nature.com/articles/s41598-024-64561-z
- common and distinct biomarkers across diabetes, CHD, and stroke: https://academic.oup.com/aje/article/194/6/1650/7701702
- platform comparison and biomarker-discovery limitations in critical illness: https://www.sciencedirect.com/science/article/pii/S0010482524014781
- review of disease-marker metabolomics in diabetes and associated pathologies: https://journals.sagepub.com/doi/full/10.1089/met.2024.0038

## Data classes to collect

For the first useful pass, prioritize:

- normalized metabolite abundance matrix
- state labels or group labels
- sample metadata
- cohort descriptors
- platform descriptors
- confounder notes
- profile-level summary statistics

## Required outputs

The first useful output should include:

- state-profile comparison table
- shared-vs-distinct metabolite panel
- profile-comparison figure set
- short interpretation note on biological vs technical separation

## GitHub role

GitHub should hold:

- profile schema
- group-comparison outputs
- cohort-comparison notes
- figures
- report

## Hugging Face role

Hugging Face should hold:

- state comparison explorer
- profile separation view
- subgroup comparison dashboard

## Suggested first workflow

1. choose one healthy vs perturbed contrast
2. choose one multi-group comparison
3. normalize and compare group-level profiles
4. flag likely cohort or platform artifacts
5. write a short state-profile interpretation

## Evidence fields to standardize

At minimum, track:

- `profile_id`
- `condition_or_group`
- `dominant_shift_pattern`
- `shared_or_distinct_signal`
- `confounder_note`
- `platform_or_matrix`
- `profile_interpretability`
- `evidence_source`
- `confidence_level`
- `notes`

## What not to do

Do not:

- assume every group difference is biologically meaningful
- ignore sex, age, matrix, or platform effects
- treat unbalanced group comparisons as if they were clean validation
- collapse state profiles into flat biomarker lists

## Immediate next move

If we continue from here, the cleanest next step is:

1. collect a small set of healthy, perturbed, and multi-group profile papers
2. normalize them into one state-profile evidence table
3. identify the strongest examples of shared vs distinct metabolomic state logic
