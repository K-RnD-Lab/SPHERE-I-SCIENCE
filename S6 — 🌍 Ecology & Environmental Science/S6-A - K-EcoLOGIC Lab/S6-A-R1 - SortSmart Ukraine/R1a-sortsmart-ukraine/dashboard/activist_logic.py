from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

import pandas as pd


ROOT_DIR = Path(__file__).resolve().parents[1]
MARTS_DIR = ROOT_DIR / "data" / "processed" / "marts"

SORTSMART_PATH = MARTS_DIR / "oblast_sorting_readiness.parquet"
SORTSMART_TREND_PATH = MARTS_DIR / "oblast_sorting_readiness_trend.parquet"
AIR_CITY_SNAPSHOT_PATH = MARTS_DIR / "air_city_snapshot.parquet"
WATER_OVERVIEW_PATH = MARTS_DIR / "water_basin_overview.parquet"
PERMITS_OVERVIEW_PATH = MARTS_DIR / "permits_city_overview.parquet"

NATIONAL_STORY_PATH = MARTS_DIR / "national_story.json"
AIR_STORY_PATH = MARTS_DIR / "air_module_story.json"
WATER_STORY_PATH = MARTS_DIR / "water_module_story.json"
PERMITS_STORY_PATH = MARTS_DIR / "permits_module_story.json"
RADIATION_STORY_PATH = MARTS_DIR / "radiation_module_story.json"


@lru_cache(maxsize=1)
def _read_parquet(path_str: str) -> pd.DataFrame | None:
    path = Path(path_str)
    if not path.exists():
        return None
    return pd.read_parquet(path)


@lru_cache(maxsize=1)
def _read_json(path_str: str) -> dict | None:
    path = Path(path_str)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def load_sortsmart_mart() -> pd.DataFrame | None:
    return _read_parquet(str(SORTSMART_PATH))


def load_sortsmart_trend() -> pd.DataFrame | None:
    return _read_parquet(str(SORTSMART_TREND_PATH))


def load_air_city_snapshot() -> pd.DataFrame | None:
    return _read_parquet(str(AIR_CITY_SNAPSHOT_PATH))


def load_water_overview() -> pd.DataFrame | None:
    return _read_parquet(str(WATER_OVERVIEW_PATH))


def load_permits_overview() -> pd.DataFrame | None:
    return _read_parquet(str(PERMITS_OVERVIEW_PATH))


def load_national_story() -> dict | None:
    return _read_json(str(NATIONAL_STORY_PATH))


def load_air_story() -> dict | None:
    return _read_json(str(AIR_STORY_PATH))


def load_water_story() -> dict | None:
    return _read_json(str(WATER_STORY_PATH))


def load_permits_story() -> dict | None:
    return _read_json(str(PERMITS_STORY_PATH))


def load_radiation_story() -> dict | None:
    return _read_json(str(RADIATION_STORY_PATH))


def available_regions(sortsmart: pd.DataFrame | None) -> list[str]:
    regions = ["All Ukraine"]
    if sortsmart is not None and "oblast_name_en" in sortsmart:
        regions.extend(sorted(sortsmart["oblast_name_en"].dropna().unique().tolist()))
    return regions


def format_number(value: float) -> str:
    return f"{value:,.1f}"


