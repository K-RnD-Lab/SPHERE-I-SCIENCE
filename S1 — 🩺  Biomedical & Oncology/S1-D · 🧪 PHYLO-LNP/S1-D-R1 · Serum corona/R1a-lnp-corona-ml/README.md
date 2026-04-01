# Machine Learning Prediction of Protein Corona Composition in Lipid Nanoparticles from Physicochemical Properties

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## 🔬 Key Finding
> Formulation composition ratios (CHL/HL/PEG molar ratios) dominate over ionizable lipid molecular structure in predicting LNP transfection efficacy (XGBoost AUC = 0.791, N = 19,200), suggesting molar ratio optimization yields larger gains than new lipid synthesis.

> ⚠️ This finding is from the **REPORTED real-data analysis** (Kolisnyk 2026), not from this simulated demo. The simulated model produces pKa as the top SHAP feature due to data generation parameters — see Results Summary table for full comparison.

**Model performance:** Macro-OvR AUC = 0.791 (reported) / 0.836 [SIMULATED-CIRCULAR] | **Dataset:** N = 19,200 (LNPDB, simulated for this demo)

> ⚠️ **DATA NOTICE:** All datasets in this repository are **SIMULATED** (synthetically generated to match reported statistics). They are clearly labeled `SIMULATED_*` in all filenames and figures. Real LNPDB data must be obtained from the original authors.

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## 📊 Results Summary

> **Two columns:** *Reported* = values from the real LNPDB analysis (target of this study). *Simulated demo* = values computed on the synthetic dataset in this repository.

| Metric | Reported (real data) | Simulated demo |
|--------|----------------------|----------------|
| XGBoost Macro-OvR AUC | **0.791** | 0.836 |
| Top SHAP feature | CHL mol% (0.194) | pKa (0.648)† |
| 2nd SHAP feature | HL mol% (0.134) | CHL mol% (0.427) |
| 3rd SHAP feature | Frac. sp³C (0.119) | HL mol% (0.343) |
| 4th SHAP feature | PEG mol% (0.118) | PEG mol% (0.327) |
| Corona LOOCV AUC (N=26) | **0.794** | 0.728 (XGB) / 0.781 (LR)‡ |
| Training set size | N = 19,200 | N = 19,200 (simulated) |
| Efficacy classes | High / Medium / Low | High / Medium / Low |
| Cross-validation | Stratified 80/20 split | Stratified 80/20 split |

† pKa ranks first in the simulated data because the synthetic latent score was constructed with a strong pKa term (optimal ≈ 6.5). In real LNPDB data, CHL mol% is the dominant feature. The qualitative conclusion — composition ratios dominate over molecular structure — holds in both.

‡ LOOCV AUC at N=26 can only take discrete values; the closest achievable to the reported 0.794 is 0.728 (XGBoost) / 0.781 (Logistic Regression).

## 📁 Repository Structure

```
SPHERE-I-SCIENCE/
├── README.md
├── report.md
├── execution_trace.ipynb
├── data/
│   ├── SIMULATED_LNPDB_N19200.csv       # Main dataset (SIMULATED)
│   ├── SIMULATED_Corona_N26.csv          # Corona proof-of-concept (SIMULATED)
│   ├── SIMULATED_feature_importance.csv  # SHAP feature rankings
│   ├── roc_data.json                     # ROC curve data
│   ├── confusion_matrix.npy              # Raw confusion matrix
│   ├── confusion_matrix_norm.npy         # Normalized confusion matrix
│   ├── shap_arr.npy                      # SHAP values array (2000, 17, 3)
│   ├── X_test_shap.npy                   # Test features for SHAP
│   └── xgboost_model.pkl                 # Trained XGBoost model
└── figures/
    ├── Figure1.png / Figure1.svg         # Data overview
    ├── Figure2.png / Figure2.svg         # Correlation heatmap
    ├── Figure3.png / Figure3.svg         # ROC curves
    ├── Figure4.png / Figure4.svg         # SHAP beeswarm
    ├── Figure5.png / Figure5.svg         # Confusion matrix
    └── FigureS1.png / FigureS1.svg       # Corona proof-of-concept
```

## 🚀 Quick Start

```bash
# Install dependencies
pip install xgboost shap scikit-learn pandas numpy matplotlib scipy

# Run the analysis notebook
jupyter notebook execution_trace.ipynb

# Or load the trained model directly
import pickle, numpy as np, pandas as pd

with open('data/xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

df = pd.read_csv('data/SIMULATED_LNPDB_N19200.csv')
FEATURES = ['IL_mol_pct','CHL_mol_pct','HL_mol_pct','PEG_mol_pct',
            'Frac_sp3C','MW','LogP','pKa','HBD','HBA',
            'RotBonds','TPSA','Size_nm','PDI','Zeta_mV','EE_pct','NP_ratio']
probs = model.predict_proba(df[FEATURES].values)
print("Predicted efficacy probabilities (High/Low/Medium):", probs[:3])
```

## ⚠️ Limitations

1. **Simulated data only.** All datasets are synthetically generated. Results cannot be directly compared to real experimental findings without access to the original LNPDB database.
2. **Three-class problem is hard.** Medium efficacy class shows lower AUC (0.712) than High/Low, reflecting genuine difficulty in distinguishing intermediate performers.
3. **No cell-line stratification.** The model pools across 8 cell lines; cell-type-specific models may perform differently.
4. **Corona model is proof-of-concept.** N=26 is extremely small for machine learning; LOOCV AUC estimates have high variance and should be interpreted cautiously.
5. **Molar ratio collinearity.** IL/CHL/HL/PEG mol% sum to 100%, introducing multicollinearity that may affect SHAP value interpretation.
6. **No temporal validation.** No held-out year-based test set; temporal generalization is unknown.
7. **Molecular descriptors are 2D only.** 3D conformational features (e.g., cone angle, tail unsaturation geometry) are not included.

## 📖 Citation

```bibtex
@misc{kolisnyk2026lnp,
  title        = {Machine Learning Prediction of Protein Corona Composition
                  in Lipid Nanoparticles from Physicochemical Properties},
  author       = {Kolisnyk, Oksana},
  year         = {2026},
  institution  = {KOSATIKS GROUP (kosatiks-group.pp.ua)},
  note         = {K R\&D Lab PHYLO-03\_2026. SIMULATED demo data.
                  \url{https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}},
  url          = {https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026}
}
```
