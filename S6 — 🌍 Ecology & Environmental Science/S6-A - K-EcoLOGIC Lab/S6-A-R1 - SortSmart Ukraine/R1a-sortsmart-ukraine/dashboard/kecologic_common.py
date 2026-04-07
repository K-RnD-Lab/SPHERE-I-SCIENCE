from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st


ROOT_DIR = Path(__file__).resolve().parents[1]
MART_PATH = ROOT_DIR / "data" / "processed" / "marts" / "oblast_sorting_readiness.parquet"
MART_TREND_PATH = ROOT_DIR / "data" / "processed" / "marts" / "oblast_sorting_readiness_trend.parquet"
MATERIALS_PATH = ROOT_DIR / "dbt" / "seeds" / "material_factors.csv"
AIR_CONTEXT_PATH = ROOT_DIR / "data" / "processed" / "normalized" / "air_quality_context.parquet"
AIR_OVERVIEW_PATH = ROOT_DIR / "data" / "processed" / "marts" / "air_module_overview.parquet"
AIR_TRENDS_PATH = ROOT_DIR / "data" / "processed" / "marts" / "air_monthly_trends.parquet"
AIR_CITY_SNAPSHOT_PATH = ROOT_DIR / "data" / "processed" / "marts" / "air_city_snapshot.parquet"
AIR_PERMIT_CROSSWALK_PATH = ROOT_DIR / "data" / "processed" / "marts" / "air_permit_crosswalk.parquet"
WATER_OVERVIEW_PATH = ROOT_DIR / "data" / "processed" / "marts" / "water_basin_overview.parquet"
PERMITS_OVERVIEW_PATH = ROOT_DIR / "data" / "processed" / "marts" / "permits_city_overview.parquet"
RADIATION_LOCATIONS_PATH = ROOT_DIR / "data" / "processed" / "normalized" / "radiation_locations.parquet"
RADIATION_OVERVIEW_PATH = ROOT_DIR / "data" / "processed" / "marts" / "radiation_station_overview.parquet"
RADIATION_PLATFORMS_PATH = ROOT_DIR / "data" / "processed" / "marts" / "radiation_platform_overview.parquet"


def configure_page(title: str) -> None:
    st.set_page_config(page_title=title, layout="wide")


@st.cache_data(show_spinner=False)
def load_sortsmart_mart() -> pd.DataFrame | None:
    if not MART_PATH.exists():
        return None
    return pd.read_parquet(MART_PATH)


@st.cache_data(show_spinner=False)
def load_sortsmart_trend() -> pd.DataFrame | None:
    if not MART_TREND_PATH.exists():
        return None
    return pd.read_parquet(MART_TREND_PATH)


@st.cache_data(show_spinner=False)
def load_materials() -> pd.DataFrame:
    return pd.read_csv(MATERIALS_PATH)


@st.cache_data(show_spinner=False)
def load_air_context() -> pd.DataFrame | None:
    if not AIR_CONTEXT_PATH.exists():
        return None
    return pd.read_parquet(AIR_CONTEXT_PATH)


@st.cache_data(show_spinner=False)
def load_air_overview() -> pd.DataFrame | None:
    if not AIR_OVERVIEW_PATH.exists():
        return None
    return pd.read_parquet(AIR_OVERVIEW_PATH)


@st.cache_data(show_spinner=False)
def load_air_trends() -> pd.DataFrame | None:
    if not AIR_TRENDS_PATH.exists():
        return None
    return pd.read_parquet(AIR_TRENDS_PATH)


@st.cache_data(show_spinner=False)
def load_air_city_snapshot() -> pd.DataFrame | None:
    if not AIR_CITY_SNAPSHOT_PATH.exists():
        return None
    return pd.read_parquet(AIR_CITY_SNAPSHOT_PATH)


@st.cache_data(show_spinner=False)
def load_air_permit_crosswalk() -> pd.DataFrame | None:
    if not AIR_PERMIT_CROSSWALK_PATH.exists():
        return None
    return pd.read_parquet(AIR_PERMIT_CROSSWALK_PATH)


@st.cache_data(show_spinner=False)
def load_water_overview() -> pd.DataFrame | None:
    if not WATER_OVERVIEW_PATH.exists():
        return None
    return pd.read_parquet(WATER_OVERVIEW_PATH)


@st.cache_data(show_spinner=False)
def load_permits_overview() -> pd.DataFrame | None:
    if not PERMITS_OVERVIEW_PATH.exists():
        return None
    return pd.read_parquet(PERMITS_OVERVIEW_PATH)


@st.cache_data(show_spinner=False)
def load_radiation_locations() -> pd.DataFrame | None:
    if not RADIATION_LOCATIONS_PATH.exists():
        return None
    return pd.read_parquet(RADIATION_LOCATIONS_PATH)


@st.cache_data(show_spinner=False)
def load_radiation_overview() -> pd.DataFrame | None:
    if not RADIATION_OVERVIEW_PATH.exists():
        return None
    return pd.read_parquet(RADIATION_OVERVIEW_PATH)


@st.cache_data(show_spinner=False)
def load_radiation_platforms() -> pd.DataFrame | None:
    if not RADIATION_PLATFORMS_PATH.exists():
        return None
    return pd.read_parquet(RADIATION_PLATFORMS_PATH)


def render_pipeline_hint() -> None:
    st.warning("Run the local pipeline first. Expected processed files were not found.")
    st.code("python -m sortsmart_ukraine.pipeline.run_local", language="bash")
