from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from activist_logic import (
    available_regions,
    build_data_gaps,
    build_draft_request,
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


st.set_page_config(page_title="Activist Requests", layout="wide")

st.title("Activist Requests")
st.caption("Problem framing, data-gap surfacing, and copy-ready requests for civic, municipal, and partner outreach")

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

target = st.selectbox(
    "Target audience",
    ["Municipality or city council", "Regional administration", "Ministry or national authority", "NGO or donor partner"],
)
theme = st.selectbox(
    "Issue area",
    ["SortSmart Ukraine", "Air & Exposure", "Water Watch", "Polluters & Permits", "Radiation & Risk"],
)
region = st.selectbox("Target region", available_regions(sortsmart))

summary = build_module_brief(
    module=theme,
    audience="Activist brief",
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
gaps = build_data_gaps(theme, region)
draft = build_draft_request(theme, region, target)

st.markdown("**Problem summary**")
st.text_area("Problem brief", summary, height=240)
st.markdown("**Data gaps to highlight**")
st.markdown("\n".join(f"- {gap}" for gap in gaps))
st.markdown("**Draft request**")
st.text_area("Copy-ready request", draft, height=340)
