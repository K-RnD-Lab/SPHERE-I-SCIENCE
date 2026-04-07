from __future__ import annotations

import sys
from pathlib import Path

import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from kecologic_common import configure_page, load_materials
from sorting_logic import KEYWORD_RULES, build_guide_frame, classify_item


configure_page("Packaging & Sorting Guide")

st.title("Packaging & Sorting Guide")
st.caption("Public-facing sorting help for packaging, containers, and everyday waste items")

st.markdown(
    """
This page is the practical education layer of the platform.

It focuses on a simple public question:

- what is this item likely made of
- which stream does it belong to
- what should a person actually do with it
- when should it never go into mixed waste
"""
)

with st.expander("How to read this guide"):
    st.markdown(
        """
- `Likely stream` is the best-fit material category, not always a guarantee of local collection.
- `Container hint` is a sensible default when city-specific infrastructure is unknown.
- `Why it matters` explains why the separation is worth doing.

Important:

- local container colors and rules vary by municipality
- this guide is a public-education logic layer, not a legal instruction for every city
- hazardous items and e-waste should always go to dedicated collection points
"""
    )

materials = load_materials()

tab1, tab2 = st.tabs(["Where should this go?", "Material Logic"])

with tab1:
    st.subheader("Interactive sorting assistant")
    user_item = st.text_input(
        "Describe an item or packaging type",
        placeholder="e.g. PET bottle, pizza box, battery, glass jar, charger",
    )

    sample_options = [
        "PET bottle",
        "paper coffee cup",
        "glass jar",
        "aluminium can",
        "banana peel",
        "charger",
        "battery",
    ]
    sample_pick = st.selectbox("Or try a sample item", ["Choose one"] + sample_options)

    effective_query = user_item.strip() if user_item.strip() else ("" if sample_pick == "Choose one" else sample_pick)
    result, score = classify_item(effective_query)

    if effective_query and result is None:
        st.warning(
            "The current rule-based assistant could not classify this item confidently yet. That is a good candidate for the next AI-assisted upgrade."
        )
    elif effective_query and result is not None:
        st.success(f"Likely stream: {result['stream']}")
        col1, col2 = st.columns(2)
        with col1:
            st.markdown(f"**Examples in this stream**: {result['examples']}")
            st.markdown(f"**What to do**: {result['what_to_do']}")
        with col2:
            st.markdown(f"**Container hint**: {result['container_hint']}")
            st.markdown(f"**Why it matters**: {result['why']}")
        if score <= 1:
            st.caption("Confidence is still low because the current assistant uses transparent keyword rules rather than a full language model.")
    else:
        st.info("Enter an item above to get a practical sorting recommendation.")

    st.markdown(
        """
This is now the rule-based foundation for the platform's broader AI layer.

The useful AI role on top of this logic is:

- reading free-form user input
- guessing the packaging type more flexibly
- explaining uncertainty
- translating the answer into simple public language

You can now find those higher-level layers in `Environmental Briefs`, `Sorting Assistant`, and `Activist Requests`, while this page keeps the transparent rule-based core.
"""
    )

with tab2:
    st.subheader("Material streams used by the platform")
    st.dataframe(materials, use_container_width=True, hide_index=True)

    guide_frame = build_guide_frame()
    st.subheader("Public-facing packaging guide")
    st.dataframe(guide_frame, use_container_width=True, hide_index=True)

    st.warning(
        "The next upgrade should connect these guidance rules to city-level infrastructure data, so the answer can depend not only on material, but also on the user's municipality."
    )
