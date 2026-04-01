# K R&D Lab — LNP Corona Research Projects

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua · ORCID: 0009-0003-5780-2290

[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## Projects in This Repository

Two complementary research projects on lipid nanoparticle (LNP) protein corona:

| Folder | Title | Key Result |
|--------|-------|------------|
| `project1_lnp_ml/` | ML Prediction of LNP Transfection Efficacy | XGBoost AUC = 0.791 (design target); CHL mol% top SHAP feature |
| `project2_autocorona/` | AutoCorona NLP Pipeline | F1 = 0.71 (protein_source); DB scaled 22 → 43 entries |

See each subfolder for individual `README.md`, `report.md`, `data/`, and `figures/`.

> ⚠️ **Data transparency:** All datasets in both projects are **SIMULATED** for demonstration purposes.
> Performance metrics are study design targets from the referenced real-data studies.
> All simulated files are labeled `_SIMULATED` in filenames and carry watermarks in figures.

## Quick Start

```bash
pip install -r requirements.txt
```

## Repository Structure

```
/
├── README.md                          ← This file
├── requirements.txt                   ← Shared dependencies
├── execution_trace.ipynb              ← Full computational record
├── project1_lnp_ml/
│   ├── README.md
│   ├── report.md
│   ├── data/                          ← LNPDB_SIMULATED.csv + model outputs
│   └── figures/                       ← Figure1–5 + FigureS1 (PNG + SVG)
└── project2_autocorona/
    ├── README.md
    ├── report.md
    ├── data/                          ← Gold standard, PMC corpus, extracted DB
    └── figures/                       ← Figure1–5 (PNG + SVG)
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
