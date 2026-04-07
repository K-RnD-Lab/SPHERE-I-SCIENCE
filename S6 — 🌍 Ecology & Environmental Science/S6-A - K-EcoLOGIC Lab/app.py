from __future__ import annotations

import runpy
import sys
from pathlib import Path

import streamlit as st


LAB_DIR = Path(__file__).resolve().parent
MODULE_DIR = LAB_DIR / "S6-A-R1 - SortSmart Ukraine" / "R1a-sortsmart-ukraine"
DASHBOARD_DIR = MODULE_DIR / "dashboard"


def _run_dashboard_script(relative_path: str) -> None:
    if str(DASHBOARD_DIR) not in sys.path:
        sys.path.insert(0, str(DASHBOARD_DIR))
    runpy.run_path(str((DASHBOARD_DIR / relative_path).resolve()), run_name="__main__")


def home_page() -> None:
    _run_dashboard_script("app.py")


def sortsmart_page() -> None:
    _run_dashboard_script("pages/1_SortSmart_Ukraine.py")


def air_page() -> None:
    _run_dashboard_script("pages/2_Air_Exposure.py")


def water_page() -> None:
    _run_dashboard_script("pages/3_Water_Watch.py")


def permits_page() -> None:
    _run_dashboard_script("pages/4_Polluters_Permits.py")


def radiation_page() -> None:
    _run_dashboard_script("pages/5_Radiation_Risk.py")


def packaging_page() -> None:
    _run_dashboard_script("pages/6_Packaging_Sorting_Guide.py")


navigation = st.navigation(
    {
        "K-EcoLOGIC Lab": [
            st.Page(home_page, title="Home", default=True),
        ],
        "Environmental Modules": [
            st.Page(sortsmart_page, title="SortSmart Ukraine"),
            st.Page(packaging_page, title="Packaging & Sorting Guide"),
            st.Page(air_page, title="Air & Exposure"),
            st.Page(water_page, title="Water Watch"),
            st.Page(permits_page, title="Polluters & Permits"),
            st.Page(radiation_page, title="Radiation & Risk"),
        ],
    },
    position="sidebar",
)

navigation.run()
