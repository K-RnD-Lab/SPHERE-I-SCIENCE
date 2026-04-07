from __future__ import annotations

import sys
from pathlib import Path

import plotly.express as px
import streamlit as st

DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from kecologic_common import configure_page, load_water_overview


configure_page("Water Watch")

st.title("Water Watch")
st.caption("Live MVP for surface-water monitoring and basin-level summaries")

st.markdown(
    """
This module is reserved for:

- surface-water monitoring data
- basin and oblast trend views
- contamination and quality indicators
- activist-facing water summaries
"""
)

with st.expander("What do these water metrics mean?"):
    st.markdown(
        """
- `River Basins`: how many basin groups are represented in the current open dataset.
- `Observations`: number of sampled measurements in the parsed CSV.
- `Latest Sample`: most recent sampling date in the processed file.
- `Avg dissolved oxygen`: a rough ecological-health signal; higher values are usually better for aquatic life.
"""
    )

water = load_water_overview()

if water is None:
    st.info("Water module data will appear here after the pipeline downloads and parses the latest official surface-water monitoring CSV.")
else:
    basin_options = ["All basins"] + water["river_basin"].dropna().astype(str).sort_values().unique().tolist()
    selected_basin = st.selectbox("River basin", basin_options)
    filtered_water = water if selected_basin == "All basins" else water[water["river_basin"] == selected_basin]

    col1, col2, col3 = st.columns(3)
    col1.metric("River Basins", str(int(filtered_water["river_basin"].nunique())))
    col2.metric("Observations", f"{int(filtered_water['observation_count'].sum()):,}")
    col3.metric("Latest Sample", str(filtered_water["latest_sample_date"].dropna().max()))

    fig = px.bar(
        filtered_water.sort_values("observation_count", ascending=False),
        x="river_basin",
        y="observation_count",
        color="avg_dissolved_oxygen",
        color_continuous_scale="Blues",
        title="Surface-Water Observation Count by River Basin",
    )
    fig.update_layout(xaxis_title="", yaxis_title="Observations")
    st.plotly_chart(fig, use_container_width=True)

    st.dataframe(filtered_water, use_container_width=True, hide_index=True)
