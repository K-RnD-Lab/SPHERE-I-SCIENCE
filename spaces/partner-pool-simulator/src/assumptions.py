from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class BaselineAssumptions:
    total_reference_population: int = 10_000_000
    uncertainty_low: float = 0.72
    uncertainty_high: float = 1.28


BASELINE = BaselineAssumptions()

BASELINE_REFERENCE_OPTIONS = {
    "demo_reference_pool": {
        "label": "Demo working pool",
        "value": 10_000_000,
        "note": "Synthetic starting universe for scenario testing; not the full Ukraine population.",
    },
    "sssu_jan_2022_total": {
        "label": "SSSU Jan 2022 total population",
        "value": 41_167_335,
        "note": "Official pre-full-scale-invasion total population estimate cited by ACAPS.",
    },
    "custom": {
        "label": "Custom baseline",
        "value": 10_000_000,
        "note": "Use when modeling a narrower adult, regional, platform, or pre-filtered pool.",
    },
}

SALARY_ANCHORS_UAH = {
    "official_pfu_2025_average": 20_654,
    "kse_workua_jan_2026_median": 27_500,
    "workua_current_average": 28_600,
}

INCOME_THRESHOLD_LABELS = {
    "any": "Any income",
    "above_median": "Above median (about 28,600 UAH/month)",
    "top_25": "Top 25 scenario (about 45,000 UAH/month)",
    "top_10": "Top 10 scenario (about 70,000 UAH/month)",
}

SOURCE_LINKS = [
    {
        "label": "Work.ua salary statistics",
        "url": "https://www.work.ua/en/salary-all/",
        "note": "Current salary benchmark from job postings; Work.ua states that the median is calculated from recent vacancies.",
    },
    {
        "label": "KSE Ukraine Monthly Economic Update, February 2026",
        "url": "https://institute.kse.ua/wp-content/uploads/2026/02/ukraine_monthly_economic_update_eng_february_2026.pdf",
        "note": "Cites Work.ua January 2026 offered median salary of UAH 27,500.",
    },
    {
        "label": "Pension Fund of Ukraine average wage indicator, 2025",
        "url": "https://www.pfu.gov.ua/2170600-pokaznyk-serednoyi-zarobitnoyi-platy-za-2025-rik/",
        "note": "Official average wage indicator used for pension calculations; annual 2025 value is UAH 20,653.55.",
    },
    {
        "label": "ACAPS Ukraine population data sources report",
        "url": "https://www.acaps.org/fileadmin/Data_Product/Main_media/20230818_ACAPS_Thematic_report_Ukraine_estimates_and_sources_of_population_data.pdf",
        "note": "Explains baseline population datasets and cites SSSU January 2022 total population estimate.",
    },
    {
        "label": "State Statistics Service of Ukraine 2022 overview",
        "url": "https://www.ukrstat.gov.ua/operativ/infografika/2022/o_soc_ek_Ukr/01_2022_e.pdf",
        "note": "Official population-statistics context and methodology notes.",
    },
]

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
