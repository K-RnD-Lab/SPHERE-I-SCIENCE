from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))


def _load_sorting_logic():
    module_path = DASHBOARD_DIR / "sorting_logic.py"
    spec = importlib.util.spec_from_file_location("kecologic_sorting_logic", module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load sorting logic from {module_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


SORTING_LOGIC = _load_sorting_logic()
build_preset_catalog_frame = SORTING_LOGIC.build_preset_catalog_frame
classify_item = SORTING_LOGIC.classify_item
preset_group_names = SORTING_LOGIC.preset_group_names
preset_hint_for_group = SORTING_LOGIC.preset_hint_for_group
preset_items_for_group = SORTING_LOGIC.preset_items_for_group


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
- or pick `Other / not listed here` and describe your own item in free text
"""
)

col1, col2 = st.columns([1, 1.4])
choose_category = "Choose category"
choose_item = "Choose listed item"
other_option = "Other / not listed here"
other_item_option = "Other item from this category"

with col1:
    group = st.selectbox(
        "Category",
        [choose_category] + preset_group_names() + [other_option],
    )
    group_hint = preset_hint_for_group(group)
    if group_hint:
        st.caption(group_hint)
    elif group == other_option:
        st.caption("Use this when the item is not covered by the prepared categories.")

with col2:
    item_options = [choose_item]
    if group not in [choose_category, other_option]:
        item_options += preset_items_for_group(group) + [other_item_option]
    selected_item = st.selectbox("Common item", item_options)

custom_item = st.text_input(
    "Custom item description",
    placeholder="e.g. yoghurt cup lid, broken thermometer, takeaway sauce sachet, blister pack, mixed wrapper",
    help="Use this field when the item is not listed exactly or when you want to be more specific than the ready-made options.",
)

effective_item = custom_item.strip()
if not effective_item and selected_item not in [choose_item, other_item_option]:
    effective_item = selected_item

if group == other_option and not effective_item:
    st.info("Type your own item below. `Other / not listed here` is the right choice when nothing in the catalog fits.")

if selected_item == other_item_option and not effective_item:
    st.info("This category is probably close. Type the exact item below and the assistant will still try to classify it.")

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
