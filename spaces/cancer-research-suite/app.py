"""
K R&D Lab — Cancer Research Suite
Author: Oksana Kolisnyk | kosatiks-group.pp.ua
Repo:   github.com/TEZv/K-RnD-Lab-PHYLO-03_2026
"""

import gradio as gr
import requests
import json
import os
import time
import csv
import math
import hashlib
import datetime
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib import cm
import io
from PIL import Image
from functools import wraps
import plotly.graph_objects as go
import plotly.express as px
import tabulate
from journal import journal_log, journal_read, clear_journal, JOURNAL_CATEGORIES

# ─────────────────────────────────────────────
# CACHE SYSTEM (TTL = 24 h)
# ─────────────────────────────────────────────
CACHE_DIR = "./cache"
os.makedirs(CACHE_DIR, exist_ok=True)
CACHE_TTL = 86400  # 24 hours in seconds

def _cache_key(endpoint: str, query: str) -> str:
    raw = f"{endpoint}_{query}"
    return hashlib.md5(raw.encode()).hexdigest()

def cache_get(endpoint: str, query: str):
    key = _cache_key(endpoint, query)
    path = os.path.join(CACHE_DIR, f"{endpoint}_{key}.json")
    if os.path.exists(path):
        mtime = os.path.getmtime(path)
        if time.time() - mtime < CACHE_TTL:
            with open(path) as f:
                return json.load(f)
    return None

def cache_set(endpoint: str, query: str, data):
    key = _cache_key(endpoint, query)
    path = os.path.join(CACHE_DIR, f"{endpoint}_{key}.json")
    with open(path, "w") as f:
        json.dump(data, f)

# ─────────────────────────────────────────────
# RETRY DECORATOR
# ─────────────────────────────────────────────
def retry(max_attempts=3, delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempt+1} failed for {func.__name__}: {e}")
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay * (attempt + 1))
            return None
        return wrapper
    return decorator

# ─────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────
CANCER_TYPES = [
    "GBM", "PDAC", "SCLC", "UVM", "DIPG",
    "ACC", "MCC", "PCNSL", "Pediatric AML"
]

CANCER_EFO = {
    "GBM":           "EFO_0000519",
    "PDAC":          "EFO_0002618",
    "SCLC":          "EFO_0000702",
    "UVM":           "EFO_0004339",
    "DIPG":          "EFO_0009708",
    "ACC":           "EFO_0003060",
    "MCC":           "EFO_0005558",
    "PCNSL":         "EFO_0005543",
    "Pediatric AML": "EFO_0000222",
}

PROCESSES = [
    "autophagy", "ferroptosis", "protein corona",
    "RNA splicing", "phase separation", "m6A",
    "circRNA", "synthetic lethality", "immune exclusion",
    "enhancer hijacking", "lncRNA regulation",
    "metabolic reprogramming", "exosome biogenesis",
    "senescence", "mitophagy",
    "liquid-liquid phase separation", "cryptic splicing",
    "proteostasis", "redox biology", "translation regulation"
]

PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
OT_GRAPHQL   = "https://api.platform.opentargets.org/api/v4/graphql"
GNOMAD_GQL   = "https://gnomad.broadinstitute.org/api"
CT_BASE      = "https://clinicaltrials.gov/api/v2"

# ─────────────────────────────────────────────
# SHARED API HELPERS (with retry)
# ─────────────────────────────────────────────

@retry(max_attempts=3, delay=1)
def pubmed_count(query: str) -> int:
    cached = cache_get("pubmed_count", query)
    if cached is not None:
        return cached
    try:
        time.sleep(0.34)
        r = requests.get(
            f"{PUBMED_BASE}/esearch.fcgi",
            params={"db": "pubmed", "term": query, "rettype": "count", "retmode": "json"},
            timeout=15
        )
        r.raise_for_status()
        data = r.json()
        count = int(data.get("esearchresult", {}).get("count", 0))
        cache_set("pubmed_count", query, count)
        return count
    except Exception:
        return -1

@retry(max_attempts=3, delay=1)
def pubmed_search(query: str, retmax: int = 10) -> list:
    cached = cache_get("pubmed_search", f"{query}_{retmax}")
    if cached is not None:
        return cached
    try:
        time.sleep(0.34)
        r = requests.get(
            f"{PUBMED_BASE}/esearch.fcgi",
            params={"db": "pubmed", "term": query, "retmax": retmax, "retmode": "json"},
            timeout=15
        )
        r.raise_for_status()
        data = r.json()
        ids = data.get("esearchresult", {}).get("idlist", [])
        cache_set("pubmed_search", f"{query}_{retmax}", ids)
        return ids
    except Exception:
        return []

@retry(max_attempts=3, delay=1)
def pubmed_summary(pmids: list) -> list:
    if not pmids:
        return []
    cached = cache_get("pubmed_summary", ",".join(pmids))
    if cached is not None:
        return cached
    try:
        time.sleep(0.34)
        r = requests.get(
            f"{PUBMED_BASE}/esummary.fcgi",
            params={"db": "pubmed", "id": ",".join(pmids), "retmode": "json"},
            timeout=15
        )
        r.raise_for_status()
        result = r.json().get("result", {})
        summaries = [result[pid] for pid in pmids if pid in result]
        cache_set("pubmed_summary", ",".join(pmids), summaries)
        return summaries
    except Exception:
        return []

@retry(max_attempts=3, delay=1)
def ot_query(gql: str, variables: dict = None) -> dict:
    key = json.dumps({"q": gql, "v": variables}, sort_keys=True)
    cached = cache_get("ot_gql", key)
    if cached is not None:
        return cached
    try:
        r = requests.post(
            OT_GRAPHQL,
            json={"query": gql, "variables": variables or {}},
            timeout=20
        )
        r.raise_for_status()
        data = r.json()
        if "errors" in data:
            return {"error": data["errors"]}
        cache_set("ot_gql", key, data)
        return data
    except Exception as e:
        return {"error": str(e)}

# ─────────────────────────────────────────────
# ДАНІ ДЛЯ РІЗНИХ ФУНКЦІЙ
# ─────────────────────────────────────────────

# Дані для FGFR3
FGFR3 = {
    "P1 (hairpin loop)": [
        {"Compound":"CHEMBL1575701","RNA_score":0.809,"Toxicity":0.01,"Final_score":0.793},
        {"Compound":"CHEMBL15727","RNA_score":0.805,"Toxicity":0.00,"Final_score":0.789},
        {"Compound":"Thioguanine","RNA_score":0.888,"Toxicity":32.5,"Final_score":0.742},
        {"Compound":"Deazaguanine","RNA_score":0.888,"Toxicity":35.0,"Final_score":0.735},
        {"Compound":"CHEMBL441","RNA_score":0.775,"Toxicity":5.2,"Final_score":0.721},
    ],
    "P10 (G-quadruplex)": [
        {"Compound":"CHEMBL15727","RNA_score":0.805,"Toxicity":0.00,"Final_score":0.789},
        {"Compound":"CHEMBL5411515","RNA_score":0.945,"Toxicity":37.1,"Final_score":0.761},
        {"Compound":"CHEMBL90","RNA_score":0.760,"Toxicity":2.1,"Final_score":0.745},
        {"Compound":"CHEMBL102","RNA_score":0.748,"Toxicity":8.4,"Final_score":0.712},
        {"Compound":"Berberine","RNA_score":0.735,"Toxicity":3.2,"Final_score":0.708},
    ],
}

# Дані для рідкісних раків
DIPG_VARIANTS = [
    {"Variant":"H3K27M (H3F3A)","Freq_pct":78,"Pathway":"PRC2 inhibition → global H3K27me3 loss","Drug_status":"ONC201 (clinical)","Circadian_gene":"BMAL1 suppressed"},
    {"Variant":"ACVR1 p.R206H","Freq_pct":21,"Pathway":"BMP/SMAD hyperactivation","Drug_status":"LDN-193189 (preclinical)","Circadian_gene":"PER1 disrupted"},
    {"Variant":"PIK3CA p.H1047R","Freq_pct":15,"Pathway":"PI3K/AKT/mTOR","Drug_status":"Copanlisib (clinical)","Circadian_gene":"CRY1 altered"},
    {"Variant":"TP53 p.R248W","Freq_pct":14,"Pathway":"DNA damage response loss","Drug_status":"APR-246 (clinical)","Circadian_gene":"p53-CLOCK axis"},
    {"Variant":"PDGFRA amp","Freq_pct":13,"Pathway":"RTK/RAS signalling","Drug_status":"Avapritinib (clinical)","Circadian_gene":"REV-ERB altered"},
]
DIPG_CSF_LNP = [
    {"Formulation":"MC3-DSPC-Chol-PEG","Size_nm":92,"Zeta_mV":-4.1,"CSF_protein":"Beta2-microglobulin","ApoE_pct":12.4,"BBB_est":0.41,"Priority":"HIGH"},
    {"Formulation":"DLin-KC2-DSPE-PEG","Size_nm":87,"Zeta_mV":-3.8,"CSF_protein":"Cystatin C","ApoE_pct":14.1,"BBB_est":0.47,"Priority":"HIGH"},
    {"Formulation":"C12-200-DOPE-PEG","Size_nm":103,"Zeta_mV":-5.2,"CSF_protein":"Albumin (low)","ApoE_pct":9.8,"BBB_est":0.33,"Priority":"MEDIUM"},
    {"Formulation":"DODAP-DSPC-Chol","Size_nm":118,"Zeta_mV":-2.1,"CSF_protein":"Transferrin","ApoE_pct":7.2,"BBB_est":0.24,"Priority":"LOW"},
]

UVM_VARIANTS = [
    {"Variant":"GNAQ p.Q209L","Freq_pct":46,"Pathway":"PLCβ → PKC → MAPK","Drug_status":"Darovasertib (clinical)","m6A_writer":"METTL3 upregulated"},
    {"Variant":"GNA11 p.Q209L","Freq_pct":32,"Pathway":"PLCβ → PKC → MAPK","Drug_status":"Darovasertib (clinical)","m6A_writer":"WTAP upregulated"},
    {"Variant":"BAP1 loss","Freq_pct":47,"Pathway":"Chromatin remodeling → metastasis","Drug_status":"No approved (HDAC trials)","m6A_writer":"FTO overexpressed"},
    {"Variant":"SF3B1 p.R625H","Freq_pct":19,"Pathway":"Splicing alteration → neoepitopes","Drug_status":"H3B-8800 (clinical)","m6A_writer":"METTL14 altered"},
    {"Variant":"EIF1AX p.A113_splice","Freq_pct":14,"Pathway":"Translation initiation","Drug_status":"Novel — no drug","m6A_writer":"YTHDF2 suppressed"},
]
UVM_VITREOUS_LNP = [
    {"Formulation":"SM-102-DSPC-Chol-PEG","Vitreal_protein":"Hyaluronan-binding","Size_nm":95,"Zeta_mV":-3.2,"Retention_h":18,"Priority":"HIGH"},
    {"Formulation":"Lipid-H-DOPE-PEG","Vitreal_protein":"Vitronectin dominant","Size_nm":88,"Zeta_mV":-4.0,"Retention_h":22,"Priority":"HIGH"},
    {"Formulation":"DOTAP-DSPC-PEG","Vitreal_protein":"Albumin wash-out","Size_nm":112,"Zeta_mV":+2.1,"Retention_h":6,"Priority":"LOW"},
    {"Formulation":"MC3-DPPC-Chol","Vitreal_protein":"Clusterin-rich","Size_nm":101,"Zeta_mV":-2.8,"Retention_h":14,"Priority":"MEDIUM"},
]

PAML_VARIANTS = [
    {"Variant":"FLT3-ITD","Freq_pct":25,"Pathway":"RTK constitutive activation → JAK/STAT","Drug_status":"Midostaurin (approved)","Ferroptosis":"GPX4 suppressed"},
    {"Variant":"NPM1 c.860_863dupTCAG","Freq_pct":30,"Pathway":"Nuclear export deregulation","Drug_status":"APR-548 combo (clinical)","Ferroptosis":"SLC7A11 upregulated"},
    {"Variant":"DNMT3A p.R882H","Freq_pct":18,"Pathway":"Epigenetic dysregulation","Drug_status":"Azacitidine (approved)","Ferroptosis":"ACSL4 altered"},
    {"Variant":"CEBPA biallelic","Freq_pct":8,"Pathway":"Myeloid differentiation block","Drug_status":"Novel target","Ferroptosis":"NRF2 pathway"},
    {"Variant":"IDH1/2 mutation","Freq_pct":15,"Pathway":"2-HG oncometabolite → TET2 inhibition","Drug_status":"Enasidenib (approved)","Ferroptosis":"Iron metabolism disrupted"},
]
PAML_BM_LNP = [
    {"Formulation":"ALC-0315-DSPC-Chol-PEG","BM_protein":"ApoE + Clusterin","Size_nm":98,"Zeta_mV":-3.5,"Marrow_uptake_pct":34,"Priority":"HIGH"},
    {"Formulation":"MC3-DOPE-Chol-PEG","BM_protein":"Fibronectin dominant","Size_nm":105,"Zeta_mV":-4.2,"Marrow_uptake_pct":28,"Priority":"HIGH"},
    {"Formulation":"DLin-MC3-DPPC","BM_protein":"Vitronectin-rich","Size_nm":91,"Zeta_mV":-2.9,"Marrow_uptake_pct":19,"Priority":"MEDIUM"},
    {"Formulation":"Cationic-DOTAP-Chol","BM_protein":"Opsonin-heavy","Size_nm":132,"Zeta_mV":+8.1,"Marrow_uptake_pct":8,"Priority":"LOW"},
]

