# S6-D-R2a Pollution Reduction Digital Experiment Roadmap

## Research identity

- Sphere: `S6 Ecology & Environmental Science`
- Lane: `S6-D Pollution, Stress & Response Networks`
- Direction: `S6-D-R2 Pollution Reduction & Recovery Systems`
- Combination: `S+T`
- Geography: Ukraine with global method evidence
- Status: active design and digital-screening phase

## Goal

Build a safe, reproducible path from a measured environmental problem to a defensible intervention. The program covers air, climate, water, soil, and waste, but does not treat them as one interchangeable pollution score.

The governing sequence is:

```text
measure -> identify source -> prevent -> capture or treat -> manage residues -> restore -> verify
```

Prevention and source control come first. A treatment that transfers a contaminant from water into toxic sludge, from soil into wastewater, or from air into an unmanaged filter is not a complete solution.

## Safety boundary

The digital lab is a screening environment, not authorization for environmental release or unsupervised chemistry.

- no reagent dosage is recommended without a known contaminant, concentration, matrix, pH, temperature, and treatment objective;
- no acids, bases, oxidants, reductants, sorbents, microbes, or nanoparticles are released into soil, drains, rivers, groundwater, or air;
- no household chemicals are mixed;
- no treated water is labelled potable without accredited testing and regulatory confirmation;
- real contaminated samples move directly to a qualified laboratory and approved waste route;
- war debris, asbestos, explosives, unknown powders, mercury, radioactive materials, and mixed industrial waste are specialist-only hazards.

## Intervention hierarchy

| Priority | Question | Preferred outcome |
|---|---|---|
| 1. Prevent | Can the pollutant be avoided? | no pollutant generated |
| 2. Reduce | Can input, energy, leakage, or toxicity be reduced? | lower source load |
| 3. Separate | Can the stream be kept concentrated and unmixed? | recoverable material |
| 4. Capture/treat | Which method matches the contaminant and medium? | lower toxicity, mobility, or mass |
| 5. Manage residues | Where do filters, sludge, brine, ash, or spent sorbent go? | no pollution transfer |
| 6. Restore | Can ecological function be rebuilt? | recovery of soil, water, or habitat |
| 7. Verify | Did concentration, exposure, and ecological risk fall? | measured durable benefit |

## Air and climate pathway

### Conventional air pollutants

| Problem | First-line prevention | Candidate control | Verification |
|---|---|---|---|
| PM and dust | clean heat, process enclosure, transport and dust control | bag filters, electrostatic precipitation, cyclones, wet scrubbing where appropriate | source-resolved PM2.5/PM10 and stack measurements |
| SOx and acid gases | low-sulfur inputs and fuel switching | flue-gas desulfurization or compatible sorbents | inlet/outlet mass balance and reagent residue |
| NOx | combustion optimization and electrification | low-NOx systems, selective catalytic/non-catalytic reduction | NOx, ammonia slip, energy and catalyst impacts |
| VOCs | substitution, sealed handling, leak detection | adsorption, condensation, catalytic/thermal oxidation | compound-specific removal and by-products |

### CO2

CO2 cannot be made harmless by releasing a second chemical into open air. Valid pathways are:

1. avoid fossil energy and unnecessary demand;
2. reduce energy and material intensity;
3. replace high-carbon energy and processes;
4. capture concentrated point-source CO2 where lifecycle accounting is favorable;
5. durably store residual CO2 geologically or through verified mineral carbonation;
6. use direct air capture only with low-carbon energy, water/material accounting, durable storage, and monitoring;
7. restore forests, peatlands, wetlands, and soils without treating biological storage as permanent by default.

CO2 conversion is real, but product fate matters. Mineralization can bind carbon in stable carbonates. Conversion to fuels or short-lived chemicals commonly returns CO2 to the atmosphere when the product is used, so it is utilization or recycling, not necessarily durable removal.

## Water pathway

Treatment must begin with a water analysis and a target use. Drinking water, industrial wastewater, river restoration, and mine drainage require different standards.

| Contaminant class | Candidate methods for digital screening | Main failure mode to track |
|---|---|---|
| suspended solids | settling, filtration, coagulation/flocculation | sludge generation and coagulant residuals |
| nutrients | source control, biological N removal, P precipitation, wetlands | eutrophication transfer and N2O emissions |
| metals | precipitation, adsorption, ion exchange, membranes, reactive barriers | hazardous sludge/brine; pH-dependent remobilization |
| petroleum/organics | source containment, activated carbon, bioremediation, oxidation | toxic transformation products and spent media |
| salts | source reduction, membranes, evaporation/recovery where justified | concentrated brine and high energy use |
| pathogens | source sanitation, validated filtration/disinfection | incomplete contact, regrowth, harmful by-products |

`PHREEQC` is the first computational tool for aqueous speciation, mineral saturation, sorption, mixing, gas-water interaction, precipitation, and reaction/transport scenarios. It predicts chemistry under stated assumptions; it does not establish toxicity, field kinetics, or regulatory compliance by itself.

## Land and soil pathway

Soil is a living heterogeneous system, not dirty water. Selection requires contaminant identity, depth, concentration, bioavailability, soil texture, organic matter, groundwater connection, land use, and exposure pathway.

