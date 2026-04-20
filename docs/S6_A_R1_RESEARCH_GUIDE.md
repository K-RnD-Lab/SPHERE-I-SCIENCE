# S6-A-R1 Research Guide

## Research home

- Sphere: `S6`
- Lane: `S6-A Environmental Sentinel Systems`
- Research line: `S6-A-R1 Urban Air, Exposure, and Environmental Risk Signals`

## Why this is a strong first `S6` study

`S6-A-R1` is a strong first `S6` study because it:

- is publicly legible
- supports civic and scientific interpretation
- can use open environmental data
- fits the positioning of `K-EcoLOGIC Lab`

## Core question

How can open environmental monitoring data be translated into an interpretable exposure and environmental risk signal for ordinary people and public-interest analysis?

## Practical substudies

### `S6-A-R1a` Pollutant And Exposure Scoring Logic

Goal:

- build a practical scoring layer for pollutant and exposure signals

Focus:

- pollutant concentration
- temporal dynamics
- interpretable scoring

### `S6-A-R1b` Location-Based Risk Interpretation

Goal:

- translate monitoring data into location-aware public interpretation

Focus:

- region comparison
- time-based signal changes
- public-facing risk context

## Why this matters now

Environmental monitoring and sentinel-style surveillance are increasingly being framed as public-health and public-interest infrastructure.

Useful references:

- human sentinel surveillance framework for environmental health: https://www.frontiersin.org/articles/10.3389/fpubh.2025.1641884/full
- air monitoring priorities and data systems context: https://www.epa.gov/system/files/documents/2024-12/fy25-and-fy26-npm-guidance-monitoring-appendix-for-external-review-120324.pdf
- Earth observation and human health exposure applications: https://www.sciencedirect.com/science/article/abs/pii/S235293852500254X

## Data classes to collect

For the first pass, prioritize:

- air quality measurements
- pollutant concentration records
- weather context
- time and location metadata
- optional population or health context for interpretation

## Required outputs

The first useful output should include:

- cleaned exposure table
- scoring logic
- region or time comparison figures
- short report
- public-facing interpretation notes

## GitHub role

GitHub should hold:

- exposure schema
- scoring logic
- figures
- report
- methods note

## Hugging Face role

Hugging Face should hold:

- exposure explorer
- location-based lookup
- simple risk explanation interface

## Suggested first workflow

1. choose one region or city framing
2. collect one open air-quality dataset
3. clean and normalize the measurements
4. define the first scoring logic
5. write the first public-science report

## Evidence fields to standardize

At minimum, track:

- `location_id`
- `date`
- `pollutant`
- `concentration`
- `weather_context`
- `exposure_score`
- `risk_flag`
- `evidence_source`
- `confidence_level`
- `notes`

## What not to do

Do not:

- pretend this is a medical diagnosis layer
- turn the study into a generic dashboard with no scientific method note
- merge regulatory oversight and exposure scoring too early

## Immediate next move

If we continue from here, the cleanest next step is:

1. choose the first city or region
2. define the starter exposure schema
3. draft the first report skeleton
