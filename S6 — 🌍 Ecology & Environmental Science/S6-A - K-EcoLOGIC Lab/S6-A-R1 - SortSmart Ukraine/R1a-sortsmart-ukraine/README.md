# R1a - SortSmart Ukraine Prototype

`R1a-sortsmart-ukraine` is the implementation module for `S6-A-R1 - SortSmart Ukraine`.

This folder is module-scoped. The broader `K-EcoLOGIC Lab` platform story lives in the lab root README, and the research-program framing lives one level above in the `S6-A-R1` README.

## Scope

- nationwide waste-metrics ingestion and normalization
- waste-facility registry joins
- sorting-readiness and recovery-gap outputs
- modeled avoided-CO2e layer for the flagship dashboard

## Public Surface

- public platform
  - `https://k-ecologic-lab.streamlit.app/`
- module page
  - `SortSmart Ukraine`

## Key Module Areas

- `src/`
  - ingestion, normalization, and analytical logic
- `dbt/`
  - warehouse validation layer
- `dashboard/`
  - module-facing visual outputs
- `data/`
  - processed snapshot used for review and deployment stability

## Local Entry Points

- `run_local.ps1`
  - runs the module locally
- `setup_bigquery.ps1`
  - restores the warehouse path when BigQuery objects need to be recreated

## Documentation Context

- lab overview
  - [../../README.md](../../README.md)
- parent research program
  - [../README.md](../README.md)
