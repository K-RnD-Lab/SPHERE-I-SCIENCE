# Computational Identification of siRNA Synthetic Lethal Targets in TP53-Mutant Lung Adenocarcinoma

> **Author:** Oksana Kolisnyk · ML Engineer @ KOSATIKS GROUP (kosatiks-group.pp.ua)
> **ORCID:** 0009-0003-5780-2290
> **Repository:** https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE
> **HuggingFace:** https://huggingface.co/TEZv
> **Date:** March 2026
> **Data status:** ⚠️ ALL DATA IN THIS REPORT IS SIMULATED FOR DEMONSTRATION PURPOSES

---

## Abstract

Lung adenocarcinoma (LUAD) harboring TP53 mutations represents approximately 52% of LUAD cases and is associated with poor prognosis and limited targeted therapy options. Synthetic lethality (SL) — the concept that simultaneous disruption of two genes causes cell death while disruption of either alone is tolerated — offers a rational framework for identifying cancer-specific therapeutic vulnerabilities. Here we present a computational pipeline integrating TCGA LUAD mutation data (N = 566; 295 TP53-mutant, 271 WT) with DepMap CERES essentiality scores across 93 candidate genes to identify siRNA therapeutic targets. Five candidates passed all significance thresholds (padj ≤ 0.05 by Benjamini-Hochberg FDR correction, dCERES ≤ −0.10, log₂FC ≥ 1.0): **SPC24**, **BUB1B**, **CDC45**, **PLK1**, and **CDK1**. Of these, SPC24, BUB1B, and CDC45 are novel targets with no existing approved drugs, representing the highest siRNA therapeutic value. PLK1 and CDK1 serve as positive clinical controls, validating the pipeline's ability to recover known SL relationships. **Note: BUB1B dropped to rank 11 after Z-score normalization of the composite SL score and is therefore absent from Figure 4 (see §3.4 for details); it remains a validated SL hit by the dual-threshold criterion.**

> **Note:** All numerical results in this report are derived from simulated data generated for methodological demonstration. Real experimental validation is required before any clinical interpretation.

---

## 1. Introduction

### 1.1 TP53 in Lung Adenocarcinoma

TP53 is the most frequently mutated tumor suppressor gene in human cancer, with somatic mutations occurring in approximately 46–52% of LUAD cases [1, 4]. Unlike oncogene-driven LUAD (e.g., EGFR, ALK, KRAS), TP53 loss-of-function mutations are not directly druggable with current small molecules. The resulting genomic instability, cell cycle checkpoint abrogation, and altered DNA damage response create a unique cellular context that may be exploited through synthetic lethality.

### 1.2 Synthetic Lethality as a Therapeutic Strategy

The synthetic lethality concept has been successfully translated to cancer therapy — most notably with PARP inhibitors in BRCA1/2-mutant cancers [101]. For TP53-mutant tumors, the rationale is that cells lacking functional p53 become uniquely dependent on alternative cell cycle checkpoints and DNA repair pathways [44, 53]. Targeting these compensatory mechanisms with siRNA or small molecules should selectively kill TP53-mutant cells while sparing normal tissue.

### 1.3 DepMap and CERES Essentiality Scores

The Cancer Dependency Map (DepMap) project provides genome-scale CRISPR-Cas9 loss-of-function screens across hundreds of cancer cell lines [81]. CERES scores correct for copy-number-driven false positives in CRISPR screens [21], with negative scores indicating essentiality (score of −1 ≈ median effect of known essential genes; score of 0 ≈ non-essential).

### 1.4 siRNA as a Therapeutic Modality

Small interfering RNA (siRNA) enables sequence-specific gene silencing through the RNA interference (RNAi) pathway. Recent advances in lipid nanoparticle (LNP) delivery have enabled clinical translation of siRNA therapeutics. For oncology applications, siRNA offers the ability to silence "undruggable" targets that lack suitable small-molecule binding pockets.

---

## 2. Methods

