# S7-M-R2a Source Registry

## Scope

Source registry for demographic turnover and rebirth-pattern analysis.

## Primary data sources

| ID | Source | URL | Use |
|---|---|---|---|
| S7M-R2A-SRC001 | OWID Population grapher | https://ourworldindata.org/grapher/population | long-run population baseline |
| S7M-R2A-SRC002 | OWID annual number of births by world region | https://ourworldindata.org/grapher/annual-number-of-births-by-world-region | births from UN WPP via OWID |
| S7M-R2A-SRC003 | OWID annual number of deaths by world region | https://ourworldindata.org/grapher/annual-number-of-deaths-by-world-region | deaths from UN WPP via OWID |
| S7M-R2A-SRC004 | UN World Population Prospects 2024 | https://population.un.org/wpp/ | demographic estimates and methodology source |
| S7M-R2A-SRC005 | UN WPP 2024 dataset page | https://www.un.org/development/desa/pd/content/world-population-prospects-2024-dataset | dataset access and citation context |
| S7M-R2A-SRC006 | Human Mortality Database | https://www.mortality.org/ | long-run national vital-statistics source for later expansion |
| S7M-R2A-SRC007 | OWID long-run birth rate | https://ourworldindata.org/grapher/long-run-birth-rate | historical birth-rate extension candidate |
| S7M-R2A-SRC008 | OWID crude death rate HMD | https://ourworldindata.org/grapher/crude-death-rate-hmd | historical death-rate extension candidate |
| S7M-R2A-SRC009 | UN WPP 2024 Methodology Report | https://population.un.org/wpp/Publications/Files/WPP2024_Methodology-Report_Final.pdf | estimation methods, uncertainty, fertility and mortality modelling |
| S7M-R2A-SRC010 | OWID fertility rate, UN WPP 2024 | https://ourworldindata.org/grapher/children-born-per-woman | demographic-transition context |
| S7M-R2A-SRC011 | OWID life expectancy, UN WPP 2024 | https://ourworldindata.org/grapher/life-expectancy-unwpp | mortality-transition context |
| S7M-R2A-SRC012 | Academic studies on claimed past-life memories: a scoping review | https://doi.org/10.1016/j.explore.2021.05.006 | map the design and limitations of reincarnation-claim literature |

## Data pipeline

Current reproducible script:

```powershell
node tools/build_population_pollution_visuals.mjs
```

Current generated files:

- `docs/S7/data/world_population_milestones.csv`
- `docs/S7/data/world_births_deaths_annual.csv`
- `docs/S7/data/world_births_deaths_milestones.csv`
- `docs/S7/data/world_demographic_transition_milestones.csv`
- `docs/S7/data/birth_death_lag_correlations.csv`
- `docs/S7/figures/world-population-long-run.svg`
- `docs/S7/figures/world-births-deaths-1950-2023.svg`
- `docs/S7/figures/world-birth-death-ratio-1950-2023.svg`
- `docs/S7/figures/world-net-natural-increase-1950-2023.svg`
- `docs/S7/figures/world-fertility-1950-2023.svg`
- `docs/S7/figures/world-life-expectancy-1950-2023.svg`
- `docs/S7/figures/birth-death-lag-correlations.svg`

## Interpretation limits

- Long-run population before modern statistics is reconstructed.
- Annual global births/deaths are strongest from UN WPP modern series.
- Aggregate demography cannot test identity-level reincarnation.
- The measurable substitute is demographic turnover and population renewal.
- Lag scans are exploratory and require correction for autocorrelation, multiple testing, and age structure before confirmatory use.
- Retrospective case reports cannot exclude information leakage, cultural selection, or publication bias without prospective controls.
