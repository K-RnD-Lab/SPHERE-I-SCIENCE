from __future__ import annotations

from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"

AIR_QUALITY_PACKAGE_ID = "0e9e5b53-e94a-467f-a868-c245a9662b38"
AIR_QUALITY_RESOURCE_LIMIT = 6
WATER_MONITORING_PACKAGE_ID = "surface-water-monitoring"
WATER_MONITORING_RESOURCE_LIMIT = 1
PERMITS_PACKAGE_ID = "110ba5fd-42e3-43f8-80f3-e640514c1c76"
PERMITS_RESOURCE_LIMIT = 1

STATIC_SOURCES = {
    "waste_metrics": {
        "url": "https://data.gov.ua/dataset/545fc359-69bf-4bf3-ad73-3a42de669d76/resource/f50ed162-ec41-4fad-9091-ff8f603e1f45/download/186-obroblennia-vidkhodiv-po-regionakh.xlsx",
        "filename": "waste_management_by_region.xlsx",
        "description": "Official waste management metrics by region and year",
    },
    "waste_registry": {
        "url": "https://data.gov.ua/dataset/beefb9e5-0e62-4365-b489-45a4d5807a4d/resource/a6d9eac6-f82e-4a76-a014-ca8b00aa74c4/download/reestr_ouv_01-01-2023.ods",
        "filename": "waste_facilities_registry.ods",
        "description": "Official registry of waste-generation, treatment, and utilization objects",
    },
}

MATERIAL_FACTORS_PATH = ROOT_DIR / "dbt" / "seeds" / "material_factors.csv"
OBLAST_REFERENCE_PATH = ROOT_DIR / "dbt" / "seeds" / "oblast_reference.csv"
LATEST_YEAR_FALLBACK = 2023
