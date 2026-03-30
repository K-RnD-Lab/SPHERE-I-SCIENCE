# Computational Discovery of Small Molecules Targeting FGFR3 mRNA for Bladder Cancer

> Part of [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)
> **Oksana Kolisnyk** В· ML Engineer | kosatiks-group.pp.ua

## Key Finding

> CHEMBL1575701 / Benzo[g]pteridine-2,4-dione (hairpin P1, SIMULATED score=0.793) and CHEMBL15727 / Thionin Acetate (G-quadruplex P10, SIMULATED score=0.789) are the top-ranked hypothetical leads from a SIMULATED virtual screen of FGFR3 5вЂІUTR pockets; both satisfy the four classic Lipinski criteria with real ChEMBL MW 288 Da and 228 Da (freebase) respectively, and near-zero predicted toxicity (SIMULATED). **Note: CHEMBL1575701 is a pteridine derivative (PubChem CID 16195593) with no established RNA-binding activity. CHEMBL15727 / Thionin Acetate is a synthetic phenothiazine histological dye (3,7-Diamino-5-phenothiazinium acetate, CAS 78338-22-4) вЂ” NOT a plant peptide. Neither compound has established FGFR3 mRNA binding activity. All scores are SIMULATED and no direct comparison to erdafitinib's experimental activity is implied.**

**Model performance:** Top-2 RNA-binding score = 0.793 / 0.789 (SIMULATED) | **Dataset:** N = 200 compounds (SIMULATED virtual screen)

## Demo

[![Demo](https://img.shields.io/badge/HuggingFace-Live_Demo-yellow)](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)

## Results Summary

| Metric | Value |
|--------|-------|
| FGFR3 5вЂІUTR length (verified, NM_000142.5) | 275 nt (positions 1вЂ“275; CDS start = 276) |
| FGFR3 5вЂІUTR MFE | в€’83.70 kcal/mol [ILLUSTRATIVE SEED] |
| Druggable pockets identified | 2 (P1 hairpin, P10 G-quadruplex) [ILLUSTRATIVE] |
| P1 accessibility | 0.817 [ILLUSTRATIVE SEED] |
| P10 volume | 750 Г…Ві [ILLUSTRATIVE SEED] |
| P10 G4Hunter score | 1.72 [ILLUSTRATIVE SEED] |
| Compounds screened (SIMULATED) | 200 |
| Hit rate (score в‰Ґ 0.75) | 8 / 200 (4%) [construction artifact вЂ” see report В§3.3] |
| Top-1 compound | CHEMBL1575701 / Benzo[g]pteridine-2,4-dione (score = 0.793) [SIMULATED] |
| Top-2 compound | CHEMBL15727 / Thionin Ac. dye (score = 0.789) [SIMULATED] |
| Top-1 MW | 288.22 Da (freebase) |
| Top-1 Ro5 violations (MW/LogP/HBD/HBA) | 0 |
| Top-1 PSA | 160.66 Г…ВІ (exceeds 140 Г…ВІ oral absorption threshold) |
| Erdafitinib (protein ctrl) score | 0.570 [SIMULATED] |
| Score comparison note | All scores SIMULATED вЂ” no experimental comparison implied |

## Repository Structure

```
SPHERE-I-SCIENCE/
в”њв”Ђв”Ђ README.md
в”њв”Ђв”Ђ report.md
в”њв”Ђв”Ђ execution_trace.ipynb
в”њв”Ђв”Ђ data/
в”‚   в”њв”Ђв”Ђ SIMULATED_docking_scores.csv       # 200-compound virtual screen
в”‚   в”њв”Ђв”Ђ SIMULATED_admet_top5.csv           # ADMET profiles, top-5 candidates
в”‚   в””в”Ђв”Ђ SIMULATED_benchmark_comparison.csv # vs erdafitinib & patisiran
в””в”Ђв”Ђ figures/
    в”њв”Ђв”Ђ Figure1.png / Figure1.svg          # FGFR3 5'UTR arc diagram [ILLUSTRATIVE]
    в”њв”Ђв”Ђ Figure2.png / Figure2.svg          # Pocket locations P1 & P10 [ILLUSTRATIVE]
    в”њв”Ђв”Ђ Figure3.png / Figure3.svg          # Docking score distribution + top-10
    в”њв”Ђв”Ђ Figure4.png / Figure4.svg          # ADMET radar plots, top-5
    в””в”Ђв”Ђ Figure5.png / Figure5.svg          # Benchmark vs erdafitinib & patisiran
```

## Quick Start

```bash
# Clone repository
git clone https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE
cd SPHERE-I-SCIENCE

# Install dependencies
pip install pandas numpy matplotlib seaborn requests

# Reproduce figures
jupyter notebook execution_trace.ipynb

# Or run directly
python -c "import pandas as pd; df = pd.read_csv('data/SIMULATED_docking_scores.csv'); print(df.head(10))"
```

## Limitations

- **All docking scores, ADMET bioavailability, hERG risk, and hepatotoxicity values are SIMULATED** вЂ” generated as illustrative seed data. They do not represent results from actual AutoDock, Glide, or SwissADME runs.
- **The mRNA secondary structure is SIMULATED** вЂ” the dot-bracket notation and base-pair assignments are illustrative representations consistent with the provided MFE (в€’83.70 kcal/mol) but were not computed by ViennaRNA or RNAfold in this session.
- **All structural values (MFE, pocket volumes, G4Hunter score, nucleotide positions) are ILLUSTRATIVE SEED DATA** вЂ” not computed from the NM_000142.5 sequence. Real values require RNAfold + fpocket + G4Hunter execution.
- **5вЂІUTR length:** Verified as 275 nt (positions 1вЂ“275, CDS start = 276) from NM_000142.5 GenBank record. Figures use an earlier estimate of 143 nt and should be regenerated.
- **Physicochemical properties** (MW, LogP, HBD, HBA, PSA, Ro5) for CHEMBL1575701, CHEMBL15727 (Thionin Acetate), CHEMBL126 (Linezolid), CHEMBL4297528 (Risdiplam), and CHEMBL4290141 (Branaplam) are **real values fetched from ChEMBL**.
- **CHEMBL1575701** is 8-amino-7-methyl-9-nitro-1H-benzo[g]pteridine-2,4-dione (PubChem CID 16195593) вЂ” a pteridine derivative with no established RNA-binding activity.
- **CHEMBL15727 / Thionin Acetate** is 3,7-Diamino-5-phenothiazinium acetate (CAS 78338-22-4), a synthetic phenothiazine histological dye вЂ” NOT a plant antimicrobial peptide. Its RNA-binding activity against FGFR3 5вЂІUTR is speculative.
- **CHEMBL1575701 PSA = 160.66 Г…ВІ** exceeds the 140 Г…ВІ oral absorption threshold. This compound is unlikely to be orally bioavailable; intravesical delivery would be required.
- **Hit rate (4%)** is a mathematical artifact of choosing threshold = Ој + 2Пѓ of the simulated distribution вЂ” not a biologically meaningful result.
- No wet-lab validation has been performed. All findings require experimental confirmation.

## Citation

```bibtex
@misc{kolisnyk2026fgfr3rna,
  title     = {Computational Discovery of Small Molecules Targeting FGFR3 mRNA for Bladder Cancer},
  author    = {Kolisnyk, Oksana},
  year      = {2026},
  month     = {March},
  publisher = {K R\&D Lab | kosatiks-group.pp.ua},
  url       = {https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE},
  note      = {ORCID: 0009-0003-5780-2290. Contains SIMULATED data вЂ” not peer-reviewed experimental results.}
}
```

