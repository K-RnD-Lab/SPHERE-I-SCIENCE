# S6-A - K-EcoLOGIC Lab

`S6-A` is the first structured environmental-intelligence lane inside `S6`.

It is designed for research units that combine:

- ecology and environmental systems
- pollution-linked system effects
- circularity and waste logic
- operational decision support for activists, researchers, and public-interest builders

## Focus

K-EcoLOGIC Lab stands for:

- `Eco` as the environmental domain
- `LOGIC` as evidence, modeling, structure, and actionable reasoning

This lane is best treated as a hybrid `S+T` pattern inside `SPHERE I`:

- `S`, because the questions are ecological and environmental
- `T`, because the delivery layer includes data pipelines, scoring logic, dashboards, and research software

## Platform Entry Point

`S6-A - K-EcoLOGIC Lab` is now the canonical public app root for the environmental platform.

Public live app:

- [`https://k-ecologic-lab.streamlit.app/`](https://k-ecologic-lab.streamlit.app/)

Module pages on the public app:

- `Home`
- `SortSmart Ukraine`
- `Packaging & Sorting Guide`
- `Environmental Briefs`
- `Sorting Assistant`
- `Activist Requests`
- `Air & Exposure`
- `Water Watch`
- `Polluters & Permits`
- `Radiation & Risk`

Primary platform files:

- `app.py`
  - root multipage Streamlit entrypoint for the whole lab
- `requirements.txt`
  - deployment dependencies for the lab-level app
- `run_lab.ps1`
  - local launcher for the full platform
- `../../../deploy/k_ecologic_lab.py`
  - repository-root deploy wrapper for the public K-EcoLOGIC Lab app
- `../../../streamlit_app.py`
  - compatibility wrapper that forwards to `deploy/k_ecologic_lab.py`
- `../../../requirements.txt`
  - repository-root dependency file for hosted deployment

This means the public-facing app can now be deployed from the lab root instead of directly from the internal `R1a` module path.

## Documentation Scope

This README is the canonical lab-level page for `S6-A`.

Use the documentation layers like this:

- `S6-A/README.md`
  - lab positioning, public app root, module map, and platform-level architecture
- `S6-A-R*/README.md`
  - research-program purpose, intended users, and why the program belongs inside `S6-A`
- `S6-A-R*/R*a-*/README.md`
  - implementation-module notes only: current scope, entrypoints, and module-specific outputs

This keeps the platform story in one place and prevents module folders from carrying duplicated lab-level narrative.

## Research Programs

- [S6-A-R1 - SortSmart Ukraine](./S6-A-R1%20-%20SortSmart%20Ukraine/)
- [S6-A-R2 - Air & Exposure Intelligence](./S6-A-R2%20-%20Air%20%26%20Exposure%20Intelligence/)
- [S6-A-R3 - Water Watch Ukraine](./S6-A-R3%20-%20Water%20Watch%20Ukraine/)
- [S6-A-R4 - Polluters, Permits, and Environmental Oversight](./S6-A-R4%20-%20Polluters,%20Permits,%20and%20Environmental%20Oversight/)
- [S6-A-R5 - Radiation and Environmental Risk](./S6-A-R5%20-%20Radiation%20and%20Environmental%20Risk/)

## Planned Expansion

Future modules can branch here without breaking the current numbering:

- `S6-A-R6` Land, Soil, and Environmental Damage Signals
