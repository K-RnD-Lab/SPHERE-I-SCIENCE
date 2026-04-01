"""
BRCA2 miRNA Explorer — Gradio Interactive Demo
Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant Breast Cancer

Author : Oksana Kolisnyk · KOSATIKS GROUP · kosatiks-group.pp.ua
GitHub : https://github.com/TEZv/K-RnD-Lab-PHYLO-03_2026/tree/main/01_A1-brca2-mirna
HF     : https://huggingface.co/spaces/TEZv/PHYLO-BIO-01_A1-brca2-mirna
License: MIT
"""

import gradio as gr
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import os, io
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE = Path(__file__).parent
FIG_DIR = BASE / "figures"
DATA_DIR = BASE / "tmp"

# ── Load data ─────────────────────────────────────────────────────────────────
def load_data():
    de = pd.read_csv(DATA_DIR / "de_results_limma_pam50adj.csv")
    cands = pd.read_csv(BASE / "candidate_table_final.csv")
    kegg = pd.read_csv(DATA_DIR / "kegg_enrichment_full.csv")
    return de, cands, kegg

try:
    de_df, cands_df, kegg_df = load_data()
    DATA_LOADED = True
except Exception as e:
    DATA_LOADED = False
    DATA_ERROR = str(e)

# ── Colour palette ────────────────────────────────────────────────────────────
MIRNA_COLORS = {
    "MIR148A": "#E63946", "MIR30E": "#2166AC", "MIR551B": "#F4A261",
    "MIR363":  "#52B788", "MIR150": "#9B5DE5", "MIR29A":  "#F15BB5",
}
PRIMARY = {"MIR148A", "MIR30E", "MIR551B"}

# ─────────────────────────────────────────────────────────────────────────────
# TAB 1 — Overview
# ─────────────────────────────────────────────────────────────────────────────
OVERVIEW_MD = """
# BRCA2 miRNA Explorer

**Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant Breast Cancer**

---

### Study Design
| Parameter | Value |
|-----------|-------|
| Dataset | TCGA BRCA (`brca_tcga_pub`, Nature 2012) |
| Samples with miRNA-seq | 300 |
| BRCA2-mutant (somatic) | 13 |
| BRCA2-wildtype | 287 |
| miRNAs tested | 186 |
| DE model | limma · `~ PAM50_subtype + BRCA2_status` |
| Expression values | log₂ RPM (cBioPortal) |

### Key Results
| miRNA | miRBase ID | log₂FC | p-value | Key targets |
|-------|-----------|--------|---------|-------------|
| **MIR148A** | hsa-miR-148a-3p | −0.699 | 0.013 | DNMT1, DNMT3B, AKT2 |
| **MIR30E** | hsa-miR-30e-5p | −0.486 | 0.032 | MYC, KRAS, ATM |
| **MIR551B** | hsa-miR-551b-3p | −0.586 | 0.048 | SMAD4, CDK6, TGFBR2 |

> **Note:** All results are exploratory (nominal p-values; N=13 BRCA2-mutant).
> No FDR-significant results were obtained, consistent with the underpowered design.

### Links
- GitHub: [TEZv/K-RnD-Lab-BIO-03_2026](https://github.com/TEZv/K-RnD-Lab-BIO-03_2026)
- Author: [Oksana Kolisnyk · KOSATIKS GROUP](https://kosatiks-group.pp.ua)
"""

# ─────────────────────────────────────────────────────────────────────────────
# TAB 2 — DE Results table + interactive volcano
# ─────────────────────────────────────────────────────────────────────────────
def filter_de(p_thresh, fc_thresh, direction):
    if not DATA_LOADED:
        return pd.DataFrame({"Error": [DATA_ERROR]})
    df = de_df.copy()
    df = df[df["P.Value"] <= p_thresh]
    df = df[df["logFC"].abs() >= fc_thresh]
    if direction == "Downregulated only":
        df = df[df["logFC"] < 0]
    elif direction == "Upregulated only":
        df = df[df["logFC"] > 0]
    df = df.sort_values("P.Value")
    df["logFC"] = df["logFC"].round(3)
    df["P.Value"] = df["P.Value"].map(lambda x: f"{x:.4f}")
    df["adj.P.Val"] = df["adj.P.Val"].map(lambda x: f"{x:.3f}")
    return df[["miRNA", "logFC", "P.Value", "adj.P.Val"]].rename(
        columns={"P.Value": "Nominal p", "adj.P.Val": "FDR"}
    )