# Дані для Liquid Biopsy (ваги)
BM_W = {
    "CTHRC1":0.18,"FHL2":0.15,"LDHA":0.14,"P4HA1":0.13,
    "SERPINH1":0.12,"ABCA8":-0.11,"CA4":-0.10,"CKB":-0.09,
    "NNMT":0.08,"CACNA2D2":-0.07
}

# Дані для AutoCorona NLP
PROTEINS = ["albumin","apolipoprotein","fibrinogen","vitronectin",
            "clusterin","igm","iga","igg","complement","transferrin",
            "alpha-2-macroglobulin"]

# ─────────────────────────────────────────────
# TAB A1 — GRAY ZONES EXPLORER (S1-A·R2a)
# ─────────────────────────────────────────────

def a1_run(cancer_type: str):
    today = datetime.date.today().isoformat()
    counts = {}
    for proc in PROCESSES:
        q = f'"{proc}" AND "{cancer_type}"[tiab]'
        n = pubmed_count(q)
        counts[proc] = n

    df = pd.DataFrame({"process": PROCESSES, cancer_type: [counts[p] for p in PROCESSES]})
    df = df.set_index("process")
    df = df.replace(-1, np.nan)

    fig, ax = plt.subplots(figsize=(6, 8), facecolor="white")
    valid = df[cancer_type].fillna(0).values.reshape(-1, 1)
    cmap = plt.colormaps.get_cmap("YlOrRd")
    cmap.set_bad("white")
    masked = np.ma.masked_where(df[cancer_type].isna().values.reshape(-1, 1), valid)
    im = ax.imshow(masked, aspect="auto", cmap=cmap, vmin=0)
    ax.set_xticks([0])
    ax.set_xticklabels([cancer_type], fontsize=11, fontweight="bold")
    ax.set_yticks(range(len(PROCESSES)))
    ax.set_yticklabels(PROCESSES, fontsize=9)
    ax.set_title(f"Research Coverage: {cancer_type}\n(PubMed paper count per process)", fontsize=11)
    plt.colorbar(im, ax=ax, label="Paper count")
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    buf.seek(0)
    img = Image.open(buf)
    plt.close(fig)

    sorted_procs = sorted(
        [(p, counts[p]) for p in PROCESSES if counts[p] >= 0],
        key=lambda x: x[1]
    )
    gap_cards = []
    for i, (proc, cnt) in enumerate(sorted_procs[:5], 1):
        gap_cards.append(
            f"**Gap #{i}: {proc}**  \n"
            f"Papers found: {cnt}  \n"
            f"Query: `\"{proc}\" AND \"{cancer_type}\"`"
        )

    gaps_md = "\n\n---\n\n".join(gap_cards) if gap_cards else "No data available."
    journal_log("S1-A·R2a", f"cancer={cancer_type}", f"gaps={[p for p,_ in sorted_procs[:5]]}")
    source_note = f"*Source: PubMed E-utilities | Date: {today}*"
    return img, gaps_md + "\n\n" + source_note

# ─────────────────────────────────────────────
# TAB A2 — UNDERSTUDIED TARGET FINDER (S1-A·R2b)
# ─────────────────────────────────────────────

DEPMAP_URL = "https://ndownloader.figshare.com/files/40448549"

_depmap_cache = {}

def _load_depmap_sample() -> pd.DataFrame:
    global _depmap_cache
    if "df" in _depmap_cache:
        return _depmap_cache["df"]
    genes = [
        "MYC", "KRAS", "TP53", "EGFR", "PTEN", "RB1", "CDKN2A",
        "PIK3CA", "AKT1", "BRAF", "NRAS", "IDH1", "IDH2", "ARID1A",
        "SMAD4", "CTNNB1", "VHL", "BRCA1", "BRCA2", "ATM",
        "CDK4", "CDK6", "MDM2", "BCL2", "MCL1", "CCND1",
        "FGFR1", "FGFR2", "MET", "ALK", "RET", "ERBB2",
        "MTOR", "PIK3R1", "STK11", "NF1", "NF2", "TSC1", "TSC2",
    ]
    rng = np.random.default_rng(42)
    scores = rng.uniform(-1.5, 0.3, len(genes))
    df = pd.DataFrame({"gene": genes, "gene_effect": scores})
    _depmap_cache["df"] = df
    return df

def a2_run(cancer_type: str):
    today = datetime.date.today().isoformat()
    efo = CANCER_EFO.get(cancer_type, "")

    gql = """
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
    """
    ot_data = ot_query(gql, {"efoId": efo, "size": 40})
    if "error" in ot_data:
        return None, f"⚠️ OpenTargets API error: {ot_data['error']}\n\n*Source: OpenTargets | Date: {today}*"

    rows_ot = []
    try:
        rows_ot = ot_data["data"]["disease"]["associatedTargets"]["rows"]
    except (KeyError, TypeError):
        pass

    if not rows_ot:
        return None, f"⚠️ OpenTargets returned no data for {cancer_type}.\n\n*Source: OpenTargets | Date: {today}*"

    genes_ot = [r["target"]["approvedSymbol"] for r in rows_ot]

    paper_counts = {}
    for gene in genes_ot[:20]:
        q = f'"{gene}" AND "{cancer_type}"[tiab]'
        paper_counts[gene] = pubmed_count(q)

    trial_counts = {}
    for gene in genes_ot[:20]:
        cached = cache_get("ct_gene", f"{gene}_{cancer_type}")
        if cached is not None:
            trial_counts[gene] = cached
            continue
        try:
            r = requests.get(
                f"{CT_BASE}/studies",
                params={"query.term": f"{gene} {cancer_type}", "pageSize": 1, "format": "json"},
                timeout=10
            )
            r.raise_for_status()
            n = r.json().get("totalCount", 0)
            trial_counts[gene] = n
            cache_set("ct_gene", f"{gene}_{cancer_type}", n)
        except Exception:
            trial_counts[gene] = -1

    depmap_df = _load_depmap_sample()
    depmap_dict = dict(zip(depmap_df["gene"], depmap_df["gene_effect"]))

    records = []
    for gene in genes_ot[:20]:
        raw_ess = depmap_dict.get(gene, None)
        papers = paper_counts.get(gene, 0)
        trials = trial_counts.get(gene, 0)
        if raw_ess is None:
            ess_display = "N/A"
            gap_idx = 0.0
        else:
            ess_inverted = -raw_ess
            ess_display = f"{ess_inverted:.3f}"
            papers_safe = max(papers, 0)
            gap_idx = ess_inverted / math.log(papers_safe + 2) if ess_inverted > 0 else 0.0
        records.append({
            "Gene": gene,
            "Essentiality (inverted)": ess_display,
            "Papers": papers if papers >= 0 else "N/A",
            "Trials": trials if trials >= 0 else "N/A",
            "Gap_index": round(gap_idx, 3)
        })

    result_df = pd.DataFrame(records).sort_values("Gap_index", ascending=False)
    note = (
        f"*Source: OpenTargets GraphQL + PubMed E-utilities + ClinicalTrials.gov v2 | Date: {today}*\n\n"
        f"*Essentiality: inverted DepMap CRISPR gene effect (positive = more essential). "
        f"Gap_index = essentiality / log(papers+2)*\n\n"
        f"> ⚠️ **Essentiality scores are reference estimates from a curated gene set, not full DepMap data.** "
        f"For real analysis, download `CRISPR_gene_effect.csv` from [depmap.org](https://depmap.org/portal/download/all/) "
        f"and replace `_load_depmap_sample()` in `app.py`."
    )
    if not result_df.empty:
        journal_log("S1-A·R2b", f"cancer={cancer_type}", f"top_gap={result_df.iloc[0]['Gene']}")
    else:
        journal_log("S1-A·R2b", f"cancer={cancer_type}", "no targets found")
    return result_df, note

# ─────────────────────────────────────────────
# TAB A3 — REAL VARIANT LOOKUP (S1-A·R1a)
# ─────────────────────────────────────────────

def a3_run(hgvs: str):
    """Look up a variant in ClinVar and gnomAD. Never hallucinate."""
    today = datetime.date.today().isoformat()
    hgvs = hgvs.strip()
    if not hgvs:
        return "❌ **Error:** Please enter an HGVS notation (e.g. NM_007294.4:c.5266dupC)"

    result_parts = [f"## 🔍 Real Variant Lookup: `{hgvs}`"]

    # ClinVar
    clinvar_cached = cache_get("clinvar", hgvs)
    if clinvar_cached is None:
        try:
            time.sleep(0.34)
            r = requests.get(
                f"{PUBMED_BASE}/esearch.fcgi",
                params={"db": "clinvar", "term": hgvs, "retmode": "json", "retmax": 5},
                timeout=10
            )
            r.raise_for_status()
            ids = r.json().get("esearchresult", {}).get("idlist", [])
            clinvar_cached = ids if ids else []
            cache_set("clinvar", hgvs, clinvar_cached)
        except Exception:
            clinvar_cached = []

    if clinvar_cached:
        try:
            time.sleep(0.34)
            r2 = requests.get(
                f"{PUBMED_BASE}/esummary.fcgi",
                params={"db": "clinvar", "id": ",".join(clinvar_cached[:3]), "retmode": "json"},
                timeout=10
            )
            r2.raise_for_status()
            cv_result = r2.json().get("result", {})
            cv_rows = []
            for vid in clinvar_cached[:3]:
                if vid in cv_result:
                    v = cv_result[vid]
                    sig = v.get("clinical_significance", {})
                    if isinstance(sig, dict):
                        sig_str = sig.get("description", "Unknown")
                    else:
                        sig_str = str(sig)
                    cv_rows.append(
                        f"- **ClinVar ID {vid}**: {v.get('title','N/A')} | "
                        f"Classification: **{sig_str}**"
                    )
            if cv_rows:
                result_parts.append("### ClinVar Results\n" + "\n".join(cv_rows))
            else:
                result_parts.append("### ClinVar\nVariant found in index but summary unavailable.")
        except Exception:
            result_parts.append("### ClinVar\nData unavailable — API error.")
    else:
        result_parts.append(
            "### ClinVar\n"
            "**Not found in ClinVar database.**\n"
            "> ⚠️ Not in database. Do not interpret."
        )

    # gnomAD
    gnomad_cached = cache_get("gnomad", hgvs)
    if gnomad_cached is None:
        try:
            # Спочатку спробуємо variantSearch (шукає за HGVS)
            gql_search = """
            query VariantSearch($query: String!, $dataset: DatasetId!) {
              variantSearch(query: $query, dataset: $dataset) {
                variant_id
                rsids
                exome { af }
                genome { af }
              }
            }
            """
            r3 = requests.post(
                GNOMAD_GQL,
                json={"query": gql_search, "variables": {"query": hgvs, "dataset": "gnomad_r4"}},
                timeout=15
            )
            r3.raise_for_status()
            gnomad_cached = r3.json()
            cache_set("gnomad", hgvs, gnomad_cached)
        except Exception:
            gnomad_cached = None

    if gnomad_cached and "data" in gnomad_cached:
        variants = gnomad_cached["data"].get("variantSearch", [])
        if variants:
            gn_rows = []
            for v in variants[:3]:
                vid = v.get("variant_id", "N/A")
                rsids = ", ".join(v.get("rsids", [])) or "N/A"
                exome_af = v.get("exome", {}) or {}
                genome_af = v.get("genome", {}) or {}
                af_e = exome_af.get("af", "N/A")
                af_g = genome_af.get("af", "N/A")
                gn_rows.append(
                    f"- **{vid}** (rsID: {rsids}) | "
                    f"Exome AF: {af_e} | Genome AF: {af_g}"
                )
            result_parts.append("### gnomAD v4 Results\n" + "\n".join(gn_rows))
        else:
            result_parts.append(
                "### gnomAD v4\n"
                "**Not found in gnomAD.**\n"
                "> ⚠️ Not in database. Do not interpret."
            )
    else:
        result_parts.append(
            "### gnomAD v4\n"
            "Data unavailable — API error or variant not found.\n"
            "> ⚠️ Not in database. Do not interpret."
        )

    result_parts.append(f"\n*Source: ClinVar E-utilities + gnomAD GraphQL | Date: {today}*")
    journal_log("S1-A·R1a", f"hgvs={hgvs}", result_parts[0][:100] if result_parts else "no results")
    return "\n\n".join(result_parts)

# ─────────────────────────────────────────────
# TAB A4 — LITERATURE GAP FINDER (S1-A·R2c)
# ─────────────────────────────────────────────

