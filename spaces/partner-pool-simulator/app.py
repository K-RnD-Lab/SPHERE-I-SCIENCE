from __future__ import annotations

import pandas as pd
import plotly.express as px
import streamlit as st

from src.assumptions import BASELINE, DATA_QUALITY_NOTES
from src.model_pool import Criteria, estimate_pool, sensitivity_table


def format_count(value: int | float) -> str:
    return f"{value:,.0f}"


def parse_count(value: str, fallback: int) -> int:
    cleaned = value.replace(",", "").replace(" ", "").strip()
    if not cleaned:
        return fallback
    return int(cleaned)


def title_label(value: str) -> str:
    return value.replace("_", " ").title()


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
    base_population_text = st.text_input(
        "Baseline population",
        value=format_count(BASELINE.total_reference_population),
        help=f"Reference population before filters, formatted with commas. Demo default: {format_count(BASELINE.total_reference_population)}.",
    )
    try:
        base_population = parse_count(base_population_text, BASELINE.total_reference_population)
    except ValueError:
        st.warning("Use digits with optional commas, for example 10,000,000.")
        base_population = BASELINE.total_reference_population
    if not 10_000 <= base_population <= 50_000_000:
        st.warning("Baseline population should stay between 10,000 and 50,000,000 for this demo.")
        base_population = max(10_000, min(base_population, 50_000_000))

    target_population = st.selectbox(
        "Target population",
        ["all_adults", "women", "men"],
        format_func=title_label,
        help="Applies a demo sex-share coefficient before the other filters. Women: 53%, Men: 47%, All adults: 100%.",
    )
    age_min, age_max = st.slider(
        "Age range",
        18,
        70,
        (28, 42),
        help="Narrows the pool by the selected age-band overlap.",
    )
    region_scope = st.selectbox(
        "Region scope",
        ["all_ukraine", "large_cities", "kyiv_region", "western_regions"],
        format_func=title_label,
        help="Applies the selected regional scope coefficient.",
    )
    relationship_status = st.selectbox(
        "Relationship status",
        ["any", "not_married", "single_or_divorced"],
        format_func=title_label,
        help="Demo availability proxy. Official marital status is not the same as real availability.",
    )
    min_height = st.slider(
        "Minimum height, cm",
        150,
        205,
        175,
        help="Interpolates a demo height-distribution coefficient.",
    )
    income_level = st.selectbox(
        "Income threshold",
        ["any", "above_median", "top_25", "top_10"],
        format_func=title_label,
        help="Applies an estimated income threshold coefficient.",
    )
    education_level = st.selectbox(
        "Education filter",
        ["any", "higher_education", "graduate_plus"],
        format_func=title_label,
        help="Applies an estimated education-level coefficient.",
    )

criteria = Criteria(
    base_population=base_population,
    target_population=target_population,
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
col_a.metric("Conservative estimate", format_count(estimate.conservative))
col_b.metric("Central estimate", format_count(estimate.central))
col_c.metric("Optimistic estimate", format_count(estimate.optimistic))

st.subheader("What narrows the pool")
step_df = pd.DataFrame(steps)
display_df = step_df.assign(
    coefficient=step_df["coefficient"].map("{:.4f}".format),
    remaining=step_df["remaining"].map(format_count),
)
fig = px.bar(
    step_df,
    x="factor",
    y="remaining",
    text="remaining",
    custom_data=["coefficient"],
    title="Remaining estimated pool after each criterion",
)
fig.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
fig.update_traces(
    hovertemplate="<b>%{x}</b><br>Remaining: %{y:,.0f}<br>Coefficient: %{customdata[0]:.4f}<extra></extra>"
)
fig.update_layout(yaxis_title="Estimated remaining pool", xaxis_title="")
st.plotly_chart(fig, use_container_width=True)

st.subheader("Scenario details")
st.dataframe(display_df, use_container_width=True, hide_index=True)

st.subheader("Data quality notes")
for note in DATA_QUALITY_NOTES:
    st.write(f"- **{note['label']}**: {note['note']}")

st.subheader("Interpretation guardrails")
st.write(
    "This model estimates a demographic scenario, not compatibility, attraction, safety, or relationship success. "
    "A stricter filter can make a pool smaller, but it does not define a person's real-life chances."
)
