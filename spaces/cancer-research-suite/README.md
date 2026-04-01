---
title: K R&D Lab — Cancer Research Suite
short_description: Real‑time data integration for precision oncology
emoji: 🧬
colorFrom: indigo
colorTo: blue
sdk: gradio
sdk_version: "5.22.0"
python_version: "3.10"
app_file: app.py
pinned: false
---

# K R&D Lab — Cancer Research Suite

**Author:** Oksana Kolisnyk | [kosatiks-group.pp.ua](https://kosatiks-group.pp.ua)
**DEMO Repo:** [github.com/TEZv/K-RnD-Lab-PHYLO-DEMO_03-2026](https://github.com/TEZv/K-RnD-Lab-PHYLO-DEMO_03-2026)
**ORCID:** 0009-0003-5780-2290
**Generated:** 2026-03-07

---

## Overview

A Gradio-based research suite combining live cancer data APIs with educational simulation tools. Designed for researchers, ML engineers, and students working at the intersection of cancer biology, drug delivery, and precision oncology.

**Two tab groups:**
- **Group A — Real Data Tools** (5 + 1 tabs): Live APIs, real results, never hallucinated
- **Group B — Learning Sandbox** (5 tabs): Rule-based simulations, clearly labeled ⚠️ SIMULATED

---

## File Structure

```
K-RnD-Lab/
├── app.py              # Main Gradio application (all 10 tabs + Lab Journal)
├── chatbot.py          # RAG chatbot module (sentence-transformers + FAISS)
├── requirements.txt    # Python dependencies
├── README.md           # This file
├── research_gaps.md    # Part 2: 10 underexplored research directions
├── learning_cases.md   # Part 3: 5 guided investigation cases
└── data_sources.md     # All API endpoints and data sources
```

Runtime-generated:
```
├── cache/              # API response cache (JSON, 24h TTL)
└── lab_journal.csv     # Auto-logged research journal
```

---

## Quick Start

### Local

```bash
# 1. Clone
git clone https://github.com/TEZv/K-RnD-Lab-PHYLO-DEMO_03-2026
cd K-RnD-Lab-PHYLO-DEMO_03-2026

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run
python app.py
# → Opens at http://localhost:7860
```

### HuggingFace Spaces

1. Create a new Space: **Gradio** SDK, Python 3.10+
2. Upload `app.py`, `chatbot.py`, `requirements.txt`
3. Space auto-deploys — no secrets or API keys needed

> The RAG chatbot downloads the `all-MiniLM-L6-v2` model (~80 MB) on first run.
> Subsequent runs use the HF cache. Allow ~60s for first startup.

---

## Tab Reference

### Group A — Real Data Tools

| Tab | Function | APIs Used |
|-----|----------|-----------|
| **A1 — Gray Zones Explorer** | Heatmap of biological process × cancer type paper counts; top 5 gaps | PubMed E-utilities |
| **A2 — Understudied Target Finder** | Essential genes with high gap index (essentiality / log(papers+1)) | OpenTargets GraphQL, PubMed, ClinicalTrials.gov v2 |
| **A3 — Real Variant Lookup** | ClinVar classification + gnomAD allele frequency for any HGVS variant | ClinVar E-utilities, gnomAD GraphQL |
| **A4 — Literature Gap Finder** | Papers/year chart with gap detection (zero and low-activity years) | PubMed E-utilities |
| **A5 — Druggable Orphans** | Essential cancer genes with no approved drug and no active trial | OpenTargets GraphQL, ClinicalTrials.gov v2 |
| **A6 — Research Assistant** | RAG chatbot indexed on 20 curated papers; confidence-flagged answers | sentence-transformers + FAISS (local) |

### Group B — Learning Sandbox ⚠️ SIMULATED

| Tab | Function | Model |
|-----|----------|-------|
| **B1 — miRNA Explorer** | Predicted miRNA binding energy + expression in BRCA1/BRCA2/TP53-mutant tumors | Curated lookup table |
| **B2 — siRNA Targets** | siRNA efficacy + off-target risk for LUAD/BRCA/COAD | Curated efficacy estimates |
| **B3 — LNP Corona** | Protein corona composition from formulation sliders (PEG, ionizable lipid, size) | Langmuir adsorption model |
| **B4 — Flow Corona** | Vroman effect kinetics (competitive albumin/ApoE adsorption) | Competitive Langmuir ODE |
| **B5 — Variant Concepts** | ACMG/AMP classification criteria and codes by tier | ACMG 2015 rule set |

### Shared — Lab Journal (sidebar)
- Auto-logs every tab run with timestamp, action, and result summary
- Manual note field for researcher observations
- Exports to `lab_journal.csv`
- Click **Refresh Journal** to view last 20 entries

---

## Supported Cancer Types

| Code | Full Name | EFO ID |
|------|-----------|--------|
| GBM | Glioblastoma multiforme | EFO_0000519 |
| PDAC | Pancreatic ductal adenocarcinoma | EFO_0002618 |
| SCLC | Small cell lung cancer | EFO_0000702 |
| UVM | Uveal melanoma | EFO_0004339 |
| DIPG | Diffuse intrinsic pontine glioma | EFO_0009708 |
| ACC | Adrenocortical carcinoma | EFO_0003060 |
| MCC | Merkel cell carcinoma | EFO_0005558 |
| PCNSL | Primary CNS lymphoma | EFO_0005543 |
| Pediatric AML | Pediatric acute myeloid leukemia | EFO_0000222 |

---

## Biological Processes Screened (Tab A1)

autophagy · ferroptosis · protein corona · RNA splicing · phase separation · m6A · circRNA · synthetic lethality · immune exclusion · enhancer hijacking · lncRNA regulation · metabolic reprogramming · exosome biogenesis · senescence · mitophagy · liquid-liquid phase separation · cryptic splicing · proteostasis · redox biology · translation regulation

---

## RAG Chatbot Details (Tab A6)

- **Model:** `sentence-transformers/all-MiniLM-L6-v2` (80 MB, CPU-only, no GPU needed)
- **Index:** FAISS `IndexFlatIP` with L2-normalized embeddings (cosine similarity)
- **Corpus:** 20 curated paper abstracts on LNP delivery, protein corona, cancer variants, liquid biopsy
- **Confidence flags:**
  - 🟢 HIGH — retrieval score ≥ 0.55, ≥ 2 matching papers
  - 🟡 MEDIUM — score 0.35–0.55
  - 🔴 SPECULATIVE — score < 0.35
- **Out-of-scope:** Returns explicit "not in indexed papers" message — never fabricates

---

## Caching & Rate Limiting

- All API responses cached in `./cache/` as JSON files (24h TTL)
- PubMed: `time.sleep(0.34)` between requests (≤3 req/sec, NCBI policy)
- All API calls wrapped in `try/except` → returns `"Data unavailable"` on failure, never fake data
- Cache can be cleared by deleting `./cache/` directory

---

## Data Attribution

Every result panel displays a source note:
```
Source: [API name] | Date: YYYY-MM-DD
```

Full API documentation: see `data_sources.md`

---

## Technical Notes

### DepMap Essentiality Scores
Per DepMap convention: **negative scores = essential genes** (knockout kills cells).
The app inverts scores before display: `essentiality_displayed = -raw_score`
so that **positive values = more essential** (intuitive direction).
Gap index = `essentiality_inverted / log(papers + 1)`

### Variant Lookup Policy
Tab A3 strictly follows a no-hallucination policy:
- If a variant is not found in ClinVar → displays: *"Not in database. Do not interpret."*
- If gnomAD API fails → displays: *"Data unavailable — API error."*
- Never infers, guesses, or extrapolates variant classifications

### SIMULATED Data Policy
All Group B tabs display a prominent ⚠️ SIMULATED banner.
Simulated results must not be used for:
- Clinical decision-making
- Publication without independent experimental validation
- Drug development or patient care

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| gradio | ≥4.20.0 | UI framework |
| numpy | ≥1.24.0 | Numerical computing |
| pandas | ≥2.0.0 | Data tables |
| matplotlib | ≥3.7.0 | Visualizations |
| Pillow | ≥10.0.0 | Image handling |
| requests | ≥2.31.0 | HTTP API calls |
| sentence-transformers | ≥2.6.0 | RAG embeddings |
| faiss-cpu | ≥1.7.4 | Vector similarity search |
| torch | ≥2.0.0 | sentence-transformers backend |

---

## License

Research and educational use. All real-data results sourced from public APIs (PubMed, OpenTargets, ClinVar, gnomAD, ClinicalTrials.gov) under their respective open-access licenses. See `data_sources.md` for details.

---

## Citation

```
Kolisnyk O. K R&D Lab — Cancer Research Suite. 2026.
GitHub: github.com/TEZv/K-RnD-Lab-PHYLO-DEMO_03-2026
ORCID: 0009-0003-5780-2290
```
