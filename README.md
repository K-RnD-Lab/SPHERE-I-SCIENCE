# K R&D Lab — Computational Biology Research Suite

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HuggingFace](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)
[![GitHub](https://img.shields.io/badge/GitHub-K--RnD--Lab-orange)](https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)

> **Open-source computational biology research by Oksana Kolisnyk**
> [kosatiks-group.pp.ua](https://kosatiks-group.pp.ua)

---

## 🧬 About

This repository contains 10 independent computational biology studies
spanning RNA therapeutics, nanoparticle delivery, and clinical genomics.
All tools are open-source, reproducible, and accessible via a single
interactive demo — no coding required.

> ⚠️ **Research use only.** All models are experimental.
> Data labeled SIMULATED must not be interpreted as experimental findings.

---

## 🔬 Research Projects

| # | Project | Key Finding | Status |
|---|---------|-------------|--------|
| A1 | [BRCA2 miRNA](01_A1-brca2-mirna/) | hsa-miR-148a-3p top silenced miRNA in BRCA2-mut breast cancer | ✅ Complete |
| A2 | [TP53 siRNA](02_A2-tp53-sirna/) | SPC24, BUB1B, CDC45 — novel SL targets, no existing drugs | ✅ Complete |
| A3 | [lncRNA-TREM2](03_A3-lncrna-trem2/) | CYTOR→miR-138-5p→AKT1 axis controls TREM2 neuroinflammation | ✅ Complete |
| A4 | [FGFR3 RNA Drug](04_A4-fgfr3-rna-drug/) | CHEMBL1575701 priority lead, RNA-score 0.793, near-zero toxicity | ✅ Complete |
| A5 | [OpenVariant ⭐](05_A5-openvariant/) | AUC=0.939 on ClinVar 2026, matches AlphaMissense without deep learning | ✅ Complete |
| B1 | [LNP Corona ML](06_B1-lnp-corona-ml/) | CHL/HL/PEG molar ratios dominate efficacy prediction (AUC=0.791) | ✅ Complete |
| B2 | [Liquid Biopsy](07_B2-liquid-biopsy/) | CTHRC1+FHL2+LDHA panel separates cancer vs healthy (AUC=0.992*) | ✅ Complete |
| B3 | [Flow Corona](08_B3-flow-corona/) | Blood flow accelerates albumin→ApoE exchange 3-4x vs static | ✅ Complete |
| B4 | [LNP Brain](09_B4-lnp-brain/) | pKa 6.2-6.8 + zeta ±5mV predicts ApoE >20% corona for BBB | ✅ Complete |
| B5 | [AutoCorona NLP](10_B5-autocorona-nlp/) | protein_source F1=0.71 from PMC abstracts; size/zeta need PDF parser | ✅ Complete |

*B2 AUC reflects tissue proteomics proxy, not plasma LNP corona validation.

---

## 🤗 Interactive Demo

All 10 tools in one Space — no installation required:

[![Open Demo](https://img.shields.io/badge/🤗-Open_Interactive_Demo-yellow?style=for-the-badge)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)

---

## 📁 Repository Structure

```
K-RnD-Lab-PHYLO-03_2026/
│
├── README.md
├── CITATION.cff
├── LICENSE
│
├── 01_A1-brca2-mirna/
│   ├── README.md
│   ├── report.md
│   ├── execution_trace.ipynb
│   ├── data/
│   └── figures/
│
├── 02_A2-tp53-sirna/       (same structure)
├── 03_A3-lncrna-trem2/
├── 04_A4-fgfr3-rna-drug/
├── 05_A5-openvariant/
├── 06_B1-lnp-corona-ml/
├── 07_B2-liquid-biopsy/
├── 08_B3-flow-corona/
├── 09_B4-lnp-brain/
├── 10_B5-autocorona-nlp/
│
└── meta-tool/
    ├── app.py
    └── requirements.txt
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026.git
cd K-RnD-Lab-PHYLO-03_2026

# Run the interactive demo locally
cd meta-tool
pip install -r requirements.txt
python app.py
```

Or use any individual project notebook:
```bash
cd 05_A5-openvariant
jupyter notebook execution_trace.ipynb
```

---

## 📖 Citation

```bibtex
@software{kolisnyk2026krdlab,
  author    = {Kolisnyk, Oksana},
  title     = {K R&D Lab: Computational Biology Research Suite},
  year      = {2026},
  month     = {March},
  publisher = {GitHub},
  url       = {https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026},
  note      = {10 open-source computational biology tools spanning
               RNA therapeutics, nanoparticle delivery, and genomics}
}
```

---

## ⚠️ Disclaimer

All computational models are research-grade and experimental.
Results labeled SIMULATED are hypothesis-generating only and
require experimental validation before any clinical application.
This work does not constitute medical advice.

---

*Built with Python · Gradio · scikit-learn · XGBoost · matplotlib*
*© 2026 Oksana Kolisnyk · MIT License*
