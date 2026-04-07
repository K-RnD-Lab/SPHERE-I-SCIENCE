from __future__ import annotations

import re
import sys
from pathlib import Path

import pandas as pd
import streamlit as st


DASHBOARD_DIR = Path(__file__).resolve().parents[1]
if str(DASHBOARD_DIR) not in sys.path:
    sys.path.insert(0, str(DASHBOARD_DIR))

from kecologic_common import configure_page, load_materials


configure_page("Packaging & Sorting Guide")


KEYWORD_RULES = [
    {
        "stream": "Paper / cardboard",
        "keywords": ["paper", "cardboard", "box", "carton", "kraft", "pizza box", "receipt", "newspaper"],
        "examples": "cardboard box, paper bag, office paper",
        "what_to_do": "Keep it dry, flatten bulky items, and avoid mixing with oily or food-soiled waste.",
        "container_hint": "Paper bin or dry recyclables bin",
        "why": "Fiber is usually one of the highest-value recovery streams when contamination is low.",
    },
    {
        "stream": "Plastic",
        "keywords": ["plastic", "pet", "bottle", "shampoo", "detergent", "container", "packaging film", "bag"],
        "examples": "PET bottle, detergent bottle, rigid plastic food container",
        "what_to_do": "Rinse obvious residue, compress when possible, and separate hard plastic from mixed waste.",
        "container_hint": "Plastic bin or mixed dry recyclables bin",
        "why": "Plastic recovery is useful, but contamination and mixed polymer streams reduce quality.",
    },
    {
        "stream": "Glass",
        "keywords": ["glass", "jar", "bottle"],
        "examples": "glass bottle, glass jar",
        "what_to_do": "Empty contents and remove obvious contamination. Sort by color only if your local system asks for it.",
        "container_hint": "Glass bin or dry recyclables bin",
        "why": "Glass is highly recyclable but heavy, so local collection matters.",
    },
    {
        "stream": "Metals",
        "keywords": ["metal", "aluminium", "aluminum", "can", "tin", "steel", "foil"],
        "examples": "aluminium can, steel food tin",
        "what_to_do": "Rinse if dirty and keep in the metal or dry recyclables stream.",
        "container_hint": "Metal bin or dry recyclables bin",
        "why": "Metals are usually high-value recovery materials.",
    },
    {
        "stream": "Organics",
        "keywords": ["food", "organic", "banana", "peel", "coffee", "grounds", "tea", "leaves", "yard"],
        "examples": "food scraps, coffee grounds, yard waste",
        "what_to_do": "Best diverted to composting or organics collection if it exists.",
        "container_hint": "Organics bin, compost, or separate collection",
        "why": "Organic waste is a major landfill driver and should ideally be diverted early.",
    },
    {
        "stream": "Textiles",
        "keywords": ["textile", "clothes", "clothing", "fabric", "shirt", "jeans"],
        "examples": "shirt, towel, reusable fabric item",
        "what_to_do": "Separate reusable textiles before disposal. Donate or route to textile collection when possible.",
        "container_hint": "Reuse / donation / textile collection point",
        "why": "Textiles have reuse value and should not default to mixed waste when usable.",
    },
    {
        "stream": "Wood",
        "keywords": ["wood", "timber", "board", "plywood"],
        "examples": "clean wood offcuts, untreated board",
        "what_to_do": "Keep clean wood separate from treated or painted wood.",
        "container_hint": "Bulky waste or dedicated wood collection",
        "why": "Wood streams are manageable only when clean and separated.",
    },
    {
        "stream": "E-waste",
        "keywords": ["phone", "charger", "cable", "electronic", "electronics", "keyboard", "mouse", "appliance"],
        "examples": "charger, cable, small electronics",
        "what_to_do": "Do not place in mixed waste. Use dedicated collection points only.",
        "container_hint": "E-waste drop-off point",
        "why": "Electronic devices contain complex and sometimes hazardous components.",
    },
    {
        "stream": "Batteries",
        "keywords": ["battery", "aa", "aaa", "accumulator", "power bank"],
        "examples": "AA battery, rechargeable battery, power bank",
        "what_to_do": "Never place in mixed waste. Store safely and use dedicated battery collection points.",
        "container_hint": "Battery drop-off point",
        "why": "Batteries are hazardous and can damage recovery systems or landfills.",
    },
]


def _normalize_text(value: str) -> str:
    text = value.strip().lower().replace("-", " ")
    text = re.sub(r"\s+", " ", text)
    return text


def _classify_item(user_text: str) -> dict[str, str] | None:
    normalized = _normalize_text(user_text)
    if not normalized:
        return None

    best_rule = None
    best_score = 0
    for rule in KEYWORD_RULES:
        score = sum(1 for keyword in rule["keywords"] if keyword in normalized)
        if score > best_score:
            best_rule = rule
            best_score = score
    return best_rule


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
    result = _classify_item(effective_query)

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
    else:
        st.info("Enter an item above to get a practical sorting recommendation.")

    st.markdown(
        """
This is the right place to add AI later.

The useful AI role here would be:

- reading free-form user input
- guessing the packaging type more flexibly
- explaining uncertainty
- translating the answer into simple public language

But the core classification logic should still stay tied to transparent material rules and local infrastructure.
"""
    )

with tab2:
    st.subheader("Material streams used by the platform")
    st.dataframe(materials, use_container_width=True, hide_index=True)

    guide_frame = pd.DataFrame(
        [
            {
                "stream": rule["stream"],
                "examples": rule["examples"],
                "container_hint": rule["container_hint"],
                "why_it_matters": rule["why"],
            }
            for rule in KEYWORD_RULES
        ]
    )
    st.subheader("Public-facing packaging guide")
    st.dataframe(guide_frame, use_container_width=True, hide_index=True)

    st.warning(
        "The next upgrade should connect these guidance rules to city-level infrastructure data, so the answer can depend not only on material, but also on the user's municipality."
    )
