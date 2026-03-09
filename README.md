# K R&D Lab — Computational Biology Research Suite

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HuggingFace](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)
[![GitHub](https://img.shields.io/badge/GitHub-TEZv%2FSPHERE--I--SCIENCE-orange)](https://github.com/TEZv/SPHERE-I-SCIENCE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)

> **Open-source computational biology research by Oksana Kolisnyk**  
> [kosatiks-group.pp.ua](https://kosatiks-group.pp.ua)

---

## 🧬 About

This repository contains 10 complete + 3 in-development computational biology studies
spanning RNA therapeutics, nanoparticle delivery, clinical genomics, and rare cancers.
All tools are open-source, reproducible, and accessible via a single interactive demo.

> ⚠️ **Research use only.** All models are experimental.  
> Data labeled SIMULATED must not be interpreted as experimental findings.

---

## 🗺️ Lab Map — S1 Biomedical Framework

**Science Sphere 1 (S1)** is structured across six research tracks (A–F),
each answering one question in the chain from mutation to treatment:

```
🧬 S1-A · PHYLO-GENOMICS    — What breaks in DNA?
🔬 S1-B · PHYLO-RNA         — How to silence it via RNA?
💊 S1-C · PHYLO-DRUG        — Which molecule treats it?
🧪 S1-D · PHYLO-LNP         — How to deliver the drug?
🩸 S1-E · PHYLO-BIOMARKERS  — How to detect it without biopsy?
☠️ S1-F · PHYLO-RARE        — Where almost nobody has looked yet (<300 cases/yr)
```

### Folder → PHYLO track mapping

| Folder | Sub-dir | PHYLO track | Research question |
|--------|---------|-------------|-------------------|
| [`05_A5-openvariant/`](<S1 — 🩺 Biomedical & Oncology/🧬 S1-A · PHYLO-GENOMICS/S1-R1 · OpenVariant/05_A5-openvariant/>) | S1-A · R1 | **PHYLO-GENOMICS** | Which DNA variants are pathogenic? |
| [`01_A1-brca2-mirna/`](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/S1-R2 · miRNA/01_A1-brca2-mirna/>) | S1-B · R2 | **PHYLO-RNA** | Which miRNAs silence BRCA2? |
| [`02_A2-tp53-sirna/`](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/S1-R3 · siRNA/02_A2-tp53-sirna/>) | S1-B · R3 | **PHYLO-RNA** | Which siRNA targets are SL with TP53-null? |
| [`03_A3-lncrna-trem2/`](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/S1-R4 · lncRNA + ASO/03_A3-lncrna-trem2/>) | S1-B · R4 | **PHYLO-RNA** | How does lncRNA-TREM2 drive neuroinflammation? |
| [`04_A4-fgfr3-rna-drug/`](<S1 — 🩺 Biomedical & Oncology/💊 S1-C · PHYLO-DRUG/S1-R5 · FGFR3/04_A4-fgfr3-rna-drug/>) | S1-C · R5 | **PHYLO-DRUG** | Which compounds bind the FGFR3 RNA structure? |
| [`06_B1-lnp-corona-ml/`](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R6 · Corona/06_B1-lnp-corona-ml/>) | S1-D · R6 | **PHYLO-LNP** | What determines LNP protein corona in serum? |
| [`08_B3-corona-flow-dynamics/`](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R7 · Flow/08_B3-corona-flow-dynamics/>) | S1-D · R7 | **PHYLO-LNP** | How does blood flow reshape the corona (Vroman)? |
| [`09_B4-lnp-apoe-bbb/`](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R8 · Brain/09_B4-lnp-apoe-bbb/>) | S1-D · R8 | **PHYLO-LNP** | What LNP parameters maximize ApoE for BBB crossing? |
| [`07_B2-corona-liquid-biopsy/`](<S1 — 🩺 Biomedical & Oncology/🩸 S1-E · PHYLO-BIOMARKERS/S1-R9 · Liquid Biopsy/07_B2-corona-liquid-biopsy/>) | S1-E · R9 | **PHYLO-BIOMARKERS** | Can proteomics classify cancer vs healthy? | [`10_B5-autocorona-nlp/`](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R10 · NLP/10_B5-autocorona-nlp/>) | S1-D · R10 | **PHYLO-LNP** | Can NLP extract corona data from PMC abstracts? |
|
| [DIPG toolkit 🔶](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/S1-R12b · DIPG/>) | S1-F · R12b | **PHYLO-RARE** | H3K27M + CSF LNP + Circadian Biology |
| [UVM toolkit 🔶](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/S1-R12c · UVM/>) | S1-F · R12c | **PHYLO-RARE** | GNAQ/GNA11 + vitreous corona + m6A |
| [pAML toolkit 🔶](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/S1-R12d · pAML/>) | S1-F · R12d | **PHYLO-RARE** | FLT3-ITD + bone marrow niche + ferroptosis |

> **Note on numbering:** folder IDs (A1–B5) follow creation order; R-codes follow the research roadmap.
> B3=R7, B4=R8, B5=R10, B2=R9.  
> 👉 Full roadmap: [docs/research-roadmap-v2.md](https://github.com/K-RnD-Lab/.github/blob/main/profile/docs/research-roadmap-v2.md)

---

## 🔬 Research Projects

| # | Study | Key Finding | PHYLO track | Status |
|---|-------|-------------|-------------|--------|
| A1 | [BRCA2 miRNA](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/S1-R2 · miRNA/01_A1-brca2-mirna/>) | hsa-miR-148a-3p top silenced miRNA in BRCA2-mut breast cancer | S1-B · RNA | ✅ |
| A2 | [TP53 siRNA](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/S1-R3 · siRNA/02_A2-tp53-sirna/>) | SPC24, BUB1B, CDC45 — novel SL targets, no existing drugs | S1-B · RNA | ✅ |
| A3 | [lncRNA-TREM2](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/S1-R4 · lncRNA + ASO/03_A3-lncrna-trem2/>) | CYTOR→miR-138-5p→AKT1 axis controls TREM2 neuroinflammation | S1-B · RNA | ✅ |
| A4 | [FGFR3 RNA Drug](<S1 — 🩺 Biomedical & Oncology/💊 S1-C · PHYLO-DRUG/S1-R5 · FGFR3/04_A4-fgfr3-rna-drug/>) | CHEMBL1575701 priority lead, RNA-score 0.793, near-zero toxicity | S1-C · DRUG | ✅ |
| A5 | [OpenVariant ⭐](<S1 — 🩺 Biomedical & Oncology/🧬 S1-A · PHYLO-GENOMICS/S1-R1 · OpenVariant/05_A5-openvariant/>) | AUC=0.939 on ClinVar 2026, matches AlphaMissense without deep learning | S1-A · GENOMICS | ✅ |
| B1 | [LNP Corona ML](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R6 · Corona/06_B1-lnp-corona-ml/>) | CHL/HL/PEG molar ratios dominate efficacy prediction (AUC=0.791) | S1-D · LNP | ✅ |
| B2 | [Liquid Biopsy](<S1 — 🩺 Biomedical & Oncology/🩸 S1-E · PHYLO-BIOMARKERS/S1-R9 · Liquid Biopsy/07_B2-corona-liquid-biopsy/>) | CTHRC1+FHL2+LDHA panel separates cancer vs healthy (AUC=0.992*) | S1-E · BIOMARKERS | ✅ |
| B3 | [Flow Corona](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R7 · Flow/08_B3-corona-flow-dynamics/>) | Blood flow accelerates albumin→ApoE exchange 3–4× vs static | S1-D · LNP | ✅ |
| B4 | [LNP Brain](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R8 · Brain/09_B4-lnp-apoe-bbb/>) | pKa 6.2–6.8 + zeta ±5 mV predicts ApoE >20% corona for BBB | S1-D · LNP | ✅ |
| B5 | [AutoCorona NLP](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/S1-R10 · NLP/10_B5-autocorona-nlp/>) | protein_source F1=0.71 from PMC abstracts; size/zeta need PDF parser | S1-D · LNP | ✅ |
| R12b | [DIPG toolkit](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/S1-R12b · DIPG/>) | H3K27M + CSF LNP corona + Circadian Biology · PBTA/GSE126319 | S1-F · RARE | 🔶 |
| R12c | [UVM toolkit](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/S1-R12c · UVM/>) | GNAQ/GNA11 + vitreous humor corona + m6A · TCGA-UVM n=80 | S1-F · RARE | 🔶 |
| R12d | [pAML toolkit](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/S1-R12d · pAML/>) | FLT3-ITD + bone marrow niche corona + ferroptosis · TARGET-AML | S1-F · RARE | 🔶 |

*B2 AUC reflects tissue proteomics proxy, not plasma validation. 🔶 = in active development.

---

## 🤗 Interactive Demo

All tools in one Space — no installation required:

[![Open Demo](https://img.shields.io/badge/🤗-Open_Interactive_Demo-yellow?style=for-the-badge)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)

---

## 📁 Repository Structure

```
SPHERE-I-SCIENCE/
│
├── README.md
├── CITATION.cff
├── CONTRIBUTING.md
├── LICENSE
│
└── S1 — 🩺 Biomedical & Oncology/
    │
    ├── 🧬 S1-A · PHYLO-GENOMICS/
    │   └── S1-R1 · OpenVariant/
    │       └── 05_A5-openvariant/          ← AUC=0.939 ✅
    │
    ├── 🔬 S1-B · PHYLO-RNA/
    │   ├── S1-R2 · miRNA/
    │   │   └── 01_A1-brca2-mirna/          ✅
    │   ├── S1-R3 · siRNA/
    │   │   └── 02_A2-tp53-sirna/           ✅
    │   └── S1-R4 · lncRNA + ASO/
    │       └── 03_A3-lncrna-trem2/         ✅
    │
    ├── 💊 S1-C · PHYLO-DRUG/
    │   └── S1-R5 · FGFR3/
    │       └── 04_A4-fgfr3-rna-drug/       ✅
    │
    ├── 🧪 S1-D · PHYLO-LNP/
    │   ├── S1-R6 · Corona/
    │   │   └── 06_B1-lnp-corona-ml/        ← AUC=0.791 ✅
    │   ├── S1-R7 · Flow/
    │   │   └── 08_B3-corona-flow-dynamics/ ✅
    │   ├── S1-R8 · Brain/
    │   │   └── 09_B4-lnp-apoe-bbb/         ✅
    │   └── S1-R10 · NLP/
    │       └── 10_B5-autocorona-nlp/        ← F1=0.71 ✅
    │
    ├── 🩸 S1-E · PHYLO-BIOMARKERS/
    │   └── S1-R9 · Liquid Biopsy/
    │       └── 07_B2-corona-liquid-biopsy/  ← AUC=0.992* ✅
    │
    └── ☠️ S1-F · PHYLO-RARE/               ← <300 cases/yr · <5% survival
        ├── S1-R12b · DIPG/                  🔶 In development
        ├── S1-R12c · UVM/                   🔶 In development
        └── S1-R12d · pAML/                  🔶 In development
```

Each study folder contains:
```
XX_YY-study-name/
├── README.md
├── report.md
├── execution_trace.ipynb
├── data/
└── figures/
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/TEZv/SPHERE-I-SCIENCE.git
cd SPHERE-I-SCIENCE

# Navigate to any study (example: OpenVariant)
cd "S1 — 🩺 Biomedical & Oncology/🧬 S1-A · PHYLO-GENOMICS/S1-R1 · OpenVariant/05_A5-openvariant"
jupyter notebook execution_trace.ipynb
```

---

## 📖 Citation

```bibtex
@software{kolisnyk2026sphereiscience,
  author    = {Kolisnyk, Oksana},
  title     = {SPHERE-I-SCIENCE: Multi-sphere Computational Biology Repository},
  year      = {2026},
  month     = {March},
  publisher = {GitHub},
  url       = {https://github.com/TEZv/SPHERE-I-SCIENCE},
  note      = {S1 Biomedical: 10 open-source tools spanning RNA therapeutics,
               nanoparticle delivery, genomics, and rare cancers. S2–S6 planned.}
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