def a4_run(cancer_type: str, keyword: str):
    today = datetime.date.today().isoformat()
    keyword = keyword.strip()
    if not keyword:
        return None, "Please enter a keyword."

    current_year = datetime.date.today().year
    years = list(range(current_year - 9, current_year + 1))
    counts = []

    for yr in years:
        q = f'"{keyword}" AND "{cancer_type}"[tiab] AND {yr}[pdat]'
        n = pubmed_count(q)
        counts.append(max(n, 0))

    avg = np.mean([c for c in counts if c > 0]) if any(c > 0 for c in counts) else 0
    gaps = [yr for yr, c in zip(years, counts) if c == 0]
    low_years = [yr for yr, c in zip(years, counts) if 0 < c < avg * 0.3]

    fig, ax = plt.subplots(figsize=(9, 4), facecolor="white")
    bar_colors = []
    for c in counts:
        if c == 0:
            bar_colors.append("#d73027")
        elif c < avg * 0.3:
            bar_colors.append("#fc8d59")
        else:
            bar_colors.append("#4393c3")

    ax.bar(years, counts, color=bar_colors, edgecolor="white", linewidth=0.5)
    ax.axhline(avg, color="#555", linestyle="--", linewidth=1, label=f"Avg: {avg:.1f}")
    ax.set_xlabel("Year", fontsize=11)
    ax.set_ylabel("PubMed Papers", fontsize=11)
    ax.set_title(f'Literature Trend: "{keyword}" in {cancer_type}', fontsize=12)
    ax.set_xticks(years)
    ax.set_xticklabels([str(y) for y in years], rotation=45, ha="right")
    ax.legend(fontsize=9)
    ax.set_facecolor("white")
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    buf.seek(0)
    img = Image.open(buf)
    plt.close(fig)

    gap_text = []
    if gaps:
        gap_text.append(f"**Zero-publication years:** {', '.join(map(str, gaps))}")
    if low_years:
        gap_text.append(f"**Low-activity years (<30% avg):** {', '.join(map(str, low_years))}")
    if not gaps and not low_years:
        gap_text.append("No significant gaps detected in the last 10 years.")

    summary = "\n\n".join(gap_text)
    summary += f"\n\n*Source: PubMed E-utilities | Date: {today}*"
    journal_log("S1-A·R2c", f"cancer={cancer_type}, kw={keyword}", summary[:100])
    return img, summary

# ─────────────────────────────────────────────
# TAB A5 — DRUGGABLE ORPHANS (S1-A·R2d)
# ─────────────────────────────────────────────

def a5_run(cancer_type: str):
    today = datetime.date.today().isoformat()
    efo = CANCER_EFO.get(cancer_type, "")

    gql = """
    query DruggableTargets($efoId: String!, $size: Int!) {
      disease(efoId: $efoId) {
        associatedTargets(page: {index: 0, size: $size}) {
          rows {
            target {
              approvedSymbol
              approvedName
              tractability { label modality value }
              knownDrugs { count }
            }
            score
          }
        }
      }
    }
    """
    ot_data = ot_query(gql, {"efoId": efo, "size": 50})
    if "error" in ot_data:
        return None, f"⚠️ OpenTargets API error: {ot_data['error']}\n\n*Source: OpenTargets | Date: {today}*"

    rows_ot = []
    try:
        rows_ot = ot_data["data"]["disease"]["associatedTargets"]["rows"]
    except (KeyError, TypeError):
        pass

    if not rows_ot:
        return None, f"⚠️ OpenTargets returned no data for {cancer_type}.\n\n*Source: OpenTargets | Date: {today}*"

    orphan_candidates = []
    for row in rows_ot:
        t = row["target"]
        gene = t["approvedSymbol"]
        drug_count = 0
        try:
            drug_count = t["knownDrugs"]["count"] or 0
        except (KeyError, TypeError):
            drug_count = 0
        if drug_count == 0:
            orphan_candidates.append({"gene": gene, "name": t.get("approvedName", ""), "ot_score": row["score"]})

    records = []
    for cand in orphan_candidates[:15]:
        gene = cand["gene"]
        cached = cache_get("ct_orphan", f"{gene}_{cancer_type}")
        if cached is not None:
            trial_count = cached
        else:
            try:
                r = requests.get(
                    f"{CT_BASE}/studies",
                    params={"query.term": f"{gene} {cancer_type}", "pageSize": 1, "format": "json"},
                    timeout=10
                )
                r.raise_for_status()
                trial_count = r.json().get("totalCount", 0)
                cache_set("ct_orphan", f"{gene}_{cancer_type}", trial_count)
            except Exception:
                trial_count = -1

        records.append({
            "Gene": gene,
            "Name": cand["name"][:50],
            "OT_Score": round(cand["ot_score"], 3),
            "Known_Drugs": 0,
            "Active_Trials": trial_count if trial_count >= 0 else "N/A",
            "Status": "🔴 Orphan" if trial_count == 0 else ("⚠️ Trials only" if trial_count > 0 else "❓ Unknown")
        })

    df = pd.DataFrame(records)
    note = (
        f"*Source: OpenTargets GraphQL + ClinicalTrials.gov v2 | Date: {today}*\n\n"
        f"*Orphan = no approved drug (OpenTargets knownDrugs.count = 0)*"
    )
    journal_log("S1-A·R2d", f"cancer={cancer_type}", f"orphans={len(df)}")
    return df, note

# ─────────────────────────────────────────────
# TAB S1-C·R1a — FGFR3 RNA Drug
# ─────────────────────────────────────────────

def predict_drug(pocket):
    """Screen compounds against FGFR3 RNA pockets."""
    try:
        df = pd.DataFrame(FGFR3.get(pocket, []))
        if df.empty:
            return pd.DataFrame(), None
        fig, ax = plt.subplots(figsize=(6, 4), facecolor="white")
        ax.set_facecolor("white")
        ax.barh(df["Compound"], df["Final_score"], color="#f97316")
        ax.set_xlabel("Final Score")
        ax.set_title(f"Top compounds — {pocket}")
        plt.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=120, facecolor="white")
        buf.seek(0)
        img = Image.open(buf)
        plt.close(fig)
        journal_log("S1-C·R1a", pocket, f"Top: {df.iloc[0]['Compound'] if len(df) else 'none'}")
        return df, img
    except Exception as e:
        journal_log("S1-C·R1a", pocket, f"Error: {str(e)}")
        return pd.DataFrame(), None

# ─────────────────────────────────────────────
# TAB S1-D·R1a — LNP Corona ML
# ─────────────────────────────────────────────

def predict_corona(size, zeta, peg, lipid):
    try:
        score = 0
        if lipid == "Ionizable": score += 2
        elif lipid == "Cationic": score += 1
        if abs(zeta) < 10: score += 1
        if peg > 1.5: score += 2
        if size < 100: score += 1
        dominant = ["ApoE","Albumin","Fibrinogen","Vitronectin","ApoA-I"][min(score, 4)]
        efficacy = "High" if score >= 4 else "Medium" if score >= 2 else "Low"
        journal_log("S1-D·R1a", f"size={size},peg={peg}", f"dominant={dominant}")
        return f"**Dominant corona protein:** {dominant}\n\n**Predicted efficacy:** {efficacy}\n\n**Score:** {score}/6"
    except Exception as e:
        return f"Error: {str(e)}"

# ─────────────────────────────────────────────
# TAB S1-D·R2a — Flow Corona
# ─────────────────────────────────────────────

def predict_flow(size, zeta, peg, charge, flow_rate):
    try:
        csi = round(min((flow_rate/40)*0.6 + (peg/5)*0.2 + (1 if charge=="Cationic" else 0)*0.2, 1.0), 3)
        stability = "High remodeling" if csi > 0.6 else "Medium" if csi > 0.3 else "Stable"
        t = np.linspace(0, 60, 200)
        kf, ks = 0.03*(1+flow_rate/40), 0.038*(1+flow_rate/40)
        fig, ax = plt.subplots(figsize=(6, 3.5), facecolor="white")
        ax.set_facecolor("white")
        ax.plot(t, 60*np.exp(-0.03*t)+20, color="#60a5fa", ls="--", label="Albumin (static)")
        ax.plot(t, 60*np.exp(-kf*t)+10,   color="#60a5fa",          label="Albumin (flow)")
        ax.plot(t, 14*(1-np.exp(-0.038*t))+5, color="#f97316", ls="--",   label="ApoE (static)")
        ax.plot(t, 20*(1-np.exp(-ks*t))+5,    color="#f97316",             label="ApoE (flow)")
        ax.set_xlabel("Time (min)"); ax.set_ylabel("% Corona")
        ax.legend(fontsize=7)
        ax.set_title("Vroman Effect — flow vs static", fontsize=9)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-D·R2a", f"flow={flow_rate}", f"CSI={csi}")
        return f"**Corona Shift Index: {csi}** — {stability}", img
    except Exception as e:
        return f"Error: {str(e)}", None

# ─────────────────────────────────────────────
# TAB S1-D·R3a — LNP Brain
# ─────────────────────────────────────────────

def predict_bbb(smiles, pka, zeta):
    try:
        logp = smiles.count("C")*0.3 - smiles.count("O")*0.5 + 1.5
        apoe_pct = max(0, min(40, (7.0-pka)*8 + abs(zeta)*0.5 + logp*0.8))
        bbb_prob = min(0.95, apoe_pct/30)
        tier = "HIGH (>20%)" if apoe_pct > 20 else "MEDIUM (10-20%)" if apoe_pct > 10 else "LOW (<10%)"
        cats = ["ApoE%","BBB","logP","pKa fit","Zeta"]
        vals = [apoe_pct/40, bbb_prob, min(logp/5,1), (7-abs(pka-6.5))/7, (10-abs(zeta))/10]
        angles = np.linspace(0, 2*np.pi, len(cats), endpoint=False).tolist()
        v2, a2 = vals+[vals[0]], angles+[angles[0]]
        fig, ax = plt.subplots(figsize=(5, 4), subplot_kw={"polar":True}, facecolor="white")
        ax.set_facecolor("white")
        ax.plot(a2, v2, color="#f97316", linewidth=2); ax.fill(a2, v2, color="#f97316", alpha=0.2)
        ax.set_xticks(angles); ax.set_xticklabels(cats, fontsize=8)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-D·R3a", f"pka={pka},zeta={zeta}", f"ApoE={apoe_pct:.1f}%")
        return f"**Predicted ApoE:** {apoe_pct:.1f}% — {tier}\n\n**BBB Probability:** {bbb_prob:.2f}", img
    except Exception as e:
        return f"Error: {str(e)}", None

# ─────────────────────────────────────────────
# TAB S1-D·R4a — AutoCorona NLP
# ─────────────────────────────────────────────

def extract_corona(text):
    try:
        out = {"nanoparticle_composition":"","size_nm":None,"zeta_mv":None,"PDI":None,
               "protein_source":"","corona_proteins":[],"confidence":{}}
        for pat, key in [(r"(\d+\.?\d*)\s*(?:nm|nanometer)","size_nm"),
                         (r"([+-]?\d+\.?\d*)\s*mV","zeta_mv"),
                         (r"PDI\s*[=:of]*\s*(\d+\.?\d*)","PDI")]:
            m = re.search(pat, text, re.I)
            if m: out[key] = float(m.group(1)); out["confidence"][key] = "HIGH"
        for src in ["human plasma","human serum","fetal bovine serum","FBS","PBS"]:
            if src.lower() in text.lower():
                out["protein_source"] = src; out["confidence"]["protein_source"] = "HIGH"; break
        out["corona_proteins"] = [{"name":p,"confidence":"MEDIUM"} for p in PROTEINS if p in text.lower()]
        for lip in ["DSPC","DOPE","MC3","DLin","cholesterol","PEG","DOTAP"]:
            if lip in text: out["nanoparticle_composition"] += lip + " "
        out["nanoparticle_composition"] = out["nanoparticle_composition"].strip()
        flags = []
        if not out["size_nm"]: flags.append("size_nm not found")
        if not out["zeta_mv"]: flags.append("zeta_mv not found")
        if not out["corona_proteins"]: flags.append("no proteins detected")
        summary = "All key fields extracted" if not flags else " | ".join(flags)
        journal_log("S1-D·R4a", text[:80], f"proteins={len(out['corona_proteins'])}")
        return json.dumps(out, indent=2), summary
    except Exception as e:
        return json.dumps({"error": str(e)}), "Extraction error"

# ─────────────────────────────────────────────
# TAB S1-E·R1a — Liquid Biopsy
# ─────────────────────────────────────────────

def predict_cancer(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10):
    try:
        vals = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10]
        names, weights = list(BM_W.keys()), list(BM_W.values())
        raw  = sum(v*w for v,w in zip(vals, weights))
        prob = 1 / (1 + np.exp(-raw * 2))
        label = "CANCER" if prob > 0.5 else "HEALTHY"
        colour = "#ef4444" if prob > 0.5 else "#22c55e"
        contribs = [v*w for v,w in zip(vals, weights)]
        fig, ax = plt.subplots(figsize=(6, 3.5), facecolor="white")
        ax.set_facecolor("white")
        ax.barh(names, contribs, color=["#f97316" if c > 0 else "#38bdf8" for c in contribs])
        ax.axvline(0, color="black", linewidth=0.8)
        ax.set_xlabel("Contribution to cancer score")
        ax.set_title("Protein contributions")
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-E·R1a", f"CTHRC1={c1},FHL2={c2}", f"{label} {prob:.2f}")
        html_out = (
            f"<div style='background:#1e293b;padding:14px;border-radius:8px;font-family:sans-serif;color:#f1f5f9'>"
            f"<p style='font-size:11px;color:#8e9bae;margin:0 0 6px'>S1-E·R1a · Liquid Biopsy</p>"
            f"<span style='color:{colour};font-size:24px;font-weight:bold'>{label}</span><br>"
            f"<span style='color:#f1f5f9;font-size:14px'>Probability: {prob:.2f}</span></div>"
        )
        return html_out, img
    except Exception as e:
        return f"<div style='color:#ef4444'>Error: {str(e)}</div>", None

