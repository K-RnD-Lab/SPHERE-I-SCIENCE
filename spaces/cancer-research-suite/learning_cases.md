# Guided Learning Cases
**K R&D Lab — Cancer Research Suite · Learning Sandbox**
Author: Oksana Kolisnyk | kosatiks-group.pp.ua
Repo: github.com/TEZv/K-RnD-Lab-PHYLO-03_2026
Generated: 2026-03-07

---

> These 5 cases are designed for use with the **📚 Learning Sandbox** tab group.
> All sandbox results are ⚠️ SIMULATED. Use the **🔬 Real Data Tools** tabs to validate findings with live data.

---

## Case 1 — miRNA-Mediated Silencing of TP53 in Pan-Cancer Context

**Scientific Question:**
Which miRNAs are predicted to suppress TP53 expression in cancer, and how does their expression change in TP53-mutant tumors?

### Protocol

| Step | Tab | Action |
|------|-----|--------|
| 1 | **B1 — miRNA Explorer** | Select gene: `TP53`. Run simulation. Note the top miRNA by binding energy (most negative kcal/mol). |
| 2 | **B1 — miRNA Explorer** | In the expression chart, identify which miRNAs are upregulated (positive log2FC) in TP53-mutant tumors — these are candidate oncogenic miRNAs. |
| 3 | **A4 — Literature Gap Finder** | Search: cancer type = `GBM`, keyword = `miR-34a TP53`. Check if the literature trend shows a gap in recent years. |
| 4 | **A2 — Understudied Target Finder** | Select `GBM`. Check if TP53 appears in the gap index table — compare its paper count vs. essentiality. |
| 5 | **📓 Lab Journal** | Record: top miRNA, its binding energy, expression direction, and whether a literature gap exists for this miRNA in GBM. |

### Expected Result
- miR-34a-5p should show the strongest binding energy (≈ −19 kcal/mol) and be **downregulated** (negative log2FC) in TP53-mutant tumors — consistent with miR-34a being a direct p53 transcriptional target that is lost when p53 is mutated.
- miR-25-3p and miR-504-5p should be **upregulated**, acting as oncogenic suppressors of wild-type p53.
- Literature gap search may reveal sparse recent publications on miR-34a in GBM specifically (vs. breast/lung cancer).

### Real PubMed PMID to Read
**PMID: 17554337** — He L et al. "A microRNA component of the p53 tumour suppressor network." *Nature* 2007.
Direct link: https://pubmed.ncbi.nlm.nih.gov/17554337/

### What to Write in Lab Notebook
```
Date: [today]
Case: miRNA-TP53 silencing
Gene: TP53
Top suppressive miRNA: miR-34a-5p (binding energy: -19.2 kcal/mol, seed: 8mer)
Top oncogenic miRNA: miR-25-3p (log2FC: +2.0 in TP53-mutant)
Literature gap: [yes/no] for miR-34a in GBM (from Tab A4)
Hypothesis: miR-34a restoration therapy may be viable in GBM with WT TP53
Next step: Check Tab A5 (Druggable Orphans) for TP53-pathway targets in GBM
```

---

## Case 2 — LNP Formulation Optimization for Brain Delivery via ApoE Corona

**Scientific Question:**
How does PEG mol% and ionizable lipid content affect ApoE enrichment in the protein corona, and what formulation maximizes predicted brain targeting?

### Protocol

| Step | Tab | Action |
|------|-----|--------|
| 1 | **B3 — LNP Corona** | Set baseline: PEG = 1.5 mol%, ionizable = 50%, helper = 10%, cholesterol = 38%, size = 100 nm, serum = 10%. Run simulation. Record ApoE fraction. |
| 2 | **B3 — LNP Corona** | Increase PEG to 4.0 mol% (all else equal). Run again. Observe ApoE fraction change. |
| 3 | **B3 — LNP Corona** | Return PEG to 1.5 mol%. Increase particle size to 200 nm. Run. Observe fibrinogen fraction change. |
| 4 | **B4 — Flow Corona** | Set kon_ApoE = 0.05, koff_ApoE = 0.01 (tight binding). Run Vroman kinetics for 60 min. Note crossover time. |
| 5 | **📓 Lab Journal** | Record all three formulation conditions and their ApoE fractions. Identify the optimal formulation for brain targeting. |

### Expected Result
- **Baseline** (1.5% PEG, 100 nm): ApoE ~30–35% → good brain targeting potential via LRP1
- **High PEG** (4.0%): ApoE drops to ~10–15% → PEG shields corona formation, reducing receptor-mediated uptake
- **Large particles** (200 nm): Fibrinogen fraction increases → larger particles recruit more coagulation proteins, increasing lung/macrophage clearance
- **Vroman kinetics**: Albumin dominates first ~5–10 min, then ApoE displaces it; crossover at ~15–25 min

### Real PubMed PMID to Read
**PMID: 32251383** — Cheng Q et al. "Selective organ targeting (SORT) nanoparticles for tissue-specific mRNA delivery and CRISPR–Cas gene editing." *Nature Nanotechnology* 2020.
Direct link: https://pubmed.ncbi.nlm.nih.gov/32251383/

