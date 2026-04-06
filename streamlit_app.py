from __future__ import annotations

import runpy
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent
DEPLOY_APP = REPO_ROOT / "deploy" / "k_ecologic_lab.py"


if __name__ == "__main__":
    runpy.run_path(str(DEPLOY_APP), run_name="__main__")