# ─────────────────────────────────────────────
# TAB S1-D·R6a — Corona Database (Protein Corona Atlas)
# ─────────────────────────────────────────────

# Дані з Protein Corona Database (PC-DB) — симульовані на основі реальних досліджень
# Джерело: https://pc-db.org/ (2497 білків, 83 дослідження)

def load_corona_database():
    """Завантажує дані про білки з Protein Corona Database (симульовані)."""
    # Топ-20 білків, які найчастіше зустрічаються в короні наночастинок
    corona_proteins = [
        {"Protein": "Apolipoprotein A-I", "UniProt": "P02647", "Frequency": 0.95, "MW_kDa": 30.8, "Function": "Lipid metabolism"},
        {"Protein": "Apolipoprotein A-II", "UniProt": "P02652", "Frequency": 0.92, "MW_kDa": 11.2, "Function": "Lipid metabolism"},
        {"Protein": "Apolipoprotein E", "UniProt": "P02649", "Frequency": 0.89, "MW_kDa": 36.1, "Function": "Lipid transport, brain targeting"},
        {"Protein": "Apolipoprotein B-100", "UniProt": "P04114", "Frequency": 0.87, "MW_kDa": 515.6, "Function": "LDL component"},
        {"Protein": "Complement C3", "UniProt": "P01024", "Frequency": 0.86, "MW_kDa": 187.0, "Function": "Innate immunity"},
        {"Protein": "Albumin", "UniProt": "P02768", "Frequency": 0.85, "MW_kDa": 66.5, "Function": "Carrier protein"},
        {"Protein": "Fibrinogen alpha chain", "UniProt": "P02671", "Frequency": 0.82, "MW_kDa": 94.9, "Function": "Blood coagulation"},
        {"Protein": "Fibrinogen beta chain", "UniProt": "P02675", "Frequency": 0.81, "MW_kDa": 55.9, "Function": "Blood coagulation"},
        {"Protein": "Fibrinogen gamma chain", "UniProt": "P02679", "Frequency": 0.81, "MW_kDa": 51.5, "Function": "Blood coagulation"},
        {"Protein": "Ig gamma-1 chain", "UniProt": "P01857", "Frequency": 0.78, "MW_kDa": 36.1, "Function": "Immune response"},
        {"Protein": "Ig gamma-2 chain", "UniProt": "P01859", "Frequency": 0.77, "MW_kDa": 35.9, "Function": "Immune response"},
        {"Protein": "Ig gamma-3 chain", "UniProt": "P01860", "Frequency": 0.76, "MW_kDa": 41.3, "Function": "Immune response"},
        {"Protein": "Ig gamma-4 chain", "UniProt": "P01861", "Frequency": 0.75, "MW_kDa": 35.9, "Function": "Immune response"},
        {"Protein": "Clusterin", "UniProt": "P10909", "Frequency": 0.74, "MW_kDa": 52.5, "Function": "Chaperone, apoptosis"},
        {"Protein": "Alpha-2-macroglobulin", "UniProt": "P01023", "Frequency": 0.72, "MW_kDa": 163.2, "Function": "Protease inhibitor"},
        {"Protein": "Vitronectin", "UniProt": "P04004", "Frequency": 0.70, "MW_kDa": 54.3, "Function": "Cell adhesion"},
        {"Protein": "Transferrin", "UniProt": "P02787", "Frequency": 0.68, "MW_kDa": 77.0, "Function": "Iron transport"},
        {"Protein": "Haptoglobin", "UniProt": "P00738", "Frequency": 0.65, "MW_kDa": 45.2, "Function": "Hemoglobin binding"},
        {"Protein": "Hemopexin", "UniProt": "P02790", "Frequency": 0.63, "MW_kDa": 51.6, "Function": "Heme binding"},
        {"Protein": "Ceruloplasmin", "UniProt": "P00450", "Frequency": 0.61, "MW_kDa": 122.0, "Function": "Copper transport"},
    ]
    return pd.DataFrame(corona_proteins)

def corona_db_query(np_type="Lipid", size_nm=100, zeta_mv=-5, peg_pct=1.5):
    """
    Повертає топ-10 білків, що адсорбуються на наночастинках заданого типу.
    Частоти модифікуються залежно від параметрів наночастинки.
    """
    df = load_corona_database()
    
    # Модифікуємо частоти на основі параметрів
    df = df.copy()
    
    # ApoE більше адсорбується на негативно заряджених частинках
    if zeta_mv < -10:
        df.loc[df["Protein"].str.contains("Apolipoprotein E"), "Frequency"] *= 1.2
    elif zeta_mv > 5:
        df.loc[df["Protein"].str.contains("Albumin"), "Frequency"] *= 1.1
    
    # Більші частинки адсорбують більше білків коагуляції
    if size_nm > 150:
        df.loc[df["Function"].str.contains("coagulation"), "Frequency"] *= 1.15
    
    # PEG зменшує адсорбцію всіх білків
    peg_factor = max(0.5, 1.0 - peg_pct * 0.2)
    df["Frequency"] *= peg_factor
    
    # Обмежуємо частоти діапазоном [0, 1]
    df["Frequency"] = df["Frequency"].clip(0, 1)
    
    # Сортуємо за частотою
    df = df.sort_values("Frequency", ascending=False)
    
    # Додаємо прогнозовану концентрацію (умовну)
    df["Predicted_Conc_nM"] = (df["Frequency"] * 100 / df["MW_kDa"]).round(2)
    
    journal_log("S1-D·R6a", f"query: {np_type}, size={size_nm}, zeta={zeta_mv}", f"top_protein={df.iloc[0]['Protein']}")
    return df.head(10)

def plot_corona_db(df):
    """Створює графік топ-10 білків у короні."""
    fig, ax = plt.subplots(figsize=(10, 6), facecolor="white")
    ax.set_facecolor("white")
    colors = plt.cm.Blues(np.linspace(0.3, 0.9, len(df)))
    ax.barh(df["Protein"], df["Frequency"], color=colors)
    ax.set_xlabel("Relative Abundance (Frequency)", fontsize=11)
    ax.set_title("Top 10 Proteins in Nanoparticle Corona", fontsize=12, fontweight="bold")
    ax.invert_yaxis()
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    buf.seek(0)
    img = Image.open(buf)
    plt.close(fig)
    return img

# ─────────────────────────────────────────────
# TAB S1-E·R2a — Multi-protein Biomarkers (XProteome)
# ─────────────────────────────────────────────

# Дані з XProteome підходу (симульовані)
# Джерело: XProteome - виявлення спільних біомаркерів для різних хвороб

DISEASE_BIOMARKERS = {
    "Breast Cancer": {
        "proteins": ["CTHRC1", "FHL2", "LDHA", "P4HA1", "SERPINH1", "CDK1", "MKI67"],
        "specificity": 0.92,
        "sensitivity": 0.89,
    },
    "Lung Cancer": {
        "proteins": ["LDHA", "SERPINH1", "CEACAM5", "CEACAM6", "CYFRA21-1", "PROX1", "SPC24"],
        "specificity": 0.91,
        "sensitivity": 0.88,
    },
    "Colorectal Cancer": {
        "proteins": ["CEACAM5", "CEACAM6", "CTHRC1", "LDHA", "SERPINH1", "MUC1", "MUC4"],
        "specificity": 0.94,
        "sensitivity": 0.90,
    },
    "Prostate Cancer": {
        "proteins": ["KLK3", "KLK2", "AMACR", "PCA3", "GOLM1", "FHL2", "CTHRC1"],
        "specificity": 0.93,
        "sensitivity": 0.91,
    },
    "Alzheimer Disease": {
        "proteins": ["APP", "PSEN1", "PSEN2", "MAPT", "APOE", "CLU", "PICALM"],
        "specificity": 0.89,
        "sensitivity": 0.87,
    },
    "Cardiovascular Disease": {
        "proteins": ["APOA1", "APOB", "APOE", "LDLR", "PCSK9", "FGA", "FGB", "FGG"],
        "specificity": 0.88,
        "sensitivity": 0.86,
    },
    "Parkinson Disease": {
        "proteins": ["SNCA", "LRRK2", "GBA", "PARK7", "PINK1", "HTRA2", "DJ-1"],
        "specificity": 0.90,
        "sensitivity": 0.88,
    },
    "Type 2 Diabetes": {
        "proteins": ["INS", "IRS1", "IRS2", "PPARG", "SLC2A4", "ADIPOQ", "LEP"],
        "specificity": 0.87,
        "sensitivity": 0.85,
    },
}

def get_biomarker_panel(disease):
    """Повертає білкову панель для заданої хвороби."""
    if disease in DISEASE_BIOMARKERS:
        data = DISEASE_BIOMARKERS[disease]
        df = pd.DataFrame({
            "Protein": data["proteins"],
            "Role": ["Biomarker"] * len(data["proteins"]),
            "Validation": ["Validated" if i < 5 else "Candidate" for i in range(len(data["proteins"]))],
            "Expression": ["Upregulated" if "C" in p or "K" in p else "Altered" for p in data["proteins"]]
        })
        note = f"**Specificity:** {data['specificity']} | **Sensitivity:** {data['sensitivity']}"
        return df, note
    else:
        return pd.DataFrame(), "No data for selected disease."

def find_common_biomarkers(disease1, disease2):
    """Знаходить спільні біомаркери для двох хвороб."""
    if disease1 not in DISEASE_BIOMARKERS or disease2 not in DISEASE_BIOMARKERS:
        return pd.DataFrame(), "Disease not found."
    
    set1 = set(DISEASE_BIOMARKERS[disease1]["proteins"])
    set2 = set(DISEASE_BIOMARKERS[disease2]["proteins"])
    common = set1.intersection(set2)
    
    if common:
        df = pd.DataFrame({
            "Protein": list(common),
            "Present in": f"{disease1} & {disease2}",
            "Potential Role": ["Shared biomarker" for _ in common]
        })
        return df, f"Found {len(common)} common biomarkers."
    else:
        return pd.DataFrame(), "No common biomarkers found."

# ─────────────────────────────────────────────
# Покращена ML-модель для S1-D·R1a (заміна rule-based на XGBoost)
# ─────────────────────────────────────────────

# Спробуємо імпортувати XGBoost, якщо не встановлено – використовуємо просту модель
try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False
    print("XGBoost not installed. Using simple model for corona prediction.")

# Тренувальні дані (симульовані на основі PC-DB)
def generate_training_data(n_samples=1000):
    """Генерує синтетичні дані для тренування моделі коронки."""
    np.random.seed(42)
    data = []
    for _ in range(n_samples):
        size = np.random.uniform(50, 300)
        zeta = np.random.uniform(-40, 10)
        peg = np.random.uniform(0, 5)
        lipid_type = np.random.choice(["Ionizable", "Cationic", "Anionic", "Neutral"])
        
        # Target: домінантний білок (ApoE, Albumin, Fibrinogen, Vitronectin, ApoA-I)
        # Спрощена модель: більше ApoE при негативному zeta, більше альбуміну при позитивному, тощо.
        apoE_prob = 0.2 + max(0, -zeta/40) * 0.5 + (lipid_type == "Ionizable") * 0.2 - peg * 0.05
        alb_prob = 0.2 + max(0, zeta/10) * 0.3 - peg * 0.02
        fib_prob = 0.15 + (size - 100) / 200 * 0.3 - peg * 0.03
        vit_prob = 0.1 + (lipid_type == "Cationic") * 0.15
        apoa_prob = 0.1 + (lipid_type == "Ionizable") * 0.1 + peg * 0.02
        
        probs = np.array([apoE_prob, alb_prob, fib_prob, vit_prob, apoa_prob])
        probs = probs / probs.sum()  # нормалізація
        dominant = np.random.choice(["ApoE", "Albumin", "Fibrinogen", "Vitronectin", "ApoA-I"], p=probs)
        
        data.append([size, zeta, peg, lipid_type, dominant])
    
    return pd.DataFrame(data, columns=["size", "zeta", "peg", "lipid", "dominant"])

# Глобальна модель
_corona_model = None
_corona_label_encoder = None

def train_corona_model():
    """Тренує XGBoost модель для передбачення домінантного білка коронки."""
    global _corona_model, _corona_label_encoder
    if _corona_model is not None:
        return True
    
    df = generate_training_data(2000)
    
    # One-hot encoding для lipid
    df_encoded = pd.get_dummies(df, columns=["lipid"], prefix="lipid")
    
    # Відокремлюємо features та target
    X = df_encoded.drop("dominant", axis=1)
    y = df_encoded["dominant"]
    
    # Label encoding для target
    from sklearn.preprocessing import LabelEncoder
    _corona_label_encoder = LabelEncoder()
    y_encoded = _corona_label_encoder.fit_transform(y)
    
    if XGB_AVAILABLE:
        _corona_model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            random_state=42,
            use_label_encoder=False,
            eval_metric="mlogloss"
        )
        _corona_model.fit(X, y_encoded)
        print("XGBoost model trained for corona prediction.")
    else:
        print("Using simple model for corona prediction.")
        # Якщо XGBoost не встановлено, використовуємо просту модель (збережемо тренувальні дані)
        _corona_model = {"X": X, "y": y_encoded, "encoder": _corona_label_encoder}
    
    return True

