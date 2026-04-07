from __future__ import annotations

import pandas as pd
import plotly.express as px
import streamlit as st

from common import (
    configure_page,
    load_air_city_snapshot,
    load_air_overview,
    load_air_permit_crosswalk,
    load_air_trends,
    load_radiation_overview,
    load_sortsmart_mart,
    load_water_overview,
)


configure_page("Air & Exposure")

st.title("Air & Exposure")
st.caption("Live MVP for monthly air-quality context, city snapshots, and cross-module environmental links")

st.markdown(
    """
This module now helps answer three more practical questions:

- how the observed air-pressure profile changes month to month
- which cities show the strongest concentration and exceedance signals in the latest month
- where air context already overlaps with other platform modules such as permits, waste, water, and radiation
"""
)

with st.expander("What do these air metrics mean?"):
    st.markdown(
        """
- `Months Covered`: how many monthly air observation files were successfully normalized.
- `Cities in Latest Month`: how many cities appear in the most recent parsed month.
- `Avg q/GDK ratio`: average monthly concentration relative to the daily-limit benchmark in the latest snapshot.
- `Cities with permit overlap`: cities where the air module also finds an exact-name overlap with the permits module.

Interpretation note:

- `qavg/GDK` closer to `1.0` means the monthly average is approaching the benchmark.
- `qmax/GDK` above `1.0` means the maximum one-time concentration exceeded that benchmark in the parsed source.
"""
    )

overview = load_air_overview()
trends = load_air_trends()
city_snapshot = load_air_city_snapshot()
crosswalk = load_air_permit_crosswalk()
sortsmart = load_sortsmart_mart()
water = load_water_overview()
radiation = load_radiation_overview()

if overview is None or trends is None or city_snapshot is None or crosswalk is None:
    st.info("Air module outputs will appear here after the pipeline builds the new air monthly trends and city snapshot marts.")
    st.stop()

latest_month_label = city_snapshot["observation_month_label"].dropna().iloc[0] if not city_snapshot.empty else "n/a"
permit_overlap_cities = int(crosswalk["has_permits_context"].sum()) if "has_permits_context" in crosswalk.columns else 0

col1, col2, col3, col4 = st.columns(4)
col1.metric("Months Covered", str(int(trends["observation_month_label"].dropna().nunique())))
col2.metric("Cities in Latest Month", str(int(city_snapshot["city"].nunique())))
col3.metric("Avg q/GDK ratio", f"{city_snapshot['avg_q_avg_gdk_ratio'].mean():.2f}")
col4.metric("Cities with permit overlap", str(permit_overlap_cities))

pollutant_options = ["All pollutants"] + sorted(trends["pollutant_name_uk"].dropna().unique().tolist())
selected_pollutant = st.selectbox("Pollutant focus", pollutant_options)

trend_view = trends if selected_pollutant == "All pollutants" else trends[trends["pollutant_name_uk"] == selected_pollutant]
latest_view = city_snapshot.copy()
if selected_pollutant != "All pollutants":
    latest_view = latest_view[
        latest_view["top_pollutant_name_uk"].eq(selected_pollutant) | latest_view["top_pollutant_name_uk"].isna()
    ]

tab1, tab2, tab3, tab4 = st.tabs(["Monthly Trends", "City Snapshots", "Cross-Module Links", "Source Coverage"])

with tab1:
    trend_metric = st.radio(
        "Trend metric",
        ["Average q/GDK ratio", "Peak qmax/GDK ratio"],
        horizontal=True,
    )
    y_column = "avg_q_avg_gdk_ratio" if trend_metric == "Average q/GDK ratio" else "max_q_max_gdk_ratio"

    trend_fig = px.line(
        trend_view,
        x="observation_month_label",
        y=y_column,
        color="pollutant_name_uk",
        markers=True,
        title="Monthly air-pressure trend by pollutant",
    )
    trend_fig.update_layout(xaxis_title="", yaxis_title=trend_metric)
    st.plotly_chart(trend_fig, use_container_width=True)

    top_months = trend_view.sort_values(y_column, ascending=False).head(20)
    st.dataframe(
        top_months[
            [
                "observation_month_label",
                "pollutant_name_uk",
                "city_count",
                "sample_count",
                "avg_q_avg_mg_m3",
                "avg_q_avg_gdk_ratio",
                "max_q_max_gdk_ratio",
            ]
        ],
        use_container_width=True,
        hide_index=True,
    )

