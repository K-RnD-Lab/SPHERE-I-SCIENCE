from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from activist_logic import (
    available_regions,
    build_module_brief,
    load_air_city_snapshot,
    load_air_story,
    load_national_story,
    load_permits_overview,
    load_permits_story,
    load_radiation_story,
    load_sortsmart_mart,
    load_sortsmart_trend,
    load_water_overview,
    load_water_story,
)


st.set_page_config(page_title="Environmental Briefs", layout="wide")

st.title("Environmental Briefs")
st.caption("Data-grounded narrative summaries built from the current platform marts and public evidence layer")

st.markdown(
    """
Use this page when you want a clean, copy-ready narrative rather than raw charts.

The generator stays grounded in the current processed data and is best treated as an explanation layer, not as a replacement for the source tables.
"""
)

sortsmart = load_sortsmart_mart()
trend = load_sortsmart_trend()
air_snapshot = load_air_city_snapshot()
water_overview = load_water_overview()
permits_overview = load_permits_overview()
national_story = load_national_story()
air_story = load_air_story()
water_story = load_water_story()
permits_story = load_permits_story()
radiation_story = load_radiation_story()

audience = st.selectbox("Audience", ["Public summary", "Activist brief", "Municipal note", "Donor / partner pitch"])
module = st.selectbox(
    "Theme",
    ["SortSmart Ukraine", "Air & Exposure", "Water Watch", "Polluters & Permits", "Radiation & Risk"],
)
region = st.selectbox("Region focus", available_regions(sortsmart))

brief = build_module_brief(
    module=module,
    audience=audience,
    region=region,
    sortsmart=sortsmart,
    trend=trend,
    air_snapshot=air_snapshot,
    water_overview=water_overview,
    permits_overview=permits_overview,
    national_story=national_story,
    air_story=air_story,
    water_story=water_story,
    permits_story=permits_story,
    radiation_story=radiation_story,
)

st.markdown("**Generated brief**")
st.text_area("Copy-ready brief", brief, height=320)
