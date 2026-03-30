"""
K R&D Lab — Learning Playground
Author: Oksana Kolisnyk | kosatiks-group.pp.ua
Repo:   github.com/TEZv/K-RnD-Lab-PHYLO-03_2026
"""

import gradio as gr
import pandas as pd
import numpy as np
import json
import re
import csv
import os
import time
import math
import hashlib
import datetime
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from io import BytesIO
from PIL import Image
from pathlib import Path
from datetime import datetime
from functools import wraps
import plotly.graph_objects as go
import plotly.express as px
import tabulate

# Імпорт з окремих модулів
from journal import journal_log, journal_read, clear_journal, JOURNAL_CATEGORIES
from chatbot import build_chatbot_tab

# ========== Діагностичний друк ==========
print("Gradio version:", gr.__version__)
print("Starting app...")

# ========== Кольори ==========
BG   = "#0f172a"
CARD = "#1e293b"
ACC  = "#f97316"
ACC2 = "#38bdf8"
TXT  = "#f1f5f9"
GRN  = "#22c55e"
RED  = "#ef4444"
DIM  = "#8e9bae"
BORDER = "#334155"

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

# ========== БАЗИ ДАНИХ ==========
MIRNA_DB = {
    "BRCA2": [
        {"miRNA":"hsa-miR-148a-3p","log2FC":-0.70,"padj":0.013,"targets":"DNMT1, AKT2","pathway":"Epigenetic reprogramming"},
        {"miRNA":"hsa-miR-30e-5p","log2FC":-0.49,"padj":0.032,"targets":"MYC, KRAS","pathway":"Oncogene suppression"},
        {"miRNA":"hsa-miR-551b-3p","log2FC":-0.59,"padj":0.048,"targets":"SMAD4, CDK6","pathway":"TGF-beta / CDK4/6"},
        {"miRNA":"hsa-miR-22-3p","log2FC":-0.43,"padj":0.041,"targets":"HIF1A, PTEN","pathway":"Hypoxia / PI3K"},
        {"miRNA":"hsa-miR-200c-3p","log2FC":-0.38,"padj":0.044,"targets":"ZEB1, ZEB2","pathway":"EMT suppression"},
    ],
    "BRCA1": [
        {"miRNA":"hsa-miR-155-5p","log2FC":-0.81,"padj":0.008,"targets":"SHIP1, SOCS1","pathway":"Immune evasion"},
        {"miRNA":"hsa-miR-146a-5p","log2FC":-0.65,"padj":0.019,"targets":"TRAF6, IRAK1","pathway":"NF-kB signalling"},
        {"miRNA":"hsa-miR-21-5p","log2FC":-0.55,"padj":0.027,"targets":"PTEN, PDCD4","pathway":"Apoptosis"},
        {"miRNA":"hsa-miR-17-5p","log2FC":-0.47,"padj":0.036,"targets":"RB1, E2F1","pathway":"Cell cycle"},
        {"miRNA":"hsa-miR-34a-5p","log2FC":-0.41,"padj":0.049,"targets":"BCL2, CDK6","pathway":"p53 axis"},
    ],
    "TP53": [
        {"miRNA":"hsa-miR-34a-5p","log2FC":-1.10,"padj":0.001,"targets":"BCL2, CDK6","pathway":"p53-miR-34 axis"},
        {"miRNA":"hsa-miR-192-5p","log2FC":-0.90,"padj":0.005,"targets":"MDM2, DHFR","pathway":"p53 feedback"},
        {"miRNA":"hsa-miR-145-5p","log2FC":-0.75,"padj":0.012,"targets":"MYC, EGFR","pathway":"Growth suppression"},
        {"miRNA":"hsa-miR-107","log2FC":-0.62,"padj":0.023,"targets":"CDK6, HIF1B","pathway":"Hypoxia / cell cycle"},
        {"miRNA":"hsa-miR-215-5p","log2FC":-0.51,"padj":0.038,"targets":"DTL, DHFR","pathway":"DNA damage response"},
    ],
}
SIRNA_DB = {
    "LUAD": [
        {"Gene":"SPC24","dCERES":-0.175,"log2FC":1.13,"Drug_status":"Novel","siRNA":"GCAGCUGAAGAAACUGAAU"},
        {"Gene":"BUB1B","dCERES":-0.119,"log2FC":1.12,"Drug_status":"Novel","siRNA":"CCAAAGAGCUGAAGAACAU"},
        {"Gene":"CDC45","dCERES":-0.144,"log2FC":1.26,"Drug_status":"Novel","siRNA":"GCAUCAAGAUGAAGGAGAU"},
        {"Gene":"PLK1","dCERES":-0.239,"log2FC":1.03,"Drug_status":"Clinical","siRNA":"GACGCUCAAGAUGCAGAUU"},
        {"Gene":"CDK1","dCERES":-0.201,"log2FC":1.00,"Drug_status":"Clinical","siRNA":"GCAGAAGCACUGAAGAUUU"},
    ],
    "BRCA": [
        {"Gene":"AURKA","dCERES":-0.165,"log2FC":1.20,"Drug_status":"Clinical","siRNA":"GCACUGAAGAUGCAGAAUU"},
        {"Gene":"AURKB","dCERES":-0.140,"log2FC":1.15,"Drug_status":"Clinical","siRNA":"CCUGAAGACGCUCAAGGUU"},
        {"Gene":"CENPW","dCERES":-0.125,"log2FC":0.95,"Drug_status":"Novel","siRNA":"GCAGAAGCACUGAAGAUUU"},
        {"Gene":"RFC2","dCERES":-0.136,"log2FC":0.50,"Drug_status":"Novel","siRNA":"GCAAGAUGCAGAAGCACUU"},
        {"Gene":"TYMS","dCERES":-0.131,"log2FC":0.72,"Drug_status":"Approved","siRNA":"GGACGCUCAAGAUGCAGAU"},
    ],
    "COAD": [
        {"Gene":"KRAS","dCERES":-0.210,"log2FC":0.80,"Drug_status":"Clinical","siRNA":"GCUGGAGCUGGUGGUAGUU"},
        {"Gene":"WEE1","dCERES":-0.180,"log2FC":1.05,"Drug_status":"Clinical","siRNA":"GCAGCUGAAGAAACUGAAU"},
        {"Gene":"CHEK1","dCERES":-0.155,"log2FC":0.90,"Drug_status":"Clinical","siRNA":"CCAAAGAGCUGAAGAACAU"},
        {"Gene":"RFC2","dCERES":-0.130,"log2FC":0.55,"Drug_status":"Novel","siRNA":"GCAUCAAGAUGAAGGAGAU"},
        {"Gene":"PKMYT1","dCERES":-0.122,"log2FC":1.07,"Drug_status":"Clinical","siRNA":"GACGCUCAAGAUGCAGAUU"},
    ],
}
CERNA = [
    {"lncRNA":"CYTOR","miRNA":"hsa-miR-138-5p","target":"AKT1","pathway":"TREM2 core signaling"},
    {"lncRNA":"CYTOR","miRNA":"hsa-miR-138-5p","target":"NFKB1","pathway":"Neuroinflammation"},
    {"lncRNA":"GAS5","miRNA":"hsa-miR-21-5p","target":"PTEN","pathway":"Neuroinflammation"},
    {"lncRNA":"GAS5","miRNA":"hsa-miR-222-3p","target":"IL1B","pathway":"Neuroinflammation"},
    {"lncRNA":"HOTAIRM1","miRNA":"hsa-miR-9-5p","target":"TREM2","pathway":"Direct TREM2 regulation"},
]
ASO = [
    {"lncRNA":"GAS5","position":119,"accessibility":0.653,"GC_pct":50,"Tm":47.2,"priority":"HIGH"},
    {"lncRNA":"CYTOR","position":507,"accessibility":0.653,"GC_pct":50,"Tm":46.8,"priority":"HIGH"},
    {"lncRNA":"HOTAIRM1","position":234,"accessibility":0.621,"GC_pct":44,"Tm":44.1,"priority":"MEDIUM"},
    {"lncRNA":"LINC00847","position":89,"accessibility":0.598,"GC_pct":56,"Tm":48.3,"priority":"MEDIUM"},
    {"lncRNA":"ZFAS1","position":312,"accessibility":0.571,"GC_pct":48,"Tm":45.5,"priority":"MEDIUM"},
]
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
VARIANT_DB = {
    "BRCA1:p.R1699Q": {"score":0.03,"cls":"Benign","conf":"High"},
    "BRCA1:p.R1699W": {"score":0.97,"cls":"Pathogenic","conf":"High"},
    "BRCA2:p.D2723A": {"score":0.999,"cls":"Pathogenic","conf":"High"},
    "TP53:p.R248W":   {"score":0.998,"cls":"Pathogenic","conf":"High"},
    "TP53:p.R248Q":   {"score":0.995,"cls":"Pathogenic","conf":"High"},
    "EGFR:p.L858R":   {"score":0.96,"cls":"Pathogenic","conf":"High"},
    "ALK:p.F1174L":   {"score":0.94,"cls":"Pathogenic","conf":"High"},
}
PLAIN = {
    "Pathogenic":        "This variant is likely to cause disease. Clinical follow-up is strongly recommended.",
    "Likely Pathogenic": "This variant is probably harmful. Discuss with your doctor.",
    "Benign":            "This variant is likely harmless. Common in the general population.",
    "Likely Benign":     "This variant is probably harmless. No strong reason for concern.",
}
BM_W = {
    "CTHRC1":0.18,"FHL2":0.15,"LDHA":0.14,"P4HA1":0.13,
    "SERPINH1":0.12,"ABCA8":-0.11,"CA4":-0.10,"CKB":-0.09,
    "NNMT":0.08,"CACNA2D2":-0.07
}
PROTEINS = ["albumin","apolipoprotein","fibrinogen","vitronectin",
            "clusterin","igm","iga","igg","complement","transferrin",
            "alpha-2-macroglobulin"]

