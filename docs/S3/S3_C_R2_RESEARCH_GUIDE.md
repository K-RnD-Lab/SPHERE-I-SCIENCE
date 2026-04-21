# S3-C-R2 Research Guide

## Research home

- Sphere: `S3`
- Lane: `S3-C Crop Stress & Yield Systems`
- Research line: `S3-C-R2 Recovery, Resilience, And Recurrent Stress Response`

## Why this is the right next `S3-C` study

`S3-C-R1` already established the first crop stress and support profiles.

The next missing question is more dynamic:

- which crops or genotypes recover after stress
- which signals separate resilience from simple survival
- how recurrent stress, rewatering, priming, and reproductive-stage sensitivity change yield outcomes

Without `S3-C-R2`, `S3-C` remains too static.

## Core question

How can crop resilience be interpreted through recovery, recurrent-stress response, and yield stability instead of only through one-time stress indicators?

## Practical substudies

### `S3-C-R2a` Recovery And Rewatering Profiles

Goal:

- identify which traits or response patterns best indicate useful post-stress recovery

Focus:

- rewatering response
- restored growth and transpiration
- biomass vs yield divergence
- recovery by genotype or crop type

### `S3-C-R2b` Priming, Recurrent Stress, And Yield Stability

Goal:

- understand when prior stress exposure or resilience design improves later crop performance

Focus:

- priming effects
- stress memory
- reproductive-stage resilience
- recurrent heat/drought response
- yield stability instead of only average yield

## Why this matters now

Climate-exposed crop systems increasingly face repeated and combined stresses rather than isolated stress events.

Useful references:

- recurrent combined heat and deficit irrigation stress memory in wheat:
  - https://www.sciencedirect.com/science/article/pii/S2667064X25004531
- drought priming-induced low temperature tolerance in wheat:
  - https://www.sciencedirect.com/science/article/pii/S2773126X25000115
- recovery, resilience, and yield after drought and rewatering in barley:
  - https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2024.1393991/full
- field vs controlled heat-stress response and compensatory strategies in barley:
  - https://www.sciencedirect.com/science/article/pii/S0098847224003964
- reproductive resilience under climate stress:
  - https://www.sciencedirect.com/science/article/pii/S2667064X24003579
- breeding improvements in maize drought resistance and yield stability:
  - https://www.nature.com/articles/s41467-025-64454-3
- plant priming as a broader resilience strategy:
  - https://www.sciencedirect.com/science/article/pii/S2352407325000241

## Data classes to collect

For the first pass, prioritize:

- crop or genotype context
- stress or recurrent-stress type
- timing of stress exposure
- recovery or priming condition
- resilience indicator
- yield stability or yield-compensation signal
- growth stage sensitivity
- adaptation or recovery logic
- evidence source

## Required outputs

The first useful output should include:

- normalized resilience evidence table
- recovery and priming signal panel
- yield-stability interpretation shortlist
- one concise report
- one or two figures

## GitHub role

GitHub should hold:

- resilience evidence schema
- source registry
- report skeleton
- preliminary findings
- future figures and comparison tables

## Hugging Face role

Hugging Face should hold:

- resilience profile explorer
- recovery and priming explainer
- yield-stability comparison viewer

## Suggested first workflow

1. collect strong sources on recovery, recurrent stress, and priming
2. normalize resilience indicators and yield outcomes
3. separate survival, recovery, and real yield resilience
4. compare genotype or crop-level adaptation patterns
5. draft a compact interpretation note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `crop_or_genotype_context`
- `stress_context`
- `recovery_or_priming_condition`
- `resilience_indicator`
- `yield_stability_signal`
- `growth_stage_context`
- `adaptation_logic`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- treat recovery as automatically equal to yield resilience
- assume priming helps equally in all crops and stages
- collapse genotype-specific findings into universal crop rules
- reduce resilience to a single physiological trait

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first resilience evidence table
2. define a compact recovery and priming vocabulary
3. draft the first yield-stability interpretation note
