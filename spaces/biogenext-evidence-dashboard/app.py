"""BioGENext 2026 — From data to clinical decision.

Run:
    streamlit run app.py
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


st.set_page_config(
    page_title="BioGENext · From Data to Decision",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .stApp { background: #090d16; color: #e8f0ff; }
    [data-testid="stSidebar"] { background: #0c1322; border-right: 1px solid #1d304d; }
    h1, h2, h3 { color: #f3f7ff; letter-spacing: -0.02em; }
    h1 { font-size: 2.4rem; }
    .subtitle { color: #91a8c8; font-size: 1.05rem; margin-top: -0.5rem; }
    .eyebrow { color: #56f0d0; font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; }
    .source { color: #7187a8; font-size: 0.78rem; margin-top: 0.4rem; }
    .metric-card {
        background: #101a2b; border: 1px solid #213b60; border-radius: 10px;
        padding: 1rem 1.1rem; min-height: 116px;
    }
    .metric-label { color: #91a8c8; font-size: 0.82rem; }
    .metric-value { color: #56f0d0; font-size: 1.75rem; font-weight: 700; margin-top: 0.35rem; }
    .metric-note { color: #748ba9; font-size: 0.75rem; margin-top: 0.35rem; }
    .callout {
        background: #111c31; border-left: 3px solid #56f0d0; padding: 0.9rem 1rem;
        border-radius: 0 8px 8px 0; color: #d7e4f7;
    }
    .small { color: #9bb0cc; font-size: 0.88rem; }
    </style>
    """,
    unsafe_allow_html=True,
)

COLORS = {
    "bg": "#090d16",
    "panel": "#101a2b",
    "grid": "#21334f",
    "text": "#dbe8fa",
    "muted": "#91a8c8",
    "mint": "#56f0d0",
    "blue": "#5da9ff",
    "violet": "#b692ff",
    "orange": "#ffb86b",
    "pink": "#ff76b7",
}


def chart_layout(fig, height=360):
    fig.update_layout(
        height=height,
        paper_bgcolor=COLORS["bg"],
        plot_bgcolor=COLORS["bg"],
        font=dict(color=COLORS["text"]),
        margin=dict(l=20, r=20, t=45, b=35),
        legend=dict(bgcolor="rgba(0,0,0,0)", font=dict(color=COLORS["muted"])),
        title_font=dict(size=16, color="#f3f7ff"),
    )
    fig.update_xaxes(gridcolor=COLORS["grid"], zerolinecolor=COLORS["grid"])
    fig.update_yaxes(gridcolor=COLORS["grid"], zerolinecolor=COLORS["grid"])
    return fig


def metric(label, value, note):
    st.markdown(
        f'<div class="metric-card"><div class="metric-label">{label}</div>'
        f'<div class="metric-value">{value}</div><div class="metric-note">{note}</div></div>',
        unsafe_allow_html=True,
    )


st.markdown('<div class="eyebrow">BioGENext 2026 · evidence map</div>', unsafe_allow_html=True)
st.title("From data to clinical decision")
st.markdown(
    '<div class="subtitle">What happens between a biological signal, a model, and a patient decision?</div>',
    unsafe_allow_html=True,
)

with st.sidebar:
    st.markdown("### Navigation")
    view = st.radio(
        "Section",
        ["Overview", "Metagenomics", "Models & validation", "Ukraine pipeline", "Evidence notes"],
        label_visibility="collapsed",
    )
    st.divider()
    st.markdown("**Evidence level**")
    st.caption("The figures below come from BioGENext slides or are labeled as benchmark / proposal. They are not clinical validation of K-RnD Lab.")

