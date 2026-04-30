# S6-A-R2 Source Registry

## Purpose

This file records the first evidence layer for:

- `S6-A-R2 Air & Exposure Intelligence`

It supports:

- air-quality context interpretation
- city and monthly trend summaries
- air-permit crosswalk logic

## Current source set

### 1. Air-quality observations package

Source:

- `data.gov.ua` package `0e9e5b53-e94a-467f-a868-c245a9662b38`

Why it matters:

- primary open-data source for air-quality context in the platform
- supports monthly trends and city snapshots

### 2. Air-quality transform

Source:

- `src/sortsmart_ukraine/pipeline/transform_air_quality.py`

Why it matters:

- implemented normalization path
- converts source data into dashboard-ready context layers

### 3. Air dashboard page

Source:

- `dashboard/pages/2_Air_Exposure.py`

Why it matters:

- public-facing implementation of the air context module
- shows what the current MVP can and cannot display

### 4. Permits registry

Source:

- `data.gov.ua` dataset `110ba5fd-42e3-43f8-80f3-e640514c1c76`

Why it matters:

- supports air-permit context where coverage exists
- useful for public-interest environmental interpretation

### 5. Air-permit crosswalk output

Source:

- `air_permit_crosswalk`

Why it matters:

- connects air context with permit records
- should be treated as a context layer, not proof of causation

### 6. Streamlit public platform

Source:

- https://k-ecologic-lab.streamlit.app/

Why it matters:

- public delivery layer for the air module
- supports review of how the research layer appears to users

## Current stance

`S6-A-R2` is an exposure-context module.

It should make source coverage and interpretation limits visible before any strong public-health or regulatory claim.