# ========== Список кодів проєктів для випадаючих списків ==========
PROJECT_CODES = [
    "S1-A·R1a", "S1-A·R1b", "S1-A·R2e",
    "S1-B·R1a", "S1-B·R2a", "S1-B·R3a", "S1-B·R3b",
    "S1-C·R1a", "S1-C·R1b", "S1-C·R2a",
    "S1-D·R1a", "S1-D·R2a", "S1-D·R3a", "S1-D·R4a", "S1-D·R5a",
    "S1-E·R1a", "S1-E·R1b",
    "S1-F·R1a", "S1-F·R2a", "S1-F·R3a",
    "S1-G·General"
]

# ---------- S1-F RARE ----------
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

# ========== ДОПОМІЖНІ ФУНКЦІЇ ==========
def safe_img_from_fig(fig):
    """Convert matplotlib figure to PIL Image safely."""
    try:
        buf = BytesIO()
        fig.savefig(buf, format="png", dpi=120, facecolor=CARD)
        buf.seek(0)
        img = Image.open(buf)
        plt.close(fig)
        return img
    except Exception:
        plt.close(fig)
        return Image.new('RGB', (100, 100), color=CARD)

# ========== ФУНКЦІЇ ПРЕДИКЦІЇ ==========
def predict_mirna(gene):
    df = pd.DataFrame(MIRNA_DB.get(gene, []))
    journal_log("S1-B·R1a", gene, f"{len(df)} miRNAs")
    return df

def predict_sirna(cancer):
    df = pd.DataFrame(SIRNA_DB.get(cancer, []))
    journal_log("S1-B·R2a", cancer, f"{len(df)} targets")
    return df

def get_lncrna():
    journal_log("S1-B·R3a", "load", "ceRNA")
    return pd.DataFrame(CERNA)

def get_aso():
    journal_log("S1-B·R3b", "load", "ASO")
    return pd.DataFrame(ASO)

def predict_drug(pocket):
    try:
        df = pd.DataFrame(FGFR3.get(pocket, []))
        if df.empty:
            return pd.DataFrame(), None
        fig, ax = plt.subplots(figsize=(6, 4), facecolor=CARD)
        ax.set_facecolor(CARD)
        ax.barh(df["Compound"], df["Final_score"], color=ACC)
        ax.set_xlabel("Final Score", color=TXT)
        ax.tick_params(colors=TXT)
        for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
        ax.set_title(f"Top compounds — {pocket}", color=TXT, fontsize=10)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-C·R1a", pocket, f"Top: {df.iloc[0]['Compound'] if len(df) else 'none'}")
        return df, img
    except Exception as e:
        journal_log("S1-C·R1a", pocket, f"Error: {str(e)}")
        return pd.DataFrame(), None

def predict_variant(hgvs, sift, polyphen, gnomad):
    hgvs = hgvs.strip()
    if hgvs in VARIANT_DB:
        r = VARIANT_DB[hgvs]; cls, conf, score = r["cls"], r["conf"], r["score"]
    else:
        score = 0.0
        if sift < 0.05:     score += 0.4
        if polyphen > 0.85: score += 0.35
        if gnomad < 0.0001: score += 0.25
        score = round(score, 3)
        cls  = "Pathogenic" if score > 0.6 else "Likely Pathogenic" if score > 0.4 else "Benign"
        conf = "High" if (sift < 0.01 or sift > 0.9) else "Moderate"
    colour = RED if "Pathogenic" in cls else GRN
    icon   = "⚠️ WARNING" if "Pathogenic" in cls else "✅ OK"
    journal_log("S1-A·R1a", hgvs or f"SIFT={sift}", f"{cls} score={score}")
    return (
        f"<div style=\'background:{CARD};padding:16px;border-radius:8px;font-family:sans-serif;color:{TXT}\'>"
        f"<p style=\'font-size:11px;color:{DIM};margin:0 0 8px\'>S1-A·R1a · OpenVariant</p>"
        f"<h3 style=\'color:{colour};margin:0 0 8px\'>{icon} {cls}</h3>"
        f"<p>Score: <b>{score:.3f}</b> &nbsp;|&nbsp; Confidence: <b>{conf}</b></p>"
        f"<div style=\'background:{BORDER};border-radius:4px;height:14px\'>"
        f"<div style=\'background:{colour};height:14px;border-radius:4px;width:{int(score*100)}%\'></div></div>"
        f"<p style=\'margin-top:12px\'>{PLAIN.get(cls,'')}</p>"
        f"<p style=\'font-size:11px;color:{DIM}\'>Research only. Not clinical advice.</p></div>"
    )

def predict_corona(size, zeta, peg, lipid):
    try:
        score = 0
        if lipid == "Ionizable": score += 2
        elif lipid == "Cationic": score += 1
        if abs(zeta) < 10: score += 1
        if peg > 1.5:      score += 2
        if size < 100:     score += 1
        dominant = ["ApoE","Albumin","Fibrinogen","Vitronectin","ApoA-I"][min(score, 4)]
        efficacy = "High" if score >= 4 else "Medium" if score >= 2 else "Low"
        journal_log("S1-D·R1a", f"size={size},peg={peg},lipid={lipid}", f"dominant={dominant}")
        return f"**Dominant corona protein:** {dominant}\n\n**Predicted efficacy:** {efficacy}\n\n**Score:** {score}/6"
    except Exception as e:
        return f"Error: {str(e)}"

