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

tab1, tab2, tab3 = st.tabs(["Overview", "Trends", "Material Guide"])

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
    st.caption("Transparent material assumptions used for modeled recovery and climate impact.")
    st.dataframe(materials, use_container_width=True, hide_index=True)
