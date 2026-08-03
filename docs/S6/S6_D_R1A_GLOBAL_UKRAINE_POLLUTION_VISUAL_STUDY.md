# S6-D-R1a Global And Ukraine Pollution Systems Study

## Research identity

- Sphere: `S6 Ecology & Environmental Science`
- Lane: `S6-D Pollution, Stress & Response Networks`
- Combination: `S+T`
- Geography: world and Ukraine
- Status: active preliminary research with reproducible visual pipeline
- Domains: air, climate, water, land/soil, war-related environmental damage, remediation

## Abstract

This study treats pollution as a system rather than a single number. It separates pressure, environmental state, exposure, harm, and response indicators across air, water, and land. The first reproducible release shows long-run CO2 emissions, PM2.5 exposure, safely managed water and sanitation, national water stress, pesticide intensity, and fertilizer intensity for the world and Ukraine where comparable data exist.

The early findings are mixed. Ukraine's reported territorial CO2 emissions and PM2.5 exposure declined substantially, but this cannot be read as complete environmental recovery: economic restructuring, deindustrialization, population change, territorial coverage, and war all affect the series. PM2.5 exposure in 2022 remained about 2.8 times the WHO annual guideline. National water-stress averages are low, yet they hide basin-level scarcity, seasonal variability, infrastructure damage, contamination, and the Kakhovka disaster. Agricultural input intensity is below the global average in recent years, but input mass does not measure chemical toxicity, persistence, local accumulation, unexploded ordnance, mine flooding, or industrial hotspots.

## Research questions

- `RQ1` How have major pollution pressures changed globally and in Ukraine?
- `RQ2` Which observed declines represent environmental improvement, and which may reflect economic or wartime contraction?
- `RQ3` How should air, water, and soil indicators be combined without treating unlike measures as one score?
- `RQ4` What does renewable energy prevent, and what accumulated pollution does it not remove?
- `RQ5` Which chemical, biochemical, ecological, and engineering interventions match each pollutant class?
- `RQ6` Which Ukraine-specific gaps require national monitoring, field sampling, or satellite evidence?

## System model

```text
DRIVER -> PRESSURE -> ENVIRONMENTAL STATE -> EXPOSURE -> EFFECT -> RESPONSE

energy      CO2             climate forcing       heat / hazards      health/ecosystem loss     decarbonization + CDR
industry    PM2.5/toxics     air concentration     inhalation          disease/ecotoxicity        controls + cleanup
agriculture nutrients       water/soil loading    food/water contact  eutrophication/soil loss    precision use + buffers
war         debris/metals   hotspot contamination multi-route         acute/chronic damage       survey + removal + remediation
```

No indicator should be moved to another column. For example, safely managed drinking-water coverage is a service/exposure-control measure; it is not direct evidence that rivers or groundwater have good ambient quality.

## Indicator architecture

| Domain | Pressure | State/exposure | Damage | Response |
|---|---|---|---|---|
| climate-air | fossil CO2, combustion | atmospheric GHG, PM2.5 | warming, morbidity, ecosystem stress | clean energy, efficiency, emission controls, CDR |
| water | withdrawal, wastewater, nutrients, spills | stress, chemical/biological quality | unsafe water, eutrophication, habitat loss | treatment, source control, basin restoration |
| land/soil | pesticides, nutrients, mining, debris | residues, SOC, productivity, cover | toxicity, erosion, fertility loss | removal, immobilization, bioremediation, soil rebuilding |
| war | explosions, fires, damaged facilities, mines | local mixed contamination | multi-media and long-lived hazards | verification, clearance, containment, remediation |

## Data and methods

### Comparable time series

- CO2: territorial annual emissions, OWID/Global Carbon Project;
- PM2.5: population-weighted mean annual exposure, World Bank series via OWID;
- water and sanitation: WHO/UNICEF JMP service-use estimates;
- water stress: withdrawals relative to available renewable resources, FAO AQUASTAT;
- pesticides and fertilizers: use per hectare of cropland, FAOSTAT via OWID.

### Analytical rules

1. Values absent from a source remain missing; they are never replaced with zero.
2. Ukraine and world are compared only when definitions and units match.
3. National averages are not used to deny local hotspots.
4. Lower emissions caused by production collapse are not labelled successful decarbonization without decomposition.
5. Input quantity is not treated as measured contamination.
6. War-related claims require incident verification, remote sensing, field sampling, or authoritative assessment.

## Preliminary findings

### Air and climate

#### Global CO2

World territorial CO2 emissions rose from about 5.9 billion tonnes in 1950 to 38.1 billion tonnes in 2023. Renewable electricity can reduce future fossil emissions when it displaces emitting generation, but it does not remove the historical stock of CO2 already accumulated in the atmosphere.

The correct intervention hierarchy is:

```text
avoid demand and damage -> reduce emissions -> replace high-carbon systems -> remove residual CO2 -> restore ecosystems
```

