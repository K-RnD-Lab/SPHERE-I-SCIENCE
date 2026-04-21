# S3-D-R1 Research Guide

## Research home

- Sphere: `S3`
- Lane: `S3-D Agro-Intervention Analytics`
- Research line: `S3-D-R1 Intervention Comparison Frameworks`

## Why this is a strong next `S3` study

`S3-D-R1` is the right next execution line after `S3-B-R1` because it:

- turns scattered intervention evidence into decision logic
- compares intervention types instead of treating every agricultural input separately
- creates a reusable framework for field recommendation and prioritization
- keeps `S3` practical rather than purely descriptive

## Core question

How can agricultural interventions be compared in a way that captures context fit, biological plausibility, field performance, and likely failure modes instead of relying on one-size-fits-all recommendations?

## Practical substudies

### `S3-D-R1a` Intervention-Type Comparison

Goal:

- compare how different intervention classes perform under different crop and stress contexts

Focus:

- microbial inoculants
- dual inoculation systems
- co-application with organic or reduced mineral inputs
- diversified fertilization or cropping support

### `S3-D-R1b` Context-Based Recommendation Logic

Goal:

- define when a given intervention is worth trying, when it is low-confidence, and when it should be avoided

Focus:

- crop and field context
- soil state
- stress exposure
- predicted response heterogeneity

## Why this matters now

Agricultural intervention work is moving toward response prediction, context-aware ranking, and integrated management rather than isolated “product works” claims.

Useful references:

- global field meta-analysis of microbial inoculants:
  - https://www.sciencedirect.com/science/article/abs/pii/S0304423823009378
- PGPR inoculants from lab to land challenges:
  - https://www.sciencedirect.com/science/article/pii/S0944501324003112
- soil microbiome indicators predicting growth response to AMF:
  - https://www.nature.com/articles/s41564-023-01520-w
- integrated nutrient management review:
  - https://www.mdpi.com/2077-0472/14/8/1330
- dual inoculation with AMF and Rhizobium in semi-arid legumes:
  - https://www.sciencedirect.com/science/article/pii/S240584402400848X

## Data classes to collect

For the first pass, prioritize:

- crop context
- intervention class
- intervention components
- soil or field context
- stress condition
- target outcome
- observed response
- limitation or uncertainty
- evidence source
- decision category

## Required outputs

The first useful output should include:

- normalized intervention comparison table
- context-aware recommendation matrix
- shortlist of higher-confidence intervention patterns
- short report
- one or two overview figures

## GitHub role

GitHub should hold:

- intervention comparison schema
- evidence table
- recommendation logic
- figures
- short report

## Hugging Face role

Hugging Face should hold:

- intervention comparison explorer
- field-context recommendation viewer
- response-risk explanation layer

## Suggested first workflow

1. choose a compact set of intervention classes
2. collect comparison-relevant field and synthesis sources
3. normalize crop, intervention, and context fields
4. compare response patterns
5. define recommendation categories
6. write a short decision-oriented interpretation note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `crop_context`
- `intervention_class`
- `intervention_components`
- `field_context`
- `stress_context`
- `target_outcome`
- `observed_response`
- `recommendation_signal`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- reduce the comparison to a generic ranking with no context
- merge review claims and field evidence without labeling the difference
- assume that one successful intervention class dominates every crop or soil state
- build a recommendation dashboard before the comparison logic is explicit

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first intervention comparison table
2. define a compact recommendation vocabulary
3. write a first field-facing comparison report
