# lncRNA Regulatory Networks Controlling TREM2-Dependent Microglial Inflammation: Implications for Alzheimer's Therapy

**Author:** Oksana Kolisnyk | kosatiks-group.pp.ua
**ORCID:** 0009-0003-5780-2290
**Repository:** https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026
**Date:** 2026-03-06
**Project:** K R&D Lab — PHYLO-03

---

> **DATA TRANSPARENCY NOTICE**
> All RNA-seq count matrices and differential expression results in this study are **SIMULATED** data generated using negative-binomial distributions parameterised from published iPSC-microglia studies. They are provided for methodological illustration only and must not be interpreted as real experimental findings. ASO thermodynamic properties are computed from **real NCBI RefSeq sequences** (NR_186289.1, NR_024205.3). miRNA–target interaction confidence is based on **literature search evidence** (miRTarBase REST API was inaccessible during this analysis).

---

## Abstract

Alzheimer's disease (AD) is characterised by chronic neuroinflammation driven in part by dysfunctional microglia. TREM2 (Triggering Receptor Expressed on Myeloid cells 2) is a central regulator of microglial homeostasis, and its loss-of-function is associated with impaired phagocytosis and exacerbated inflammatory signalling. Long non-coding RNAs (lncRNAs) have emerged as key post-transcriptional regulators operating through competing endogenous RNA (ceRNA) mechanisms. Here we present a computational framework integrating simulated iPSC-derived microglia RNA-seq data, WGCNA-style co-expression network analysis, and literature-validated ceRNA interaction mapping to characterise two lncRNA regulatory axes — CYTOR→hsa-miR-138-5p→AKT1/NFKB1 and GAS5→hsa-miR-21-5p/miR-222-3p→PTEN/IL1B — in the context of TREM2-dependent neuroinflammation. We further identify two antisense oligonucleotide (ASO) candidates targeting accessible regions of GAS5 (position 119, NR_186289.1) and CYTOR (position 507, NR_024205.3), with GC content of 70% and Tm of 60°C computed from real transcript sequences. These findings provide a structured hypothesis framework for experimental validation of lncRNA-directed therapeutic strategies in AD.

**Keywords:** lncRNA, TREM2, microglia, ceRNA, CYTOR, GAS5, miR-138-5p, miR-21-5p, antisense oligonucleotide, Alzheimer's disease, neuroinflammation

---

## 1. Introduction

Alzheimer's disease affects over 55 million people worldwide and remains without disease-modifying therapy. Neuroinflammation, mediated by activated microglia, is now recognised as a central pathological driver rather than a secondary consequence of amyloid and tau pathology. TREM2, encoded on chromosome 6p21.1, is a transmembrane receptor expressed predominantly on microglia that regulates phagocytosis, survival, and inflammatory gene expression. Loss-of-function variants in TREM2 (notably R47H) confer a 2–4-fold increased AD risk, underscoring its therapeutic relevance.

Long non-coding RNAs (lncRNAs) — transcripts >200 nt with limited protein-coding potential — regulate gene expression at multiple levels including chromatin remodelling, transcriptional regulation, and post-transcriptional control via the ceRNA mechanism. In the ceRNA model, lncRNAs act as molecular sponges that sequester microRNAs (miRNAs), thereby de-repressing miRNA target mRNAs. Two lncRNAs are of particular interest in the neuroinflammatory context:

- **CYTOR** (Cytoskeleton Regulator RNA; also LINC00152), located at 2p11.2, is upregulated in multiple inflammatory contexts and has been shown to drive ceRNA networks in hepatocellular carcinoma and other cancers.
- **GAS5** (Growth Arrest Specific 5), located at 1q25.1, is a tumour suppressor lncRNA that is downregulated in inflammatory conditions and acts as a sponge for oncomiRs including miR-21-5p.

The miRNA mediators of these axes — hsa-miR-138-5p, hsa-miR-21-5p, and hsa-miR-222-3p — have well-characterised targets in the PI3K/AKT/NF-κB inflammatory signalling pathway, making them tractable nodes for therapeutic intervention.