if view == "Overview":
    st.markdown(
        '<div class="callout"><b>Core thesis:</b>  in biomedicine, building a model is not enough. '
        'The result needs a route to an experiment, a regulatory pathway, and a clinical decision.</div>',
        unsafe_allow_html=True,
    )
    st.write("")

    cols = st.columns(4)
    with cols[0]:
        metric("Cities in the metagenomics study", "60", "conference slide")
    with cols[1]:
        metric("Samples", "4 728", "conference slide")
    with cols[2]:
        metric("Unmapped reads", "34.6%", "not mapped to existing databases")
    with cols[3]:
        metric("Pannotator speedup", "4.2×", "8 154 genomes benchmark")

    st.subheader("One pipeline — several points of failure")
    pipeline = pd.DataFrame(
        {
            "Stage": ["Data", "Model", "Experiment", "Diagnostics", "Decision", "Therapy"],
            "Index": [100, 82, 58, 35, 18, 8],
        }
    )
    fig = px.funnel(
        pipeline,
        y="Stage",
        x="Index",
        title="Illustrative signal-to-decision map (not measured data)",
    )
    fig.update_traces(marker_color=COLORS["mint"], textinfo="value")
    fig.update_xaxes(title="Illustrative pipeline index (not a clinical metric)")
    fig.update_yaxes(title="")
    chart_layout(fig, 390)
    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})
    st.markdown(
        '<div class="source">Illustrative index for explaining the K-RnD Lab pipeline; '
        '100 → 8 does not come from a study and does not describe real-world attrition.</div>',
        unsafe_allow_html=True,
    )

elif view == "Metagenomics":
    st.subheader("Metagenomics: data scale and the limits of what is known")
    st.markdown(
        '<div class="small">One presentation showed not a “finished answer,” but the scale of the problem: '
        'a large share of biological signal still has no reliable match in existing databases.</div>',
        unsafe_allow_html=True,
    )
    st.write("")

    scale = pd.DataFrame(
        {
            "Metric": ["Samples", "Bacteria", "Viruses", "CRISPR arrays"],
            "Value": [4728, 748, 10928, 838532],
        }
    )
    fig = px.bar(
        scale,
        x="Metric",
        y="Value",
        title="Metagenomics study scale",
        color="Metric",
        color_discrete_sequence=[COLORS["mint"], COLORS["blue"], COLORS["violet"], COLORS["pink"]],
    )
    fig.update_yaxes(type="log", title="Count (log scale)")
    fig.update_xaxes(title="")
    fig.update_layout(showlegend=False)
    chart_layout(fig, 390)
    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})
    st.markdown(
        '<div class="source">Source: Alina Frolova, “Metagenomics in Practice: From Urban Microbiomes to Human Health”, BioGENext 2026 slide.</div>',
        unsafe_allow_html=True,
    )

    left, right = st.columns(2)
    with left:
        unmapped = pd.DataFrame({"Category": ["Mapped", "Not mapped"], "Reads": [65.4, 34.6]})
        fig = px.pie(
            unmapped,
            values="Reads",
            names="Category",
            hole=0.62,
            title="Reads mapped to databases",
            color_discrete_sequence=[COLORS["blue"], COLORS["orange"]],
        )
        fig.update_traces(textinfo="label+percent")
        chart_layout(fig, 330)
        st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})
        st.markdown('<div class="source">34.6% — share of reads that did not match existing databases.</div>', unsafe_allow_html=True)
    with right:
        runtime = pd.DataFrame({"Tool": ["Bakta", "Pannotator"], "Seconds": [930.9, 220.5]})
        fig = px.bar(
            runtime,
            x="Tool",
            y="Seconds",
            title="Annotation runtime per sample",
            text="Seconds",
            color="Tool",
            color_discrete_sequence=[COLORS["pink"], COLORS["mint"]],
        )
        fig.update_yaxes(title="Seconds per sample")
        fig.update_xaxes(title="")
        fig.update_traces(texttemplate="%{text:.1f}s", textposition="outside")
        chart_layout(fig, 330)
        st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})
        st.markdown('<div class="source">n=8,154; benchmark slide: 930.9 → 220.5 s, approximately 4.2×.</div>', unsafe_allow_html=True)

