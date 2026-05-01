# Structure Approval Gate

## Purpose

This file defines the checkpoint between:

- building the science structure
- executing real research

The repo should not keep expanding abstract planning files forever. Once a sphere has a usable execution layer, the next move is evidence work.

## What counts as structurally ready

A sphere or lane is ready for research execution when it has:

- stable lane name and code
- stable research question or module title
- source registry
- evidence schema
- report skeleton
- preliminary findings or working assumptions
- clear target location for the final output inside the real `S` folder

## Current structure status

### Ready for research execution

- `S2`: active starter packs exist, especially for plant stress, phytochemistry, translational bioactivity, and digital phenotyping lines.
- `S3`: active starter packs exist for soil biology, biofertilizers, field translation, and agronomic evidence lines.
- `S4`: active R1/R2 execution layer exists for biochemistry and metabolomics mechanism lines.
- `S5`: active R1/R2 execution layer exists for neuroscience, aging, cognition, and intervention interpretation lines.
- `S6-A`: active K-EcoLOGIC execution layer exists for SortSmart Ukraine, air, water, oversight, and radiation/environmental risk modules.

### Still needing controlled expansion

- `S6-C`, `S6-D`, and later environmental lanes can be expanded only after the K-EcoLOGIC root stays stable.
- `S7` is intentionally reserved for future K Life OS analysis and should not be mixed into S1-S6.

## Approval rule

Before actual research starts, confirm these points:

- the lane code is not likely to be renamed soon
- the topic belongs in this sphere rather than another SET sphere
- the study can be executed with real sources, datasets, or documented observations
- the output can become a readable `.md` report, not only a planning note
- the final report has a clear home in the top-level sphere folder

## Recommended first execution candidates

### 1. `S6-A-R1` SortSmart Ukraine

Best first choice if the goal is practical, visible output.

Why:

- the K-EcoLOGIC app already exists
- the module has a public-facing use case
- it can produce tables, figures, and practical recommendations faster than most biomedical topics

### 2. `S2-B-R1` Plant stress and adaptation

Best first choice if the goal is science-facing literature synthesis.

Why:

- plant stress research is broad but stable
- the topic can connect biology, climate pressure, and practical screening logic

### 3. `S3-B-R1` Biofertilizer evidence translation

Best first choice if the goal is applied agriculture and implementation.

Why:

- it can bridge lab evidence, field outcomes, and adoption logic
- it has practical value for researchers, growers, and product builders

### 4. `S5-E-R1` Aging and intervention interpretation

Best first choice if the goal is human-facing science communication.

Why:

- the topic is high-interest
- it needs careful evidence hierarchy and can become a useful public guide

## Execution workflow

For each chosen research line:

1. Start from the active guide in `docs/S*/`.
2. Fill the source registry with real sources.
3. Add real rows to the evidence schema.
4. Draft figures, tables, and evidence claims.
5. Write the report in Markdown.
6. Move or mirror the stable report into the corresponding top-level `S` folder.
7. Archive the planning-only draft if it no longer supports active work.

## Important rule for GPT-assisted research

GPT can help compile the report, but the repo should keep the evidence trail.

Every research output should still have:

- source list
- evidence table or schema
- claim-to-source mapping
- limitations
- next-step plan

Without those elements, the file is only a narrative draft, not a research artifact.