Antisense oligonucleotides (ASOs) represent a clinically validated modality for targeting lncRNAs. By designing ASOs against accessible, single-stranded regions of the target transcript, it is possible to achieve RNase H-mediated degradation or steric blockade of lncRNA function.

This study presents a computational pipeline to: (1) characterise differential expression of key lncRNAs and inflammatory genes in TREM2-KO vs WT iPSC-derived microglia; (2) map and validate ceRNA interactions via literature search (miRTarBase API was inaccessible; see Methods 2.3); (3) perform WGCNA-style co-expression module analysis; (4) visualise the tripartite regulatory network; and (5) identify and characterise ASO candidates using real transcript sequences from NCBI RefSeq.

---

## 2. Methods

### 2.1 Data Simulation

In the absence of publicly available matched iPSC-microglia TREM2-KO RNA-seq datasets with the required experimental design, two synthetic count matrices were generated to illustrate the analytical framework. Counts were simulated using negative-binomial distributions parameterised with biologically realistic base means (log-normal, μ=4.5, σ=1.8) and dispersions (0.1 + 2.0/(μ+1)), consistent with published iPSC-microglia transcriptomics. Key genes of interest (TREM2, CYTOR, GAS5, AKT1, NFKB1, PTEN, IL1B, SPP1, P2RY12, CX3CR1, TNF, IL6, CSF1R, APOE, MKI67) were assigned effect sizes based on published TREM2-KO literature. Dataset 2 was generated with 85% of Dataset 1 effect sizes plus independent noise to simulate a biological replicate study. All simulated files are clearly labelled with the prefix `SIMULATED_`.

### 2.2 Differential Expression Analysis

> **⚠️ METHOD LIMITATION:** Differential expression was performed using a **Welch t-test on log₂-normalized counts (NOT equivalent to DESeq2; does not model count overdispersion; DEG counts are unreliable and should not be interpreted as real biological findings)**. Size factors were estimated using the geometric mean method. Normalised counts were log₂-transformed and Welch's t-test was applied per gene. P-values were adjusted using the Benjamini-Hochberg false discovery rate (FDR) procedure. Significance thresholds: padj ≤ 0.05 and |log₂FC| ≥ 0.5 (inclusive inequalities per best practice). A proper analysis would use DESeq2 or edgeR with negative-binomial GLMs; the DEG counts reported here (428/413) are illustrative only.

### 2.3 ceRNA Interaction Validation via Literature Search

Six ceRNA interactions were evaluated for experimental evidence via systematic literature search. Direct programmatic access to the miRTarBase REST API (mirtarbase.cuhk.edu.cn) was attempted but failed due to SSL handshake errors on all six queries; no miRTarBase records were retrieved directly. Validation is therefore based entirely on peer-reviewed primary literature identified through LiteratureSearch queries. Interactions were classified as:
- **CONFIRMED**: direct 3′UTR binding validated by luciferase reporter assay and/or Western blot in at least one primary study
- **INDIRECT**: pathway-level association without direct 3′UTR validation in the retrieved literature
- **NOT_CONFIRMED**: no experimental evidence found in the retrieved literature

**GAS5 transcript variant note:** GAS5 transcript variant NR_186289.1 (variant 49) was selected as the most recently deposited RefSeq entry. ASO position 119 is variant-specific — the same position in other GAS5 variants may have a different structural context or fall outside the transcript entirely. Variant selection requires experimental justification before proceeding to in vitro validation.

### 2.4 WGCNA-Style Co-expression Analysis

The top 2000 most variable genes (by variance across all 24 samples) were selected, with key genes of interest force-included. A signed co-expression network was constructed using soft-thresholding (power β=6) applied to Pearson correlation coefficients: adjacency = ((1 + r)/2)^6. Hierarchical clustering (average linkage) was performed on the dissimilarity matrix (1 − adjacency). Eight co-expression modules were identified by cutting the dendrogram at a fixed height. Module eigengenes (first principal component) were correlated with two traits: TREM2-KO status and dataset identity.

