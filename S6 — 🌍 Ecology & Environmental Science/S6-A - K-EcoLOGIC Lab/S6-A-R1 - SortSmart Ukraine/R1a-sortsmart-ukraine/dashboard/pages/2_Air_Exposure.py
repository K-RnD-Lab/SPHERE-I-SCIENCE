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

with st.expander("What does this module mean?"):
    st.markdown(
        """
- `Air Resources`: how many official workbooks were downloaded from the open-data package.
- `Parsed Sheets`: how many workbook sheets looked structurally usable for air-related context.
- `Context Rows`: how many rows of structured context the parser extracted.

This module is still a context layer, not yet a polished city-by-city pollution dashboard.
"""
    )

air = load_air_context()
overview = load_air_overview()

if air is None:
    st.info("No processed air-context file is available yet. It will appear after the pipeline parses the official workbook.")
else:
    st.success("Air-context sample loaded")
    if overview is not None:
        sheet_options = ["All sheets"] + overview["source_sheet"].dropna().astype(str).sort_values().unique().tolist()
        selected_sheet = st.selectbox("Workbook sheet", sheet_options)
        filtered_overview = overview if selected_sheet == "All sheets" else overview[overview["source_sheet"] == selected_sheet]
        filtered_air = air if selected_sheet == "All sheets" else air[air["source_sheet"] == selected_sheet]

        col1, col2, col3 = st.columns(3)
        col1.metric("Air Resources", str(int(filtered_overview["source_file"].nunique())))
        col2.metric("Parsed Sheets", str(int(len(filtered_overview))))
        col3.metric("Context Rows", str(int(len(filtered_air))))

        fig = px.bar(
            filtered_overview,
            x="source_sheet",
            y="row_count",
            color="source_file",
            title="Rows Parsed Per Air Workbook Sheet",
        )
        fig.update_layout(xaxis_title="", yaxis_title="Rows")
        st.plotly_chart(fig, use_container_width=True)
    else:
        filtered_air = air

    st.dataframe(filtered_air.head(200), use_container_width=True, hide_index=True)

st.subheader("Planned outputs")
st.markdown(
    """
- monthly observation trend summaries
- city-level exposure snapshots
- cross-links between air context and other environmental modules
"""
)
