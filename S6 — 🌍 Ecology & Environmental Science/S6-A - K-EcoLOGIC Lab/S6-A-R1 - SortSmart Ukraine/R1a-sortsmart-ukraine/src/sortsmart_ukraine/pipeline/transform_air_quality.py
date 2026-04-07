from __future__ import annotations

import re
from pathlib import Path

import pandas as pd

from sortsmart_ukraine.config import PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


MONTHS_UK = {
    "січні": 1,
    "лютому": 2,
    "березні": 3,
    "квітні": 4,
    "травні": 5,
    "червні": 6,
    "липні": 7,
    "серпні": 8,
    "вересні": 9,
    "жовтні": 10,
    "листопаді": 11,
    "грудні": 12,
}

MONTHS_EN = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}

POLLUTANT_MAP = {
    "завислі речовини": "suspended_particles",
    "діоксид сірки": "sulfur_dioxide",
    "дiоксид сiрки": "sulfur_dioxide",
    "оксид вуглецю": "carbon_monoxide",
    "діоксид азоту": "nitrogen_dioxide",
    "дiоксид азоту": "nitrogen_dioxide",
    "оксид азоту": "nitrogen_oxide",
    "фенол": "phenol",
    "формальдегід": "formaldehyde",
    "формальдегид": "formaldehyde",
    "аміак": "ammonia",
    "амiак": "ammonia",
    "сажа": "soot",
    "бенз(а)пірен": "benzopyrene",
    "бенз(а)пирен": "benzopyrene",
    "кадмій": "cadmium",
    "кадмий": "cadmium",
    "свинець": "lead",
    "миш'як": "arsenic",
    "мишяк": "arsenic",
    "хром": "chromium",
    "цинк": "zinc",
    "марганець": "manganese",
    "марганец": "manganese",
    "мідь": "copper",
    "медь": "copper",
}


def _normalize_text(value: object) -> str:
    if pd.isna(value):
        return ""
    text = str(value).strip().lower().replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text)
    return text


def _pollutant_key(name: object) -> str:
    normalized = _normalize_text(name)
    for candidate, key in POLLUTANT_MAP.items():
        if candidate in normalized:
            return key
    fallback = re.sub(r"[^a-z0-9а-яіїєґ]+", "_", normalized, flags=re.IGNORECASE).strip("_")
    return fallback or "unknown_pollutant"


def _parse_month(title: str, filename: str) -> tuple[pd.Timestamp | pd.NaT, str | None]:
    title_normalized = _normalize_text(title)
    filename_normalized = _normalize_text(filename)

    year_match = re.search(r"(20\d{2})", title_normalized) or re.search(r"(20\d{2})", filename_normalized)
    year = int(year_match.group(1)) if year_match else None

    month_num = None
    for month_name, number in MONTHS_UK.items():
        if month_name in title_normalized:
            month_num = number
            break

    if month_num is None:
        for month_name, number in MONTHS_EN.items():
            if month_name in filename_normalized:
                month_num = number
                break

    if year is None or month_num is None:
        return pd.NaT, None

    timestamp = pd.Timestamp(year=year, month=month_num, day=1)
    return timestamp, timestamp.strftime("%Y-%m")


def _find_header_row(frame: pd.DataFrame) -> tuple[int | None, str]:
    header_idx = None
    title = ""
    for idx, row in frame.head(12).iterrows():
        first = row.iloc[0] if len(row) > 0 else None
        second = row.iloc[1] if len(row) > 1 else None
        first_normalized = _normalize_text(first)
        second_normalized = _normalize_text(second)
        if "вміст забруднювальних речовин" in first_normalized:
            title = str(first).strip()
        if "місто" == first_normalized and "назва домішки" in second_normalized:
            header_idx = idx
            break
    return header_idx, title


def _extract_sheet(path: Path, sheet_name: str) -> pd.DataFrame | None:
    frame = pd.read_excel(path, sheet_name=sheet_name, header=None)
    header_idx, title = _find_header_row(frame)
    if header_idx is None:
        return None

    local = frame.iloc[header_idx + 1 :, :6].copy()
    local.columns = [
        "city",
        "pollutant_name_uk",
        "q_avg_mg_m3",
        "q_avg_gdk_ratio",
        "q_max_mg_m3",
        "q_max_gdk_ratio",
    ]

    local = local[local["city"].notna() & local["pollutant_name_uk"].notna()].copy()
    local["city"] = local["city"].astype("string").str.strip()
    local["pollutant_name_uk"] = local["pollutant_name_uk"].astype("string").str.strip()
    local = local[
        ~local["city"].str.lower().str.contains("всього|приміт|дані|місто", na=False)
        & ~local["pollutant_name_uk"].str.lower().str.contains("назва домішки", na=False)
    ].copy()

    for column in ["q_avg_mg_m3", "q_avg_gdk_ratio", "q_max_mg_m3", "q_max_gdk_ratio"]:
        local[column] = pd.to_numeric(local[column], errors="coerce")

    observation_month, observation_month_label = _parse_month(title, path.name)
    local["observation_month"] = observation_month
    local["observation_month_label"] = observation_month_label
    local["observation_year"] = observation_month.year if pd.notna(observation_month) else pd.NA
    local["observation_month_num"] = observation_month.month if pd.notna(observation_month) else pd.NA
    local["pollutant_key"] = local["pollutant_name_uk"].map(_pollutant_key)
    local["source_file"] = path.name
    local["source_sheet"] = sheet_name
    local["source_title"] = title
    return local.reset_index(drop=True)


def main() -> None:
    input_dir = RAW_DIR / "air_quality"
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    marts_dir = ensure_dir(PROCESSED_DIR / "marts")

    frames: list[pd.DataFrame] = []
    for path in sorted(input_dir.glob("*.*")):
        if path.suffix.lower() not in {".xls", ".xlsx"}:
            continue
        workbook = pd.ExcelFile(path)
        for sheet_name in workbook.sheet_names:
            parsed = _extract_sheet(path, sheet_name)
            if parsed is not None and not parsed.empty:
                frames.append(parsed)

    if not frames:
        print("No parseable air-quality sheets found. Skipping climate-context table.")
        return

    combined = (
        pd.concat(frames, ignore_index=True)
        .sort_values(["observation_month", "city", "pollutant_name_uk"], na_position="last")
        .reset_index(drop=True)
    )
    write_dataframe(combined, output_dir / "air_quality_context")

    summary = (
        combined.groupby(["observation_month_label", "source_file", "source_sheet"], dropna=False)
        .agg(
            row_count=("city", "count"),
            city_count=("city", "nunique"),
            pollutant_count=("pollutant_name_uk", "nunique"),
            avg_q_avg_gdk_ratio=("q_avg_gdk_ratio", "mean"),
            max_q_max_gdk_ratio=("q_max_gdk_ratio", "max"),
        )
        .reset_index()
        .sort_values(["observation_month_label", "row_count"], ascending=[True, False])
    )
    write_dataframe(summary, marts_dir / "air_module_overview")

    write_json(
        {
            "resource_count": int(combined["source_file"].nunique()),
            "sheet_count": int(combined[["source_file", "source_sheet"]].drop_duplicates().shape[0]),
            "row_count": int(len(combined)),
            "month_count": int(combined["observation_month_label"].dropna().nunique()),
            "city_count": int(combined["city"].dropna().nunique()),
        },
        marts_dir / "air_module_story.json",
    )
    print("Air quality context normalized.")


if __name__ == "__main__":
    main()
