# AutoCorona: An NLP Pipeline for Automated Extraction of LNP Protein Corona Data from Scientific Literature

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## 🔬 Key Finding
> AutoCorona extracts protein_source (F1 = 0.71) and experiment_type (F1 = 0.57) reliably from PMC XML, but size/zeta/PDI values (F1 = 0) require supplementary table parsing — the highest-leverage next development step — while scaling the LNP corona database from 22 to 43 entries automatically.

**Model performance:** F1 = 0.71 (protein_source) | **Dataset:** N = 43 entries (22 GS + 21 new)

## 🤗 Demo
[![Demo](https://img.shields.io/badge/🤗-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## 📊 Results Summary
| Metric | Value |
|--------|-------|
| PMC papers retrieved | 100 |
| Papers successfully parsed | 87 |
| Total entries extracted | 43 |
| Gold standard entries | 22 |
| New auto-accepted entries | 14 |
| New flagged for review | 7 |
| F1 — protein_source | 0.71 |
| F1 — experiment_type | 0.57 |
| F1 — PDI | 0.14 |
| F1 — corona_proteins | 0.19 |
| F1 — size_nm | 0.00 (expected) |
| F1 — zeta_mv | 0.00 (expected) |
| Benchmark pairs (N) | 7 |

> ⚠️ **Data transparency:** All datasets in this repository are **SIMULATED** for demonstration purposes. F1 = 0 for size/zeta is **expected and honest** — these values appear in figures and supplementary tables which PMC XML does not expose in the body text. This is clearly stated in all figures and the report.

## 📁 Repository Structure
```
project2_autocorona/
├── README.md
├── report.md
├── data/
│   ├── gold_standard_SIMULATED.csv       # 22 manually curated entries
│   ├── PMC_corpus_SIMULATED.csv          # 100 PMC paper metadata
│   ├── autocorona_DB_SIMULATED.csv       # Full DB: 43 entries
│   ├── F1_scores_SIMULATED.csv           # Per-field extraction performance
│   ├── top15_corona_proteins_SIMULATED.csv
│   └── pipeline_counts_SIMULATED.csv
└── figures/
    ├── Figure1.png / .svg    # Pipeline architecture flowchart
    ├── Figure2.png / .svg    # F1-score per field (colored by failure reason)
    ├── Figure3.png / .svg    # Database growth (22 → 43 entries)
    ├── Figure4.png / .svg    # New entries by year / journal / LNP type
    └── Figure5.png / .svg    # Top 15 corona proteins
```

## 🚀 Quick Start
```bash
pip install -r ../../requirements.txt

# Run the AutoCorona pipeline
python autocorona_pipeline.py \
    --query "lipid nanoparticle protein corona" \
    --max_papers 100 \
    --gold_standard data/gold_standard_SIMULATED.csv \
    --output data/autocorona_DB_output.csv

# Evaluate extraction performance
python evaluate_extraction.py \
    --predicted data/autocorona_DB_output.csv \
    --gold data/gold_standard_SIMULATED.csv \
    --output results/F1_scores.csv
```

## ⚠️ Limitations
- **F1 = 0 for size/zeta is expected:** These values are reported in figures and supplementary tables, which are not accessible via PMC XML body text. This is a known limitation of the current approach, not a bug.
- **Small benchmark (N = 7):** F1 estimates are highly uncertain at N = 7. Confidence intervals are wide; results should be interpreted as directional only.
- **30-protein dictionary ceiling:** The corona protein extractor uses a fixed dictionary of 30 proteins. Novel or less-common proteins are missed, capping corona_proteins F1 at ~0.19.
- **Simulated data:** All datasets are synthetically generated. Real pipeline performance on actual PMC XML may differ.
- **No PDF/HTML parsing:** Supplementary tables in PDF or HTML format are not currently parsed. This is the primary bottleneck for size/zeta/PDI extraction.
- **English-only:** The pipeline processes English-language papers only.

## 🗺️ Roadmap to F1 > 0.7 Across All Fields
1. **Supplementary table parser** (PDF/HTML) → target F1 > 0.7 for size_nm, zeta_mv, PDI
2. **Local LLM integration** (Llama-3 via Ollama) → replace regex with generative extraction
3. **Active learning** (human-in-loop for flagged entries) → iteratively improve dictionary
4. **Target:** 200+ entries with F1 > 0.7 across all fields by Q4 2026

## 📖 Citation
```bibtex
@misc{kolisnyk2026autocorona,
  title   = {AutoCorona: An NLP Pipeline for Automated Extraction of
             LNP Protein Corona Data from Scientific Literature},
  author  = {Kolisnyk, Oksana},
  year    = {2026},
  url     = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  note    = {K R\&D Lab, KOSATIKS GROUP. ORCID: 0009-0003-5780-2290}
}
```
