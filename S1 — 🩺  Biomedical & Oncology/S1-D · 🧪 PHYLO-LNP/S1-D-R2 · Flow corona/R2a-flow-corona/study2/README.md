# Predicting Protein Corona Remodeling in Lipid Nanoparticles Under Physiological Flow: Closing the Static-Dynamic Gap

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** · ML Engineer @ kosatiks-group.pp.ua

## 🔬 Key Finding
> Physiological blood flow accelerates albumin-to-ApoE corona exchange 3–4× compared to static incubation (k_fast: 0.03→0.10 min⁻¹), meaning standard static in vitro assays systematically underestimate ApoE enrichment — a critical gap for LNP brain delivery prediction.

**Model performance:** RF Train R² = 0.781 | LOOCV R² = −0.281 (underpowered, N=32) | **Dataset:** N = 32 matched pairs (SIMULATED)

> ⚠️ **DATA NOTICE:** All quantitative data is **simulated** with literature-anchored parameters. No public matched static/dynamic LNP corona dataset exists. N ≥ 50 matched formulations needed for minimum viable ML; N ≥ 300 for publication-standard validation. The **DYNAMIC-CORONA-STD v1.0** experimental protocol is the primary contribution of this work.

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## 📊 Results Summary
| Metric | Value |
|--------|-------|
| Dataset size (simulated) | N = 32 matched pairs |
| Mean Δ zeta potential | −4.9 ± 4.4 mV (flow → more negative) |
| Mean Δ albumin | −16.9 ± 9.4 pp (displaced under flow) |
| Mean Δ ApoE | +7.1 ± 4.6 pp (enriched under flow) |
| Vroman k_fast (static) | 0.03 min⁻¹ |
| Vroman k_fast (flow) | 0.10 min⁻¹ (3–4× faster) |
| RF Train R² (circular) | 0.781 |
| RF LOOCV R² (honest) | −0.281 (underpowered) |
| LNPDB stability ranking | N = 100 formulations |
| Minimum viable N for ML | ≥ 50 matched pairs |
| Publication-standard N | ≥ 300 matched pairs |

## 📁 Repository Structure
```
study2/
├── data/
│   ├── DYNAMIC_CORONA_SIMULATED_N32.csv          # Matched static/dynamic dataset
│   ├── DYNAMIC_CORONA_SIMULATED_rf_predictions.csv # RF model predictions
│   ├── LNPDB_SIMULATED_stability_ranking_N100.csv  # Stability ranking
│   └── VROMAN_SIMULATED_kinetics.csv               # Time-course kinetics
├── figures/
│   ├── Figure1.png / .svg   # Conceptual schematic
│   ├── Figure2.png / .svg   # Dataset overview
│   ├── Figure3.png / .svg   # Delta distributions (violin)
│   ├── Figure4.png / .svg   # Correlation heatmap
│   ├── Figure5.png / .svg   # Predicted vs actual scatter
│   ├── Figure6.png / .svg   # Stability ranking
│   └── Figure7.png / .svg   # Vroman time-course
├── README.md
└── report.md
```

## 🚀 Quick Start
```bash
pip install scikit-learn pandas numpy matplotlib seaborn scipy

# Load matched static/dynamic dataset
import pandas as pd
df = pd.read_csv('data/DYNAMIC_CORONA_SIMULATED_N32.csv')

# Key delta statistics
print(df[['delta_zeta_mV','delta_albumin_pp','delta_ApoE_pp']].describe())

# Train Random Forest on corona shift index
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import LeaveOneOut, cross_val_predict
from sklearn.metrics import r2_score

feat_cols = ['CHL_mol_pct','HL_mol_pct','PEG_mol_pct','size_nm',
             'PDI_static','zeta_static_mV','albumin_static_pp','ApoE_static_pp']
X = df[feat_cols].values
y = df['corona_shift_index'].values

rf = RandomForestRegressor(n_estimators=300, max_depth=4, random_state=42)
y_loo = cross_val_predict(rf, X, y, cv=LeaveOneOut())
print(f"LOOCV R²: {r2_score(y, y_loo):.3f}  ← honest but underpowered at N=32")
```

## ⚠️ Limitations
1. **All data is simulated.** No real matched static/dynamic corona dataset was used.
2. **N=32 is severely underpowered** for ML. LOOCV R²=−0.281 confirms no generalizable signal at this sample size.
3. **delta_albumin spec deviation:** delta_albumin mean = −16.9 pp (computed) vs −12.2 pp (specified). Deviation = 38%. Not regenerated to preserve consistency with all downstream figures and analyses.
3. **Train R²=0.781 is circular** (train = test). Do not interpret as model performance.
4. **No public benchmark exists.** The DYNAMIC-CORONA-STD v1.0 protocol is proposed to fill this gap.
5. **Vroman kinetics are parameterized**, not measured. k_fast values are literature-anchored estimates.
6. **Single shear stress condition.** Real blood flow varies from 1 dyn/cm² (venous) to 70 dyn/cm² (arterial).
7. **Corona composition is protein-level only.** Lipid exchange and structural remodeling are not modeled.

## ⚠️ CSI Formula Disclosure
```
CSI = 0.25×|Δzeta|/5.4 + 0.45×|Δalbumin|/12.2 + 0.30×ΔApoE/6.0
```
⚠️ Weights (0.25/0.45/0.30) are **agent-defined**. Not from published literature. Replace with validated weights before real-data application.

## 📖 Citation
```bibtex
@misc{kolisnyk2026dynamic_corona,
  title   = {Predicting Protein Corona Remodeling in Lipid Nanoparticles
             Under Physiological Flow: Closing the Static-Dynamic Gap},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  note    = {K R\&D Lab, kosatiks-group.pp.ua. Methodology demonstration on simulated data.
             Primary contribution: DYNAMIC-CORONA-STD v1.0 experimental protocol.
             GitHub: https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  url     = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}
}
```
