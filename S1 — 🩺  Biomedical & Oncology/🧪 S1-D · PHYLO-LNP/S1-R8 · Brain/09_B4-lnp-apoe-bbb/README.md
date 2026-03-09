# Ionizable Lipid Properties Predicting ApoE Enrichment in LNP Protein Corona for Blood-Brain Barrier Crossing in Glioblastoma

> Part of [K R&D Lab](https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## 🔬 Key Finding
> Near-neutral zeta potential (−5 to +5 mV) combined with ionizable lipid pKa 6.2–6.8 and PEG 1.5–2.5 mol% predicts ApoE corona enrichment >20% — the threshold associated with measurable BBB crossing in GBM models — and three novel ionizable lipid candidates (KOL-LNP-01/02/03) are proposed for experimental validation.

**Model performance:** LOO-CV R² = 0.542 (overall; dominated by lipid-type confound — within-group ionizable R²=−1.571), Pearson r = 0.780, MAE = 4.9% | **Dataset:** N = 22 (SIMULATED — literature-grounded ranges)

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)

## 📊 Results Summary

| Metric | Value |
|--------|-------|
| Dataset size | N = 22 LNPs (SIMULATED) |
| Model | Ridge Regression, LOO-CV |
| LOO-CV R² (overall, N=22) | 0.542 (lipid-type confound) |
| LOO-CV R² (ionizable only, N=9) | −1.571 (no within-class predictive power) |
| Pearson r (overall) | 0.780 (p < 0.0001) |
| MAE | 4.9% ApoE |
| Ionizable LNP mean ApoE% | 24.7% ± 5.6% |
| Cationic LNP mean ApoE% | 8.2% ± 2.5% |
| Neutral LNP mean ApoE% | 13.6% ± 2.4% |
| Anionic LNP mean ApoE% | 4.6% ± 1.4% |
| BBB threshold (ApoE%) | >20% |
| KOL-LNP-01 model-predicted ApoE% † | 36.2% |
| KOL-LNP-02 model-predicted ApoE% † | 34.3% |
| KOL-LNP-03 model-predicted ApoE% † | 37.7% |
| Top predictive feature | pKa (near 6.2–6.8) |

† Extrapolation beyond training range (max 31.2%); treat as upper-bound estimates only.

## 📁 Repository Structure

```
K-RnD-Lab-PHYLO-03_2026/
├── README.md
├── report.md                          # Full manuscript
├── execution_trace.ipynb              # Reproducible analysis notebook
├── data/
│   ├── apoe_corona_SIMULATED.csv      # N=22 LNP dataset (SIMULATED)
│   └── novel_candidates_SIMULATED.csv # 3 in silico lipid candidates
└── figures/
    ├── Figure1.png / Figure1.svg      # ApoE distribution by lipid type
    ├── Figure2.png / Figure2.svg      # Correlation heatmap
    ├── Figure3.png / Figure3.svg      # Bubble chart: zeta vs pKa
    ├── Figure4.png / Figure4.svg      # LOO-CV model performance
    └── Figure5.png / Figure5.svg      # Novel candidate profiles
```

## 🚀 Quick Start

```bash
pip install rdkit pandas numpy matplotlib seaborn scikit-learn scipy pillow

# Run full analysis
jupyter notebook execution_trace.ipynb

# Or inspect results directly
python -c "import pandas as pd; print(pd.read_csv('data/apoe_corona_SIMULATED.csv').head())"
```

## ⚠️ Limitations

1. **SIMULATED dataset**: The N=22 ApoE corona dataset is simulated based on literature-reported ranges, not real experimental measurements. All filenames include `_SIMULATED` to make this explicit.
2. **Small N + lipid-type confound**: LOO-CV R²=0.542 is dominated by lipid type as a categorical confounder (ionizable vs cationic vs anionic groups). Within-group analysis on ionizable LNPs only (N=9) yields R²=−1.571 — the model has no real predictive power within the most relevant lipid class. The overall metric should not be interpreted as evidence of a genuine continuous structure-activity relationship.
3. **Model extrapolation**: All three novel candidates receive predicted ApoE% (34–38%) that exceed the training data maximum (31.2%). These are upper-bound estimates, not validated predictions.
4. **Heterogeneous measurement methods**: Literature ApoE corona quantification uses different proteomics platforms (LC-MS/MS, ELISA, nano-LC), making cross-study comparisons unreliable.
5. **pKa not computed by RDKit**: Target pKa values are design goals; actual pKa requires experimental measurement (TNS assay) or specialized software (e.g., DFT-based methods [Hamilton et al. 2024]).
6. **Descriptor gaps**: KOL-LNP-02 logP = 2.57 (target 2.8); KOL-LNP-03 TPSA = 55.8 Å² (target 78 Å²) — both require structural refinement.
7. **No in vivo validation**: All three proposed SMILES require synthesis, physicochemical characterization, and in vitro/in vivo BBB crossing assays before any GBM application claim.

## 📖 Citation

```bibtex
@misc{kolisnyk2026apoe,
  title   = {Ionizable Lipid Properties Predicting ApoE Enrichment in LNP
             Protein Corona for Blood-Brain Barrier Crossing in Glioblastoma},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  month   = {March},
  note    = {K R\&D Lab · Oksana Kolisnyk | kosatiks-group.pp.ua · SIMULATED proof-of-concept study},
  url     = {https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026},
  orcid   = {0009-0003-5780-2290}
}
```
