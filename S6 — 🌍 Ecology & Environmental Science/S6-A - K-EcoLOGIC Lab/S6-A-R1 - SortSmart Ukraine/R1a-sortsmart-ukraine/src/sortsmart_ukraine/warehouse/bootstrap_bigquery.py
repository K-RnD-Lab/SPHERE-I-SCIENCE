from __future__ import annotations

import os

from google.cloud import bigquery


def main() -> None:
    project_id = os.environ["GOOGLE_CLOUD_PROJECT"]
    dataset_name = os.getenv("BQ_DATASET", "sortsmart_raw")
    location = os.getenv("BQ_LOCATION", "EU")

    client = bigquery.Client(project=project_id)
    dataset_id = f"{project_id}.{dataset_name}"
    dataset = bigquery.Dataset(dataset_id)
    dataset.location = location

    created = client.create_dataset(dataset, exists_ok=True)
    print(f"Dataset ready: {created.full_dataset_id}")


if __name__ == "__main__":
    main()
