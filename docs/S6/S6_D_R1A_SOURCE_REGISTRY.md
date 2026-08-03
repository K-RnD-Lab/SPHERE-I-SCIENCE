# S6-D-R1a Source Registry

## Scope

Source registry for the global and Ukraine pollution visual study.

## Primary data sources

| ID | Source | URL | Use |
|---|---|---|---|
| S6D-R1A-SRC001 | Our World in Data CO2 and Greenhouse Gas Emissions dataset | https://github.com/owid/co2-data | CO2 dataset provenance and update path |
| S6D-R1A-SRC002 | OWID annual CO2 emissions grapher | https://ourworldindata.org/grapher/annual-co2-emissions-per-country | annual territorial CO2 visualization data |
| S6D-R1A-SRC003 | OWID CO2 dataset sources and methods | https://ourworldindata.org/co2-dataset-sources | CO2 methodology and Global Carbon Project source context |
| S6D-R1A-SRC004 | World Bank WDI PM2.5 indicator | https://data.worldbank.org/indicator/EN.ATM.PM25.MC.M3 | PM2.5 mean annual exposure |
| S6D-R1A-SRC005 | OWID PM2.5 grapher | https://ourworldindata.org/grapher/average-exposure-pm25-pollution | PM2.5 processed chart data |
| S6D-R1A-SRC006 | WHO Ukraine environmental health scorecard 2025 | https://cdn.who.int/media/docs/default-source/country-profiles/environmental-health/environmental-health-ukr-2025.pdf | Ukraine air, water, sanitation, exposure context |
| S6D-R1A-SRC007 | FAOSTAT | https://www.fao.org/faostat/en/ | pesticides, fertilizers, agriculture and land-use pressure indicators |
| S6D-R1A-SRC008 | FAOSTAT pesticides use via OWID | https://ourworldindata.org/grapher/pesticide-use-per-hectare-of-cropland | pesticide intensity candidate indicator |
| S6D-R1A-SRC009 | UNCCD SDG 15.3.1 metadata | https://worldbank.github.io/sdg-metadata/metadata/en/15-3-1/ | land degradation operational definition |
| S6D-R1A-SRC010 | Ukraine LDN target setting report | https://www.unccd.int/sites/default/files/ldn_targets/2019-06/Ukraine%20LDN%20TSP%20Country%20Report.pdf | Ukraine soil organic carbon and land degradation targets |

## Data pipeline

Current reproducible script:

```powershell
node tools/build_population_pollution_visuals.mjs
```

Current generated files:

- `docs/S6/data/co2_world_ukraine_milestones.csv`
- `docs/S6/data/pm25_world_ukraine_milestones.csv`
- `docs/S6/figures/co2-world-ukraine-milestones.svg`
- `docs/S6/figures/pm25-world-ukraine-milestones.svg`

## Source gaps

- Water indicators need a dedicated source pass before visualization.
- Land and soil need separate treatment for agricultural pressure, land degradation, soil organic carbon, and war-related environmental damage.
- Ukraine national open-data sources should be added only after confirming stability and exportability.