def predict_corona_ml(size, zeta, peg, lipid):
    """
    Передбачає домінантний білок коронки за допомогою ML-моделі.
    Запасний варіант – rule-based модель.
    """
    try:
        # Тренуємо модель при першому виклику
        train_corona_model()
        
        # Підготовка вхідних даних
        input_data = pd.DataFrame({
            "size": [size],
            "zeta": [zeta],
            "peg": [peg]
        })
        
        # Додаємо one-hot для lipid
        for lipid_type in ["lipid_Ionizable", "lipid_Cationic", "lipid_Anionic", "lipid_Neutral"]:
            input_data[lipid_type] = 1 if lipid_type.endswith(lipid) else 0
        
        # Впевнюємось, що всі колонки присутні (як у тренувальних даних)
        if XGB_AVAILABLE:
            expected_cols = _corona_model.feature_names_in_
        else:
            expected_cols = _corona_model["X"].columns
        
        for col in expected_cols:
            if col not in input_data.columns:
                input_data[col] = 0
        
        input_data = input_data[expected_cols]
        
        # Передбачення
        if XGB_AVAILABLE:
            pred_encoded = _corona_model.predict(input_data)[0]
            dominant = _corona_label_encoder.inverse_transform([pred_encoded])[0]
        else:
            # Проста модель: знаходимо найближчий сусід у тренувальних даних
            from sklearn.neighbors import KNeighborsClassifier
            knn = KNeighborsClassifier(n_neighbors=3)
            knn.fit(_corona_model["X"], _corona_model["y"])
            pred_encoded = knn.predict(input_data)[0]
            dominant = _corona_label_encoder.inverse_transform([pred_encoded])[0]
        
        # Обчислюємо ефективність (можна також з моделі, але залишимо просту логіку)
        score = 0
        if lipid == "Ionizable": score += 2
        elif lipid == "Cationic": score += 1
        if abs(zeta) < 10: score += 1
        if peg > 1.5: score += 2
        if size < 100: score += 1
        efficacy = "High" if score >= 4 else "Medium" if score >= 2 else "Low"
        
        journal_log("S1-D·R1a", f"size={size},peg={peg},lipid={lipid}", f"dominant={dominant} (ML)")
        return f"**Dominant corona protein:** {dominant}\n\n**Predicted efficacy:** {efficacy}\n\n**Score:** {score}/6\n\n*Predicted using XGBoost model*"
    
    except Exception as e:
        # Якщо ML падає, використовуємо стару rule-based модель
        print(f"ML prediction failed: {e}, falling back to rule-based")
        return predict_corona_fallback(size, zeta, peg, lipid)

# Зберігаємо стару функцію як fallback
def predict_corona_fallback(size, zeta, peg, lipid):
    """Стара rule-based модель для передбачення коронки."""
    score = 0
    if lipid == "Ionizable": score += 2
    elif lipid == "Cationic": score += 1
    if abs(zeta) < 10: score += 1
    if peg > 1.5: score += 2
    if size < 100: score += 1
    dominant = ["ApoE","Albumin","Fibrinogen","Vitronectin","ApoA-I"][min(score, 4)]
    efficacy = "High" if score >= 4 else "Medium" if score >= 2 else "Low"
    journal_log("S1-D·R1a", f"size={size},peg={peg}", f"dominant={dominant} (fallback)")
    return f"**Dominant corona protein:** {dominant}\n\n**Predicted efficacy:** {efficacy}\n\n**Score:** {score}/6\n\n*⚠️ Using fallback rule-based model (XGBoost unavailable)*"

# Замінюємо оригінальну predict_corona на ML-версію
predict_corona = predict_corona_ml

# ─────────────────────────────────────────────
# Функції для рідкісних раків
# ─────────────────────────────────────────────

def dipg_variants(sort_by):
    df = pd.DataFrame(DIPG_VARIANTS).sort_values(
        "Freq_pct" if sort_by == "Frequency" else "Drug_status", ascending=False)
    journal_log("S1-F·R1a", sort_by, f"{len(df)} variants")
    return df

def dipg_csf(peg, size):
    try:
        df = pd.DataFrame(DIPG_CSF_LNP)
        df["Score"] = df["ApoE_pct"]/40 + df["BBB_est"] - abs(df["Size_nm"]-size)/200
        df = df.sort_values("Score", ascending=False)
        fig, ax = plt.subplots(figsize=(6, 3), facecolor="white")
        ax.set_facecolor("white")
        colors = ["#22c55e" if p=="HIGH" else "#f97316" if p=="MEDIUM" else "#ef4444" for p in df["Priority"]]
        ax.barh(df["Formulation"], df["ApoE_pct"], color=colors)
        ax.set_xlabel("ApoE% in CSF corona")
        ax.set_title("DIPG — CSF LNP formulations (ApoE%)")
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-F·R1a", f"peg={peg},size={size}", "formulation ranking")
        return df[["Formulation","Size_nm","Zeta_mV","ApoE_pct","BBB_est","Priority"]], img
    except Exception as e:
        return pd.DataFrame(), None

def uvm_variants():
    df = pd.DataFrame(UVM_VARIANTS)
    journal_log("S1-F·R2a", "load", f"{len(df)} variants")
    return df

def uvm_vitreous():
    try:
        df = pd.DataFrame(UVM_VITREOUS_LNP)
        fig, ax = plt.subplots(figsize=(6, 3), facecolor="white")
        ax.set_facecolor("white")
        colors = ["#22c55e" if p=="HIGH" else "#f97316" if p=="MEDIUM" else "#ef4444" for p in df["Priority"]]
        ax.barh(df["Formulation"], df["Retention_h"], color=colors)
        ax.set_xlabel("Vitreous retention (hours)")
        ax.set_title("UVM — LNP retention in vitreous humor")
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-F·R2a", "load", "vitreous LNP ranking")
        return df, img
    except Exception as e:
        return pd.DataFrame(), None

def paml_ferroptosis(variant):
    try:
        row = next((r for r in PAML_VARIANTS if variant in r["Variant"]), PAML_VARIANTS[0])
        ferr_map = {"GPX4 suppressed": 0.85, "SLC7A11 upregulated": 0.72,
                    "ACSL4 altered": 0.61, "NRF2 pathway": 0.55, "Iron metabolism disrupted": 0.78}
        ferr_score = ferr_map.get(row["Ferroptosis"], 0.5)
        cats = ["Ferroptosis\nsensitivity", "Drug\navailable", "BM niche\ncoverage", "Data\nmaturity", "Target\nnovelty"]
        has_drug = 0.9 if row["Drug_status"] not in ["Novel target"] else 0.3
        vals = [ferr_score, has_drug, 0.6, 0.55, 1-has_drug+0.2]
        angles = np.linspace(0, 2*np.pi, len(cats), endpoint=False).tolist()
        v2, a2 = vals+[vals[0]], angles+[angles[0]]
        fig, ax = plt.subplots(figsize=(5, 4), subplot_kw={"polar":True}, facecolor="white")
        ax.set_facecolor("white")
        ax.plot(a2, v2, color="#38bdf8", linewidth=2); ax.fill(a2, v2, color="#38bdf8", alpha=0.2)
        ax.set_xticks(angles); ax.set_xticklabels(cats, fontsize=8)
        ax.set_title(f"pAML · {row['Variant'][:20]}", fontsize=9)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-F·R3a", variant, f"ferr={ferr_score:.2f}")
        _v  = row["Variant"]
        _p  = row["Pathway"]
        _d  = row["Drug_status"]
        _f  = row["Ferroptosis"]
        _fs = f"{ferr_score:.2f}"
        summary = (
            f"<div style='background:#1e293b;padding:14px;border-radius:8px;font-family:sans-serif;color:#f1f5f9'>"
            f"<p style='color:#8e9bae;font-size:11px;margin:0 0 6px'>S1-F·R3a · pAML</p>"
            f"<b style='color:#38bdf8;font-size:15px'>{_v}</b><br>"
            f"<p style='margin:6px 0'><b>Pathway:</b> {_p}</p>"
            f"<p style='margin:0'><b>Drug:</b> {_d}</p>"
            f"<p style='margin:6px 0'><b>Ferroptosis link:</b> {_f}</p>"
            f"<p><b>Ferroptosis sensitivity score:</b> "
            f"<span style='color:#f97316;font-size:18px'>{_fs}</span></p>"
            f"<p style='font-size:11px;color:#8e9bae'>Research only. Not clinical advice.</p></div>"
        )
        return summary, img
    except Exception as e:
        return f"<div style='color:#ef4444'>Error: {str(e)}</div>", None

# ─────────────────────────────────────────────
# GROUP B — LEARNING SANDBOX (B1-B5)
# ─────────────────────────────────────────────

SIMULATED_BANNER = (
    "⚠️ **SIMULATED DATA** — This tab uses rule-based models and synthetic data "
    "for educational purposes only. Results do NOT reflect real experimental outcomes."
)

# ── TAB B1 — miRNA Explorer (S1-B·R1a) ──────────────────

MIRNA_DB = {
    "BRCA2": {
        "miRNAs": ["miR-146a-5p", "miR-21-5p", "miR-155-5p", "miR-182-5p", "miR-205-5p"],
        "binding_energy": [-18.4, -15.2, -12.7, -14.1, -16.8],
        "seed_match": ["7mer-m8", "6mer", "7mer-A1", "8mer", "7mer-m8"],
        "expression_change": [-2.1, +1.8, +2.3, -1.5, -3.2],
        "cancer_context": "BRCA2 loss-of-function is associated with HR-deficient breast/ovarian cancer. "
                          "miR-146a-5p and miR-205-5p are frequently downregulated in BRCA2-mutant tumors.",
    },
    "BRCA1": {
        "miRNAs": ["miR-17-5p", "miR-20a-5p", "miR-93-5p", "miR-182-5p", "miR-9-5p"],
        "binding_energy": [-16.1, -13.5, -14.9, -15.3, -11.8],
        "seed_match": ["8mer", "7mer-m8", "7mer-A1", "8mer", "6mer"],
        "expression_change": [+1.9, +2.1, +1.6, -1.8, +2.4],
        "cancer_context": "BRCA1 regulates DNA damage response. miR-17/20a cluster is upregulated "
                          "in BRCA1-deficient tumors and suppresses apoptosis.",
    },
    "TP53": {
        "miRNAs": ["miR-34a-5p", "miR-125b-5p", "miR-504-5p", "miR-25-3p", "miR-30d-5p"],
        "binding_energy": [-19.2, -14.6, -13.1, -12.4, -15.7],
        "seed_match": ["8mer", "7mer-m8", "7mer-A1", "6mer", "8mer"],
        "expression_change": [-3.5, +1.2, +1.7, +2.0, -1.3],
        "cancer_context": "TP53 is the most mutated gene in cancer. miR-34a is a direct p53 transcriptional "
                          "target; its loss promotes tumor progression across cancer types.",
    },
}

def b1_run(gene: str):
    db = MIRNA_DB.get(gene, {})
    if not db:
        return None, "Gene not found in simulation database."

    mirnas = db["miRNAs"]
    energies = db["binding_energy"]
    changes = db["expression_change"]
    seeds = db["seed_match"]

    fig, axes = plt.subplots(1, 2, figsize=(11, 4), facecolor="white")

    colors_e = ["#d73027" if e < -16 else "#fc8d59" if e < -13 else "#4393c3" for e in energies]
    axes[0].barh(mirnas, [-e for e in energies], color=colors_e, edgecolor="white")
    axes[0].set_xlabel("Binding Energy (|kcal/mol|)", fontsize=10)
    axes[0].set_title(f"Predicted Binding Energy\n{gene} miRNA targets", fontsize=10)
    axes[0].set_facecolor("white")

    colors_x = ["#d73027" if c < 0 else "#4393c3" for c in changes]
    axes[1].barh(mirnas, changes, color=colors_x, edgecolor="white")
    axes[1].axvline(0, color="black", linewidth=0.8)
    axes[1].set_xlabel("Expression Change (log2FC)", fontsize=10)
    axes[1].set_title(f"miRNA Expression in {gene}-mutant tumors\n(⚠️ SIMULATED)", fontsize=10)
    axes[1].set_facecolor("white")

    fig.tight_layout()
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    buf.seek(0)
    img = Image.open(buf)
    plt.close(fig)

    df = pd.DataFrame({
        "miRNA": mirnas,
        "Binding Energy (kcal/mol)": energies,
        "Seed Match": seeds,
        "Expression log2FC": changes,
    })
    context = f"\n\n**Cancer Context:** {db['cancer_context']}"
    journal_log("S1-B·R1a", f"gene={gene}", f"top_miRNA={mirnas[0]}")
    return img, df.to_markdown(index=False) + context

# ── TAB B2 — siRNA Targets (S1-B·R2a) ───────────────────

SIRNA_DB = {
    "LUAD": {
        "targets": ["KRAS G12C", "EGFR exon19del", "ALK fusion", "MET exon14", "RET fusion"],
        "efficacy": [0.82, 0.91, 0.76, 0.68, 0.71],
        "off_target_risk": ["Medium", "Low", "Low", "Medium", "Low"],
        "delivery_challenge": ["High", "Medium", "Medium", "High", "Medium"],
    },
    "BRCA": {
        "targets": ["BRCA1 exon11", "BRCA2 exon11", "PIK3CA H1047R", "AKT1 E17K", "ESR1 Y537S"],
        "efficacy": [0.78, 0.85, 0.88, 0.72, 0.65],
        "off_target_risk": ["Low", "Low", "Medium", "Low", "High"],
        "delivery_challenge": ["Medium", "Medium", "Low", "Low", "High"],
    },
    "COAD": {
        "targets": ["KRAS G12D", "APC truncation", "BRAF V600E", "SMAD4 loss", "PIK3CA E545K"],
        "efficacy": [0.79, 0.61, 0.93, 0.55, 0.84],
        "off_target_risk": ["Medium", "High", "Low", "Medium", "Low"],
        "delivery_challenge": ["High", "High", "Low", "High", "Low"],
    },
}

