from __future__ import annotations

import re

import pandas as pd

from sortsmart_ukraine.config import MATERIAL_FACTORS_PATH, OBLAST_REFERENCE_PATH, PROCESSED_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


def _safe_div(numerator: pd.Series, denominator: pd.Series) -> pd.Series:
    return numerator.div(denominator.where(denominator.ne(0)))


def _normalize_name(value: object) -> str:
    if pd.isna(value):
        return ""
    normalized = str(value).strip().lower().replace("\xa0", " ")
    normalized = normalized.replace("’", "'").replace("`", "'")
    normalized = re.sub(r"[\"'.,()]", "", normalized)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized


def _risk_band(value: float) -> str:
    if pd.isna(value):
        return "No signal"
    if value >= 1.0:
        return "High exceedance pressure"
    if value >= 0.5:
        return "Elevated pressure"
    return "Lower pressure"


def _scoring_constants(material_factors: pd.DataFrame) -> tuple[float, float, str]:
    recyclable_share = (material_factors["share_of_msw"] * material_factors["recyclable_share"]).sum()
    weighted_avoided_factor = (
        (material_factors["share_of_msw"] * material_factors["recyclable_share"] * material_factors["co2e_avoided_t_per_t_recycled"]).sum()
        / max(recyclable_share, 1e-9)
    )
    top_material = material_factors.assign(
        contribution=material_factors["share_of_msw"] * material_factors["recyclable_share"] * material_factors["co2e_avoided_t_per_t_recycled"]
    ).sort_values("contribution", ascending=False).iloc[0]["material"]
    return recyclable_share, weighted_avoided_factor, top_material


def _build_scored_mart(
    regional_waste: pd.DataFrame,
    facilities: pd.DataFrame,
    oblasts: pd.DataFrame,
    material_factors: pd.DataFrame,
) -> pd.DataFrame:
    wide = (
        regional_waste.pivot_table(
            index=["year", "region_key", "region_label"],
            columns="metric_name_en",
            values="metric_value_total_thsd_t",
            aggfunc="sum",
        )
        .reset_index()
        .rename_axis(None, axis=1)
    )
    mart = oblasts.merge(wide, on="region_key", how="left").merge(facilities, on="region_key", how="left")
    mart["facility_count"] = mart["facility_count"].fillna(0)
    mart["unique_facility_types"] = mart["unique_facility_types"].fillna(0)

    recyclable_share, weighted_avoided_factor, top_material = _scoring_constants(material_factors)

    for column in ["generated", "recovery", "incinerated", "disposal_on_landfills", "accumulated_on_landfills"]:
        if column not in mart.columns:
            mart[column] = 0.0
        else:
            mart[column] = mart[column].fillna(0)

    mart["recovery_rate"] = _safe_div(mart["recovery"], mart["generated"]).fillna(0)
    mart["landfill_rate"] = _safe_div(mart["disposal_on_landfills"], mart["generated"]).fillna(0)
    mart["modeled_recyclable_potential_thsd_t"] = mart["generated"] * recyclable_share
    mart["recovery_gap_thsd_t"] = (mart["modeled_recyclable_potential_thsd_t"] - mart["recovery"]).clip(lower=0)
    mart["climate_impact_potential_t_co2e"] = mart["recovery_gap_thsd_t"] * 1000 * weighted_avoided_factor

    facility_density = mart["facility_count"].div(max(float(mart["facility_count"].max()), 1.0))
    recovery_component = (mart["recovery_rate"] / 0.35).clip(lower=0, upper=1)
    landfill_component = (1 - mart["landfill_rate"].clip(lower=0, upper=1))
    mart["sorting_readiness_score"] = (
        100 * (0.45 * recovery_component + 0.30 * facility_density + 0.25 * landfill_component)
    ).round(1)
    mart["priority_material"] = top_material
    mart["generated_note"] = "Generated is currently proxied from recovery + incineration + landfill disposal because the official regional file exposes waste-management outcomes."
    return mart