def predict_cancer(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10):
    try:
        vals = [c1,c2,c3,c4,c5,c6,c7,c8,c9,c10]
        names, weights = list(BM_W.keys()), list(BM_W.values())
        raw  = sum(v*w for v,w in zip(vals, weights))
        prob = 1 / (1 + np.exp(-raw * 2))
        label = "CANCER" if prob > 0.5 else "HEALTHY"
        colour = RED if prob > 0.5 else GRN
        contribs = [v*w for v,w in zip(vals, weights)]
        fig, ax = plt.subplots(figsize=(6, 3.5), facecolor=CARD)
        ax.set_facecolor(CARD)
        ax.barh(names, contribs, color=[ACC if c > 0 else ACC2 for c in contribs])
        ax.axvline(0, color=TXT, linewidth=0.8)
        ax.set_xlabel("Contribution to cancer score", color=TXT)
        ax.tick_params(colors=TXT, labelsize=8)
        for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
        ax.set_title("Protein contributions", color=TXT, fontsize=10)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-E·R1a", f"CTHRC1={c1},FHL2={c2}", f"{label} {prob:.2f}")
        html_out = (
            f"<div style=\'background:{CARD};padding:14px;border-radius:8px;font-family:sans-serif;\'>"
            f"<p style=\'font-size:11px;color:{DIM};margin:0 0 6px\'>S1-E·R1a · Liquid Biopsy</p>"
            f"<span style=\'color:{colour};font-size:24px;font-weight:bold\'>{label}</span><br>"
            f"<span style=\'color:{TXT};font-size:14px\'>Probability: {prob:.2f}</span></div>"
        )
        return html_out, img
    except Exception as e:
        return f"<div style='color:{RED}'>Error: {str(e)}</div>", None

def predict_flow(size, zeta, peg, charge, flow_rate):
    try:
        csi = round(min((flow_rate/40)*0.6 + (peg/5)*0.2 + (1 if charge=="Cationic" else 0)*0.2, 1.0), 3)
        stability = "High remodeling" if csi > 0.6 else "Medium" if csi > 0.3 else "Stable"
        t = np.linspace(0, 60, 200)
        kf, ks = 0.03*(1+flow_rate/40), 0.038*(1+flow_rate/40)
        fig, ax = plt.subplots(figsize=(6, 3.5), facecolor=CARD)
        ax.set_facecolor(CARD)
        ax.plot(t, 60*np.exp(-0.03*t)+20, color="#60a5fa", ls="--", label="Albumin (static)")
        ax.plot(t, 60*np.exp(-kf*t)+10,   color="#60a5fa",          label="Albumin (flow)")
        ax.plot(t, 14*(1-np.exp(-0.038*t))+5, color=ACC, ls="--",   label="ApoE (static)")
        ax.plot(t, 20*(1-np.exp(-ks*t))+5,    color=ACC,             label="ApoE (flow)")
        ax.set_xlabel("Time (min)", color=TXT); ax.set_ylabel("% Corona", color=TXT)
        ax.tick_params(colors=TXT); ax.legend(fontsize=7, labelcolor=TXT, facecolor=CARD)
        for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
        ax.set_title("Vroman Effect — flow vs static", color=TXT, fontsize=9)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-D·R2a", f"flow={flow_rate}", f"CSI={csi}")
        return f"**Corona Shift Index: {csi}** — {stability}", img
    except Exception as e:
        return f"Error: {str(e)}", None

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
        fig, ax = plt.subplots(figsize=(5, 4), subplot_kw={"polar":True}, facecolor=CARD)
        ax.set_facecolor(CARD)
        ax.plot(a2, v2, color=ACC, linewidth=2); ax.fill(a2, v2, color=ACC, alpha=0.2)
        ax.set_xticks(angles); ax.set_xticklabels(cats, color=TXT, fontsize=8)
        ax.tick_params(colors=TXT)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-D·R3a", f"pka={pka},zeta={zeta}", f"ApoE={apoe_pct:.1f}%")
        return f"**Predicted ApoE:** {apoe_pct:.1f}% — {tier}\n\n**BBB Probability:** {bbb_prob:.2f}", img
    except Exception as e:
        return f"Error: {str(e)}", None

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
        if not out["size_nm"]:         flags.append("size_nm not found")
        if not out["zeta_mv"]:         flags.append("zeta_mv not found")
        if not out["corona_proteins"]: flags.append("no proteins detected")
        summary = "All key fields extracted" if not flags else " | ".join(flags)
        journal_log("S1-D·R4a", text[:80], f"proteins={len(out['corona_proteins'])}")
        return json.dumps(out, indent=2), summary
    except Exception as e:
        return json.dumps({"error": str(e)}), "Extraction error"

# ========== ФУНКЦІЇ ДЛЯ РІДКІСНИХ РАКІВ ==========
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
        fig, ax = plt.subplots(figsize=(6, 3), facecolor=CARD)
        ax.set_facecolor(CARD)
        colors = [GRN if p=="HIGH" else ACC if p=="MEDIUM" else RED for p in df["Priority"]]
        ax.barh(df["Formulation"], df["ApoE_pct"], color=colors)
        ax.set_xlabel("ApoE% in CSF corona", color=TXT)
        ax.tick_params(colors=TXT, labelsize=8)
        for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
        ax.set_title("DIPG — CSF LNP formulations (ApoE%)", color=TXT, fontsize=9)
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
        fig, ax = plt.subplots(figsize=(6, 3), facecolor=CARD)
        ax.set_facecolor(CARD)
        colors = [GRN if p=="HIGH" else ACC if p=="MEDIUM" else RED for p in df["Priority"]]
        ax.barh(df["Formulation"], df["Retention_h"], color=colors)
        ax.set_xlabel("Vitreous retention (hours)", color=TXT)
        ax.tick_params(colors=TXT, labelsize=8)
        for sp in ax.spines.values(): sp.set_edgecolor(BORDER)
        ax.set_title("UVM — LNP retention in vitreous humor", color=TXT, fontsize=9)
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
        fig, ax = plt.subplots(figsize=(5, 4), subplot_kw={"polar":True}, facecolor=CARD)
        ax.set_facecolor(CARD)
        ax.plot(a2, v2, color=ACC2, linewidth=2); ax.fill(a2, v2, color=ACC2, alpha=0.2)
        ax.set_xticks(angles); ax.set_xticklabels(cats, color=TXT, fontsize=8)
        ax.tick_params(colors=TXT)
        ax.set_title(f"pAML · {row['Variant'][:20]}", color=TXT, fontsize=9)
        plt.tight_layout()
        img = safe_img_from_fig(fig)
        journal_log("S1-F·R3a", variant, f"ferr={ferr_score:.2f}")
        _v  = row["Variant"]
        _p  = row["Pathway"]
        _d  = row["Drug_status"]
        _f  = row["Ferroptosis"]
        _fs = f"{ferr_score:.2f}"
        summary = (
            f"<div style='background:{CARD};padding:14px;border-radius:8px;font-family:sans-serif;'>"
            f"<p style='color:{DIM};font-size:11px;margin:0 0 6px'>S1-F·R3a · pAML</p>"
            f"<b style='color:{ACC2};font-size:15px'>{_v}</b><br>"
            f"<p style='color:{TXT};margin:6px 0'><b>Pathway:</b> {_p}</p>"
            f"<p style='color:{TXT};margin:0'><b>Drug:</b> {_d}</p>"
            f"<p style='color:{TXT};margin:6px 0'><b>Ferroptosis link:</b> {_f}</p>"
            f"<p style='color:{TXT}'><b>Ferroptosis sensitivity score:</b> "
            f"<span style='color:{ACC};font-size:18px'>{_fs}</span></p>"
            f"<p style='font-size:11px;color:{DIM}'>Research only. Not clinical advice.</p></div>"
        )
        return summary, img
    except Exception as e:
        return f"<div style='color:{RED}'>Error: {str(e)}</div>", None

# ========== НОВІ ІНСТРУМЕНТИ ==========

# --- S1-D·R6a — Corona Database ---
def load_corona_database():
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
        {"Protein": "Clusterin", "UniProt": "P10909", "Frequency": 0.74, "MW_kDa": 52.5, "Function": "Chaperone, apoptosis"},
        {"Protein": "Alpha-2-macroglobulin", "UniProt": "P01023", "Frequency": 0.72, "MW_kDa": 163.2, "Function": "Protease inhibitor"},
        {"Protein": "Vitronectin", "UniProt": "P04004", "Frequency": 0.70, "MW_kDa": 54.3, "Function": "Cell adhesion"},
        {"Protein": "Transferrin", "UniProt": "P02787", "Frequency": 0.68, "MW_kDa": 77.0, "Function": "Iron transport"},
    ]
    return pd.DataFrame(corona_proteins)

