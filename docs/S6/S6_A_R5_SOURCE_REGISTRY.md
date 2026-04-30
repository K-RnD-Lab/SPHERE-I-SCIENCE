# S6-A-R5 Source Registry

## Purpose

This file records the first evidence layer for:

- `S6-A-R5 Radiation and Environmental Risk`

It supports:

- monitoring-network coverage summaries
- radiation station metadata interpretation
- indicator-source caveats

## Current source set

### 1. Radiation monitoring stations and indicator dictionary

Source:

- `data.gov.ua` dataset `80c116f5-9826-4e8e-87f8-ff5d5342da94`

Why it matters:

- primary source for the radiation MVP
- includes nationwide monitoring-station and indicator context collected by SaveEcoBot / SaveDnipro

### 2. Radiation transform

Source:

- `src/sortsmart_ukraine/pipeline/transform_radiation.py`

Why it matters:

- implemented normalization path
- turns source metadata into platform-ready station and indicator layers

### 3. Radiation normalized data

Source:

- `data/processed/normalized/radiation_locations.csv`
- `data/processed/normalized/radiation_indicators.csv`

Why it matters:

- local reproducible snapshot for station and indicator review
- useful for region-level coverage tables

### 4. Radiation dashboard page

Source:

- `dashboard/pages/5_Radiation_Risk.py`

Why it matters:

- public-facing implementation of radiation-network coverage
- helps keep emergency-risk caveats visible

## Current stance

`S6-A-R5` should be treated as monitoring-network visibility.

It is not a real-time emergency-warning or safety-certification module.
