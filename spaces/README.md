# Hugging Face Spaces Mirror

This directory contains mirrored copies of the current K R&D Lab Hugging Face Spaces that matter for `SPHERE-I-SCIENCE`.

Use these folders as synced snapshots of the runtime layer, not as the long-term source of truth for research content.

## Current mapping

| Local mirror | Hugging Face Space | Main role |
| --- | --- | --- |
| `spaces/learning-playground` | [K-RnD-Lab/Learning-Playground_03-2026](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026) | Sandbox tabs for miRNA, siRNA, LNP, flow-corona, and variant concepts |
| `spaces/cancer-research-suite` | [K-RnD-Lab/Cancer-Research-Suite_03-2026](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026) | Real-data lookups, research gaps, and guided research workflows |
| `spaces/phylo-brca2-mirna` | [K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna](https://huggingface.co/spaces/K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna) | Dedicated BRCA2 miRNA study demo |

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
