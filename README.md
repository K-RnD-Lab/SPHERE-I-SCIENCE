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

## 🗺️ Lab Map — S1 Biomedical Framework

This repository implements **Science Sphere 1 (S1) — Biomedical**, structured
across five research tracks (A–E). Each folder maps to a specific PHYLO sub-direction:

```
S1-A · PHYLO-GENOMICS     — What breaks in DNA
S1-B · PHYLO-RNA          — How to silence it via RNA
S1-C · PHYLO-DRUG         — Which molecule treats it
S1-D · PHYLO-LNP          — How to deliver the drug
S1-E · PHYLO-BIOMARKERS   — Detect without biopsy
```

### Folder → PHYLO track mapping

| Folder | Sub-dir | PHYLO track | Research question |
|--------|---------|-------------|-------------------|
| [`05_A5-openvariant/`](05_A5-openvariant/) | S1-A · R1 | **PHYLO-GENOMICS** | Which DNA variants are pathogenic? |
| [`01_A1-brca2-mirna/`](01_A1-brca2-mirna/) | S1-B · R2 | **PHYLO-RNA** | Which miRNAs silence BRCA2? |
| [`02_A2-tp53-sirna/`](02_A2-tp53-sirna/) | S1-B · R3 | **PHYLO-RNA** | Which siRNA targets are SL with TP53-null? |
| [`03_A3-lncrna-trem2/`](03_A3-lncrna-trem2/) | S1-B · R4 | **PHYLO-RNA** | How does lncRNA-TREM2 drive neuroinflammation? |
| [`04_A4-fgfr3-rna-drug/`](04_A4-fgfr3-rna-drug/) | S1-C · R5 | **PHYLO-DRUG** | Which compounds bind the FGFR3 RNA structure? |
| [`06_B1-lnp-corona-ml/`](06_B1-lnp-corona-ml/) | S1-D · R6 | **PHYLO-LNP** | What determines LNP protein corona in serum? |
| [`08_B3-corona-flow-dynamics/`](08_B3-corona-flow-dynamics/) | S1-D · R7 | **PHYLO-LNP** | How does blood flow reshape the corona (Vroman)? |
| [`09_B4-lnp-apoe-bbb/`](09_B4-lnp-apoe-bbb/) | S1-D · R8 | **PHYLO-LNP** | What LNP parameters maximize ApoE for BBB crossing? |
| [`10_B5-autocorona-nlp/`](10_B5-autocorona-nlp/) | S1-D · R10 | **PHYLO-LNP** | Can NLP extract corona data from PMC abstracts? |
| [`07_B2-corona-liquid-biopsy/`](07_B2-corona-liquid-biopsy/) | S1-E · R9 | **PHYLO-BIOMARKERS** | Can proteomics classify cancer vs healthy? |

> **Note on numbering:** B3=R7, B4=R8, B5=R10, B2=R9 — folder IDs follow creation order,
> R-codes follow the global research roadmap (`docs/research-roadmap-v2.md`).
> R9 is classified under PHYLO-BIOMARKERS (not LNP) because it uses protein expression,
> not nanoparticle corona data.
> github.com/K-RnD-Lab/.github/blob/main/profile/docs/research-roadmap-v2.md

---

## 🔬 Research Projects

| # | Folder | Key Finding | PHYLO track | Status |
|---|--------|-------------|-------------|--------|
| A1 | [BRCA2 miRNA](01_A1-brca2-mirna/) | hsa-miR-148a-3p top silenced miRNA in BRCA2-mut breast cancer | S1-B · RNA | ✅ |
| A2 | [TP53 siRNA](02_A2-tp53-sirna/) | SPC24, BUB1B, CDC45 — novel SL targets, no existing drugs | S1-B · RNA | ✅ |
| A3 | [lncRNA-TREM2](03_A3-lncrna-trem2/) | CYTOR→miR-138-5p→AKT1 axis controls TREM2 neuroinflammation | S1-B · RNA | ✅ |
| A4 | [FGFR3 RNA Drug](04_A4-fgfr3-rna-drug/) | CHEMBL1575701 priority lead, RNA-score 0.793, near-zero toxicity | S1-C · DRUG | ✅ |
| A5 | [OpenVariant ⭐](05_A5-openvariant/) | AUC=0.939 on ClinVar 2026, matches AlphaMissense without deep learning | S1-A · GENOMICS | ✅ |
| B1 | [LNP Corona ML](06_B1-lnp-corona-ml/) | CHL/HL/PEG molar ratios dominate efficacy prediction (AUC=0.791) | S1-D · LNP | ✅ |
| B2 | [Liquid Biopsy](07_B2-corona-liquid-biopsy/) | CTHRC1+FHL2+LDHA panel separates cancer vs healthy (AUC=0.992*) | S1-E · BIOMARKERS | ✅ |
| B3 | [Flow Corona](08_B3-corona-flow-dynamics/) | Blood flow accelerates albumin→ApoE exchange 3–4× vs static | S1-D · LNP | ✅ |
| B4 | [LNP Brain](09_B4-lnp-apoe-bbb/) | pKa 6.2–6.8 + zeta ±5 mV predicts ApoE >20% corona for BBB | S1-D · LNP | ✅ |
| B5 | [AutoCorona NLP](10_B5-autocorona-nlp/) | protein_source F1=0.71 from PMC abstracts; size/zeta need PDF parser | S1-D · LNP | ✅ |

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
├── CONTRIBUTING.md
├── LICENSE
│
├── 01_A1-brca2-mirna/          ← S1-B · PHYLO-RNA · R2
│   ├── README.md
│   ├── report.md
│   ├── execution_trace.ipynb
│   ├── data/
│   └── figures/
│
├── 02_A2-tp53-sirna/           ← S1-B · PHYLO-RNA · R3
├── 03_A3-lncrna-trem2/         ← S1-B · PHYLO-RNA · R4
├── 04_A4-fgfr3-rna-drug/       ← S1-C · PHYLO-DRUG · R5
├── 05_A5-openvariant/          ← S1-A · PHYLO-GENOMICS · R1
├── 06_B1-lnp-corona-ml/        ← S1-D · PHYLO-LNP · R6
├── 07_B2-corona-liquid-biopsy/ ← S1-E · PHYLO-BIOMARKERS · R9
├── 08_B3-corona-flow-dynamics/ ← S1-D · PHYLO-LNP · R7
├── 09_B4-lnp-apoe-bbb/         ← S1-D · PHYLO-LNP · R8
├── 10_B5-autocorona-nlp/       ← S1-D · PHYLO-LNP · R10
│
└── meta-tool/
    ├── app.py                  ← Gradio demo (all 10 tools)
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
