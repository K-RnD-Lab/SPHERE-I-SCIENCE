from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from kecologic_common import (
    configure_page,
    load_air_city_snapshot,
    load_air_story,
    load_national_story,
    load_permits_overview,
    load_permits_story,
    load_radiation_story,
    load_sortsmart_mart,
    load_sortsmart_trend,
    load_water_overview,
    load_water_story,
)
from sorting_logic import classify_item


def _format_number(value: float) -> str:
    return f"{value:,.1f}"


def _build_sortsmart_brief(region: str, audience: str, mart, trend, story: dict | None) -> str:
    if mart is None or trend is None:
        return "SortSmart data is not available yet."

    if region == "All Ukraine":
        latest_year = int(mart["year"].max())
        avg_score = mart["sorting_readiness_score"].mean()
        gap = mart["recovery_gap_thsd_t"].sum()
        climate = mart["climate_impact_potential_t_co2e"].sum()
        top_region = mart.sort_values("sorting_readiness_score", ascending=False).iloc[0]["oblast_name_en"]
        biggest_gap = mart.sort_values("recovery_gap_thsd_t", ascending=False).iloc[0]["oblast_name_en"]
        intro = {
            "Public summary": "This national snapshot shows that Ukraine's waste story is still dominated by landfill pressure and uneven regional readiness.",
            "Activist brief": "The national waste picture suggests a clear advocacy case: the recovery gap remains large, while public infrastructure and fresh open data still lag behind the scale of the problem.",
            "Municipal note": "At national scale, the platform suggests that recovery performance and infrastructure distribution remain highly uneven across oblasts.",
            "Donor / partner pitch": "The data highlights a tractable intervention space: large recovery gaps, visible regional inequality, and an immediate need for clearer public sorting systems.",
        }[audience]
        return (
            f"{intro}\n\n"
            f"In the latest nationwide year in view ({latest_year}), the average sorting readiness score is {avg_score:.1f}. "
            f"The modeled recovery gap is {_format_number(gap)} thousand tonnes, with a modeled climate benefit of about {climate:,.0f} tCO2e if recoverable material were redirected away from landfill.\n\n"
            f"The strongest current readiness signal appears in {top_region}, while the largest recovery gap appears in {biggest_gap}. "
            "This means the platform can already help distinguish between places that are relatively prepared and places where the material loss problem is still structurally large.\n\n"
            "Important limitation: the strongest open nationwide waste file is still oblast-level and outcome-oriented, so this brief should be read as a transparent decision-support layer rather than a complete municipal operations picture."
        )

    regional = mart[mart["oblast_name_en"] == region]
    if regional.empty:
        return f"No SortSmart row is available for {region}."
    row = regional.iloc[0]
    return (
        f"{region} currently appears as a meaningful regional case for waste-system analysis. "
        f"Its sorting readiness score is {row['sorting_readiness_score']:.1f}, with recovery at {row['recovery']:.1f} thousand tonnes and landfill disposal at {row['disposal_on_landfills']:.1f} thousand tonnes.\n\n"
        f"The modeled recovery gap is {_format_number(row['recovery_gap_thsd_t'])} thousand tonnes, and the platform currently flags `{row['priority_material']}` as the most strategically important material stream. "
        "For an activist or municipal audience, this means the region can already be discussed in terms of both visible waste pressure and concrete material priorities.\n\n"
        "Important limitation: this is still not city-level system coverage, so any operational follow-up should push for fresher local datasets, municipal collection maps, and material-specific container inventories."
    )


def _build_air_brief(audience: str, air_story: dict | None, air_snapshot) -> str:
    if air_snapshot is None or air_snapshot.empty:
        return "Air module data is not available yet."
    latest = air_snapshot.sort_values("max_q_max_gdk_ratio", ascending=False).iloc[0]
    city_count = int(air_snapshot["city"].nunique())
    month_label = air_snapshot["observation_month_label"].dropna().iloc[0]
    return (
        f"The current air module provides a compact exposure-oriented picture rather than a full real-time air monitoring network. "
        f"It currently covers {city_count} cities in the latest parsed month ({month_label}).\n\n"
        f"In the latest snapshot, `{latest['city']}` shows the strongest exceedance-style signal, with a peak qmax/GDK ratio of {latest['max_q_max_gdk_ratio']:.2f}. "
        f"The current top pollutant signal there is `{latest['top_pollutant_name_uk']}`.\n\n"
        f"For {audience.lower()}, the most useful framing is that this module helps surface where public air-quality attention may be most needed, while still being honest that the current open-data footprint is limited and not a substitute for a full operational monitoring service."
    )


