from __future__ import annotations

import streamlit as st
import plotly.express as px

from common import configure_page, load_air_context, load_air_overview


configure_page("Air & Exposure")

st.title("Air & Exposure")
st.caption("Prototype climate-context module for K-EcoLOGIC Lab")

st.markdown(
    """
This module is the second layer of the platform:

- air-quality context
- population-exposure storytelling
- linkage between waste, pollution, and broader environmental risk
"""
)

air = load_air_context()
overview = load_air_overview()

if air is None:
    st.info("No processed air-context file is available yet. It will appear after the pipeline parses the official workbook.")
else:
    st.success("Air-context sample loaded")
    if overview is not None:
        col1, col2, col3 = st.columns(3)
        col1.metric("Air Resources", str(int(overview["source_file"].nunique())))
        col2.metric("Parsed Sheets", str(int(len(overview))))
        col3.metric("Context Rows", str(int(len(air))))

        fig = px.bar(
            overview,
            x="source_sheet",
            y="row_count",
            color="source_file",
            title="Rows Parsed Per Air Workbook Sheet",
        )
        fig.update_layout(xaxis_title="", yaxis_title="Rows")
        st.plotly_chart(fig, use_container_width=True)

    st.dataframe(air.head(200), use_container_width=True, hide_index=True)

st.subheader("Planned outputs")
st.markdown(
    """
- monthly observation trend summaries
- city-level exposure snapshots
- cross-links between air context and other environmental modules
"""
)
