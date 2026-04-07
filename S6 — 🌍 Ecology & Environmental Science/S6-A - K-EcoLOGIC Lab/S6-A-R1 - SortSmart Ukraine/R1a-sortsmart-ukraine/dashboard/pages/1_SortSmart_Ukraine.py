from __future__ import annotations

import plotly.express as px
import streamlit as st

from kecologic_common import (
    configure_page,
    load_materials,
    load_sortsmart_mart,
    load_sortsmart_trend,
    render_pipeline_hint,
)


configure_page("SortSmart Ukraine")

st.title("SortSmart Ukraine")
st.caption("Nationwide waste-sorting readiness, recovery gap, and modeled climate impact")

snapshot = load_sortsmart_mart()
trend = load_sortsmart_trend()
materials = load_materials()

if snapshot is None or trend is None:
    render_pipeline_hint()
    st.stop()

available_years = sorted(int(year) for year in trend["year"].dropna().unique().tolist())
default_year = max(available_years)
region_options = ["All Ukraine"] + sorted(snapshot["oblast_name_en"].dropna().unique().tolist())

selected_region = st.sidebar.selectbox("Region", region_options)
selected_year = st.sidebar.selectbox("Year", available_years, index=available_years.index(default_year))

year_slice = trend[trend["year"] == selected_year].copy()
region_history = trend if selected_region == "All Ukraine" else trend[trend["oblast_name_en"] == selected_region].copy()
filtered = year_slice if selected_region == "All Ukraine" else year_slice[year_slice["oblast_name_en"] == selected_region].copy()

st.info(
    "This module currently works at oblast level, not city level. The regional waste file published on data.gov.ua is the strongest open source we have for nationwide coverage."
)

st.markdown(
    """
This page is best read as a decision-support layer, not just a scoreboard.

It helps answer:

- where landfill dependence still dominates
- where recovery is already happening but still under-scaled
- which material streams are the most actionable to separate first
- where the public data itself is still too weak and needs follow-up requests
"""
)

with st.expander("What do these metrics mean?"):
    st.markdown(
        """
- `Sorting Readiness Score`: a composite 0-100 score based on recovery rate, facility availability, and landfill dependence.
- `Recovery Gap`: estimated recyclable potential that is still not being recovered.
- `Modeled Climate Potential`: estimated avoided CO2e if the recoverable gap were redirected away from landfill.
- `Generated`: currently a transparent proxy built from recovery + incineration + landfill disposal because the official regional file exposes waste-management outcomes rather than total generation.
"""
    )

col1, col2, col3, col4 = st.columns(4)
col1.metric("Year in view", str(selected_year))
col2.metric("Avg Readiness Score", f"{filtered['sorting_readiness_score'].mean():.1f}")
col3.metric("Recovery Gap (thsd.t)", f"{filtered['recovery_gap_thsd_t'].sum():,.1f}")
col4.metric("Modeled Climate Potential (tCO2e)", f"{filtered['climate_impact_potential_t_co2e'].sum():,.0f}")

if selected_region != "All Ukraine" and not filtered.empty:
    row = filtered.iloc[0]
    st.success(
        f"{selected_region} in {selected_year}: recovery {row['recovery']:.1f} thsd.t, landfill disposal {row['disposal_on_landfills']:.1f} thsd.t, readiness {row['sorting_readiness_score']:.1f}."
    )

tab1, tab2, tab3, tab4 = st.tabs(["Overview", "Trends", "Problem & Action", "Material Guide"])

