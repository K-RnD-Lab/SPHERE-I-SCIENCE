# Ionizable Lipid Properties Predicting ApoE Enrichment in LNP Protein Corona for Blood-Brain Barrier Crossing in Glioblastoma

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## рџ”¬ Key Finding
> Near-neutral zeta potential (в€’5 to +5 mV) combined with ionizable lipid pKa 6.2вЂ“6.8 and PEG 1.5вЂ“2.5 mol% predicts ApoE corona enrichment >20% вЂ” the threshold associated with measurable BBB crossing in GBM models вЂ” and three novel ionizable lipid candidates (KOL-LNP-01/02/03) are proposed for experimental validation.

**Model performance:** LOO-CV RВІ = 0.542 (overall; dominated by lipid-type confound вЂ” within-group ionizable RВІ=в€’1.571), Pearson r = 0.780, MAE = 4.9% | **Dataset:** N = 22 (SIMULATED вЂ” literature-grounded ranges)

## рџ¤— Demo
[![Demo](https://img.shields.io/badge/рџ¤—-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## рџ“Љ Results Summary

| Metric | Value |
|--------|-------|
| Dataset size | N = 22 LNPs (SIMULATED) |
| Model | Ridge Regression, LOO-CV |
| LOO-CV RВІ (overall, N=22) | 0.542 (lipid-type confound) |
| LOO-CV RВІ (ionizable only, N=9) | в€’1.571 (no within-class predictive power) |
| Pearson r (overall) | 0.780 (p < 0.0001) |
| MAE | 4.9% ApoE |
| Ionizable LNP mean ApoE% | 24.7% В± 5.6% |
| Cationic LNP mean ApoE% | 8.2% В± 2.5% |
| Neutral LNP mean ApoE% | 13.6% В± 2.4% |
| Anionic LNP mean ApoE% | 4.6% В± 1.4% |
| BBB threshold (ApoE%) | >20% |
| KOL-LNP-01 model-predicted ApoE% вЂ  | 36.2% |
| KOL-LNP-02 model-predicted ApoE% вЂ  | 34.3% |
| KOL-LNP-03 model-predicted ApoE% вЂ  | 37.7% |
| Top predictive feature | pKa (near 6.2вЂ“6.8) |

вЂ  Extrapolation beyond training range (max 31.2%); treat as upper-bound estimates only.

## рџ“Ѓ Repository Structure

```
SPHERE-I-SCIENCE/
в”њв”Ђв”Ђ README.md
в”њв”Ђв”Ђ report.md                          # Full manuscript
в”њв”Ђв”Ђ execution_trace.ipynb              # Reproducible analysis notebook
в”њв”Ђв”Ђ data/
в”‚   в”њв”Ђв”Ђ apoe_corona_SIMULATED.csv      # N=22 LNP dataset (SIMULATED)
в”‚   в””в”Ђв”Ђ novel_candidates_SIMULATED.csv # 3 in silico lipid candidates
в””в”Ђв”Ђ figures/
    в”њв”Ђв”Ђ Figure1.png / Figure1.svg      # ApoE distribution by lipid type
    в”њв”Ђв”Ђ Figure2.png / Figure2.svg      # Correlation heatmap
    в”њв”Ђв”Ђ Figure3.png / Figure3.svg      # Bubble chart: zeta vs pKa
    в”њв”Ђв”Ђ Figure4.png / Figure4.svg      # LOO-CV model performance
    в””в”Ђв”Ђ Figure5.png / Figure5.svg      # Novel candidate profiles
```

## рџљЂ Quick Start

```bash
pip install rdkit pandas numpy matplotlib seaborn scikit-learn scipy pillow

# Run full analysis
jupyter notebook execution_trace.ipynb

# Or inspect results directly
python -c "import pandas as pd; print(pd.read_csv('data/apoe_corona_SIMULATED.csv').head())"
```

## вљ пёЏ Limitations

1. **SIMULATED dataset**: The N=22 ApoE corona dataset is simulated based on literature-reported ranges, not real experimental measurements. All filenames include `_SIMULATED` to make this explicit.
2. **Small N + lipid-type confound**: LOO-CV RВІ=0.542 is dominated by lipid type as a categorical confounder (ionizable vs cationic vs anionic groups). Within-group analysis on ionizable LNPs only (N=9) yields RВІ=в€’1.571 вЂ” the model has no real predictive power within the most relevant lipid class. The overall metric should not be interpreted as evidence of a genuine continuous structure-activity relationship.
3. **Model extrapolation**: All three novel candidates receive predicted ApoE% (34вЂ“38%) that exceed the training data maximum (31.2%). These are upper-bound estimates, not validated predictions.
4. **Heterogeneous measurement methods**: Literature ApoE corona quantification uses different proteomics platforms (LC-MS/MS, ELISA, nano-LC), making cross-study comparisons unreliable.
5. **pKa not computed by RDKit**: Target pKa values are design goals; actual pKa requires experimental measurement (TNS assay) or specialized software (e.g., DFT-based methods [Hamilton et al. 2024]).
6. **Descriptor gaps**: KOL-LNP-02 logP = 2.57 (target 2.8); KOL-LNP-03 TPSA = 55.8 Г…ВІ (target 78 Г…ВІ) вЂ” both require structural refinement.
7. **No in vivo validation**: All three proposed SMILES require synthesis, physicochemical characterization, and in vitro/in vivo BBB crossing assays before any GBM application claim.

## рџ“– Citation

```bibtex
@misc{kolisnyk2026apoe,
  title   = {Ionizable Lipid Properties Predicting ApoE Enrichment in LNP
             Protein Corona for Blood-Brain Barrier Crossing in Glioblastoma},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  month   = {March},
  note    = {K R\&D Lab В· Oksana Kolisnyk | kosatiks-group.pp.ua В· SIMULATED proof-of-concept study},
  url     = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  orcid   = {0009-0003-5780-2290}
}
```

