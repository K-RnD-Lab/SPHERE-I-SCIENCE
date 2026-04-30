# S5-E-R1 Research Guide

## Research home

- Sphere: `S5`
- Lane: `S5-E Longitudinal Brain Risk Systems`
- Research line: `S5-E-R1 Longitudinal Brain Risk Panels`

## Why this is a strong next `S5` study

`S5-E-R1` turns `S5` from a snapshot-based neuroscience folder into a time-aware risk system. It is the correct companion to `S5-B-R1`.

## Core question

Which biomarker, imaging, cognitive, and trajectory signals can be organized into longitudinal brain-risk panels without overclaiming individual prediction?

## Practical substudies

### `S5-E-R1a` Time-Aware Risk Marker Sets

Goal:

- define marker sets that carry evidence for future cognitive or dementia risk

Focus:

- blood proteins
- brain-age measures
- epigenetic and proteomic clocks
- inflammatory and neurodegeneration markers

### `S5-E-R1b` Longitudinal Trajectory Comparison

Goal:

- compare risk signals across time-based trajectories

Focus:

- stable vs declining cognitive trajectories
- incident dementia prediction
- early warning vs diagnostic framing

## Why this matters now

Recent work increasingly frames brain-risk assessment through longitudinal cohorts, blood biomarkers, brain-age measures, and trajectory modeling. This makes `S5-E` one of the most practical research lanes in the sphere.

Useful references:

- plasma proteomic profiles predicting future dementia: https://www.nature.com/articles/s43587-023-00565-0
- organ-specific proteomic aging clocks and dementia risk: https://www.nature.com/articles/s43587-025-01016-8
- blood-based biomarkers and incident dementia: https://www.nature.com/articles/s41591-025-03605-x
- epigenetic clocks and brain health: https://www.nature.com/articles/s41582-025-01105-7
- NfL and longitudinal clinical decline in AD: https://pubmed.ncbi.nlm.nih.gov/41000329/
- group-based trajectory modeling for cognitive change: https://www.sciencedirect.com/science/article/pii/S1568163725002016

## Data classes to collect

For the first useful pass, prioritize:

- baseline biomarker values
- follow-up duration
- incident diagnosis or cognitive decline endpoint
- cognitive trajectory class
- imaging or brain-age markers
- confounder and population notes

## Required outputs

The first useful output should include:

- longitudinal risk evidence table
- marker time-horizon panel
- trajectory interpretation note
- risk-readiness summary

## GitHub role

GitHub should hold:

- longitudinal risk schema
- evidence table
- risk panel definitions
- figures
- report

## Hugging Face role

Hugging Face should hold:

- longitudinal risk explorer
- biomarker time-horizon view
- trajectory comparison dashboard

## Suggested first workflow

1. separate incident-risk studies from diagnostic studies
2. extract follow-up horizon and endpoint
3. classify marker type and readiness level
4. map each marker to a risk panel role
5. write a short longitudinal-risk interpretation

## Evidence fields to standardize

At minimum, track:

- `time_horizon`
- `risk_marker`
- `trajectory_or_endpoint`
- `panel_role`
- `evidence_source`
- `evidence_level`
- `interpretation_note`
- `limit_note`

## What not to do

Do not:

- confuse early risk with clinical diagnosis
- rank biomarkers without follow-up horizon
- ignore assay, population, and endpoint differences
- treat prediction studies as implementation-ready screening systems
