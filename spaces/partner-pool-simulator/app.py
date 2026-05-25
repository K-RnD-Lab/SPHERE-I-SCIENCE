from __future__ import annotations

import pandas as pd
import plotly.express as px
import streamlit as st

from src.assumptions import (
    BASELINE,
    BASELINE_REFERENCE_OPTIONS,
    DATA_QUALITY_NOTES,
    INCOME_THRESHOLD_OPTIONS_UAH,
    SALARY_ANCHORS_UAH,
    SOURCE_LINKS,
)
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


def income_threshold_label(value: int) -> str:
    if value == 0:
        return "Any income"
    return f"{format_count(value)} UAH"


def format_percent(value: int | float) -> str:
    if value == 0:
        return "0%"
    if value < 0.001:
        return "<0.001%"
    if value < 0.01:
        return f"{value:.4f}%"
    if value < 1:
        return f"{value:.3f}%"
    return f"{value:.2f}%"


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
    with st.expander("Core demographics", expanded=True):
        baseline_preset = st.selectbox(
            "Baseline preset",
            list(BASELINE_REFERENCE_OPTIONS),
            format_func=lambda value: BASELINE_REFERENCE_OPTIONS[value]["label"],
            help=(
                "Baseline is the starting universe before filters. It is not automatically the whole country; "
                "choose a national reference or a narrower custom pool depending on the scenario."
            ),
        )
        preset = BASELINE_REFERENCE_OPTIONS[baseline_preset]
        base_population_text = st.text_input(
            "Baseline population",
            value=format_count(preset["value"]),
            help=(
                f"{preset['note']} Formatted with commas. "
                "Demo is a fixed synthetic example. Custom means you choose your own starting audience."
            ),
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
            (18, 70),
            help="Narrows the pool by the selected age-band overlap. The full 18-70 range is treated as no age filter.",
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
            150,
            help="Interpolates a demo height-distribution coefficient. 150 cm is treated as no height filter.",
        )
        income_min_uah = st.select_slider(
            "Minimum monthly income, UAH",
            options=INCOME_THRESHOLD_OPTIONS_UAH,
            value=0,
            format_func=income_threshold_label,
            help=(
                "Scenario salary threshold. 0 means no income filter. Salary anchors: Work.ua current benchmark is about "
                f"{format_count(SALARY_ANCHORS_UAH['workua_current_average'])} UAH/month; "
                f"KSE cites Work.ua January 2026 median at {format_count(SALARY_ANCHORS_UAH['kse_workua_jan_2026_median'])} UAH/month. "
                "High thresholds up to 1,000,000 UAH/month are scenario stress-test cutoffs, not official maximum salary data."
            ),
        )
        st.caption(
            "Selected income threshold: "
            f"{'Any income' if income_min_uah == 0 else format_count(income_min_uah) + ' UAH/month'}"
        )
        education_level = st.selectbox(
            "Education filter",
            ["any", "higher_education", "graduate_plus"],
            format_func=title_label,
            help="Applies an estimated education-level coefficient.",
        )

    with st.expander("Family context"):
        children_status = st.selectbox(
            "Children status",
            ["any", "no_children", "has_children", "co_parenting_ready"],
            format_func=title_label,
            help="Scenario preference around existing children. These are demo assumptions, not value judgments.",
        )
        future_children = st.selectbox(
            "Future children",
            ["any", "wants_children", "does_not_want_children", "open_or_undecided"],
            format_func=title_label,
            help="Scenario preference around future children.",
        )

    with st.expander("War and mobility"):
        military_status = st.selectbox(
            "Military status",
            ["any", "civilian_or_not_serving", "active_service", "veteran_or_service_history"],
            format_func=title_label,
            help="War-related scenario filter. Active service and veteran/service-history shares are placeholders until sourced.",
        )
        relocation = st.selectbox(
            "Relocation",
            ["any", "same_city_only", "open_to_relocation", "remote_or_long_distance_ok"],
            format_func=title_label,
            help="Mobility and distance preference filter.",
        )

    with st.expander("Lifestyle and compatibility"):
        housing = st.selectbox(
            "Housing",
            ["any", "independent_living", "own_or_stable_housing"],
            format_func=title_label,
            help="Scenario proxy for independent or stable living setup.",
        )
        smoking = st.selectbox(
            "Smoking",
            ["any", "non_smoker", "ok_with_smoking"],
            format_func=title_label,
            help="Lifestyle preference around smoking.",
        )
        alcohol = st.selectbox(
            "Alcohol",
            ["any", "rare_or_none", "moderate_ok"],
            format_func=title_label,
            help="Lifestyle preference around alcohol use.",
        )
        language = st.selectbox(
            "Language comfort",
            ["any", "ukrainian_comfortable", "english_comfortable", "ukrainian_and_english"],
            format_func=title_label,
            help="Communication comfort filter.",
        )
        pets = st.selectbox(
            "Pets",
            ["any", "pet_friendly", "no_pets_preferred"],
            format_func=title_label,
            help="Household compatibility preference around pets.",
        )

