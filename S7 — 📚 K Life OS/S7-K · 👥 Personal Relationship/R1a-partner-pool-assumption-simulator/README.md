# R1a Partner Pool Assumption Simulator

## Question

How can K R&D Lab build a transparent, ethical alternative to viral "ideal partner" calculators using documented demographic assumptions instead of opaque hype?

## Registry Metadata

```yaml
primary_sphere: science
secondary_spheres:
  - technology
combo: S+T
artifact_type: research_tool
delivery_layers:
  - GitHub
  - Hugging Face
validation_stage: prototype
```

## Scope

This study belongs to `S7-K · Personal Relationship`. It models a rough reachable demographic pool from user-selected criteria such as age range, relationship status, region, height, education, and income.

The output is not a prediction of romantic success. It is an assumption simulator that shows how strongly each criterion narrows a population estimate.

## Why This Exists

Many public calculators use demographic framing as viral content without clear methodology. This study aims to make the same genre more useful by exposing:

- data sources
- model assumptions
- uncertainty ranges
- data-quality labels
- sensitivity to each criterion
- ethical caveats

## Current App

- [`app.py`](app.py) - Streamlit prototype
- [`src/model_pool.py`](src/model_pool.py) - deterministic demo model
- [`src/assumptions.py`](src/assumptions.py) - baseline assumptions and data-quality labels
- [`docs/methodology.md`](docs/methodology.md) - methodology notes
- [`data/sources.yml`](data/sources.yml) - candidate source registry

## Data Status

Current implementation uses demo assumptions. The next step is to replace demo coefficients with sourced population, marital-status, income, and anthropometric distributions.

## Ethics

This tool must not shame users, rank people, or imply that relationship outcomes can be reduced to demographic filters. Results should always be framed as approximate scenario modeling, not as a personal verdict.

## Status

Prototype scaffold ready for source validation and data replacement.
