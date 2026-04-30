# S6-A-R3 Source Registry

## Purpose

This file records the first evidence layer for:

- `S6-A-R3 Water Watch Ukraine`

It supports:

- basin-level monitoring summaries
- surface-water indicator context
- data coverage and gap interpretation

## Current source set

### 1. Surface-water monitoring package

Source:

- `data.gov.ua` package `surface-water-monitoring`

Why it matters:

- primary open-data source for Water Watch
- supports basin, post, and indicator-level monitoring summaries

### 2. Water monitoring transform

Source:

- `src/sortsmart_ukraine/pipeline/transform_water_monitoring.py`

Why it matters:

- implemented normalization path
- turns source records into platform-ready water-monitoring data

### 3. Normalized water observations

Source:

- `data/processed/normalized/water_monitoring_observations.csv`

Why it matters:

- reproducible local snapshot for evidence extraction
- contains basin, post, coordinate, date, and indicator fields

### 4. Water dashboard page

Source:

- `dashboard/pages/3_Water_Watch.py`

Why it matters:

- public-facing implementation of Water Watch
- shows current MVP interpretation surface

## Current stance

`S6-A-R3` should expose water-monitoring coverage and basin context before making any strong environmental condition claim.
