# Hugging Face Spaces Mirror

This directory contains mirrored copies of the current K R&D Lab Hugging Face Spaces that matter for `SPHERE-I-SCIENCE`.

Use these folders as synced snapshots of the runtime layer, not as the long-term source of truth for research content.

## Current mapping

| Local mirror | Hugging Face Space | Main role |
| --- | --- | --- |
| `spaces/hf-readme` | [K-RnD-Lab/README](https://huggingface.co/spaces/K-RnD-Lab/README) | Hugging Face organization landing page |
| `spaces/sphere-frontier` | [K-RnD-Lab/SPHERE-FRONTIER](https://huggingface.co/spaces/K-RnD-Lab/SPHERE-FRONTIER) | Static frontier index for K-RnD Lab HF environments |
| `spaces/learning-playground` | [K-RnD-Lab/Learning-Playground_03-2026](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026) | Sandbox tabs for miRNA, siRNA, LNP, flow-corona, and variant concepts |
| `spaces/cancer-research-suite` | [K-RnD-Lab/Cancer-Research-Suite_03-2026](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026) | Real-data lookups, research gaps, and guided research workflows |
| `spaces/phylo-brca2-mirna` | [K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna](https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna) | Dedicated BRCA2 miRNA study demo |
| `spaces/bioscore` | [K-RnD-Lab/bioscore](https://huggingface.co/spaces/K-RnD-Lab/bioscore) | Biomedical scoring prototype for reproducibility, quality, and readiness |
| `spaces/set-method` | [K-RnD-Lab/set-method](https://huggingface.co/spaces/K-RnD-Lab/set-method) | SET framework prototype for classify-score-recommend workflows |
| `spaces/studyreg` | [K-RnD-Lab/studyreg](https://huggingface.co/spaces/K-RnD-Lab/studyreg) | Current live study registry Space |
| `spaces/partner-pool-simulator` | [K-RnD-Lab/Partner-Pool-Simulator_05-2026](https://huggingface.co/spaces/K-RnD-Lab/Partner-Pool-Simulator_05-2026) | S7-K partner-pool assumption simulator demo |

`K-RnD-Lab/Study-Registry_04-2026` is no longer available on the Hub. Use `K-RnD-Lab/studyreg` as the current study registry Space.

## Sync

Refresh the mirrors from repo root with:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\sync_hf_spaces.ps1
```

## Editing rule

- Edit research content in the main repo tree.
- Edit runtime app code in the upstream Hugging Face Space when the change is app-specific.
- Re-run the sync script after upstream HF changes so GitHub reflects the current runtime state.

If you edit files directly inside `spaces/`, expect them to be overwritten on the next sync.