def _build_water_brief(audience: str, water_story: dict | None, water_overview) -> str:
    if water_overview is None or water_overview.empty:
        return "Water module data is not available yet."
    latest_sample = str(water_overview["latest_sample_date"].dropna().max())
    largest = water_overview.sort_values("observation_count", ascending=False).iloc[0]
    basin_count = int(water_overview["river_basin"].nunique())
    return (
        f"The water module is currently a basin-level monitoring layer with {basin_count} river-basin groups in view and latest samples up to {latest_sample}. "
        f"The basin with the heaviest observation footprint right now is `{largest['river_basin']}`.\n\n"
        f"For {audience.lower()}, this is useful because it shows where a more structured water evidence base already exists, but it also highlights that the module is still better at broad monitoring context than at fine-grained local intervention design."
    )


def _build_permits_brief(audience: str, permits_story: dict | None, permits_overview) -> str:
    if permits_overview is None or permits_overview.empty:
        return "Permits module data is not available yet."
    settlements = int(permits_overview["settlement"].nunique())
    permits = int(permits_overview["permit_count"].sum())
    top = permits_overview.sort_values("permit_count", ascending=False).iloc[0]["settlement"]
    return (
        f"The permits module is currently a regional pilot rather than a full nationwide oversight system. "
        f"It covers {settlements} settlements and {permits} permit records in the current open source used by the platform.\n\n"
        f"The strongest visible settlement-level concentration right now is `{top}`. "
        f"For {audience.lower()}, the main message is that this module already helps identify oversight hotspots, but it also makes the national data-gap problem impossible to ignore."
    )


def _build_radiation_brief(audience: str, radiation_story: dict | None) -> str:
    if not radiation_story:
        return "Radiation module data is not available yet."
    return (
        f"The radiation module currently functions as a network-coverage and public-context layer. "
        f"It tracks {radiation_story['station_count']} stations across {radiation_story['oblast_coverage']} oblast-level units and {radiation_story['platform_count']} platform networks.\n\n"
        f"For {audience.lower()}, the important nuance is that this is helpful for visibility and coverage mapping, but it should not be presented as a sole emergency-warning source."
    )


def _build_data_gaps(theme: str, region: str) -> list[str]:
    gaps = {
        "SortSmart Ukraine": [
            "The strongest nationwide waste dataset is still mostly oblast-level rather than city-level.",
            "The latest visible nationwide waste year is 2023, so newer years are still missing from the public evidence layer.",
            "The platform still lacks municipal container coverage and collection-point density by city.",
        ],
        "Air & Exposure": [
            "The current air layer covers only the monthly files currently wired into the platform, not a full real-time national network.",
            "Many settlements are still outside the visible air snapshot.",
            "City-level air data still needs better linkage to local infrastructure and local interventions.",
        ],
        "Water Watch": [
            "The current module is basin-oriented and not yet a strong city-level water-operations layer.",
            "More public-quality indicators and more stable nationwide publication would make this much stronger.",
        ],
        "Polluters & Permits": [
            "The permits module is still a regional pilot based on the latest accessible open CSV resource.",
            "A stronger nationwide permits feed is needed for fair cross-regional oversight.",
        ],
        "Radiation & Risk": [
            "The module is best for network coverage and public context, not as a validated emergency feed.",
            "It still needs clearer integration with incident overlays and institutional alert channels.",
        ],
    }
    region_note = f"Region in focus: {region}." if region != "All Ukraine" else "Focus is national."
    return [region_note] + gaps.get(theme, [])


def _build_draft_request(theme: str, region: str, target: str) -> str:
    subject_map = {
        "Municipality or city council": "request for local environmental and waste-management data publication",
        "Ministry or national authority": "request for updated nationwide environmental open data",
        "NGO or donor partner": "proposal for environmental data collaboration and evidence support",
        "Regional administration": "request for regional environmental monitoring and waste-management disclosure",
    }
    subject = subject_map[target]
    region_line = f"with a current focus on {region}" if region != "All Ukraine" else "with a current national focus"
    return (
        f"Draft request to {target}\n\n"
        f"Subject: {subject}\n\n"
        f"Hello,\n\n"
        f"I am reaching out regarding the K-EcoLOGIC Lab environmental monitoring platform, {region_line}. "
        f"Our current analysis of `{theme}` shows that publicly accessible data is useful but still incomplete for practical civic and policy work.\n\n"
        f"We would like to request clearer and more regular publication of the datasets needed to understand:\n"
        f"- current environmental pressure and its geographic distribution\n"
        f"- material or monitoring gaps that limit public accountability\n"
        f"- infrastructure or regulatory information needed for evidence-based action\n\n"
        f"In particular, we are interested in fresher machine-readable data, clearer metadata, and more stable publication across reporting periods. "
        f"This would directly support public communication, civic monitoring, and more informed environmental interventions.\n\n"
        f"If useful, we can also share the current platform view and the specific data gaps we have identified.\n\n"
        f"Kind regards,\n"
        f"Oksana Kolisnyk\n"
        f"K-EcoLOGIC Lab\n"
    )


