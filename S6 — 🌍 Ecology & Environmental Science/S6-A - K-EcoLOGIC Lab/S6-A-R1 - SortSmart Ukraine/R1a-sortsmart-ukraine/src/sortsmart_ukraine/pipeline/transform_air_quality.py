from __future__ import annotations

from pathlib import Path

import pandas as pd

from sortsmart_ukraine.config import PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


AIR_KEYWORDS = ("aqi", "dust", "so2", "no2", "co", "o3", "pm", "benz", "formaldehyde")
CITY_KEYWORDS = ("city", "town", "settlement", "міст", "населен")


def _read_workbook(path: Path) -> dict[str, pd.DataFrame]:
    engine = "openpyxl" if path.suffix.lower() == ".xlsx" else None
    return pd.read_excel(path, sheet_name=None, engine=engine)


def _normalize_sheet(path: Path) -> pd.DataFrame | None:
    workbook = _read_workbook(path)
    for sheet_name, df in workbook.items():
        if df.empty:
            continue
        candidate_columns = [str(column).strip() for column in df.columns]
        normalized = [column.lower() for column in candidate_columns]
        has_city = any(any(keyword in column for keyword in CITY_KEYWORDS) for column in normalized)
        has_air = any(any(keyword in column for keyword in AIR_KEYWORDS) for column in normalized)
        if not (has_city or has_air):
            continue
        local = df.copy()
        local.columns = candidate_columns
        local["source_file"] = path.name
        local["source_sheet"] = sheet_name
        return local
    return None


def main() -> None:
    input_dir = RAW_DIR / "air_quality"
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    marts_dir = ensure_dir(PROCESSED_DIR / "marts")
    frames: list[pd.DataFrame] = []
    for path in sorted(input_dir.glob("*.*")):
        if path.suffix.lower() not in {".xls", ".xlsx"}:
            continue
        frame = _normalize_sheet(path)
        if frame is not None:
            frames.append(frame)

    if not frames:
        print("No parseable air-quality sheets found. Skipping climate-context table.")
        return

    combined = pd.concat(frames, ignore_index=True)
    for column in combined.columns:
        if pd.api.types.is_object_dtype(combined[column]):
            combined[column] = combined[column].astype("string")
    write_dataframe(combined, output_dir / "air_quality_context")

    summary = (
        combined.groupby(["source_file", "source_sheet"], dropna=False)
        .size()
        .reset_index(name="row_count")
        .sort_values("row_count", ascending=False)
    )
    summary["column_count"] = len(combined.columns)
    write_dataframe(summary, marts_dir / "air_module_overview")

    write_json(
        {
            "resource_count": int(summary["source_file"].nunique()),
            "sheet_count": int(len(summary)),
            "row_count": int(len(combined)),
        },
        marts_dir / "air_module_story.json",
    )
    print("Air quality context normalized.")


if __name__ == "__main__":
    main()
