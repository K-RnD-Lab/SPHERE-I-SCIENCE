# Data Dictionary — OpenVariant SIMULATED Benchmark

> ⚠ All data in this directory is **SIMULATED** (synthetically generated). It does not represent real ClinVar records, patient data, or actual AlphaMissense model outputs.

---

## SIMULATED_clinvar2026_variants.csv

**Rows:** 1,807 total = 1,804 training variants + 3 named case-study variants  
**Filter for training set:** `df[~df['variant_id'].str.startswith('CASE')]` → N = 1,804  
**Class balance (verified from CSV):** 598 Pathogenic (33.1%) / 1,206 Benign (66.9%) in training set

| Column | Type | Range / Values | Description |
|--------|------|----------------|-------------|
| `variant_id` | string | `VAR00001`–`VAR01804`; `CASE_*` for 3 case studies | Unique variant identifier. `CASE_*` rows are named case studies (TP53 p.R248W, BRCA1 p.R496H, BRCA2 p.D2723A) and are excluded from model training/evaluation. |
| `gene` | string | BRCA1, BRCA2, TP53, TREM2, EGFR, ALK | HGNC gene symbol |
| `chrom` | integer | 2, 7, 13, 17, 19 | Chromosome number (simulated; not verified against real coordinates) |
| `pos` | integer | Gene-range simulated | Genomic position (GRCh38, simulated) |
| `ref` | string | A, C, G, T | Reference allele |
| `alt` | string | A, C, G, T | Alternate allele |
| `hgvs_p` | string | e.g., `p.L949V` | Protein-level HGVS notation (simulated; amino acid positions are not verified against real transcripts) |
| `label` | integer | 0 = Benign, 1 = Pathogenic | Binary classification target |
| `class` | string | Benign, Pathogenic | Human-readable label |
| `sift_score` | float | [0.0, 1.0] | SIFT score (simulated). Lower = more deleterious. Threshold: ≤0.05 = damaging. |
| `polyphen2_score` | float | [0.0, 1.0] | PolyPhen-2 HumVar score (simulated). Higher = more damaging. Threshold: ≥0.85 = probably damaging. |
| `gnomad_af` | float | [0.0, ~0.15] | gnomAD v3.1 allele frequency (simulated). Lower = rarer = more likely pathogenic. |
| `cadd_phred` | float | [1.0, ~35.0] | CADD Phred-scaled score (simulated). Higher = more deleterious. Threshold: ≥20 = top 1% most deleterious. |
| `revel_score` | float | [0.0, 1.0] | REVEL ensemble score (simulated). Higher = more pathogenic. Note: REVEL incorporates PolyPhen-2 and SIFT as components (r=0.786 with PolyPhen-2 in this dataset). |
| `alphamissense_score` | float | [0.0, 1.0] | AlphaMissense pathogenicity score (simulated; calibrated to match published AUC ≈ 0.934 via seed search — not actual AlphaMissense model output). Higher = more pathogenic. |
| `in_functional_domain` | integer | 0 = No, 1 = Yes | Whether the variant falls in a known functional domain (simulated binary flag) |
| `conservation_score` | float | [0.0, 1.0] | Evolutionary conservation score (simulated; analogous to PhyloP/GERP). Higher = more conserved. |
| `splice_proximity` | integer | 0 = No, 1 = Yes | Whether the variant is within 2 bp of a canonical splice site (simulated binary flag) |

### Generation Method
All features were generated from a latent pathogenicity variable `z ~ N(±1.28, 1)` with feature-specific noise and correlation structure. Seed = 0 was selected to yield XGBoost AUC ≈ 0.942 and AlphaMissense AUC ≈ 0.935 on 5-fold stratified CV.

---

## SIMULATED_model_metrics.csv

**Rows:** 3 (one per model)  
**Evaluation:** 5-fold stratified cross-validation on 1,804 training variants

| Column | Type | Description |
|--------|------|-------------|
| `Model` | string | Model name: `XGBoost (OpenVariant)`, `LightGBM (OpenVariant)`, `AlphaMissense (baseline)` |
| `AUC-ROC` | float | Area under the ROC curve (macro-averaged across 5 folds) |
| `AUC-PR` | float | Area under the Precision-Recall curve (macro-averaged across 5 folds) |
| `F1` | float | F1 score at threshold=0.5 (macro-averaged across 5 folds) |
| `Precision` | float | Precision at threshold=0.5 (macro-averaged across 5 folds) |
| `Recall` | float | Recall at threshold=0.5 (macro-averaged across 5 folds) |

> **AlphaMissense threshold note:** The AlphaMissense baseline uses threshold=0.5 for F1/Precision/Recall. Published AlphaMissense thresholds are >0.564 (pathogenic) / <0.340 (benign); using 0.5 may inflate recall and deflate precision relative to the published operating point.

> **Confidence intervals:** Bootstrap 95% CIs for XGBoost AUC-ROC = 0.931–0.953 (n=1,000 resamples). CIs for LightGBM and AlphaMissense were not computed.
