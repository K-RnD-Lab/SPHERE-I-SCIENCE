from __future__ import annotations

from pathlib import Path

import pandas as pd

from sortsmart_ukraine.config import PROCESSED_DIR, RAW_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


def _read_csv(path: Path) -> pd.DataFrame:
    return pd.read_csv(path, encoding="utf-8")


def main() -> None:
    input_dir = RAW_DIR / "permits"
    output_dir = ensure_dir(PROCESSED_DIR / "normalized")
    marts_dir = ensure_dir(PROCESSED_DIR / "marts")

    frames: list[pd.DataFrame] = []
    for path in sorted(input_dir.glob("*.csv")):
        frame = _read_csv(path)
        frame["source_file"] = path.name
        frames.append(frame)

    if not frames:
        print("No permits CSV files found. Skipping permits module.")
        return

    combined = pd.concat(frames, ignore_index=True)
    combined["permissionIssued"] = pd.to_datetime(combined["permissionIssued"], errors="coerce")
    permission_valid_text = combined["permissionValid"].astype(str).str.strip()
    combined["validity_type"] = permission_valid_text.str.lower().map(
        lambda value: "unlimited" if "необмеж" in value else "dated"
    )
    combined.loc[combined["permissionValid"].isna(), "validity_type"] = "unknown"
    combined["permissionValidDate"] = pd.to_datetime(
        permission_valid_text.where(combined["validity_type"].eq("dated")),
        errors="coerce",
    )
    combined["is_expired"] = combined["permissionValidDate"].lt(pd.Timestamp.today().normalize()).fillna(False)

    write_dataframe(combined, output_dir / "permits_registry")

    city_summary = (
        combined.groupby(["addressAdminUnitL2", "addressPostName"], dropna=False)
        .agg(
            permit_count=("permissionNum", "count"),
            unlimited_count=("validity_type", lambda values: int((pd.Series(values) == "unlimited").sum())),
            expired_count=("is_expired", "sum"),
            first_issued=("permissionIssued", "min"),
            latest_issued=("permissionIssued", "max"),
        )
        .reset_index()
        .rename(
            columns={
                "addressAdminUnitL2": "admin_unit",
                "addressPostName": "settlement",
            }
        )
        .sort_values("permit_count", ascending=False)
    )

    city_summary["first_issued"] = city_summary["first_issued"].dt.strftime("%Y-%m-%d")
    city_summary["latest_issued"] = city_summary["latest_issued"].dt.strftime("%Y-%m-%d")
    write_dataframe(city_summary, marts_dir / "permits_city_overview")

    summary = {
        "coverage_note": "Current permits module is based on the latest open CSV resource currently published for Vinnytsia oblast.",
        "permit_count": int(len(combined)),
        "settlement_count": int(city_summary["settlement"].nunique(dropna=True)),
        "top_settlements": city_summary.head(5)[["settlement", "permit_count"]].to_dict(orient="records"),
    }
    write_json(summary, marts_dir / "permits_module_story.json")
    print("Permits module normalized.")


if __name__ == "__main__":
    main()
