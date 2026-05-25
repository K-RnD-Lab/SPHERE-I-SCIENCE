from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BaselineAssumptions:
    total_reference_population: int = 10_000_000
    uncertainty_low: float = 0.72
    uncertainty_high: float = 1.28


BASELINE = BaselineAssumptions()

AGE_BAND_FACTORS = {
    "18-24": 0.12,
    "25-34": 0.22,
    "35-44": 0.20,
    "45-54": 0.18,
    "55-70": 0.28,
}

REGION_FACTORS = {
    "all_ukraine": 1.0,
    "large_cities": 0.34,
    "kyiv_region": 0.13,
    "western_regions": 0.24,
}

TARGET_POPULATION_FACTORS = {
    "all_adults": 1.0,
    "women": 0.53,
    "men": 0.47,
}

RELATIONSHIP_STATUS_FACTORS = {
    "any": 1.0,
    "not_married": 0.46,
    "single_or_divorced": 0.32,
}

HEIGHT_FACTORS = {
    160: 0.92,
    165: 0.82,
    170: 0.67,
    175: 0.48,
    180: 0.28,
    185: 0.13,
    190: 0.04,
}

INCOME_FACTORS = {
    "any": 1.0,
    "above_median": 0.42,
    "top_25": 0.25,
    "top_10": 0.10,
}

EDUCATION_FACTORS = {
    "any": 1.0,
    "higher_education": 0.38,
    "graduate_plus": 0.16,
}

CHILDREN_STATUS_FACTORS = {
    "any": 1.0,
    "no_children": 0.62,
    "has_children": 0.31,
    "co_parenting_ready": 0.18,
}

FUTURE_CHILDREN_FACTORS = {
    "any": 1.0,
    "wants_children": 0.48,
    "does_not_want_children": 0.22,
    "open_or_undecided": 0.58,
}

MILITARY_STATUS_FACTORS = {
    "any": 1.0,
    "civilian_or_not_serving": 0.91,
    "active_service": 0.07,
    "veteran_or_service_history": 0.15,
}

RELOCATION_FACTORS = {
    "any": 1.0,
    "same_city_only": 0.22,
    "open_to_relocation": 0.36,
    "remote_or_long_distance_ok": 0.44,
}

HOUSING_FACTORS = {
    "any": 1.0,
    "independent_living": 0.48,
    "own_or_stable_housing": 0.29,
}

SMOKING_FACTORS = {
    "any": 1.0,
    "non_smoker": 0.72,
    "ok_with_smoking": 1.0,
}

ALCOHOL_FACTORS = {
    "any": 1.0,
    "rare_or_none": 0.46,
    "moderate_ok": 0.76,
}

LANGUAGE_FACTORS = {
    "any": 1.0,
    "ukrainian_comfortable": 0.82,
    "english_comfortable": 0.38,
    "ukrainian_and_english": 0.31,
}

PETS_FACTORS = {
    "any": 1.0,
    "pet_friendly": 0.54,
    "no_pets_preferred": 0.42,
}

DATA_QUALITY_NOTES = [
    {
        "label": "Population",
        "note": "Replace demo baseline with current age-sex population estimates before publication.",
    },
    {
        "label": "Relationship status",
        "note": "Official marital status does not equal real availability; label as estimated.",
    },
    {
        "label": "Income",
        "note": "Income and salary filters are sensitive to self-employment and informal earnings.",
    },
    {
        "label": "Height",
        "note": "Height currently requires proxy distribution unless a Ukraine-specific source is validated.",
    },
    {
        "label": "Military status",
        "note": "War-related filters are sensitive, time-changing, and should stay scenario-only until sourced.",
    },
    {
        "label": "Children",
        "note": "Children and co-parenting filters are preference-context assumptions, not value judgments.",
    },
    {
        "label": "Independence",
        "note": "Multiplying many filters assumes independence; use results as a stress test, not a factual census.",
    },
]
