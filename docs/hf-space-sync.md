# Hugging Face Sync

This repo keeps research structure and reports in GitHub, while interactive runtime apps live in Hugging Face Spaces.

## Source of truth

- GitHub `SPHERE-I-SCIENCE` is the source of truth for research structure, reports, and datasets.
- Hugging Face Spaces are the source of truth for deploy/runtime app wrappers.

## Current mapping

- `K-RnD-Lab/Learning-Playground_03-2026` -> `spaces/learning-playground`
- `K-RnD-Lab/Cancer-Research-Suite_03-2026` -> `spaces/cancer-research-suite`
- `K-RnD-Lab/PHYLO-03_2026-01_A1-brca2-mirna` -> `spaces/phylo-brca2-mirna`

## Sync command

Run from repo root:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\sync_hf_spaces.ps1
```

The script:

- clones or pulls the mapped public Hugging Face spaces into a temp cache
- copies tracked app files into `spaces/`
- refreshes `SYNC_SOURCE.txt` in each mirrored space directory

## Recommended workflow

1. Do research updates in the main GitHub tree.
2. Do app/runtime updates in Hugging Face Spaces.
3. Run the sync script before committing if the app layer changed.
4. Commit the refreshed `spaces/` mirror when you want GitHub to reflect current runtime state.
