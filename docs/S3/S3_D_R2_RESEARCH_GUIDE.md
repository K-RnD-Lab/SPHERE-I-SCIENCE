# S3-D-R2 Research Guide

## Research home

- Sphere: `S3`
- Lane: `S3-D Agro-Intervention Analytics`
- Research line: `S3-D-R2 Intervention Portfolios, Scaling, And Context Transfer`

## Why this is the right next `S3-D` study

`S3-D-R1` already established how to compare intervention classes.

The next missing question is system-level:

- how to combine intervention classes into realistic portfolios
- how to move from local success to wider scaling without overclaiming
- how to detect where context transfer breaks down

Without `S3-D-R2`, `S3-D` remains a comparison layer with no scaling logic.

## Core question

How can agricultural interventions be organized into context-aware portfolios that support responsible scaling, combination logic, and realistic transfer across sites and farming systems?

## Practical substudies

### `S3-D-R2a` Portfolio Combination Logic

Goal:

- identify when mixed intervention portfolios are stronger than one-input logic

Focus:

- biological plus organic plus mineral combinations
- advisory plus intervention coupling
- crop-mixture or management-combination context
- sequence and complementarity of intervention classes

### `S3-D-R2b` Scaling And Context-Transfer Limits

Goal:

- explain when successful local interventions stop transferring well across sites, seasons, and organizational settings

Focus:

- local adaptation vs overgeneralization
- partner and delivery structure
- scaling friction
- responsible scaling instead of naive diffusion

## Why this matters now

Agricultural innovation is increasingly judged not only by whether something works once, but by whether it scales responsibly across contexts without losing fit or creating hidden failure modes.

Useful references:

- integrated nutrient management as combination logic:
  - https://www.frontiersin.org/journals/plant-science/articles/10.3389/fagro.2024.1422876/full
- scaling landscape-based fertilizer advisory in Ethiopia:
  - https://www.sciencedirect.com/science/article/pii/S2666188825007300
- responsible scaling with the Rapid Scaling Tool:
  - https://www.sciencedirect.com/science/article/pii/S0743016725001299
- intercropping plus biofertilizer effects depend on crop mixture and arrangement:
  - https://www.frontiersin.org/articles/10.3389/fagro.2025.1562589/full
- broader biofertilizer state-of-the-art including agronomic, legal, and economic framing:
  - https://www.mdpi.com/2311-7524/9/12/1306
- personalized context-aware systems for sustainable agriculture:
  - https://www.sciencedirect.com/science/article/pii/S0747563224002437

## Data classes to collect

For the first pass, prioritize:

- intervention portfolio or combination type
- site or farming-system context
- transfer or scaling context
- success condition
- failure or friction signal
- portfolio logic
- adaptation requirement
- governance or delivery requirement
- evidence source

## Required outputs

The first useful output should include:

- normalized intervention-portfolio table
- scaling and transfer-risk matrix
- shortlist of stronger portfolio patterns
- one concise report
- one or two overview figures

## GitHub role

GitHub should hold:

- portfolio comparison schema
- source registry
- scaling-risk logic
- report
- future portfolio decision diagrams

## Hugging Face role

Hugging Face should hold:

- intervention portfolio explorer
- scaling-risk explainer
- context-transfer decision viewer

## Suggested first workflow

1. collect sources on integrated interventions and scaling practice
2. normalize portfolio types and transfer conditions
3. identify repeated success and friction patterns
4. separate local-fit logic from broad-scaling logic
5. write a short portfolio-and-scaling interpretation note

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `portfolio_or_combination_type`
- `site_or_farming_context`
- `scaling_or_transfer_context`
- `success_condition`
- `friction_or_failure_signal`
- `portfolio_logic`
- `adaptation_requirement`
- `governance_or_delivery_signal`
- `evidence_source`
- `evidence_type`
- `evidence_level`
- `priority_score`
- `notes`

## What not to do

Do not:

- treat portfolio complexity as automatically better
- assume local success proves broad scalability
- collapse governance and delivery constraints into a purely biological comparison
- frame scaling as simple replication

## Immediate next move

If we continue from here, the cleanest next step is:

1. build the first portfolio and scaling evidence table
2. define a compact transfer-risk vocabulary
3. draft the first responsible-scaling interpretation note
