from __future__ import annotations

import plotly.express as px
import streamlit as st

from common import configure_page, load_permits_overview


configure_page("Polluters & Permits")

st.title("Polluters & Permits")
st.caption("Planned oversight module for permits, EIA, and industrial monitoring")

st.markdown(
    """
This module is intended to connect:

- environmental permits
- EIA records
- oversight and compliance context
- industrial actors linked to environmental pressure
"""
)

with st.expander("What do these permit metrics mean?"):
    st.markdown(
        """
- `Settlements`: how many settlements appear in the currently parsed permits file.
- `Total Permits`: count of permits in the processed dataset.
- `Unlimited Permits`: permits marked as open-ended rather than expiring on a specific date.
- `Expired count`: permits whose parsed validity date is earlier than today.
"""
    )

permits = load_permits_overview()

if permits is None:
    st.info("Permits module data will appear here after the pipeline downloads and normalizes the latest open permits CSV.")
else:
    st.warning("Current MVP coverage is limited to the latest open permits CSV currently published for Vinnytsia oblast.")
    settlement_options = ["Top settlements"] + permits["settlement"].dropna().astype(str).sort_values().unique().tolist()
    selected_settlement = st.selectbox("Settlement focus", settlement_options)
    filtered_permits = permits if selected_settlement == "Top settlements" else permits[permits["settlement"] == selected_settlement]

    col1, col2, col3 = st.columns(3)
    col1.metric("Settlements", str(int(filtered_permits["settlement"].nunique(dropna=True))))
    col2.metric("Total Permits", f"{int(filtered_permits['permit_count'].sum()):,}")
    col3.metric("Unlimited Permits", f"{int(filtered_permits['unlimited_count'].sum()):,}")

    fig = px.bar(
        filtered_permits.head(20),
        x="settlement",
        y="permit_count",
        color="expired_count",
        color_continuous_scale="OrRd",
        title="Top Settlements by Permit Count",
    )
    fig.update_layout(xaxis_title="", yaxis_title="Permits")
    st.plotly_chart(fig, use_container_width=True)

    st.dataframe(filtered_permits, use_container_width=True, hide_index=True)
