"""Pairwise sequence identity and mutation site report."""

from __future__ import annotations

import json
from pathlib import Path

from Bio.SeqIO import parse

from config import MUTATIONS, OUT_DIR, SEQ_DIR, SPECIES


def load_seq(path: Path) -> str:
    return str(next(parse(path, "fasta")).seq)


def identity(a: str, b: str) -> float:
    from Bio.Align import PairwiseAligner

    aligner = PairwiseAligner(mode="global")
    aligner.match_score = 1
    aligner.mismatch_score = 0
    aln = aligner.align(a, b)[0]
    matches = aln.score
    length = max(len(a), len(b))
    return round(100.0 * matches / length, 2)


def mutation_sites(ref: str, var: str) -> list[dict]:
    sites = []
    for i, (r, v) in enumerate(zip(ref, var), start=1):
        if r != v:
            sites.append({"position": i, "ref": r, "alt": v})
    return sites


def main() -> dict:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    human_path = SEQ_DIR / f"human_{SPECIES['human']['uniprot']}.fasta"
    human_seq = load_seq(human_path)

    cross_species = {}
    for name in ("mouse", "rat"):
        p = SEQ_DIR / f"{name}_{SPECIES[name]['uniprot']}.fasta"
        cross_species[name] = {
            "identity_vs_human_pct": identity(human_seq, load_seq(p)),
            "length": len(load_seq(p)),
        }

    variants = {}
    for var_name in MUTATIONS:
        p = SEQ_DIR / f"human_{var_name}.fasta"
        var_seq = load_seq(p)
        variants[var_name] = {
            "sites": mutation_sites(human_seq, var_seq),
            "identity_vs_wt_pct": identity(human_seq, var_seq),
        }

    report = {
        "human_length": len(human_seq),
        "cross_species": cross_species,
        "variants": variants,
        "note_FFI": "Clinical FFI typically requires D178N plus Met at codon 129 (cis); "
        "this pipeline models D178N on the reference sequence only.",
    }

    out_path = OUT_DIR / "phase1_sequence_comparison.json"
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    md_lines = [
        "# Phase 1 — Sequence comparison",
        "",
        "## Cross-species identity (vs human)",
        "",
    ]
    for sp, data in cross_species.items():
        md_lines.append(f"- **{sp}**: {data['identity_vs_human_pct']}% ({data['length']} aa)")
    md_lines.extend(["", "## Human variants", ""])
    for var, data in variants.items():
        sites = ", ".join(f"{s['ref']}{s['position']}{s['alt']}" for s in data["sites"]) or "none"
        md_lines.append(f"- **{var}**: {sites}")
    md_lines.append("")
    md_lines.append(f"_{report['note_FFI']}_")

    (OUT_DIR / "phase1_sequence_comparison.md").write_text("\n".join(md_lines), encoding="utf-8")
    return report


if __name__ == "__main__":
    print(json.dumps(main(), indent=2))
