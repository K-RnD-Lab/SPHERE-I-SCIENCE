# Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant Breast Cancer: A Multi-Dataset Meta-Analysis

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** · ML Engineer @ KOSATIKS GROUP

## 🔬 Key Finding
> hsa-miR-148a-3p is the top downregulated miRNA in BRCA2-mutant breast cancer (log2FC=−0.70, padj=0.013), targeting DNMT1 and AKT2, suggesting epigenetic reprogramming as a therapeutic axis.

**Model performance:** 25 significant DE miRNAs identified (padj ≤ 0.05, |log2FC| ≥ 0.3) | **Dataset:** N = 300 (13 BRCA2-mutant, 287 wildtype) — ⚠️ SIMULATED DATA

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna)

## 📊 Results Summary
| Metric | Value |
|--------|-------|
| Total miRNAs profiled | 300 |
| Significant DE miRNAs (padj ≤ 0.05) | 25 |
| Downregulated | 17 |
| Upregulated | 8 |
| Top candidate | hsa-miR-148a-3p |
| Top candidate log2FC | −0.70 |
| Top candidate padj | 0.013 |
| Core overlap (3 subtypes) | 12 miRNAs |
| Top KEGG pathway | Pathways in cancer (padj=9.0×10⁻⁶⁰) |
| BRCA2-mutant samples | 13 |
| Wildtype samples | 287 |

> ⚠️ All quantitative results are based on **SIMULATED DATA** anchored to published TCGA BRCA statistics. The three anchor miRNAs (hsa-miR-148a-3p, hsa-miR-30e-5p, hsa-miR-551b-3p) use exact reported values; all other values are computationally generated for illustration purposes.

## 📁 Repository Structure
```
K-RnD-Lab-PHYLO-03_2026/
├── README.md
├── report.md                          # Full manuscript
├── execution_trace.ipynb              # Reproducible analysis notebook
├── data/
│   ├── SIMULATED_miRNA_DE_results.csv        # DE results (300 miRNAs)
│   ├── SIMULATED_expression_matrix.csv       # log2 CPM matrix (300 × 300)
│   ├── SIMULATED_sample_metadata.csv         # Sample annotations
│   ├── SIMULATED_venn_sets.csv               # Venn diagram membership
│   └── SIMULATED_KEGG_enrichment.csv         # Pathway enrichment results
└── figures/
    ├── Figure1.png / Figure1.svg      # PRISMA dataset selection diagram
    ├── Figure2.png / Figure2.svg      # Volcano plot
    ├── Figure3.png / Figure3.svg      # Heatmap (top 30 DE miRNAs)
    ├── Figure4.png / Figure4.svg      # Venn diagram (3 subtypes)
    ├── Figure5.png / Figure5.svg      # KEGG pathway enrichment dot plot
    └── Figure6.png / Figure6.svg      # miRNA → target gene network
```

## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE.git
cd SPHERE-I-SCIENCE

# Install dependencies
pip install pandas numpy scipy matplotlib seaborn networkx adjustText \
            matplotlib-venn statsmodels gseapy

# Run analysis notebook
jupyter notebook execution_trace.ipynb
```

## ⚠️ Limitations
1. **Simulated data**: All expression values and DE statistics (except the 3 anchor miRNAs) are computationally generated. Results should not be interpreted as real experimental findings.
2. **Small BRCA2-mutant cohort**: N=13 BRCA2-mutant samples provides limited statistical power; real TCGA analysis would require careful covariate adjustment.
3. **No multi-variate correction**: Tumor stage, grade, ER/PR/HER2 status, and age were not modeled as covariates in this illustrative analysis.
4. **miRNA–target interactions**: Network edges are drawn from literature databases (miRTarBase, TargetScan) and represent predicted/validated interactions, not causal relationships demonstrated in BRCA2-mutant cells specifically.
5. **KEGG enrichment**: Pathway analysis was performed on curated target gene lists, not experimentally validated downstream effects.
6. **No validation cohort**: Results require independent validation in GEO datasets (e.g., GSE37405, GSE68085) and functional assays.

## 📖 Citation
```bibtex
@misc{kolisnyk2026brca2mirna,
  title     = {Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant
               Breast Cancer: A Multi-Dataset Meta-Analysis},
  author    = {Kolisnyk, Oksana},
  year      = {2026},
  month     = {March},
  note      = {K R\&D Lab, KOSATIKS GROUP. SIMULATED DATA — for methodological
               demonstration only. GitHub: https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  url       = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}
}
```
