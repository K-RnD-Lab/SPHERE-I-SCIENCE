from __future__ import annotations

from pathlib import Path

import pandas as pd

from sortsmart_ukraine.config import PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


NUMERIC_COLUMNS = [
    "Azot",
    "BSK5",
    "Zavisli",
    "Kisen",
    "Sulfat",
    "Hlorid",
    "Amoniy",
    "Nitrat",
    "Nitrit",
    "Fosfat",
    "SPAR",
    "Permanganat",
    "HSK",
    "Fitoplan",
    "Atrazin",
    "Simazin",
]


def _read_csv(path: Path) -> pd.DataFrame:
    return pd.read_csv(path, sep=";")


def main() -> None:
    input_dir = RAW_DIR / "water_monitoring"
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    marts_dir = ensure_dir(PROCESSED_DIR / "marts")

    frames: list[pd.DataFrame] = []
    for path in sorted(input_dir.glob("*.csv")):
        frame = _read_csv(path)
        frame["source_file"] = path.name
        frames.append(frame)

    if not frames:
        print("No water-monitoring CSV files found. Skipping water module.")
        return

    combined = pd.concat(frames, ignore_index=True)
    combined["Controle_Date"] = pd.to_datetime(combined["Controle_Date"], errors="coerce")
    for column in NUMERIC_COLUMNS:
        if column in combined.columns:
            combined[column] = pd.to_numeric(combined[column], errors="coerce")

    write_dataframe(combined, output_dir / "water_monitoring_observations")

    basin_summary = (
        combined.groupby("Riverbas_Name", dropna=False)
        .agg(
            observation_count=("Post_ID", "count"),
            unique_posts=("Post_Code", "nunique"),
            avg_dissolved_oxygen=("Kisen", "mean"),
            avg_bod5=("BSK5", "mean"),
            avg_nitrate=("Nitrat", "mean"),
            avg_phosphate=("Fosfat", "mean"),
            latest_sample_date=("Controle_Date", "max"),
        )
        .reset_index()
        .rename(columns={"Riverbas_Name": "river_basin"})
        .sort_values("observation_count", ascending=False)
    )

    basin_summary["latest_sample_date"] = basin_summary["latest_sample_date"].dt.strftime("%Y-%m-%d")
    write_dataframe(basin_summary, marts_dir / "water_basin_overview")

    summary = {
        "basin_count": int(basin_summary["river_basin"].nunique()),
        "observation_count": int(len(combined)),
        "latest_sample_date": basin_summary["latest_sample_date"].dropna().max() if not basin_summary.empty else None,
        "top_basins": basin_summary.head(5)[["river_basin", "observation_count"]].to_dict(orient="records"),
    }
    write_json(summary, marts_dir / "water_module_story.json")
    print("Water monitoring module normalized.")


if __name__ == "__main__":
    main()
