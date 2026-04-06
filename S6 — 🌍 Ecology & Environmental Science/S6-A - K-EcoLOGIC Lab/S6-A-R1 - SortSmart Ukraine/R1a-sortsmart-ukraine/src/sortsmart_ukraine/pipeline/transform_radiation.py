from __future__ import annotations

import pandas as pd

from sortsmart_ukraine.config import OBLAST_REFERENCE_PATH, PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


RADIATION_REGION_MAP = {
    "Вінницька область": "vinnytsia",
    "Волинська область": "volyn",
    "Дніпропетровська область": "dnipropetrovsk",
    "Донецька область": "donetsk",
    "Житомирська область": "zhytomyr",
    "Закарпатська область": "zakarpattia",
    "Запорізька область": "zaporizhzhia",
    "Івано-Франківська область": "ivano_frankivsk",
    "Київ": "kyiv_city",
    "Київська область": "kyiv_oblast",
    "Кіровоградська область": "kirovohrad",
    "Луганська область": "luhansk",
    "Львівська область": "lviv",
    "Миколаївська область": "mykolaiv",
    "Одеська область": "odesa",
    "Полтавська область": "poltava",
    "Рівненська область": "rivne",
    "Сумська область": "sumy",
    "Тернопільська область": "ternopil",
    "Харківська область": "kharkiv",
    "Херсонська область": "kherson",
    "Хмельницька область": "khmelnytskyi",
    "Черкаська область": "cherkasy",
    "Чернівецька область": "chernivtsi",
    "Чернігівська область": "chernihiv",
    "Автономна Республіка Крим": "crimea",
}

FALLBACK_REGION_NAMES = {
    "crimea": {
        "oblast_name_uk": "Avtonomna Respublika Krym",
        "oblast_name_en": "Autonomous Republic of Crimea",
    }
}


def _read_csv(path) -> pd.DataFrame:
    return pd.read_csv(path, encoding="utf-8")


def _load_first_csv(folder_name: str) -> pd.DataFrame | None:
    input_dir = RAW_DIR / folder_name
    for path in sorted(input_dir.glob("*.csv")):
        frame = _read_csv(path)
        frame["source_file"] = path.name
        return frame
    return None


def _bool_series(series: pd.Series) -> pd.Series:
    return (
        series.fillna(False)
        .astype(str)
        .str.strip()
        .str.lower()
        .map({"true": True, "false": False})
        .fillna(False)
        .astype(bool)
    )


def main() -> None:
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    marts_dir = ensure_dir(PROCESSED_DIR / "marts")

    locations = _load_first_csv("radiation_locations")
    indicators = _load_first_csv("radiation_indicators")

    if locations is None:
        print("No radiation locations CSV found. Skipping radiation module.")
        return

    locations = locations.copy()
    locations["region_raw"] = locations["addressAdminUnitL2"].astype("string").str.strip()
    locations["region_key"] = locations["region_raw"].map(RADIATION_REGION_MAP)
    locations["isChornobylExclusionZone"] = _bool_series(locations["isChornobylExclusionZone"])
    locations["isUntrusted"] = _bool_series(locations["isUntrusted"])
    locations["lat"] = pd.to_numeric(locations["lat"], errors="coerce")
    locations["lon"] = pd.to_numeric(locations["lon"], errors="coerce")

    oblasts = pd.read_csv(OBLAST_REFERENCE_PATH)
    normalized_locations = locations.merge(oblasts, on="region_key", how="left")
    for region_key, names in FALLBACK_REGION_NAMES.items():
        mask = normalized_locations["region_key"].eq(region_key)
        for column, value in names.items():
            normalized_locations.loc[mask & normalized_locations[column].isna(), column] = value

    normalized_locations = normalized_locations.rename(
        columns={
            "id": "location_id",
            "platformName": "platform_name",
            "authorityName": "authority_name",
            "measurementType": "measurement_type",
            "addressPostName": "settlement_name",
            "addressAdminUnitL2": "admin_unit_l2",
            "addressThoroughfare": "street_name",
            "addressLocatorDesignator": "street_number",
        }
    )
    normalized_locations["display_region"] = normalized_locations["oblast_name_en"].fillna(normalized_locations["region_raw"])
    write_dataframe(normalized_locations, output_dir / "radiation_locations")

    if indicators is not None:
        indicators = indicators.rename(
            columns={
                "id": "indicator_id",
                "name": "indicator_name",
                "units": "unit_code",
                "unitsName": "unit_name",
            }
        )
        write_dataframe(indicators, output_dir / "radiation_indicators")

    station_overview = (
        normalized_locations.groupby(["region_key", "display_region"], dropna=False)
        .agg(
            station_count=("location_id", "count"),
            settlement_count=("settlement_name", "nunique"),
            platform_count=("platform_name", "nunique"),
            authority_count=("authority_name", "nunique"),
            cez_station_count=("isChornobylExclusionZone", "sum"),
            untrusted_station_count=("isUntrusted", "sum"),
            avg_lat=("lat", "mean"),
            avg_lon=("lon", "mean"),
        )
        .reset_index()
        .sort_values("station_count", ascending=False)
    )
    station_overview["coverage_share_pct"] = (
        station_overview["station_count"].div(max(int(station_overview["station_count"].sum()), 1)).mul(100).round(1)
    )
    write_dataframe(station_overview, marts_dir / "radiation_station_overview")

    platform_overview = (
        normalized_locations.groupby("platform_name", dropna=False)
        .agg(
            station_count=("location_id", "count"),
            oblast_coverage=("display_region", "nunique"),
            cez_station_count=("isChornobylExclusionZone", "sum"),
            untrusted_station_count=("isUntrusted", "sum"),
        )
        .reset_index()
        .sort_values("station_count", ascending=False)
    )
    write_dataframe(platform_overview, marts_dir / "radiation_platform_overview")

    summary = {
        "coverage_note": "This module currently shows monitoring-network coverage, not a real-time emergency radiation warning feed.",
        "station_count": int(len(normalized_locations)),
        "oblast_coverage": int(station_overview["display_region"].nunique(dropna=True)),
        "platform_count": int(platform_overview["platform_name"].nunique(dropna=True)),
        "cez_station_count": int(normalized_locations["isChornobylExclusionZone"].sum()),
        "indicator_count": int(len(indicators)) if indicators is not None else 0,
    }
    write_json(summary, marts_dir / "radiation_module_story.json")
    print("Radiation monitoring module normalized.")