configure_page("AI & Activist Mode")

st.title("AI & Activist Mode")
st.caption("Data-grounded briefs, sorting help, and activist-facing drafts built on top of the current platform marts")

st.markdown(
    """
This page is the first AI-oriented layer of the platform.

Important:

- it is grounded in the current warehouse outputs and processed marts
- it does not invent new environmental facts
- it translates current data into more usable public, activist, and partner-facing language
"""
)

sortsmart = load_sortsmart_mart()
trend = load_sortsmart_trend()
air_snapshot = load_air_city_snapshot()
water_overview = load_water_overview()
permits_overview = load_permits_overview()
national_story = load_national_story()
air_story = load_air_story()
water_story = load_water_story()
permits_story = load_permits_story()
radiation_story = load_radiation_story()

tab1, tab2, tab3 = st.tabs(["Environmental Brief Generator", "AI Sorting Assistant", "AI Activist Mode"])

with tab1:
    st.subheader("Environmental Brief Generator")
    audience = st.selectbox("Audience", ["Public summary", "Activist brief", "Municipal note", "Donor / partner pitch"])
    module = st.selectbox(
        "Theme",
        ["SortSmart Ukraine", "Air & Exposure", "Water Watch", "Polluters & Permits", "Radiation & Risk"],
    )
    region_options = ["All Ukraine"]
    if sortsmart is not None:
        region_options += sorted(sortsmart["oblast_name_en"].dropna().unique().tolist())
    region = st.selectbox("Region focus", region_options)

    if module == "SortSmart Ukraine":
        brief = _build_sortsmart_brief(region, audience, sortsmart, trend, national_story)
    elif module == "Air & Exposure":
        brief = _build_air_brief(audience, air_story, air_snapshot)
    elif module == "Water Watch":
        brief = _build_water_brief(audience, water_story, water_overview)
    elif module == "Polluters & Permits":
        brief = _build_permits_brief(audience, permits_story, permits_overview)
    else:
        brief = _build_radiation_brief(audience, radiation_story)

    st.markdown("**Generated brief**")
    st.text_area("Copy-ready brief", brief, height=260)

with tab2:
    st.subheader("AI Sorting Assistant")
    st.caption("This first version is data-grounded and rule-based, so it stays interpretable and safe.")

    item = st.text_input("Describe the item", placeholder="e.g. yoghurt cup, pizza box, charger, jar lid, paper bag")
    classification, score = classify_item(item)

    if item and classification:
        st.success(f"Likely stream: {classification['stream']}")
        explanation = (
            f"This item is most likely part of the `{classification['stream']}` stream. "
            f"A sensible default action is: {classification['what_to_do']} "
            f"The default container logic is `{classification['container_hint']}`. "
            f"This matters because {classification['why'].lower()}"
        )
        st.text_area("Generated explanation", explanation, height=180)
        if score <= 1:
            st.warning("Confidence is still limited. The current assistant uses transparent rules; a future LLM layer can make this more flexible.")
    elif item:
        st.warning("The current assistant could not classify this item confidently yet.")
    else:
        st.info("Enter an item to generate a sorting explanation.")

with tab3:
    st.subheader("AI Activist Mode")
    target = st.selectbox(
        "Target audience",
        ["Municipality or city council", "Regional administration", "Ministry or national authority", "NGO or donor partner"],
    )
    theme = st.selectbox(
        "Issue area",
        ["SortSmart Ukraine", "Air & Exposure", "Water Watch", "Polluters & Permits", "Radiation & Risk"],
        key="activist_theme",
    )
    region = st.selectbox("Target region", region_options, key="activist_region")

    gaps = _build_data_gaps(theme, region)
    draft = _build_draft_request(theme, region, target)

    st.markdown("**Problem summary**")
    if theme == "SortSmart Ukraine":
        summary = _build_sortsmart_brief(region, "Activist brief", sortsmart, trend, national_story)
    elif theme == "Air & Exposure":
        summary = _build_air_brief("Activist brief", air_story, air_snapshot)
    elif theme == "Water Watch":
        summary = _build_water_brief("Activist brief", water_story, water_overview)
    elif theme == "Polluters & Permits":
        summary = _build_permits_brief("Activist brief", permits_story, permits_overview)
    else:
        summary = _build_radiation_brief("Activist brief", radiation_story)

    st.text_area("Problem brief", summary, height=220)
    st.markdown("**Data gaps to highlight**")
    st.markdown("\n".join(f"- {gap}" for gap in gaps))
    st.markdown("**Draft request**")
    st.text_area("Copy-ready request", draft, height=320)
