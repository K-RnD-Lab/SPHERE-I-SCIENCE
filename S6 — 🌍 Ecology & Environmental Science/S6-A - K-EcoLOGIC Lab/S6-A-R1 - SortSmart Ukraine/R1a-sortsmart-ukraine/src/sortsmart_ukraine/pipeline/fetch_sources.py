from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

import requests

from sortsmart_ukraine.config import (
    AIR_QUALITY_PACKAGE_ID,
    AIR_QUALITY_RESOURCE_LIMIT,
    PERMITS_PACKAGE_ID,
    PERMITS_RESOURCE_LIMIT,
    RAW_DIR,
    STATIC_SOURCES,
    WATER_MONITORING_PACKAGE_ID,
    WATER_MONITORING_RESOURCE_LIMIT,
)
from sortsmart_ukraine.utils.io import ensure_dir, write_json


def _download(url: str, destination: Path) -> None:
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    destination.write_bytes(response.content)


def fetch_static_sources() -> list[dict]:
    records: list[dict] = []
    for name, config in STATIC_SOURCES.items():
        target_dir = ensure_dir(RAW_DIR / name)
        destination = target_dir / config["filename"]
        _download(config["url"], destination)
        records.append(
            {
                "source_name": name,
                "category": "static",
                "url": config["url"],
                "path": str(destination),
                "description": config["description"],
            }
        )
    return records


def _package_resources(
    package_id: str,
    *,
    limit: int,
    sort_key: tuple[str, ...] = ("last_modified", "created", "position"),
    formats: set[str] | None = None,
) -> list[dict]:
    url = f"https://data.gov.ua/api/3/action/package_show?id={package_id}"
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    payload = response.json()["result"]
    resources = payload["resources"]

    if formats:
        resources = [resource for resource in resources if (resource.get("format") or "").upper() in formats]

    resources = sorted(
        resources,
        key=lambda item: (
            *[(item.get(field) or "") for field in sort_key[:-1]],
            item.get(sort_key[-1]) or 0,
        ),
        reverse=True,
    )
    return resources[:limit]


def _download_package_resources(
    package_id: str,
    *,
    category: str,
    target_folder: str,
    limit: int,
    formats: set[str] | None = None,
) -> list[dict]:
    resources = _package_resources(package_id, limit=limit, formats=formats)
    target_dir = ensure_dir(RAW_DIR / target_folder)
    records: list[dict] = []
    for resource in resources:
        filename = Path(urlparse(resource["url"]).path).name
        destination = target_dir / filename
        _download(resource["url"], destination)
        records.append(
            {
                "source_name": resource["name"],
                "category": category,
                "url": resource["url"],
                "path": str(destination),
                "description": resource.get("description", ""),
                "last_modified": resource.get("last_modified"),
                "created": resource.get("created"),
            }
        )
    return records


def fetch_air_quality_sources(limit: int = AIR_QUALITY_RESOURCE_LIMIT) -> list[dict]:
    return _download_package_resources(
        AIR_QUALITY_PACKAGE_ID,
        category="air_quality",
        target_folder="air_quality",
        limit=limit,
        formats={"XLS", "XLSX"},
    )


def fetch_water_sources(limit: int = WATER_MONITORING_RESOURCE_LIMIT) -> list[dict]:
    return _download_package_resources(
        WATER_MONITORING_PACKAGE_ID,
        category="water_monitoring",
        target_folder="water_monitoring",
        limit=limit,
        formats={"CSV"},
    )


def fetch_permits_sources(limit: int = PERMITS_RESOURCE_LIMIT) -> list[dict]:
    return _download_package_resources(
        PERMITS_PACKAGE_ID,
        category="permits",
        target_folder="permits",
        limit=limit,
        formats={"CSV"},
    )


def main() -> None:
    manifest = {
        "static_sources": fetch_static_sources(),
        "air_quality_sources": fetch_air_quality_sources(),
        "water_sources": fetch_water_sources(),
        "permits_sources": fetch_permits_sources(),
    }
    write_json(manifest, RAW_DIR / "source_manifest.json")
    print("Raw sources downloaded.")


if __name__ == "__main__":
    main()
