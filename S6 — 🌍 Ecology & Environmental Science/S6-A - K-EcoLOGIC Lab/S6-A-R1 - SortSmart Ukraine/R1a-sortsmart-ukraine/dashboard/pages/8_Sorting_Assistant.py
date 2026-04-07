from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from sorting_logic import (
    build_preset_catalog_frame,
    classify_item,
    preset_group_names,
    preset_hint_for_group,
    preset_items_for_group,
)


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

st.markdown(
    """
Use it in two ways:

- choose a common item from the prepared catalog below
- or pick `Other / none above` and describe your own item in free text
"""
)

col1, col2 = st.columns([1, 1.4])

with col1:
    group = st.selectbox(
        "Category",
        ["Choose category"] + preset_group_names() + ["Other / none above"],
    )
    group_hint = preset_hint_for_group(group)
    if group_hint:
        st.caption(group_hint)

with col2:
    item_options = ["Choose item"]
    if group not in ["Choose category", "Other / none above"]:
        item_options += preset_items_for_group(group)
    selected_item = st.selectbox("Common item", item_options)

custom_item = st.text_input(
    "Custom item description",
    placeholder="e.g. yoghurt cup lid, broken thermometer, takeaway sauce sachet, blister pack",
)

effective_item = custom_item.strip()
if not effective_item and selected_item != "Choose item":
    effective_item = selected_item

if group == "Other / none above" and not effective_item:
    st.info("Pick `Other / none above` only when the catalog does not fit, then describe the item in the custom field below.")

if effective_item:
    st.caption(f"Current item in analysis: `{effective_item}`")

classification, score = classify_item(effective_item)

if effective_item and classification:
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
    st.info("Choose a common item from the catalog or type a custom item to generate a sorting explanation.")

with st.expander("Browse the prepared item catalog"):
    st.markdown(
        """
This catalog is meant to cover the most common public-facing cases first:

- everyday packaging
- food and organic waste
- textiles and bulky waste
- electronics, batteries, and hazardous items
- medicines, sanitary waste, and construction leftovers
"""
    )
    st.dataframe(build_preset_catalog_frame(), use_container_width=True, hide_index=True)
