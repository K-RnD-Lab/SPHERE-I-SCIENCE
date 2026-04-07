from __future__ import annotations

import re
from typing import Any

import pandas as pd


KEYWORD_RULES: list[dict[str, Any]] = [
    {
        "stream": "Paper / cardboard",
        "keywords": [
            "paper",
            "cardboard",
            "box",
            "carton",
            "kraft",
            "pizza box",
            "receipt",
            "newspaper",
            "magazine",
            "envelope",
            "book",
            "egg carton",
            "cereal box",
            "paper bag",
            "wrapping paper",
            "notebook",
        ],
        "examples": "cardboard box, paper bag, office paper, cereal box",
        "what_to_do": "Keep it dry, flatten bulky items, and avoid mixing with oily or food-soiled waste.",
        "container_hint": "Paper bin or dry recyclables bin",
        "why": "Fiber is usually one of the highest-value recovery streams when contamination is low.",
    },
    {
        "stream": "Plastic",
        "keywords": [
            "plastic",
            "pet",
            "bottle",
            "shampoo",
            "detergent",
            "container",
            "packaging film",
            "bag",
            "yoghurt cup",
            "yogurt cup",
            "takeaway container",
            "food tray",
            "cosmetic bottle",
            "cap",
            "lid",
            "bucket",
            "bubble wrap",
            "cling film",
            "bread bag",
            "frozen bag",
            "mailer",
        ],
        "examples": "PET bottle, detergent bottle, rigid plastic food container, yoghurt cup",
        "what_to_do": "Rinse obvious residue, compress when possible, and separate hard plastic from mixed waste.",
        "container_hint": "Plastic bin or mixed dry recyclables bin",
        "why": "Plastic recovery is useful, but contamination and mixed polymer streams reduce quality.",
    },
    {
        "stream": "Glass",
        "keywords": ["glass", "jar", "bottle", "perfume bottle", "sauce jar", "wine bottle", "beer bottle"],
        "examples": "glass bottle, glass jar, perfume bottle",
        "what_to_do": "Empty contents and remove obvious contamination. Sort by color only if your local system asks for it.",
        "container_hint": "Glass bin or dry recyclables bin",
        "why": "Glass is highly recyclable but heavy, so local collection matters.",
    },
    {
        "stream": "Metals",
        "keywords": [
            "metal",
            "aluminium",
            "aluminum",
            "can",
            "tin",
            "steel",
            "foil",
            "metal lid",
            "jar lid",
            "food tin",
            "beverage can",
        ],
        "examples": "aluminium can, steel food tin, foil tray",
        "what_to_do": "Rinse if dirty and keep in the metal or dry recyclables stream.",
        "container_hint": "Metal bin or dry recyclables bin",
        "why": "Metals are usually high-value recovery materials.",
    },
    {
        "stream": "Composite packaging",
        "keywords": [
            "tetra pak",
            "tetrapak",
            "juice carton",
            "milk carton",
            "coffee cup",
            "paper cup",
            "chip tube",
            "chips can",
            "blister pack",
            "multi layer",
        ],
        "examples": "milk carton, juice carton, takeaway paper cup",
        "what_to_do": "Treat as a separate composite stream when possible. If your city does not collect composites separately, check the dry recyclables rules or local guidance.",
        "container_hint": "Composite packaging bin, dry recyclables bin, or city-specific collection point",
        "why": "Composite packaging mixes several materials, so collection and recovery depend strongly on local infrastructure.",
    },
    {
        "stream": "Organics",
        "keywords": [
            "food",
            "organic",
            "banana",
            "peel",
            "coffee",
            "grounds",
            "tea",
            "leaves",
            "yard",
            "vegetable scraps",
            "fruit scraps",
            "eggshell",
            "flowers",
            "bread scraps",
        ],
        "examples": "food scraps, coffee grounds, yard waste, eggshells",
        "what_to_do": "Best diverted to composting or organics collection if it exists.",
        "container_hint": "Organics bin, compost, or separate collection",
        "why": "Organic waste is a major landfill driver and should ideally be diverted early.",
    },
    {
        "stream": "Textiles",
        "keywords": ["textile", "clothes", "clothing", "fabric", "shirt", "jeans", "towel", "blanket", "curtain", "bag"],
        "examples": "shirt, towel, blanket, reusable fabric item",
        "what_to_do": "Separate reusable textiles before disposal. Donate or route to textile collection when possible.",
        "container_hint": "Reuse / donation / textile collection point",
        "why": "Textiles have reuse value and should not default to mixed waste when usable.",
    },
    {
        "stream": "Wood / bulky waste",
        "keywords": ["wood", "timber", "board", "plywood", "wooden", "furniture", "shelf", "pallet", "crate"],
        "examples": "clean wood offcuts, untreated board, wooden crate, shelf",
        "what_to_do": "Keep clean wood separate from treated or painted wood.",
        "container_hint": "Bulky waste or dedicated wood collection",
        "why": "Wood streams are manageable only when clean and separated.",
    },
    {
        "stream": "E-waste",
        "keywords": [
            "phone",
            "charger",
            "cable",
            "electronic",
            "electronics",
            "keyboard",
            "mouse",
            "appliance",
            "laptop",
            "tablet",
            "router",
            "headphones",
            "toaster",
            "kettle",
            "remote",
        ],
        "examples": "charger, cable, phone, laptop, small electronics",
        "what_to_do": "Do not place in mixed waste. Use dedicated collection points only.",
        "container_hint": "E-waste drop-off point",
        "why": "Electronic devices contain complex and sometimes hazardous components.",
    },
    {
        "stream": "Batteries",
        "keywords": ["battery", "aa", "aaa", "accumulator", "power bank", "coin cell", "lithium battery", "phone battery"],
        "examples": "AA battery, rechargeable battery, coin cell, power bank",
        "what_to_do": "Never place in mixed waste. Store safely and use dedicated battery collection points.",
        "container_hint": "Battery drop-off point",
        "why": "Batteries are hazardous and can damage recovery systems or landfills.",
    },
    {
        "stream": "Household hazardous waste",
        "keywords": [
            "paint",
            "solvent",
            "varnish",
            "chemical",
            "aerosol",
            "fluorescent lamp",
            "light bulb",
            "mercury thermometer",
            "motor oil",
            "pesticide",
            "cleaning chemical",
        ],
        "examples": "paint can, solvent bottle, fluorescent lamp, mercury thermometer",
        "what_to_do": "Keep this out of mixed waste and out of ordinary recycling. Use hazardous-waste collection, special drop-off, or a municipal take-back route.",
        "container_hint": "Hazardous waste collection point",
        "why": "These items can contaminate other streams and pose direct health or environmental risks.",
    },
    {
        "stream": "Medicines",
        "keywords": ["medicine", "medication", "pill", "tablet", "syrup", "ointment", "expired medicine"],
        "examples": "expired tablets, medicine bottle, syrup packaging",
        "what_to_do": "Do not place medicines in ordinary recycling or loose into mixed waste. Use pharmacy take-back or hazardous collection where available.",
        "container_hint": "Pharmacy take-back or hazardous waste point",
        "why": "Medicines require special handling because they can contaminate water and residual waste streams.",
    },
    {
        "stream": "Sanitary / residual waste",
        "keywords": ["diaper", "nappy", "sanitary pad", "tampon", "mask", "bandage", "cotton swab", "wet wipe", "tissue"],
        "examples": "diaper, sanitary pad, used mask, wet wipe",
        "what_to_do": "Treat as residual waste unless a specialized medical or sanitary collection route exists.",
        "container_hint": "Residual waste / mixed waste bin",
        "why": "These items are usually contaminated, low-recovery, and unsuitable for ordinary recycling streams.",
    },
    {
        "stream": "Construction waste",
        "keywords": ["brick", "tile", "concrete", "drywall", "gypsum", "insulation", "rubble", "cement bag"],
        "examples": "broken tile, brick rubble, drywall offcuts",
        "what_to_do": "Keep separate from household mixed waste and use bulky or construction-waste collection where available.",
        "container_hint": "Construction waste point or bulky waste route",
        "why": "Construction material is heavy, often mineral-based, and usually handled outside standard household collection.",
    },
]


