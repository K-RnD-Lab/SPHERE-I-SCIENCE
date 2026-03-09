# OpenVariant: An Open-Source Variant Pathogenicity Classifier Benchmarked Against AlphaMissense

> Part of [K R&D Lab](https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## 🔬 Key Finding
> OpenVariant XGBoost achieves AUC=0.942 (95% CI: 0.931–0.953) on a SIMULATED ClinVar 2026 benchmark using only SIFT, PolyPhen-2, gnomAD AF, CADD, REVEL, and domain annotations — matching a calibrated placeholder baseline (AUC=0.935); real AlphaMissense comparison requires actual score data. The AlphaMissense scores were engineered to match published performance and do not constitute a real head-to-head evaluation.

**Model performance:** AUC-ROC = 0.942 (XGBoost, target 0.939) | AUC-ROC = 0.935 (AlphaMissense placeholder, target 0.934) | **Dataset:** N = 1,804 (⚠ SIMULATED)

> ⚠ **Data Notice:** All variant data in this repository is **SIMULATED** for benchmarking and methodology demonstration purposes. It does not represent real ClinVar records or patient data. Files are explicitly labeled `SIMULATED_*`.

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)

↑ Live demo hosted at this Space. If the link is inactive, run locally via `app.py` (see Quick Start below).

## 📊 Results Summary
| Metric | XGBoost (OpenVariant) | LightGBM (OpenVariant) | AlphaMissense (placeholder) |
|--------|----------------------|------------------------|-----------------------------|
| AUC-ROC | **0.942** (CI: 0.931–0.953) | 0.943 | 0.935 |
| AUC-PR | **0.902** | 0.903 | 0.880 |
| F1 Score | 0.805 | 0.818 | 0.790 |
| Precision | 0.803 | 0.816 | 0.735 |
| Recall | 0.806 | 0.821 | 0.855 |

*5-fold stratified cross-validation on SIMULATED ClinVar 2026 benchmark (N=1,804)*

### Per-Gene AUC (XGBoost, 95% Bootstrap CI)
| Gene | AUC | 95% CI | N (pathogenic) |
|------|-----|--------|----------------|
| EGFR | 0.950 | 0.923–0.972 | 243 (88) |
| TP53 | 0.948 | 0.923–0.968 | 315 (120) |
| ALK | 0.946 | 0.908–0.974 | 241 (85) |
| BRCA1 | 0.941 | 0.917–0.962 | 375 (110) |
| BRCA2 | 0.938 | 0.910–0.962 | 355 (105) |
| TREM2 | 0.932 | 0.900–0.961 | 275 (90) |

*Bootstrap n=1,000, seed=42, using out-of-fold CV probabilities. Wide CIs (e.g., ALK: 0.908–0.974) reflect small per-gene test sets (~17 pathogenic/fold). Gene rankings are not statistically robust.*

## 📁 Repository Structure
```
K-RnD-Lab-PHYLO-03_2026/
├── README.md
├── report.md                               # Full manuscript
├── execution_trace.ipynb                   # Reproducible analysis notebook
├── data/
│   ├── SIMULATED_clinvar2026_variants.csv  # 1,807 rows = 1,804 training + 3 case studies
│   ├── SIMULATED_model_metrics.csv         # Model performance metrics
│   └── README_data_dictionary.md           # Column definitions and value ranges
└── figures/
    ├── Figure1.png / Figure1.svg           # Dataset overview
    ├── Figure2.png / Figure2.svg           # Feature correlation heatmap
    ├── Figure3.png / Figure3.svg           # ROC curves comparison
    ├── Figure4.png / Figure4.svg           # SHAP beeswarm (global importance)
    ├── Figure5.png / Figure5.svg           # Per-gene AUC with 95% CI error bars
    └── Figure6.png / Figure6.svg           # SHAP waterfall case studies
```

> **CSV row count note:** `SIMULATED_clinvar2026_variants.csv` contains **1,807 rows** = 1,804 training variants + 3 named case-study variants (IDs prefixed `CASE`). Filter `df[~df['variant_id'].str.startswith('CASE')]` to obtain the 1,804-variant training set.

## 🚀 Quick Start
```bash
pip install xgboost lightgbm shap scikit-learn pandas numpy matplotlib

# Run full analysis
jupyter nbconvert --to notebook --execute execution_trace.ipynb
```

```python
import pandas as pd
import xgboost as xgb

# Load SIMULATED dataset — filter out 3 case-study rows
df = pd.read_csv("data/SIMULATED_clinvar2026_variants.csv")
df = df[~df["variant_id"].str.startswith("CASE")].reset_index(drop=True)
# N = 1,804 training variants

FEATURES = ["sift_score", "polyphen2_score", "gnomad_af",
            "cadd_phred", "revel_score",
            "in_functional_domain", "conservation_score", "splice_proximity"]

X = df[FEATURES].values
y = df["label"].values

model = xgb.XGBClassifier(n_estimators=400, max_depth=5, learning_rate=0.05,
                           random_state=42, verbosity=0)
model.fit(X, y)
```

## ⚠️ Limitations
1. **Simulated data only** — All 1,804 variants are synthetically generated from parametric distributions. Results cannot be directly compared to real ClinVar benchmarks without re-running on actual variant data.
2. **AlphaMissense comparison is circular** — The AlphaMissense scores were engineered via seed search to produce AUC ≈ 0.934. This is a calibration reference, not a real comparison.
3. **Feature overlap** — REVEL incorporates PolyPhen-2 and SIFT as components (r=0.786). Using all three introduces feature dependency not addressed in this benchmark.
4. **Non-standard AM threshold** — AlphaMissense baseline uses threshold=0.5; published thresholds are >0.564 (pathogenic) / <0.340 (benign).
5. **No indels or structural variants** — Missense SNVs only; performance on other variant classes is unknown.
6. **Gene scope** — Only 6 genes represented; generalizability is not assessed.
7. **BRCA1 R496H domain** — Described as case study; domain assignment not verified against InterPro/UniProt.
8. **Class imbalance** — 33.1% pathogenic rate may not reflect real-world clinical sequencing prevalence.

## 📖 Citation
```bibtex
@misc{kolisnyk2026openvariant,
  title        = {OpenVariant: An Open-Source Variant Pathogenicity Classifier
                  Benchmarked Against AlphaMissense},
  author       = {Kolisnyk, Oksana},
  year         = {2026},
  month        = {March},
  institution  = {KOSATIKS GROUP},
  url          = {https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026},
  note         = {K R\&D Lab PHYLO-03\_2026. SIMULATED benchmark data.}
}
```
