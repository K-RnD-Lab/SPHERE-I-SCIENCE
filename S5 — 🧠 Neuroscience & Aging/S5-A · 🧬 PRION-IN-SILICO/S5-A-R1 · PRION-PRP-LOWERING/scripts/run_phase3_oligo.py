"""Heuristic PRNP mRNA target windows for siRNA/ASO (in silico scaffold)."""

from __future__ import annotations

import json
import urllib.request

from config import OUT_DIR, PRP_LOWERING_REFERENCE, SPECIES

# Published clinical / preclinical references (for comparison, not re-design)
PUBLISHED_TARGETS = {
    "ION717": {
        "type": "ASO",
        "trial": "NCT06153966",
        "note": "Ionis antisense oligonucleotide; intrathecal; lowers CSF PrP",
    },
    "2439_exNA_divalent_siRNA": {
        "type": "siRNA (divalent)",
        "trial": "NCT07444580",
        "doi": "10.1101/2024.12.05.627039",
        "mouse_residual_prp_pct": [17, 49],
    },
}


def fetch_mrna_preview() -> str:
    """Fetch human PRNP mRNA from NCBI (NM_000311)."""
    url = (
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        "?db=nuccore&id=NM_000311&rettype=fasta&retmode=text"
    )
    with urllib.request.urlopen(url, timeout=60) as resp:
        fasta = resp.read().decode()
    lines = [ln.strip() for ln in fasta.splitlines() if ln.strip() and not ln.startswith(">")]
    return "".join(lines)


def gc_content(seq: str) -> float:
    s = seq.upper()
    if not s:
        return 0.0
    return round(100.0 * (s.count("G") + s.count("C")) / len(s), 1)


def scan_sirna_windows(mrna: str, window: int = 21, step: int = 50) -> list[dict]:
    """Slide windows; score by GC — full off-target BLAST omitted in scaffold."""
    hits = []
    for i in range(0, max(1, len(mrna) - window), step):
        w = mrna[i : i + window].upper()
        if "N" in w or len(w) < window:
            continue
        gc = gc_content(w)
        if 40 <= gc <= 60:
            hits.append({"start": i + 1, "end": i + window, "gc_pct": gc, "seq": w})
    return hits[:20]


def main() -> dict:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cdna = fetch_mrna_preview()

    report = {
        "gene": SPECIES["human"]["gene"],
        "cdna_length": len(cdna),
        "published_targets": PUBLISHED_TARGETS,
        "prp_lowering_thresholds": PRP_LOWERING_REFERENCE,
        "heuristic_sirna_windows": scan_sirna_windows(cdna),
        "disclaimer": "Heuristic only. Validate with siDirect, RNAfold, BLAST before any claim.",
    }

    path = OUT_DIR / "phase3_oligo_scaffold.json"
    path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    md = [
        "# Phase 3 — Oligo target scaffold",
        "",
        f"PRNP cdna length: **{len(cdna)}** nt",
        "",
        "## PrP lowering reference (preclinical)",
        "",
        f"- Heterozygous knockout ≈ **{PRP_LOWERING_REFERENCE['heterozygous_knockout_residual_pct']}%** residual PrP — tolerated in humans/mice",
        f"- Prophylactic benefit in mice at **<{100 - PRP_LOWERING_REFERENCE['minimal_benefit_prophylactic_pct']}%** residual "
        f"(>{PRP_LOWERING_REFERENCE['minimal_benefit_prophylactic_pct']}% lowering)",
        f"- Deep lowering goal (2439-s4 high dose): **~{PRP_LOWERING_REFERENCE['deep_lowering_goal_pct']}%** residual",
        "",
        "## Published clinical candidates",
        "",
    ]
    for name, meta in PUBLISHED_TARGETS.items():
        md.append(f"- **{name}** ({meta['type']}) — trial {meta.get('trial', 'n/a')}")
    md.extend(["", "## Top heuristic siRNA windows (GC 40–60%)", ""])
    for h in report["heuristic_sirna_windows"][:5]:
        md.append(f"- nt {h['start']}-{h['end']}, GC={h['gc_pct']}%")
    md.append("")
    md.append(f"_{report['disclaimer']}_")

    (OUT_DIR / "phase3_oligo_scaffold.md").write_text("\n".join(md), encoding="utf-8")
    return report


if __name__ == "__main__":
    print(json.dumps(main(), indent=2))