criteria = Criteria(
    base_population=base_population,
    target_population=target_population,
    age_min=age_min,
    age_max=age_max,
    region_scope=region_scope,
    relationship_status=relationship_status,
    min_height_cm=min_height,
    income_min_uah=income_min_uah,
    education_level=education_level,
    children_status=children_status,
    future_children=future_children,
    military_status=military_status,
    relocation=relocation,
    housing=housing,
    smoking=smoking,
    alcohol=alcohol,
    language=language,
    pets=pets,
)

estimate = estimate_pool(criteria)
steps = sensitivity_table(criteria)
central_percent = (estimate.central / criteria.base_population) * 100

col_a, col_b, col_c, col_d = st.columns(4)
col_a.metric("Conservative estimate", format_count(estimate.conservative))
col_b.metric("Central estimate", format_count(estimate.central))
col_c.metric("Optimistic estimate", format_count(estimate.optimistic))
col_d.metric("Central share", format_percent(central_percent))

if central_percent == 100:
    st.caption("Neutral defaults are active: the central estimate equals 100% of the selected baseline.")
else:
    st.caption("Central share is the central estimate divided by the selected baseline after all active filters.")

st.subheader("What narrows the pool")
step_df = pd.DataFrame(steps)
display_df = step_df.assign(
    coefficient=step_df["coefficient"].map("{:.4f}".format),
    remaining=step_df["remaining"].map(format_count),
    percent_of_baseline=step_df["percent_of_baseline"].map(format_percent),
)
fig = px.bar(
    step_df,
    x="factor",
    y="remaining",
    text="remaining",
    custom_data=["coefficient", "percent_of_baseline"],
    title="Remaining estimated pool after each criterion",
)
fig.update_traces(texttemplate="%{text:,.0f}", textposition="outside")
fig.update_traces(
    hovertemplate=(
        "<b>%{x}</b><br>"
        "Remaining: %{y:,.0f}<br>"
        "Share of baseline: %{customdata[1]:.4f}%<br>"
        "Coefficient: %{customdata[0]:.4f}<extra></extra>"
    )
)
fig.update_layout(yaxis_title="Estimated remaining pool", xaxis_title="")
st.plotly_chart(fig, use_container_width=True)

st.subheader("Scenario details")
st.dataframe(display_df, use_container_width=True, hide_index=True)

st.subheader("Baseline and salary anchors")
st.write(
    "Baseline population is the starting reference pool before filters. The default 10,000,000 is a demo working pool, "
    "not the population of Ukraine. For a national pre-invasion reference, use the SSSU January 2022 option "
    f"({format_count(BASELINE_REFERENCE_OPTIONS['sssu_jan_2022_total']['value'])})."
)
st.write(
    f"The income slider uses {format_count(SALARY_ANCHORS_UAH['workua_current_average'])} UAH/month as the current public job-market benchmark. "
    "High values such as 200,000, 500,000, or 1,000,000 UAH/month are supported as scenario stress-test cutoffs. "
    "They are not official salary percentiles or a claimed real maximum."
)

st.subheader("Data quality notes")
for note in DATA_QUALITY_NOTES:
    st.write(f"- **{note['label']}**: {note['note']}")

st.subheader("Interpretation guardrails")
st.write(
    "This model estimates a demographic scenario, not compatibility, attraction, safety, or relationship success. "
    "A stricter filter can make a pool smaller, but it does not define a person's real-life chances. "
    "War, children, housing, and lifestyle filters are sensitive context variables; treat them as transparent assumptions."
)

st.subheader("Sources")
for source in SOURCE_LINKS:
    st.markdown(f"- [{source['label']}]({source['url']}) — {source['note']}")
