"""Build conspecific vs inter-species risk table from literature seed CSV."""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "pathogen_literature_seed.csv"
OUT = ROOT / "outputs"


def main() -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    with DATA.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    critical = [r for r in rows if r.get("conspecific_risk") == "critical"]
    report = {
        "title": "Conspecific pathogen compatibility matrix",
        "n_entries": len(rows),
        "n_critical_conspecific": len(critical),
        "conclusion": (
            "Even with hypothetical PrP elimination, multiple independent "
            "conspecific-critical classes remain (viruses, bacteria, latent prions)."
        ),
        "entries": rows,
    }

    (OUT / "pathogen_matrix.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    md = [
        "# Pathogen compatibility matrix",
        "",
        f"Entries: **{len(rows)}** | Conspecific-critical: **{len(critical)}**",
        "",
        report["conclusion"],
        "",
        "| Class | Example | Conspecific | Inter-species |",
        "|-------|---------|-------------|---------------|",
    ]
    for r in rows:
        md.append(
            f"| {r['pathogen_class']} | {r['example']} | {r['conspecific_risk']} | {r['inter_specific_risk']} |"
        )
    (OUT / "pathogen_matrix.md").write_text("\n".join(md), encoding="utf-8")
    return report


if __name__ == "__main__":
    print(json.dumps(main(), indent=2, ensure_ascii=False))