### 2.5 ASO Candidate Design

Transcript sequences for GAS5 (NR_186289.1, 846 nt) and CYTOR (NR_024205.3, 677 nt) were retrieved from NCBI RefSeq via Biopython Entrez. A 60-nucleotide window centred on each target position (GAS5 pos.119, CYTOR pos.507) was folded using ViennaRNA (RNAfold, MFE algorithm). The 20-mer ASO target window was extracted and characterised for:
- **GC content**: (G+C)/length × 100%
- **Tm**: Wallace rule: Tm = 64.9 + 41 × (nGC − 16.4) / n, where nGC = count of G+C bases (integer), n = oligonucleotide length
- **Accessibility**: fraction of unpaired (dot) positions in the ASO region of the predicted secondary structure

### 2.6 Visualisation

All figures were generated using matplotlib/seaborn (Python). ColorBrewer palettes were used throughout for colorblind accessibility. Figures were saved at 300 DPI (PNG) and as vector graphics (SVG).

---

## 3. Results

### 3.1 TREM2 Loss Drives Broad Transcriptional Reprogramming in iPSC-Microglia

Differential expression analysis of simulated TREM2-KO vs WT iPSC-microglia identified 428 DEGs in Dataset 1 (208 upregulated, 220 downregulated) and 413 DEGs in Dataset 2 (210 upregulated, 203 downregulated) at padj ≤ 0.05 and |log₂FC| ≥ 0.5 (Figure 1, Figure 2). **These counts are from a Welch t-test on log₂-normalized counts and are not equivalent to DESeq2 results.**

TREM2 itself showed the expected strong downregulation (log₂FC = −3.28 in DS1, −2.26 in DS2; padj < 0.001), confirming the validity of the simulated experimental design. Homeostatic microglial markers P2RY12 and CX3CR1 were downregulated (log₂FC = −1.68/−1.03 and −2.04/−1.02 respectively), consistent with published TREM2-KO phenotypes showing loss of homeostatic identity. Pro-inflammatory genes IL1B (log₂FC = +2.13/+2.31), IL6 (log₂FC = +2.05/+2.00, computed directly from SIMULATED_DE_results_dataset1/2.csv), and SPP1 (+2.50/+1.99) were strongly upregulated, reflecting the expected shift toward a disease-associated microglial (DAM) inflammatory state.

Critically, both ceRNA lncRNAs showed consistent upregulation: CYTOR (log₂FC = +2.20/+1.64) and GAS5 (log₂FC = +1.50/+1.50), suggesting their co-regulation with the inflammatory programme downstream of TREM2 loss.

### 3.2 WGCNA Co-expression Modules Segregate Homeostatic and Inflammatory Gene Sets

WGCNA-style analysis identified 8 co-expression modules (Figure 3). Key gene module assignments from this single simulation run are as follows:

| Module | Key genes | Biological interpretation |
|--------|-----------|--------------------------|
| M2 | AKT1, SPP1 | PI3K/AKT signalling module |
| M3 | GAS5, IL1B | Inflammatory lncRNA-cytokine module |
| M4 | NFKB1 | NF-κB transcriptional module |
| M5 | CYTOR | CYTOR-specific regulatory module |
| M7 | TREM2, PTEN, CX3CR1 | Homeostatic/TREM2-regulated module |
| M8 | P2RY12 | Homeostatic marker module |

> **⚠️ STOCHASTIC ARTEFACT WARNING:** Module assignments are stochastic artefacts of a single simulation run and will change with different random seeds. They carry no biological interpretation and must not be used to draw conclusions about real co-expression relationships.

Module-trait correlation analysis (Pearson r, computed from eigengenes vs TREM2-KO status, n=24 samples) yielded the following exact values:

| Module | r (KO status) | Key genes |
|--------|--------------|-----------|
| M7 | −0.938 | TREM2, PTEN, CX3CR1 |
| M8 | −0.828 | P2RY12 |
| M2 | +0.939 | AKT1, SPP1 |
| M3 | +0.923 | GAS5, IL1B |
| M5 | +0.888 | CYTOR |
| M4 | +0.863 | NFKB1 |
| M1 | +0.001 | — |
| M6 | −0.001 | — |