elif view == "Models & validation":
    st.subheader("A model is not evidence")
    st.markdown(
        '<div class="small">Even a strong computational result needs experimental validation. '
        'This view separates prediction, benchmark, and confirmed binding.</div>',
        unsafe_allow_html=True,
    )
    st.write("")

    tested = pd.DataFrame(
        {
            "Target": ["GLP-2", "GABARAP", "MRGPRX2", "STAT6", "ROR1", "WNR"],
            "Tested": [51, 28, 38, 37, 34, 27],
            "Positive / confirmed": [12, 3, 10, 1, 2, 2],
        }
    )
    tested["Rate"] = tested["Positive / confirmed"] / tested["Tested"] * 100
    fig = px.bar(
        tested,
        x="Target",
        y=["Tested", "Positive / confirmed"],
        barmode="group",
        title="Boltz: tested compounds vs positive results",
        color_discrete_sequence=[COLORS["blue"], COLORS["mint"]],
    )
    fig.update_yaxes(title="Number of compounds")
    fig.update_xaxes(title="")
    chart_layout(fig, 390)
    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})
    st.markdown(
        '<div class="source">Source: Boltz presentation, BioGENext 2026. Positive results are not equivalent to an approved drug.</div>',
        unsafe_allow_html=True,
    )

    cols = st.columns(3)
    with cols[0]:
        metric("Werner helicase", "2 / 27", "confirmed binders / tested compounds")
    with cols[1]:
        metric("IC50", "24 & 8.6 μM", "two confirmed binders")
    with cols[2]:
        metric("fastLBP example", "r = 0.28", "CHI3L1 expression prediction")

    st.info(
        "Important data clarification: the 87% figure belongs to an ErCas12a experimental assay, not a K-RnD Lab metagenomics model. It should not be presented as our accuracy."
    )

elif view == "Ukraine pipeline":
    st.subheader("Ukraine’s route: from policy to pipeline")
    st.markdown(
        '<div class="small">The conference showed not only biological models, but also the infrastructure '
        'needed to make them usable.</div>',
        unsafe_allow_html=True,
    )
    st.write("")

    cols = st.columns(4)
    with cols[0]:
        metric("New cancer cases / year", "155 239", "figure shown on policy slide")
    with cols[1]:
        metric("Deaths / year", "84 153", "figure shown on policy slide")
    with cols[2]:
        metric("Mortality / incidence", "0.54", "EU comparison: 0.35–0.40")
    with cols[3]:
        metric("Phase I pilot", "500 cases", "UBI Hub proposal")

    roadmap = pd.DataFrame(
        {
            "Phase": ["Phase I", "Phase II", "Phase III"],
            "Period": ["2025–26", "2027–28", "2027–30"],
            "Focus": ["legal + 500-case pilot", "AI, NGS, OncoAtlas-UA", "ecosystem + partnerships"],
        }
    )
    fig = go.Figure()
    colors = [COLORS["mint"], COLORS["blue"], COLORS["violet"]]
    for i, row in roadmap.iterrows():
        fig.add_trace(
            go.Scatter(
                x=[i, i + 0.8],
                y=[1, 1],
                mode="lines+markers+text",
                line=dict(color=colors[i], width=10),
                marker=dict(size=16, color=colors[i]),
                text=[row["Phase"], row["Period"]],
                textposition=["top center", "bottom center"],
                hovertext=row["Focus"],
                hoverinfo="text",
                showlegend=False,
            )
        )
    fig.update_xaxes(range=[-0.4, 2.2], visible=False)
    fig.update_yaxes(range=[0.7, 1.3], visible=False)
    fig.update_layout(title="UBI Hub proposal roadmap", height=250)
    chart_layout(fig, 280)
    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})
    st.markdown(
        '<div class="source">Source: “From Policy to Pipeline” presentation, BioGENext 2026. This is a proposal/roadmap, not a claim that every component is already operational.</div>',
        unsafe_allow_html=True,
    )

elif view == "Evidence notes":
    st.subheader("What each figure means")
    notes = [
        ("Conference slide", "a figure shown by the speaker on a slide; cite the talk title"),
        ("Benchmark", "a comparison of tools or models on a specific dataset"),
        ("Experimental", "a laboratory validation result, but not necessarily clinical"),
        ("Proposal", "planned infrastructure or roadmap, not an operational system"),
        ("K-RnD prototype", "research or simulated result; not clinical validation"),
    ]
    for label, description in notes:
        st.markdown(f"**{label}** — {description}")

    st.divider()
    st.markdown("### What is intentionally not shown here")
    st.markdown(
        """
        - 87% accuracy as a K-RnD metagenomics result — there is no evidence for this claim.
        - claims that clinicians are already using these models;
        - the conclusion that a metagenomics test alone diagnoses or predicts disease;
        - claims that the UBI Hub is already fully operational.
        """
    )
    st.markdown(
        '<div class="callout"><b>Next research step:</b>  add the dataset, '
        'validation type, unit of measurement, and next result user to every metric.</div>',
        unsafe_allow_html=True,
    )
