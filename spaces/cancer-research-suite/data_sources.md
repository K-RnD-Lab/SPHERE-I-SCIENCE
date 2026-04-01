# Data Sources & API Endpoints
**K R&D Lab — Cancer Research Suite**
Author: Oksana Kolisnyk | kosatiks-group.pp.ua
Repo: github.com/TEZv/K-RnD-Lab-PHYLO-03_2026
Generated: 2026-03-07

---

## Real Data APIs (Group A Tabs)

### 1. PubMed E-utilities (NCBI)
| Property | Value |
|----------|-------|
| **Base URL** | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils` |
| **Auth** | None required (free, no API key) |
| **Rate limit** | 3 requests/sec without key; enforced via `time.sleep(0.34)` |
| **Endpoints used** | `esearch.fcgi` — search & count; `esummary.fcgi` — fetch metadata |
| **Used in tabs** | A1 (paper counts per process), A4 (papers per year), A2 (gene paper counts) |
| **Docs** | https://www.ncbi.nlm.nih.gov/books/NBK25501/ |
| **Terms of use** | https://www.ncbi.nlm.nih.gov/home/about/policies/ |

**Example call (paper count):**
```
GET https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi
  ?db=pubmed
  &term="ferroptosis" AND "GBM"[tiab]
  &rettype=count
  &retmode=json
```

---

### 2. ClinVar E-utilities (NCBI)
| Property | Value |
|----------|-------|
| **Base URL** | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils` |
| **Auth** | None required |
| **Rate limit** | Same as PubMed (3 req/sec) |
| **Endpoints used** | `esearch.fcgi?db=clinvar` — variant search; `esummary.fcgi?db=clinvar` — classification |
| **Used in tabs** | A3 (Real Variant Lookup) |
| **Docs** | https://www.ncbi.nlm.nih.gov/clinvar/docs/api_http/ |
| **Data policy** | All ClinVar data is public domain |

**Example call:**
```
GET https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi
  ?db=clinvar
  &term=NM_007294.4:c.5266dupC
  &retmode=json
  &retmax=5
```

---

### 3. OpenTargets Platform GraphQL API
| Property | Value |
|----------|-------|
| **Base URL** | `https://api.platform.opentargets.org/api/v4/graphql` |
| **Auth** | None required (free, open access) |
| **Rate limit** | No hard limit; reasonable use expected |
| **Endpoints used** | GraphQL POST — disease associations, tractability, known drugs |
| **Used in tabs** | A1 (process associations), A2 (target gap index), A5 (druggable orphans) |
| **Docs** | https://platform-docs.opentargets.org/data-access/graphql-api |
| **Data release** | Updated quarterly; cite as "Open Targets Platform [release date]" |
| **License** | CC0 (public domain) |

**Example query (disease-associated targets):**
```graphql
query AssocTargets($efoId: String!, $size: Int!) {
  disease(efoId: $efoId) {
    associatedTargets(page: {index: 0, size: $size}) {
      rows {
        target { approvedSymbol approvedName }
        score
      }
    }
  }
}
```

**EFO IDs used:**
| Cancer | EFO ID |
|--------|--------|
| GBM | EFO_0000519 |
| PDAC | EFO_0002618 |
| SCLC | EFO_0000702 |
| UVM | EFO_0004339 |
| DIPG | EFO_0009708 |
| ACC | EFO_0003060 |
| MCC | EFO_0005558 |
| PCNSL | EFO_0005543 |
| Pediatric AML | EFO_0000222 |

---

### 4. gnomAD GraphQL API
| Property | Value |
|----------|-------|
| **Base URL** | `https://gnomad.broadinstitute.org/api` |
| **Auth** | None required |
| **Rate limit** | No hard limit; reasonable use expected |
| **Endpoints used** | GraphQL POST — `variantSearch` query |
| **Dataset** | `gnomad_r4` (v4, 807,162 individuals) |
| **Used in tabs** | A3 (Real Variant Lookup — allele frequency) |
| **Docs** | https://gnomad.broadinstitute.org/api |
| **License** | ODC Open Database License (ODbL) |

**Example query:**
```graphql
query VariantSearch($query: String!, $dataset: DatasetId!) {
  variantSearch(query: $query, dataset: $dataset) {
    variant_id
    rsids
    exome { af }
    genome { af }
  }
}
```

---

### 5. ClinicalTrials.gov API v2
| Property | Value |
|----------|-------|
| **Base URL** | `https://clinicaltrials.gov/api/v2` |
| **Auth** | None required |
| **Rate limit** | No hard limit documented; polite use recommended |
| **Endpoints used** | `GET /studies` — trial search by gene + cancer type |
| **Used in tabs** | A2 (trial counts per gene), A5 (orphan target trial check) |
| **Docs** | https://clinicaltrials.gov/data-api/api |
| **Data policy** | Public domain (US government) |

**Example call:**
```
GET https://clinicaltrials.gov/api/v2/studies
  ?query.term=KRAS GBM
  &pageSize=1
  &format=json
```

---

