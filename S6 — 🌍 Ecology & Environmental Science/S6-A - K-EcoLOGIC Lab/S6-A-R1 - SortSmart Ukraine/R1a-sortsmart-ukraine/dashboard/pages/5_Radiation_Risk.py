from __future__ import annotations

import sys
from pathlib import Path

import plotly.express as px
import streamlit as st

DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from kecologic_common import configure_page, load_radiation_locations, load_radiation_overview, load_radiation_platforms


configure_page("Radiation & Risk")

st.title("Radiation & Risk")
st.caption("Nationwide radiation-monitoring coverage and public-source risk context")

st.markdown(
    """
This module helps answer a more practical question:

- where radiation monitoring stations actually exist across Ukraine
- which public platforms contribute the most coverage
- how much of the visible network sits inside the Chornobyl Exclusion Zone
- where coverage is still thin
"""
)

with st.expander("What do these metrics mean?"):
    st.markdown(
        """
- `Stations in view`: number of monitoring points in the selected slice.
- `Regions covered`: how many oblast-level units are represented.
- `Platform networks`: how many distinct monitoring networks or organizations contribute stations.
- `CEZ stations`: how many stations are flagged as being in the Chornobyl Exclusion Zone.

Important: this page currently shows monitoring-network coverage, not an official emergency alert feed. The source package itself marks the measurements as public and unverified.
"""
    )

st.warning(
    "Current MVP uses the open SaveEcoBot/SaveDnipro radiation-monitoring package from data.gov.ua. It is excellent for coverage analysis, but it should not be treated as a sole source for emergency decisions."
)

overview = load_radiation_overview()
locations = load_radiation_locations()
platforms = load_radiation_platforms()

if overview is None or locations is None or platforms is None:
    st.info("Radiation module data will appear here after the pipeline downloads and normalizes the nationwide monitoring-station package.")
    st.stop()

region_options = ["All Ukraine"] + overview["display_region"].dropna().astype(str).sort_values().unique().tolist()
selected_region = st.sidebar.selectbox("Radiation region", region_options)

region_overview = overview if selected_region == "All Ukraine" else overview[overview["display_region"] == selected_region]
region_locations = locations if selected_region == "All Ukraine" else locations[locations["display_region"] == selected_region]
region_platforms = (
    platforms
    if selected_region == "All Ukraine"
    else (
        region_locations.groupby("platform_name", dropna=False)
        .agg(
            station_count=("location_id", "count"),
            oblast_coverage=("display_region", "nunique"),
            cez_station_count=("isChornobylExclusionZone", "sum"),
            untrusted_station_count=("isUntrusted", "sum"),
        )
        .reset_index()
        .sort_values("station_count", ascending=False)
    )
)

col1, col2, col3, col4 = st.columns(4)
col1.metric("Stations in view", f"{int(region_locations['location_id'].count()):,}")
col2.metric("Regions covered", str(int(region_overview['display_region'].nunique(dropna=True))))
col3.metric("Platform networks", str(int(region_platforms['platform_name'].nunique(dropna=True))))
col4.metric("CEZ stations", f"{int(region_locations['isChornobylExclusionZone'].sum()):,}")

tab1, tab2, tab3 = st.tabs(["Coverage", "Platforms", "Station Table"])

with tab1:
    left, right = st.columns(2)

    with left:
        coverage_source = overview if selected_region == "All Ukraine" else region_overview
        coverage_fig = px.bar(
            coverage_source.sort_values("station_count", ascending=False),
            x="display_region",
            y="station_count",
            color="coverage_share_pct" if selected_region == "All Ukraine" else "platform_count",
            title="Station coverage by region" if selected_region == "All Ukraine" else f"{selected_region} monitoring footprint",
            color_continuous_scale="YlGnBu",
        )
        coverage_fig.update_layout(xaxis_title="", yaxis_title="Stations")
        st.plotly_chart(coverage_fig, use_container_width=True)

    with right:
        map_source = region_locations.dropna(subset=["lat", "lon"]).copy()
        map_source["station_group"] = map_source["isChornobylExclusionZone"].map(
            {True: "Chornobyl Exclusion Zone", False: "Outside CEZ"}
        )
        geo = px.scatter_geo(
            map_source,
            lat="lat",
            lon="lon",
            color="station_group",
            hover_name="settlement_name",
            hover_data=["platform_name", "authority_name", "display_region"],
            title="Radiation-monitoring station locations",
        )
        geo.update_geos(
            scope="europe",
            center={"lat": 49.0, "lon": 31.0},
            projection_scale=5.2,
            showcountries=True,
            showland=True,
            landcolor="#F4F3EE",
        )
        st.plotly_chart(geo, use_container_width=True)

with tab2:
    platform_fig = px.bar(
        region_platforms.head(12),
        x="platform_name",
        y="station_count",
        color="oblast_coverage",
        color_continuous_scale="Tealgrn",
        title="Top monitoring networks by station count",
    )
    platform_fig.update_layout(xaxis_title="", yaxis_title="Stations")
    st.plotly_chart(platform_fig, use_container_width=True)
    st.dataframe(region_platforms, use_container_width=True, hide_index=True)

with tab3:
    station_columns = [
        "display_region",
        "settlement_name",
        "platform_name",
        "authority_name",
        "measurement_type",
        "isChornobylExclusionZone",
        "isUntrusted",
        "lat",
        "lon",
    ]
    st.dataframe(
        region_locations[station_columns].sort_values(["display_region", "settlement_name", "platform_name"]),
        use_container_width=True,
        hide_index=True,
    )
