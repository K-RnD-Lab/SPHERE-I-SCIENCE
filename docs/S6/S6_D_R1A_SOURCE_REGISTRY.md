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
| S6D-R1A-SRC011 | WHO/UNICEF JMP safely managed drinking water | https://ourworldindata.org/grapher/proportion-using-safely-managed-drinking-water | comparable water-service coverage, 2000-2024 |
| S6D-R1A-SRC012 | WHO/UNICEF JMP safely managed sanitation | https://ourworldindata.org/grapher/share-using-safely-managed-sanitation | comparable sanitation-service coverage, 2000-2024 |
| S6D-R1A-SRC013 | FAO AQUASTAT water stress | https://ourworldindata.org/grapher/freshwater-withdrawals-as-a-share-of-internal-resources | SDG 6.4.2 national water-withdrawal pressure |
| S6D-R1A-SRC014 | UNEP SDG 6.3.2 ambient water quality | https://www.unep.org/topics/fresh-water/water-quality/monitoring-water-quality/sdg-632-indicator | direct ambient-quality framework for next phase |
| S6D-R1A-SRC015 | FAOSTAT fertilizer intensity via OWID | https://ourworldindata.org/grapher/fertilizer-use-per-hectare-of-cropland | agricultural nutrient-input pressure |
| S6D-R1A-SRC016 | UNEP Ukraine conflict preliminary review | https://www.unep.org/resources/report/environmental-impact-conflict-ukraine-preliminary-review | multi-media war-damage pathways and evidence limits |
| S6D-R1A-SRC017 | UNEP Kakhovka rapid environmental assessment | https://www.unep.org/resources/report/rapid-environmental-assessment-kakhovka-dam-breach-ukraine-2023 | hydrological, chemical, waste, and ecological impacts |
| S6D-R1A-SRC018 | IPCC AR6 WGIII Summary for Policymakers | https://www.ipcc.ch/report/ar6/wg3/chapter/summary-for-policymakers/ | emissions abatement, residual emissions, and carbon dioxide removal |
| S6D-R1A-SRC019 | WMO Scientific Assessment of Ozone Depletion 2022 | https://public.wmo.int/sites/default/files/2023-03/Scientific-Assessment-of-Ozone-Depletion-2022-Executive-Summary.pdf | distinguish ozone depletion from CO2 and PM2.5 |
| S6D-R1A-SRC020 | UNCCD soil organic carbon guidance | https://www.unccd.int/resources/reports/realizing-carbon-benefits-sustainable-land-management-practices | SOC monitoring and land-degradation interpretation |

## Data pipeline

Current reproducible script:

```powershell
node tools/build_population_pollution_visuals.mjs
```

Current generated files:

- `docs/S6/data/co2_world_ukraine_milestones.csv`
- `docs/S6/data/pm25_world_ukraine_milestones.csv`
- `docs/S6/data/safe_water_world_ukraine_milestones.csv`
- `docs/S6/data/safe_sanitation_world_ukraine_milestones.csv`
- `docs/S6/data/water_stress_world_ukraine_milestones.csv`
- `docs/S6/data/pesticide_intensity_world_ukraine_milestones.csv`
- `docs/S6/data/fertilizer_intensity_world_ukraine_milestones.csv`
- `docs/S6/figures/co2-world-ukraine-milestones.svg`
- `docs/S6/figures/pm25-world-ukraine-milestones.svg`
- `docs/S6/figures/safe-water-world-ukraine.svg`
- `docs/S6/figures/safe-sanitation-world-ukraine.svg`
- `docs/S6/figures/water-stress-world-ukraine.svg`
- `docs/S6/figures/pesticide-intensity-world-ukraine.svg`
- `docs/S6/figures/fertilizer-intensity-world-ukraine.svg`

## Source gaps

- Ambient water quality still needs SDG 6.3.2 and basin-level observations; WASH coverage is not a substitute.
- Land and soil still need measured SOC, productivity, land-cover, and pollutant-specific hotspot data.
- War-related evidence needs geolocation, verification status, sampling method, and access limitations.
- Ukraine national open-data sources should be added only after confirming stability, definitions, and exportability.