### What to Write in Lab Notebook
```
Date: [today]
Case: LNP corona optimization for brain delivery
Condition 1 (baseline): PEG 1.5%, 100nm → ApoE = [X]%
Condition 2 (high PEG): PEG 4.0%, 100nm → ApoE = [X]%
Condition 3 (large): PEG 1.5%, 200nm → ApoE = [X]%, Fibrinogen = [X]%
Vroman crossover time: ~[X] min
Conclusion: [optimal formulation] maximizes ApoE for brain targeting
Caveat: High PEG reduces corona but triggers anti-PEG immunity on repeat dosing (see PMID 34880493)
```

---

## Case 3 — KRAS G12C Variant Classification and Clinical Significance

**Scientific Question:**
How is the KRAS G12C somatic mutation classified in ClinVar, what is its population frequency in gnomAD, and does it represent a research gap in PDAC vs. LUAD?

### Protocol

| Step | Tab | Action |
|------|-----|--------|
| 1 | **A3 — Real Variant Lookup** | Enter HGVS: `NM_004985.5:c.34G>T` (KRAS G12C). Run lookup. Record ClinVar classification and gnomAD AF. |
| 2 | **B5 — Variant Concepts** | Select `Pathogenic`. Read the ACMG criteria. Identify which codes apply to a known cancer hotspot like KRAS G12C. |
| 3 | **A4 — Literature Gap Finder** | Search: cancer type = `PDAC`, keyword = `KRAS G12C`. Compare trend to LUAD (repeat with `SCLC`). |
| 4 | **A2 — Understudied Target Finder** | Select `PDAC`. Check if KRAS appears and what its gap index is. |
| 5 | **📓 Lab Journal** | Record classification, AF, literature trend comparison, and gap index. |

### Expected Result
- **ClinVar**: KRAS G12C classified as **Pathogenic** (somatic) — PS1 (same amino acid change as established pathogenic), PM2 (absent from healthy population), PS3 (functional studies confirm oncogenicity)
- **gnomAD AF**: Should be extremely rare or absent in germline population (AF < 0.0001) — somatic mutations are not in gnomAD germline
- **Literature trend**: LUAD shows rapid growth post-2021 (sotorasib approval); PDAC shows lower but growing activity; SCLC shows near-zero publications → SCLC is the true gap
- **Gap index**: KRAS in PDAC may have moderate gap index despite high essentiality, due to growing literature

### Real PubMed PMID to Read
**PMID: 31820981** — Lanman BA et al. "Discovery of a Covalent Inhibitor of KRAS(G12C) (AMG 510) for the Treatment of Solid Tumors." *J Med Chem* 2020.
Direct link: https://pubmed.ncbi.nlm.nih.gov/31820981/

### What to Write in Lab Notebook
```
Date: [today]
Case: KRAS G12C variant analysis
HGVS: NM_004985.5:c.34G>T
ClinVar classification: [result from Tab A3]
gnomAD germline AF: [result — expected: not found / ultra-rare]
ACMG codes (simulated, B5): PS1, PM2, PS3
Literature gap: SCLC shows lowest KRAS G12C publications
PDAC gap index (Tab A2): [value]
Clinical note: Sotorasib/adagrasib approved for LUAD; PDAC trials ongoing; SCLC = unexplored
```

---

## Case 4 — siRNA Delivery Feasibility for KRAS-Driven Cancers

**Scientific Question:**
Which KRAS-driven cancer type (LUAD, BRCA, COAD) has the most favorable siRNA target profile, and what are the key delivery barriers?

### Protocol

| Step | Tab | Action |
|------|-----|--------|
| 1 | **B2 — siRNA Targets** | Select `LUAD`. Note KRAS G12C efficacy score and delivery challenge rating. |
| 2 | **B2 — siRNA Targets** | Select `COAD`. Note KRAS G12D efficacy and delivery challenge. Compare to LUAD. |
| 3 | **B3 — LNP Corona** | Set formulation for tumor delivery: PEG = 1.5%, ionizable = 50%, size = 80 nm, serum = 50% (mimicking tumor microenvironment). Run corona simulation. |
| 4 | **A5 — Druggable Orphans** | Select `PDAC`. Check if KRAS appears as an orphan (no approved drug, no trial). |
| 5 | **📓 Lab Journal** | Compare all three cancer types. Identify which has the best siRNA opportunity and why. |

### Expected Result
- **LUAD KRAS G12C**: Efficacy ~0.82, delivery challenge = High (lung delivery requires inhalation or IV LNP)
- **COAD KRAS G12D**: Efficacy ~0.79, delivery challenge = High (colorectal delivery requires oral or local administration)
- **Corona at 50% serum**: Higher albumin and IgG fractions → more immune recognition; ApoE still present but diluted
- **PDAC orphan check**: KRAS may appear as orphan or near-orphan — KRAS G12D has no approved covalent inhibitor as of 2026
- **Best opportunity**: LUAD KRAS G12C has highest efficacy + existing clinical precedent (sotorasib); COAD KRAS G12D is the true unmet need

