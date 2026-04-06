from __future__ import annotations

from pathlib import Path

import pandas as pd

from sortsmart_ukraine.config import PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe
from sortsmart_ukraine.utils.normalization import best_region_column, match_oblast


def load_registry_frame(path: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    workbook = pd.read_excel(path, sheet_name=None, engine="odf")
    selected_name = None
    selected_frame = None
    best_score = -1.0

    for sheet_name, sheet_df in workbook.items():
        if sheet_df.empty:
            continue
        object_columns = [column for column in sheet_df.columns if sheet_df[column].dtype == "object"]
        region_column = best_region_column(sheet_df, object_columns)
        if region_column is None:
            continue
        score = sheet_df[region_column].astype(str).map(match_oblast).notna().mean()
        if score > best_score:
            best_score = score
            selected_name = sheet_name
            selected_frame = sheet_df.copy()

    if selected_frame is None or selected_name is None:
        raise ValueError("Could not infer a worksheet with regional waste-facility data.")

    normalized = selected_frame.copy()
    normalized.columns = [str(column).strip() for column in normalized.columns]
    object_columns = [column for column in normalized.columns if normalized[column].dtype == "object"]
    region_column = best_region_column(normalized, object_columns)
    assert region_column is not None
    normalized["region_raw"] = normalized[region_column]
    normalized["region_key"] = normalized["region_raw"].map(match_oblast)
    normalized = normalized[normalized["region_key"].notna()].copy()
    normalized["source_sheet"] = selected_name

    remaining_objects = [column for column in object_columns if column != region_column]
    name_column = remaining_objects[0] if remaining_objects else region_column
    type_column = remaining_objects[1] if len(remaining_objects) > 1 else name_column

    normalized_table = pd.DataFrame(
        {
            "region_key": normalized["region_key"],
            "region_raw": normalized["region_raw"].astype(str),
            "facility_name": normalized[name_column].astype(str),
            "facility_type": normalized[type_column].astype(str),
            "source_sheet": normalized["source_sheet"].astype(str),
        }
    )
    counts = (
        normalized_table.groupby("region_key", as_index=False)
        .agg(
            facility_count=("facility_name", "size"),
            unique_facility_types=("facility_type", "nunique"),
        )
        .sort_values("facility_count", ascending=False)
    )
    return normalized_table.reset_index(drop=True), counts.reset_index(drop=True)


def main() -> None:
    input_path = RAW_DIR / "waste_registry" / "waste_facilities_registry.ods"
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    facilities, counts = load_registry_frame(input_path)
    write_dataframe(facilities, output_dir / "waste_facilities")
    write_dataframe(counts, output_dir / "waste_facility_counts")
    print("Waste facility registry normalized.")


if __name__ == "__main__":
    main()