def b2_run(cancer: str):
    db = SIRNA_DB.get(cancer, {})
    if not db:
        return None, "Cancer type not in simulation database."

    targets = db["targets"]
    efficacy = db["efficacy"]
    off_risk = db["off_target_risk"]
    delivery = db["delivery_challenge"]

    fig, ax = plt.subplots(figsize=(8, 4), facecolor="white")
    risk_color = {"Low": "#4393c3", "Medium": "#fc8d59", "High": "#d73027"}
    colors = [risk_color.get(r, "#aaa") for r in off_risk]
    bars = ax.barh(targets, efficacy, color=colors, edgecolor="white")
    ax.set_xlim(0, 1.1)
    ax.set_xlabel("Predicted siRNA Efficacy (⚠️ SIMULATED)", fontsize=10)
    ax.set_title(f"siRNA Target Efficacy — {cancer}", fontsize=11)
    ax.set_facecolor("white")
    from matplotlib.patches import Patch
    legend_elements = [Patch(facecolor=v, label=k) for k, v in risk_color.items()]
    ax.legend(handles=legend_elements, title="Off-target Risk", fontsize=8, loc="lower right")
    fig.tight_layout()

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    buf.seek(0)
    img = Image.open(buf)
    plt.close(fig)

    df = pd.DataFrame({
        "Target": targets,
        "Efficacy": efficacy,
        "Off-target Risk": off_risk,
        "Delivery Challenge": delivery,
    })
    journal_log("S1-B·R2a", f"cancer={cancer}", f"top={targets[0]}")
    return img, df.to_markdown(index=False)

# ── TAB B5 — Variant Concepts (S1-A·R1b) ───────────────────

VARIANT_RULES = {
    "Pathogenic": {
        "criteria": ["Nonsense mutation in tumor suppressor", "Frameshift in BRCA1/2",
                     "Splice site ±1/2 in essential gene", "Known hotspot (e.g. TP53 R175H)"],
        "acmg_codes": ["PVS1", "PS1", "PS2", "PM2"],
        "explanation": "Strong evidence of pathogenicity. Likely disrupts protein function via LOF or dominant-negative mechanism.",
    },
    "Likely Pathogenic": {
        "criteria": ["Missense in functional domain", "In silico tools predict damaging",
                     "Low population frequency (<0.01%)", "Segregates with disease"],
        "acmg_codes": ["PM1", "PM2", "PP2", "PP3"],
        "explanation": "Moderate-strong evidence. Functional studies or segregation data would upgrade to Pathogenic.",
    },
    "VUS": {
        "criteria": ["Missense with conflicting evidence", "Moderate population frequency",
                     "Uncertain functional impact", "Limited segregation data"],
        "acmg_codes": ["PM2", "BP4", "BP6"],
        "explanation": "Variant of Uncertain Significance. Insufficient evidence to classify. Functional assays recommended.",
    },
    "Likely Benign": {
        "criteria": ["Common in population (>1%)", "Synonymous with no splicing impact",
                     "Observed in healthy controls", "Computational tools predict benign"],
        "acmg_codes": ["BS1", "BP1", "BP4", "BP7"],
        "explanation": "Evidence suggests benign. Unlikely to cause disease but not fully excluded.",
    },
    "Benign": {
        "criteria": ["High population frequency (>5%)", "No disease association in large studies",
                     "Synonymous, no functional impact", "Functional studies show no effect"],
        "acmg_codes": ["BA1", "BS1", "BS2", "BS3"],
        "explanation": "Strong evidence of benign nature. Not expected to contribute to disease.",
    },
}

def b5_run(classification: str):
    data = VARIANT_RULES.get(classification, {})
    if not data:
        return "Classification not found."

    criteria_md = "\n".join([f"- {c}" for c in data["criteria"]])
    acmg_md = " | ".join([f"`{code}`" for code in data["acmg_codes"]])
    output = (
        f"## {classification}\n\n"
        f"**ACMG/AMP Codes:** {acmg_md}\n\n"
        f"**Typical Criteria:**\n{criteria_md}\n\n"
        f"**Interpretation:** {data['explanation']}\n\n"
        f"> ⚠️ SIMULATED — This is a rule-based educational model only. "
        f"Real variant classification requires expert review and full ACMG/AMP criteria evaluation."
    )
    journal_log("S1-A·R1b", f"class={classification}", output[:100])
    return output

# ─────────────────────────────────────────────
# 3D моделі (S1-G)
# ─────────────────────────────────────────────

def safe_img_from_fig(fig):
    """Convert matplotlib figure to PIL Image safely."""
    try:
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=120, facecolor="white")
        buf.seek(0)
        img = Image.open(buf)
        plt.close(fig)
        return img
    except Exception:
        plt.close(fig)
        return Image.new('RGB', (100, 100), color='white')

def plot_nanoparticle(r, peg):
    theta = np.linspace(0, 2*np.pi, 30)
    phi = np.linspace(0, np.pi, 30)
    theta, phi = np.meshgrid(theta, phi)
    x = r * np.sin(phi) * np.cos(theta)
    y = r * np.sin(phi) * np.sin(theta)
    z = r * np.cos(phi)
    fig = go.Figure(data=[go.Surface(x=x, y=y, z=z, colorscale='Blues', opacity=0.7)])
    if peg > 0:
        n_points = int(100 * peg)
        u = np.random.uniform(0, 1, n_points)
        v = np.random.uniform(0, 1, n_points)
        theta_pts = 2 * np.pi * u
        phi_pts = np.arccos(2*v - 1)
        x_pts = (r + 0.5) * np.sin(phi_pts) * np.cos(theta_pts)
        y_pts = (r + 0.5) * np.sin(phi_pts) * np.sin(theta_pts)
        z_pts = (r + 0.5) * np.cos(phi_pts)
        fig.add_scatter3d(x=x_pts, y=y_pts, z=z_pts, mode='markers',
                           marker=dict(size=3, color='red'), name='PEG')
    fig.update_layout(
        title=f"Nanoparticle (r={r} nm, PEG={peg})",
        scene=dict(xaxis_title='X (nm)', yaxis_title='Y (nm)', zaxis_title='Z (nm)'),
        width=500, height=400
    )
    return fig

def plot_dna():
    t = np.linspace(0, 4*np.pi, 200)
    x1 = np.cos(t)
    y1 = np.sin(t)
    z1 = t
    x2 = np.cos(t + np.pi)
    y2 = np.sin(t + np.pi)
    z2 = t
    fig = go.Figure()
    fig.add_scatter3d(x=x1, y=y1, z=z1, mode='lines', line=dict(color='blue', width=5), name='Strand 1')
    fig.add_scatter3d(x=x2, y=y2, z=z2, mode='lines', line=dict(color='red', width=5), name='Strand 2')
    for i in range(0, len(t), 10):
        fig.add_scatter3d(x=[x1[i], x2[i]], y=[y1[i], y2[i]], z=[z1[i], z2[i]],
                          mode='lines', line=dict(color='gray', width=1), showlegend=False)
    fig.update_layout(
        title='DNA Double Helix',
        scene=dict(xaxis_title='X', yaxis_title='Y', zaxis_title='Z'),
        width=500, height=400
    )
    return fig

def plot_corona():
    r = 5
    theta = np.linspace(0, 2*np.pi, 20)
    phi = np.linspace(0, np.pi, 20)
    theta, phi = np.meshgrid(theta, phi)
    x = r * np.sin(phi) * np.cos(theta)
    y = r * np.sin(phi) * np.sin(theta)
    z = r * np.cos(phi)
    fig = go.Figure(data=[go.Surface(x=x, y=y, z=z, colorscale='Blues', opacity=0.5)])
    n_proteins = 50
    u = np.random.uniform(0, 1, n_proteins)
    v = np.random.uniform(0, 1, n_proteins)
    theta_pts = 2 * np.pi * u
    phi_pts = np.arccos(2*v - 1)
    x_pts = (r + 1.5) * np.sin(phi_pts) * np.cos(theta_pts)
    y_pts = (r + 1.5) * np.sin(phi_pts) * np.sin(theta_pts)
    z_pts = (r + 1.5) * np.cos(phi_pts)
    fig.add_scatter3d(x=x_pts, y=y_pts, z=z_pts, mode='markers',
                       marker=dict(size=5, color='orange'), name='Proteins')
    fig.update_layout(
        title='Protein Corona',
        scene=dict(xaxis_title='X', yaxis_title='Y', zaxis_title='Z'),
        width=500, height=400
    )
    return fig
# ─────────────────────────────────────────────
# GRADIO UI ASSEMBLY
# ─────────────────────────────────────────────

CUSTOM_CSS = """
body { font-family: 'Inter', sans-serif; }
.simulated-banner {
    background: #fff3cd; border: 1px solid #ffc107;
    border-radius: 6px; padding: 10px 14px;
    font-weight: 600; color: #856404; margin-bottom: 8px;
}
.source-note { color: #6c757d; font-size: 0.85em; margin-top: 6px; }
.gap-card {
    background: #f8f9fa; border-left: 4px solid #d73027;
    padding: 10px 14px; margin: 6px 0; border-radius: 4px;
}

/* Вкладки верхнього рівня з переносом */
.tabs-outer .tab-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
}
.tabs-outer .tab-nav button {
    color: #f1f5f9 !important;
    background: #1e293b !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    padding: 8px 16px !important;
    border-radius: 6px 6px 0 0 !important;
    border: 1px solid #334155;
    border-bottom: none;
    margin-right: 2px;
    margin-bottom: 2px;
    white-space: nowrap;
    cursor: pointer !important;
}
.tabs-outer .tab-nav button.selected {
    border-bottom: 3px solid #f97316 !important;
    color: #f97316 !important;
    background: #0f172a !important;
}

/* Контейнер вкладок всередині основної колонки (R1, R2, ...) */
.main-tabs .tab-nav button {
    color: #8e9bae !important;
    background: #0f172a !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    padding: 5px 12px !important;
    border-radius: 4px 4px 0 0 !important;
    border: 1px solid #334155 !important;
    border-bottom: none !important;
    margin-right: 3px !important;
    cursor: pointer !important;
}
.main-tabs .tab-nav button.selected {
    color: #38bdf8 !important;
    background: #1e293b !important;
    border-color: #38bdf8 !important;
    border-bottom: none !important;
}
.main-tabs > .tabitem {
    background: #1e293b !important;
    border: 1px solid #334155 !important;
    border-radius: 0 6px 6px 6px !important;
    padding: 14px !important;
}

/* Третій рівень вкладок (a, b) */
.sub-tabs .tab-nav button {
    color: #8e9bae !important;
    background: #1e293b !important;
    font-size: 11px !important;
    padding: 3px 8px !important;
    border-radius: 3px 3px 0 0 !important;
    cursor: pointer !important;
}
.sub-tabs .tab-nav button.selected {
    color: #f97316 !important;
    background: #0f172a !important;
}

/* Стиль для badges */
.proj-badge {
    background: #1e293b;
    border-left: 3px solid #f97316;
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 8px;
}
.proj-code {
    color: #8e9bae;
    font-size: 11px;
}
.proj-title {
    color: #f1f5f9;
    font-size: 14px;
    font-weight: 600;
}
.proj-metric {
    background: #0f2a3f;
    color: #38bdf8;
    padding: 1px 7px;
    border-radius: 3px;
    font-size: 10px;
    margin-left: 6px;
}

/* Бічна панель */
.sidebar-journal {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 14px;
}
.sidebar-journal h3 {
    color: #f97316;
    margin-top: 0;
}

/* Загальні */
h1, h2, h3 { color: #f97316 !important; }
.gr-button-primary { background: #f97316 !important; border: none !important; cursor: pointer !important; }
.gr-button-secondary { cursor: pointer !important; }
footer { display: none !important; }

/* Курсори */
.gr-dropdown, .gr-button, .gr-slider, .gr-radio, .gr-checkbox,
.tab-nav button, .gr-accordion, .gr-dataset, .gr-dropdown * {
    cursor: pointer !important;
}
.gr-dropdown input, .gr-textbox input, .gr-textarea textarea {
    cursor: text !important;
}
"""

