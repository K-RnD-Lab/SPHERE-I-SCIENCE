# Protein Corona Fingerprinting of Lipid Nanoparticles as a Liquid Biopsy Biomarker: Distinguishing Cancer Patients from Healthy Individuals Using Machine Learning

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## 🔬 Key Finding
> CTHRC1, FHL2, and LDHA form a 3-protein pan-cancer signature detectable in tissue proteomics (AUC=0.993); these proteins are strong candidates for plasma LNP corona enrichment studies — but experimental plasma validation is required before clinical translation. Note: FHL2 is not classically secreted; plasma detectability requires exosome-enrichment validation.

**Model performance:** RF GroupKFold AUC = 0.993 ± 0.005 (tissue-level only) | **Dataset:** N = 576 samples × 8,843 proteins (SIMULATED — based on CPTAC statistics)

> ⚠️ **Critical Caveat:** AUC=0.992 reflects **tumor vs adjacent-normal TISSUE proteomics**, NOT plasma-level corona screening. Real plasma LNP corona would realistically yield AUC ~0.75–0.90. All synthetic corona data is labeled **SYNTHETIC** throughout. No public LNP corona LC-MS/MS dataset (cancer vs healthy plasma) currently exists.

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## 📊 Results Summary
| Metric | Value |
|--------|-------|
| RF GroupKFold AUC | 0.993 ± 0.005 |
| SVM AUC | 0.983 |
| Logistic Regression AUC | 0.990 |
| RFECV biomarker panel | 30 proteins |
| Top pan-cancer marker | CTHRC1 (log₂FC = +3.8) |
| 2nd marker | LDHA (log₂FC = +3.9) |
| 3rd marker | FHL2 (log₂FC = +4.5) |
| Dataset | N=576 × 8,843 proteins (SIMULATED) |
| Cancer types | PDAC, BRCA, LUAD |
| Realistic plasma AUC target | 0.75–0.90 (not yet validated) |

## 📁 Repository Structure
```
project2_corona_biopsy/
├── README.md
├── report.md
├── data/
│   ├── SIMULATED_cptac_metadata.csv          # Sample metadata (N=576)
│   ├── SIMULATED_cptac_expression_subset.csv # Expression subset (220 proteins)
│   ├── SIMULATED_protein_list.csv            # Full protein list (8,843)
│   ├── SIMULATED_rf_feature_importances.csv  # RF feature importances
│   ├── SIMULATED_biomarker_panel.csv         # Top 20 biomarkers with FC + ELISA
│   └── SYNTHETIC_lnp_corona_dataset.csv      # Synthetic LNP corona (N=80)
└── figures/
    ├── Figure1.png / Figure1.svg             # Dataset overview
    ├── Figure2.png / Figure2.svg             # PCA + hierarchical clustering
    ├── Figure3.png / Figure3.svg             # Volcano plots (3 comparisons)
    ├── Figure4.png / Figure4.svg             # ROC curves + confusion matrix
    ├── Figure5.png / Figure5.svg             # Biomarker dot plot (top 20)
    └── Figure6.png / Figure6.svg             # Experimental roadmap (PROPOSED)
```

## 🚀 Quick Start
```bash
pip install scikit-learn pandas numpy matplotlib seaborn scipy statsmodels

# Load data
import pandas as pd, numpy as np
meta = pd.read_csv('data/SIMULATED_cptac_metadata.csv')
expr = pd.read_csv('data/SIMULATED_cptac_expression_subset.csv', index_col=0)

# Train Random Forest with GroupKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GroupKFold, cross_val_predict
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score

X = StandardScaler().fit_transform(expr.values)
y = meta['is_cancer'].values
groups = meta['patient_id'].values

rf = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)
gkf = GroupKFold(n_splits=5)
y_prob = cross_val_predict(rf, X, y, cv=gkf, groups=groups, method='predict_proba')[:, 1]
print(f"GroupKFold AUC: {roc_auc_score(y, y_prob):.3f}")
```

## ⚠️ Limitations
1. **Tissue ≠ Plasma:** AUC=0.992 is from tumor vs adjacent-normal tissue proteomics. Plasma proteomics has ~10× lower dynamic range and far higher background noise. Realistic plasma AUC: 0.75–0.90.
2. **No real LNP corona data:** The SYNTHETIC_lnp_corona_dataset.csv is entirely synthetic. No public plasma LNP corona LC-MS/MS dataset (cancer vs healthy) exists as of March 2026.
3. **Simulated CPTAC proxy:** All expression data is synthetic, generated to match CPTAC summary statistics. Real CPTAC data requires dbGaP access.
4. **Small healthy cohort:** Only N=26 healthy controls — severely underpowered for robust healthy vs cancer discrimination.
5. **Adjacent-normal bias:** Adjacent-normal tissue is not equivalent to healthy plasma; field cancerization effects inflate apparent AUC.
6. **No prospective validation:** All metrics are cross-validated on the same synthetic distribution; no held-out prospective test set.
7. **Budget estimate uncertainty:** $80,000–$140,000 estimate assumes academic pricing; commercial CRO costs may be 2–3× higher.

## 📖 Citation
```bibtex
@misc{kolisnyk2026corona,
  title     = {Protein Corona Fingerprinting of Lipid Nanoparticles as a
               Liquid Biopsy Biomarker: Distinguishing Cancer Patients from
               Healthy Individuals Using Machine Learning},
  author    = {Kolisnyk, Oksana},
  year      = {2026},
  publisher = {GitHub},
  url       = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  note      = {K R\&D Lab, KOSATIKS GROUP (kosatiks-group.pp.ua). SIMULATED/SYNTHETIC dataset.
               Tissue-level AUC only; plasma validation required.}
}
```
