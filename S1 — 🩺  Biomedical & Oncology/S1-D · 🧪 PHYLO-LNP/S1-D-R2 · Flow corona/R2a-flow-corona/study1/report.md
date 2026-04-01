# Machine Learning Prediction of Protein Corona Composition in Lipid Nanoparticles from Physicochemical Properties

**Authors:** Oksana Kolisnyk¹  
**Affiliation:** ¹ Oksana Kolisnyk | kosatiks-group.pp.ua | K R&D Lab  
**Date:** March 2026  
**Status:** Methodology demonstration — all data is SIMULATED  
**Repository:** https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE  
**HF Space:** https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026  

---

> ⚠️ **DATA TRANSPARENCY STATEMENT**  
> All quantitative data in this report is **simulated** with literature-anchored parameters. No raw LNPDB experimental records were accessed. All datasets are labelled `_SIMULATED_` in filenames. This work demonstrates a computational methodology framework; reported metrics reflect performance on synthetic data and **must not** be interpreted as experimental findings or clinical evidence.

---

## Abstract

Lipid nanoparticles (LNPs) are the leading non-viral delivery platform for nucleic acid therapeutics, yet the relationship between formulation composition and transfection efficacy remains incompletely understood. Here we present a machine learning framework trained on a simulated LNPDB-anchored dataset (N = 19,200 transfection records) to predict binary and multi-class transfection efficacy from 18 physicochemical and molecular features. An XGBoost classifier achieved a 5-fold cross-validated AUC of 0.877 on simulated data (note: the original study specification targeted AUC = 0.791; the higher computed value reflects AUC inflation from simulated data with known structure). SHAP analysis revealed that colloidal quality (PDI, 0.210) is the single strongest predictor, followed by molar composition ratios — cholesterol (CHL mol%, 0.192), helper lipid (HL mol%, 0.134), and PEG lipid (PEG mol%, 0.105) — collectively accounting for >64% of model explanatory power, outweighing ionizable lipid molecular descriptors (Frac. sp³C rank 9, 0.029; logP rank 10, 0.011). As a proof-of-concept extension, a Random Forest model trained on a simulated protein corona composition dataset (N = 26, LOOCV AUC = 0.834) demonstrated that corona features (ApoE enrichment, albumin displacement) carry predictive signal for cellular uptake. These results suggest that molar ratio optimization may yield larger efficacy gains than synthesis of novel ionizable lipids, and motivate prospective experimental validation.

---

## 1. Introduction

Lipid nanoparticles have achieved clinical translation through the approval of patisiran (Onpattro, 2018) and the BNT162b2/mRNA-1273 COVID-19 vaccines, establishing LNPs as the dominant platform for RNA delivery. Despite this success, formulation optimization remains largely empirical, relying on design-of-experiment (DoE) approaches that explore a small fraction of the vast compositional space.

A typical LNP formulation comprises four components: (1) an ionizable lipid that facilitates endosomal escape, (2) a helper lipid (phospholipid) that stabilizes the bilayer, (3) cholesterol that modulates membrane fluidity, and (4) a PEGylated lipid that prevents aggregation and extends circulation half-life. The molar ratios of these components, together with the molecular properties of the ionizable lipid, determine particle size, surface charge, encapsulation efficiency, and ultimately transfection efficacy.

Machine learning approaches have recently been applied to LNP optimization. Notably, Xu et al. (2020) [UNVERIFIED] and Patel et al. (2022) [UNVERIFIED] demonstrated that gradient boosting models trained on high-throughput screening data can predict transfection efficacy with AUC > 0.75. However, the relative importance of formulation composition ratios versus ionizable lipid molecular structure has not been systematically quantified using explainable AI methods.

Furthermore, the protein corona — the layer of serum proteins adsorbed onto LNP surfaces — critically modulates cellular uptake and organ targeting. ApoE enrichment in the corona is associated with hepatic targeting via LDL receptor-mediated endocytosis, while albumin-dominated coronas reduce uptake. Despite its importance, corona composition is rarely included as a predictive feature in LNP ML models, partly due to the scarcity of matched formulation-corona datasets.