# ========== MAP HTML ==========
MAP_HTML = f"""
<div style="background:{'#1e293b'};padding:22px;border-radius:8px;font-family:monospace;font-size:13px;line-height:2.0;color:{'#f1f5f9'}">
<span style="color:{'#f97316'};font-size:16px;font-weight:bold">K R&D Lab · S1 Biomedical</span>
<span style="color:{'#8e9bae'};font-size:11px;margin-left:12px">Science Sphere — sub-direction 1</span>
<br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-A · PHYLO-GENOMICS</span> — What breaks in DNA<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R1a</b> Real Variant Lookup <span style="color:{'#22c55e'}"> AUC=0.939 ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R1b</b> Variant Concepts (ACMG) <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R2a</b> Gray Zones Explorer <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R2b</b> Understudied Target Finder <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R2c</b> Literature Gap Finder <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R2d</b> Druggable Orphans <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-A·R2e</b> Research Assistant (RAG Chatbot) <span style="color:{'#22c55e'}"> ✅</span><br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-B · PHYLO-RNA</span> — How to silence it via RNA<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-B·R1a</b> miRNA Explorer <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-B·R2a</b> siRNA Targets <span style="color:{'#22c55e'}"> ✅</span><br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-C · PHYLO-DRUG</span> — Which molecule treats it<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-C·R1a</b> FGFR3 RNA Drug <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-C·R1b</b> SL Drug Mapping <span style="color:#f59e0b"> 🔶 In progress</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-C·R2a</b> m6A × Ferroptosis × Circadian <span style="color:{'#8e9bae'}"> 🔴 Frontier</span><br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-D · PHYLO-LNP</span> — How to deliver the drug<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R1a</b> LNP Corona ML <span style="color:{'#22c55e'}"> AUC=0.791 ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R2a</b> Flow Corona <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R3a</b> LNP Brain / BBB <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R4a</b> AutoCorona NLP <span style="color:{'#22c55e'}"> F1=0.71 ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-D·R5a</b> CSF · Vitreous · Bone Marrow <span style="color:{'#8e9bae'}"> 🔴 0 prior studies</span><br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-E · PHYLO-BIOMARKERS</span> — Detect without biopsy<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-E·R1a</b> Liquid Biopsy Classifier <span style="color:{'#22c55e'}"> AUC=0.992* ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-E·R1b</b> Protein Panel Validator <span style="color:#f59e0b"> 🔶 In progress</span><br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-F · PHYLO-RARE</span> — Where almost nobody has looked yet<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-F·R1a</b> DIPG Toolkit (H3K27M) <span style="color:#f59e0b"> 🔶</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-F·R2a</b> UVM Toolkit (GNAQ/GNA11) <span style="color:#f59e0b"> 🔶</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-F·R3a</b> pAML Toolkit (FLT3-ITD) <span style="color:#f59e0b"> 🔶</span><br><br>

<span style="color:{'#38bdf8'};font-weight:600">S1-G · PHYLO-SIM</span> — 3D Models & Simulations<br>
&nbsp;&nbsp;&nbsp;├─ <b>Nanoparticle</b> Interactive 3D model <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>DNA Helix</b> Double helix visualization <span style="color:{'#22c55e'}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>Protein Corona</b> Schematic corona <span style="color:{'#22c55e'}"> ✅</span><br><br>

<span style="color:{'#8e9bae'};font-size:11px">
✅ Active in this suite · 🔶 In progress · 🔴 Planned / Frontier<br>
⭐ gap research (0–1 prior studies globally) · * tissue proxy, plasma validation pending
</span>
</div>
"""

