from __future__ import annotations

from sortsmart_ukraine.pipeline import (
    build_marts,
    fetch_sources,
    transform_air_quality,
    transform_facilities_registry,
    transform_permits,
    transform_waste_metrics,
    transform_water_monitoring,
)


def main() -> None:
    fetch_sources.main()
    transform_waste_metrics.main()
    transform_facilities_registry.main()
    transform_air_quality.main()
    transform_water_monitoring.main()
    transform_permits.main()
    build_marts.main()
    print("Local SortSmart Ukraine pipeline finished.")


if __name__ == "__main__":
    main()
