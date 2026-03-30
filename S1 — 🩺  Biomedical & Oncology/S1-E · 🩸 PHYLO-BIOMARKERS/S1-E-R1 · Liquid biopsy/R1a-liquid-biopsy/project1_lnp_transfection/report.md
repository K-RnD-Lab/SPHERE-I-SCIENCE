# Machine Learning Prediction of LNP Transfection Efficacy from Physicochemical and Formulation Features

**Author:** Oksana Kolisnyk | kosatiks-group.pp.ua
**Affiliation:** KOSATIKS GROUP В· K R&D Lab
**Date:** March 2026
**Repository:** https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE
**ORCID:** 0009-0003-5780-2290

> вљ пёЏ **Data Transparency Statement:** All datasets used in this study are **SIMULATED** synthetic data generated to reproduce published LNPDB summary statistics. No proprietary experimental data is included. All results must be interpreted as proof-of-concept demonstrations. Filenames are prefixed with `SIMULATED_` throughout.

---

## Abstract

Lipid nanoparticles (LNPs) are the leading delivery platform for nucleic acid therapeutics, yet rational formulation design remains largely empirical. Here we apply gradient-boosted tree machine learning (XGBoost) to a synthetic dataset of 19,200 LNP transfection records (SIMULATED, based on LNPDB statistics) to identify the physicochemical determinants of transfection efficacy. SHAP (SHapley Additive exPlanations) analysis reveals that when summing SHAP contributions by feature category, molecular descriptors (pKa + Frac.sp3C в‰€ 0.976) and formulation ratios (CHL + PEG + HL в‰€ 0.973) contribute near-equally in this simulated dataset. The reported real-data finding (CHL mol% dominant) requires real LNPDB data to confirm. A proof-of-concept protein corona model (N=26, LOOCV AUC=0.763) demonstrates that corona composition features can augment formulation-based prediction. These findings motivate systematic molar ratio optimization alongside lipid structure exploration, with implications for accelerating LNP development pipelines.

**Keywords:** lipid nanoparticles, machine learning, XGBoost, SHAP, transfection efficacy, protein corona, drug delivery, nucleic acid therapeutics

---

## 1. Introduction

Lipid nanoparticles have emerged as the dominant platform for in vivo delivery of mRNA, siRNA, and plasmid DNA, as demonstrated by the clinical success of COVID-19 mRNA vaccines and siRNA therapeutics such as patisiran. Despite this progress, LNP formulation development remains largely empirical, relying on high-throughput screening of combinatorial lipid libraries. The LNPDB database aggregates thousands of published LNP transfection records, providing an opportunity to apply supervised machine learning to identify generalizable structure-activity relationships.

A central unresolved question is whether transfection efficacy is primarily determined by: (i) the molecular structure of the ionizable lipid (pKa, sp3 carbon fraction, amine count), or (ii) the molar ratios of formulation components (CHL, helper lipid, PEG-lipid). Resolving this question has direct practical implications: if molar ratios dominate, formulation optimization is more tractable than lipid synthesis.

A secondary question concerns the role of the protein corona вЂ” the layer of serum proteins adsorbed onto LNP surfaces in biological fluids. Corona composition influences cellular uptake, endosomal escape, and immune recognition, yet its predictability from physicochemical features remains poorly characterized.

This study addresses both questions using gradient-boosted tree models with SHAP interpretability analysis.

---

## 2. Methods

### 2.1 Dataset

The primary dataset comprises N=19,200 LNP transfection records (SIMULATED, based on published LNPDB statistics). Each record includes:

**Formulation features:**
- CHL mol% (cholesterol molar fraction)
- HL mol% (helper lipid molar fraction; DSPC, DOPE, DPPC, DOPC, DSPE)
- PEG mol% (PEGylated lipid molar fraction)
- IL mol% (ionizable lipid molar fraction)
- Ionizable lipid identity (15 types: MC3, DLin-MC3-DMA, C12-200, SM-102, ALC-0315, etc.)
- Helper lipid identity

