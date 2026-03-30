# Machine Learning Prediction of Protein Corona Composition in Lipid Nanoparticles from Physicochemical Properties

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## рџ”¬ Key Finding
> Formulation composition ratios (CHL/HL/PEG molar ratios) dominate over ionizable lipid molecular structure in predicting LNP transfection efficacy (XGBoost AUC = 0.791, N = 19,200), suggesting molar ratio optimization yields larger gains than new lipid synthesis.

**Model performance:** XGBoost AUC = 0.791 (5-fold CV) | **Dataset:** N = 19,200 transfection records

## рџ¤— Demo
[![Demo](https://img.shields.io/badge/рџ¤—-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## рџ“Љ Results Summary
| Metric | Value |
|--------|-------|
| XGBoost AUC (5-fold CV) | 0.791 |
| Corona model LOOCV AUC | 0.794 |
| Corona model N | 26 |
| Top SHAP feature | CHL mol% (0.194) |
| 2nd SHAP feature | HL mol% (0.134) |
| 3rd SHAP feature | Frac.sp3C (0.119) |
| 4th SHAP feature | PEG mol% (0.118) |
| Training set size | 19,200 records |
| Number of features | 23 |
| Efficacy classes | Low / Medium / High |

> вљ пёЏ **Data transparency:** All datasets in this repository are **SIMULATED** for demonstration purposes. The LNPDB source database (Hajj et al. and related publications) is referenced but not redistributed. Simulated data is clearly labeled in all filenames and figures.

## рџ“Ѓ Repository Structure
```
project1_lnp_ml/
в”њв”Ђв”Ђ README.md
в”њв”Ђв”Ђ report.md
в”њв”Ђв”Ђ data/
в”‚   в”њв”Ђв”Ђ LNPDB_SIMULATED.csv          # Simulated dataset (N=19,200)
в”‚   в”њв”Ђв”Ђ SHAP_values_SIMULATED.csv    # Top-15 SHAP feature importances
в”‚   в”њв”Ђв”Ђ ROC_curves_SIMULATED.csv     # Per-class ROC curve data
в”‚   в”њв”Ђв”Ђ confusion_matrix_SIMULATED.csv
в”‚   в””в”Ђв”Ђ corona_LOOCV_SIMULATED.csv   # Corona subset LOOCV (N=26)
в””в”Ђв”Ђ figures/
    в”њв”Ђв”Ђ Figure1.png / .svg           # Dataset overview
    в”њв”Ђв”Ђ Figure2.png / .svg           # Correlation heatmap
    в”њв”Ђв”Ђ Figure3.png / .svg           # ROC curves
    в”њв”Ђв”Ђ Figure4.png / .svg           # SHAP beeswarm
    в”њв”Ђв”Ђ Figure5.png / .svg           # Confusion matrix
    в””в”Ђв”Ђ FigureS1.png / .svg          # Corona proof-of-concept
```

## рџљЂ Quick Start
```bash
pip install -r ../../requirements.txt

# Run the full pipeline
python train_model.py --data data/LNPDB_SIMULATED.csv --output results/

# Generate figures
python generate_figures.py --results results/ --output figures/
```

## вљ пёЏ Limitations
- **Simulated data:** All datasets are synthetically generated for demonstration. Results do not reflect real experimental findings from the LNPDB.
- **Corona model (N=26):** The proof-of-concept corona model is severely underpowered. LOOCV AUC = 0.794 should be interpreted with extreme caution вЂ” confidence intervals span nearly the full [0,1] range at N=26.
- **Generalizability:** The model was trained on a specific set of ionizable lipids and cell lines. Performance on novel lipid scaffolds or primary cells is unknown.
- **Missing modalities:** Protein corona composition data is sparse; the corona model uses only 26 records and requires validation on independent cohorts.
- **Causal inference:** SHAP feature importance reflects predictive association, not causal mechanism. CHL mol% dominance may reflect dataset composition bias.

## рџ“– Citation
```bibtex
@misc{kolisnyk2026lnpml,
  title   = {Machine Learning Prediction of Protein Corona Composition
             in Lipid Nanoparticles from Physicochemical Properties},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  url     = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  note    = {K R\&D Lab, KOSATIKS GROUP. ORCID: 0009-0003-5780-2290}
}
```