PRESET_GROUPS: list[dict[str, Any]] = [
    {
        "group": "Paper and cardboard",
        "hint": "Dry fiber-based packaging and paper items.",
        "items": [
            "cardboard box",
            "paper bag",
            "office paper",
            "newspaper",
            "magazine",
            "egg carton",
            "cereal box",
            "mailing envelope",
            "wrapping paper",
            "pizza box",
            "paper napkin",
            "receipt",
        ],
    },
    {
        "group": "Plastic packaging and containers",
        "hint": "Rigid and flexible plastic packaging used in daily life.",
        "items": [
            "PET bottle",
            "shampoo bottle",
            "detergent bottle",
            "yoghurt cup",
            "takeaway container",
            "plastic food tray",
            "cosmetic bottle",
            "plastic cap",
            "bread bag",
            "cling film",
            "bubble wrap",
            "courier mailer",
        ],
    },
    {
        "group": "Glass",
        "hint": "Bottles and jars that are mostly glass-based.",
        "items": [
            "glass bottle",
            "glass jar",
            "perfume bottle",
            "wine bottle",
            "beer bottle",
            "sauce jar",
        ],
    },
    {
        "group": "Metals",
        "hint": "Common metal beverage, food, and kitchen packaging.",
        "items": [
            "aluminium can",
            "steel food tin",
            "foil tray",
            "metal lid",
            "jar lid",
            "tin can",
            "aluminium foil",
        ],
    },
    {
        "group": "Composite packaging",
        "hint": "Multi-layer packaging that mixes paper, plastic, and sometimes aluminium.",
        "items": [
            "milk carton",
            "juice carton",
            "paper coffee cup",
            "chip tube",
            "blister pack",
            "tetra pak package",
        ],
    },
    {
        "group": "Organic waste",
        "hint": "Food and compostable household scraps.",
        "items": [
            "banana peel",
            "vegetable scraps",
            "fruit scraps",
            "coffee grounds",
            "tea bag",
            "eggshells",
            "bread scraps",
            "flowers",
            "yard leaves",
        ],
    },
    {
        "group": "Textiles and reuse",
        "hint": "Clothing, fabric, and reusable household soft goods.",
        "items": [
            "shirt",
            "jeans",
            "towel",
            "blanket",
            "curtain",
            "fabric bag",
            "old clothes",
        ],
    },
    {
        "group": "Wood and bulky items",
        "hint": "Large or wood-based household items.",
        "items": [
            "wooden crate",
            "plywood board",
            "shelf",
            "small furniture panel",
            "wood offcuts",
            "pallet",
        ],
    },
    {
        "group": "Electronics",
        "hint": "Devices, cables, chargers, and small appliances.",
        "items": [
            "charger",
            "cable",
            "phone",
            "laptop",
            "tablet",
            "keyboard",
            "mouse",
            "router",
            "headphones",
            "toaster",
            "electric kettle",
        ],
    },
    {
        "group": "Batteries and accumulators",
        "hint": "Portable energy storage that should never go into mixed waste.",
        "items": [
            "AA battery",
            "AAA battery",
            "coin cell battery",
            "rechargeable battery",
            "phone battery",
            "power bank",
            "laptop battery",
        ],
    },
    {
        "group": "Hazardous household waste",
        "hint": "Chemicals, lamps, oils, and similar risky items.",
        "items": [
            "paint can",
            "solvent bottle",
            "varnish container",
            "aerosol can",
            "fluorescent lamp",
            "mercury thermometer",
            "motor oil bottle",
            "pesticide container",
            "cleaning chemical bottle",
        ],
    },
    {
        "group": "Medicines and health-related waste",
        "hint": "Medicines and sanitary items often need a separate disposal path.",
        "items": [
            "expired tablets",
            "medicine bottle",
            "syrup bottle",
            "ointment tube",
            "diaper",
            "sanitary pad",
            "used mask",
            "wet wipe",
            "bandage",
        ],
    },
    {
        "group": "Construction and repair waste",
        "hint": "Heavy mineral or renovation leftovers.",
        "items": [
            "broken tile",
            "brick rubble",
            "concrete chunks",
            "drywall offcuts",
            "insulation pieces",
            "cement bag",
        ],
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


def preset_group_names() -> list[str]:
    return [group["group"] for group in PRESET_GROUPS]


def preset_items_for_group(group_name: str) -> list[str]:
    for group in PRESET_GROUPS:
        if group["group"] == group_name:
            return group["items"]
    return []


def preset_hint_for_group(group_name: str) -> str | None:
    for group in PRESET_GROUPS:
        if group["group"] == group_name:
            return group["hint"]
    return None


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


def build_preset_catalog_frame() -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "category": group["group"],
                "hint": group["hint"],
                "common_items": ", ".join(group["items"]),
            }
            for group in PRESET_GROUPS
        ]
    )