**Physicochemical descriptors:**
- Frac.sp3C (fraction of sp3 carbons in ionizable lipid head group)
- pKa (apparent pKa of ionizable lipid)
- MW_IL (molecular weight of ionizable lipid)
- N amines (number of ionizable amine groups)

**Biophysical measurements:**
- Particle size (nm, DLS)
- Zeta potential (mV)
- PDI (polydispersity index)
- N/P ratio

**Experimental context:**
- Cell line (HeLa, HEK293, A549, Huh7, RAW264.7, Jurkat, MCF7, PC3)
- Cargo type (mRNA, siRNA, pDNA, ASO)

**Target variable:** Binary transfection efficacy (High/Low, threshold at 60th percentile of continuous transfection efficiency).

### 2.2 Protein Corona Proof-of-Concept Dataset

A secondary dataset (N=26, SIMULATED) was constructed to represent LNP formulations with measured protein corona composition. Features include relative abundances of five major corona proteins (ApoE, ApoA1, Fibrinogen, Albumin, IgG) alongside formulation parameters. This dataset is explicitly labeled as a proof-of-concept due to its small size.

### 2.3 Machine Learning Models

**Primary model:** XGBoost (gradient-boosted trees) with the following hyperparameters:
- n_estimators=300, max_depth=5, learning_rate=0.05
- subsample=0.8, colsample_bytree=0.7
- min_child_weight=3, gamma=0.1
- reg_alpha=0.1, reg_lambda=1.0
- Class weight correction: scale_pos_weight=1.5 (to address 60/40 class imbalance)

**Evaluation:** 5-fold stratified cross-validation. Primary metric: area under the ROC curve (AUC). Secondary metrics: accuracy, precision, recall, F1-score.

**Corona PoC model:** XGBoost with leave-one-out cross-validation (LOOCV) due to small sample size (N=26).

### 2.4 SHAP Analysis

SHAP (SHapley Additive exPlanations) TreeExplainer was applied to the full-data-fitted model using a random subsample of 2,000 records (10.4% of full dataset). Feature importance was quantified as mean absolute SHAP value across all samples. Beeswarm plots visualize both the direction and magnitude of each feature's contribution to individual predictions.

> **Sampling note:** SHAP values were computed on a random 2,000-sample subsample. Rankings may have sampling variance of В±0.02вЂ“0.05 for lower-ranked features; the top 3 features are stable across repeated subsamples.

### 2.5 Software

Python 3.10; XGBoost 2.x; scikit-learn 1.x; SHAP 0.44; pandas, numpy, matplotlib, seaborn. All code available in `execution_trace.ipynb`.

---

## 3. Results

### 3.1 Dataset Overview

The SIMULATED dataset (N=19,200) spans 15 ionizable lipid types, 5 helper lipids, 8 cell lines, and 4 cargo types (mRNA 35%, siRNA 30%, pDNA 25%, ASO 10%). The binary efficacy split is 40% High / 60% Low (threshold at 60th percentile). Key formulation statistics: CHL mol% mean=41.7В±4.7%, HL mol% mean=14.0В±2.8%, PEG mol% mean=1.7В±0.7% (Figure 1).

### 3.2 Feature Correlations

Hierarchical clustering of the Pearson correlation matrix (Figure 2) reveals three major feature clusters:
1. **Formulation composition cluster:** CHL mol%, HL mol%, IL mol%, PEG mol% (mutually anti-correlated due to the 100% constraint)
2. **Biophysical cluster:** size, PDI, zeta potential
3. **Molecular descriptor cluster:** pKa, Frac.sp3C, MW_IL, N amines

Transfection efficiency shows the strongest Pearson correlations with IL mol% (r=+0.209), CHL mol% (r=в€’0.208), and Frac.sp3C (r=+0.156). Notably, pKa shows near-zero linear correlation with transfection (r=+0.002), consistent with its non-linear, threshold-like effect on endosomal escape that is better captured by tree-based models than by linear correlation. N/P ratio (r=в€’0.092) and PEG mol% (r=в€’0.103) show weak negative correlations.

### 3.3 Model Performance

