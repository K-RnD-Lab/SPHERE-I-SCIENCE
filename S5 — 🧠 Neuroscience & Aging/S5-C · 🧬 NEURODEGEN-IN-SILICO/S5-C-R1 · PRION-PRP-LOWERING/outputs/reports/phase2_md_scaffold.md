# Phase 2 — Molecular dynamics (scaffold)

## Prerequisite
Install GROMACS or OpenMM locally. This repo does not bundle MD binaries.

## Suggested workflow
1. Extract globular domain (residues ~125–228) from `data/structures/human_P04156.pdb`
2. Build mutant structures in PyMOL: D178N, E200K
3. Solvate + minimize + 50–100 ns production MD per variant
4. Metrics: RMSD, RMSF, radius of gyration, DSSP secondary structure

## Research question
FFI preferentially damages thalamus — MD on isolated PrP won't answer regional tropism;
combine with literature on regional PrP expression and network vulnerability.

## References
- J Comput Biol papers on E200K / D178N MD (e.g. PMID 10.1002/jcb.30359)