def _build_air_supporting_marts(normalized_dir, marts_dir, sortsmart_mart: pd.DataFrame) -> None:
    air_path = normalized_dir / "air_quality_context.parquet"
    if not air_path.exists():
        return

    air = pd.read_parquet(air_path)
    required_columns = {
        "city",
        "pollutant_name_uk",
        "pollutant_key",
        "q_avg_gdk_ratio",
        "q_max_gdk_ratio",
        "q_avg_mg_m3",
        "observation_month",
        "observation_month_label",
    }
    if not required_columns.issubset(air.columns):
        return

    air["observation_month"] = pd.to_datetime(air["observation_month"], errors="coerce")
    air["city_normalized"] = air["city"].map(_normalize_name)

    trends = (
        air.groupby(["observation_month", "observation_month_label", "pollutant_key", "pollutant_name_uk"], dropna=False)
        .agg(
            sample_count=("city", "count"),
            city_count=("city", "nunique"),
            avg_q_avg_mg_m3=("q_avg_mg_m3", "mean"),
            avg_q_avg_gdk_ratio=("q_avg_gdk_ratio", "mean"),
            max_q_max_gdk_ratio=("q_max_gdk_ratio", "max"),
        )
        .reset_index()
        .sort_values(["observation_month", "avg_q_avg_gdk_ratio"], ascending=[True, False])
    )
    write_dataframe(trends, marts_dir / "air_monthly_trends")

    latest_month = air["observation_month"].dropna().max()
    latest = air[air["observation_month"] == latest_month].copy() if pd.notna(latest_month) else air.copy()
    if latest.empty:
        latest = air.copy()

    pollutant_rollup = (
        latest.groupby(["city", "city_normalized", "pollutant_name_uk", "pollutant_key"], dropna=False)
        .agg(
            avg_q_avg_gdk_ratio=("q_avg_gdk_ratio", "mean"),
            max_q_max_gdk_ratio=("q_max_gdk_ratio", "max"),
            avg_q_avg_mg_m3=("q_avg_mg_m3", "mean"),
            sample_count=("pollutant_name_uk", "count"),
        )
        .reset_index()
        .sort_values(["city", "avg_q_avg_gdk_ratio", "max_q_max_gdk_ratio"], ascending=[True, False, False])
    )
    top_pollutant = pollutant_rollup.drop_duplicates("city").rename(
        columns={
            "pollutant_name_uk": "top_pollutant_name_uk",
            "pollutant_key": "top_pollutant_key",
            "avg_q_avg_gdk_ratio": "top_pollutant_avg_q_avg_gdk_ratio",
            "max_q_max_gdk_ratio": "top_pollutant_max_q_max_gdk_ratio",
        }
    )

    city_snapshot = (
        latest.groupby(["city", "city_normalized"], dropna=False)
        .agg(
            pollutant_count=("pollutant_name_uk", "nunique"),
            pollutant_rows=("pollutant_name_uk", "count"),
            avg_q_avg_mg_m3=("q_avg_mg_m3", "mean"),
            avg_q_avg_gdk_ratio=("q_avg_gdk_ratio", "mean"),
            max_q_max_gdk_ratio=("q_max_gdk_ratio", "max"),
        )
        .reset_index()
        .merge(
            top_pollutant[
                [
                    "city",
                    "top_pollutant_name_uk",
                    "top_pollutant_key",
                    "top_pollutant_avg_q_avg_gdk_ratio",
                    "top_pollutant_max_q_max_gdk_ratio",
                ]
            ],
            on="city",
            how="left",
        )
    )
    city_snapshot["observation_month"] = latest_month
    city_snapshot["observation_month_label"] = latest_month.strftime("%Y-%m") if pd.notna(latest_month) else None
    city_snapshot["risk_band"] = city_snapshot["max_q_max_gdk_ratio"].map(_risk_band)

    permits_path = normalized_dir / "permits_registry.parquet"
    if permits_path.exists():
        permits = pd.read_parquet(permits_path)
        permits["city_normalized"] = permits["addressPostName"].map(_normalize_name)
        permit_crosswalk = (
            permits.groupby("city_normalized", dropna=False)
            .agg(
                permit_count=("permissionNum", "count"),
                permit_admin_unit_count=("addressAdminUnitL2", "nunique"),
                permit_admin_units=("addressAdminUnitL2", lambda values: ", ".join(sorted({str(v) for v in values if pd.notna(v)}))),
                latest_permit_issued=("permissionIssued", "max"),
            )
            .reset_index()
        )
        permit_crosswalk["latest_permit_issued"] = pd.to_datetime(
            permit_crosswalk["latest_permit_issued"], errors="coerce"
        ).dt.strftime("%Y-%m-%d")
        city_snapshot = city_snapshot.merge(permit_crosswalk, on="city_normalized", how="left")

    if "permit_count" not in city_snapshot.columns:
        city_snapshot["permit_count"] = 0
    city_snapshot["permit_count"] = city_snapshot["permit_count"].fillna(0).astype(int)

    if "permit_admin_unit_count" not in city_snapshot.columns:
        city_snapshot["permit_admin_unit_count"] = 0
    city_snapshot["permit_admin_unit_count"] = city_snapshot["permit_admin_unit_count"].fillna(0).astype(int)

    if "permit_admin_units" not in city_snapshot.columns:
        city_snapshot["permit_admin_units"] = ""
    city_snapshot["permit_admin_units"] = city_snapshot["permit_admin_units"].fillna("")

    if "latest_permit_issued" not in city_snapshot.columns:
        city_snapshot["latest_permit_issued"] = pd.NA
    city_snapshot["has_permits_context"] = city_snapshot["permit_count"].gt(0)
    city_snapshot["sortsmart_regions_covered"] = int(sortsmart_mart["oblast_name_en"].nunique(dropna=True))

    write_dataframe(
        city_snapshot.sort_values(["max_q_max_gdk_ratio", "avg_q_avg_gdk_ratio"], ascending=[False, False]),
        marts_dir / "air_city_snapshot",
    )

    crosswalk = city_snapshot[
        [
            "city",
            "observation_month_label",
            "pollutant_count",
            "avg_q_avg_gdk_ratio",
            "max_q_max_gdk_ratio",
            "top_pollutant_name_uk",
            "permit_count",
            "permit_admin_unit_count",
            "permit_admin_units",
            "latest_permit_issued",
            "has_permits_context",
            "risk_band",
        ]
    ].copy()
    write_dataframe(crosswalk, marts_dir / "air_permit_crosswalk")


