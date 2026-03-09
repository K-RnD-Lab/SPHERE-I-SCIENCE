# lncRNA Regulatory Networks Controlling TREM2-Dependent Microglial Inflammation: Implications for Alzheimer's Therapy

> Part of [K R&D Lab](https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## Key Finding

> CYTOR and GAS5 form literature-validated ceRNA axes (CYTOR→miR-138-5p→AKT1 CONFIRMED; GAS5→miR-21-5p→PTEN CONFIRMED; 2/6 interactions with direct 3′UTR evidence) in the context of TREM2-dependent neuroinflammation, with 2 ASO candidates targeting accessible regions of both lncRNAs (GC=70%, Tm=60°C; real NCBI sequences NR_186289.1 / NR_024205.3).

**Data type:** Simulated iPSC-derived microglia RNA-seq (TREM2-KO vs WT) | **Dataset:** 2 independent simulated datasets × 12 samples each (not biological replicates of one another)

> ⚠️ **DATA NOTICE:** All RNA-seq count matrices and differential expression results in this repository are **SIMULATED** data generated for illustrative purposes. DE analysis used **Welch t-test on log₂-normalized counts — NOT equivalent to DESeq2**; DEG counts are unreliable. ASO sequences and thermodynamic properties are derived from **real NCBI RefSeq transcripts**. miRNA–target interaction confidence is based on **literature search** (miRTarBase API was inaccessible).

## Demo

[![Demo](https://img.shields.io/badge/%F0%9F%A4%97-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)

## Results Summary

| Metric | Value |
|--------|-------|
| DEGs Dataset 1 (padj≤0.05, \|LFC\|≥0.5) | 428 (208 up / 220 down) — Welch t-test only, not DESeq2 |
| DEGs Dataset 2 (padj≤0.05, \|LFC\|≥0.5) | 413 (210 up / 203 down) — Welch t-test only, not DESeq2 |
| TREM2 log₂FC (KO/WT) | −3.28 (DS1), −2.26 (DS2) |
| CYTOR log₂FC (KO/WT) | +2.20 (DS1), +1.64 (DS2) |
| GAS5 log₂FC (KO/WT) | +1.50 (DS1), +1.50 (DS2) |
| IL6 log₂FC (KO/WT) | +2.05 (DS1), +2.00 (DS2) |
| ceRNA interactions CONFIRMED (direct 3′UTR evidence) | 2 / 6 tested (all in non-microglial cell types) |
| ceRNA interactions INDIRECT | 3 / 6 tested |
| ceRNA interactions NOT_CONFIRMED | 1 / 6 tested |
| ASO candidates | 2 (GAS5 pos.119, CYTOR pos.507) |
| ASO GC content (real sequence) | 70% (both) — above recommended 40–60% range |
| ASO Tm (Wallace rule, real sequence) | 60°C (both) |
| GAS5 target accessibility | 55% unpaired |
| CYTOR target accessibility | 35% unpaired |
| WGCNA co-expression modules | 8 (stochastic; not biologically interpretable) |

## Repository Structure

```
K-RnD-Lab-PHYLO-03_2026/
├── README.md
├── report.md                          # Full manuscript
├── execution_trace.ipynb              # Reproducible analysis notebook
├── data/
│   ├── SIMULATED_counts_dataset1_iPSC_microglia_TREM2KO_vs_WT.csv
│   ├── SIMULATED_counts_dataset2_iPSC_microglia_TREM2KO_vs_WT.csv
│   ├── SIMULATED_DE_results_dataset1.csv
│   ├── SIMULATED_DE_results_dataset2.csv
│   ├── miRTarBase_interaction_validation.csv
│   └── ASO_candidates_GAS5_CYTOR.csv
└── figures/
    ├── Figure1.png / Figure1.svg      # TREM2 expression overview
    ├── Figure2.png / Figure2.svg      # Volcano plots (2 datasets)
    ├── Figure3.png / Figure3.svg      # WGCNA dendrogram + heatmap
    ├── Figure4.png / Figure4.svg      # Tripartite ceRNA network
    └── Figure5.png / Figure5.svg      # ASO structure & GC content
```

## Quick Start

```bash
# Clone repository
git clone https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026.git
cd K-RnD-Lab-PHYLO-03_2026

# Install dependencies
pip install numpy pandas scipy matplotlib seaborn biopython ViennaRNA adjustText scikit-learn

# Run analysis notebook
jupyter notebook execution_trace.ipynb
```

**Key dependencies:**
- Python >= 3.10
- ViennaRNA (for RNA secondary structure folding)
- Biopython (for NCBI sequence retrieval)
- adjustText (for volcano plot label placement)

## Limitations

1. **Simulated RNA-seq data:** All count matrices are synthetic (negative-binomial simulation). Results cannot be used to draw biological conclusions without real experimental data.
2. **DE method:** Welch t-test on log₂-normalized counts — NOT equivalent to DESeq2. Does not model count overdispersion. DEG counts (428/413) are unreliable and illustrative only.
3. **ceRNA validation:** Only 2/6 interactions confirmed by direct 3′UTR experimental evidence (luciferase/Western blot), both in non-microglial cell types. miR-222-3p→PTEN was incorrectly labelled CONFIRMED in an earlier version; corrected to INDIRECT.
4. **miRTarBase API:** Direct API access failed (SSL error); all validation is literature-search-based only.
5. **WGCNA approximation:** Python approximation only; module assignments are stochastic artefacts of a single simulation run with no biological interpretation.
6. **ASO GC content:** GC=70% is above the recommended 40–60% range. No sliding-window optimisation was performed. Positions were specified a priori.
7. **Transcript variant selection:** GAS5 NR_186289.1 (variant 49) selected without experimental justification. ASO position 119 is variant-specific.

## Citation

```bibtex
@misc{kolisnyk2026lncrna,
  author       = {Kolisnyk, Oksana},
  title        = {lncRNA Regulatory Networks Controlling TREM2-Dependent
                  Microglial Inflammation: Implications for Alzheimer's Therapy},
  year         = {2026},
  publisher    = {GitHub},
  journal      = {K R\&D Lab -- PHYLO-03},
  howpublished = {\url{https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026}},
  note         = {ORCID: 0009-0003-5780-2290}
}
```