Modules M7 and M8 were negatively correlated with TREM2-KO status (r = −0.938 and −0.828 respectively), consistent with loss of homeostatic gene expression. Modules M2, M3, M4, and M5 showed strong positive correlation with KO status (r = +0.939, +0.923, +0.863, +0.888 respectively), reflecting inflammatory activation. Modules M1 and M6 showed near-zero correlation with KO status (r ≈ 0.001) and instead correlated perfectly with dataset identity (r = ±1.000), indicating they capture batch/dataset effects rather than biology.

### 3.3 ceRNA Interaction Validation

Six ceRNA interactions were evaluated via literature search (Figure 4, Table 1):

**Table 1. Literature-based ceRNA interaction validation summary**

| Interaction | Validation | Evidence | Validation cell type |
|-------------|-----------|---------|---------------------|
| miR-138-5p → AKT1 | CONFIRMED | Luciferase + Western blot (Ji et al. 2017) | Tongue squamous cell carcinoma (non-microglial) |
| miR-138-5p → NFKB1 | INDIRECT [INDIRECT — not experimentally validated in this cell type] | Pathway inference (AKT→NF-κB axis) | N/A — pathway-inferred only |
| miR-21-5p → PTEN | CONFIRMED | Multiple studies; systematic review (Bergez-Hernandez 2024) | Retinal pigment epithelium, pancreatic acinar cells, prostate (non-microglial) |
| miR-21-5p → IL1B | INDIRECT [INDIRECT — not experimentally validated in this cell type] | Pathway-level association via NF-κB/IL-6 signalling; no direct 3′UTR validation found | N/A — pathway-inferred only |
| miR-222-3p → PTEN | INDIRECT [INDIRECT — not experimentally validated in this cell type] | No direct 3′UTR luciferase validation found in literature for this interaction in microglia or related cell types | N/A — no direct validation found |
| miR-222-3p → IL1B | NOT_CONFIRMED | No experimental record found | N/A |

Only 2 of 6 interactions are directly confirmed by experimental 3′UTR evidence (miR-138-5p→AKT1 and miR-21-5p→PTEN). All confirmed interactions were validated in non-microglial cell types. The miR-222-3p→PTEN interaction was previously labelled CONFIRMED in an earlier version of this analysis; this was an error — the cited sources (Zhou et al. 2022; Wang et al. 2019) validate miR-222-3p→TIMP3 and prognostic associations respectively, not direct PTEN 3′UTR binding. This has been corrected to INDIRECT.

### 3.4 Tripartite ceRNA Network Architecture

The literature-validated ceRNA network (Figure 4) reveals a tripartite regulatory architecture in which:

1. **CYTOR** sequesters miR-138-5p, thereby de-repressing AKT1 (CONFIRMED) and (indirectly) NFKB1 [INDIRECT — not experimentally validated in this cell type]. In TREM2-KO microglia, upregulation of CYTOR would be predicted to increase AKT1 and NF-κB activity, amplifying inflammatory signalling.

2. **GAS5** sequesters both miR-21-5p and miR-222-3p. The miR-21-5p→PTEN axis is CONFIRMED across multiple cell types. The miR-222-3p→PTEN axis is INDIRECT [INDIRECT — not experimentally validated in this cell type]; no direct 3′UTR luciferase validation was found in the retrieved literature.

The convergence of both axes on the PI3K/AKT/NF-κB signalling hub provides a hypothesis framework for therapeutic intervention, but requires experimental validation in iPSC-derived microglia before any mechanistic conclusions can be drawn.

### 3.5 ASO Candidate Characterisation

ASO target windows were extracted from real NCBI RefSeq sequences (Figure 5):

**Table 2. ASO candidate properties (real NCBI sequences)**

