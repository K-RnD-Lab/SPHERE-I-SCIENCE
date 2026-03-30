# S1 Biomedical And Oncology

`S1` is the main biomedical research block inside `SPHERE-I-SCIENCE`.

## Current tracks

- `S1-A` PHYLO-GENOMICS
- `S1-B` PHYLO-RNA
- `S1-C` PHYLO-DRUG
- `S1-D` PHYLO-LNP
- `S1-E` PHYLO-BIOMARKERS
- `S1-F` PHYLO-RARE

## App mapping

The current Hugging Face layer linked to `S1` is split by purpose:

| Space | Use in S1 |
| --- | --- |
| [Learning Playground](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026) | General interactive sandbox for RNA, siRNA, LNP, flow-corona, and variant-learning workflows |
| [Cancer Research Suite](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026) | Research-gap discovery, real-data exploration, and broader cancer research workflows |
| [PHYLO BRCA2 miRNA Demo](https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna) | Dedicated study demo for `S1-B-R1a` |

## Sync rule

- Research manuscripts, notebooks, and datasets live in this repo.
- App wrappers live in Hugging Face Spaces and are mirrored into [`../spaces/`](../spaces/).
- Before publishing a combined update, sync the current Space state with [`../tools/sync_hf_spaces.ps1`](../tools/sync_hf_spaces.ps1).

This split keeps `S1` readable in GitHub while still preserving the live interactive layer.
