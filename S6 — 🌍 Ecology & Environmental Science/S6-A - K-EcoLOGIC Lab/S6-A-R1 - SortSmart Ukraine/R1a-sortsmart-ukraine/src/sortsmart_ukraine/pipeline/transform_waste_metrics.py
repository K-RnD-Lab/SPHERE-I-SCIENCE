from __future__ import annotations

from pathlib import Path

import pandas as pd

from sortsmart_ukraine.config import PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe
from sortsmart_ukraine.utils.normalization import match_oblast


SHEET_NAME = "Waste management by region"
VALUE_COLUMNS = {
    "recovery waste": "recovery",
    "incineration waste": "incinerated",
    "disposal waste on landfills": "disposal_on_landfills",
}


def _flatten_columns(columns: pd.MultiIndex) -> list[str]:
    flattened: list[str] = []
    for left, right in columns:
        joined = " ".join(str(part).strip() for part in (left, right) if str(part).strip() and str(part).strip().lower() != "nan")
        lowered = joined.lower()
        if lowered == "code code":
            flattened.append("region_code")
        elif lowered == "attributes attributes":
            flattened.append("region_label")
        elif lowered == "period period":
            flattened.append("year")
        else:
            if lowered.startswith("waste1 "):
                lowered = lowered.replace("waste1 ", "", 1)
            elif lowered.startswith("waste2 "):
                lowered = lowered.replace("waste2 ", "", 1)
            elif lowered.startswith("waste3 "):
                lowered = lowered.replace("waste3 ", "", 1)
            flattened.append(lowered)
    return flattened


def load_waste_metrics_frame(path: Path) -> pd.DataFrame:
    df = pd.read_excel(path, sheet_name=SHEET_NAME, header=[0, 1])
    df.columns = _flatten_columns(df.columns)

    expected = {"region_code", "region_label", "year", *VALUE_COLUMNS.keys()}
    missing = expected.difference(df.columns)
    if missing:
        raise ValueError(f"Missing expected columns in regional waste workbook: {sorted(missing)}")

    frame = df[list(expected)].copy()
    frame["year"] = pd.to_numeric(frame["year"], errors="coerce").astype("Int64")
    for column in VALUE_COLUMNS:
        frame[column] = pd.to_numeric(frame[column], errors="coerce")

    frame["region_key"] = frame["region_label"].map(match_oblast)
    frame["is_national_total"] = frame["region_label"].astype(str).str.strip().str.lower().eq("ukraine")

    regional = frame[frame["region_key"].notna()].copy()
    regional["generated_proxy"] = regional[list(VALUE_COLUMNS.keys())].fillna(0).sum(axis=1)

    melted = regional.melt(
        id_vars=["region_code", "region_label", "region_key", "year"],
        value_vars=[*VALUE_COLUMNS.keys(), "generated_proxy"],
        var_name="source_metric",
        value_name="metric_value_total_thsd_t",
    )
    melted["metric_name_en"] = melted["source_metric"].map({**VALUE_COLUMNS, "generated_proxy": "generated"})
    melted["metric_code"] = melted["metric_name_en"]
    melted["metric_value_hazardous_thsd_t"] = pd.NA
    melted["metric_source_note"] = "generated is proxied as recovery + incinerated + disposal because the current official regional file exposes waste-management outcomes."
    melted = melted.dropna(subset=["metric_name_en", "year", "metric_value_total_thsd_t"])
    return melted.sort_values(["year", "region_label", "metric_name_en"]).reset_index(drop=True)


def main() -> None:
    input_path = RAW_DIR / "waste_metrics" / "waste_management_by_region.xlsx"
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    df = load_waste_metrics_frame(input_path)
    write_dataframe(df, output_dir / "waste_metrics")
    print("Waste metrics normalized.")


if __name__ == "__main__":
    main()