IPCC assessments distinguish emissions abatement from carbon dioxide removal. CDR is needed for residual hard-to-abate emissions in net-zero pathways, but it has limits, costs, energy demand, land competition, storage-duration differences, and monitoring requirements.

#### Ukraine CO2

Reported Ukrainian territorial CO2 emissions fell from about 706.5 million tonnes in 1990 to 139.3 million tonnes in 2023. The magnitude is real in the dataset, but the causal interpretation is not simply "green success". Candidate contributors include post-Soviet industrial restructuring, energy-efficiency change, population and production decline, economic crises, territorial coverage, and wartime destruction or displacement of activity.

A later decomposition should separate:

- activity effect: less production or energy demand;
- structural effect: different sector mix;
- intensity effect: less energy per unit of output;
- fuel effect: lower carbon per unit of energy;
- boundary effect: changes in territory, reporting, and embodied imports.

#### PM2.5

Ukraine's modelled mean annual PM2.5 exposure declined from about `36.1 micrograms/m3` in 1990 to `14.0 micrograms/m3` in 2022. The 2022 value is still approximately `2.8x` the WHO annual guideline of `5 micrograms/m3`. A falling national mean does not identify individual-city exposure, combustion episodes, indoor air, wildfire smoke, or wartime plumes.

### Water

#### Safely managed services

In 2024, the series estimates:

- safely managed drinking water: world `73.7%`, Ukraine `87.9%`;
- safely managed sanitation: world `58.5%`, Ukraine `92.4%`.

This implies that roughly 12% of Ukraine's population was outside the safely managed drinking-water category, consistent with the WHO 2025 country scorecard. These values describe service use and management. They do not directly measure river chemistry, groundwater contamination, ecological status, or wartime service interruptions below national resolution.

#### Water stress

Ukraine's national water-stress indicator declined from about `22.0%` in 2002 to `6.3%` in 2022, compared with a world aggregate near `18.0%` in 2022. This does not mean Ukraine has no water-security problem.

Why the national ratio can mislead:

- withdrawals and resources vary strongly by basin and season;
- intermittent reporting can smooth drought years;
- damaged treatment and pumping infrastructure affect access without raising national withdrawal ratios;
- contamination can make water unusable even when physical volume is available;
- the Kakhovka dam breach changed hydrology, sediment movement, habitats, irrigation, and contamination pathways;
- occupied or inaccessible territories create observation gaps.

#### Ambient water quality gap

The next evidence layer must use SDG 6.3.2, national laboratory monitoring, basin data, and remote sensing. UNEP defines the indicator as the share of rivers, lakes, and groundwater bodies with good ambient water quality. Until those data are integrated, this study must not call service coverage a water-quality trend.

### Land and soil

#### Agricultural input intensity

In 2023:

- pesticide use intensity: world about `2.40 kg/ha`, Ukraine about `0.57 kg/ha`;
- fertilizer use intensity: world about `116.4 kg/ha`, Ukraine about `41.5 kg/ha`.

Ukraine's values are lower than the global average in these datasets, but that does not establish clean soil. A mass-per-hectare series cannot show:

- toxicity differences between active substances;
- persistence, metabolites, or banned legacy chemicals;
- uneven local application and storage incidents;
- nutrient runoff or groundwater transport;
- heavy metals, petroleum products, mining waste, or industrial residues;
- explosives, propellants, debris, and conflict-related contamination.

#### Soil organic carbon and degradation

Ukraine's UNCCD land-degradation target report used average agricultural-soil humus/SOC content of `3.14%` in 2010 as a national baseline, with lower values in Polissya and higher values in Steppe zones. Soil organic carbon is relevant because it integrates soil structure, nutrient cycling, water infiltration, erosion vulnerability, productivity, and climate functions. It is not interchangeable with contaminant concentration.

Land-degradation monitoring should therefore keep at least three independent dimensions:

- land-cover change;
- land productivity;
- soil organic carbon stocks.

Contamination requires a fourth layer based on pollutant-specific sampling.

### War-related environmental damage

UNEP characterizes Ukraine's situation as a compounded, multidimensional environmental crisis and explicitly warns that current assessments are incomplete. Potential pathways include:

- fires and combustion products entering air;
- damaged industrial or agrochemical storage releasing hazardous substances;
- mine flooding and industrial drainage reaching surface and groundwater;
- debris containing asbestos, metals, fuels, and mixed waste;
- shelling and military residues creating soil hotspots;
- damaged wastewater, pumping, and drinking-water infrastructure;
- habitat destruction, fire, hydrological disruption, and protected-area damage.

The Kakhovka assessment is a distinct case, not a proxy for all Ukraine. UNEP found hydrological, geomorphic, chemical, waste, and ecological impacts, with some consequences expected to persist for decades. Field access limitations and incomplete health assessment must remain visible in every claim.

## Ozone layer clarification

The ozone hole, climate change, and ground-level air pollution are related environmental issues but not the same mechanism.

