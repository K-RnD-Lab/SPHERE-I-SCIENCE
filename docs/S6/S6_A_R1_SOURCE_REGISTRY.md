# S6-A-R1 Source Registry

## Purpose

This file records the first evidence layer for:

- `S6-A-R1 SortSmart Ukraine`

It supports:

- regional waste and sorting-readiness interpretation
- transparent recovery and avoided-emissions assumptions
- reproducible public-interest environmental reporting

## Current source set

### 1. Waste management outcomes by region

Source:

- `data.gov.ua` resource `186-obroblennia-vidkhodiv-po-regionakh.xlsx`
- resource id: `f50ed162-ec41-4fad-9091-ff8f603e1f45`

Why it matters:

- main regional waste-outcome source for SortSmart Ukraine
- supports recovery, disposal, and readiness comparisons

### 2. Waste-management facility registry

Source:

- `data.gov.ua` resource `Reestr_OUV_01-01-2023.ods`
- resource id: `a6d9eac6-f82e-4a76-a014-ca8b00aa74c4`

Why it matters:

- infrastructure-side source for facility presence and regional readiness
- helps prevent a waste-outcome-only interpretation

### 3. Material factor seed

Source:

- `dbt/seeds/material_factors.csv`

Why it matters:

- transparent assumptions for recyclable share and avoided CO2e
- keeps climate-impact estimates reviewable

### 4. Normalized processed data

Source:

- `data/processed/normalized`

Why it matters:

- local reproducible snapshot for review and hosted deployment
- supports research note generation without rerunning all ingestion steps

### 5. Mart outputs

Source:

- `data/processed/marts`

Why it matters:

- primary dashboard-facing analytical outputs
- useful for report figures and regional summaries

### 6. Streamlit public platform

Source:

- https://k-ecologic-lab.streamlit.app/

Why it matters:

- public delivery layer
- shows how the research data becomes a usable environmental-intelligence interface

## Current stance

`S6-A-R1` is both a data-engineering project and an environmental research line.

The research claim should stay transparent:

- official data supports regional comparison
- recovery and avoided-emissions estimates require explicit assumptions
- the app is a decision-support layer, not a regulatory authority