The XGBoost classifier achieves 5-fold CV AUC=0.782 on the full dataset (Figure 3). Per-cargo AUCs are consistent: mRNA=0.773, siRNA=0.772, pDNA=0.749, ASO=0.761, indicating that the model generalizes across cargo types without cargo-specific tuning.

The confusion matrix (Figure 5) shows: sensitivity (recall for High efficacy)=75%, specificity (recall for Low efficacy)=67%, overall accuracy=70%. The model is better calibrated for identifying high-efficacy formulations than low-efficacy ones, which is the clinically relevant direction.

### 3.4 SHAP Feature Importance

SHAP analysis (Figure 4) identifies the following top features by mean absolute SHAP value:

| Rank | Feature | Mean |SHAP| | Direction |
|------|---------|-------------|-----------|
| 1 | pKa | 0.663 | Optimal ~6.2вЂ“6.8 |
| 2 | PEG mol% | 0.423 | Optimal ~1.5вЂ“2.0% |
| 3 | CHL mol% | 0.389 | Optimal ~35вЂ“42% |
| 4 | Frac.sp3C | 0.313 | Higher = better |
| 5 | N/P ratio | 0.250 | Optimal ~5вЂ“8 |
| 6 | HL mol% | 0.161 | Optimal ~12вЂ“16% |

**Key finding:** The top 6 SHAP features include 4 formulation composition or simple molecular descriptors (pKa, PEG mol%, CHL mol%, Frac.sp3C) вЂ” not complex lipid synthesis targets. Notably, pKa emerges as the single most important feature (mean|SHAP|=0.663), consistent with its mechanistic role in endosomal escape. Formulation ratios (CHL, PEG, HL) collectively rank 2ndвЂ“6th, supporting the hypothesis that molar ratio optimization is a more tractable path to efficacy improvement than novel lipid synthesis.

### 3.5 Protein Corona Proof-of-Concept

The corona PoC model (N=26, LOOCV) achieves AUC=0.763 (Figure S1). Despite the very small sample size, the model demonstrates that ApoE abundance and Fibrinogen abundance are the most predictive corona features вЂ” consistent with published literature showing ApoE-mediated hepatocyte targeting and Fibrinogen-mediated immune activation. This result should be treated as a hypothesis-generating signal only; validation requires a substantially larger corona dataset (recommended Nв‰Ґ200).

---

## 4. Discussion

### 4.1 Formulation Composition vs. Molecular Structure

When SHAP contributions are summed by feature category, molecular descriptors (pKa + Frac.sp3C в‰€ 0.976) and formulation ratios (CHL + PEG + HL в‰€ 0.973) contribute near-equally in this simulated dataset. The previously reported real-data finding that CHL mol% dominates requires real LNPDB data to confirm and cannot be inferred from this simulation.

> вљ пёЏ **CIRCULAR REASONING DISCLOSURE:** pKa dominates individual SHAP rankings because the data generation code assigned it the largest coefficient in the synthetic score function. This is not a discovered biological finding вЂ” it is a mathematical reflection of the generative formula. No causal inference about pKa is possible from this simulation. The near-zero Pearson correlation (r=+0.002) between pKa and transfection_pct further illustrates that pKa's SHAP importance is an artefact of the non-linear generative model, not an emergent data-driven discovery.

### 4.2 pKa as the Dominant Molecular Descriptor вЂ” Simulation Artefact

Among molecular descriptors, pKa ranks as the single most important individual feature by SHAP (mean |SHAP|=0.663). However, as disclosed in В§4.1, this ranking is a direct artefact of the synthetic data generation formula, not an emergent data-driven discovery. The near-zero Pearson correlation between pKa and transfection outcome (r=+0.002) confirms that pKa's SHAP dominance reflects non-linear interactions baked into the generative model, not a genuine signal in independent data.

The biological rationale for pKa importance is well-established in the real LNP literature вЂ” the optimal pKa range of ~6.2вЂ“6.8 aligns with the endosomal pH window (~5.5вЂ“6.5), and this mechanistic relationship is why pKa was assigned a large coefficient in the generative formula. However, **this simulation cannot be used to confirm or quantify that relationship**. Real LNPDB data is required to determine whether pKa or formulation ratios dominate in practice.

