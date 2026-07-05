"""Fetch PrP amino-acid sequences from UniProt."""

from __future__ import annotations

import json
import urllib.request
from io import StringIO

from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio import SeqIO

from config import MUTATIONS, SEQ_DIR, SPECIES


def fetch_uniprot_fasta(uniprot_id: str) -> SeqRecord:
    url = f"https://rest.uniprot.org/uniprotkb/{uniprot_id}.fasta"
    with urllib.request.urlopen(url, timeout=60) as resp:
        text = resp.read().decode()
    records = list(SeqIO.parse(StringIO(text), "fasta"))
    if not records:
        raise RuntimeError(f"No FASTA for {uniprot_id}")
    return records[0]


def apply_mutations(sequence: str, mutations: list[tuple[str, int, str]]) -> str:
    """Apply point mutations using 1-based residue positions on full UniProt sequence."""
    chars = list(sequence)
    for _ref, pos, alt in mutations:
        idx = pos - 1
        if idx < 0 or idx >= len(chars):
            raise ValueError(f"Position {pos} out of range (len={len(sequence)})")
        chars[idx] = alt
    return "".join(chars)


def main() -> dict:
    SEQ_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict = {"species": {}, "variants": {}}

    for name, meta in SPECIES.items():
        rec = fetch_uniprot_fasta(meta["uniprot"])
        path = SEQ_DIR / f"{name}_{meta['uniprot']}.fasta"
        SeqIO.write(rec, path, "fasta")
        manifest["species"][name] = {
            "uniprot": meta["uniprot"],
            "length": len(rec.seq),
            "file": str(path.relative_to(SEQ_DIR.parent.parent)),
        }

    human = fetch_uniprot_fasta(SPECIES["human"]["uniprot"])
    human_seq = str(human.seq)

    for var_name, muts in MUTATIONS.items():
        if not muts:
            seq = human_seq
        else:
            seq = apply_mutations(human_seq, muts)
        record = SeqRecord(Seq(seq), id=f"human_{var_name}", description="synthetic variant")
        path = SEQ_DIR / f"human_{var_name}.fasta"
        SeqIO.write(record, path, "fasta")
        manifest["variants"][var_name] = {
            "mutations": muts,
            "length": len(seq),
            "file": str(path.relative_to(SEQ_DIR.parent.parent)),
        }

    manifest_path = SEQ_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


if __name__ == "__main__":
    print(json.dumps(main(), indent=2))