def make_volcano(p_thresh, fc_thresh):
    if not DATA_LOADED:
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, "Data not loaded", ha="center", va="center")
        return fig
    df = de_df.copy()
    df["-log10p"] = -np.log10(df["P.Value"].clip(lower=1e-10))

    fig, ax = plt.subplots(figsize=(8, 6))
    fig.patch.set_facecolor("white")
    ax.set_facecolor("#F8F9FA")

    # Background points
    mask_ns = (df["P.Value"] > p_thresh) | (df["logFC"].abs() < fc_thresh)
    ax.scatter(df.loc[mask_ns, "logFC"], df.loc[mask_ns, "-log10p"],
               c="#CCCCCC", s=25, alpha=0.6, linewidths=0, zorder=2)

    # Significant points
    mask_sig = ~mask_ns
    for _, row in df[mask_sig].iterrows():
        col = MIRNA_COLORS.get(row["miRNA"], "#E63946" if row["logFC"] < 0 else "#2166AC")
        ax.scatter(row["logFC"], row["-log10p"],
                   c=col, s=60, alpha=0.9, linewidths=0.5,
                   edgecolors="black", zorder=4)
        ax.annotate(row["miRNA"].replace("MIR", "miR-"),
                    (row["logFC"], row["-log10p"]),
                    textcoords="offset points", xytext=(6, 3),
                    fontsize=8, color=col, fontweight="bold")

    # Threshold lines
    ax.axhline(-np.log10(p_thresh), color="#888888", lw=1, ls="--", alpha=0.7)
    ax.axvline(-fc_thresh, color="#888888", lw=1, ls="--", alpha=0.7)
    ax.axvline(fc_thresh, color="#888888", lw=1, ls="--", alpha=0.7)

    ax.set_xlabel("log₂ Fold Change (BRCA2-mut vs. WT)", fontsize=11)
    ax.set_ylabel("−log₁₀(nominal p-value)", fontsize=11)
    ax.set_title("Volcano Plot — PAM50-adjusted DE\nBRCA2-mutant vs. wildtype (TCGA BRCA)",
                 fontsize=11, fontweight="bold")
    ax.spines[["top", "right"]].set_visible(False)
    plt.tight_layout()
    return fig

# ─────────────────────────────────────────────────────────────────────────────
# TAB 3 — Candidate profiles
# ─────────────────────────────────────────────────────────────────────────────
CANDIDATE_PROFILES = {
    "hsa-miR-148a-3p (MIR148A) — Rank 1": {
        "mirna": "MIR148A",
        "mirbase": "hsa-miR-148a-3p",
        "log2fc": -0.699,
        "pval": 0.013,
        "fdr": 0.992,
        "n_targets": 293,
        "key_targets": "DNMT1, DNMT3B, AKT2, ROCK1, CDKN1A, AGO2",
        "top_pathways": "Pathways in cancer; Cell cycle; FoxO signaling",
        "rationale": (
            "**Strongest primary candidate** (log₂FC = −0.699, p = 0.013).\n\n"
            "miR-148a-3p suppresses **DNMT1** and **DNMT3B** — the principal DNA "
            "methyltransferases responsible for epigenetic silencing of tumor suppressor "
            "genes. This is directly relevant to BRCA2-mutant tumors, which exhibit "
            "widespread CpG hypermethylation. Additional targets include **AKT2** "
            "(PI3K/AKT pathway), **ROCK1** (invasion), and **CDKN1A** (cell cycle "
            "checkpoint). Loss of miR-148a has been reported across multiple cancer types "
            "and correlates with poor prognosis."
        ),
    },
    "hsa-miR-30e-5p (MIR30E) — Rank 2": {
        "mirna": "MIR30E",
        "mirbase": "hsa-miR-30e-5p",
        "log2fc": -0.486,
        "pval": 0.032,
        "fdr": 0.992,
        "n_targets": 513,
        "key_targets": "MYC, KRAS, MDM4, ATM, RELA, MAPK8",
        "top_pathways": "Pathways in cancer; MicroRNAs in cancer; Neurotrophin signaling",
        "rationale": (
            "**Most broadly connected candidate** (513 validated targets).\n\n"
            "Key targets include **MYC** and **KRAS** (major oncogenes), **ATM** "
            "(DNA damage response — functionally linked to BRCA2 in homologous "
            "recombination), **MDM4** (p53 negative regulator), and **RELA** "
            "(NF-κB subunit). The ATM connection is particularly notable: BRCA2 and "
            "ATM cooperate in DSB repair, and miR-30e downregulation may amplify DNA "
            "repair deficiency in BRCA2-mutant tumors."
        ),
    },
    "hsa-miR-551b-3p (MIR551B) — Rank 3": {
        "mirna": "MIR551B",
        "mirbase": "hsa-miR-551b-3p",
        "log2fc": -0.586,
        "pval": 0.048,
        "fdr": 0.992,
        "n_targets": 156,
        "key_targets": "SMAD4, TGFBR2, CDK6, IGF1R",
        "top_pathways": "TGF-beta signaling; Pathways in cancer; Hippo signaling",
        "rationale": (
            "**TGF-β/CDK6 axis candidate** (log₂FC = −0.586, p = 0.048).\n\n"
            "Targets the **TGF-β/SMAD4** axis (SMAD4, TGFBR2) and **CDK6**, making "
            "it a candidate for combination with CDK4/6 inhibitors (palbociclib, "
            "ribociclib) already used in HR+ breast cancer. TGF-β signaling promotes "
            "epithelial-mesenchymal transition and immune evasion in BRCA2-mutant tumors."
        ),
    },
}

