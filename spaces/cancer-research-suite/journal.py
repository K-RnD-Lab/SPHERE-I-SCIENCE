# journal.py
import os
import csv
import pandas as pd
import datetime

JOURNAL_FILE = "./lab_journal.csv"
JOURNAL_CATEGORIES = [
    # S1-A Genomics
    "S1-A·R1a",  # Real Variant Lookup
    "S1-A·R1b",  # Variant Concepts
    "S1-A·R2a",  # Gray Zones Explorer
    "S1-A·R2b",  # Understudied Target Finder
    "S1-A·R2c",  # Literature Gap Finder
    "S1-A·R2d",  # Druggable Orphans
    "S1-A·R2e",  # Research Assistant
    # S1-C Drug Discovery
    "S1-C·R1a",  # FGFR3 RNA Drug
    "S1-C·R1b",  # SL Drug Mapping
    "S1-C·R2a",  # m6A × Ferroptosis × Circadian
    # S1-D LNP
    "S1-D·R1a",  # LNP Corona ML
    "S1-D·R2a",  # Flow Corona
    "S1-D·R3a",  # LNP Brain / BBB
    "S1-D·R4a",  # AutoCorona NLP
    "S1-D·R5a",  # CSF/Vitreous/BM
    "S1-D·R6a",  # Corona Database
    # S1-E Biomarkers
    "S1-E·R1a",  # Liquid Biopsy Classifier
    "S1-E·R1b",  # Protein Panel Validator
    "S1-E·R2a",  # Multi-protein Biomarkers
    # S1-F Rare Cancers
    "S1-F·R1a",  # DIPG Toolkit
    "S1-F·R2a",  # UVM Toolkit
    "S1-F·R3a",  # pAML Toolkit
    # Learning Sandbox
    "S1-B·R1a",  # miRNA Explorer
    "S1-B·R2a",  # siRNA Targets
    "S1-G·General",  # 3D Models
    "Manual"
]

def journal_log(category: str, action: str, result: str, note: str = ""):
    """Log an entry with category."""
    ts = datetime.datetime.utcnow().isoformat()
    row = [ts, category, action, result[:200], note]
    write_header = not os.path.exists(JOURNAL_FILE)
    with open(JOURNAL_FILE, "a", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        if write_header:
            w.writerow(["timestamp", "category", "action", "result_summary", "note"])
        w.writerow(row)
    return ts

def journal_read(category: str = "All") -> str:
    """Read journal entries, optionally filtered by category. Returns markdown."""
    if not os.path.exists(JOURNAL_FILE):
        return "No entries yet."
    try:
        df = pd.read_csv(JOURNAL_FILE)
        if df.empty:
            return "No entries yet."
        if category != "All":
            df = df[df["category"] == category]
        if df.empty:
            return f"No entries for category: {category}"
        df_display = df[["timestamp", "category", "action", "result_summary"]].tail(50)
        return df_display.to_markdown(index=False)
    except Exception as e:
        print(f"Journal read error: {e}")
        return "Error reading journal."

def clear_journal():
    try:
        if os.path.exists(JOURNAL_FILE):
            os.remove(JOURNAL_FILE)
        return "Journal cleared."
    except Exception as e:
        print(f"Clear journal error: {e}")
        return "Error clearing journal."