def main() -> None:
    normalized_dir = PROCESSED_DIR / "normalized"
    marts_dir = ensure_dir(PROCESSED_DIR / "marts")

    waste = pd.read_parquet(normalized_dir / "waste_metrics.parquet")
    facilities = pd.read_parquet(normalized_dir / "waste_facility_counts.parquet")
    oblasts = pd.read_csv(OBLAST_REFERENCE_PATH)
    material_factors = pd.read_csv(MATERIAL_FACTORS_PATH)

    regional_waste = waste[waste["region_key"].notna()].copy()
    latest_year = int(regional_waste["year"].max())

    full_mart = _build_scored_mart(regional_waste, facilities, oblasts, material_factors)
    full_mart = full_mart.sort_values(["year", "sorting_readiness_score"], ascending=[True, False]).reset_index(drop=True)
    write_dataframe(full_mart, marts_dir / "oblast_sorting_readiness_trend")

    mart = full_mart[full_mart["year"] == latest_year].copy()

    ordered = [
        "year",
        "region_key",
        "oblast_name_uk",
        "oblast_name_en",
        "generated",
        "recovery",
        "incinerated",
        "disposal_on_landfills",
        "accumulated_on_landfills",
        "facility_count",
        "unique_facility_types",
        "recovery_rate",
        "landfill_rate",
        "modeled_recyclable_potential_thsd_t",
        "recovery_gap_thsd_t",
        "climate_impact_potential_t_co2e",
        "sorting_readiness_score",
        "priority_material",
        "generated_note",
    ]
    mart = mart[ordered].sort_values("sorting_readiness_score", ascending=False).reset_index(drop=True)
    write_dataframe(mart, marts_dir / "oblast_sorting_readiness")

    _build_air_supporting_marts(normalized_dir, marts_dir, mart)

    summary = {
        "latest_year": latest_year,
        "top_readiness_regions": mart.head(5)[["oblast_name_en", "sorting_readiness_score"]].to_dict(orient="records"),
        "largest_recovery_gap_regions": mart.sort_values("recovery_gap_thsd_t", ascending=False).head(5)[
            ["oblast_name_en", "recovery_gap_thsd_t"]
        ].to_dict(orient="records"),
        "national_totals": {
            "generated_thsd_t": round(float(mart["generated"].sum()), 2),
            "recovery_thsd_t": round(float(mart["recovery"].sum()), 2),
            "recovery_gap_thsd_t": round(float(mart["recovery_gap_thsd_t"].sum()), 2),
            "climate_impact_potential_t_co2e": round(float(mart["climate_impact_potential_t_co2e"].sum()), 2),
        },
    }
    write_json(summary, marts_dir / "national_story.json")
    print("Analytical marts built.")


if __name__ == "__main__":
    main()
