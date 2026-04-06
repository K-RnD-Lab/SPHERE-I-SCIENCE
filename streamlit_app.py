from __future__ import annotations

import runpy
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent
LAB_APP = (
    REPO_ROOT
    / "S6 — 🌍 Ecology & Environmental Science"
    / "S6-A - K-EcoLOGIC Lab"
    / "app.py"
)


if __name__ == "__main__":
    runpy.run_path(str(LAB_APP), run_name="__main__")
