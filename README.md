# SPHERE-I-SCIENCE

[![GitHub](https://img.shields.io/badge/GitHub-K--RnD--Lab%2FSPHERE--I--SCIENCE-black)](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
[![HF Learning Playground](https://img.shields.io/badge/HF-Learning_Playground-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)
[![HF Cancer Research Suite](https://img.shields.io/badge/HF-Cancer_Research_Suite-blue)](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Computational biology research suite for K R&D Lab. This repository is the source of truth for study structure, reports, notebooks, and supporting datasets. Hugging Face Spaces provide the interactive app layer and are mirrored into [`spaces/`](spaces/).

## Scope

Current focus inside `SPHERE-I-SCIENCE`:

- `S1` Biomedical and Oncology research
- RNA therapeutics and synthetic lethality
- variant interpretation and biomarker workflows
- lipid nanoparticle delivery and protein corona studies
- rare and underexplored oncology directions

The repo currently includes complete studies, in-progress studies, and mirrored runtime apps.

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

## Research Map

`S1` is currently organized into these tracks:

- `S1-A` PHYLO-GENOMICS
- `S1-B` PHYLO-RNA
- `S1-C` PHYLO-DRUG
- `S1-D` PHYLO-LNP
- `S1-E` PHYLO-BIOMARKERS
- `S1-F` PHYLO-RARE

Track-level notes and the current app mapping live in [`S1 — 🩺  Biomedical & Oncology/README.md`](S1%20%E2%80%94%20%F0%9F%A9%BA%20%20Biomedical%20%26%20Oncology/README.md).

## Repository Layout

```text
SPHERE-I-SCIENCE/
|-- S1 — Biomedical & Oncology/
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