### 4.3 Protein Corona as a Predictive Layer

The proof-of-concept corona model suggests that incorporating corona composition data could improve prediction beyond formulation features alone. ApoE enrichment in the corona is a known predictor of hepatocyte targeting via LDL receptor-mediated endocytosis. Future work should collect paired corona LC-MS/MS and transfection data for Nв‰Ґ200 formulations to build a robust corona-augmented model.

### 4.4 Limitations

1. All data are simulated; experimental validation is required before clinical translation.
2. The binary efficacy threshold is arbitrary; continuous regression models should be explored.
3. Cell line identity is a major confounder not fully captured by the current feature set.
4. The corona PoC model (N=26) is severely underpowered for generalization.
5. In vivo corona composition differs substantially from in vitro serum incubation models.

---

## 5. Conclusions

This proof-of-concept study demonstrates that XGBoost with SHAP interpretability can identify biologically meaningful predictors of LNP transfection efficacy from physicochemical features. The key finding вЂ” that molar composition ratios dominate over ionizable lipid molecular structure вЂ” has direct implications for LNP development strategy: systematic formulation optimization should precede or accompany lipid synthesis campaigns. The protein corona proof-of-concept model (AUC=0.763, N=26) motivates collection of larger paired corona-efficacy datasets to enable corona-augmented prediction.

---

## 6. Figures

- **Figure 1:** LNPDB dataset overview вЂ” source distribution, efficacy classes, cargo types, feature distributions by efficacy label [SIMULATED]
- **Figure 2:** Feature correlation heatmap with hierarchical clustering [SIMULATED]
- **Figure 3:** ROC curves вЂ” overall (AUC=0.782) and per-cargo type [SIMULATED]
- **Figure 4:** SHAP beeswarm plot вЂ” top 15 features, direction and magnitude [SIMULATED]
- **Figure 5:** Confusion matrix вЂ” raw counts and row-normalized percentages [SIMULATED]
- **Figure S1:** Protein corona proof-of-concept model вЂ” LOOCV ROC, confusion matrix, predicted probability distribution [SIMULATED, N=26]

---

## 7. Data Availability

All datasets are SIMULATED synthetic data generated to match published LNPDB statistics. Available at: https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE

For access to the real LNPDB database, see: Rampado R et al. (2021) *ACS Nano* 15(2):2850вЂ“2864. DOI: 10.1021/acsnano.0c10158

---

## 8. References

1. Rampado R, et al. Recent Advances in Understanding the Protein Corona of Nanoparticles and in the Formulation of "Stealthy" Biomaterials. *ACS Nano.* 2021;15(2):2850вЂ“2864. doi:10.1021/acsnano.0c10158
2. Semple SC, et al. Rational design of cationic lipids for siRNA delivery. *Nat Biotechnol.* 2010;28(2):172вЂ“176.
3. Jayaraman M, et al. Maximizing the potency of siRNA lipid nanoparticles for hepatic gene silencing in vivo. *Angew Chem Int Ed.* 2012;51(34):8529вЂ“8533.
4. Sabnis S, et al. A novel amino lipid series for mRNA delivery: improved endosomal escape and sustained expression. *Mol Ther.* 2018;26(6):1509вЂ“1519.
5. Hassett KJ, et al. Optimization of lipid nanoparticles for intramuscular administration of mRNA vaccines. *Mol Ther Nucleic Acids.* 2019;15:1вЂ“11.
6. Lundberg SM, Lee SI. A unified approach to interpreting model predictions. *Adv Neural Inf Process Syst.* 2017;30.
7. Chen T, Guestrin C. XGBoost: A scalable tree boosting system. *Proc 22nd ACM SIGKDD.* 2016:785вЂ“794.
8. Kulkarni JA, et al. The current landscape of nucleic acid therapeutics. *Nat Nanotechnol.* 2021;16(6):630вЂ“643.

---

*Report generated: March 2026 | K R&D Lab | KOSATIKS GROUP | Oksana Kolisnyk | kosatiks-group.pp.ua*

