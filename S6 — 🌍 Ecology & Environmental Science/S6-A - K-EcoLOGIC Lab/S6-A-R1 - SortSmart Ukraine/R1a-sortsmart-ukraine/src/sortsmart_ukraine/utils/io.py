from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


def ensure_dir(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def write_dataframe(df: pd.DataFrame, base_path: Path) -> None:
    ensure_dir(base_path.parent)
    df.to_parquet(base_path.with_suffix(".parquet"), index=False)
    df.to_csv(base_path.with_suffix(".csv"), index=False)


def write_json(payload: dict, path: Path) -> None:
    ensure_dir(path.parent)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
