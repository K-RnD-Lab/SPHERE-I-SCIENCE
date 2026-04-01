# S1 Biomedical And Oncology

`S1` is the biomedical and translational oncology block inside `SPHERE-I-SCIENCE`.

## Active tracks

- `S1-A` PHYLO-GENOMICS
  Genomics, variant interpretation, and study-ready molecular context.
- `S1-B` PHYLO-RNA
  miRNA, siRNA, lncRNA, ASO-style logic, and nucleic-acid therapeutic hypotheses.
- `S1-C` PHYLO-DRUG
  Drug discovery and RNA-directed molecular design questions.
- `S1-D` PHYLO-LNP
  Lipid nanoparticle delivery, protein corona, transport, and BBB-facing questions.
- `S1-E` PHYLO-BIOMARKERS
  Biomarkers, diagnostics, and liquid-biopsy-facing computational work.
- `S1-F` PHYLO-RARE
  Rare, frontier, or underexplored oncology directions that do not fit cleanly elsewhere.

## Conference-Aligned Expertise

The current conference-style expertise aligns well with `S1`, but it works best as a positioning layer rather than a replacement taxonomy.

- `Nucleic-acid therapeutics: technologies and applications` -> `S1-B` and `S1-D`
- `Bioinformatics and AI in biomedical research` -> cross-cutting across all `S1` tracks, with reusable methods in `SPHERE-III`
- `Biomarkers and molecular diagnostics` -> `S1-E`
- `Other translational research` -> cross-cutting umbrella across `S1`, `E`, and `T`
- `Recombinant proteins and mAb development technologies` -> candidate future `S1-G`
- `Gene editing technologies and applications in medicine` -> candidate future `S1-H`
- `Advanced cell therapies` -> candidate future `S1-I`
- `Structural biology` -> candidate future `S1-J`, or part of `S1-C` when tied to design work

## Potential expansion tracks

These are useful future lanes, but they should be activated only if they become repeated study programs rather than one-off conference labels.

- `S1-G` Biologics & Antibody Engineering
- `S1-H` Gene Editing & Functional Therapeutics
- `S1-I` Cell Therapies & Translational Platforms
- `S1-J` Structural Biology & Molecular Design

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