| Property | GAS5 (pos.119) | CYTOR (pos.507) |
|----------|---------------|----------------|
| Accession | NR_186289.1 | NR_024205.3 |
| Transcript length | 846 nt | 677 nt |
| Target RNA (5′→3′) | CUGGGGAGAGGGGAACUGGC | GGCCUGGUUCCAACCGCCCA |
| ASO DNA (5′→3′) | GCCTGTTCCCCTCTCCCCTG | TGGGCGGTTGGTTCCTGGCC |
| GC content | 70% | 70% |
| Tm (Wallace rule) | 60°C | 60°C |
| Window MFE | −9.40 kcal/mol | −18.90 kcal/mol |
| Accessibility | 55% unpaired | 35% unpaired |
| Priority | HIGH | MODERATE |

**Important caveats:**
- Both ASO windows yield GC=70% and Tm=60°C from the real transcript sequences, higher than the 50%/46°C stated in the original research brief.
- Both candidate windows yield GC=70%, above the recommended 40–60% range. No sliding-window search for lower-GC accessible positions was performed. These positions were specified a priori and are not demonstrated to be optimal.
- High GC content (>65%) can promote G-quadruplex formation and reduce ASO specificity. Chemical modifications (e.g., 2′-MOE, LNA) may be required.
- Both candidates require experimental validation including RNase H cleavage assays and off-target profiling.

---

## 4. Discussion

This study presents a computational framework for characterising lncRNA-mediated ceRNA regulation in TREM2-dependent microglial neuroinflammation. The key conceptual contribution is the identification of two convergent regulatory axes — CYTOR→miR-138-5p→AKT1 and GAS5→miR-21-5p/miR-222-3p→PTEN — that both feed into the PI3K/AKT/NF-κB inflammatory signalling hub.

The upregulation of CYTOR and GAS5 in TREM2-KO microglia (as modelled in the simulated data) is consistent with a compensatory regulatory response to inflammatory activation. CYTOR upregulation would sequester miR-138-5p, releasing AKT1 from post-transcriptional repression and amplifying NF-κB-driven cytokine production. Simultaneously, GAS5 upregulation would protect PTEN, potentially acting as a brake on PI3K/AKT hyperactivation. This apparent paradox — both lncRNAs upregulated, with opposing effects on AKT activity — suggests a dynamic regulatory balance that may be context- and time-dependent.

The ASO design analysis reveals an important discrepancy with the original brief: real NCBI sequences at the specified positions yield GC=70%, not 50%. Both candidate windows yield GC=70%, above the recommended 40–60% range. No sliding-window search for lower-GC accessible positions was performed. These positions were specified a priori and are not demonstrated to be optimal. This highlights the critical importance of using real sequence data and performing systematic accessibility screening rather than relying on assumed properties in ASO design.

### Limitations

1. All RNA-seq data are simulated; biological conclusions require real experimental data.
2. DE analysis used Welch t-test on log₂-normalized counts — NOT equivalent to DESeq2. DEG counts (428/413) are unreliable and should not be interpreted as real biological findings.
3. Only 2/6 ceRNA interactions are directly confirmed by 3′UTR experimental evidence; all confirmations are in non-microglial cell types.
4. miR-222-3p→PTEN was incorrectly labelled CONFIRMED in an earlier version; corrected to INDIRECT.
5. WGCNA module assignments are stochastic artefacts of a single simulation run; they carry no biological interpretation.
6. The WGCNA implementation is a Python approximation; full analysis should use the R WGCNA package with proper soft-threshold selection.
7. ASO candidates require experimental validation (RNase H assay, off-target profiling, cellular uptake).
8. GAS5 has 50+ transcript variants; NR_186289.1 (variant 49) was selected without experimental justification. Position 119 is variant-specific.
9. No sliding-window ASO optimisation was performed; GC=70% is above the recommended range.

---

## 5. Conclusions

