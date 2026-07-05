"""Run Phase 1 + scaffolds for Phase 2–3."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import compare_sequences
import fetch_alphafold
import fetch_sequences
import run_phase2_md_scaffold
import run_phase3_oligo
from config import OUT_DIR


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    summary = {
        "sequences": fetch_sequences.main(),
        "alphafold": fetch_alphafold.main(),
        "comparison": compare_sequences.main(),
    }
    run_phase2_md_scaffold.main()
    summary["phase3"] = run_phase3_oligo.main()

    p2 = OUT_DIR / "phase2_md_scaffold.json"
    summary["phase2"] = json.loads(p2.read_text(encoding="utf-8"))

    out = OUT_DIR / "run_summary.json"
    out.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("Done. Reports:", OUT_DIR)


if __name__ == "__main__":
    main()
