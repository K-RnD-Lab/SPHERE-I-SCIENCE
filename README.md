# K R&D Lab — Computational Biology Research Suite

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![HuggingFace](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/K-RnD-Lab-PHYLO-03_2026)
[![GitHub](https://img.shields.io/badge/GitHub-K--RnD--Lab%2FSPHERE--I--SCIENCE-orange)](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXX)

> **Open-source computational biology research by Oksana Kolisnyk**  
> [kosatiks-group.pp.ua](https://kosatiks-group.pp.ua)

---

## 🧬 About

This repository contains 10 complete + 9 in-development computational biology studies
spanning RNA therapeutics, nanoparticle delivery, clinical genomics, and rare cancers.

> ⚠️ **Research use only.** All models are experimental.  
> Data labeled SIMULATED must not be interpreted as experimental findings.

---

## 🗺️ Lab Map — Numbering Logic

Each experiment gets a code **R{n}{letter}** scoped to its PHYLO track:

- **R-number** = research direction within the track (unique question, restarts per track)
- **Letter** = experiment within that direction (`a` = first, `b` = second…)
- Single studies still get letter `a` — so future `b` can be added without renaming

```
🧬 S1-A · R1a  ← track A, direction 1, experiment a
🔬 S1-B · R1a  ← track B, direction 1, experiment a   (R1 is LOCAL to each track)
🔬 S1-B · R2a  ← track B, direction 2, experiment a
🧪 S1-D · R1a  ← track D, direction 1, experiment a
🧪 S1-D · R5a  ← track D, direction 5, experiment a   (D has 5 different directions)
```

```
🧬 S1-A · PHYLO-GENOMICS    — What breaks in DNA?
🔬 S1-B · PHYLO-RNA         — How to silence it via RNA?
💊 S1-C · PHYLO-DRUG        — Which molecule treats it?
🧪 S1-D · PHYLO-LNP         — How to deliver the drug?
🩸 S1-E · PHYLO-BIOMARKERS  — How to detect it without biopsy?
🧠 S1-F · PHYLO-RARE        — Where almost nobody has looked yet (<300 cases/yr)
```

---

## 🔬 Research Projects

### 🧬 S1-A · PHYLO-GENOMICS
*What breaks in DNA?*

| Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Study &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Direction | Key Finding | Status |
|------|-------|-----------|-------------|--------|
| S1-A · **R1a** | [OpenVariant ⭐](<S1 — 🩺 Biomedical & Oncology/🧬 S1-A · PHYLO-GENOMICS/R1 · Variant classification/R1a-openvariant/>) | R1 · Variant classification | AUC=0.939 on ClinVar 2026, matches AlphaMissense without deep learning | ✅ |
| S1-A · R1b | [Somatic Classifier](<S1 — 🩺 Biomedical & Oncology/🧬 S1-A · PHYLO-GENOMICS/R1 · Variant classification/R1b-somatic-classifier/>) | R1 · Variant classification | BRCA · LUAD somatic mutation panels — same direction, broader scope | 🔶 |

### 🔬 S1-B · PHYLO-RNA
*How to silence it via RNA?*

| Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Study &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Direction | Key Finding | Status |
|------|-------|-----------|-------------|--------|
| S1-B · **R1a** | [BRCA2 miRNA](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/R1 · miRNA silencing/R1a-brca2-mirna/>) | R1 · miRNA silencing | hsa-miR-148a-3p top silenced miRNA in BRCA2-mut breast cancer | ✅ |
| S1-B · **R2a** | [TP53 siRNA](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/R2 · siRNA SL/R2a-tp53-sirna/>) | R2 · siRNA SL | SPC24, BUB1B, CDC45 — novel synthetic-lethal targets, no existing drugs | ✅ |
| S1-B · **R3a** | [lncRNA-TREM2](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/R3 · lncRNA + ASO/R3a-lncrna-trem2/>) | R3 · lncRNA + ASO | CYTOR→miR-138-5p→AKT1 axis controls TREM2 neuroinflammation | ✅ |
| S1-B · **R3b** | [ASO Designer](<S1 — 🩺 Biomedical & Oncology/🔬 S1-B · PHYLO-RNA/R3 · lncRNA + ASO/R3b-aso-designer/>) | R3 · lncRNA + ASO | GAS5 pos.119, CYTOR pos.507 — HIGH priority ASO candidates | ✅ |

### 💊 S1-C · PHYLO-DRUG
*Which molecule treats it?*

| Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Study &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Direction | Key Finding | Status |
|------|-------|-----------|-------------|--------|
| S1-C · **R1a** | [FGFR3 RNA Drug](<S1 — 🩺 Biomedical & Oncology/💊 S1-C · PHYLO-DRUG/R1 · RNA-directed drug/R1a-fgfr3-rna-drug/>) | R1 · RNA-directed drug | CHEMBL1575701 lead, RNA-score 0.793, near-zero toxicity | ✅ |
| S1-C · R1b | [SL Drug Mapping](<S1 — 🩺 Biomedical & Oncology/💊 S1-C · PHYLO-DRUG/R1 · RNA-directed drug/R1b-sl-drug-mapping/>) | R1 · RNA-directed drug | Synthetic lethal drug mapping — pan-cancer extension of R1a | 🔶 |
| S1-C · R2a | [m6A × Ferroptosis × Circadian](<S1 — 🩺 Biomedical & Oncology/💊 S1-C · PHYLO-DRUG/R2 · Frontier/R2a-m6a-ferroptosis-circadian/>) | R2 · Frontier | Pan-cancer triple-intersection — 0 prior integrated studies | 🔴 |

### 🧪 S1-D · PHYLO-LNP
*How to deliver the drug?*

| Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Study &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Direction | Key Finding | Status |
|------|-------|-----------|-------------|--------|
| S1-D · **R1a** | [LNP Corona ML](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/R1 · Serum corona/R1a-lnp-corona-ml/>) | R1 · Serum corona | CHL/HL/PEG molar ratios dominate corona efficacy (AUC=0.791) | ✅ |
| S1-D · **R2a** | [Flow Corona](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/R2 · Flow corona/R2a-flow-corona/>) | R2 · Flow dynamics | Blood flow accelerates albumin→ApoE exchange 3–4× vs static (Vroman) | ✅ |
| S1-D · **R3a** | [LNP Brain](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/R3 · Brain BBB/R3a-lnp-bbb/>) | R3 · Brain / BBB | pKa 6.2–6.8 + zeta ±5 mV predicts ApoE >20% corona for BBB | ✅ |
| S1-D · **R4a** | [AutoCorona NLP](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/R4 · NLP/R4a-autocorona-nlp/>) | R4 · NLP extraction | protein_source F1=0.71 from PMC abstracts; size/zeta need PDF parser | ✅ |
| S1-D · R5a | [CSF · Vitreous · BM](<S1 — 🩺 Biomedical & Oncology/🧪 S1-D · PHYLO-LNP/R5 · Exotic fluids/R5a-csf-vitreous-bm/>) | R5 · Exotic fluids | 0 prior LNP corona studies in CSF / vitreous humor / bone marrow | 🔴 |

### 🩸 S1-E · PHYLO-BIOMARKERS
*How to detect it without biopsy?*

| Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Study &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Direction | Key Finding | Status |
|------|-------|-----------|-------------|--------|
| S1-E · **R1a** | [Liquid Biopsy](<S1 — 🩺 Biomedical & Oncology/🩸 S1-E · PHYLO-BIOMARKERS/R1 · Liquid biopsy/R1a-liquid-biopsy/>) | R1 · Liquid biopsy | CTHRC1+FHL2+LDHA separates cancer vs healthy (AUC=0.992*) | ✅ |
| S1-E · R1b | [Protein Validator](<S1 — 🩺 Biomedical & Oncology/🩸 S1-E · PHYLO-BIOMARKERS/R1 · Liquid biopsy/R1b-protein-validator/>) | R1 · Liquid biopsy | Multi-cancer plasma proteomics validation — same direction, validation step | 🔶 |

### 🧠 S1-F · PHYLO-RARE
*Where almost nobody has looked yet (<300 cases/yr · <5% survival)*

| Code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Study &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Direction | Key Finding | Status |
|------|-------|-----------|-------------|--------|
| S1-F · R1a | [DIPG Toolkit](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/R1 · DIPG/R1a-dipg/>) | R1 · DIPG | H3K27M (78%) + CSF LNP corona — 0 prior LNP studies · PBTA/GSE126319 | 🔶 |
| S1-F · R2a | [UVM Toolkit](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/R2 · UVM/R2a-uvm/>) | R2 · UVM | GNAQ/GNA11 (78%) + vitreous corona + m6A · TCGA-UVM n=80 | 🔶 |
| S1-F · R3a | [pAML Toolkit](<S1 — 🩺 Biomedical & Oncology/☠️ S1-F · PHYLO-RARE/R3 · pAML/R3a-paml/>) | R3 · pAML | FLT3-ITD + BM niche corona + ferroptosis · TARGET-AML | 🔶 |

*S1-E·R1a AUC reflects tissue proteomics proxy, not plasma validation.*
*✅ complete · 🔶 in progress · 🔴 planned/frontier*

---

## 📁 Repository Structure

```
SPHERE-I-SCIENCE/
│
└── S1 — 🩺 Biomedical & Oncology/
    ├── 🧬 S1-A · PHYLO-GENOMICS/
    │   └── S1-A-R1 · Variant classification/
    │       ├── R1a-openvariant/              ✅  AUC=0.939
    │       └── R1b-somatic-classifier/       🔶
    ├── 🔬 S1-B · PHYLO-RNA/
    │   ├── S1-B-R1 · miRNA silencing/
    │   │   └── R1a-brca2-mirna/              ✅
    │   ├── S1-B-R2 · siRNA SL/
    │   │   └── R2a-tp53-sirna/               ✅
    │   └── S1-B-R3 · lncRNA + ASO/
    │       ├── R3a-lncrna-trem2/             ✅
    │       └── R3b-aso-designer/             ✅
    ├── 💊 S1-C · PHYLO-DRUG/
    │   ├── S1-C-R1 · RNA-directed drug/
    │   │   ├── R1a-fgfr3-rna-drug/           ✅
    │   │   └── R1b-sl-drug-mapping/          🔶
    │   └── S1-C-R2 · Frontier/
    │       └── R2a-m6a-ferroptosis-circadian/ 🔴
    ├── 🧪 S1-D · PHYLO-LNP/
    │   ├── S1-D-R1 · Serum corona/   → R1a-lnp-corona-ml/         ✅  AUC=0.791
    │   ├── S1-D-R2 · Flow corona/    → R2a-flow-corona/            ✅
    │   ├── S1-D-R3 · Brain BBB/      → R3a-lnp-bbb/               ✅
    │   ├── S1-D-R4 · NLP/            → R4a-autocorona-nlp/         ✅  F1=0.71
    │   └── S1-D-R5 · Exotic fluids/  → R5a-csf-vitreous-bm/       🔴
    ├── 🩸 S1-E · PHYLO-BIOMARKERS/
    │   └── S1-E-R1 · Liquid biopsy/
    │       ├── R1a-liquid-biopsy/             ✅  AUC=0.992*
    │       └── R1b-protein-validator/         🔶
    └── 🧠 S1-F · PHYLO-RARE/
        ├── S1-F-R1 · DIPG/  → R1a-dipg/            🔶  PBTA · GSE126319
        ├── S1-F-R2 · UVM/   → R2a-uvm/             🔶  TCGA-UVM n=80
        └── S1-F-R3 · pAML/  → R3a-paml/            🔶  TARGET-AML
```

---

## 📖 Citation

```bibtex
@software{kolisnyk2026sphereiscience,
  author    = {Kolisnyk, Oksana},
  title     = {SPHERE-I-SCIENCE: Multi-sphere Computational Biology Repository},
  year      = {2026}, month = {March}, publisher = {GitHub},
  url       = {https://github.com/TEZv/SPHERE-I-SCIENCE},
  note      = {S1 Biomedical: 10 complete + 9 in-progress studies.}
}
```

---

## ⚠️ Disclaimer

All computational models are research-grade and experimental.
Results labeled SIMULATED require experimental validation before any clinical application.
This work does not constitute medical advice.

---

*Built with Python · Gradio · scikit-learn · XGBoost · matplotlib*  
*© 2026 Oksana Kolisnyk · MIT License*
