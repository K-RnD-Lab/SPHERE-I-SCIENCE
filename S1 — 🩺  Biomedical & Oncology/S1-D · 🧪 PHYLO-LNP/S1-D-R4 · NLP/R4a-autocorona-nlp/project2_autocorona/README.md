# AutoCorona: An NLP Pipeline for Automated Extraction of LNP Protein Corona Data from Scientific Literature

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** | kosatiks-group.pp.ua

## рџ”¬ Key Finding
> AutoCorona extracts protein_source (F1 = 0.71) and experiment_type (F1 = 0.57) reliably from PMC XML, but size/zeta/PDI values (F1 = 0) require supplementary table parsing вЂ” the highest-leverage next development step вЂ” while scaling the LNP corona database from 22 to 43 entries automatically.

**Model performance:** F1 = 0.71 (protein_source) | **Dataset:** N = 43 entries (22 GS + 21 new)

## рџ¤— Demo
[![Demo](https://img.shields.io/badge/рџ¤—-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## рџ“Љ Results Summary
| Metric | Value |
|--------|-------|
| PMC papers retrieved | 100 |
| Papers successfully parsed | 87 |
| Total entries extracted | 43 |
| Gold standard entries | 22 |
| New auto-accepted entries | 14 |
| New flagged for review | 7 |
| F1 вЂ” protein_source | 0.71 |
| F1 вЂ” experiment_type | 0.57 |
| F1 вЂ” PDI | 0.14 |
| F1 вЂ” corona_proteins | 0.19 |
| F1 вЂ” size_nm | 0.00 (expected) |
| F1 вЂ” zeta_mv | 0.00 (expected) |
| Benchmark pairs (N) | 7 |

> вљ пёЏ **Data transparency:** All datasets in this repository are **SIMULATED** for demonstration purposes. F1 = 0 for size/zeta is **expected and honest** вЂ” these values appear in figures and supplementary tables which PMC XML does not expose in the body text. This is clearly stated in all figures and the report.

## рџ“Ѓ Repository Structure
```
project2_autocorona/
в”њв”Ђв”Ђ README.md
в”њв”Ђв”Ђ report.md
в”њв”Ђв”Ђ data/
в”‚   в”њв”Ђв”Ђ gold_standard_SIMULATED.csv       # 22 manually curated entries
в”‚   в”њв”Ђв”Ђ PMC_corpus_SIMULATED.csv          # 100 PMC paper metadata
в”‚   в”њв”Ђв”Ђ autocorona_DB_SIMULATED.csv       # Full DB: 43 entries
в”‚   в”њв”Ђв”Ђ F1_scores_SIMULATED.csv           # Per-field extraction performance
в”‚   в”њв”Ђв”Ђ top15_corona_proteins_SIMULATED.csv
в”‚   в””в”Ђв”Ђ pipeline_counts_SIMULATED.csv
в””в”Ђв”Ђ figures/
    в”њв”Ђв”Ђ Figure1.png / .svg    # Pipeline architecture flowchart
    в”њв”Ђв”Ђ Figure2.png / .svg    # F1-score per field (colored by failure reason)
    в”њв”Ђв”Ђ Figure3.png / .svg    # Database growth (22 в†’ 43 entries)
    в”њв”Ђв”Ђ Figure4.png / .svg    # New entries by year / journal / LNP type
    в””в”Ђв”Ђ Figure5.png / .svg    # Top 15 corona proteins
```

## рџљЂ Quick Start
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

## вљ пёЏ Limitations
- **F1 = 0 for size/zeta is expected:** These values are reported in figures and supplementary tables, which are not accessible via PMC XML body text. This is a known limitation of the current approach, not a bug.
- **Small benchmark (N = 7):** F1 estimates are highly uncertain at N = 7. Confidence intervals are wide; results should be interpreted as directional only.
- **30-protein dictionary ceiling:** The corona protein extractor uses a fixed dictionary of 30 proteins. Novel or less-common proteins are missed, capping corona_proteins F1 at ~0.19.
- **Simulated data:** All datasets are synthetically generated. Real pipeline performance on actual PMC XML may differ.
- **No PDF/HTML parsing:** Supplementary tables in PDF or HTML format are not currently parsed. This is the primary bottleneck for size/zeta/PDI extraction.
- **English-only:** The pipeline processes English-language papers only.

## рџ—єпёЏ Roadmap to F1 > 0.7 Across All Fields
1. **Supplementary table parser** (PDF/HTML) в†’ target F1 > 0.7 for size_nm, zeta_mv, PDI
2. **Local LLM integration** (Llama-3 via Ollama) в†’ replace regex with generative extraction
3. **Active learning** (human-in-loop for flagged entries) в†’ iteratively improve dictionary
4. **Target:** 200+ entries with F1 > 0.7 across all fields by Q4 2026

## рџ“– Citation
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

