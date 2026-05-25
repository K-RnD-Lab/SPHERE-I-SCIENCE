from __future__ import annotations

from dataclasses import dataclass

from .assumptions import (
    AGE_BAND_FACTORS,
    ALCOHOL_FACTORS,
    BASELINE,
    CHILDREN_STATUS_FACTORS,
    EDUCATION_FACTORS,
    FUTURE_CHILDREN_FACTORS,
    HEIGHT_FACTORS,
    HOUSING_FACTORS,
    INCOME_CURVE_POINTS_UAH,
    LANGUAGE_FACTORS,
    MILITARY_STATUS_FACTORS,
    PETS_FACTORS,
    REGION_FACTORS,
    RELATIONSHIP_STATUS_FACTORS,
    RELOCATION_FACTORS,
    SMOKING_FACTORS,
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
    income_min_uah: int
    education_level: str
    children_status: str
    future_children: str
    military_status: str
    relocation: str
    housing: str
    smoking: str
    alcohol: str
    language: str
    pets: str


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


def income_factor(income_min_uah: int) -> float:
    points = sorted(INCOME_CURVE_POINTS_UAH)
    if income_min_uah <= points[0][0]:
        return points[0][1]
    if income_min_uah >= points[-1][0]:
        return points[-1][1]

    lower = max(point for point in points if point[0] <= income_min_uah)
    upper = min(point for point in points if point[0] >= income_min_uah)
    if lower == upper:
        return lower[1]

    ratio = (income_min_uah - lower[0]) / (upper[0] - lower[0])
    return lower[1] + ratio * (upper[1] - lower[1])


def model_factors(criteria: Criteria) -> list[tuple[str, float]]:
    return [
        ("Target population", TARGET_POPULATION_FACTORS[criteria.target_population]),
        ("Age range", age_factor(criteria.age_min, criteria.age_max)),
        ("Region scope", REGION_FACTORS[criteria.region_scope]),
        ("Relationship status", RELATIONSHIP_STATUS_FACTORS[criteria.relationship_status]),
        ("Minimum height", height_factor(criteria.min_height_cm)),
        ("Minimum income", income_factor(criteria.income_min_uah)),
        ("Education filter", EDUCATION_FACTORS[criteria.education_level]),
        ("Children status", CHILDREN_STATUS_FACTORS[criteria.children_status]),
        ("Future children", FUTURE_CHILDREN_FACTORS[criteria.future_children]),
        ("Military status", MILITARY_STATUS_FACTORS[criteria.military_status]),
        ("Relocation", RELOCATION_FACTORS[criteria.relocation]),
        ("Housing", HOUSING_FACTORS[criteria.housing]),
        ("Smoking", SMOKING_FACTORS[criteria.smoking]),
        ("Alcohol", ALCOHOL_FACTORS[criteria.alcohol]),
        ("Language", LANGUAGE_FACTORS[criteria.language]),
        ("Pets", PETS_FACTORS[criteria.pets]),
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
        {
            "factor": "Baseline",
            "coefficient": 1.0,
            "remaining": remaining,
            "percent_of_baseline": 100.0,
        }
    ]
    for label, coefficient in model_factors(criteria):
        remaining *= coefficient
        rows.append(
            {
                "factor": label,
                "coefficient": round(coefficient, 4),
                "remaining": round(remaining, 2),
                "percent_of_baseline": round((remaining / criteria.base_population) * 100, 6),
            }
        )
    return rows