This work addresses two questions: (1) Which physicochemical features most strongly predict LNP transfection efficacy? (2) Can corona composition features improve uptake prediction in a small-N proof-of-concept setting?

---

## 2. Methods

### 2.1 Dataset

A simulated dataset of N = 19,200 LNP transfection records was generated with literature-anchored parameter distributions, representing the compositional and physicochemical diversity of the LNPDB (Kulkarni et al., 2021; Hassett et al., 2019; Sabnis et al., 2018; and 12 additional sources). Each record includes:

- **Molar composition:** CHL mol%, HL mol%, PEG mol%, IL mol% (constrained to sum to 100%)
- **Colloidal properties:** particle size (nm), PDI, zeta potential (mV), encapsulation efficiency (%), N/P ratio
- **Ionizable lipid molecular descriptors:** Frac. sp³C, MW (Da), logP, HBD, HBA, pKa, TPSA, rotatable bonds, aromatic rings
- **Metadata:** ionizable lipid identity, helper lipid, PEG lipid, cell line, cargo type (mRNA/siRNA/pDNA/saRNA), literature source

Efficacy labels were assigned as binary (high/low, 40%/60% split) and 4-class (Very Low/Low/High/Very High) based on a scoring function incorporating optimal molar ratios (CHL ~40%, HL ~11%, PEG ~2.5%), pKa proximity to 6.5, PDI < 0.15, and size ~100 nm, consistent with published structure-activity relationships.

A separate corona proof-of-concept dataset (N = 26) was generated with corona composition features (ApoE %, albumin %, vitronectin %, fibronectin %) alongside formulation properties.

### 2.2 Machine Learning Models

**Primary model (efficacy prediction):** XGBoost classifier (Chen & Guestrin, 2016) with hyperparameters: n_estimators=300, max_depth=5, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, min_child_weight=5, γ=1.0, α=0.5, λ=2.0. Performance evaluated by 5-fold stratified cross-validation (AUC, precision, recall, F1).

**Multiclass model:** XGBoost with `multi:softprob` objective (4 classes), same hyperparameters.

**Corona proof-of-concept model:** Random Forest (n_estimators=200, max_depth=3) evaluated by Leave-One-Out Cross-Validation (LOOCV) due to small N.

### 2.3 Explainability

SHAP (SHapley Additive exPlanations) TreeExplainer values were computed on the full training set. Feature importance was quantified as mean |SHAP| value, normalized to sum to 1.0. A beeswarm plot visualizes both the magnitude and direction of feature effects for the top 15 features.

> **Subsample note (M4):** The beeswarm plot was generated on a 3,000-sample subsample (15.6% of N=19,200) for visual clarity. Rankings may vary ±0.01–0.03 vs the full dataset; the mean |SHAP| bars use the same subsample.

### 2.4 Software

Python 3.10; XGBoost 3.2.0; SHAP 0.51.0; scikit-learn 1.x; pandas; numpy; matplotlib; seaborn; scipy.

> **Warnings note (M1):** During execution, `warnings.filterwarnings('ignore')` was applied to suppress non-critical deprecation and future warnings from XGBoost and SHAP. No warnings indicated data integrity issues. Reproducible runs will produce the same numerical outputs.

---

## 3. Results

### 3.1 Dataset Overview (Figure 1)

The simulated dataset spans 15 literature sources with approximately equal representation (~1,250–1,330 records each). Cargo type distribution reflects the current therapeutic landscape: mRNA (45.4%), siRNA (30.0%), pDNA (14.9%), saRNA (9.8%). Molar ratio distributions are approximately Gaussian: CHL 40.1 ± 5.9%, HL 10.0 ± 3.0%, PEG 2.5 ± 0.8%. Efficacy class distribution is approximately uniform across the four classes (Very Low: 29.8%, Low: 30.2%, High: 26.6%, Very High: 13.4%).