### Real PubMed PMID to Read
**PMID: 33208369** — Rosenblum D et al. "CRISPR-Cas9 genome editing using targeted lipid nanoparticles for cancer therapy." *Science Advances* 2020.
Direct link: https://pubmed.ncbi.nlm.nih.gov/33208369/

### What to Write in Lab Notebook
```
Date: [today]
Case: siRNA delivery for KRAS cancers
LUAD KRAS G12C: efficacy = [X], delivery = High, off-target = Medium
COAD KRAS G12D: efficacy = [X], delivery = High, off-target = Medium
Corona at 50% serum: ApoE = [X]%, Albumin = [X]%
PDAC orphan status (Tab A5): [result]
Conclusion: [best cancer type for siRNA KRAS targeting]
Key barrier: Endosomal escape efficiency <2% for siRNA-LNPs (literature)
Next step: Design LNP formulation screen using Tab B3 to maximize ApoE for tumor targeting
```

---

## Case 5 — Identifying a Novel Research Gray Zone in a Rare Cancer

**Scientific Question:**
In uveal melanoma (UVM), which biological processes are most underexplored, and is there an essential gene with no drug and no trial that could be targeted via a novel mechanism?

### Protocol

| Step | Tab | Action |
|------|-----|--------|
| 1 | **A1 — Gray Zones Explorer** | Select `UVM`. Run. Identify the top 3 processes with lowest paper counts (red/white cells in heatmap). |
| 2 | **A4 — Literature Gap Finder** | Search: cancer type = `UVM`, keyword = the top gap process from Step 1 (e.g. `ferroptosis` or `phase separation`). Confirm the gap with the year-by-year chart. |
| 3 | **A2 — Understudied Target Finder** | Select `UVM`. Find the gene with the highest gap index. Note its essentiality and paper count. |
| 4 | **A5 — Druggable Orphans** | Select `UVM`. Check if the gene from Step 3 appears as an orphan target. |
| 5 | **🤖 Research Assistant (A6)** | Ask: *"What is known about LNP delivery to uveal melanoma or ocular tumors?"* Note the confidence flag. |
| 6 | **📓 Lab Journal** | Synthesize all findings into a 3-sentence research hypothesis. |

### Expected Result
- **Gray zones in UVM**: Likely top gaps = `phase separation`, `liquid-liquid phase separation`, `cryptic splicing`, `protein corona` — these are emerging fields with minimal UVM-specific literature
- **Literature gap**: Year-by-year chart should show 0–2 papers/year for the top gap process in UVM
- **Understudied target**: A gene with high OT association score, low paper count, and no drug (e.g. GNA11, GNAQ pathway effectors)
- **Orphan status**: GNA11/GNAQ are mutated in >90% of UVM but have no approved targeted therapy
- **RAG chatbot**: Will likely return MEDIUM or SPECULATIVE confidence for UVM-specific LNP delivery (not in indexed papers) — demonstrating the system's honesty about knowledge limits

### Real PubMed PMID to Read
**PMID: 27328919** — Bouaoun L et al. "TP53 Variations in Human Cancers: New Lessons from the IARC TP53 Database and Genomics Data." *Human Mutation* 2016. *(For variant landscape context)*
Also: Search PubMed for `"uveal melanoma" AND "GNA11" AND "treatment"` to find the most recent therapeutic approaches.

### What to Write in Lab Notebook
```
Date: [today]
Case: UVM gray zone discovery
Top 3 gray zones (Tab A1): [process 1], [process 2], [process 3]
Literature gap confirmed (Tab A4): [process] — [X] papers/year average
Top understudied target (Tab A2): [gene], gap index = [X]
Orphan status (Tab A5): [yes/no drug, yes/no trial]
RAG chatbot confidence for UVM LNP: [HIGH/MEDIUM/SPECULATIVE]
Research hypothesis: "[Gene] is an essential driver in UVM with no approved therapy.
  The [process] pathway is underexplored in UVM. LNP-mediated delivery of
  [siRNA/mRNA] targeting [gene] via [process] mechanism represents a novel
  therapeutic strategy warranting in vitro validation."
```

---

## Quick Reference: Tab-to-Question Mapping

| Research Question Type | Primary Tab | Validation Tab |
|------------------------|-------------|----------------|
| What is understudied in cancer X? | A1 Gray Zones | A4 Literature Gap |
| Which gene should I target? | A2 Target Finder | A5 Druggable Orphans |
| Is this variant real/classified? | A3 Variant Lookup | B5 Variant Concepts |
| How does my LNP formulation behave? | B3 LNP Corona | B4 Flow Corona |
| What do the papers say? | A6 Research Assistant | A4 Literature Gap |
| How does miRNA regulate my gene? | B1 miRNA Explorer | A4 Literature Gap |
| Which cancer is best for siRNA? | B2 siRNA Targets | A5 Druggable Orphans |

---
*Learning Cases generated by K R&D Lab Cancer Research Suite | 2026-03-07*
