# S6-A-R2 Research Guide

## Research home

- Sphere: `S6`
- Lane: `S6-A K-EcoLOGIC Lab`
- Research line: `S6-A-R2 Air & Exposure Intelligence`

## Why this study belongs here

`S6-A-R2` is the air and exposure context layer of `K-EcoLOGIC Lab`.

It should remain a supporting environmental-sentinel module rather than replacing the SortSmart flagship.

## Core question

How can open air-quality observations and permit context be translated into interpretable exposure signals without claiming medical diagnosis or real-time emergency authority?

## Practical substudies

### `S6-A-R2a` Air Quality Context Signals

Goal:

- summarize monthly and city-level air-quality context from open data

Focus:

- city snapshots
- monthly trends
- pollutant presence and observation coverage
- missingness and source limits

### `S6-A-R2b` Air And Permit Crosswalk Logic

Goal:

- connect air-quality context with emissions-permit records where available

Focus:

- location overlap
- permit-source context
- public-interest flags
- explicit coverage limits

## Useful local platform references

- dashboard page:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/S6-A-R1 - SortSmart Ukraine/R1a-sortsmart-ukraine/dashboard/pages/2_Air_Exposure.py`
- air transform:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/S6-A-R1 - SortSmart Ukraine/R1a-sortsmart-ukraine/src/sortsmart_ukraine/pipeline/transform_air_quality.py`
- permits page:
  - `S6 — 🌍 Ecology & Environmental Science/S6-A - K-EcoLOGIC Lab/S6-A-R1 - SortSmart Ukraine/R1a-sortsmart-ukraine/dashboard/pages/4_Polluters_Permits.py`

## Data classes to collect

- city or location
- month
- pollutant or indicator
- observation count
- latest value or summary metric
- permit overlap flag
- source dataset
- coverage note
- risk interpretation caveat

## Required outputs

- air context evidence table
- source registry
- report skeleton
- preliminary findings note
- later: city snapshot and monthly trend figures

## Claim discipline

At this stage we may say:

- air-quality data can support exposure-context interpretation
- permit crosswalks can add public-interest context
- coverage and missingness must be visible

At this stage we should not say:

- that this is a medical diagnosis tool
- that air module output proves exposure for a person
- that the current MVP is nationwide complete if the source coverage is partial
