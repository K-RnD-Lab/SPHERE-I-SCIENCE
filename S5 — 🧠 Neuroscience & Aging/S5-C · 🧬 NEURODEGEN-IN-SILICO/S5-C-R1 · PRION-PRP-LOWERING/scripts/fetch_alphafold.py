"""Download AlphaFold PDB structures via public API."""

from __future__ import annotations

import json
import urllib.request

from config import ALPHAFOLD_API, SPECIES, STRUCT_DIR


def fetch_pdb(uniprot_id: str, out_name: str) -> dict:
    url = ALPHAFOLD_API.format(uniprot=uniprot_id)
    with urllib.request.urlopen(url, timeout=120) as resp:
        entries = json.loads(resp.read().decode())
    if not entries:
        raise RuntimeError(f"No AlphaFold entry for {uniprot_id}")

    entry = entries[0]
    pdb_url = entry.get("pdbUrl")
    if not pdb_url:
        raise RuntimeError(f"No pdbUrl for {uniprot_id}")

    with urllib.request.urlopen(pdb_url, timeout=120) as resp:
        pdb_text = resp.read().decode()

    STRUCT_DIR.mkdir(parents=True, exist_ok=True)
    pdb_path = STRUCT_DIR / f"{out_name}_{uniprot_id}.pdb"
    pdb_path.write_text(pdb_text, encoding="utf-8")

    return {
        "uniprot": uniprot_id,
        "pdb_file": str(pdb_path.name),
        "plddt_avg": entry.get("globalMetricValue"),
        "coverage": entry.get("coverage"),
    }


def main() -> dict:
    manifest = {}
    for name, meta in SPECIES.items():
        manifest[name] = fetch_pdb(meta["uniprot"], name)

    out = STRUCT_DIR / "manifest.json"
    out.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


if __name__ == "__main__":
    print(json.dumps(main(), indent=2))