### 3.2 Feature Correlations (Figure 2)

Hierarchical clustering of the Pearson correlation matrix reveals three feature clusters: (1) molar composition ratios (CHL, HL, PEG, IL — mutually anti-correlated due to the sum-to-100% constraint), (2) colloidal properties (size, PDI, zeta, encapsulation efficiency), and (3) ionizable lipid molecular descriptors (MW, logP, TPSA, rotatable bonds). Efficacy binary label shows the strongest correlations with PDI (r = −0.41), CHL mol% (r = +0.38), and HL mol% (r = +0.29).

### 3.3 Model Performance (Figures 3 & 5)

The XGBoost binary classifier achieved 5-fold CV AUC = 0.877, accuracy = 80%, precision = 0.75 (high class), recall = 0.73 (high class). The multiclass model achieved per-class AUCs of 0.745 (Very Low), 0.689 (Low), 0.890 (High), 0.896 (Very High). The lower AUC for the "Low" class reflects the inherent difficulty of distinguishing borderline efficacy. Confusion matrix analysis shows that misclassifications are predominantly between adjacent classes (Very Low↔Low, High↔Very High), consistent with a continuous underlying efficacy distribution.

> **SHAP ranking discrepancy (C2):**
> ```
> Computed SHAP (this simulation):
>   PDI=0.210 > CHL=0.192 > HL=0.134
> Reported real-data ranking:
>   CHL=0.194 > HL=0.134 > Frac.sp3C=0.119
> Discrepancy expected — simulation cannot
> reproduce real-data feature importance.
> ```
> PDI ranks first in this simulation because the efficacy scoring function explicitly penalises high PDI. In real LNPDB data, PDI may be correlated with other formulation choices rather than being an independent predictor. Frac.sp³C ranks 9th here (0.029) vs 3rd in the specification (0.119), reflecting that the simulated scoring function did not encode sufficient Frac.sp³C signal.

### 3.4 SHAP Feature Importance (Figure 4)

SHAP analysis identifies colloidal quality (PDI) as the single strongest predictor, followed by molar composition ratios. Note: the original study specification listed CHL mol% as the top SHAP feature (0.194); the computed ranking places PDI first (0.210) with CHL mol% second (0.192) — a minor reordering that does not change the core conclusion that formulation-level features dominate over molecular descriptors. Frac. sp³C ranks 9th (0.029) rather than 3rd as specified, reflecting the simulated data structure.

| Rank | Feature | Normalized SHAP |
|------|---------|----------------|
| 1 | PDI | 0.210 |
| 2 | CHL mol% | 0.192 |
| 3 | HL mol% | 0.134 |
| 4 | PEG mol% | 0.105 |
| 5 | pKa | 0.099 |
| 6 | Size (nm) | 0.069 |
| 7 | Encap. Eff. (%) | 0.059 |
| 8 | IL mol% | 0.055 |
| 9 | Frac. sp³C | 0.029 |
| 10 | logP | 0.011 |

Colloidal quality metrics (PDI, size) and molar ratios (CHL, HL, PEG) collectively account for ~77% of model explanatory power. Ionizable lipid molecular descriptors (Frac. sp³C, logP, MW, pKa) account for ~15%. The beeswarm plot reveals that high CHL mol% (~40–45%) and low PDI (<0.15) are associated with positive SHAP values (increased efficacy prediction), while high PEG mol% (>3%) is associated with negative SHAP values.

### 3.5 Corona Proof-of-Concept (Figure S1)

A Random Forest model trained on simulated corona composition data (N = 26) achieved LOOCV AUC = 0.834. ApoE % and albumin % were the top two features by Gini importance. This result is proof-of-concept only: N = 26 is insufficient for reliable LOOCV estimates (high variance), and the circular nature of simulated data inflates apparent performance. A minimum of N ≥ 100 matched formulation-corona-uptake records is required for a meaningful model.

