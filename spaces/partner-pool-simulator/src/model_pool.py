from __future__ import annotations

from dataclasses import dataclass

from .assumptions import (
    AGE_BAND_FACTORS,
    BASELINE,
    EDUCATION_FACTORS,
    HEIGHT_FACTORS,
    INCOME_FACTORS,
    REGION_FACTORS,
    RELATIONSHIP_STATUS_FACTORS,
    TARGET_POPULATION_FACTORS,
)


@dataclass(frozen=True)
class Criteria:
    base_population: int
    target_population: str
    age_min: int
    age_max: int
    region_scope: str
    relationship_status: str
    min_height_cm: int
    income_level: str
    education_level: str


@dataclass(frozen=True)
class PoolEstimate:
    conservative: float
    central: float
    optimistic: float


def age_factor(age_min: int, age_max: int) -> float:
    bands = {
        "18-24": (18, 24),
        "25-34": (25, 34),
        "35-44": (35, 44),
        "45-54": (45, 54),
        "55-70": (55, 70),
    }
    selected = 0.0
    for label, (band_min, band_max) in bands.items():
        overlap_min = max(age_min, band_min)
        overlap_max = min(age_max, band_max)
        if overlap_min <= overlap_max:
            band_width = band_max - band_min + 1
            overlap_width = overlap_max - overlap_min + 1
            selected += AGE_BAND_FACTORS[label] * (overlap_width / band_width)
    return max(0.01, min(selected, 1.0))


def height_factor(min_height_cm: int) -> float:
    thresholds = sorted(HEIGHT_FACTORS)
    if min_height_cm <= thresholds[0]:
        return HEIGHT_FACTORS[thresholds[0]]
    if min_height_cm >= thresholds[-1]:
        return HEIGHT_FACTORS[thresholds[-1]]

    lower = max(threshold for threshold in thresholds if threshold <= min_height_cm)
    upper = min(threshold for threshold in thresholds if threshold >= min_height_cm)
    if lower == upper:
        return HEIGHT_FACTORS[lower]

    ratio = (min_height_cm - lower) / (upper - lower)
    return HEIGHT_FACTORS[lower] + ratio * (HEIGHT_FACTORS[upper] - HEIGHT_FACTORS[lower])


def model_factors(criteria: Criteria) -> list[tuple[str, float]]:
    return [
        ("Target population", TARGET_POPULATION_FACTORS[criteria.target_population]),
        ("Age range", age_factor(criteria.age_min, criteria.age_max)),
        ("Region scope", REGION_FACTORS[criteria.region_scope]),
        ("Relationship status", RELATIONSHIP_STATUS_FACTORS[criteria.relationship_status]),
        ("Minimum height", height_factor(criteria.min_height_cm)),
        ("Income threshold", INCOME_FACTORS[criteria.income_level]),
        ("Education filter", EDUCATION_FACTORS[criteria.education_level]),
    ]


def central_estimate(criteria: Criteria) -> float:
    value = float(criteria.base_population)
    for _, factor in model_factors(criteria):
        value *= factor
    return value


def estimate_pool(criteria: Criteria) -> PoolEstimate:
    central = central_estimate(criteria)
    return PoolEstimate(
        conservative=central * BASELINE.uncertainty_low,
        central=central,
        optimistic=central * BASELINE.uncertainty_high,
    )


def sensitivity_table(criteria: Criteria) -> list[dict[str, float | str]]:
    remaining = float(criteria.base_population)
    rows: list[dict[str, float | str]] = [
        {"factor": "Baseline", "coefficient": 1.0, "remaining": remaining}
    ]
    for label, coefficient in model_factors(criteria):
        remaining *= coefficient
        rows.append(
            {
                "factor": label,
                "coefficient": round(coefficient, 4),
                "remaining": round(remaining, 2),
            }
        )
    return rows
