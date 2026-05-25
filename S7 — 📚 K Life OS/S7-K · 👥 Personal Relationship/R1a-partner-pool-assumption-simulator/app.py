from __future__ import annotations

import pandas as pd
import plotly.express as px
import streamlit as st

from src.assumptions import BASELINE, DATA_QUALITY_NOTES
from src.model_pool import Criteria, estimate_pool, sensitivity_table


st.set_page_config(
    page_title="Partner Pool Assumption Simulator",
    page_icon="S7",
    layout="wide",
)

st.title("Partner Pool Assumption Simulator")
st.caption("S7-K · Personal Relationship · transparent demo model")

st.info(
    "Prototype status: current numbers are demo assumptions. Use this app to test model logic, "
    "not to claim a factual count of available partners."
)

with st.sidebar:
    st.header("Scenario")
    base_population = st.number_input(
        "Baseline population",
        min_value=10_000,
        max_value=50_000_000,
        value=BASELINE.total_reference_population,
        step=50_000,
    )
    age_min, age_max = st.slider("Age range", 18, 70, (28, 42))
    region_scope = st.selectbox(
        "Region scope",
        ["all_ukraine", "large_cities", "kyiv_region", "western_regions"],
        format_func=lambda value: value.replace("_", " ").title(),
    )
    relationship_status = st.selectbox(
        "Relationship status",
        ["any", "not_married", "single_or_divorced"],
        format_func=lambda value: value.replace("_", " ").title(),
    )
    min_height = st.slider("Minimum height, cm", 150, 205, 175)
    income_level = st.selectbox(
        "Income threshold",
        ["any", "above_median", "top_25", "top_10"],
        format_func=lambda value: value.replace("_", " ").title(),
    )
    education_level = st.selectbox(
        "Education filter",
        ["any", "higher_education", "graduate_plus"],
        format_func=lambda value: value.replace("_", " ").title(),
    )

criteria = Criteria(
    base_population=base_population,
    age_min=age_min,
    age_max=age_max,
    region_scope=region_scope,
    relationship_status=relationship_status,
    min_height_cm=min_height,
    income_level=income_level,
    education_level=education_level,
)

estimate = estimate_pool(criteria)
steps = sensitivity_table(criteria)

col_a, col_b, col_c = st.columns(3)
col_a.metric("Conservative estimate", f"{estimate.conservative:,.0f}")
col_b.metric("Central estimate", f"{estimate.central:,.0f}")
col_c.metric("Optimistic estimate", f"{estimate.optimistic:,.0f}")

st.subheader("What narrows the pool")
step_df = pd.DataFrame(steps)
fig = px.bar(
    step_df,
    x="factor",
    y="remaining",
    text="remaining",
    title="Remaining estimated pool after each criterion",
)
fig.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
fig.update_layout(yaxis_title="Estimated remaining pool", xaxis_title="")
st.plotly_chart(fig, use_container_width=True)

st.subheader("Scenario details")
st.dataframe(step_df, use_container_width=True, hide_index=True)

st.subheader("Data quality notes")
for note in DATA_QUALITY_NOTES:
    st.write(f"- **{note['label']}**: {note['note']}")

st.subheader("Interpretation guardrails")
st.write(
    "This model estimates a demographic scenario, not compatibility, attraction, safety, or relationship success. "
    "A stricter filter can make a pool smaller, but it does not define a person's real-life chances."
)