with tab2:
    risk_options = ["All cities"] + sorted(latest_view["risk_band"].dropna().unique().tolist())
    selected_risk = st.selectbox("Latest-month city slice", risk_options)
    city_view = latest_view if selected_risk == "All cities" else latest_view[latest_view["risk_band"] == selected_risk]

    snapshot_fig = px.scatter(
        city_view.sort_values("max_q_max_gdk_ratio", ascending=False),
        x="avg_q_avg_gdk_ratio",
        y="max_q_max_gdk_ratio",
        size="pollutant_count",
        color="risk_band",
        hover_name="city",
        hover_data=["top_pollutant_name_uk", "permit_count"],
        title=f"Latest city snapshot for {latest_month_label}",
    )
    snapshot_fig.update_layout(xaxis_title="Average q/GDK ratio", yaxis_title="Peak qmax/GDK ratio")
    st.plotly_chart(snapshot_fig, use_container_width=True)

    top_cities_fig = px.bar(
        city_view.sort_values("max_q_max_gdk_ratio", ascending=False).head(15),
        x="city",
        y="max_q_max_gdk_ratio",
        color="permit_count",
        color_continuous_scale="YlOrRd",
        title="Cities with the strongest latest-month exceedance signal",
    )
    top_cities_fig.update_layout(xaxis_title="", yaxis_title="Peak qmax/GDK ratio")
    st.plotly_chart(top_cities_fig, use_container_width=True)

    st.dataframe(
        city_view[
            [
                "city",
                "pollutant_count",
                "avg_q_avg_gdk_ratio",
                "max_q_max_gdk_ratio",
                "top_pollutant_name_uk",
                "permit_count",
                "risk_band",
            ]
        ].sort_values(["max_q_max_gdk_ratio", "avg_q_avg_gdk_ratio"], ascending=[False, False]),
        use_container_width=True,
        hide_index=True,
    )

with tab3:
    left, right = st.columns([1, 1])

    with left:
        st.subheader("Air x Permits overlap")
        st.metric("Cities with exact-name permit matches", f"{permit_overlap_cities:,}")
        st.metric("Linked permit records", f"{int(crosswalk['permit_count'].sum()):,}")
        overlap_table = crosswalk[crosswalk["has_permits_context"]].sort_values("permit_count", ascending=False)
        if overlap_table.empty:
            st.info("The current permits dataset is still geographically narrow, so exact city overlaps are limited.")
        else:
            st.dataframe(
                overlap_table[
                    [
                        "city",
                        "permit_count",
                        "permit_admin_unit_count",
                        "permit_admin_units",
                        "latest_permit_issued",
                    ]
                ],
                use_container_width=True,
                hide_index=True,
            )

    with right:
        st.subheader("Platform-wide context links")
        waste_regions = int(sortsmart["oblast_name_en"].nunique()) if sortsmart is not None else 0
        water_basins = int(water["river_basin"].nunique()) if water is not None else 0
        radiation_regions = int(radiation["display_region"].nunique()) if radiation is not None else 0

        module_link_frame = pd.DataFrame(
            {
                "module": ["SortSmart Ukraine", "Water Watch", "Radiation & Risk"],
                "coverage_units": [waste_regions, water_basins, radiation_regions],
                "coverage_note": [
                    "Oblast-level waste and recovery context",
                    "River-basin level water monitoring",
                    "Regional radiation network coverage",
                ],
            }
        )
        link_df = px.bar(
            module_link_frame,
            x="module",
            y="coverage_units",
            color="coverage_units",
            color_continuous_scale="Teal",
            title="How much parallel context the platform already has around the air module",
        )
        link_df.update_layout(xaxis_title="", yaxis_title="Coverage units")
        st.plotly_chart(link_df, use_container_width=True)

        st.markdown(
            """
These links matter because air observations become more useful when they can be read alongside:

- regional waste and landfill pressure
- basin-level water monitoring
- regional radiation-network coverage
"""
        )

with tab4:
    source_fig = px.bar(
        overview.sort_values(["observation_month_label", "row_count"], ascending=[True, False]),
        x="observation_month_label",
        y="row_count",
        color="city_count",
        hover_data=["pollutant_count", "source_file", "source_sheet"],
        title="Rows parsed from official monthly air workbooks",
    )
    source_fig.update_layout(xaxis_title="", yaxis_title="Rows parsed")
    st.plotly_chart(source_fig, use_container_width=True)
    st.dataframe(overview, use_container_width=True, hide_index=True)