def build_sortsmart_brief(
    region: str,
    audience: str,
    mart: pd.DataFrame | None,
    trend: pd.DataFrame | None,
    story: dict | None,
) -> str:
    if mart is None or trend is None:
        return "SortSmart data is not available yet."

    if region == "All Ukraine":
        latest_year = int(mart["year"].max())
        avg_score = mart["sorting_readiness_score"].mean()
        gap = mart["recovery_gap_thsd_t"].sum()
        climate = mart["climate_impact_potential_t_co2e"].sum()
        top_region = mart.sort_values("sorting_readiness_score", ascending=False).iloc[0]["oblast_name_en"]
        biggest_gap = mart.sort_values("recovery_gap_thsd_t", ascending=False).iloc[0]["oblast_name_en"]
        intro = {
            "Public summary": "This national snapshot shows that Ukraine's waste story is still dominated by landfill pressure and uneven regional readiness.",
            "Activist brief": "The national waste picture suggests a clear advocacy case: the recovery gap remains large, while public infrastructure and fresh open data still lag behind the scale of the problem.",
            "Municipal note": "At national scale, the platform suggests that recovery performance and infrastructure distribution remain highly uneven across oblasts.",
            "Donor / partner pitch": "The data highlights a tractable intervention space: large recovery gaps, visible regional inequality, and an immediate need for clearer public sorting systems.",
        }[audience]
        return (
            f"{intro}\n\n"
            f"In the latest nationwide year in view ({latest_year}), the average sorting readiness score is {avg_score:.1f}. "
            f"The modeled recovery gap is {format_number(gap)} thousand tonnes, with a modeled climate benefit of about {climate:,.0f} tCO2e if recoverable material were redirected away from landfill.\n\n"
            f"The strongest current readiness signal appears in {top_region}, while the largest recovery gap appears in {biggest_gap}. "
            "This means the platform can already help distinguish between places that are relatively prepared and places where the material loss problem is still structurally large.\n\n"
            "Important limitation: the strongest open nationwide waste file is still oblast-level and outcome-oriented, so this brief should be read as a transparent decision-support layer rather than a complete municipal operations picture."
        )

    regional = mart[mart["oblast_name_en"] == region]
    if regional.empty:
        return f"No SortSmart row is available for {region}."
    row = regional.iloc[0]
    return (
        f"{region} currently appears as a meaningful regional case for waste-system analysis. "
        f"Its sorting readiness score is {row['sorting_readiness_score']:.1f}, with recovery at {row['recovery']:.1f} thousand tonnes and landfill disposal at {row['disposal_on_landfills']:.1f} thousand tonnes.\n\n"
        f"The modeled recovery gap is {format_number(row['recovery_gap_thsd_t'])} thousand tonnes, and the platform currently flags `{row['priority_material']}` as the most strategically important material stream. "
        "For an activist or municipal audience, this means the region can already be discussed in terms of both visible waste pressure and concrete material priorities.\n\n"
        "Important limitation: this is still not city-level system coverage, so any operational follow-up should push for fresher local datasets, municipal collection maps, and material-specific container inventories."
    )


def build_air_brief(audience: str, air_story: dict | None, air_snapshot: pd.DataFrame | None) -> str:
    if air_snapshot is None or air_snapshot.empty:
        return "Air module data is not available yet."
    latest = air_snapshot.sort_values("max_q_max_gdk_ratio", ascending=False).iloc[0]
    city_count = int(air_snapshot["city"].nunique())
    month_label = air_snapshot["observation_month_label"].dropna().iloc[0]
    return (
        "The current air module provides a compact exposure-oriented picture rather than a full real-time air monitoring network. "
        f"It currently covers {city_count} cities in the latest parsed month ({month_label}).\n\n"
        f"In the latest snapshot, `{latest['city']}` shows the strongest exceedance-style signal, with a peak qmax/GDK ratio of {latest['max_q_max_gdk_ratio']:.2f}. "
        f"The current top pollutant signal there is `{latest['top_pollutant_name_uk']}`.\n\n"
        f"For {audience.lower()}, the most useful framing is that this module helps surface where public air-quality attention may be most needed, while still being honest that the current open-data footprint is limited and not a substitute for a full operational monitoring service."
    )


def build_water_brief(audience: str, water_story: dict | None, water_overview: pd.DataFrame | None) -> str:
    if water_overview is None or water_overview.empty:
        return "Water module data is not available yet."
    latest_sample = str(water_overview["latest_sample_date"].dropna().max())
    largest = water_overview.sort_values("observation_count", ascending=False).iloc[0]
    basin_count = int(water_overview["river_basin"].nunique())
    return (
        f"The water module is currently a basin-level monitoring layer with {basin_count} river-basin groups in view and latest samples up to {latest_sample}. "
        f"The basin with the heaviest observation footprint right now is `{largest['river_basin']}`.\n\n"
        f"For {audience.lower()}, this is useful because it shows where a more structured water evidence base already exists, but it also highlights that the module is still better at broad monitoring context than at fine-grained local intervention design."
    )


def build_permits_brief(audience: str, permits_story: dict | None, permits_overview: pd.DataFrame | None) -> str:
    if permits_overview is None or permits_overview.empty:
        return "Permits module data is not available yet."
    settlements = int(permits_overview["settlement"].nunique())
    permits = int(permits_overview["permit_count"].sum())
    top = permits_overview.sort_values("permit_count", ascending=False).iloc[0]["settlement"]
    return (
        "The permits module is currently a regional pilot rather than a full nationwide oversight system. "
        f"It covers {settlements} settlements and {permits} permit records in the current open source used by the platform.\n\n"
        f"The strongest visible settlement-level concentration right now is `{top}`. "
        f"For {audience.lower()}, the main message is that this module already helps identify oversight hotspots, but it also makes the national data-gap problem impossible to ignore."
    )


