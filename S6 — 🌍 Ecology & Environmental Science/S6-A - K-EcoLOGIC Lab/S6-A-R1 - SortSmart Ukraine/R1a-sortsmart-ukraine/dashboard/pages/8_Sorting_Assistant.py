from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from sorting_logic import classify_item


st.set_page_config(page_title="Sorting Assistant", layout="wide")

st.title("Sorting Assistant")
st.caption("A transparent assistant for packaging, containers, electronics, and everyday waste decisions")

st.markdown(
    """
This assistant is intentionally rule-based in the current version:

- it stays interpretable
- it avoids invented environmental facts
- it can later become the safe core underneath a more flexible AI layer
"""
)

item = st.text_input("Describe the item", placeholder="e.g. yoghurt cup, pizza box, charger, jar lid, paper bag")
classification, score = classify_item(item)

if item and classification:
    st.success(f"Likely stream: {classification['stream']}")
    explanation = (
        f"This item is most likely part of the `{classification['stream']}` stream. "
        f"A sensible default action is: {classification['what_to_do']} "
        f"The default container logic is `{classification['container_hint']}`. "
        f"This matters because {classification['why'].lower()}"
    )
    st.text_area("Generated explanation", explanation, height=220)
    if score <= 1:
        st.warning("Confidence is still limited. The current assistant uses transparent rules; a later AI layer can make free-text handling more flexible.")
else:
    st.info("Enter an item to generate a sorting explanation.")
