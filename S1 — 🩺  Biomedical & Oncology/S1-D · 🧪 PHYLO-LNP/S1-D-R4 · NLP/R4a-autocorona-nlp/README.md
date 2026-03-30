# K R&D Lab вЂ” LNP Corona Research Projects

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua В· ORCID: 0009-0003-5780-2290

[![Demo](https://img.shields.io/badge/рџ¤—-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## Projects in This Repository

Two complementary research projects on lipid nanoparticle (LNP) protein corona:

| Folder | Title | Key Result |
|--------|-------|------------|
| `project1_lnp_ml/` | ML Prediction of LNP Transfection Efficacy | XGBoost AUC = 0.791 (design target); CHL mol% top SHAP feature |
| `project2_autocorona/` | AutoCorona NLP Pipeline | F1 = 0.71 (protein_source); DB scaled 22 в†’ 43 entries |

See each subfolder for individual `README.md`, `report.md`, `data/`, and `figures/`.

> вљ пёЏ **Data transparency:** All datasets in both projects are **SIMULATED** for demonstration purposes.
> Performance metrics are study design targets from the referenced real-data studies.
> All simulated files are labeled `_SIMULATED` in filenames and carry watermarks in figures.

## Quick Start

```bash
pip install -r requirements.txt
```

## Repository Structure

```
/
в”њв”Ђв”Ђ README.md                          в†ђ This file
в”њв”Ђв”Ђ requirements.txt                   в†ђ Shared dependencies
в”њв”Ђв”Ђ execution_trace.ipynb              в†ђ Full computational record
в”њв”Ђв”Ђ project1_lnp_ml/
в”‚   в”њв”Ђв”Ђ README.md
в”‚   в”њв”Ђв”Ђ report.md
в”‚   в”њв”Ђв”Ђ data/                          в†ђ LNPDB_SIMULATED.csv + model outputs
в”‚   в””в”Ђв”Ђ figures/                       в†ђ Figure1вЂ“5 + FigureS1 (PNG + SVG)
в””в”Ђв”Ђ project2_autocorona/
    в”њв”Ђв”Ђ README.md
    в”њв”Ђв”Ђ report.md
    в”њв”Ђв”Ђ data/                          в†ђ Gold standard, PMC corpus, extracted DB
    в””в”Ђв”Ђ figures/                       в†ђ Figure1вЂ“5 (PNG + SVG)
```

## Citation

```bibtex
@misc{kolisnyk2026lnpcorona,
  title   = {K R\&D Lab: LNP Corona Research Projects},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  url     = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  note    = {kosatiks-group.pp.ua. ORCID: 0009-0003-5780-2290}
}
```