def corona_db_query(np_type="Lipid", size_nm=100, zeta_mv=-5, peg_pct=1.5):
    df = load_corona_database()
    df = df.copy()
    if zeta_mv < -10:
        df.loc[df["Protein"].str.contains("Apolipoprotein E", na=False), "Frequency"] *= 1.2
    elif zeta_mv > 5:
        df.loc[df["Protein"].str.contains("Albumin", na=False), "Frequency"] *= 1.1
    if size_nm > 150:
        df.loc[df["Function"].str.contains("coagulation", na=False), "Frequency"] *= 1.15
    peg_factor = max(0.5, 1.0 - peg_pct * 0.2)
    df["Frequency"] *= peg_factor
    df["Frequency"] = df["Frequency"].clip(0, 1)
    df = df.sort_values("Frequency", ascending=False)
    df["Predicted_Conc_nM"] = (df["Frequency"] * 100 / df["MW_kDa"]).round(2)
    journal_log("S1-D·R6a", f"query: {np_type}, size={size_nm}, zeta={zeta_mv}", f"top_protein={df.iloc[0]['Protein']}")
    return df.head(10)

def plot_corona_db(df):
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
    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=150, facecolor="white")
    buf.seek(0)
    img = Image.open(buf)
    plt.close(fig)
    return img

# --- S1-E·R2a — Multi-protein Biomarkers ---
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
    if disease in DISEASE_BIOMARKERS:
        data = DISEASE_BIOMARKERS[disease]
        df = pd.DataFrame({
            "Protein": data["proteins"],
            "Role": ["Biomarker"] * len(data["proteins"]),
            "Validation": ["Validated" if i < 5 else "Candidate" for i in range(len(data["proteins"]))],
            "Expression": ["Upregulated" if "C" in p or "K" in p else "Altered" for p in data["proteins"]]
        })
        note = f"**Specificity:** {data['specificity']} | **Sensitivity:** {data['sensitivity']}"
        journal_log("S1-E·R2a", f"disease={disease}", f"panel_size={len(data['proteins'])}")
        return df, note
    else:
        return pd.DataFrame(), "No data for selected disease."

def find_common_biomarkers(disease1, disease2):
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
        journal_log("S1-E·R2a", f"common: {disease1} & {disease2}", f"found={len(common)}")
        return df, f"Found {len(common)} common biomarkers."
    else:
        return pd.DataFrame(), "No common biomarkers found."

# ========== 3D моделі ==========
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

# ========== ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ UI ==========
def section_header(code, name, tagline, projects_html):
    return (
        f"<div style=\'background:{BG};border:1px solid {BORDER};padding:14px 18px;"
        f"border-radius:8px;margin-bottom:12px;\'>"
        f"<div style=\'display:flex;align-items:baseline;gap:10px;\'>"
        f"<span style=\'color:{ACC2};font-size:16px;font-weight:700\'>{code}</span>"
        f"<span style=\'color:{TXT};font-size:14px;font-weight:600\'>{name}</span>"
        f"<span style=\'color:{DIM};font-size:12px\'>{tagline}</span></div>"
        f"<div style=\'margin-top:8px;font-size:12px;color:{DIM}\'>{projects_html}</div>"
        f"</div>"
    )

def proj_badge(code, title, metric=""):
    m = (f"<span style=\'background:#0f2a3f;color:{ACC2};padding:1px 7px;border-radius:3px;"
         f"font-size:10px;margin-left:6px\'>{metric}</span>") if metric else ""
    return (
        f"<div style=\'background:{CARD};border-left:3px solid {ACC};"
        f"padding:8px 12px;border-radius:0 6px 6px 0;margin-bottom:8px;\'>"
        f"<span style=\'color:{DIM};font-size:11px\'>{code}</span>{m}<br>"
        f"<span style=\'color:{TXT};font-size:14px;font-weight:600\'>{title}</span>"
        f"</div>"
    )

# ========== CSS ==========
css = f"""
body, .gradio-container {{ background: {BG} !important; color: {TXT} !important; }}

.tabs-outer .tab-nav {{
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
}}
.tabs-outer .tab-nav button {{
    color: {TXT} !important;
    background: {CARD} !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    padding: 8px 16px !important;
    border-radius: 6px 6px 0 0 !important;
    border: 1px solid {BORDER};
    border-bottom: none;
    margin-right: 2px;
    margin-bottom: 2px;
    white-space: nowrap;
    cursor: pointer !important;
}}
.tabs-outer .tab-nav button.selected {{
    border-bottom: 3px solid {ACC} !important;
    color: {ACC} !important;
    background: {BG} !important;
}}

.main-tabs .tab-nav button {{
    color: {DIM} !important;
    background: {BG} !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    padding: 5px 12px !important;
    border-radius: 4px 4px 0 0 !important;
    border: 1px solid {BORDER} !important;
    border-bottom: none !important;
    margin-right: 3px !important;
    cursor: pointer !important;
}}
.main-tabs .tab-nav button.selected {{
    color: {ACC2} !important;
    background: {CARD} !important;
    border-color: {ACC2} !important;
    border-bottom: none !important;
}}
.main-tabs > .tabitem {{
    background: {CARD} !important;
    border: 1px solid {BORDER} !important;
    border-radius: 0 6px 6px 6px !important;
    padding: 14px !important;
}}

.sub-tabs .tab-nav button {{
    color: {DIM} !important;
    background: {CARD} !important;
    font-size: 11px !important;
    padding: 3px 8px !important;
    border-radius: 3px 3px 0 0 !important;
    cursor: pointer !important;
}}
.sub-tabs .tab-nav button.selected {{
    color: {ACC} !important;
    background: {BG} !important;
}}

.proj-badge {{
    background: {CARD};
    border-left: 3px solid {ACC};
    padding: 8px 12px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 8px;
}}
.proj-code {{
    color: {DIM};
    font-size: 11px;
}}
.proj-title {{
    color: {TXT};
    font-size: 14px;
    font-weight: 600;
}}
.proj-metric {{
    background: #0f2a3f;
    color: {ACC2};
    padding: 1px 7px;
    border-radius: 3px;
    font-size: 10px;
    margin-left: 6px;
}}

.sidebar-journal {{
    background: {CARD};
    border: 1px solid {BORDER};
    border-radius: 8px;
    padding: 14px;
}}
.sidebar-journal h3 {{
    color: {ACC};
    margin-top: 0;
}}

h1, h2, h3 {{ color: {ACC} !important; }}
.gr-button-primary {{ background: {ACC} !important; border: none !important; cursor: pointer !important; }}
.gr-button-secondary {{ cursor: pointer !important; }}
footer {{ display: none !important; }}

.gr-dropdown, .gr-button, .gr-slider, .gr-radio, .gr-checkbox,
.tab-nav button, .gr-accordion, .gr-dataset, .gr-dropdown * {{
    cursor: pointer !important;
}}
.gr-dropdown input, .gr-textbox input, .gr-textarea textarea {{
    cursor: text !important;
}}
"""

