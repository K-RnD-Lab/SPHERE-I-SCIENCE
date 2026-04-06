# Deploy Entrypoints

This folder holds ASCII-safe public entrypoints for hosted apps.

Why this exists:

- research modules live in `S1` through `S7`
- hosted app providers can be fragile with long Unicode-heavy paths
- `deploy/` keeps public app launchers predictable and reusable

Current entrypoints:

- `k_ecologic_lab.py`
  - K-EcoLOGIC Lab multipage environmental platform
- live app
  - `https://k-ecologic-lab.streamlit.app/`

Recommended pattern for future public apps:

- keep research code in its science or product home
- add one thin wrapper in `deploy/`
- point the hosting platform at the wrapper instead of the deep research path
