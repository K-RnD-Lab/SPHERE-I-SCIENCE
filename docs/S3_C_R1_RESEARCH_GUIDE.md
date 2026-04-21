# S3-C-R1 Research Guide

## Research home

- Sphere: `S3`
- Lane: `S3-C Crop Stress & Yield Systems`
- Research line: `S3-C-R1 Crop Stress And Support Profiles`

## Why this is a strong next `S3` study

`S3-C-R1` is the right next line after `S3-B-R1` and `S3-D-R1` because it:

- gives `S3` a crop-context layer
- links stress signals directly to yield-relevant interpretation
- identifies support factors without collapsing into generic intervention advice
- creates a practical bridge between biological observation and field response logic

## Core question

How can crop stress signals be organized into interpretable profiles that connect drought, heat, salinity, and related pressures with support factors that matter for field resilience and yield protection?

## Practical substudies

### `S3-C-R1a` Field Stress Signal Panels

Goal:

- identify which stress indicators most consistently matter across field-relevant crop contexts

Focus:

- drought signals
- heat signals
- salinity signals
- visual, physiological, and yield-linked markers

### `S3-C-R1b` Support-Factor Ranking

Goal:

- rank which support factors appear repeatedly useful under stress contexts

Focus:

- root traits
- silicon and mineral support
- water and soil management
- stress detection and timing logic

## Why this matters now

Crop stress biology is becoming more interpretable and field-oriented. It is no longer enough to say that stress reduces yield; the stronger question is which signals matter, when they matter, and what kinds of support most plausibly protect yield.

Useful references:

- climate-resilient crops under drought, heat, and salinity:
  - https://www.mdpi.com/2223-7747/13/9/1238
- climate change impacts on crop yields:
  - https://www.nature.com/articles/s43017-023-00491-0
- responsive root traits in wheat under abiotic stress:
  - https://www.sciencedirect.com/science/article/pii/S1161030124003149
- crop stress detection review:
  - https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1638675/full
- crop-specific responses to salinity and drought from remote sensing:
  - https://www.sciencedirect.com/science/article/pii/S1569843223002625
- silicon and resilient crop production:
  - https://www.nature.com/articles/s44264-024-00035-z

## Data classes to collect

For the first pass, prioritize:

- crop context
- stress type
- stress indicators
- growth stage sensitivity
- yield or biomass effect
- support factor
- evidence source
- confidence level

## Required outputs

The first useful output should include:

- normalized crop-stress evidence table
- stress signal panel
- support-factor shortlist
- short interpretation report
- one or two figures

## GitHub role

GitHub should hold:

- crop-stress schema
- evidence table
- support-factor ranking logic
- report
- figures

## Hugging Face role

Hugging Face should hold:

- crop stress profile explorer
- support-factor lookup
- field risk explanation layer

## Suggested first workflow

1. choose a small set of field-relevant crops
2. collect high-value stress and resilience sources
3. normalize stress and support-factor fields
4. compare signal patterns
5. rank support factors by repeatability and plausibility
6. write a short field-facing interpretation note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `crop_context`
- `stress_type`
- `stress_signal`
- `growth_stage_context`
- `yield_or_biomass_effect`
- `support_factor`
- `support_logic`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- reduce the line to generic “stress hurts yield” claims
- merge plant-level and field-level evidence without labeling it
- treat all support factors as equally strong
- drift into purely technological sensing work without crop-interpretation logic

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first crop-stress evidence table
2. define a compact stress-signal vocabulary
3. draft the first support-factor report