# ========== MAP HTML ==========
MAP_HTML = f"""
<div style="background:{CARD};padding:22px;border-radius:8px;font-family:monospace;font-size:13px;line-height:2.0;color:{TXT}">
<span style="color:{ACC};font-size:16px;font-weight:bold">K R&D Lab · S1 Biomedical</span>
<span style="color:{DIM};font-size:11px;margin-left:12px">Science Sphere — sub-direction 1</span>
<br><br>
<span style="color:{ACC2};font-weight:600">S1-A · PHYLO-GENOMICS</span> — What breaks in DNA<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R1a</b> OpenVariant <span style="color:{GRN}"> AUC=0.939 ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-A·R1b</b> Somatic classifier <span style="color:#f59e0b"> 🔶 In progress</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-A·R2e</b> Research Assistant (RAG Chatbot) <span style="color:{GRN}"> ✅</span><br><br>
<span style="color:{ACC2};font-weight:600">S1-B · PHYLO-RNA</span> — How to silence it via RNA<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-B·R1a</b> miRNA silencing <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-B·R2a</b> siRNA synthetic lethal <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-B·R3a</b> lncRNA-TREM2 ceRNA <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-B·R3b</b> ASO designer <span style="color:{GRN}"> ✅</span><br><br>
<span style="color:{ACC2};font-weight:600">S1-C · PHYLO-DRUG</span> — Which molecule treats it<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-C·R1a</b> FGFR3 RNA-directed compounds <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-C·R1b</b> Synthetic lethal drug mapping <span style="color:#f59e0b"> 🔶</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-C·R2a</b> m6A × Ferroptosis × Circadian <span style="color:{DIM}"> 🔴 Frontier</span><br><br>
<span style="color:{ACC2};font-weight:600">S1-D · PHYLO-LNP</span> — How to deliver the drug<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R1a</b> LNP corona (serum) <span style="color:{GRN}"> AUC=0.791 ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R2a</b> Flow corona — Vroman effect <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R3a</b> LNP brain / BBB / ApoE <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R4a</b> AutoCorona NLP <span style="color:{GRN}"> F1=0.71 ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-D·R5a</b> CSF · Vitreous · Bone Marrow <span style="color:{DIM}"> 🔴 0 prior studies</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-D·R6a</b> Corona Database <span style="color:{GRN}"> ✅</span><br><br>
<span style="color:{ACC2};font-weight:600">S1-E · PHYLO-BIOMARKERS</span> — Detect without biopsy<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-E·R1a</b> Liquid Biopsy classifier <span style="color:{GRN}"> AUC=0.992* ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-E·R1b</b> Protein panel validator <span style="color:#f59e0b"> 🔶</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-E·R2a</b> Multi-protein biomarkers <span style="color:{GRN}"> ✅</span><br><br>
<span style="color:{ACC2};font-weight:600">S1-F · PHYLO-RARE</span> — Where almost nobody has looked yet<br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-F·R1a</b> DIPG toolkit (H3K27M + CSF LNP + Circadian) <span style="color:#f59e0b"> 🔶</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>S1-F·R2a</b> UVM toolkit (GNAQ/GNA11 + vitreous + m6A) <span style="color:#f59e0b"> 🔶</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>S1-F·R3a</b> pAML toolkit (FLT3-ITD + BM niche + ferroptosis) <span style="color:#f59e0b"> 🔶</span><br><br>
<span style="color:{ACC2};font-weight:600">S1-G · PHYLO-SIM</span> — 3D Models & Simulations<br>
&nbsp;&nbsp;&nbsp;├─ <b>Nanoparticle</b> Interactive 3D model <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;├─ <b>DNA Helix</b> Double helix visualization <span style="color:{GRN}"> ✅</span><br>
&nbsp;&nbsp;&nbsp;└─ <b>Protein Corona</b> Schematic corona <span style="color:{GRN}"> ✅</span><br><br>
<span style="color:{DIM};font-size:11px">✅ Active · 🔶 In progress · 🔴 Planned</span>
</div>
"""

