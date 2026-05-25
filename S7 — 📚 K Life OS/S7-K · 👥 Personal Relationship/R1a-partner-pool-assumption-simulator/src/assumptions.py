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
]
