from __future__ import annotations

import os

import pandas as pd
from google.cloud import bigquery

from sortsmart_ukraine.config import PROCESSED_DIR


TABLES = {
    "waste_metrics": PROCESSED_DIR / "normalized" / "waste_metrics.parquet",
    "waste_facilities": PROCESSED_DIR / "normalized" / "waste_facilities.parquet",
    "waste_facility_counts": PROCESSED_DIR / "normalized" / "waste_facility_counts.parquet",
    "air_quality_context": PROCESSED_DIR / "normalized" / "air_quality_context.parquet",
    "water_monitoring_observations": PROCESSED_DIR / "normalized" / "water_monitoring_observations.parquet",
    "permits_registry": PROCESSED_DIR / "normalized" / "permits_registry.parquet",
    "radiation_locations": PROCESSED_DIR / "normalized" / "radiation_locations.parquet",
    "radiation_indicators": PROCESSED_DIR / "normalized" / "radiation_indicators.parquet",
    "oblast_sorting_readiness": PROCESSED_DIR / "marts" / "oblast_sorting_readiness.parquet",
    "oblast_sorting_readiness_trend": PROCESSED_DIR / "marts" / "oblast_sorting_readiness_trend.parquet",
    "air_module_overview": PROCESSED_DIR / "marts" / "air_module_overview.parquet",
    "air_monthly_trends": PROCESSED_DIR / "marts" / "air_monthly_trends.parquet",
    "air_city_snapshot": PROCESSED_DIR / "marts" / "air_city_snapshot.parquet",
    "air_permit_crosswalk": PROCESSED_DIR / "marts" / "air_permit_crosswalk.parquet",
    "water_basin_overview": PROCESSED_DIR / "marts" / "water_basin_overview.parquet",
    "permits_city_overview": PROCESSED_DIR / "marts" / "permits_city_overview.parquet",
    "radiation_station_overview": PROCESSED_DIR / "marts" / "radiation_station_overview.parquet",
    "radiation_platform_overview": PROCESSED_DIR / "marts" / "radiation_platform_overview.parquet",
}


def main() -> None:
    project_id = os.environ["GOOGLE_CLOUD_PROJECT"]
    dataset = os.getenv("BQ_DATASET", "sortsmart_raw")
    client = bigquery.Client(project=project_id)

    for table_name, path in TABLES.items():
        if not path.exists():
            print(f"Skipping {table_name}: {path} does not exist yet.")
            continue
        frame = pd.read_parquet(path)
        destination = f"{project_id}.{dataset}.{table_name}"
        job = client.load_table_from_dataframe(frame, destination)
        job.result()
        print(f"Loaded {table_name} -> {destination}")


if __name__ == "__main__":
    main()
