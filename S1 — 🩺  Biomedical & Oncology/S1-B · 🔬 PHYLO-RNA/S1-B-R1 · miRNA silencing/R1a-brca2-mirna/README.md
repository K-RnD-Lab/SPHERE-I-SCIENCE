# Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant Breast Cancer: A Multi-Dataset Meta-Analysis

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** В· ML Engineer @ KOSATIKS GROUP

## рџ”¬ Key Finding
> hsa-miR-148a-3p is the top downregulated miRNA in BRCA2-mutant breast cancer (log2FC=в€’0.70, padj=0.013), targeting DNMT1 and AKT2, suggesting epigenetic reprogramming as a therapeutic axis.

**Model performance:** 25 significant DE miRNAs identified (padj в‰¤ 0.05, |log2FC| в‰Ґ 0.3) | **Dataset:** N = 300 (13 BRCA2-mutant, 287 wildtype) вЂ” вљ пёЏ SIMULATED DATA

## рџ¤— Demo
[![Demo](https://img.shields.io/badge/рџ¤—-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna)

## рџ“Љ Results Summary
| Metric | Value |
|--------|-------|
| Total miRNAs profiled | 300 |
| Significant DE miRNAs (padj в‰¤ 0.05) | 25 |
| Downregulated | 17 |
| Upregulated | 8 |
| Top candidate | hsa-miR-148a-3p |
| Top candidate log2FC | в€’0.70 |
| Top candidate padj | 0.013 |
| Core overlap (3 subtypes) | 12 miRNAs |
| Top KEGG pathway | Pathways in cancer (padj=9.0Г—10вЃ»вЃ¶вЃ°) |
| BRCA2-mutant samples | 13 |
| Wildtype samples | 287 |

> вљ пёЏ All quantitative results are based on **SIMULATED DATA** anchored to published TCGA BRCA statistics. The three anchor miRNAs (hsa-miR-148a-3p, hsa-miR-30e-5p, hsa-miR-551b-3p) use exact reported values; all other values are computationally generated for illustration purposes.

## рџ“Ѓ Repository Structure
```
SPHERE-I-SCIENCE/
в”њв”Ђв”Ђ README.md
в”њв”Ђв”Ђ report.md                          # Full manuscript
в”њв”Ђв”Ђ execution_trace.ipynb              # Reproducible analysis notebook
в”њв”Ђв”Ђ data/
в”‚   в”њв”Ђв”Ђ SIMULATED_miRNA_DE_results.csv        # DE results (300 miRNAs)
в”‚   в”њв”Ђв”Ђ SIMULATED_expression_matrix.csv       # log2 CPM matrix (300 Г— 300)
в”‚   в”њв”Ђв”Ђ SIMULATED_sample_metadata.csv         # Sample annotations
в”‚   в”њв”Ђв”Ђ SIMULATED_venn_sets.csv               # Venn diagram membership
в”‚   в””в”Ђв”Ђ SIMULATED_KEGG_enrichment.csv         # Pathway enrichment results
в””в”Ђв”Ђ figures/
    в”њв”Ђв”Ђ Figure1.png / Figure1.svg      # PRISMA dataset selection diagram
    в”њв”Ђв”Ђ Figure2.png / Figure2.svg      # Volcano plot
    в”њв”Ђв”Ђ Figure3.png / Figure3.svg      # Heatmap (top 30 DE miRNAs)
    в”њв”Ђв”Ђ Figure4.png / Figure4.svg      # Venn diagram (3 subtypes)
    в”њв”Ђв”Ђ Figure5.png / Figure5.svg      # KEGG pathway enrichment dot plot
    в””в”Ђв”Ђ Figure6.png / Figure6.svg      # miRNA в†’ target gene network
```

## рџљЂ Quick Start
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

## вљ пёЏ Limitations
1. **Simulated data**: All expression values and DE statistics (except the 3 anchor miRNAs) are computationally generated. Results should not be interpreted as real experimental findings.
2. **Small BRCA2-mutant cohort**: N=13 BRCA2-mutant samples provides limited statistical power; real TCGA analysis would require careful covariate adjustment.
3. **No multi-variate correction**: Tumor stage, grade, ER/PR/HER2 status, and age were not modeled as covariates in this illustrative analysis.
4. **miRNAвЂ“target interactions**: Network edges are drawn from literature databases (miRTarBase, TargetScan) and represent predicted/validated interactions, not causal relationships demonstrated in BRCA2-mutant cells specifically.
5. **KEGG enrichment**: Pathway analysis was performed on curated target gene lists, not experimentally validated downstream effects.
6. **No validation cohort**: Results require independent validation in GEO datasets (e.g., GSE37405, GSE68085) and functional assays.

## рџ“– Citation
```bibtex
@misc{kolisnyk2026brca2mirna,
  title     = {Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant
               Breast Cancer: A Multi-Dataset Meta-Analysis},
  author    = {Kolisnyk, Oksana},
  year      = {2026},
  month     = {March},
  note      = {K R\&D Lab, KOSATIKS GROUP. SIMULATED DATA вЂ” for methodological
               demonstration only. GitHub: https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  url       = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}
}
```