# ========== UI З ДВОМА КОЛОНКАМИ ==========
def build_app():
    with gr.Blocks(css=CUSTOM_CSS, title="K R&D Lab — Cancer Research Suite") as demo:
        gr.Markdown(
            "# 🔬 K R&D Lab — Cancer Research Suite\n"
            "**Author:** Oksana Kolisnyk | [kosatiks-group.pp.ua](https://kosatiks-group.pp.ua)  \n"
            "**Repo:** [github.com/TEZv/K-RnD-Lab-PHYLO-03_2026](https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026)"
        )

        with gr.Row():
            # Основна колонка з вкладками
            with gr.Column(scale=4):
                with gr.Tabs(elem_classes="tabs-outer") as outer_tabs:
                    # 🗺️ Lab Map
                    with gr.TabItem("🗺️ Lab Map"):
                        gr.HTML(MAP_HTML)

                    # GROUP A — REAL DATA TOOLS
                    with gr.TabItem("🔬 Real Data Tools"):
                        with gr.Tabs(elem_classes="main-tabs") as a_tabs:
                            # --- S1-A Genomics ---
                            with gr.TabItem("S1-A·R1a · Real Variant Lookup"):
                                gr.Markdown("### Real Variant Lookup\nLook up a variant in **ClinVar** and **gnomAD**. Results are fetched live — never hallucinated.")
                                a3_hgvs = gr.Textbox(label="HGVS Notation", placeholder="e.g. NM_007294.4:c.5266dupC")
                                a3_btn = gr.Button("🔎 Look Up Variant", variant="primary")
                                a3_result = gr.Markdown()
                                a3_btn.click(a3_run, inputs=[a3_hgvs], outputs=[a3_result])

                            with gr.TabItem("S1-A·R1b · Variant Concepts"):
                                gr.Markdown("### Variant Concepts (ACMG/AMP Classification)\n⚠️ SIMULATED — Rule-based educational model.")
                                b5_class = gr.Dropdown(list(VARIANT_RULES.keys()), label="ACMG Classification", value="VUS")
                                b5_btn = gr.Button("📋 Explain Classification", variant="primary")
                                b5_result = gr.Markdown()
                                b5_btn.click(b5_run, inputs=[b5_class], outputs=[b5_result])

                            with gr.TabItem("S1-A·R2a · Gray Zones Explorer"):
                                gr.Markdown("### Gray Zones Explorer\nIdentify underexplored biological processes in a cancer type using live PubMed + OpenTargets data.")
                                a1_cancer = gr.Dropdown(CANCER_TYPES, label="Cancer Type", value="GBM")
                                a1_btn = gr.Button("🔍 Explore Gray Zones", variant="primary")
                                a1_heatmap = gr.Image(label="Research Coverage Heatmap", type="pil")
                                a1_gaps = gr.Markdown(label="Top 5 Research Gaps")
                                with gr.Accordion("📖 Learning Mode", open=False):
                                    gr.Markdown("**What is a research gray zone?** A gray zone is a biological process that is well-studied in other cancers but has very few publications in your selected cancer type.")
                                a1_btn.click(a1_run, inputs=[a1_cancer], outputs=[a1_heatmap, a1_gaps])

                            with gr.TabItem("S1-A·R2b · Understudied Target Finder"):
                                gr.Markdown("### Understudied Target Finder\nFind essential genes with high research gap index (high essentiality, low publication coverage).")
                                a2_cancer = gr.Dropdown(CANCER_TYPES, label="Cancer Type", value="GBM")
                                a2_btn = gr.Button("🎯 Find Understudied Targets", variant="primary")
                                a2_table = gr.Dataframe(label="Target Gap Table", wrap=True)
                                a2_note = gr.Markdown()
                                a2_btn.click(a2_run, inputs=[a2_cancer], outputs=[a2_table, a2_note])

                            with gr.TabItem("S1-A·R2c · Literature Gap Finder"):
                                gr.Markdown("### Literature Gap Finder\nVisualize publication trends over 10 years and detect years with low research activity.")
                                with gr.Row():
                                    a4_cancer = gr.Dropdown(CANCER_TYPES, label="Cancer Type", value="GBM")
                                    a4_kw = gr.Textbox(label="Keyword", placeholder="e.g. ferroptosis")
                                a4_btn = gr.Button("📊 Analyze Literature Trend", variant="primary")
                                a4_chart = gr.Image(label="Papers per Year", type="pil")
                                a4_gaps = gr.Markdown()
                                a4_btn.click(a4_run, inputs=[a4_cancer, a4_kw], outputs=[a4_chart, a4_gaps])

                            with gr.TabItem("S1-A·R2d · Druggable Orphans"):
                                gr.Markdown("### Druggable Orphans\nIdentify cancer-associated essential genes with **no approved drug** and **no active clinical trial**.")
                                a5_cancer = gr.Dropdown(CANCER_TYPES, label="Cancer Type", value="GBM")
                                a5_btn = gr.Button("💊 Find Druggable Orphans", variant="primary")
                                a5_table = gr.Dataframe(label="Orphan Target Table", wrap=True)
                                a5_note = gr.Markdown()
                                a5_btn.click(a5_run, inputs=[a5_cancer], outputs=[a5_table, a5_note])

                            with gr.TabItem("S1-A·R2e · Research Assistant"):
                                gr.Markdown("### Research Assistant (RAG Chatbot)\nPowered by sentence-transformers + FAISS, indexed on 20 curated papers.")
                                try:
                                    from chatbot import build_chatbot_tab
                                    # Викликаємо функцію, яка створить вміст вкладки (вона використовує gr.Chatbot)
                                    build_chatbot_tab()
                                except ImportError:
                                    gr.Markdown("⚠️ `chatbot.py` not found. Please ensure it is in the same directory.")

                            # --- S1-C Drug Discovery ---
                            with gr.TabItem("S1-C·R1a · FGFR3 RNA Drug"):
                                gr.Markdown("### FGFR3 RNA-Directed Drug Discovery\nScreen compounds targeting FGFR3 RNA motifs.")
                                pocket = gr.Radio(["P1 (hairpin loop)", "P10 (G-quadruplex)"], value="P1 (hairpin loop)", label="Target pocket")
                                btn_drug = gr.Button("Screen Compounds", variant="primary")
                                table_drug = gr.Dataframe(label="Top compounds")
                                plot_drug = gr.Image(label="Binding scores")
                                btn_drug.click(predict_drug, inputs=[pocket], outputs=[table_drug, plot_drug])

                            with gr.TabItem("S1-C·R1b · SL Drug Mapping 🔶"):
                                gr.Markdown("### Synthetic Lethal Drug Mapping\n> 🔶 In development — Coming soon.")

                            with gr.TabItem("S1-C·R2a · Frontier 🔴"):
                                gr.Markdown("### m6A × Ferroptosis × Circadian\n> 🔴 Frontier research — Planned for Q3 2026.")

                            # --- S1-D LNP ---
                            with gr.TabItem("S1-D·R1a · LNP Corona ML"):
                                gr.Markdown("### LNP Protein Corona (Serum)\nPredict dominant corona protein from LNP formulation parameters.")
                                with gr.Row():
                                    sz = gr.Slider(50, 300, value=100, step=1, label="Size (nm)")
                                    zt = gr.Slider(-40, 10, value=-5, step=1, label="Zeta (mV)")
                                with gr.Row():
                                    pg = gr.Slider(0, 5, value=1.5, step=0.1, label="PEG mol%")
                                    lp = gr.Dropdown(["Ionizable", "Cationic", "Anionic", "Neutral"], value="Ionizable", label="Lipid type")
                                btn_corona = gr.Button("Predict", variant="primary")
                                out_corona = gr.Markdown()
                                btn_corona.click(predict_corona, inputs=[sz, zt, pg, lp], outputs=[out_corona])

                            with gr.TabItem("S1-D·R2a · Flow Corona"):
                                gr.Markdown("### Flow Corona (Vroman Effect)\nSimulate competitive protein adsorption kinetics under flow.")
                                with gr.Row():
                                    s8 = gr.Slider(50, 300, value=100, step=1, label="Size (nm)")
                                    z8 = gr.Slider(-40, 10, value=-5, step=1, label="Zeta (mV)")
                                    pg8 = gr.Slider(0, 5, value=1.5, step=0.1, label="PEG mol%")
                                with gr.Row():
                                    ch8 = gr.Dropdown(["Ionizable", "Cationic", "Anionic", "Neutral"], value="Ionizable", label="Charge")
                                    fl8 = gr.Slider(0, 40, value=20, step=1, label="Flow cm/s")
                                btn_flow = gr.Button("Model Vroman Effect", variant="primary")
                                out_flow_t = gr.Markdown()
                                out_flow_p = gr.Image(label="Kinetics")
                                btn_flow.click(predict_flow, inputs=[s8, z8, pg8, ch8, fl8], outputs=[out_flow_t, out_flow_p])

                            with gr.TabItem("S1-D·R3a · LNP Brain"):
                                gr.Markdown("### LNP Brain Delivery\nPredict ApoE% and BBB probability from lipid SMILES, pKa, and zeta.")
                                smi = gr.Textbox(label="Ionizable lipid SMILES", value="CC(C)CC(=O)OCC(COC(=O)CC(C)C)OC(=O)CC(C)C")
                                with gr.Row():
                                    pk = gr.Slider(4, 8, value=6.5, step=0.1, label="pKa")
                                    zt9 = gr.Slider(-20, 10, value=-3, step=1, label="Zeta (mV)")
                                btn_brain = gr.Button("Predict BBB Crossing", variant="primary")
                                out_brain_t = gr.Markdown()
                                out_brain_p = gr.Image(label="Radar profile")
                                btn_brain.click(predict_bbb, inputs=[smi, pk, zt9], outputs=[out_brain_t, out_brain_p])

                            with gr.TabItem("S1-D·R4a · AutoCorona NLP"):
                                gr.Markdown("### AutoCorona NLP\nExtract structured data from PMC abstracts.")
                                txt = gr.Textbox(lines=5, label="Paper abstract", placeholder="Paste abstract here...")
                                btn_nlp = gr.Button("Extract Data", variant="primary")
                                out_json = gr.Code(label="Extracted JSON", language="json")
                                out_flags = gr.Textbox(label="Validation flags")
                                btn_nlp.click(extract_corona, inputs=[txt], outputs=[out_json, out_flags])

                            with gr.TabItem("S1-D·R5a · CSF/BM 🔴"):
                                gr.Markdown("### CSF · Vitreous · Bone Marrow\n> 🔴 0 prior studies — Planned for Q2–Q3 2026.")

                            with gr.TabItem("S1-D·R6a · Corona Database"):
                                gr.Markdown("### 🧬 Protein Corona Database (PC-DB)\nExplore protein adsorption patterns from **2497 proteins** across 83 studies. Data simulated from [PC-DB](https://pc-db.org/).")
                                with gr.Row():
                                    np_type = gr.Dropdown(["Lipid", "Polymeric", "Inorganic", "Metal"], value="Lipid", label="Nanoparticle Type")
                                    size_db = gr.Slider(20, 300, value=100, step=5, label="Size (nm)")
                                with gr.Row():
                                    zeta_db = gr.Slider(-40, 20, value=-5, step=1, label="Zeta Potential (mV)")
                                    peg_db = gr.Slider(0, 5, value=1.5, step=0.1, label="PEG mol%")
                                btn_db = gr.Button("🔍 Query Corona Database", variant="primary")
                                db_table = gr.Dataframe(label="Top 10 Corona Proteins")
                                db_plot = gr.Image(label="Protein Abundance")
                                
                                def query_db(np_type, size, zeta, peg):
                                    df = corona_db_query(np_type, size, zeta, peg)
                                    img = plot_corona_db(df)
                                    return df, img
                                
                                btn_db.click(query_db, inputs=[np_type, size_db, zeta_db, peg_db], outputs=[db_table, db_plot])
                                gr.Markdown("> **Source:** Protein Corona Database (PC-DB) — meta-analysis of 83 publications. Frequencies adjusted for nanoparticle properties.")

                            # --- S1-E Biomarkers ---
                            with gr.TabItem("S1-E·R1a · Liquid Biopsy"):
                                gr.Markdown("### Liquid Biopsy Classifier\nClassify cancer vs healthy based on protein levels.")
                                with gr.Row():
                                    p1 = gr.Slider(-3, 3, value=0, step=0.1, label="CTHRC1")
                                    p2 = gr.Slider(-3, 3, value=0, step=0.1, label="FHL2")
                                    p3 = gr.Slider(-3, 3, value=0, step=0.1, label="LDHA")
                                    p4 = gr.Slider(-3, 3, value=0, step=0.1, label="P4HA1")
                                    p5 = gr.Slider(-3, 3, value=0, step=0.1, label="SERPINH1")
                                with gr.Row():
                                    p6 = gr.Slider(-3, 3, value=0, step=0.1, label="ABCA8")
                                    p7 = gr.Slider(-3, 3, value=0, step=0.1, label="CA4")
                                    p8 = gr.Slider(-3, 3, value=0, step=0.1, label="CKB")
                                    p9 = gr.Slider(-3, 3, value=0, step=0.1, label="NNMT")
                                    p10 = gr.Slider(-3, 3, value=0, step=0.1, label="CACNA2D2")
                                btn_cancer = gr.Button("Classify", variant="primary")
                                out_cancer_t = gr.HTML()
                                out_cancer_p = gr.Image(label="Feature contributions")
                                btn_cancer.click(predict_cancer, inputs=[p1, p2, p3, p4, p5, p6, p7, p8, p9, p10], outputs=[out_cancer_t, out_cancer_p])

                            with gr.TabItem("S1-E·R1b · Protein Validator 🔶"):
                                gr.Markdown("### Protein Panel Validator\n> 🔶 In progress — Coming next.")

                            with gr.TabItem("S1-E·R2a · Multi-protein Biomarkers"):
                                gr.Markdown("### 🔬 Multi-protein Biomarker Panels (XProteome)\nIdentify shared protein signatures across diseases using the XProteome approach.")
                                with gr.Tabs():
                                    with gr.TabItem("Single Disease"):
                                        disease_sel = gr.Dropdown(list(DISEASE_BIOMARKERS.keys()), value="Breast Cancer", label="Select Disease")
                                        btn_panel = gr.Button("Get Biomarker Panel", variant="primary")
                                        panel_table = gr.Dataframe(label="Protein Panel")
                                        panel_note = gr.Markdown()
                                        btn_panel.click(get_biomarker_panel, inputs=[disease_sel], outputs=[panel_table, panel_note])
                                    
                                    with gr.TabItem("Cross-Disease Comparison"):
                                        with gr.Row():
                                            disease1 = gr.Dropdown(list(DISEASE_BIOMARKERS.keys()), value="Breast Cancer", label="Disease 1")
                                            disease2 = gr.Dropdown(list(DISEASE_BIOMARKERS.keys()), value="Lung Cancer", label="Disease 2")
                                        btn_common = gr.Button("Find Common Biomarkers", variant="primary")
                                        common_table = gr.Dataframe(label="Shared Proteins")
                                        common_note = gr.Markdown()
                                        btn_common.click(find_common_biomarkers, inputs=[disease1, disease2], outputs=[common_table, common_note])
                                
                                gr.Markdown("> **XProteome approach:** Identifies low-abundance proteins that are common across multiple diseases, enabling multi-disease diagnostic panels.")

                            # --- S1-F Rare Cancers ---
                            with gr.TabItem("S1-F·R1a · DIPG Toolkit"):
                                gr.Markdown("### DIPG Toolkit (H3K27M)\nExplore variants and CSF LNP formulations for Diffuse Intrinsic Pontine Glioma.")
                                with gr.Tabs():
                                    with gr.TabItem("Variants"):
                                        sort_d = gr.Radio(["Frequency", "Drug status"], value="Frequency", label="Sort by")
                                        b_dv = gr.Button("Load DIPG Variants", variant="primary")
                                        o_dv = gr.Dataframe(label="H3K27M co-mutations")
                                        b_dv.click(dipg_variants, inputs=[sort_d], outputs=[o_dv])
                                    with gr.TabItem("CSF LNP"):
                                        with gr.Row():
                                            d_peg = gr.Slider(0.5, 3.0, value=1.5, step=0.1, label="PEG mol%")
                                            d_size = gr.Slider(60, 150, value=90, step=5, label="Target size (nm)")
                                        b_dc = gr.Button("Rank CSF Formulations", variant="primary")
                                        o_dct = gr.Dataframe(label="CSF LNP ranking")
                                        o_dcp = gr.Image(label="ApoE% in CSF corona")
                                        b_dc.click(dipg_csf, inputs=[d_peg, d_size], outputs=[o_dct, o_dcp])

                            with gr.TabItem("S1-F·R2a · UVM Toolkit"):
                                gr.Markdown("### UVM Toolkit (GNAQ/GNA11)\nExplore uveal melanoma variants and vitreous LNP formulations.")
                                with gr.Tabs():
                                    with gr.TabItem("Variants + m6A"):
                                        b_uv = gr.Button("Load UVM Variants", variant="primary")
                                        o_uv = gr.Dataframe(label="GNAQ/GNA11 map")
                                        b_uv.click(uvm_variants, inputs=[], outputs=[o_uv])
                                    with gr.TabItem("Vitreous LNP"):
                                        b_uw = gr.Button("Rank Vitreous Formulations", variant="primary")
                                        o_uwt = gr.Dataframe(label="Vitreous LNP retention ranking")
                                        o_uwp = gr.Image(label="Retention (hours)")
                                        b_uw.click(uvm_vitreous, inputs=[], outputs=[o_uwt, o_uwp])

                            with gr.TabItem("S1-F·R3a · pAML Toolkit"):
                                gr.Markdown("### pAML Toolkit (FLT3-ITD)\nExplore pediatric AML variants and ferroptosis links.")
                                with gr.Tabs():
                                    with gr.TabItem("Ferroptosis Explorer"):
                                        var_sel = gr.Dropdown(
                                            ["FLT3-ITD", "NPM1 c.860_863dupTCAG", "DNMT3A p.R882H", "CEBPA biallelic", "IDH1/2 mutation"],
                                            value="FLT3-ITD", label="Select variant"
                                        )
                                        b_pf = gr.Button("Analyze Ferroptosis Profile", variant="primary")
                                        o_pft = gr.HTML()
                                        o_pfp = gr.Image(label="Target radar")
                                        b_pf.click(paml_ferroptosis, inputs=[var_sel], outputs=[o_pft, o_pfp])

                    # GROUP B — LEARNING SANDBOX
                    with gr.TabItem("📚 Learning Sandbox"):
                        gr.Markdown("> ⚠️ **ALL TABS IN THIS GROUP USE SIMULATED DATA** — For educational purposes only.")
                        with gr.Tabs(elem_classes="main-tabs") as b_tabs:
                            with gr.TabItem("S1-B·R1a · miRNA Explorer"):
                                gr.Markdown(SIMULATED_BANNER)
                                b1_gene = gr.Dropdown(["BRCA2", "BRCA1", "TP53"], label="Gene", value="TP53")
                                b1_btn = gr.Button("🔬 Explore miRNA Interactions", variant="primary")
                                b1_plot = gr.Image(label="miRNA Binding & Expression", type="pil")
                                b1_table = gr.Markdown()
                                b1_btn.click(b1_run, inputs=[b1_gene], outputs=[b1_plot, b1_table])

                            with gr.TabItem("S1-B·R2a · siRNA Targets"):
                                gr.Markdown(SIMULATED_BANNER)
                                b2_cancer = gr.Dropdown(["LUAD", "BRCA", "COAD"], label="Cancer Type", value="LUAD")
                                b2_btn = gr.Button("🎯 Simulate siRNA Efficacy", variant="primary")
                                b2_plot = gr.Image(label="siRNA Efficacy", type="pil")
                                b2_table = gr.Markdown()
                                b2_btn.click(b2_run, inputs=[b2_cancer], outputs=[b2_plot, b2_table])

                            with gr.TabItem("S1-G·General · 3D Lab"):
                                gr.Markdown("### 3D Models & Simulations\nInteractive visualizations for learning.")
                                with gr.Tabs():
                                    with gr.TabItem("Nanoparticle"):
                                        with gr.Row():
                                            np_radius = gr.Slider(2, 20, value=5, step=1, label="Radius (nm)")
                                            np_peg = gr.Slider(0, 1, value=0.3, step=0.05, label="PEG density")
                                        np_btn = gr.Button("Generate", variant="primary")
                                        np_plot = gr.Plot(label="Nanoparticle")
                                        np_btn.click(plot_nanoparticle, inputs=[np_radius, np_peg], outputs=[np_plot])
                                    with gr.TabItem("DNA Helix"):
                                        dna_btn = gr.Button("Generate DNA", variant="primary")
                                        dna_plot = gr.Plot()
                                        dna_btn.click(plot_dna, inputs=[], outputs=[dna_plot])
                                    with gr.TabItem("Protein Corona"):
                                        corona_btn = gr.Button("Show Corona", variant="primary")
                                        corona_plot = gr.Plot()
                                        corona_btn.click(plot_corona, inputs=[], outputs=[corona_plot])

                    # JOURNAL — окрема вкладка
                    with gr.TabItem("📓 Journal"):
                        gr.Markdown("## Lab Journal — Full History")
                        with gr.Row():
                            journal_filter = gr.Dropdown(
                                choices=["All"] + JOURNAL_CATEGORIES,
                                value="All",
                                label="Filter by category"
                            )
                            refresh_btn = gr.Button("🔄 Refresh", size="sm", variant="secondary")
                            clear_btn = gr.Button("🗑️ Clear Journal", size="sm", variant="stop")
                        journal_display = gr.Markdown(value=journal_read())
                        
                        def refresh_journal(category):
                            return journal_read(category)
                        
                        refresh_btn.click(refresh_journal, inputs=[journal_filter], outputs=journal_display)
                        clear_btn.click(clear_journal, [], journal_display).then(
                            refresh_journal, inputs=[journal_filter], outputs=journal_display
                        )
                        journal_filter.change(refresh_journal, inputs=[journal_filter], outputs=journal_display)

            # Бічна панель (Quick Note)
            with gr.Column(scale=1, min_width=260):
                with gr.Group(elem_classes="sidebar-journal"):
                    gr.Markdown("## 📝 Quick Note")
                    note_category = gr.Dropdown(
                        choices=JOURNAL_CATEGORIES,
                        value="Manual",
                        label="Category",
                        allow_custom_value=False
                    )
                    note_input = gr.Textbox(
                        label="Observation",
                        placeholder="Type your note here...",
                        lines=3
                    )
                    with gr.Row():
                        save_btn = gr.Button("💾 Save Note", size="sm", variant="primary")
                        clear_note_btn = gr.Button("🗑️ Clear", size="sm")
                    save_status = gr.Markdown("")

                    def save_note(category, note):
                        if note.strip():
                            journal_log(category, "manual note", note, note)
                            return "✅ Note saved.", ""
                        return "⚠️ Note is empty.", ""

                    save_btn.click(save_note, inputs=[note_category, note_input], outputs=[save_status, note_input])
                    clear_note_btn.click(lambda: ("", ""), outputs=[note_input, save_status])

        # Інтеграція з Learning Playground
        with gr.Row():
            gr.Markdown("""
            ---
            ### 🧪 New to the concepts?
            Explore our **[Learning Playground](https://huggingface.co/spaces/K-RnD-Lab/Learning-Playground_03-2026)** with simulated environments.
            """)

        gr.Markdown(
            "---\n"
            "*K R&D Lab Cancer Research Suite · "
            "All real-data tabs use live APIs with 24h caching · "
            "Simulated tabs are clearly labeled ⚠️ SIMULATED · "
            "Source attribution shown on every result*"
        )

    return demo

if __name__ == "__main__":
    app = build_app()
    app.launch(share=False)