### 6. DepMap Public Data
| Property | Value |
|----------|-------|
| **Source** | Broad Institute DepMap Portal |
| **URL** | https://depmap.org/portal/download/all/ |
| **File** | `CRISPR_gene_effect.csv` (Chronos scores) |
| **Auth** | None required (public download) |
| **Used in tabs** | A2 (essentiality scores for gap index) |
| **Score convention** | **Negative = essential** (−1 = median essential gene effect); inverted in app per know-how guide |
| **License** | CC BY 4.0 |
| **Citation** | Broad Institute DepMap, [release]. DepMap Public [release]. figshare. |

> **Implementation note:** The app uses a curated reference gene set with representative scores as a lightweight proxy. For full analysis, download the complete CRISPR_gene_effect.csv (~500 MB) from depmap.org and replace `_load_depmap_sample()` in `app.py`.

---

## Simulated Data Sources (Group B Tabs)

All Group B tabs use **rule-based computational models** — no external APIs.

| Tab | Model Type | Basis |
|-----|-----------|-------|
| B1 — miRNA Explorer | Curated lookup table | Published miRNA-target databases (miRDB, TargetScan concepts) |
| B2 — siRNA Targets | Curated efficacy estimates | Published siRNA screen literature |
| B3 — LNP Corona | Langmuir adsorption model | Corona proteomics literature (Monopoli et al. 2012; Lundqvist et al. 2017) |
| B4 — Flow Corona | Competitive Langmuir kinetics | Vroman effect literature (Vroman 1962; Hirsh et al. 2013) |
| B5 — Variant Concepts | ACMG/AMP 2015 rule set | Richards et al. 2015 ACMG guidelines |

> ⚠️ All Group B outputs are labeled **SIMULATED** in the UI and must not be used for clinical or research decisions.

---

## RAG Chatbot (Tab A6)

| Property | Value |
|----------|-------|
| **Embedding model** | `all-MiniLM-L6-v2` (sentence-transformers) |
| **Model size** | ~80 MB, CPU-compatible |
| **Vector index** | FAISS `IndexFlatIP` (cosine similarity on L2-normalized vectors) |
| **Corpus** | 20 curated paper abstracts (see `chatbot.py` `PAPER_CORPUS`) |
| **Source** | PubMed abstracts (public domain) |
| **No external API** | Fully offline after model download |

**20 Indexed PMIDs** *(all verified against PubMed esummary + efetch, 2026-03-07):*
| PMID | First Author | Topic | Journal | Year |
|------|-------------|-------|---------|------|
| 34394960 | Hou X | LNP mRNA delivery review | Nat Rev Mater | 2021 |
| 32251383 | Cheng Q | SORT LNPs organ selectivity | Nat Nanotechnol | 2020 |
| 29653760 | Sabnis S | Novel amino lipid series for mRNA | Mol Ther | 2018 |
| 22782619 | Jayaraman M | Ionizable lipid siRNA LNP potency | Angew Chem Int Ed | 2012 |
| 33208369 | Rosenblum D | CRISPR-Cas9 LNP cancer therapy | Sci Adv | 2020 |
| 18809927 | Lundqvist M | Nanoparticle size/surface protein corona | PNAS | 2008 |
| 22086677 | Walkey CD | Nanomaterial-protein interactions | Chem Soc Rev | 2012 |
| 31565943 | Park M | Accessible surface area nanoparticle corona | Nano Lett | 2019 |
| 33754708 | Sebastiani F | ApoE binding drives LNP rearrangement | ACS Nano | 2021 |
| 20461061 | Akinc A | Endogenous ApoE-mediated LNP liver delivery | Mol Ther | 2010 |
| 30096302 | Bailey MH | Cancer driver genes TCGA pan-cancer | Cell | 2018 |
| 30311387 | Landrum MJ | ClinVar at five years | Hum Mutat | 2018 |
| 32461654 | Karczewski KJ | gnomAD mutational constraint 141,456 humans | Nature | 2020 |
| 27328919 | Bouaoun L | TP53 variations IARC database | Hum Mutat | 2016 |
| 31820981 | Lanman BA | KRAS G12C covalent inhibitor AMG 510 | J Med Chem | 2020 |
| 28678784 | Sahin U | Personalized RNA mutanome vaccines | Nature | 2017 |
| 31348638 | Kozma GT | Anti-PEG IgM complement activation LNP | ACS Nano | 2019 |
| 33016924 | Cafri G | mRNA neoantigen T cell immunity GI cancer | J Clin Invest | 2020 |
| 31142840 | Cristiano S | Genome-wide cfDNA fragmentation in cancer | Nature | 2019 |
| 33883548 | Larson MH | Cell-free transcriptome tissue biomarkers | Nat Commun | 2021 |

---

## Caching System

All real API calls are cached locally to reduce latency and respect rate limits.

| Property | Value |
|----------|-------|
| **Cache directory** | `./cache/` |
| **TTL** | 24 hours |
| **Key format** | `{endpoint}_{md5(query)}.json` |
| **Format** | JSON |
| **Invalidation** | Automatic on TTL expiry; manual by deleting `./cache/` |

---

## Lab Journal

| Property | Value |
|----------|-------|
| **File** | `./lab_journal.csv` |
| **Format** | CSV (timestamp, tab, action, result_summary, note) |
| **Auto-logged** | Every tab run automatically logs an entry |
| **Manual notes** | Via sidebar note field |

---
*Data Sources documented by K R&D Lab Cancer Research Suite | 2026-03-07*
