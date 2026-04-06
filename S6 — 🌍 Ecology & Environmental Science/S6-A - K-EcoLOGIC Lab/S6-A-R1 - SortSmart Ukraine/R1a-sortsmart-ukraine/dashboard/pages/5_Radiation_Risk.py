from __future__ import annotations

import streamlit as st

from common import configure_page


configure_page("Radiation & Risk")

st.title("Radiation & Risk")
st.caption("Planned contextual risk-monitoring module")

st.markdown(
    """
This module can later host:

- radiation background context
- regional anomaly watch
- emergency or incident overlays
- cross-module risk communication
"""
)

st.info("Kept as a platform placeholder for now so the public-facing site already reads as one coherent environmental system.")