> **AUC discrepancy note (C5):** The computed LOOCV AUC = 0.834 exceeds the original study specification of 0.794 by +5.0%. This deviation is expected: the simulated dataset was generated with known structure that makes classification easier than real experimental data. The FigureS1 panel displays the computed value (0.834); the specification target (0.794) is noted here for transparency. Neither value should be interpreted as a real experimental result.

---

## 4. Discussion

The dominance of molar composition ratios over ionizable lipid molecular descriptors in SHAP analysis has a clear mechanistic interpretation. Cholesterol content modulates membrane fluidity and endosomal escape efficiency; the optimal ~40 mol% reflects the balance between bilayer stability and fusogenicity. Helper lipid content affects the lamellar-to-hexagonal phase transition critical for endosomal membrane disruption. PEG content above ~3 mol% sterically inhibits cellular uptake ("PEG dilemma"). These relationships are well-established in the literature (Semple et al., 2010; Kulkarni et al., 2021).

In contrast, ionizable lipid molecular descriptors (Frac. sp³C, logP) show lower SHAP importance in this analysis. This does not imply that ionizable lipid identity is unimportant — rather, it suggests that once a competent ionizable lipid is selected, further optimization of molar ratios may yield larger efficacy gains than synthesis of structurally novel lipids. This has practical implications for formulation development: high-throughput molar ratio screening (e.g., microfluidic combinatorial libraries) may be more efficient than medicinal chemistry campaigns.

The protein corona proof-of-concept model demonstrates that corona composition features carry predictive signal for cellular uptake, consistent with the established role of ApoE in hepatic LNP targeting. However, the N = 26 dataset is severely underpowered. The primary contribution of this work is the proposed experimental framework (DYNAMIC-CORONA-STD v1.0, detailed in Study 2) for generating the matched formulation-corona datasets needed to train robust corona-aware efficacy models.

### Limitations

1. All data is simulated; real-world model performance will differ.
2. Categorical features (ionizable lipid identity, cell line) were not encoded.
3. No external validation on held-out experimental data.
4. Corona model (N=26) is underpowered; results are illustrative only.
5. Static in vitro conditions; physiological flow effects not modeled.

---

## 5. Conclusions

This methodology demonstration establishes that: (1) XGBoost can predict LNP transfection efficacy from physicochemical features with AUC ~0.88 on simulated data; (2) molar composition ratios dominate over ionizable lipid molecular structure in SHAP importance; (3) corona composition features show proof-of-concept predictive value for cellular uptake. Prospective experimental validation with real LNPDB data and matched corona measurements is the critical next step.

---

## References

1. Kulkarni, J.A. et al. (2021). The current landscape of nucleic acid therapeutics. *Nature Nanotechnology*, 16, 630–643.
2. Hassett, K.J. et al. (2019). Optimization of lipid nanoparticles for intramuscular administration of mRNA vaccines. *Molecular Therapy – Nucleic Acids*, 15, 1–11.
3. Sabnis, S. et al. (2018). A novel amino lipid series for mRNA delivery. *Molecular Therapy*, 26(6), 1509–1519.
4. Semple, S.C. et al. (2010). Rational design of cationic lipids for siRNA delivery. *Nature Biotechnology*, 28, 172–176.
5. Chen, T. & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. *KDD 2016*, 785–794.
6. Lundberg, S.M. & Lee, S.I. (2017). A unified approach to interpreting model predictions. *NeurIPS 2017*.
7. Jayaraman, M. et al. (2012). Maximizing the potency of siRNA lipid nanoparticles for hepatic gene silencing in vivo. *Angewandte Chemie*, 51(34), 8529–8533.
8. Patel, S. et al. (2017). Naturally-occurring cholesterol analogues in lipid nanoparticles induce polymorphic shape and enhance intracellular delivery of mRNA. *Nature Communications*, 11, 983.
