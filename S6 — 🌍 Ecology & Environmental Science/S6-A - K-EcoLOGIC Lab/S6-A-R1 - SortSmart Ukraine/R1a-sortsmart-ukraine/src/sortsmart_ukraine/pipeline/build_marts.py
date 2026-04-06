from __future__ import annotations

import pandas as pd

from sortsmart_ukraine.config import MATERIAL_FACTORS_PATH, OBLAST_REFERENCE_PATH, PROCESSED_DIR
from sortsmart_ukraine.utils.io import ensure_dir, write_dataframe, write_json


def _safe_div(numerator: pd.Series, denominator: pd.Series) -> pd.Series:
    return numerator.div(denominator.where(denominator.ne(0)))


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
