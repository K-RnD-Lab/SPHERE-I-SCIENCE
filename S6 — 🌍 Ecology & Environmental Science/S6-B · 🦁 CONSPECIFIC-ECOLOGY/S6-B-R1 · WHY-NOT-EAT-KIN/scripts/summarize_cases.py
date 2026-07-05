"""Summarize animal conspecific consumption case registry."""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "outputs"


def main() -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    with (ROOT / "data" / "animal_cannibalism_cases.csv").open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    prion = [r for r in rows if "prion" in r.get("pathogen_or_mechanism", "").lower()]
    report = {
        "n_cases": len(rows),
        "n_prion_linked": len(prion),
        "hook": "Why lions don't eat lions - and when humans force cattle to, epidemics follow.",
        "cases": rows,
    }
    (OUT / "cases_summary.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return report


if __name__ == "__main__":
    print(json.dumps(main(), indent=2, ensure_ascii=False))
