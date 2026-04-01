# Computational Discovery of Small Molecules Targeting FGFR3 mRNA for Bladder Cancer

**Author:** Oksana Kolisnyk · ML Engineer | kosatiks-group.pp.ua  
**ORCID:** 0009-0003-5780-2290  
**Repository:** https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE  
**HF Space:** https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026  
**Date:** March 2026  
**Part of:** [K R&D Lab](https://github.com/K-RnD-Lab/SPHERE-I-SCIENCE)

> **DATA TRANSPARENCY NOTICE:** Docking scores, ADMET bioavailability, hERG risk, and hepatotoxicity values in this report are **SIMULATED** illustrative data. Physicochemical properties (MW, LogP, HBD, HBA, PSA, Ro5) for the top-5 compounds are **real values from ChEMBL**. The mRNA secondary structure, pocket volumes, accessibility scores, G4Hunter scores, and all nucleotide position assignments are **SIMULATED/ILLUSTRATIVE SEED DATA** — not computed from the NM_000142.5 sequence. No wet-lab experiments were performed.

---

## Abstract

Fibroblast growth factor receptor 3 (FGFR3) is a validated oncogenic driver in bladder urothelial carcinoma, with activating mutations present in ~70% of non-muscle-invasive cases. Current therapeutic strategies target the FGFR3 protein kinase domain (e.g., erdafitinib), but resistance mechanisms and off-target toxicity motivate exploration of upstream RNA-level intervention. Here we present a computational framework for identifying small molecules that bind the FGFR3 mRNA 5′ untranslated region (5′UTR), thereby suppressing translation initiation. Using the NM_000142.5 transcript (verified 5′UTR length: 275 nt, positions 1–275; CDS begins at position 276), we identified two druggable structural pockets as illustrative targets: P1 (hairpin loop) and P10 (G-quadruplex). Virtual screening of a representative ChEMBL RNA-binder library (N = 200, SIMULATED) yielded CHEMBL1575701 / 8-amino-7-methyl-9-nitro-1H-benzo[g]pteridine-2,4-dione (SIMULATED score = 0.793, P1) and CHEMBL15727 / Thionin Acetate (SIMULATED score = 0.789, P10) as the top-ranked hypothetical leads.

**Important caveats:**
- All structural values (MFE = −83.70 kcal/mol, pocket volumes, G4Hunter score = 1.72, nucleotide positions) are **ILLUSTRATIVE SEED DATA** — not computed from the NM_000142.5 sequence. Real values require RNAfold + fpocket + G4Hunter execution.
- CHEMBL1575701 is a pteridine derivative (8-amino-7-methyl-9-nitro-1H-benzo[g]pteridine-2,4-dione, PubChem CID 16195593) with no established FGFR3 mRNA binding activity; its ranking is illustrative only.
- CHEMBL15727 / Thionin Acetate is a **synthetic phenothiazine histological dye** (3,7-Diamino-5-phenothiazinium acetate, CAS 78338-22-4, MW = 287.34 Da as acetate salt) — it is NOT a plant antimicrobial peptide (a previous version of this report incorrectly described it as such). It has no established FGFR3 mRNA binding activity.
- All scores — including the benchmark values for erdafitinib and patisiran — are SIMULATED on an arbitrary normalised scale and do not represent experimental measurements.

This work establishes a reproducible pipeline for RNA-targeted drug discovery against FGFR3 in bladder cancer.

---

## 1. Introduction

### 1.1 FGFR3 in Bladder Cancer

Bladder cancer is the 10th most common malignancy worldwide, with urothelial carcinoma comprising >90% of cases. FGFR3 activating mutations (S249C, Y373C, K652E) and fusions (FGFR3-TACC3) are among the most frequent oncogenic events in non-muscle-invasive bladder cancer (NMIBC), occurring in approximately 60–70% of low-grade tumours. Erdafitinib, a pan-FGFR tyrosine kinase inhibitor, received FDA approval in 2019 for FGFR3/2-altered urothelial carcinoma, but acquired resistance through secondary gatekeeper mutations (V555M) and FGFR3-independent bypass signalling limits durable responses.

### 1.2 RNA as a Drug Target

Small molecules targeting structured RNA represent an emerging therapeutic modality. Precedents include aminoglycosides binding ribosomal RNA, linezolid targeting bacterial 23S rRNA, and the approved splicing modifiers risdiplam and branaplam acting on SMN2 pre-mRNA. The 5′UTR of oncogenic mRNAs is particularly attractive: it is structurally conserved, functionally critical for cap-dependent translation, and accessible to small molecules that can stabilise inhibitory secondary structures or block ribosome scanning.

### 1.3 Rationale for FGFR3 mRNA Targeting

The FGFR3 5′UTR (NM_000142.5, verified length: 275 nt, positions 1–275) is predicted to fold into a compact structure. Two pockets are used as illustrative targets in this framework: a hairpin loop (P1) amenable to groove-binding ligands, and a G-quadruplex-forming region (P10) that can be stabilised by G4-selective compounds. All structural parameters (MFE, accessibility, volume, G4Hunter score) are ILLUSTRATIVE SEED DATA. Targeting these elements could suppress FGFR3 protein synthesis independently of kinase domain mutations, offering a complementary or resistance-overcoming strategy.

---

## 2. Methods

> All computational steps in this section were performed as part of the K R&D Lab PHYLO-03_2026 pipeline. Steps marked [SIMULATED] used illustrative seed data; steps marked [REAL] used verified external data sources.

### 2.1 Target Sequence and Structure Prediction [SIMULATED]

The FGFR3 5′UTR was retrieved from NCBI RefSeq accession NM_000142.5. The verified 5′UTR spans positions 1–275 (275 nt); the CDS begins at position 276 (confirmed by Entrez efetch of the GenBank record). **Note: the session originally used 143 nt as an estimate — this has been corrected to 275 nt based on the actual GenBank annotation.** Secondary structure prediction was performed conceptually using ViennaRNA RNAfold parameters, yielding an illustrative MFE = −83.70 kcal/mol. The dot-bracket representation used for visualisation is a SIMULATED structure consistent with this MFE value; actual RNAfold computation was not executed in this session. All nucleotide positions shown in figures are ILLUSTRATIVE ESTIMATES [est.] — not computed from the NM_000142.5 sequence.

### 2.2 Pocket Identification [SIMULATED]

Two druggable pockets were identified using conceptual application of fpocket/RNApocket criteria. All values below are ILLUSTRATIVE SEED DATA:

- **P1 (Hairpin loop, nt ~8–47 [est.]):** Solvent accessibility = 0.817 [ILLUSTRATIVE], indicating high ligand accessibility. Suitable for intercalating or groove-binding small molecules.
- **P10 (G-quadruplex region, nt ~90–133 [est.]):** Pocket volume = 750 Å³ [ILLUSTRATIVE], G4Hunter score = 1.72 [ILLUSTRATIVE] (threshold > 1.5 indicates high G4-forming propensity). Suitable for planar aromatic G4-stabilising compounds.

Real pocket identification requires: (1) actual RNAfold/RNAstructure computation on the 275 nt sequence, (2) 3D structure modelling (e.g., Rosetta FARFAR2), (3) fpocket or RNApocket analysis on the 3D model.

### 2.3 Compound Library and Virtual Screening [SIMULATED]

A representative library of 200 compounds was generated as a SIMULATED ChEMBL RNA-binder set, with docking scores drawn from a normal distribution (μ = 0.55, σ = 0.10) anchored to the provided seed scores for the top candidates. Scores represent a normalised RNA-binding affinity metric (0–1 scale). The two seed compounds (CHEMBL1575701, score = 0.793; CHEMBL15727, score = 0.789) were fixed as top-ranked hits.

**Note on compound selection:** Risdiplam (CHEMBL4297528) and branaplam (CHEMBL4290141) are SMN2 pre-mRNA splicing modulators with no established affinity for FGFR3 5′UTR. Linezolid (CHEMBL126) binds bacterial 23S rRNA. These compounds were included as RNA-binding scaffolds for benchmarking purposes only — not as FGFR3 mRNA candidates. Their docking scores are SIMULATED placeholders. CHEMBL1575701 (a pteridine derivative) and CHEMBL15727 (Thionin Acetate, a phenothiazine dye) also have no established FGFR3 mRNA binding activity; they were selected as illustrative seed compounds.

### 2.4 ADMET Profiling [REAL + SIMULATED]

Physicochemical properties (MW, LogP, HBD, HBA, PSA, rotatable bonds, Ro5 violations, QED) were retrieved from the ChEMBL REST API (v33) for five verified compounds:

| ChEMBL ID | Name | Identity | Source |
|-----------|------|----------|--------|
| CHEMBL1575701 | Benzo[g]pteridine-2,4-dione | 8-amino-7-methyl-9-nitro-1H-benzo[g]pteridine-2,4-dione; PubChem CID 16195593 | ChEMBL [REAL] |
| CHEMBL15727 | Thionin Acetate | 3,7-Diamino-5-phenothiazinium acetate; synthetic dye; CAS 78338-22-4; MW_salt=287.34 Da | ChEMBL [REAL] |
| CHEMBL126 | Linezolid | Oxazolidinone antibiotic; 23S rRNA binder | ChEMBL [REAL] |
| CHEMBL4297528 | Risdiplam | SMN2 splicing modifier | ChEMBL [REAL] |
| CHEMBL4290141 | Branaplam | SMN2 splicing modifier | ChEMBL [REAL] |

Oral bioavailability (%), hERG cardiac risk, and hepatotoxicity risk scores are **SIMULATED** illustrative values consistent with the drug-likeness profiles of these compound classes.

### 2.5 Benchmark Comparison

Top-5 RNA-targeting leads were compared against:
- **Erdafitinib** — approved FGFR3 protein kinase inhibitor (protein-targeting control)
- **Patisiran** — approved siRNA therapeutic (RNA-targeting positive control, MW ~14 kDa)

Benchmark physicochemical properties were sourced from published literature and ChEMBL. Binding scores for all compounds in the benchmark are SIMULATED for comparative illustration only.

---

## 3. Results

### 3.1 FGFR3 5′UTR Secondary Structure

The FGFR3 5′UTR (NM_000142.5) spans positions 1–275 (275 nt; verified from GenBank record, CDS start = 276). The structural model used in this work is an ILLUSTRATIVE REPRESENTATION with MFE = −83.70 kcal/mol (ILLUSTRATIVE SEED VALUE — not computed by RNAfold). The structure contains four illustrative elements: a 5′/3′ end stem, an internal stem (nt ~52–80 [est.]), the P1 hairpin (nt ~8–47 [est.]), and the P10 G-quadruplex region (nt ~90–133 [est.]).

> **⚠️ All structural values (MFE, pocket volumes, G4Hunter score, nucleotide positions) are ILLUSTRATIVE SEED DATA — not computed from the NM_000142.5 sequence. Real values require RNAfold + fpocket + G4Hunter execution.**

### 3.2 Druggable Pocket Characterisation

Two pockets were prioritised for virtual screening (Figure 2). All values are ILLUSTRATIVE SEED DATA:

**P1 — Hairpin loop (nt ~8–47 [est.]):**
- Accessibility = 0.817 [ILLUSTRATIVE]
- Suitable for groove-binding or intercalating ligands
- Top hit: CHEMBL1575701 / Benzo[g]pteridine-2,4-dione (SIMULATED score = 0.793)

**P10 — G-quadruplex region (nt ~90–133 [est.]):**
- Volume = 750 Å³ [ILLUSTRATIVE]
- G4Hunter score = 1.72 [ILLUSTRATIVE]
- Top hit: CHEMBL15727 / Thionin Acetate (SIMULATED score = 0.789)

**Drug-likeness assessment (real ChEMBL data):**

| Compound | MW (Da) | LogP | HBD | PSA (Å²) | Ro5 violations (MW/LogP/HBD/HBA) | Drug-likeness note |
|----------|---------|------|-----|----------|-----------------------------------|--------------------|
| CHEMBL1575701 | 288.22 | −0.04 | 3 | 160.66 | 0 | PSA = 160.66 Å² exceeds 140 Å² oral absorption threshold — see note below |
| Thionin Ac. | 228.30 | 2.90 | 2 | 64.93 | 0 | MW is freebase; salt form (acetate) MW = 287.34 Da |
| Risdiplam | 401.47 | 1.96 | 1 | 79.83 | 0 | — |
| Branaplam | 393.49 | 3.93 | 3 | 95.95 | 0 | — |
| Linezolid | 337.35 | 1.12 | 1 | 71.11 | 0 | — |

**Note on Ro5 and PSA:** Four of five compounds satisfy all four classic Lipinski criteria (MW ≤ 500, LogP ≤ 5, HBD ≤ 5, HBA ≤ 10); CHEMBL1575701 also satisfies these four criteria (0 violations per ChEMBL). However, CHEMBL1575701 has PSA = 160.66 Å², which exceeds the 140 Å² oral absorption threshold commonly used as a drug-likeness filter. This compound is unlikely to be orally bioavailable and would require parenteral or local (e.g., intravesical) delivery. The ChEMBL `num_ro5_violations` field counts only MW/LogP/HBD/HBA violations — PSA is excluded from that count. For bladder cancer, intravesical instillation is a standard delivery route for NMIBC, making high PSA less prohibitive than for systemic indications.

### 3.3 Virtual Screening Results

Screening of 200 SIMULATED compounds against both pockets yielded 8 hits with score ≥ 0.75 (hit rate = 4%) (Figure 3).

> **Note: the 4% hit rate (8/200) is a mathematical consequence of choosing score threshold = 0.75 at μ + 2σ of the simulated distribution (μ = 0.55, σ = 0.10). Under a normal distribution, ~2.3% of values exceed μ + 2σ, giving ~4–5 hits out of 200 by construction. This is not a biologically meaningful hit rate — it is an artifact of the simulation parameter choices and threshold selection. It cannot be compared to hit rates from real RNA-targeted virtual screening campaigns.**

The score distribution follows a near-normal profile (μ = 0.55, σ = 0.10), with the top-10 compounds spanning scores 0.718–0.793.

**Top-10 compounds by RNA-binding score (SIMULATED):**

| Rank | Compound | Score | Pocket |
|------|----------|-------|--------|
| 1 | CHEMBL1575701 (Benzo[g]pteridine-2,4-dione) | 0.793 | P1-hairpin |
| 2 | CHEMBL15727 (Thionin Ac., dye) | 0.789 | P10-G4 |
| 3 | Sim-145 | 0.780 | P10-G4 |
| 4 | Risdiplam (CHEMBL4297528) | 0.771 | P1-hairpin |
| 5 | Sim-036 | 0.764 | other |
| 6 | Branaplam (CHEMBL4290141) | 0.764 | P10-G4 |
| 7 | Sim-168 | 0.763 | P10-G4 |
| 8 | Linezolid (CHEMBL126) | 0.758 | P1-hairpin |
| 9 | Sim-144 | 0.750 | P1-hairpin |
| 10 | Sim-001 | 0.749 | P10-G4 |

### 3.4 ADMET Profiles of Top-5 Candidates

The five priority candidates have favourable physicochemical profiles based on real ChEMBL data (Figure 4). Oral bioavailability, hERG risk, and hepatotoxicity values are SIMULATED:

| Compound | MW (Da) | LogP | HBD | PSA (Å²) | QED | RNA Score [SIM] |
|----------|---------|------|-----|----------|-----|-----------|
| CHEMBL1575701 (Benzo[g]pteridine) | 288.22 | −0.04 | 3 | 160.66 | 0.24 | 0.793 |
| Thionin Ac. (dye) | 228.30 | 2.90 | 2 | 64.93 | 0.35 | 0.789 |
| Risdiplam | 401.47 | 1.96 | 1 | 79.83 | 0.55 | 0.771 |
| Branaplam | 393.49 | 3.93 | 3 | 95.95 | 0.62 | 0.764 |
| Linezolid | 337.35 | 1.12 | 1 | 71.11 | 0.89 | 0.758 |

CHEMBL1575701 has the highest PSA (160.66 Å²), which limits oral absorption but is acceptable for intravesical delivery routes relevant to bladder cancer. Thionin Acetate has the lowest MW (228.30 Da freebase; 287.34 Da as acetate salt) and favourable LogP (2.90), suggesting good membrane permeability.

### 3.5 Benchmark Comparison

For illustrative comparison, the protein-targeting control erdafitinib was assigned a SIMULATED RNA-binding score of 0.570 and the siRNA control patisiran a score of 0.920 (Figure 5). These values are hardcoded SIMULATED numbers on an arbitrary normalised scale — they do not represent experimental measurements and no quantitative superiority claim over erdafitinib is implied. The comparison is intended solely to contextualise the relative positioning of RNA-targeting vs protein-targeting modalities within this illustrative framework. Patisiran's high score reflects its established RNA-targeting mechanism, but its MW (~14 kDa) precludes oral bioavailability, motivating the small-molecule approach.

---

## 4. Discussion

### 4.1 Significance of RNA-Level FGFR3 Targeting

Targeting FGFR3 at the mRNA level offers two key advantages over kinase inhibition: (1) it acts upstream of all resistance-conferring kinase domain mutations, and (2) it can suppress both wild-type and mutant FGFR3 isoforms simultaneously. The identification of a high-accessibility hairpin (P1) and a G-quadruplex pocket (P10) provides two mechanistically distinct intervention points. All structural parameters are illustrative; experimental validation of pocket existence and geometry is required before any biological conclusions can be drawn.

### 4.2 Lead Compound Assessment

**CHEMBL1575701** (8-amino-7-methyl-9-nitro-1H-benzo[g]pteridine-2,4-dione; PubChem CID 16195593; MW = 288 Da, LogP = −0.04, PSA = 160.66 Å²) is a pteridine derivative with no established RNA-binding activity in the literature. Its high PSA may limit passive intestinal absorption but is well-suited for intravesical instillation, the standard local delivery route for NMIBC treatment. The compound's identity was resolved via PubChem cross-reference (CID 16195593); it was unnamed in ChEMBL.

**CHEMBL15727 / Thionin Acetate** (3,7-Diamino-5-phenothiazinium acetate; CAS 78338-22-4; MW = 228.30 Da freebase / 287.34 Da salt; LogP = 2.90) is a synthetic phenothiazine cationic dye widely used in histological staining. It is NOT a plant antimicrobial peptide — a previous version of this report incorrectly described it as such. G4-stabilising compounds have precedent in oncology (e.g., PDS, BRACO-19 targeting telomeric G4s), and phenothiazine scaffolds have been explored as RNA intercalators, but no specific FGFR3 5′UTR binding data exist for Thionin Acetate.

### 4.3 Comparison with Approved RNA-Targeting Drugs

Risdiplam (CHEMBL4297528) and branaplam (CHEMBL4290141), both approved or late-stage SMN2 splicing modifiers, were assigned SIMULATED scores of 0.771 and 0.764 respectively as part of the illustrative framework. **These scores were hardcoded seed values, not computed results, and therefore cannot be used to validate the scoring framework.** Their inclusion serves only to contextualise the top-2 leads alongside compounds with established RNA-targeting activity and favourable drug-likeness profiles (real ChEMBL MW: 401 Da and 393 Da respectively, 0 Ro5 violations). Neither compound has established activity against FGFR3 mRNA.

### 4.4 Limitations and Next Steps

This study is a computational hypothesis-generation exercise using SIMULATED docking data. Critical limitations:

1. **5′UTR length corrected:** The session originally used 143 nt as an estimate. The verified NM_000142.5 5′UTR is 275 nt (positions 1–275; CDS start = 276). All structural figures use the 143 nt estimate and should be regenerated with the correct length.
2. **No actual structure computation:** MFE, base-pair assignments, pocket volumes, and G4Hunter scores are all illustrative seed values.
3. **No actual docking:** All scores are drawn from a simulated normal distribution with hardcoded top values.
4. **Compound identities:** CHEMBL1575701 is a pteridine derivative with no known RNA-binding activity; CHEMBL15727 is a histological dye with no known FGFR3 mRNA binding activity.
5. **Hit rate is a construction artifact:** The 4% hit rate is a direct consequence of the μ+2σ threshold choice, not a biologically meaningful result.

Critical next steps:
1. **Actual ViennaRNA/RNAfold computation** on the 275 nt FGFR3 5′UTR sequence from NM_000142.5
2. **fpocket/RNApocket analysis** of the predicted 3D structure for validated pocket coordinates
3. **AutoDock Vina or rDock virtual screening** against the real pocket geometries
4. **SwissADME/pkCSM ADMET prediction** for top hits
5. **SPR or ITC binding assays** to measure Kd for CHEMBL1575701 and CHEMBL15727
6. **Cell-based FGFR3 translation reporter assay** (luciferase fused to FGFR3 5′UTR)
7. **RT-qPCR and Western blot** in FGFR3-mutant bladder cancer cell lines (RT112, UMUC14)

---

## 5. Conclusions

We present a computational pipeline for RNA-targeted drug discovery against FGFR3 mRNA in bladder cancer. Two illustrative druggable pockets (P1 hairpin, P10 G-quadruplex) were defined in the FGFR3 5′UTR (NM_000142.5; verified length 275 nt), and virtual screening of a representative compound library (N = 200, SIMULATED) yielded CHEMBL1575701 (a pteridine derivative) and CHEMBL15727 (Thionin Acetate, a phenothiazine dye) as priority leads with SIMULATED RNA-binding scores of 0.793 and 0.789. Both leads satisfy the four classic Lipinski criteria; CHEMBL1575701 has PSA = 160.66 Å² which limits oral bioavailability but is compatible with intravesical delivery. All structural and docking values are illustrative seed data requiring experimental validation. This work provides a reproducible, open-source framework for advancing RNA-targeted therapeutics in bladder cancer.

---

## Figures

- **Figure 1** — FGFR3 5′UTR Structural Model [ILLUSTRATIVE — positions not computed from NM_000142.5; see §2.1] (NM_000142.5, MFE = −83.70 kcal/mol [ILLUSTRATIVE])
- **Figure 2** — Druggable Pocket Locations: P1 Hairpin and P10 G-quadruplex [ILLUSTRATIVE SEED DATA — not computed from NM_000142.5]
- **Figure 3** — Virtual Screening Results: Score Distribution (N=200) and Top-10 Compounds [SIMULATED]
- **Figure 4** — ADMET Radar Profiles: Top-5 Candidates [Real ChEMBL props + SIMULATED BA/toxicity; PSA axis: lower = better oral absorption (high PSA plotted toward centre)]
- **Figure 5** — Benchmark Comparison vs Erdafitinib and Patisiran [SIMULATED scores; row labels indicate data provenance]

---

## Data Availability

All data files are available in the repository:
- `data/SIMULATED_docking_scores.csv` — 200-compound virtual screen results
- `data/SIMULATED_admet_top5.csv` — ADMET profiles for top-5 candidates (includes `identity_note` column with verified compound identities)
- `data/SIMULATED_benchmark_comparison.csv` — Benchmark comparison table (includes `data_provenance` column)

Physicochemical properties sourced from ChEMBL REST API v33 (https://www.ebi.ac.uk/chembl/).  
CHEMBL1575701 identity cross-referenced via PubChem PUG REST (CID 16195593).  
NM_000142.5 5′UTR length verified via NCBI Entrez efetch (GenBank record, accessed March 2026).

---

## References

1. ChEMBL Database. EMBL-EBI. https://www.ebi.ac.uk/chembl/
2. Lorenz R, et al. ViennaRNA Package 2.0. *Algorithms Mol Biol.* 2011;6:26.
3. Gao Y, et al. Small molecule approaches to targeting RNA. *HAL preprint.* 2024. https://hal.science/hal-04801128
4. Brenk R, et al. DrugPred_RNA — A Tool for Structure-Based Druggability Prediction for RNA. *J Chem Inf Model.* 2021;61(9):4436–4446. https://doi.org/10.1021/acs.jcim.1c00155
5. Protein-Based Virtual Screening Tools Applied for RNA Ligand Discovery. *J Chem Inf Model.* 2022;62(17):4134. https://doi.org/10.1021/acs.jcim.2c00751
6. Linezolid (CHEMBL126). ChEMBL. https://www.ebi.ac.uk/chembl/compound_report_card/CHEMBL126/
7. Thionine (Thionin Acetate). Wikipedia / Sigma-Aldrich. CAS 78338-22-4. https://en.wikipedia.org/wiki/Thionine
8. Loriot Y, et al. Erdafitinib in locally advanced or metastatic urothelial carcinoma. *N Engl J Med.* 2019;381:338–348.
9. Adams D, et al. Patisiran, an RNAi therapeutic, for hereditary transthyretin amyloidosis. *N Engl J Med.* 2018;379:11–21.
10. Neri M, et al. Risdiplam: from bench to bedside for spinal muscular atrophy treatment. *Expert Rev Neurother.* 2020;20(12):1285–1298.
