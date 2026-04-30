# S6-A-R1 Research Guide

## Research home

- Sphere: `S6`
- Lane: `S6-A K-EcoLOGIC Lab`
- Research line: `S6-A-R1 SortSmart Ukraine`

## Why this is the correct first S6 study

`S6-A-R1` is already the flagship implemented module inside `K-EcoLOGIC Lab`.

It should stay focused on waste, sorting, recovery potential, and environmental decision support for Ukraine.

This line is strong because it combines:

- official public environmental datasets
- data engineering and reproducible pipelines
- regional comparison logic
- modeled recovery and avoided-emissions assumptions
- a public Streamlit interface

## Core question

How much waste-management and sorting-readiness signal can be extracted from open Ukrainian environmental datasets, and where are the clearest gaps between waste generation, recovery, landfill disposal, and infrastructure?

## Practical substudies

### `S6-A-R1a` Regional Sorting Readiness Logic

Goal:

- compare Ukrainian regions by waste outcomes and infrastructure readiness

Focus:

- waste recovered
- waste sent to landfill
- incineration
- facility-count signals
- regional readiness ranking

### `S6-A-R1b` Material Recovery And Avoided CO2e Assumptions

Goal:

- make transparent, reviewable assumptions for material recovery and avoided emissions

Focus:

- material factors
- recyclable share assumptions
- avoided CO2e estimates
- sensitivity notes
- communication limits

## Useful local platform references

- lab app root:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/app.py`
- flagship implementation module:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/S6-A-R1 - SortSmart Ukraine/R1a-sortsmart-ukraine/`
- lab-level README:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/README.md`
- project status:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/PROJECT_STATUS.md`

## Data classes to collect

For the first research report, prioritize:

- region
- year
- recovered waste
- landfill-disposed waste
- incinerated waste
- facility counts
- material factor assumptions
- sorting-readiness score
- avoided-emissions estimate
- source file and dataset id

## Required outputs

- regional sorting-readiness evidence table
- source registry
- report skeleton
- preliminary findings note
- later: one figure pack from existing marts

## GitHub role

GitHub should hold:

- source registry
- evidence schema
- report and methods notes
- assumptions table
- reproducibility notes

## Hugging Face or Streamlit role

The public app should hold:

- regional dashboard
- material guidance
- public-facing summaries
- sorting assistant
- activist/request framing

## Suggested first workflow

1. preserve the existing app as the public platform
2. extract a research-grade evidence table from current marts
3. write the first SortSmart research note
4. add one figure pack later
5. only then mirror stable outputs into deeper S6 folders if needed

## Evidence fields to standardize

At minimum, track:

- `record_id`
- `region`
- `year`
- `signal_type`
- `metric`
- `value`
- `unit`
- `source_dataset`
- `processing_layer`
- `assumption_note`
- `confidence_level`
- `notes`

## What not to do

Do not:

- rename `S6-A-R1` away from `SortSmart Ukraine`
- treat modeled avoided CO2e as directly measured emissions
- hide assumptions behind a dashboard-only interface
- move lab-level architecture back into module-level READMEs

## Immediate next move

The cleanest next step is:

1. keep the current app structure stable
2. create `S6-A-R1` source registry and evidence schema
3. build the first report skeleton from the existing platform outputs