def show_candidate(choice):
    p = CANDIDATE_PROFILES[choice]
    col = MIRNA_COLORS.get(p["mirna"], "#333333")
    md = f"""
### {p['mirbase']}

| Field | Value |
|-------|-------|
| log₂FC (BRCA2-mut vs. WT) | **{p['log2fc']:.3f}** |
| Nominal p-value | **{p['pval']:.4f}** |
| FDR (BH) | {p['fdr']:.3f} |
| Validated targets (miRTarBase) | {p['n_targets']} |
| Key target genes | {p['key_targets']} |
| Top KEGG pathways | {p['top_pathways']} |

---

#### Therapeutic Rationale

{p['rationale']}

---
> *All results are exploratory. Independent validation required.*
"""
    return md

# ─────────────────────────────────────────────────────────────────────────────
# TAB 4 — Pathway enrichment
# ─────────────────────────────────────────────────────────────────────────────
def filter_pathways(n_top, adj_p_thresh):
    if not DATA_LOADED:
        return pd.DataFrame({"Error": [DATA_ERROR]})
    df = kegg_df.copy()
    df = df[df["Adjusted P-value"] <= adj_p_thresh]
    df = df.sort_values("Adjusted P-value").head(n_top)
    df["Adjusted P-value"] = df["Adjusted P-value"].map(lambda x: f"{x:.2e}")
    df["P-value"] = df["P-value"].map(lambda x: f"{x:.2e}")
    df["Combined Score"] = df["Combined Score"].round(1)
    return df[["Term", "Overlap", "P-value", "Adjusted P-value", "Combined Score"]].rename(
        columns={"Adjusted P-value": "adj.p", "Combined Score": "Score"}
    )

def make_pathway_plot(n_top, adj_p_thresh):
    if not DATA_LOADED:
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, "Data not loaded", ha="center", va="center")
        return fig
    df = kegg_df.copy()
    df = df[df["Adjusted P-value"] <= adj_p_thresh]
    df = df.sort_values("Adjusted P-value").head(n_top)
    if df.empty:
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, "No pathways pass threshold", ha="center", va="center")
        return fig

    df["overlap_n"] = df["Overlap"].str.split("/").str[0].astype(int)
    df["-log10_adjp"] = -np.log10(df["Adjusted P-value"].astype(float).clip(lower=1e-15))
    df["Term_short"] = df["Term"].str[:55]
    df = df.sort_values("-log10_adjp")

    fig, ax = plt.subplots(figsize=(9, max(5, len(df) * 0.42)))
    fig.patch.set_facecolor("white")
    sc = ax.scatter(df["-log10_adjp"], range(len(df)),
                    s=df["overlap_n"] * 12,
                    c=df["-log10_adjp"],
                    cmap="YlOrRd", edgecolors="#333333", linewidths=0.5,
                    alpha=0.9, zorder=3)
    ax.set_yticks(range(len(df)))
    ax.set_yticklabels(df["Term_short"], fontsize=9)
    ax.set_xlabel("−log₁₀(adj. p-value)", fontsize=10)
    ax.set_title(f"Top {len(df)} KEGG Pathways\n(ORA on 907 target genes of primary candidates)",
                 fontsize=10, fontweight="bold")
    ax.axvline(x=-np.log10(0.05), color="#888888", lw=1, ls="--", alpha=0.6)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="x", alpha=0.3)
    plt.colorbar(sc, ax=ax, label="−log₁₀(adj. p)", shrink=0.6)
    plt.tight_layout()
    return fig