This computational study establishes a structured hypothesis framework for lncRNA-directed therapeutic intervention in TREM2-dependent neuroinflammation. The CYTOR→miR-138-5p→AKT1 and GAS5→miR-21-5p/miR-222-3p→PTEN axes represent literature-validated (2/6 interactions confirmed by direct 3′UTR experimental evidence in primary literature; all in non-microglial cell types; miRTarBase API was inaccessible) regulatory nodes with therapeutic potential. Two ASO candidates are identified from real NCBI transcript sequences, with GAS5 pos.119 (55% accessibility) ranked as the higher-priority target. Experimental validation in iPSC-derived microglia with TREM2 loss-of-function is the critical next step.

---

## Figures

- **Figure 1** — iPSC-Microglia Gene Expression Overview: TREM2-KO vs WT [SIMULATED]
- **Figure 2** — Differential Expression Volcano Plots (2 datasets) [SIMULATED; Welch t-test, not DESeq2]
- **Figure 3** — WGCNA Co-expression Network Analysis [SIMULATED; module assignments are stochastic]
- **Figure 4** — Tripartite ceRNA Regulatory Network [literature-validated; miRTarBase API unavailable; 2/6 CONFIRMED]
- **Figure 5** — ASO Candidate Analysis: Structure Accessibility & GC Content [Real NCBI sequences]

---

## References

1. Huang H-Y et al. miRTarBase update 2022: an informative resource for experimentally validated miRNA–target interactions. *Nucleic Acids Research* 50:D222–D230 (2022). https://doi.org/10.1093/nar/gkab1079

2. Ji M et al. Dysregulation of AKT1, a miR-138 target gene, is involved in the migration and invasion of tongue squamous cell carcinoma. *J Oral Pathol Med* 46:731–737 (2017). https://doi.org/10.1111/jop.12551

3. Li J et al. miRNA-21-5p targeting PTEN to regulate PI3K/Akt/mTOR pathway in retinal pigment epithelial cell photodamage. *Int J Ophthalmol* 18(4):575–581 (2025). https://doi.org/10.18240/ijo.2025.04.02

4. Zhao Z et al. Suppression of TP Rat Pancreatic Acinar Cell Apoptosis by hucMSC-Ex Carrying hsa-miR-21-5p via PTEN/PI3K Regulation. *Stem Cells Int* 2025:8883585 (2025). https://doi.org/10.1155/sci/8883585

5. Bergez-Hernandez F et al. A systematic review of mechanisms of PTEN gene down-regulation mediated by miRNA in prostate cancer. *Heliyon* 10:e34950 (2024). https://doi.org/10.1016/j.heliyon.2024.e34950

6. Zhou X et al. Comprehensive analysis of PTEN-related ceRNA network revealing the key pathways WDFY3-AS2 - miR-21-5p/miR-221-3p/miR-222-3p - TIMP3 as potential biomarker in KIRC. *Mol Carcinog* 61:508–523 (2022). https://doi.org/10.1002/mc.23396 — **Note: this paper validates miR-222-3p→TIMP3, NOT miR-222-3p→PTEN. It was incorrectly cited as evidence for miR-222-3p→PTEN CONFIRMED status in an earlier version of this analysis; that error has been corrected.**

7. Wang X et al. Clustered microRNAs hsa-miR-221-3p/hsa-miR-222-3p and their targeted genes might be prognostic predictors for hepatocellular carcinoma. *J Cancer* 10:2520–2533 (2019). https://doi.org/10.7150/jca.29207 — **Note: this is a prognostic prediction study, not a direct 3′UTR validation study. It was incorrectly cited as evidence for miR-222-3p→PTEN CONFIRMED status in an earlier version of this analysis; that error has been corrected.**

8. Li S et al. Long non-coding RNA LINC00152 in cancer: Roles, mechanisms, and chemotherapy and radiotherapy resistance. *Front Oncol* 12:960193 (2022). https://doi.org/10.3389/fonc.2022.960193

9. NCBI Gene: GAS5 (Gene ID: 60674). https://www.ncbi.nlm.nih.gov/gene/60674

10. NCBI Gene: CYTOR (Gene ID: 112597). https://www.ncbi.nlm.nih.gov/gene/112597
