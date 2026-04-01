# SPHERE-I-SCIENCE

[![GitHub](https://img.shields.io/badge/GitHub-K--RnD--Lab%2FSPHERE--I--SCIENCE-black)](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
[![HF Learning Playground](https://img.shields.io/badge/HF-Learning_Playground-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)
[![HF Cancer Research Suite](https://img.shields.io/badge/HF-Cancer_Research_Suite-blue)](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Computational science research suite for K R&D Lab. This repository is the source of truth for study structure, reports, notebooks, and supporting datasets. Hugging Face Spaces provide the interactive app layer and are mirrored into [`spaces/`](spaces/).

## Scope

`SPHERE-I-SCIENCE` keeps scientific questions grouped by domain while leaving reusable tooling, scoring systems, and dashboards to `SPHERE-III-TECHNOLOGY`.

## Science Map

- `S1` Biomedical & Oncology
  Computational oncology, RNA therapeutics, delivery systems, biomarkers, and rare-cancer hypotheses.
- `S2` Plant Science & Phytochemistry
  Plant-intrinsic biology: phytochemicals, plant metabolites, bioactive compounds, and plant molecular traits.
- `S3` Agricultural Biology & Biofertilizers
  Applied agro-biology: soil, rhizosphere, biofertilizers, crop-growth systems, and intervention logic.
- `S4` Biochemistry & Metabolomics
  Cross-organism biochemical mechanisms, pathway logic, and metabolomic signatures.
- `S5` Neuroscience & Aging
  Neurobiology, cognition, neuroinflammation, aging, and computational vulnerability patterns.
- `S6` Ecology & Environmental Science
  Ecosystems, biodiversity, environmental communities, and climate/pollution-linked system effects.

Track-level notes currently live in [`S1 — 🩺  Biomedical & Oncology/README.md`](S1%20%E2%80%94%20%F0%9F%A9%BA%20%20Biomedical%20%26%20Oncology/README.md), and `S2-S6` now include starter README files to keep their boundaries clear before more studies are added.

## Conference-Aligned Expertise

The current conference-style expertise map is best treated as an overlay on top of the existing `S1` structure rather than a replacement for it.

| Conference area | Current home in the lab |
| --- | --- |
| Nucleic-acid therapeutics: technologies and applications | `S1-B` PHYLO-RNA and `S1-D` PHYLO-LNP |
| Recombinant proteins and mAb development technologies | Future `S1-G` if it becomes a repeated line of work |
| Gene editing technologies and applications in medicine | Future `S1-H` if it becomes a repeated line of work |
| Advanced cell therapies | Future `S1-I` if it becomes a repeated line of work |
| Bioinformatics and AI in biomedical research | Cross-cutting method layer across `S1` and `SPHERE-III` |
| Biomarkers and molecular diagnostics | `S1-E` PHYLO-BIOMARKERS |
| Other translational research | Cross-cutting umbrella across `S1`, `E`, and `T` |
| Structural biology | Future `S1-J`, or part of `S1-C` when tied to molecular design |

Potential future `S1` expansion tracks, only if they grow into repeated study series:

- `S1-G` Biologics & Antibody Engineering
- `S1-H` Gene Editing & Functional Therapeutics
- `S1-I` Cell Therapies & Translational Platforms
- `S1-J` Structural Biology & Molecular Design

## Example Directions Outside S1

- `S2`: phytochemical atlas, compound-target prioritization, plant stress-response signatures
- `S3`: rhizosphere microbiome scoring, biofertilizer efficacy modeling, soil-health predictors
- `S4`: metabolite signature classifier, pathway perturbation maps, enzyme/substrate inference
- `S5`: neuroinflammation biomarker panels, cognitive aging predictors, vulnerability scoring
- `S6`: environmental microbiome sentinels, biodiversity stress markers, pollutant-response networks

## Source Of Truth

- GitHub repo: research structure, manuscripts, notebooks, data snapshots
- Hugging Face Spaces: interactive demos and app wrappers
- Local `spaces/` directory: mirrored copies of the current HF app layer for audit and sync

## Interactive Spaces

The current live app environment is split across these Spaces:

| Space | Purpose | Local mirror |
| --- | --- | --- |
| [Learning Playground](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026) | Interactive sandbox for miRNA, siRNA, LNP, flow-corona, and variant-learning tabs | `spaces/learning-playground` |
| [Cancer Research Suite](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026) | Live research-gap exploration, real-data lookups, and research assistant workflows | `spaces/cancer-research-suite` |
| [PHYLO BRCA2 miRNA Demo](https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna) | Dedicated BRCA2 miRNA study demo | `spaces/phylo-brca2-mirna` |

More detail is documented in [`spaces/README.md`](spaces/README.md) and [`docs/hf-space-sync.md`](docs/hf-space-sync.md).

## Repository Layout

```text
SPHERE-I-SCIENCE/
|-- S1 — Biomedical & Oncology/
|-- S2 — Plant Science & Phytochemistry/
|-- S3 — Agricultural Biology & Biofertilizers/
|-- S4 — Biochemistry & Metabolomics/
|-- S5 — Neuroscience & Aging/
|-- S6 — Ecology & Environmental Science/
|-- spaces/
|   |-- learning-playground/
|   |-- cancer-research-suite/
|   `-- phylo-brca2-mirna/
|-- docs/
|   `-- hf-space-sync.md
`-- tools/
    `-- sync_hf_spaces.ps1
```

## Sync Workflow

When the app layer changes in Hugging Face, refresh the local mirrors with:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\sync_hf_spaces.ps1
```

Recommended workflow:

1. Update research assets in GitHub.
2. Update app/runtime wrappers in the relevant Hugging Face Space.
3. Run the sync script to mirror the current Space state into `spaces/`.
4. Commit both the research edits and the refreshed mirrors when they should move together.

## Citation

If you cite the repository, use the project-level metadata in [`CITATION.cff`](CITATION.cff).

## Disclaimer

This repository contains research-grade and educational materials. Some studies explicitly use simulated data and are labeled as such. Do not interpret simulated outputs as experimental or clinical findings.
