# Computational Identification of siRNA Synthetic Lethal Targets in TP53-Mutant Lung Adenocarcinoma

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** · ML Engineer @ KOSATIKS GROUP

## Key Finding
> SPC24, BUB1B, and CDC45 are novel synthetic lethal targets in TP53-mutant LUAD with no existing drugs — highest siRNA therapeutic value (log₂FC > 1.1, dCERES ≤ −0.10, padj ≤ 0.05 BH/FDR). [SIMULATED DATA] Note: CERES Selectivity Score values cited elsewhere are a simulated placeholder metric and were not used as a selection criterion.

**Pipeline validation:** PLK1 and CDK1 recovered as positive clinical controls | **Dataset:** N = 566 (295 TP53-mut + 271 WT) [SIMULATED]

> **Note:** BUB1B dropped to rank 11 after Z-score normalization of the composite SL score and is absent from Figure 4 (top-10 heatmap). It remains a validated SL hit by the dual-threshold criterion (padj ≤ 0.05, dCERES ≤ −0.10) and is included in the Venn triple intersection. See report §3.4 for details.

## Demo
[![Demo](https://img.shields.io/badge/HuggingFace-K--RnD--Lab-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## Results Summary
| Metric | Value |
|--------|-------|
| TCGA LUAD samples | 566 (295 TP53-mut, 271 WT) [SIMULATED] |
| DepMap SL candidates screened | 93 |
| Significant SL hits (padj ≤ 0.05 BH/FDR, dCERES ≤ −0.10) | 5 |
| Validated novel targets (dual threshold + Novel drug status) | 3 (SPC24, BUB1B, CDC45) |
| Additional novel targets in Venn triple intersection (dCERES threshold only) | +2 simulated (CENPN, POLD1) |
| Genes outside all Venn criteria (unclassified) | 20/93 (21.5%) — see report §3.5 |
| Top novel candidate — SPC24 | dCERES = −0.175, log₂FC = +1.13, CERES Selectivity = 0.74 |
| Top novel candidate — CDC45 | dCERES = −0.144, log₂FC = +1.26, CERES Selectivity = 0.76 |
| Top novel candidate — BUB1B | dCERES = −0.119, log₂FC = +1.12, CERES Selectivity = 0.71 |
| Top clinical candidate — PLK1 | dCERES = −0.239, log₂FC = +1.03, CERES Selectivity = 0.82 |
| Top clinical candidate — CDK1 | dCERES = −0.201, log₂FC = +1.00, CERES Selectivity = 0.80 |
| TP53 missense mutation rate | 61% of mutant samples |
| Median VAF (TP53-mutant) | 0.627 [computed from simulated data] |
| Median TMB: TP53-mut vs WT | 16.09 vs 9.46 mut/Mb (1.70× ratio) [computed from simulated data] |

> **CERES Selectivity Score** is a simulated metric (normalized to [0,1]) reflecting selectivity of CERES essentiality for TP53-mutant vs. all-line context. It is not equivalent to any externally published AUC measure.

## Repository Structure
```
SPHERE-I-SCIENCE/
├── README.md
├── report.md
├── execution_trace.ipynb
├── data/
│   ├── SIMULATED_TCGA_LUAD_TP53_mutations.csv
│   ├── SIMULATED_DepMap_93_SL_candidates.csv   # includes venn_category column; depmap_auc renamed to ceres_selectivity
│   └── SIMULATED_top10_siRNA_candidates.csv    # Z-score normalized SL score; depmap_auc renamed to ceres_selectivity; ESPL1 drug_status = 'Unverified [SIMULATED]'
└── figures/
    ├── Figure1.png / Figure1.svg   # TP53 mutation waterfall
    ├── Figure2.png / Figure2.svg   # Differential essentiality volcano (BH/FDR)
    ├── Figure3.png / Figure3.svg   # Essentiality vs expression scatter
    ├── Figure4.png / Figure4.svg   # Top 10 candidates heatmap (corrected: prior run had NaN→0 bug; current figure uses valid Z-score matrix)
    └── Figure5.png / Figure5.svg   # 3-way Venn diagram
```

## Quick Start
```bash
pip install pandas numpy matplotlib scipy statsmodels adjustText

# Run the full analysis
jupyter nbconvert --to notebook --execute execution_trace.ipynb
```

## Methods Summary
| Step | Method | Key parameter |
|------|--------|---------------|
| Mutation classification | Manual annotation | 5 categories |
| Differential essentiality | dCERES = CERES(mut) − CERES(WT) | threshold ≤ −0.10 |
| Multiple testing correction | Benjamini-Hochberg FDR | padj ≤ 0.05 |
| Composite SL score | zscore(−dCERES) + zscore(log₂FC) | Z-score normalized |
| Clustering | Ward linkage, Euclidean distance | top 10 candidates |
| Correlation | Spearman ρ (CERES inverted) | ρ = 0.147, p = 0.158 |

## Limitations
- **All data in this repository is SIMULATED** for demonstration purposes. Figures and statistics do not represent real experimental findings.
- Real validation requires: (1) actual TCGA LUAD mutation calls from GDC portal, (2) DepMap CERES scores from depmap.org, (3) wet-lab siRNA knockdown confirmation in TP53-mutant LUAD cell lines (e.g., H1299, H1975, A549).
- The Spearman correlation between essentiality and expression (ρ = 0.147, p = 0.158) is non-significant in this simulated dataset.
- 20/93 screened genes fell outside all three Venn prioritization criteria and are not represented in Figure 5 (see report §3.5 for full list).
- The Venn "SL Candidates" set (n=48, dCERES ≤ −0.10 only) is broader than the volcano "Significant SL" set (n=5, dual threshold). CENPN and POLD1 meet only the former.
- Drug status annotations are based on public databases as of 2026 and may not reflect all pipeline compounds. ESPL1 drug status is listed as 'Unverified [SIMULATED]' as its clinical annotation could not be confirmed from real data.
- **CRISPR-to-siRNA translation:** DepMap essentiality scores derive from complete CRISPR knockout. siRNA achieves only partial knockdown (typically 70–90%), may have off-target effects, and faces in vivo delivery challenges not modeled here. Experimental siRNA validation is required before any therapeutic interpretation.

## Key References
1. Kandoth et al. (2013) *Nature* — TP53 mutation landscape. https://doi.org/10.1038/nature12634
2. Meyers et al. (2017) *Nature Genetics* — CERES score methodology. https://doi.org/10.1101/160861
3. Lord & Ashworth (2017) *Science* — PARP inhibitors and synthetic lethality. https://doi.org/10.1126/science.aam7344
4. Tsherniak et al. (2017) *Cell* — Cancer Dependency Map. https://doi.org/10.1016/j.cell.2017.06.010
5. Ngoi et al. (2024) *Nat Rev Clin Oncol* — Synthetic lethal strategies. https://doi.org/10.1038/s41571-024-00966-z
6. Blow & Gillespie (2008) *Nat Rev Cancer* — Replication licensing and cancer. https://doi.org/10.1038/nrc2500

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
               HuggingFace: https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026.
               ORCID: 0009-0003-5780-2290.
               WARNING: All data is simulated for demonstration purposes.},
  url       = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE}
}
```