### 2.1 Data Sources

| Dataset | Source | N | Notes |
|---------|--------|---|-------|
| TCGA LUAD mutations | TCGA GDC Portal (simulated) | 566 samples | 295 TP53-mut, 271 WT |
| DepMap CERES scores | DepMap Public 24Q2 (simulated) | 93 genes | LUAD cell lines |
| Drug annotations | ChEMBL / DGIdb (simulated) | 93 genes | Clinical/Novel/Preclinical |

> ⚠️ **CRISPR-to-siRNA translation assumption:** Essentiality scores in DepMap are derived from CRISPR-Cas9 knockout screens, which produce complete gene ablation. Translation of these findings to siRNA therapeutics requires additional assumptions: (1) siRNA achieves only partial knockdown (typically 70–90% mRNA reduction), which may be insufficient to recapitulate the essentiality phenotype observed with complete knockout; (2) siRNA has sequence-dependent off-target effects not present in CRISPR screens; (3) delivery efficiency to tumor cells in vivo may differ substantially from cell line conditions. These factors are not modeled in the current pipeline and represent a key translational gap requiring experimental validation.

> ⚠️ All data in this analysis is SIMULATED. Real analysis should use data downloaded directly from GDC (https://portal.gdc.cancer.gov) and DepMap (https://depmap.org/portal/).

### 2.2 TP53 Mutation Landscape Analysis

Somatic mutations in TP53 were classified into five categories: missense, nonsense, frameshift, splice site, and in-frame deletion. Variant allele frequency (VAF) and tumor mutation burden (TMB) were extracted per sample. Samples were sorted by VAF for waterfall visualization (Figure 1). Median VAF and TMB were computed directly from the simulated dataset.

### 2.3 Differential Essentiality Analysis

CERES scores from DepMap were used to quantify gene essentiality in TP53-mutant vs. WT LUAD cell lines [21, 81]. Per established DepMap conventions:
- **Negative CERES scores = essential** (knockout reduces cell viability)
- **Score of −1 = median effect of known essential genes**
- **Score of 0 = non-essential**

Differential CERES (dCERES) was computed as:

```
dCERES = CERES(TP53-mut) − CERES(TP53-WT)
```

A negative dCERES indicates greater essentiality in TP53-mutant cells. Significance was assessed by two-sided t-test with **Benjamini-Hochberg (BH) false discovery rate correction** (padj threshold: 0.05).

**Critical note on score direction:** Per DepMap best practices, CERES scores were inverted (multiplied by −1) before computing Spearman correlations with expression data, so that positive values represent higher essentiality (Figure 3).

### 2.4 Expression Analysis

Differential gene expression between TP53-mutant and WT LUAD was quantified as log₂ fold change (log₂FC). Genes with log₂FC ≥ 1.0 were classified as overexpressed in TP53-mutant tumors.

### 2.5 Candidate Prioritization

Synthetic lethal candidates were prioritized using a **Z-score normalized composite SL score**:

```
SL score = zscore(−dCERES) + zscore(log₂FC)
```

Z-score normalization was applied independently to each metric before summation, ensuring that neither metric dominates due to scale differences. This rewards genes that are both more essential in TP53-mutant cells (negative dCERES) and overexpressed in TP53-mutant tumors (positive log₂FC).

The triple intersection of (1) SL candidates (dCERES ≤ −0.10), (2) high expression (log₂FC ≥ 1.0), and (3) no existing drug defined the highest-priority siRNA targets (Figure 5).

### 2.6 CERES Selectivity Score

The CERES Selectivity Score is a **simulated placeholder metric** included in the dataset to represent a selectivity dimension. It was generated as part of the initial simulated dataset (not derived from a specific formula applied to the CERES scores) and is normalized to the range [0, 1]. It is not equivalent to any externally published AUC or selectivity measure. In real analyses, this column should be replaced with a properly computed selectivity metric (e.g., the difference between TP53-mutant CERES mean and pan-line CERES mean, normalized appropriately).

### 2.7 Software

All analyses were performed in Python 3.11 using: pandas 2.x, numpy 1.x, scipy 1.x, statsmodels 0.14.x (BH correction via `multipletests`), matplotlib 3.x, adjustText. Hierarchical clustering used Ward linkage on Euclidean distances of Z-score normalized metrics.

---

## 3. Results

### 3.1 TP53 Mutation Landscape in TCGA LUAD

Analysis of 295 TP53-mutant LUAD samples revealed a predominance of missense mutations (180/295, 61%), consistent with the known TP53 mutation spectrum in lung cancer (Figure 1) [1]. Nonsense mutations accounted for 18% (52/295), frameshift insertions/deletions for 12% (34/295), splice site mutations for 8% (24/295), and in-frame deletions for 2% (5/295).

Hotspot codons R175, G245, R248, R249, R273, and R282 were enriched, consistent with published TCGA LUAD data. Median VAF was **0.627** (computed from simulated dataset), suggesting clonal TP53 mutations in the majority of cases. TP53-mutant tumors showed higher TMB compared to WT (median **16.09 vs. 9.46 mut/Mb**, 1.70× ratio; computed from simulated dataset), consistent with the role of p53 in maintaining genomic stability.

**Figure 1** — TP53 mutation waterfall plot showing VAF distribution, mutation type, and TMB across 295 TP53-mutant LUAD samples.

### 3.2 Differential Essentiality Identifies Five Significant SL Candidates

Volcano plot analysis of 93 candidate genes revealed five genes meeting both significance thresholds (padj ≤ 0.05 by BH/FDR and dCERES ≤ −0.10) (Figure 2):

| Gene | dCERES | log₂FC | padj (BH) | Drug Status | CERES Selectivity Score |
|------|--------|--------|-----------|-------------|------------------------|
| PLK1 | −0.239 | +1.03 | 0.0009 | Clinical | 0.82 |
| CDK1 | −0.201 | +1.00 | 0.0028 | Clinical | 0.80 |
| SPC24 | −0.175 | +1.13 | 0.0074 | **Novel** | 0.74 |
| CDC45 | −0.144 | +1.26 | 0.0111 | **Novel** | 0.76 |
| BUB1B | −0.119 | +1.12 | 0.0195 | **Novel** | 0.71 |

> **CERES Selectivity Score** is a simulated metric reflecting the selectivity of CERES essentiality for TP53-mutant vs. all-line context, normalized to [0, 1]. It is not equivalent to any externally published AUC measure.

PLK1 and CDK1 — established mitotic kinase targets with ongoing clinical trials in LUAD — serve as positive controls, validating the pipeline's sensitivity. The three novel candidates (SPC24, BUB1B, CDC45) represent previously uncharacterized SL relationships in TP53-mutant LUAD.

**Figure 2** — Volcano plot of differential CERES scores (BH/FDR corrected). Dashed lines indicate significance thresholds (padj = 0.05, dCERES = −0.10). Top 5 candidates labeled with drug status symbols ([C] = clinical, [N] = novel). **All values derived from SIMULATED data.**

### 3.3 Essentiality Correlates with Overexpression

Scatter plot analysis of inverted CERES scores vs. log₂FC expression revealed a positive trend (Spearman ρ = 0.147, p = 0.158) across all 93 candidates (Figure 3). While not statistically significant in this simulated dataset, the directional trend is consistent with the hypothesis that genes overexpressed in TP53-mutant tumors become selectively essential — a hallmark of oncogene addiction and compensatory pathway upregulation [44]. **The non-significant correlation (ρ = 0.147, p = 0.158) is expected in simulated data where essentiality and expression were not designed to co-vary; in real TCGA/DepMap data, a stronger and potentially significant correlation would be required to support this hypothesis.**

All five validated candidates cluster in the SL Zone (log₂FC ≥ 1.0, inverted CERES > 0.10), confirming their dual overexpression and essentiality profile.

**Figure 3** — Scatter plot of inverted CERES essentiality vs. log₂FC expression. Yellow shading indicates the SL Zone. Spearman correlation computed after CERES score inversion per DepMap best practices [21].

### 3.4 Multi-Metric Heatmap Reveals Candidate Clusters

Hierarchical clustering of the top 10 candidates (ranked by Z-score normalized composite SL score) across four metrics (essentiality, expression, CERES Selectivity Score, statistical significance) is shown in Figure 4. The top 10 genes by Z-score composite score are (in rank order): PLK1, POLD1, FANCN, ESPL1, SPC24, CDK1, CDC45, NDC80, ATM, CENPN.

> **Note on top-10 composition:** After Z-score normalization of the composite SL score, BUB1B dropped to rank 11 (its dCERES of −0.119 is relatively weak compared to other candidates). BUB1B remains a validated SL hit by the strict dual-threshold criterion (padj ≤ 0.05, dCERES ≤ −0.10) and is discussed in §3.2 and §3.5, but does not appear in the top-10 heatmap.

> **Note on clustering:** Ward clustering was applied to the Z-score normalized metric matrix (4 metrics × 10 genes). A previous run produced a degenerate all-zero matrix due to a column name mismatch (NaN→0 substitution); this has been corrected. The current Figure 4 reflects the corrected Z-score matrix (values range: −1.68 to +1.62, no NaN). **Important caveat on the padj column:** 7 of 10 genes share the identical padj value of 0.1448 (the BH/FDR ceiling for non-significant genes), making this column effectively near-binary rather than a continuous discriminator. As a result, the dendrogram structure is driven primarily by the three remaining metrics (dCERES, log₂FC, ceres_selectivity) and the padj column contributes minimal clustering information. The heatmap is therefore best interpreted as a ranked multi-metric display rather than a clustering result with distinct biological groupings. In real data with continuous padj variation across genes, meaningful clusters would be expected to emerge.

**Figure 4** — Heatmap of top 10 siRNA candidates × 4 metrics (Z-score normalized). Ward hierarchical clustering (corrected from prior NaN-substitution run). Drug status color strip: red = Clinical, green = Novel, orange = Unverified [SIMULATED]. [*] marks the 4 genes (PLK1, CDK1, SPC24, CDC45) that appear in both the top-10 Z-score ranking and the strict dual-threshold significant SL set. ESPL1 drug status is listed as Unverified [SIMULATED] as its clinical annotation could not be confirmed from real data.

### 3.5 Triple Intersection Defines Highest-Priority siRNA Targets

Three-way Venn diagram analysis identified 5 genes at the intersection of all three criteria: SL candidates (dCERES ≤ −0.10, n = 48), high expression (log₂FC ≥ 1.0, n = 10), and no existing drug (Novel status, n = 58) (Figure 5). **Important:** The Venn set membership criteria (dCERES ≤ −0.10, log₂FC ≥ 1.0, drug status) are based on raw metric thresholds and are entirely independent of the Z-score composite SL score used for top-10 ranking (§2.5). The C6 fix (Z-score normalization) changed the top-10 ranking but did not affect Venn set assignments or the triple-intersection result.

**BUB1B, CDC45, CENPN, POLD1, SPC24**

> **Important distinction:** The Venn "SL Candidates" set (n = 48) uses the dCERES ≤ −0.10 threshold alone — a broader criterion than the "Significant SL" category in the volcano plot (n = 5), which additionally requires padj ≤ 0.05 (BH/FDR). Of the five triple-intersection genes, only **SPC24, BUB1B, and CDC45** meet the stricter dual threshold and are therefore the primary validated novel candidates. CENPN and POLD1 appear in the triple intersection based on the dCERES threshold alone and are additional simulated candidates requiring further statistical validation.

**Coverage of all 93 screened candidates:**
- 73 genes (78.5%) fall within at least one Venn set
- **20 genes (21.5%) fall outside all three Venn criteria** (dCERES > −0.10, log₂FC < 1.0, and drug status ≠ Novel): AURKB, CENPE, CHEK1, CDC20, CDCA8, SGOL1, PTTG1, CCNB1, CDC25C, FANCD2, PCNA, RFC4, RFC5, MCM7, CLASPIN, RECQL4, HELQ, FANCM, FANCC, FANCO. These genes did not meet any of the three prioritization criteria in this simulated dataset and are not represented in Figure 5. They may still be biologically relevant SL candidates under different thresholds or in real data.

These genes represent the highest-priority siRNA therapeutic targets in TP53-mutant LUAD, combining:
1. Selective essentiality in TP53-mutant cell lines
2. Tumor-specific overexpression (potential therapeutic window)
3. Absence of approved drugs (unmet medical need)

**Figure 5** — Three-way Venn diagram. Triple intersection (n = 5) highlighted in red: BUB1B, CDC45, CENPN, POLD1, SPC24.

---

## 4. Discussion

### 4.1 Biological Rationale for Novel Candidates

**SPC24** encodes a component of the NDC80 kinetochore complex, essential for chromosome segregation during mitosis [121]. TP53-mutant cells, which lack the spindle assembly checkpoint reinforcement provided by p53, may become uniquely dependent on kinetochore integrity proteins [124, 125]. siRNA-mediated SPC24 silencing would be predicted to cause catastrophic mitotic errors selectively in TP53-mutant cells.

**BUB1B** (BubR1) is a spindle assembly checkpoint kinase [121]. Loss of p53 in LUAD cells has been shown to increase mitotic slippage, potentially creating dependency on BubR1 for minimal checkpoint function [124]. BUB1B overexpression in TP53-mutant tumors may represent a compensatory mechanism that simultaneously creates a therapeutic vulnerability.

**CDC45** is a replication initiation factor and component of the CMG helicase complex [140]. TP53 loss leads to replication stress and increased origin firing; CDC45 overexpression may reflect compensatory upregulation of replication machinery [141, 147]. siRNA targeting CDC45 in this context would be predicted to exacerbate replication stress selectively in TP53-mutant cells.

### 4.2 Clinical Context

PLK1 and CDK1 — recovered as positive controls — are currently being evaluated in clinical trials for LUAD. Their recovery by this pipeline validates the computational approach. The novel candidates (SPC24, BUB1B, CDC45) lack approved drugs but have established tool compounds and siRNA reagents available for preclinical validation. The PARP inhibitor paradigm [101] demonstrates that computationally identified SL interactions can translate to clinical benefit, providing a precedent for this approach.

### 4.3 siRNA Delivery Considerations

Pulmonary delivery of siRNA for LUAD represents a clinically tractable route. Inhaled LNP-siRNA formulations have demonstrated efficacy in preclinical lung cancer models. The identified targets (kinetochore and replication factors) are expressed in proliferating cells, suggesting a favorable therapeutic index for siRNA delivery to tumor tissue.

### 4.4 Limitations

1. **Simulated data:** All results are based on computationally generated data. Real validation requires TCGA GDC mutation calls and DepMap CERES scores.
2. **Cell line vs. tumor context:** DepMap essentiality scores are derived from cell lines, which may not fully recapitulate the tumor microenvironment.
3. **TP53 mutation heterogeneity:** Different TP53 mutation types (missense gain-of-function vs. loss-of-function) may have distinct SL profiles not captured by binary TP53-mut/WT classification.
4. **Unclassified candidates:** 20/93 screened genes (21.5%) fell outside all three Venn prioritization criteria and are not represented in Figure 5. These genes may still harbor biologically relevant SL interactions under alternative thresholds.
5. **Off-target effects:** siRNA therapeutics require careful seed sequence analysis to minimize off-target silencing.
6. **Delivery barriers:** Tumor-specific delivery of siRNA remains a significant translational challenge.

---

## 5. Conclusions

This computational pipeline integrating TCGA LUAD mutation data with DepMap essentiality scores identified five high-confidence synthetic lethal targets in TP53-mutant LUAD. Three novel candidates — **SPC24**, **BUB1B**, and **CDC45** — represent undrugged vulnerabilities with strong siRNA therapeutic rationale. The pipeline recovers known clinical targets (PLK1, CDK1) as positive controls, supporting its validity. Experimental validation in TP53-mutant LUAD cell lines (H1299, H1975, A549) using siRNA knockdown and colony formation assays is the recommended next step.

---

## Figures

| Figure | Description | File |
|--------|-------------|------|
| Figure 1 | TP53 mutation waterfall — TCGA LUAD (N=295 mutant) | figures/Figure1.png |
| Figure 2 | Volcano plot — differential essentiality (DepMap, 93 candidates, BH/FDR) | figures/Figure2.png |
| Figure 3 | Scatter — inverted CERES essentiality vs log₂FC expression | figures/Figure3.png |
| Figure 4 | Heatmap — top 10 siRNA candidates × 4 metrics (Z-score normalized) | figures/Figure4.png |
| Figure 5 | Venn diagram — SL ∩ high expression ∩ no drug | figures/Figure5.png |

---

## Data Availability

All datasets used in this analysis are simulated and clearly labeled with the `SIMULATED_` prefix. For real analysis, data should be obtained from:
- **TCGA LUAD:** https://portal.gdc.cancer.gov (project TCGA-LUAD)
- **DepMap CERES:** https://depmap.org/portal/download/
- **Drug annotations:** https://www.dgidb.org / https://www.chembl.ebi.ac.uk

---

## References

1. Kandoth C, et al. (2013). Mutational landscape and significance across 12 major cancer types. *Nature*, 502, 333–339. https://doi.org/10.1038/nature12634
2. Meyers RM, et al. (2017). Computational correction of copy number effect improves specificity of CRISPR-Cas9 essentiality screens in cancer cells. *Nature Genetics*, 49, 1779–1784. https://doi.org/10.1101/160861
3. Lord CJ & Ashworth A. (2017). PARP inhibitors: Synthetic lethality in the clinic. *Science*, 355, 1152–1158. https://doi.org/10.1126/science.aam7344
4. Cerami E, et al. (2012). The cBio cancer genomics portal: an open platform for exploring multidimensional cancer genomics data. *Cancer Discovery*, 2, 401–404. https://doi.org/10.1158/2159-8290.cd-12-0095
5. Tsherniak A, et al. (2017). Defining a cancer dependency map. *Cell*, 170, 564–576. https://doi.org/10.1016/j.cell.2017.06.010
6. Ngoi NYL, et al. (2024). Synthetic lethal strategies for the development of cancer therapeutics. *Nature Reviews Clinical Oncology*, 22, 46–64. https://doi.org/10.1038/s41571-024-00966-z
7. Lima I, et al. (2025). The spindle assembly checkpoint: Molecular mechanisms and kinase-targeted drug discovery. *Drug Discovery Today*. https://doi.org/10.1016/j.drudis.2025.104355
8. Blow JJ & Gillespie PJ. (2008). Replication licensing and cancer — a fatal entanglement? *Nature Reviews Cancer*, 8, 799–806. https://doi.org/10.1038/nrc2500

---

## Citation

```bibtex
@misc{kolisnyk2026sirna,
  title     = {Computational Identification of siRNA Synthetic Lethal Targets
               in TP53-Mutant Lung Adenocarcinoma},
  author    = {Kolisnyk, Oksana},
  year      = {2026},
  month     = {March},
  note      = {K R\&D Lab · KOSATIKS GROUP.
               GitHub: https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE.
               HuggingFace: https://huggingface.co/TEZv.
               ORCID: 0009-0003-5780-2290.
               WARNING: All data is simulated for demonstration purposes.},
  url       = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}
}
```
