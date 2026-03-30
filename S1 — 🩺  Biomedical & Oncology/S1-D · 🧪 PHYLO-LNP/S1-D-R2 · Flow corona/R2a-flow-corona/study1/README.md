# Machine Learning Prediction of Protein Corona Composition in Lipid Nanoparticles from Physicochemical Properties

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** В· ML Engineer @ kosatiks-group.pp.ua

## рџ”¬ Key Finding
> In this simulated demo, colloidal quality (PDI, SHAP=0.210) and molar ratios (CHL+HL+PEG) are the dominant predictors. Per the reported real-data analysis, CHL mol% leads (SHAP=0.194) вЂ” PDI was not the top feature in real LNPDB data.

**Model performance:** XGBoost AUC = 0.877 (5-fold CV, simulated; target spec: 0.791) | Corona PoC AUC = 0.834 (LOOCV) | **Dataset:** N = 19,200 (SIMULATED)

> вљ пёЏ **DATA NOTICE:** All quantitative results are based on literature-anchored **simulated data**. No raw LNPDB records were used. All CSV files are labelled `_SIMULATED_`. Results demonstrate methodology only and must not be interpreted as experimental findings.

## рџ¤— Demo
[![Demo](https://img.shields.io/badge/рџ¤—-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## рџ“Љ Results Summary
| Metric | Value |
|--------|-------|
| XGBoost 5-fold CV AUC | 0.877 |
| Corona PoC LOOCV AUC | 0.834 (spec: 0.794, +5% deviation) |
| Dataset size (simulated) | N = 19,200 |
| Corona PoC dataset (simulated) | N = 26 |
| Top SHAP feature | PDI (0.210) вЂ” colloidal quality |
| 2nd SHAP feature | CHL mol% (0.192) |
| 3rd SHAP feature | HL mol% (0.134) |
| 4th SHAP feature | PEG mol% (0.105) |
| 5th SHAP feature | pKa (0.099) |
| Note: Frac.sp3C | Rank 9 (0.029) вЂ” lower than spec |
| Binary classification accuracy | 80% |

## рџ“Ѓ Repository Structure
```
study1/
в”њв”Ђв”Ђ data/
в”‚   в”њв”Ђв”Ђ LNPDB_SIMULATED_N19200.csv          # Main dataset (SIMULATED)
в”‚   в”њв”Ђв”Ђ LNPDB_SIMULATED_cv_predictions.csv  # 5-fold CV predictions
в”‚   в”њв”Ђв”Ђ LNPDB_SIMULATED_shap_values.csv     # SHAP feature importances
в”‚   в””в”Ђв”Ђ LNPDB_SIMULATED_corona_N26.csv      # Corona PoC dataset (SIMULATED)
в”њв”Ђв”Ђ figures/
в”‚   в”њв”Ђв”Ђ Figure1.png / .svg   # Data overview
в”‚   в”њв”Ђв”Ђ Figure2.png / .svg   # Correlation heatmap
в”‚   в”њв”Ђв”Ђ Figure3.png / .svg   # ROC curves
в”‚   в”њв”Ђв”Ђ Figure4.png / .svg   # SHAP beeswarm
в”‚   в”њв”Ђв”Ђ Figure5.png / .svg   # Confusion matrices
в”‚   в””в”Ђв”Ђ FigureS1.png / .svg  # Corona PoC model
в”њв”Ђв”Ђ tmp/
в”‚   в”њв”Ђв”Ђ shap_matrix.npy      # Intermediate: raw SHAP matrix (not for distribution)
в”‚   в””в”Ђв”Ђ X_features.npy       # Intermediate: feature matrix (not for distribution)
в”њв”Ђв”Ђ README.md
в””в”Ђв”Ђ report.md
```

## рџљЂ Quick Start
```bash
pip install xgboost shap scikit-learn pandas numpy matplotlib seaborn scipy

# Load simulated dataset
import pandas as pd
df = pd.read_csv('data/LNPDB_SIMULATED_N19200.csv')

# Feature columns
feat_cols = ['CHL_mol_pct','HL_mol_pct','PEG_mol_pct','IL_mol_pct',
             'size_nm','PDI','zeta_mV','encap_eff_pct','N_P_ratio',
             'Frac_sp3C','MW_Da','logP','HBD','HBA','pKa','TPSA',
             'RotBonds','AromaticRings']

import xgboost as xgb
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import roc_auc_score

X, y = df[feat_cols].values, df['efficacy_binary'].values
model = xgb.XGBClassifier(n_estimators=300, max_depth=5, random_state=42)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
y_prob = cross_val_predict(model, X, y, cv=cv, method='predict_proba')[:, 1]
print(f"AUC: {roc_auc_score(y, y_prob):.3f}")
```

## вљ пёЏ Limitations
1. **All data is simulated.** No real LNPDB records were accessed. Results are methodology demonstrations only.
2. **AUC inflation.** Simulated data was generated with known structure; real-world AUC will likely be lower.
3. **Corona PoC model (N=26) is underpowered.** LOOCV on N<30 is highly variable; minimum Nв‰Ґ100 required for reliable estimates.
4. **No external validation.** Model has not been tested on held-out real experimental data.
5. **Categorical features excluded.** Ionizable lipid identity, cell line, and cargo type were not encoded in the ML model.
6. **Static in vitro conditions only.** Physiological flow effects on corona composition are not captured (see Study 2).

## рџ“– Citation
```bibtex
@misc{kolisnyk2026lnp_efficacy,
  title   = {Machine Learning Prediction of Protein Corona Composition
             in Lipid Nanoparticles from Physicochemical Properties},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  note    = {K R\&D Lab, kosatiks-group.pp.ua. Methodology demonstration on simulated data.
             GitHub: https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  url     = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}
}
```