def build_radiation_brief(audience: str, radiation_story: dict | None) -> str:
    if not radiation_story:
        return "Radiation module data is not available yet."
    return (
        "The radiation module currently functions as a network-coverage and public-context layer. "
        f"It tracks {radiation_story['station_count']} stations across {radiation_story['oblast_coverage']} oblast-level units and {radiation_story['platform_count']} platform networks.\n\n"
        f"For {audience.lower()}, the important nuance is that this is helpful for visibility and coverage mapping, but it should not be presented as a sole emergency-warning source."
    )


def build_module_brief(
    module: str,
    audience: str,
    region: str,
    sortsmart: pd.DataFrame | None,
    trend: pd.DataFrame | None,
    air_snapshot: pd.DataFrame | None,
    water_overview: pd.DataFrame | None,
    permits_overview: pd.DataFrame | None,
    national_story: dict | None,
    air_story: dict | None,
    water_story: dict | None,
    permits_story: dict | None,
    radiation_story: dict | None,
) -> str:
    if module == "SortSmart Ukraine":
        return build_sortsmart_brief(region, audience, sortsmart, trend, national_story)
    if module == "Air & Exposure":
        return build_air_brief(audience, air_story, air_snapshot)
    if module == "Water Watch":
        return build_water_brief(audience, water_story, water_overview)
    if module == "Polluters & Permits":
        return build_permits_brief(audience, permits_story, permits_overview)
    return build_radiation_brief(audience, radiation_story)


def build_data_gaps(theme: str, region: str) -> list[str]:
    gaps = {
        "SortSmart Ukraine": [
            "The strongest nationwide waste dataset is still mostly oblast-level rather than city-level.",
            "The latest visible nationwide waste year is 2023, so newer years are still missing from the public evidence layer.",
            "The platform still lacks municipal container coverage and collection-point density by city.",
        ],
        "Air & Exposure": [
            "The current air layer covers only the monthly files currently wired into the platform, not a full real-time national network.",
            "Many settlements are still outside the visible air snapshot.",
            "City-level air data still needs better linkage to local infrastructure and local interventions.",
        ],
        "Water Watch": [
            "The current module is basin-oriented and not yet a strong city-level water-operations layer.",
            "More public-quality indicators and more stable nationwide publication would make this much stronger.",
        ],
        "Polluters & Permits": [
            "The permits module is still a regional pilot based on the latest accessible open CSV resource.",
            "A stronger nationwide permits feed is needed for fair cross-regional oversight.",
        ],
        "Radiation & Risk": [
            "The module is best for network coverage and public context, not as a validated emergency feed.",
            "It still needs clearer integration with incident overlays and institutional alert channels.",
        ],
    }
    region_note = f"Region in focus: {region}." if region != "All Ukraine" else "Focus is national."
    return [region_note] + gaps.get(theme, [])


def build_draft_request(theme: str, region: str, target: str) -> str:
    subject_map = {
        "Municipality or city council": "request for local environmental and waste-management data publication",
        "Ministry or national authority": "request for updated nationwide environmental open data",
        "NGO or donor partner": "proposal for environmental data collaboration and evidence support",
        "Regional administration": "request for regional environmental monitoring and waste-management disclosure",
    }
    subject = subject_map[target]
    region_line = f"with a current focus on {region}" if region != "All Ukraine" else "with a current national focus"
    return (
        f"Draft request to {target}\n\n"
        f"Subject: {subject}\n\n"
        "Hello,\n\n"
        f"I am reaching out regarding the K-EcoLOGIC Lab environmental monitoring platform, {region_line}. "
        f"Our current analysis of `{theme}` shows that publicly accessible data is useful but still incomplete for practical civic and policy work.\n\n"
        "We would like to request clearer and more regular publication of the datasets needed to understand:\n"
        "- current environmental pressure and its geographic distribution\n"
        "- material or monitoring gaps that limit public accountability\n"
        "- infrastructure or regulatory information needed for evidence-based action\n\n"
        "In particular, we are interested in fresher machine-readable data, clearer metadata, and more stable publication across reporting periods. "
        "This would directly support public communication, civic monitoring, and more informed environmental interventions.\n\n"
        "If useful, we can also share the current platform view and the specific data gaps we have identified.\n\n"
        "Kind regards,\n"
        "Oksana Kolisnyk\n"
        "K-EcoLOGIC Lab\n"
    )
