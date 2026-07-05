"""Paths and constants for S5-C-R1 PRION-IN-SILICO."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SEQ_DIR = DATA / "sequences"
STRUCT_DIR = DATA / "structures"
OUT_DIR = ROOT / "outputs" / "reports"

SPECIES = {
    "human": {"uniprot": "P04156", "gene": "PRNP", "taxon": 9606},
    "mouse": {"uniprot": "P04925", "gene": "Prnp", "taxon": 10090},
    "rat": {"uniprot": "P13852", "gene": "Prnp", "taxon": 10116},
}

# Human pathogenic variants (1-based UniProt mature chain numbering context in notes)
MUTATIONS = {
    "WT": [],
    "FFI_D178N": [("D", 178, "N")],  # requires Met at 129 for FFI phenotype
    "CJD_E200K": [("E", 200, "K")],
    "protective_G127V": [("G", 127, "V")],
}

# PrP lowering thresholds from preclinical literature (mouse/human genetics)
PRP_LOWERING_REFERENCE = {
    "heterozygous_knockout_residual_pct": 50,
    "minimal_benefit_prophylactic_pct": 75,  # <25% residual = >75% lowering
    "deep_lowering_goal_pct": 17,  # divalent siRNA 2439-s4 high dose in mice
    "moderate_lowering_pct": 49,
}

ALPHAFOLD_API = "https://alphafold.ebi.ac.uk/api/prediction/{uniprot}"