# ========== UI ==========
with gr.Blocks(css=css, title="K R&D Lab · S1 Biomedical") as demo:
    gr.Markdown(
        "# 🔬 K R&D Lab · Science Sphere — S1 Biomedical\n"
        "**Oksana Kolisnyk** · [KOSATIKS GROUP](https://kosatiks-group.pp.ua)  · "
        "*Research only. Not clinical advice.*"
    )

    with gr.Row():
        # Основна колонка з вкладками (ширша)
        with gr.Column(scale=4):
            with gr.Tabs(elem_classes="tabs-outer") as outer_tabs:
                # 🗺️ Lab Map
                with gr.TabItem("🗺️ Lab Map"):
                    gr.HTML(MAP_HTML)

                # === S1-A · PHYLO-GENOMICS ===
                with gr.TabItem("🧬 S1-A"):
                    gr.HTML(section_header(
                        "S1-A", "PHYLO-GENOMICS", "— What breaks in DNA",
                        "R1a OpenVariant ✅ · R1b Somatic classifier 🔶 · R2e Research Assistant ✅"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        # R1 · Variant classification
                        with gr.TabItem("R1 · Variant classification"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                # R1a · OpenVariant
                                with gr.TabItem("R1a · OpenVariant"):
                                    gr.HTML(proj_badge("S1-A·R1a", "OpenVariant — SNV Pathogenicity Classifier", "AUC=0.939"))
                                    hgvs = gr.Textbox(label="HGVS notation", placeholder="BRCA1:p.R1699Q")
                                    gr.Markdown("**Or enter functional scores manually:**")
                                    with gr.Row():
                                        sift = gr.Slider(0,1,value=0.5,step=0.01,label="SIFT (0=damaging)")
                                        pp   = gr.Slider(0,1,value=0.5,step=0.01,label="PolyPhen-2")
                                        gn   = gr.Slider(0,0.01,value=0.001,step=0.0001,label="gnomAD AF")
                                    b_v = gr.Button("Predict Pathogenicity", variant="primary")
                                    o_v = gr.HTML()
                                    gr.Examples([["BRCA1:p.R1699Q",0.82,0.05,0.0012],
                                                 ["TP53:p.R248W",0.00,1.00,0.0],
                                                 ["BRCA2:p.D2723A",0.01,0.98,0.0]], inputs=[hgvs,sift,pp,gn], cache_examples=False)
                                    b_v.click(predict_variant, [hgvs,sift,pp,gn], o_v)
                                # R1b · Somatic Classifier (в розробці)
                                with gr.TabItem("R1b · Somatic Classifier 🔶"):
                                    gr.HTML(proj_badge("S1-A·R1b", "Somatic Mutation Classifier", "🔶 In progress"))
                                    gr.Markdown("> This module is in active development. Coming in the next release.")
                        # R2 · Research Assistant (RAG Chatbot)
                        with gr.TabItem("R2 · Research Assistant"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R2a · RAG Chatbot"):
                                    build_chatbot_tab()

                # === S1-B · PHYLO-RNA === (залишається без змін)
                with gr.TabItem("🔬 S1-B"):
                    gr.HTML(section_header(
                        "S1-B", "PHYLO-RNA", "— How to silence it via RNA",
                        "R1a miRNA ✅ · R2a siRNA ✅ · R3a lncRNA ✅ · R3b ASO ✅"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        # R1 · miRNA silencing
                        with gr.TabItem("R1 · miRNA silencing"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R1a · BRCA2 miRNA"):
                                    gr.HTML(proj_badge("S1-B·R1a", "miRNA Silencing — BRCA1/2 · TP53"))
                                    g1 = gr.Dropdown(["BRCA2","BRCA1","TP53"], value="BRCA2", label="Gene")
                                    b1 = gr.Button("Find miRNAs", variant="primary")
                                    o1 = gr.Dataframe(label="Top 5 downregulated miRNAs")
                                    gr.Examples([["BRCA2"],["BRCA1"],["TP53"]], inputs=[g1])
                                    b1.click(predict_mirna, [g1], o1)
                        # R2 · siRNA SL
                        with gr.TabItem("R2 · siRNA SL"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R2a · TP53 siRNA"):
                                    gr.HTML(proj_badge("S1-B·R2a", "siRNA Synthetic Lethal — TP53-null"))
                                    g2 = gr.Dropdown(["LUAD","BRCA","COAD"], value="LUAD", label="Cancer type")
                                    b2 = gr.Button("Find Targets", variant="primary")
                                    o2 = gr.Dataframe(label="Top 5 synthetic lethal targets")
                                    gr.Examples([["LUAD"],["BRCA"],["COAD"]], inputs=[g2], cache_examples=False)
                                    b2.click(predict_sirna, [g2], o2)
                        # R3 · lncRNA + ASO
                        with gr.TabItem("R3 · lncRNA + ASO"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R3a · lncRNA-TREM2"):
                                    gr.HTML(proj_badge("S1-B·R3a", "lncRNA-TREM2 ceRNA Network"))
                                    b3a = gr.Button("Load ceRNA", variant="primary")
                                    o3a = gr.Dataframe(label="ceRNA Network (R3a)")
                                    b3a.click(lambda: pd.DataFrame(CERNA), [], o3a)
                                with gr.TabItem("R3b · ASO Designer"):
                                    gr.HTML(proj_badge("S1-B·R3b", "ASO Designer"))
                                    b3b = gr.Button("Load ASO Candidates", variant="primary")
                                    o3b = gr.Dataframe(label="ASO Candidates (R3b)")
                                    b3b.click(lambda: pd.DataFrame(ASO), [], o3b)

                # === S1-C · PHYLO-DRUG === (залишається без змін)
                with gr.TabItem("💊 S1-C"):
                    gr.HTML(section_header(
                        "S1-C", "PHYLO-DRUG", "— Which molecule treats it",
                        "R1a FGFR3 ✅ · R1b SL drug mapping 🔶 · R2a Frontier 🔴⭐"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        with gr.TabItem("R1 · RNA-directed drug"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R1a · FGFR3 RNA Drug"):
                                    gr.HTML(proj_badge("S1-C·R1a", "FGFR3 RNA-Directed Drug Discovery", "top score 0.793"))
                                    g4 = gr.Radio(["P1 (hairpin loop)","P10 (G-quadruplex)"],
                                                  value="P1 (hairpin loop)", label="Target pocket")
                                    b4_drug = gr.Button("Screen Compounds", variant="primary")
                                    o4t = gr.Dataframe(label="Top 5 candidates")
                                    o4p = gr.Image(label="Binding scores")
                                    gr.Examples([["P1 (hairpin loop)"],["P10 (G-quadruplex)"]], inputs=[g4])
                                    b4_drug.click(predict_drug, [g4], [o4t, o4p])
                                with gr.TabItem("R1b · SL Drug Mapping 🔶"):
                                    gr.HTML(proj_badge("S1-C·R1b", "Synthetic Lethal Drug Mapping", "🔶 In progress"))
                                    gr.Markdown("> In development. Coming soon.")
                        with gr.TabItem("R2 · Frontier"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R2a · m6A×Ferroptosis×Circadian 🔴⭐"):
                                    gr.HTML(proj_badge("S1-C·R2a", "m6A × Ferroptosis × Circadian", "🔴 Frontier"))
                                    gr.Markdown(
                                        "> **Research gap:** This triple intersection has never been studied as an integrated system.\n\n"
                                        "> **Planned datasets:** TCGA-PAAD · GEO m6A atlases · Circadian gene panels\n\n"
                                        "> **Expected timeline:** Q3 2026"
                                    )

                # === S1-D · PHYLO-LNP === (залишається без змін)
                with gr.TabItem("🧪 S1-D"):
                    gr.HTML(section_header(
                        "S1-D", "PHYLO-LNP", "— How to deliver the drug",
                        "R1a Corona ✅ · R2a Flow ✅ · R3a Brain ✅ · R4a NLP ✅ · R5a CSF/BM 🔴⭐"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        # R1 · Serum corona
                        with gr.TabItem("R1 · Serum corona"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R1a · LNP Corona ML"):
                                    gr.HTML(proj_badge("S1-D·R1a", "LNP Protein Corona (Serum)", "AUC=0.791"))
                                    with gr.Row():
                                        sz = gr.Slider(50,300,value=100,step=1,label="Size (nm)")
                                        zt = gr.Slider(-40,10,value=-5,step=1,label="Zeta (mV)")
                                    with gr.Row():
                                        pg = gr.Slider(0,5,value=1.5,step=0.1,label="PEG mol%")
                                        lp = gr.Dropdown(["Ionizable","Cationic","Anionic","Neutral"],value="Ionizable",label="Lipid type")
                                    b6 = gr.Button("Predict", variant="primary")
                                    o6 = gr.Markdown()
                                    gr.Examples([[100,-5,1.5,"Ionizable"],[80,5,0.5,"Cationic"]], inputs=[sz,zt,pg,lp])
                                    b6.click(predict_corona, [sz,zt,pg,lp], o6)
                        # R2 · Flow corona
                        with gr.TabItem("R2 · Flow corona"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R2a · Flow Corona"):
                                    gr.HTML(proj_badge("S1-D·R2a", "Flow Corona — Vroman Effect"))
                                    with gr.Row():
                                        s8  = gr.Slider(50,300,value=100,step=1,label="Size (nm)")
                                        z8  = gr.Slider(-40,10,value=-5,step=1,label="Zeta (mV)")
                                        pg8 = gr.Slider(0,5,value=1.5,step=0.1,label="PEG mol%")
                                    with gr.Row():
                                        ch8 = gr.Dropdown(["Ionizable","Cationic","Anionic","Neutral"],value="Ionizable",label="Charge")
                                        fl8 = gr.Slider(0,40,value=20,step=1,label="Flow cm/s (aorta=40)")
                                    b8 = gr.Button("Model Vroman Effect", variant="primary")
                                    o8t = gr.Markdown()
                                    o8p = gr.Image(label="Kinetics")
                                    gr.Examples([[100,-5,1.5,"Ionizable",40],[150,5,0.5,"Cationic",10]], inputs=[s8,z8,pg8,ch8,fl8])
                                    b8.click(predict_flow, [s8,z8,pg8,ch8,fl8], [o8t,o8p])
                        # R3 · Brain BBB
                        with gr.TabItem("R3 · Brain BBB"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R3a · LNP Brain"):
                                    gr.HTML(proj_badge("S1-D·R3a", "LNP Brain Delivery"))
                                    smi = gr.Textbox(label="Ionizable lipid SMILES",
                                                     value="CC(C)CC(=O)OCC(COC(=O)CC(C)C)OC(=O)CC(C)C")
                                    with gr.Row():
                                        pk  = gr.Slider(4,8,value=6.5,step=0.1,label="pKa")
                                        zt9 = gr.Slider(-20,10,value=-3,step=1,label="Zeta (mV)")
                                    b9 = gr.Button("Predict BBB Crossing", variant="primary")
                                    o9t = gr.Markdown()
                                    o9p = gr.Image(label="Radar profile")
                                    gr.Examples([["CC(C)CC(=O)OCC(COC(=O)CC(C)C)OC(=O)CC(C)C",6.5,-3]], inputs=[smi,pk,zt9])
                                    b9.click(predict_bbb, [smi,pk,zt9], [o9t,o9p])
                        # R4 · NLP
                        with gr.TabItem("R4 · NLP"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R4a · AutoCorona NLP"):
                                    gr.HTML(proj_badge("S1-D·R4a", "AutoCorona NLP", "F1=0.71"))
                                    txt  = gr.Textbox(lines=5,label="Paper abstract",placeholder="Paste abstract here...")
                                    b10  = gr.Button("Extract Data", variant="primary")
                                    o10j = gr.Code(label="Extracted JSON", language="json")
                                    o10f = gr.Textbox(label="Validation flags")
                                    gr.Examples([[
                                        "LNPs composed of MC3, DSPC, Cholesterol (50:10:40 mol%) with 1.5% PEG-DMG. "
                                        "Hydrodynamic diameter was 98 nm, zeta potential -3.2 mV, PDI 0.12. "
                                        "Incubated in human plasma. Corona: albumin, apolipoprotein E, fibrinogen."
                                    ]], inputs=[txt])
                                    b10.click(extract_corona, txt, [o10j, o10f])
                        # R5 · Exotic fluids (future)
                        with gr.TabItem("R5 · Exotic fluids 🔴⭐"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R5a · CSF/Vitreous/BM"):
                                    gr.HTML(proj_badge("S1-D·R5a", "LNP Corona in CSF · Vitreous · Bone Marrow", "🔴 0 prior studies"))
                                    gr.Markdown(
                                        "> **Research gap:** Protein corona has only been characterized in serum/plasma. "
                                        "CSF, vitreous humor, and bone marrow interstitial fluid remain completely unstudied.\n\n"
                                        "> **Target cancers:** DIPG (CSF) · UVM (vitreous) · pAML (bone marrow)\n\n"
                                        "> **Expected timeline:** Q2–Q3 2026"
                                    )
                        # R6 · Corona Database
                        with gr.TabItem("R6 · Corona Database"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R6a · Corona Database"):
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

                # === S1-E · PHYLO-BIOMARKERS === (залишається без змін)
                with gr.TabItem("🩸 S1-E"):
                    gr.HTML(section_header(
                        "S1-E", "PHYLO-BIOMARKERS", "— Detect without biopsy",
                        "R1a Liquid Biopsy ✅ · R1b Protein validator 🔶"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        with gr.TabItem("R1 · Liquid biopsy"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R1a · Liquid Biopsy"):
                                    gr.HTML(proj_badge("S1-E·R1a", "Liquid Biopsy Classifier", "AUC=0.992*"))
                                    with gr.Row():
                                        p1=gr.Slider(-3,3,value=0,step=0.1,label="CTHRC1")
                                        p2=gr.Slider(-3,3,value=0,step=0.1,label="FHL2")
                                        p3=gr.Slider(-3,3,value=0,step=0.1,label="LDHA")
                                        p4=gr.Slider(-3,3,value=0,step=0.1,label="P4HA1")
                                        p5=gr.Slider(-3,3,value=0,step=0.1,label="SERPINH1")
                                    with gr.Row():
                                        p6=gr.Slider(-3,3,value=0,step=0.1,label="ABCA8")
                                        p7=gr.Slider(-3,3,value=0,step=0.1,label="CA4")
                                        p8=gr.Slider(-3,3,value=0,step=0.1,label="CKB")
                                        p9=gr.Slider(-3,3,value=0,step=0.1,label="NNMT")
                                        p10=gr.Slider(-3,3,value=0,step=0.1,label="CACNA2D2")
                                    b7=gr.Button("Classify", variant="primary")
                                    o7t=gr.HTML()
                                    o7p=gr.Image(label="Feature contributions")
                                    gr.Examples([[2,2,1.5,1.8,1.6,-1,-1.2,-0.8,1.4,-1.1],[0]*10],
                                                inputs=[p1,p2,p3,p4,p5,p6,p7,p8,p9,p10])
                                    b7.click(predict_cancer, [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10], [o7t,o7p])
                                with gr.TabItem("R1b · Protein Validator 🔶"):
                                    gr.HTML(proj_badge("S1-E·R1b", "Protein Panel Validator", "🔶 In progress"))
                                    gr.Markdown("> Coming next — validates R1a results against GEO plasma proteomics datasets.")
                        with gr.TabItem("R2 · Multi-protein biomarkers"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R2a · Multi-protein Biomarkers"):
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

                # === S1-F · PHYLO-RARE === (залишається без змін)
                with gr.TabItem("🧠 S1-F"):
                    gr.HTML(section_header(
                        "S1-F", "PHYLO-RARE", "— Where almost nobody has looked yet",
                        "<b style='color:#ef4444'>⚠️ <300 cases/yr · <5% survival · 0–1 prior studies per gap</b><br>"
                        "R1a DIPG 🔶 · R2a UVM 🔶 · R3a pAML 🔶"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        with gr.TabItem("R1 · DIPG"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R1a · DIPG Toolkit"):
                                    gr.HTML(proj_badge("S1-F·R1a", "DIPG Toolkit", "PBTA · GSE126319"))
                                    gr.Markdown(
                                        "> **Why DIPG?** Diffuse Intrinsic Pontine Glioma — median survival 9–11 months. "
                                        "H3K27M oncohistone in **78%** cases. "
                                        "CSF delivery is the only viable route past the brainstem BBB. "
                                        "Circadian disruption (BMAL1 suppression) newly linked — **0 prior LNP studies**."
                                    )
                                    with gr.Tabs():
                                        with gr.TabItem("Variants"):
                                            sort_d = gr.Radio(["Frequency", "Drug status"], value="Frequency", label="Sort by")
                                            b_dv   = gr.Button("Load DIPG Variants", variant="primary")
                                            o_dv   = gr.Dataframe(label="H3K27M co-mutations · PBTA/GSE126319")
                                            b_dv.click(dipg_variants, [sort_d], o_dv)
                                        with gr.TabItem("CSF LNP"):
                                            with gr.Row():
                                                d_peg  = gr.Slider(0.5, 3.0, value=1.5, step=0.1, label="PEG mol%")
                                                d_size = gr.Slider(60, 150, value=90, step=5, label="Target size (nm)")
                                            b_dc  = gr.Button("Rank CSF Formulations", variant="primary")
                                            o_dct = gr.Dataframe(label="CSF LNP ranking")
                                            o_dcp = gr.Image(label="ApoE% in CSF corona")
                                            b_dc.click(dipg_csf, [d_peg, d_size], [o_dct, o_dcp])
                                        with gr.TabItem("Research Gap"):
                                            gr.Markdown(
                                                "**Data:** PBTA (n=240) · GSE126319 (n=28) · GTEx circadian genes\n\n"
                                                "| Layer | Known | This study gap |\n"
                                                "|-------|-------|----------------|\n"
                                                "| Genomics | H3K27M freq=78% | H3K27M × BMAL1/CLOCK |\n"
                                                "| Delivery | CED convection | LNP corona **in CSF** |\n"
                                                "| Biology | PRC2 inhibition | Ferroptosis in H3K27M+ DIPG |"
                                            )
                        with gr.TabItem("R2 · UVM"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R2a · UVM Toolkit"):
                                    gr.HTML(proj_badge("S1-F·R2a", "UVM Toolkit", "TCGA-UVM n=80"))
                                    gr.Markdown(
                                        "> **Why UVM?** Uveal Melanoma — metastatic 5-yr survival **15%**. "
                                        "GNAQ/GNA11 mutations in 78% cases. "
                                        "Vitreous humor protein corona has **never been profiled**. "
                                        "METTL3/WTAP upregulated in GNAQ+ tumors — 0 therapeutic studies."
                                    )
                                    with gr.Tabs():
                                        with gr.TabItem("Variants + m6A"):
                                            b_uv = gr.Button("Load UVM Variants", variant="primary")
                                            o_uv = gr.Dataframe(label="GNAQ/GNA11 map · TCGA-UVM")
                                            b_uv.click(uvm_variants, [], o_uv)
                                        with gr.TabItem("Vitreous LNP"):
                                            b_uw  = gr.Button("Rank Vitreous Formulations", variant="primary")
                                            o_uwt = gr.Dataframe(label="Vitreous LNP retention ranking")
                                            o_uwp = gr.Image(label="Retention (hours)")
                                            b_uw.click(uvm_vitreous, [], [o_uwt, o_uwp])
                                        with gr.TabItem("Research Gap"):
                                            gr.Markdown(
                                                "**Data:** TCGA-UVM (n=80) · GEO m6A atlases · Vitreous proteomics\n\n"
                                                "| Layer | Known | This study gap |\n"
                                                "|-------|-------|----------------|\n"
                                                "| Genomics | GNAQ/GNA11 mutations | m6A landscape GNAQ+ vs GNA11+ |\n"
                                                "| Delivery | Intravitreal injection | LNP corona **in vitreous humor** |\n"
                                                "| Biology | PLCβ→PKC→MAPK | GNAQ × METTL3 × YTHDF2 axis |"
                                            )
                        with gr.TabItem("R3 · pAML"):
                            with gr.Tabs(elem_classes="sub-tabs"):
                                with gr.TabItem("R3a · pAML Toolkit"):
                                    gr.HTML(proj_badge("S1-F·R3a", "pAML Toolkit", "TARGET-AML n≈197"))
                                    gr.Markdown(
                                        "> **Why pAML?** Pediatric AML — relapse OS **<30%**. "
                                        "FLT3-ITD in 25% cases. "
                                        "Bone marrow niche LNP corona: **never studied**. "
                                        "Ferroptosis–FLT3 intersection: 0 prior studies (FerrDb v2 confirmed)."
                                    )
                                    with gr.Tabs():
                                        with gr.TabItem("Ferroptosis Explorer"):
                                            var_sel = gr.Dropdown(
                                                ["FLT3-ITD", "NPM1 c.860_863dupTCAG", "DNMT3A p.R882H",
                                                 "CEBPA biallelic", "IDH1/2 mutation"],
                                                value="FLT3-ITD", label="Select variant"
                                            )
                                            b_pf  = gr.Button("Analyze Ferroptosis Profile", variant="primary")
                                            o_pft = gr.HTML()
                                            o_pfp = gr.Image(label="Target radar")
                                            b_pf.click(paml_ferroptosis, var_sel, [o_pft, o_pfp])
                                        with gr.TabItem("BM Niche LNP"):
                                            gr.Dataframe(
                                                value=pd.DataFrame(PAML_BM_LNP),
                                                label="Bone marrow niche LNP candidates · TARGET-AML context"
                                            )
                                        with gr.TabItem("Research Gap"):
                                            gr.Markdown(
                                                "**Data:** TARGET-AML (n=197) · BeatAML · FerrDb v2\n\n"
                                                "| Layer | Known | This study gap |\n"
                                                "|-------|-------|----------------|\n"
                                                "| Genomics | FLT3-ITD → Midostaurin | FLT3-ITD × GPX4/SLC7A11 |\n"
                                                "| Delivery | Liposomal daunorubicin | LNP corona **in bone marrow** |\n"
                                                "| Biology | Midostaurin inhibits FLT3 | Ferroptosis SL + FLT3i |"
                                            )

                # === S1-G · 3D Lab === (залишається без змін)
                with gr.TabItem("🧊 S1-G"):
                    gr.HTML(section_header(
                        "S1-G", "PHYLO-SIM", "— 3D Models & Simulations",
                        "Interactive visualizations for learning"
                    ))
                    with gr.Tabs(elem_classes="main-tabs"):
                        with gr.TabItem("Nanoparticle"):
                            gr.Markdown("### 3D Model of a Lipid Nanoparticle")
                            with gr.Row():
                                np_radius = gr.Slider(2, 20, value=5, step=1, label="Radius (nm)")
                                np_peg = gr.Slider(0, 1, value=0.3, step=0.05, label="PEG density")
                            np_btn = gr.Button("Generate", variant="primary")
                            np_plot = gr.Plot(label="Nanoparticle")
                            np_btn.click(plot_nanoparticle, [np_radius, np_peg], np_plot)

                        with gr.TabItem("DNA Helix"):
                            gr.Markdown("### 3D Model of a DNA Double Helix")
                            dna_btn = gr.Button("Generate DNA", variant="primary")
                            dna_plot = gr.Plot()
                            dna_btn.click(plot_dna, [], dna_plot)

                        with gr.TabItem("Protein Corona"):
                            gr.Markdown("### Schematic of Protein Corona on Nanoparticle")
                            corona_btn = gr.Button("Show Corona", variant="primary")
                            corona_plot = gr.Plot()
                            corona_btn.click(plot_corona, [], corona_plot)

                # === Learning === (залишається без змін)
                with gr.TabItem("📚 Learning"):
                    gr.Markdown("""
## 🧪 Guided Investigations — S1 Biomedical
> 🟢 Beginner → 🟡 Intermediate → 🔴 Advanced

---
### 🟢 Case 1 · S1-A·R1a
**Why does the same position give two different outcomes?**
1. Go to **S1-A · R1a · OpenVariant**.
2. Enter `BRCA1:p.R1699Q` → you get **Benign**.
3. Enter `BRCA1:p.R1699W` → you get **Pathogenic**.
4. Same codon, different amino acid — Q (polar, neutral) vs W (bulky, aromatic).  
   *This illustrates how a single nucleotide change can radically alter pathogenicity.*

---
### 🟢 Case 2 · S1-D·R1a + S1-D·R3a
**How does PEG density control which protein forms the corona?**
1. Go to **S1-D · R1a · LNP Corona**.
2. Set: Size=100 nm, Zeta=-5 mV, Lipid=Ionizable, PEG=**0.5%** → note the dominant protein.
3. Change PEG to **2.5%** → run again → dominant protein changes.
4. Now go to **S1-D · R3a · LNP Brain**, use pKa≈6.5, Zeta≈-3 mV → observe ApoE%.  
   *Higher PEG shields the surface, reducing ApoE adsorption and brain targeting.*

---
### 🟡 Case 3 · S1-D·R2a
**Does blood flow change the corona composition over time?**
1. Go to **S1-D · R2a · Flow Corona**.
2. Set Flow = 0 (static) → run → note when ApoE becomes dominant (≈ ? min).
3. Set Flow = 40 cm/s (arterial) → run again → compare curves.  
   *Flow accelerates the Vroman effect: ApoE dominates earlier under flow.*

---
### 🟡 Case 4 · S1-B·R2a
**Which cancer type has the most novel (undrugged) siRNA targets?**
1. Go to **S1-B · R2a · siRNA**.
2. Select LUAD → count how many targets are marked "Novel".
3. Repeat for BRCA and COAD.  
   *Novel targets have no approved drug – they represent high‑opportunity research areas.*

---
### 🔴 Case 5 · S1-E·R1a
**What is the minimum protein signal that flips the classifier to CANCER?**
1. Go to **S1-E · R1a · Liquid Biopsy**.
2. Set all sliders to 0 → result = HEALTHY.
3. Increase only CTHRC1 step by step (e.g., 0.5, 1.0, 1.5…) until the label becomes CANCER.
4. Reset and try the same with FHL2 or LDHA.  
   *CTHRC1 has the highest weight; you need ≈2.5 to cross the threshold.*

---
### 🔴 Case 6 · Cross‑tool convergence
**Do different RNA tools point to the same cancer drivers?**
1. Go to **S1-B · R1a · miRNA** → select TP53 → note top targets (BCL2, CDK6).
2. Go to **S1-C · R1a · FGFR3** → look for CDK6 in the pathway column.
3. Go to **S1-B · R2a · siRNA** → select BRCA → check if CDK6 appears.  
   *CDK6 is a common node – targeted by miRNAs, siRNAs, and existing drugs.*

---
### 📖 Tool Index
| Code | Module | Tool | Metric |
|------|--------|------|--------|
| S1-A·R1a | PHYLO-GENOMICS | OpenVariant | AUC=0.939 |
| S1-B·R1a | PHYLO-RNA | miRNA silencing | top: hsa-miR-148a |
| S1-B·R2a | PHYLO-RNA | siRNA SL | SPC24 top LUAD |
| S1-B·R3a | PHYLO-RNA | lncRNA-TREM2 | CYTOR→AKT1 |
| S1-C·R1a | PHYLO-DRUG | FGFR3 drug | score=0.793 |
| S1-D·R1a | PHYLO-LNP | Corona | AUC=0.791 |
| S1-D·R2a | PHYLO-LNP | Flow Vroman | 3–4× faster |
| S1-D·R3a | PHYLO-LNP | LNP Brain | pKa 6.2–6.8 |
| S1-D·R4a | PHYLO-LNP | AutoCorona NLP | F1=0.71 |
| S1-D·R6a | PHYLO-LNP | Corona Database | simulated |
| S1-E·R1a | PHYLO-BIOMARKERS | Liquid Biopsy | AUC=0.992* |
| S1-E·R2a | PHYLO-BIOMARKERS | Multi-protein biomarkers | simulated |
""")

                # === Journal (окрема вкладка) ===
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

        # Права колонка – швидке введення нотаток
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

    # Інтеграція з Research Suite
    with gr.Row():
        gr.Markdown("""
        ---
        ### 🚀 Ready for real data?
        Try our **[Cancer Research Suite](https://huggingface.co/spaces/K-RnD-Lab/Cancer-Research-Suite_03-2026)** with live PubMed, ClinVar and OpenTargets APIs.
        """)
    
    gr.Markdown(
        "---\n**K R&D Lab** · MIT License · "
        "[GitHub](https://github.com/K-RnD-Lab) · "
        "[HuggingFace](https://huggingface.co/K-RnD-Lab) · "
        "[KOSATIKS GROUP](https://kosatiks-group.pp.ua)"
    )

demo.queue()
demo.launch(show_api=False)