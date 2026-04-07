from __future__ import annotations

import re
from typing import Any

import pandas as pd


KEYWORD_RULES: list[dict[str, Any]] = [
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


def normalize_text(value: str) -> str:
    text = value.strip().lower().replace("-", " ")
    text = re.sub(r"\s+", " ", text)
    return text


def classify_item(user_text: str) -> tuple[dict[str, Any] | None, int]:
    normalized = normalize_text(user_text)
    if not normalized:
        return None, 0

    best_rule = None
    best_score = 0
    for rule in KEYWORD_RULES:
        score = sum(1 for keyword in rule["keywords"] if keyword in normalized)
        if score > best_score:
            best_rule = rule
            best_score = score
    return best_rule, best_score


def build_guide_frame() -> pd.DataFrame:
    return pd.DataFrame(
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