# ─────────────────────────────────────────────────────────────────────────────
# TAB 5 — Publication figures gallery
# ─────────────────────────────────────────────────────────────────────────────
FIGURES = {
    "Figure 1 — PRISMA Dataset Selection": "figure1_prisma.png",
    "Figure 2 — Volcano Plot (PAM50-adjusted DE)": "figure2_volcano.png",
    "Figure 3 — Expression Heatmap (Top 30 miRNAs)": "figure3_heatmap.png",
    "Figure 4 — Significance Overlap + Candidate Bar Chart": "figure4_venn.png",
    "Figure 5 — KEGG Pathway Enrichment Dot Plot": "figure5_pathway.png",
    "Figure 6 — miRNA → Target Gene Network": "figure6_network.png",
}

def show_figure(choice):
    fname = FIGURES[choice]
    fpath = FIG_DIR / fname
    if fpath.exists():
        return str(fpath)
    return None

# ─────────────────────────────────────────────────────────────────────────────
# Build Gradio UI
# ─────────────────────────────────────────────────────────────────────────────
THEME = gr.themes.Soft(
    primary_hue="blue",
    secondary_hue="orange",
    font=[gr.themes.GoogleFont("Inter"), "sans-serif"],
)

with gr.Blocks(theme=THEME, title="BRCA2 miRNA Explorer") as demo:

    gr.Markdown("""
    # BRCA2 miRNA Explorer
    **Identification of Tumor Suppressor miRNAs Silenced in BRCA2-Mutant Breast Cancer**
    Oksana Kolisnyk · [KOSATIKS GROUP](https://kosatiks-group.pp.ua) ·
    [GitHub](https://github.com/TEZv/K-RnD-Lab-BIO-03_2026) ·
    [Preprint](https://biorxiv.org/[BIORXIV_DOI])
    """)

    with gr.Tabs():

        # ── Tab 1: Overview ───────────────────────────────────────────────────
        with gr.Tab("Overview"):
            gr.Markdown(OVERVIEW_MD)

        # ── Tab 2: DE Results ─────────────────────────────────────────────────
        with gr.Tab("DE Results"):
            gr.Markdown("### Differential Expression — PAM50-adjusted limma\nFilter results interactively. All values from real TCGA BRCA analysis.")
            with gr.Row():
                p_slider = gr.Slider(0.01, 1.0, value=0.05, step=0.01,
                                     label="Nominal p-value threshold")
                fc_slider = gr.Slider(0.0, 2.0, value=0.0, step=0.05,
                                      label="|log₂FC| threshold")
                dir_radio = gr.Radio(
                    ["All", "Downregulated only", "Upregulated only"],
                    value="All", label="Direction"
                )
            de_table = gr.Dataframe(label="Filtered DE results", wrap=True)
            volcano_plot = gr.Plot(label="Volcano plot")

            def update_de(p, fc, direction):
                return filter_de(p, fc, direction), make_volcano(p, fc)

            run_btn = gr.Button("Apply filters", variant="primary")
            run_btn.click(update_de, [p_slider, fc_slider, dir_radio],
                          [de_table, volcano_plot])
            demo.load(update_de, [p_slider, fc_slider, dir_radio],
                      [de_table, volcano_plot])

        # ── Tab 3: Candidate Profiles ─────────────────────────────────────────
        with gr.Tab("Candidate Profiles"):
            gr.Markdown("### Primary Candidate miRNAs\nSelect a candidate to view its profile, validated targets, and therapeutic rationale.")
            cand_dropdown = gr.Dropdown(
                choices=list(CANDIDATE_PROFILES.keys()),
                value=list(CANDIDATE_PROFILES.keys())[0],
                label="Select candidate"
            )
            cand_output = gr.Markdown()
            cand_dropdown.change(show_candidate, cand_dropdown, cand_output)
            demo.load(show_candidate,
                      gr.State(list(CANDIDATE_PROFILES.keys())[0]),
                      cand_output)

        # ── Tab 4: Pathway Enrichment ─────────────────────────────────────────
        with gr.Tab("Pathway Enrichment"):
            gr.Markdown("### KEGG Pathway ORA\nOver-representation analysis on 907 validated target genes of the 3 primary candidates (miRTarBase + Enrichr).")
            with gr.Row():
                n_top_slider = gr.Slider(5, 50, value=15, step=1,
                                         label="Number of top pathways")
                adjp_slider = gr.Slider(0.001, 0.05, value=0.05, step=0.001,
                                        label="adj.p threshold")
            pathway_table = gr.Dataframe(label="Pathway enrichment results", wrap=True)
            pathway_plot = gr.Plot(label="Dot plot")

            def update_pathways(n, adjp):
                return filter_pathways(n, adjp), make_pathway_plot(n, adjp)

            path_btn = gr.Button("Apply filters", variant="primary")
            path_btn.click(update_pathways, [n_top_slider, adjp_slider],
                           [pathway_table, pathway_plot])
            demo.load(update_pathways, [n_top_slider, adjp_slider],
                      [pathway_table, pathway_plot])

        # ── Tab 5: Figures ────────────────────────────────────────────────────
        with gr.Tab("Publication Figures"):
            gr.Markdown("### Publication-Quality Figures\nAll figures generated at 300 DPI. SVG versions available in the repository.")
            fig_dropdown = gr.Dropdown(
                choices=list(FIGURES.keys()),
                value=list(FIGURES.keys())[0],
                label="Select figure"
            )
            fig_image = gr.Image(label="Figure", type="filepath")
            fig_dropdown.change(show_figure, fig_dropdown, fig_image)
            demo.load(show_figure,
                      gr.State(list(FIGURES.keys())[0]),
                      fig_image)

        # ── Tab 6: Methods & Citation ─────────────────────────────────────────
        with gr.Tab("Methods & Citation"):
            gr.Markdown("""
### Methods Summary

| Step | Details |
|------|---------|
| Data retrieval | cBioPortal API (`brca_tcga_pub`) — miRNA-seq + somatic mutations |
| BRCA2 mutations | Somatic nonsense, frameshift, splice-site, missense variants |
| Expression | log₂ RPM (cBioPortal pre-processed) |
| Filtering | ≥20% samples with expression (186/186 pass) |
| DE model | limma · `~ PAM50_subtype + BRCA2_status` |
| Multiple testing | BH FDR (reported; nominal p used for candidate selection) |
| Functional annotation | miRTarBase validated interactions (502,652 human) |
| Pathway enrichment | ORA via Enrichr/gseapy — KEGG, Reactome, GO |

### Limitations
- TCGA captures **somatic** BRCA2 mutations only (germline carriers not represented)
- N=13 BRCA2-mutant samples — all results are exploratory
- No FDR-significant results (expected; min detectable |log₂FC| = 0.61 at 80% power)

### Citation
```bibtex
@software{kolisnyk_2026_brca2_mirna,
  author = {Kolisnyk, Oksana},
  title  = {Identification of Tumor Suppressor miRNAs Silenced in
            BRCA2-Mutant Breast Cancer: A TCGA Meta-Analysis},
  year   = {2026},
  url    = {https://github.com/TEZv/K-RnD-Lab-BIO-03_2026},
  doi    = {[ZENODO_DOI]}
}
```

### Data Sources
- **TCGA BRCA:** cBioPortal `brca_tcga_pub` — https://www.cbioportal.org/study/summary?id=brca_tcga_pub
- **miRTarBase:** https://mirtarbase.cuhk.edu.cn/
- **Enrichr/KEGG:** https://maayanlab.cloud/Enrichr/
""")

    gr.Markdown("""
---
*Oksana Kolisnyk · ML Engineer & Researcher | Strategist · Producer · CREATOR*
*[KOSATIKS GROUP](https://kosatiks-group.pp.ua) · MIT License · 2026*
""")

if __name__ == "__main__":
    demo.launch(share=False)