- stratospheric ozone depletion is driven mainly by chlorine- and bromine-containing ozone-depleting substances;
- CO2 is the dominant long-lived anthropogenic greenhouse gas driving warming, not the primary chemical cause of the ozone hole;
- PM2.5 is an inhalation exposure pollutant, not a measure of ozone-layer thickness;
- Montreal Protocol controls have reduced ozone-depleting substances, and authoritative assessments report gradual ozone recovery.

Therefore, a sunburn or high UV exposure cannot by itself demonstrate that a local "hole" opened over Ukraine. Individual UV exposure depends on time, latitude, season, cloud, surface reflection, altitude, behavior, and ozone conditions.

## Intervention map

| Problem | Prevention | Removal/treatment | Restoration | Key verification |
|---|---|---|---|---|
| fossil CO2 | efficiency, electrification, clean energy | durable CDR for residuals | forests, peatlands, soils with safeguards | lifecycle carbon and storage durability |
| PM2.5 | combustion controls, clean heat/transport | source capture and filtration | exposure reduction and urban/ecosystem recovery | calibrated monitoring and source apportionment |
| nutrient water pollution | precision fertilizer, buffers | wastewater nutrient removal | wetlands, riparian zones, flow restoration | N/P loads, oxygen, chlorophyll, ecology |
| metals and organics in soil | source control | excavation, washing, immobilization, thermal/chemical treatment | soil rebuilding and revegetation | pollutant-specific lab analysis and bioavailability |
| biodegradable organics | containment | microbial or fungal bioremediation where validated | habitat and soil-function recovery | breakdown products, toxicity, field performance |
| unexploded ordnance/mixed war debris | access control and mapping | specialist clearance and hazardous-waste handling | only after clearance and characterization | chain of custody, safety, repeat sampling |

Bioremediation is not a universal answer. It works only when organisms can transform or immobilize the specific pollutant under real temperature, pH, oxygen, nutrient, and toxicity conditions. Metals cannot be biodegraded into non-elements; they must be removed, immobilized, separated, or recovered.

## Visual outputs

- [CO2 milestones](./figures/co2-world-ukraine-milestones.svg)
- [PM2.5 and WHO guideline](./figures/pm25-world-ukraine-milestones.svg)
- [Safely managed drinking water](./figures/safe-water-world-ukraine.svg)
- [Safely managed sanitation](./figures/safe-sanitation-world-ukraine.svg)
- [Water stress](./figures/water-stress-world-ukraine.svg)
- [Pesticide intensity](./figures/pesticide-intensity-world-ukraine.svg)
- [Fertilizer intensity](./figures/fertilizer-intensity-world-ukraine.svg)

## Reproducible data

- [CO2 milestones](./data/co2_world_ukraine_milestones.csv)
- [PM2.5 milestones](./data/pm25_world_ukraine_milestones.csv)
- [Safe-water milestones](./data/safe_water_world_ukraine_milestones.csv)
- [Safe-sanitation milestones](./data/safe_sanitation_world_ukraine_milestones.csv)
- [Water-stress milestones](./data/water_stress_world_ukraine_milestones.csv)
- [Pesticide-intensity milestones](./data/pesticide_intensity_world_ukraine_milestones.csv)
- [Fertilizer-intensity milestones](./data/fertilizer_intensity_world_ukraine_milestones.csv)

Regenerate:

```powershell
node tools/build_population_pollution_visuals.mjs
```

## Limitations

- international time series may lag current wartime conditions;
- national averages hide city, basin, soil-type, and hotspot variation;
- modelled exposure is not personal monitoring;
- territorial emissions omit consumption embodied in trade;
- input use is not measured environmental concentration;
- current water visuals cover services and stress, not ambient chemistry;
- no composite pollution score is produced because weighting unlike hazards would add subjective assumptions;
- causal decomposition of Ukraine trends has not yet been estimated.

## Conclusions

The evidence does not support either extreme statement that "renewables solve pollution" or that "nothing is improving". Clean energy is central to preventing future emissions, while accumulated CO2, contaminated sediments, damaged soils, persistent chemicals, and conflict debris require separate removal, treatment, restoration, and long-term monitoring strategies.

For Ukraine, the main research opportunity is not another single national score. It is a transparent multi-layer evidence system linking international baselines with basin-level water data, local air monitoring, soil sampling, war-damage verification, pollutant chemistry, and intervention readiness.

## Next analytical phase

1. add SDG 6.3.2 ambient water-quality observations and Ukrainian basin records;
2. map Kakhovka and other verified war-related incidents separately from national trends;
3. add soil organic carbon, land productivity, land-cover change, and pollutant-specific hotspot data;
4. decompose Ukrainian CO2 change into activity, structure, energy intensity, and fuel mix;
5. add uncertainty and data-coverage panels;
6. create a remediation-readiness matrix for chemical, biological, and engineering options;
7. build a public dashboard only after indicator definitions and missingness rules are frozen.
