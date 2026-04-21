# S3-A-R2 Research Guide

## Research home

- Sphere: `S3`
- Lane: `S3-A Soil & Rhizosphere Microbiomes`
- Research line: `S3-A-R2 Soil Microbiome State Classification`

## Why this is the right next `S3` study

`S3-A-R2` is the right next line after `S3-B-R1`, `S3-D-R1`, `S3-C-R1`, and `S3-E-R1` because it:

- completes the core soil-microbiome interpretation layer
- gives `S3` a stronger scientific backbone
- connects microbiome state logic to management, stress, and response prediction
- prevents the sphere from leaning only on interventions without enough ecological interpretation

## Core question

How can soil and rhizosphere microbiomes be classified into interpretable “healthier,” “stressed,” or “response-sensitive” states without pretending that one universal microbiome signature applies across all crops and management systems?

## Practical substudies

### `S3-A-R2a` Healthy vs Stressed Soil-State Logic

Goal:

- define which microbiome patterns most plausibly distinguish more supportive from more stressed soil states

Focus:

- diversity and network structure
- beneficial versus risk-associated taxa
- management-linked shifts
- stress-linked functional tendencies

### `S3-A-R2b` Crop-Context Microbiome Comparison Panels

Goal:

- compare how microbiome state interpretation changes across crop and management contexts

Focus:

- crop-specific context
- soil management regime
- inoculation-response sensitivity
- limited cross-system generalizability

## Why this matters now

Recent work is moving toward predictive and management-aware microbiome interpretation, but it also shows that “healthy soil microbiome” indicators often fail to generalize cleanly across systems.

Useful references:

- soil microbiome indicators predict crop growth response to AMF:
  - https://www.nature.com/articles/s41564-023-01520-w
- agricultural practices shape soil microbiome assembly:
  - https://www.nature.com/articles/s42003-024-07059-8
- sustainable soil management and crop defense via microbiome changes:
  - https://www.nature.com/articles/s44264-025-00109-6
- indicators of healthy rhizosphere soils show limited cross-system generalizability:
  - https://www.sciencedirect.com/science/article/pii/S092913932500575X
- rhizosphere microbiomes altered by stresses and agronomic practices:
  - https://www.sciencedirect.com/science/article/pii/S2667064X25003306
- soil microbial indicators for routine tests in arable systems:
  - https://www.sciencedirect.com/science/article/pii/S1470160X24011634

## Data classes to collect

For the first pass, prioritize:

- crop context
- soil management context
- stress or disease state
- microbiome indicator or feature
- indicator direction
- predicted or observed support signal
- predicted or observed risk signal
- evidence source
- confidence level

## Required outputs

The first useful output should include:

- normalized microbiome-state evidence table
- support-vs-risk indicator panel
- crop-context comparison matrix
- short interpretation report
- one or two figures

## GitHub role

GitHub should hold:

- microbiome-state schema
- evidence table
- state-classification logic
- report
- figures

## Hugging Face role

Hugging Face should hold:

- soil state explorer
- crop-context microbiome comparison viewer
- support-vs-risk explanation layer

## Suggested first workflow

1. collect high-value review and comparative sources
2. normalize crop, management, and state labels
3. define support, stress, and response-sensitive classes
4. compare which indicators recur and which fail to generalize
5. write a short interpretation note
6. convert the strongest findings into a compact classification panel

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `crop_context`
- `management_context`
- `state_label`
- `microbiome_indicator`
- `indicator_direction`
- `support_signal`
- `risk_signal`
- `generalizability_note`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- reduce microbiome states to one diversity metric
- claim universal “healthy microbiome” signatures across all systems
- collapse predictive response logic and post hoc classification into one bucket
- build decision dashboards before the classification vocabulary is explicit

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first microbiome-state evidence table
2. define the support vs stress vocabulary
3. draft the first comparison report
