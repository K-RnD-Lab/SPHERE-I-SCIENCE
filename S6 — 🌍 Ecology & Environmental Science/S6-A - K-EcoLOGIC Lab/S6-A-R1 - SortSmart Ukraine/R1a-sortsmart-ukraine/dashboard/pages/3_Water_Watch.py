from __future__ import annotations

import plotly.express as px
import streamlit as st

from common import configure_page, load_water_overview


configure_page("Water Watch")

st.title("Water Watch")
st.caption("Planned surface-water intelligence layer")

st.markdown(
    """
This module is reserved for:

- surface-water monitoring data
- basin and oblast trend views
- contamination and quality indicators
- activist-facing water summaries
"""
)

water = load_water_overview()

if water is None:
    st.info("Water module data will appear here after the pipeline downloads and parses the latest official surface-water monitoring CSV.")
else:
    col1, col2, col3 = st.columns(3)
    col1.metric("River Basins", str(int(water["river_basin"].nunique())))
    col2.metric("Observations", f"{int(water['observation_count'].sum()):,}")
    col3.metric("Latest Sample", str(water["latest_sample_date"].dropna().max()))

    fig = px.bar(
        water.sort_values("observation_count", ascending=False),
        x="river_basin",
        y="observation_count",
        color="avg_dissolved_oxygen",
        color_continuous_scale="Blues",
        title="Surface-Water Observation Count by River Basin",
    )
    fig.update_layout(xaxis_title="", yaxis_title="Observations")
    st.plotly_chart(fig, use_container_width=True)

    st.dataframe(water, use_container_width=True, hide_index=True)