with tab1:
    overview_col1, overview_col2 = st.columns(2)

    with overview_col1:
        ranking = year_slice.sort_values("sorting_readiness_score", ascending=False)
        if selected_region != "All Ukraine":
            peers = ranking.copy()
            peers["selected"] = peers["oblast_name_en"].eq(selected_region)
            fig = px.bar(
                peers,
                x="oblast_name_en",
                y="sorting_readiness_score",
                color="selected",
                color_discrete_map={True: "#2E8B57", False: "#BFC7B8"},
                title=f"Regional ranking in {selected_year}",
            )
        else:
            fig = px.bar(
                ranking,
                x="oblast_name_en",
                y="sorting_readiness_score",
                color="sorting_readiness_score",
                color_continuous_scale="YlGn",
                title=f"Sorting readiness by region in {selected_year}",
            )
        fig.update_layout(xaxis_title="", yaxis_title="Score")
        st.plotly_chart(fig, use_container_width=True)

    with overview_col2:
        scatter_source = year_slice if selected_region == "All Ukraine" else year_slice[year_slice["oblast_name_en"] == selected_region]
        scatter = px.scatter(
            scatter_source,
            x="facility_count",
            y="recovery_gap_thsd_t",
            size="generated",
            color="sorting_readiness_score",
            hover_name="oblast_name_en",
            title="Facilities vs. recovery gap",
            color_continuous_scale="Viridis",
        )
        scatter.update_layout(xaxis_title="Facility count", yaxis_title="Recovery gap (thsd.t)")
        st.plotly_chart(scatter, use_container_width=True)

    details = filtered.melt(
        id_vars=["oblast_name_en"],
        value_vars=["generated", "recovery", "disposal_on_landfills", "modeled_recyclable_potential_thsd_t"],
        var_name="metric",
        value_name="value",
    )
    fig = px.bar(
        details,
        x="metric",
        y="value",
        color="oblast_name_en",
        barmode="group",
        title=f"Waste flow snapshot for {selected_region if selected_region != 'All Ukraine' else 'all regions'} in {selected_year}",
    )
    fig.update_layout(xaxis_title="", yaxis_title="thsd.t")
    st.plotly_chart(fig, use_container_width=True)

    st.dataframe(
        filtered[
            [
                "oblast_name_en",
                "generated",
                "recovery",
                "disposal_on_landfills",
                "facility_count",
                "sorting_readiness_score",
                "priority_material",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )

with tab2:
    if selected_region == "All Ukraine":
        national = (
            trend.groupby("year", as_index=False)[
                ["recovery_gap_thsd_t", "climate_impact_potential_t_co2e", "sorting_readiness_score"]
            ]
            .mean()
        )
        fig = px.line(
            national,
            x="year",
            y=["sorting_readiness_score", "recovery_gap_thsd_t"],
            markers=True,
            title="National trend view",
        )
        fig.update_layout(yaxis_title="Metric value")
        st.plotly_chart(fig, use_container_width=True)
        st.caption("For all-Ukraine mode, the chart shows average readiness and average recovery gap across oblasts.")
    else:
        fig = px.line(
            region_history.sort_values("year"),
            x="year",
            y=["sorting_readiness_score", "recovery_gap_thsd_t", "climate_impact_potential_t_co2e"],
            markers=True,
            title=f"{selected_region} trend over time",
        )
        fig.update_layout(yaxis_title="Metric value")
        st.plotly_chart(fig, use_container_width=True)

        compare = year_slice.sort_values("sorting_readiness_score", ascending=False)
        compare["group"] = compare["oblast_name_en"].map(lambda value: "Selected region" if value == selected_region else "Peers")
        fig = px.bar(
            compare,
            x="oblast_name_en",
            y="recovery_gap_thsd_t",
            color="group",
            title=f"{selected_region} vs peer recovery gaps in {selected_year}",
            color_discrete_map={"Selected region": "#2E8B57", "Peers": "#AAB7A2"},
        )
        fig.update_layout(xaxis_title="", yaxis_title="Recovery gap (thsd.t)")
        st.plotly_chart(fig, use_container_width=True)

with tab3:
    st.subheader("Problem framing and action paths")
    st.markdown(
        """
Three structural problems are visible even in the current MVP:

- Ukraine's strongest open nationwide waste data is still mostly oblast-level, which makes local sorting systems harder to evaluate
- the official file reflects management outcomes better than true generation structure, so part of the model still has to stay transparent about proxies
- infrastructure, public awareness, and material-specific collection are not yet aligned, so one mixed-bin reality still dominates in many places
"""
    )

    action_col1, action_col2 = st.columns(2)

    with action_col1:
        st.markdown(
            """
**What this already helps with**

- showing where recovery gaps are largest
- identifying which regions are more landfill-dependent
- explaining why sorting should start with high-value material streams
- giving activists a clearer evidence base for presentations, letters, and partnerships
"""
        )

    with action_col2:
        st.markdown(
            """
**What should happen next**

- request fresher regional and municipal waste datasets
- map real container and collection coverage by city
- separate packaging guidance into user-friendly categories
- connect local sorting behavior with funding, procurement, and ministry-level accountability
"""
        )

    if selected_region == "All Ukraine":
        gap_ranking = year_slice.sort_values("recovery_gap_thsd_t", ascending=False).head(10)
        readiness_ranking = year_slice.sort_values("sorting_readiness_score", ascending=False).head(10)
    else:
        gap_ranking = year_slice.sort_values("recovery_gap_thsd_t", ascending=False).head(10)
        readiness_ranking = year_slice.sort_values("sorting_readiness_score", ascending=False).head(10)

    left, right = st.columns(2)

    with left:
        st.markdown("**Where recovery gaps are biggest right now**")
        st.dataframe(
            gap_ranking[["oblast_name_en", "recovery_gap_thsd_t", "disposal_on_landfills", "priority_material"]],
            use_container_width=True,
            hide_index=True,
        )

    with right:
        st.markdown("**Where readiness is currently strongest**")
        st.dataframe(
            readiness_ranking[["oblast_name_en", "sorting_readiness_score", "facility_count", "priority_material"]],
            use_container_width=True,
            hide_index=True,
        )

with tab4:
    st.caption("Transparent material assumptions used for modeled recovery and climate impact.")
    st.dataframe(materials, use_container_width=True, hide_index=True)

    st.subheader("Packaging and container guidance")
    st.markdown(
        """
This is the practical public-facing layer that can later become a dedicated education page.

The goal is not only to say **what materials exist**, but to say **what a person should do with common packaging**.
"""
    )

    packaging_guide = [
        {
            "common_item": "Cardboard box, paper bag, clean paper packaging",
            "likely_stream": "Paper / cardboard",
            "what_to_do": "Keep dry, flatten if possible, and avoid mixing with greasy food waste.",
            "container_hint": "Paper bin or dry recyclables bin",
        },
        {
            "common_item": "PET bottle, detergent bottle, rigid plastic container",
            "likely_stream": "Plastic",
            "what_to_do": "Rinse lightly, compress if possible, and separate from mixed waste.",
            "container_hint": "Plastic bin or mixed dry recyclables bin",
        },
        {
            "common_item": "Glass bottle or jar",
            "likely_stream": "Glass",
            "what_to_do": "Empty contents and remove obvious contamination.",
            "container_hint": "Glass bin or dry recyclables bin",
        },
        {
            "common_item": "Aluminium can, metal food tin",
            "likely_stream": "Metals",
            "what_to_do": "Rinse if dirty and keep in the metal or dry recyclables stream.",
            "container_hint": "Metal bin or dry recyclables bin",
        },
        {
            "common_item": "Food scraps, coffee grounds, yard waste",
            "likely_stream": "Organics",
            "what_to_do": "Best diverted to composting or organics collection if it exists.",
            "container_hint": "Organics bin, compost, or separate collection",
        },
        {
            "common_item": "Battery, small electronics, charger, cable",
            "likely_stream": "Hazardous / e-waste",
            "what_to_do": "Do not place in mixed waste. Use dedicated collection points only.",
            "container_hint": "Battery or e-waste drop-off point",
        },
    ]
    st.dataframe(packaging_guide, use_container_width=True, hide_index=True)

    st.warning(
        "Container rules vary by municipality. This guide shows the most sensible default logic for public education, but the next platform upgrade should connect each material stream to city-level collection infrastructure."
    )
