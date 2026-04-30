# S6-A-R4 Source Registry

## Purpose

This file records the first evidence layer for:

- `S6-A-R4 Polluters, Permits, and Environmental Oversight`

It supports:

- permit-record summaries
- public-interest oversight context
- air-permit crosswalk interpretation

## Current source set

### 1. Open permits list

Source:

- `data.gov.ua` dataset `110ba5fd-42e3-43f8-80f3-e640514c1c76`

Why it matters:

- primary source for permit-context MVP
- currently treated as regional pilot coverage, not full nationwide proof

### 2. Permits transform

Source:

- `src/sortsmart_ukraine/pipeline/transform_permits.py`

Why it matters:

- implemented normalization path
- turns source records into platform-ready permit summaries

### 3. Permits dashboard page

Source:

- `dashboard/pages/4_Polluters_Permits.py`

Why it matters:

- public-facing implementation of permit-context view
- useful for reviewing how oversight data is framed

### 4. Air-permit crosswalk

Source:

- `air_permit_crosswalk`

Why it matters:

- connects permit context with air-quality module
- must remain contextual, not causal

## Current stance

`S6-A-R4` should support transparent public-interest review and follow-up questions.

It should not accuse, certify, or enforce.
