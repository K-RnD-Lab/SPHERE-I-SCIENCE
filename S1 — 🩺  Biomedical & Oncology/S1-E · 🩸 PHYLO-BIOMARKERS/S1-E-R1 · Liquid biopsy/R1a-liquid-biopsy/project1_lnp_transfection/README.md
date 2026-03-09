# Machine Learning Prediction of LNP Transfection Efficacy from Physicochemical and Formulation Features

> Part of [K R&D Lab](https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## 🔬 Key Finding
> In this simulated dataset, molecular descriptors (pKa + Frac.sp3C, summed SHAP ≈ 0.976) and formulation ratios (CHL + PEG + HL, summed SHAP ≈ 0.973) contribute near-equally to XGBoost predictions (AUC=0.782, N=19,200). Whether CHL mol% dominates on real LNPDB data requires experimental validation.
>
> ⚠️ pKa ranks #1 individually because the synthetic data generation formula assigned it the largest coefficient — this is not a data-driven biological discovery.

**Model performance:** XGBoost AUC = 0.782 (5-fold CV) | **Dataset:** N = 19,200 (SIMULATED — based on LNPDB statistics)

> ⚠️ **Data Transparency:** All datasets in this repository are **SIMULATED** synthetic data generated to match published LNPDB statistics. No proprietary or unpublished experimental data is included. All filenames are prefixed with `SIMULATED_`.

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)

## 📊 Results Summary
| Metric | Value |
|--------|-------|
| XGBoost AUC (5-fold CV) | 0.782 |
| Top SHAP feature | pKa (mean\|SHAP\|=0.663) |
| 2nd SHAP feature | PEG mol% (0.423) |
| 3rd SHAP feature | CHL mol% (0.389) |
| 4th SHAP feature | Frac.sp3C (0.313) |
| Corona PoC AUC (LOOCV, N=26) | 0.763 |
| Dataset size | N = 19,200 (SIMULATED) |
| Features | 16 physicochemical + formulation |

## 📁 Repository Structure
```
project1_lnp_transfection/
├── README.md
├── report.md
├── data/
│   ├── SIMULATED_lnpdb_transfection.csv     # Main dataset (N=19,200)
│   ├── SIMULATED_shap_values.csv            # SHAP feature importances
│   ├── SIMULATED_roc_curve.csv              # ROC curve data
│   └── SIMULATED_corona_poc_dataset.csv     # Corona PoC dataset (N=26)
└── figures/
    ├── Figure1.png / Figure1.svg            # Data overview
    ├── Figure2.png / Figure2.svg            # Correlation heatmap
    ├── Figure3.png / Figure3.svg            # ROC curves
    ├── Figure4.png / Figure4.svg            # SHAP beeswarm
    ├── Figure5.png / Figure5.svg            # Confusion matrix
    └── FigureS1.png / FigureS1.svg          # Corona PoC performance
```

## 🚀 Quick Start

> **Note:** Model requires 16 features total (12 numeric + 4 categorical encoded). See `data/feature_schema.csv` for the full feature list and encoding specification.

```bash
pip install xgboost shap scikit-learn pandas numpy matplotlib seaborn

# Load dataset
import pandas as pd
df = pd.read_csv('data/SIMULATED_lnpdb_transfection.csv')

# Train XGBoost
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import roc_auc_score

feature_cols = ['CHL_mol_pct','HL_mol_pct','PEG_mol_pct','IL_mol_pct',
                'Frac_sp3C','NP_ratio','size_nm','zeta_mV','PDI','pKa','MW_IL','n_amines']
X = df[feature_cols].values
y = df['efficacy_binary'].values

model = XGBClassifier(n_estimators=300, max_depth=5, learning_rate=0.05, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
y_prob = cross_val_predict(model, X, y, cv=cv, method='predict_proba')[:, 1]
print(f"AUC: {roc_auc_score(y, y_prob):.3f}")
```

## ⚠️ Limitations
1. **Simulated data only:** All datasets are synthetic, generated to match published LNPDB statistics. Results should be validated on real experimental data before drawing biological conclusions.
2. **Binary efficacy target:** Transfection efficiency is binarized at the 60th percentile; continuous regression models may capture more nuance.
3. **Corona PoC is underpowered:** N=26 is insufficient for robust generalization; LOOCV AUC=0.763 should be treated as a proof-of-concept signal only.
4. **Cell-line confounding:** Cell line identity is a strong confounder; models trained on one cell line may not generalize to others.
5. **Missing in vivo features:** In vivo corona composition differs substantially from in vitro; plasma protein binding data is not included.
6. **No temporal validation:** No held-out prospective test set; all metrics are cross-validated on the same synthetic distribution.

## 📖 Citation
```bibtex
@misc{kolisnyk2026lnp,
  title     = {Machine Learning Prediction of LNP Transfection Efficacy
               from Physicochemical and Formulation Features},
  author    = {Kolisnyk, Oksana},
  year      = {2026},
  publisher = {GitHub},
  url       = {https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026},
  note      = {K R\&D Lab, KOSATIKS GROUP (kosatiks-group.pp.ua). SIMULATED dataset.}
}
```
