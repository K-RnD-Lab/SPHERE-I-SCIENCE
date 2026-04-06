from __future__ import annotations

import streamlit as st

from common import (
    configure_page,
    load_air_context,
    load_air_overview,
    load_permits_overview,
    load_radiation_overview,
    load_sortsmart_mart,
    load_water_overview,
)


configure_page("K-EcoLOGIC Lab")

st.title("K-EcoLOGIC Lab")
st.caption("Environmental intelligence platform for Ukraine")

st.markdown(
    """
K-EcoLOGIC Lab is designed as one platform with several modules that share:

- one data warehouse
- one transformation layer
- one dashboard surface
- one research narrative

For the current Zoomcamp delivery, the flagship module is `SortSmart Ukraine`.
"""
)

mart = load_sortsmart_mart()
air = load_air_context()
air_overview = load_air_overview()
water_overview = load_water_overview()
permits_overview = load_permits_overview()
radiation_overview = load_radiation_overview()

col1, col2, col3 = st.columns(3)
active_modules = sum(value is not None for value in [mart, air_overview, water_overview, permits_overview, radiation_overview])
col1.metric("Data-backed Modules", str(active_modules))
col2.metric("Platform Pages", "5")
col3.metric("Core Scope", "Ukraine")

st.subheader("Module Map")

module_data = [
    {
        "module": "SortSmart Ukraine",
        "status": "Live",
        "focus": "Waste sorting readiness, recovery gap, climate impact",
    },
    {
        "module": "Air & Exposure",
        "status": "Live MVP" if air_overview is not None else "Scaffolded",
        "focus": "Air-quality context and exposure visibility",
    },
    {
        "module": "Water Watch",
        "status": "Live MVP" if water_overview is not None else "Scaffolded",
        "focus": "Surface-water monitoring and trend intelligence",
    },
    {
        "module": "Polluters & Permits",
        "status": "Live MVP" if permits_overview is not None else "Scaffolded",
        "focus": "Permits, EIA, and environmental oversight",
    },
    {
        "module": "Radiation & Risk",
        "status": "Live MVP" if radiation_overview is not None else "Scaffolded",
        "focus": "Monitoring-network coverage and radiation context",
    },
]

st.dataframe(module_data, use_container_width=True, hide_index=True)

st.subheader("Current Data Footprint")

col1, col2 = st.columns(2)
with col1:
    if mart is None:
        st.info("SortSmart mart appears after the local pipeline is run.")
    else:
        st.success("SortSmart mart ready")
        st.write(
            {
                "regions": int(mart["oblast_name_en"].nunique()),
                "latest_year": int(mart["year"].max()),
                "priority_materials": int(mart["priority_material"].nunique()),
            }
        )

with col2:
    if air is None and water_overview is None and permits_overview is None and radiation_overview is None:
        st.info("Additional environmental context appears after the pipeline finishes all module transforms.")
    else:
        st.success("Additional modules ready")
        st.write(
            {
                "air_rows": int(len(air)) if air is not None else 0,
                "water_basins": int(len(water_overview)) if water_overview is not None else 0,
                "permit_settlements": int(len(permits_overview)) if permits_overview is not None else 0,
                "radiation_regions": int(len(radiation_overview)) if radiation_overview is not None else 0,
            }
        )

st.subheader("How to use this site")
st.markdown(
    """
Use the left sidebar to open a module page:

- `SortSmart Ukraine` for the main working dashboard
- `Air & Exposure` for climate-context monitoring
- the remaining pages for platform roadmap and module framing
"""
)