| Situation | Candidate response | Verification |
|---|---|---|
| mobile metals | source removal, excavation, soil washing, stabilization, reactive barriers | total and bioavailable metal, leaching test, groundwater |
| petroleum hydrocarbons | containment, soil-vapor extraction, bioremediation, thermal treatment | compound fractions, metabolites, toxicity, oxygen/nutrients |
| persistent organics | excavation, thermal/chemical treatment, sorption or containment | parent compound plus transformation products |
| diffuse low-level contamination | risk-based land management, phytotechnologies, monitored attenuation | uptake, food-chain transfer, trend and rebound |
| degraded but not chemically contaminated soil | erosion control, organic matter recovery, cover and vegetation | SOC, productivity, infiltration, biodiversity |

Microbes can degrade some organic compounds. They cannot biodegrade metals into non-elements. Metals must be removed, recovered, immobilized, or isolated, with long-term monitoring of remobilization.

## Digital experiment ladder

### Level 0: evidence screen

- identify contaminant by name and CAS/DTXSID where possible;
- review physicochemical properties, fate, exposure, toxicity, and data quality in EPA CompTox;
- define medium, source, receptor, pathway, and regulatory target;
- reject methods that merely move the pollutant into an unmanaged residue.

### Level 1: mass-balance sandbox

Use the K-EcoLOGIC `Digital Treatment Sandbox` to compare:

- influent pollutant mass;
- assumed removal efficiency;
- remaining mass;
- captured mass;
- estimated secondary residue;
- energy, water, chemical, monitoring, and disposal requirements.

This is scenario arithmetic, not a validated process model.

### Level 2: chemistry and fate simulation

- `PHREEQC`: water speciation, pH/redox, precipitation, mineral saturation, sorption, and reactive transport;
- EPA `CompTox`: toxicity, environmental fate, exposure, and chemical identity screening;
- lifecycle model: energy, materials, transport, consumables, replacement, residue management, and CO2e;
- uncertainty analysis: ranges rather than one optimistic efficiency value.

### Level 3: controlled laboratory validation

Performed with qualified supervision, a written protocol, controls, replicates, analytical methods, chain of custody, waste handling, and stop criteria. Start with synthetic non-hazardous matrices before real contaminated samples.

### Level 4: permitted field pilot

Requires site characterization, owner and regulator authorization, community/exposure safeguards, baseline and control locations, monitoring, contingency response, residue contracts, and post-treatment verification.

## First computational experiments

| ID | Experiment | Output | Current status |
|---|---|---|---|
| S6D-R2A-E01 | CO2 mineralization screening | carbonate yield, reagent/mineral demand, energy and storage boundary | planned |
| S6D-R2A-E02 | Phosphate-removal comparison | residual P, sludge mass, pH sensitivity, cost range | planned |
| S6D-R2A-E03 | Metal immobilization scenario | saturation/leaching risk across pH and redox | planned |
| S6D-R2A-E04 | Activated-carbon treatment train | captured mass, media replacement, spent-carbon route | planned |
| S6D-R2A-E05 | Soil-remediation decision matrix | feasible methods by contaminant, depth, land use, and exposure | planned |
| S6D-R2A-E06 | Ukraine waste-diversion pilot | contamination, capture, diversion, cost, and verified destination | designed in `S6-A-R1b` |

## Decision criteria

Every proposed intervention receives separate scores; they are not hidden in one composite number:

- source-load reduction;
- removal efficiency and uncertainty;
- toxicity and mobility after treatment;
- energy, water, land, and material demand;
- secondary waste and disposal route;
- lifecycle greenhouse-gas effect;
- maturity and evidence quality;
- Ukraine availability and supply chain;
- regulatory and occupational safety;
- monitoring feasibility;
- cost per unit of verified risk reduction;
- reversibility and failure consequences.

## Primary references and tools

- [S6-D-R2a source registry](./S6_D_R2A_SOURCE_REGISTRY.md)
- IPCC AR6 WGIII Technical Summary: https://www.ipcc.ch/report/ar6/wg3/chapter/technical-summary/
- IPCC AR6 WGI carbon-cycle and CDR assessment: https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-5/
- USGS PHREEQC documentation: https://water.usgs.gov/water-resources/software/PHREEQC/documentation/phreeqc3-html/phreeqc3-2.htm
- US EPA CompTox Chemicals Dashboard: https://www.epa.gov/comptox-tools/comptox-chemicals-dashboard
- US EPA remediation technology descriptions: https://www.epa.gov/remedytech/remediation-technology-descriptions-cleaning-contaminated-sites
- Law of Ukraine `On Waste Management`: https://zakon.rada.gov.ua/laws/show/2320-20#Text

## Next actions

1. implement `E01` as a transparent CO2 mineralization mass-balance model;
2. add a PHREEQC runner for `E02` and `E03` with versioned input decks;
3. create a contaminant-method-residue registry with evidence grades;
4. connect Ukrainian monitoring observations without replacing missing values with zero;
5. recruit an environmental chemist and accredited laboratory before any real-sample experiment;
6. publish all negative and inconclusive results alongside successful scenarios.
