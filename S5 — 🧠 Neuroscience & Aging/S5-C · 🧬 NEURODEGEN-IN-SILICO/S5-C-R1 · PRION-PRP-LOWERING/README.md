# S5-C-R1 · PRION-PRP-LOWERING

**Lane:** S5-C Neurodegeneration Models (`docs/S5/S5_A_TO_E_RESEARCH_MAP.md`)  
**Project:** S5-C-R1 · Prion PrP Lowering — In Silico  
**Status:** ⚠ IN SILICO / HYPOTHESIS

Computational pipeline for human/mouse/rat prion protein (PrP) structure comparison,
pathogenic PRNP mutations (FFI, CJD), and literature-grounded siRNA/ASO target context.

## Quick start

```bash
cd work/sphere-i-science/S5-C-PRION-IN-SILICO
python3.11 -m venv .venv
.venv/Scripts/pip install -r requirements.txt
.venv/Scripts/python scripts/run_phase1.py
```

Outputs land in `outputs/reports/`.

## Phases

| Phase | Script | Status |
|-------|--------|--------|
| 1 — Structures & mutations | `scripts/run_phase1.py` | runnable |
| 2 — MD (GROMACS/OpenMM) | `scripts/run_phase2_md_scaffold.py` | scaffold |
| 3 — Oligo targets | `scripts/run_phase3_oligo.py` | runnable (heuristic) |
| 4 — Cross-disease | `docs/cross_disease_amyloid.md` | reference |

## Data sources

- UniProt: P04156 (human), P04925 (mouse), P13852 (rat)
- AlphaFold DB API
- ClinVar / literature: D178N+129M (FFI), E200K (CJD)

## Limits

AlphaFold predicts native-fold snapshots, not prion conversion dynamics.
MD results are hypotheses until validated experimentally.
