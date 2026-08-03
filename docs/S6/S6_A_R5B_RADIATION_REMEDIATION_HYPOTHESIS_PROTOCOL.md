# S6-A-R5b Radiation Remediation Hypothesis Protocol

## Research identity

- Sphere: `S6 Ecology & Environmental Science`
- Program: `S6-A-R5 Radiation and Environmental Risk`
- Substudy: `S6-A-R5b Radiation Remediation and Thermal Management`
- Combination: `S+T`
- Geography: Chornobyl and Ukraine with global method evidence
- Status: active hypothesis-screening design; no physical radioactive experiments

## Purpose

Evaluate ideas for reducing radiological risk without confusing radiation, radioactive material, heat, and chemical pollution.

```text
radiation field != radioactive contamination != absorbed dose != chemical toxicity
```

- `Radiation field`: ionizing energy emitted by a source.
- `Radioactive contamination`: unwanted radionuclides on or inside people, water, soil, air, equipment, or buildings.
- `Exposure/dose`: energy delivered to tissue or another material.
- `Chemical toxicity`: harm caused by chemical properties; a radionuclide may create both chemical and radiological hazards.

The research target is usually not to make a nucleus stop being radioactive. It is to remove the source, prevent transport, reduce exposure, immobilize or condition the material, recover useful heat where appropriate, and safely manage the concentrated waste until decay or disposal requirements are met.

## Critical corrections

### Sunlight and ionizing radiation

Sunlight contains visible light, infrared, and ultraviolet radiation. Visible and infrared radiation are non-ionizing. UV is also generally classified as non-ionizing but can cause photochemical DNA damage. Gamma rays, X-rays, alpha particles, beta particles, and neutrons involve different energies and interactions. Sharing the word `radiation` does not make their biological effects or treatment interchangeable.

### Infusion therapy and "detox"

Ordinary intravenous fluids do not remove external radiation and are not a general treatment for internal radionuclide contamination. Medical decorporation is radionuclide-specific and requires confirmed or credible internal contamination plus specialist supervision. Examples include:

- stable iodine to reduce thyroid uptake of radioactive iodine in the correct emergency window;
- Prussian blue for selected radioactive caesium contamination;
- calcium- or zinc-DTPA for selected transuranium radionuclides.

These medicines are not universal anti-radiation treatments and should not be self-administered. Supportive infusion may treat dehydration or another clinical problem without proving that radiation or a toxin was removed.

## What water can and cannot do

| Role | What water can do | What it cannot do |
|---|---|---|
| washing | remove loose radioactive particles from skin or surfaces | erase dose already absorbed |
| shielding | attenuate radiation when sufficient depth and geometry are maintained | make the source non-radioactive |
| cooling | carry heat from reactor systems or spent fuel | replace redundant engineered cooling and power systems |
| process medium | carry radionuclides to filtration, sorption, precipitation, ion exchange, or membranes | guarantee clean drinking water without measurement |
| transport pathway | move dissolved or particle-bound radionuclides | safely dispose of the captured radionuclides |

Boiling does not remove radioactive material from water and may concentrate non-volatile contaminants as water evaporates.

## Membranes, films, sorbents, and modified materials

The hypothesis is scientifically valid, but every material is radionuclide- and matrix-specific.

| Target form | Candidate mechanism | Candidate material class | New waste created |
|---|---|---|---|
| suspended radioactive particles | size separation | micro/ultrafiltration, filter media | radioactive filter cake or cartridge |
| dissolved caesium | selective ion exchange/sorption | zeolites, ferrocyanide-type selective media, engineered exchangers | loaded sorbent |
| dissolved strontium | ion exchange/precipitation | selective exchangers, titanate or compatible mineral media | loaded media or sludge |
| uranium/transuranic species | speciation-dependent sorption/precipitation | tailored ion exchangers, mineral sorbents, precipitation systems | radioactive concentrate/sludge |
| mixed low-level liquid waste | treatment train | coagulation, sorption, membranes, ion exchange, evaporation | several concentrated waste streams |

The principal success metric is not only removal from water. It is total activity balance:

```text
activity entering = activity in treated water + activity in filters/sludge/brine + measured losses
```

## Can radioactivity be transformed into something useful?

### What is already useful

- controlled nuclear fission converts nuclear energy into heat and then electricity;
- reactor and industrial waste heat can support district heating, industrial heat, or desalination when safety and economics are validated;
- sealed radioisotope sources can power small long-lived devices;
- ionizing radiation can be used in sterilization, imaging, measurement, and materials processing.

### What does not count as cleanup

- harvesting a tiny fraction of emitted energy while leaving contamination dispersed;
- moving radionuclides from water into an unmanaged filter;
- converting heat to electricity without controlling radioactive material;
- using a radionuclide in a product without containment, licensing, and end-of-life management.

### Transmutation

Nuclear transmutation can convert selected long-lived radionuclides into other nuclides using reactors or accelerators. It is isotope-specific, technically complex, energy- and infrastructure-intensive, and can create secondary radionuclides. It is a research and fuel-cycle strategy, not a reagent that can be applied to contaminated soil or forest.

## Chornobyl intervention map

| Problem | Practical intervention family | Verification |
|---|---|---|
| fuel-containing material and unstable structures | confinement, remote characterization, retrieval, conditioning, packaging | dose maps, material inventory, containment performance |
| contaminated soil hotspots | access control, cover, removal where justified, stabilization, land-use restriction | radionuclide-specific soil activity and dose pathways |
| contaminated water/groundwater | source control, hydraulic management, sorption/filtration, monitored attenuation where justified | activity by nuclide, flow, sediments, filters and downstream water |
| radioactive waste | sorting, characterization, conditioning, storage/disposal | complete inventory and chain of custody |
| forest and fire pathway | fire prevention, fuel management, smoke/dust monitoring, emergency restrictions | airborne activity, deposition, dose and fire history |
| food-chain transfer | land/food controls and monitoring | radionuclide-specific food, soil and biota measurements |

The objective is risk reduction and controlled stewardship. Some areas may remain restricted because removal would create more worker dose, ecological damage, cost, or secondary waste than managed containment and monitored decay.

## Reactor cooling logic

Reactors and recently discharged spent fuel require reliable heat removal. Even after the chain reaction stops, radioactive decay continues to produce `decay heat`.

```text
fuel -> heat transfer -> coolant loop -> heat exchanger/steam system -> final heat sink
```

Safety depends on multiple barriers, redundant cooling, backup power, instrumentation, water chemistry, leak detection, and emergency procedures. Water is commonly both coolant and shielding, but the cooling architecture is an engineered nuclear-safety system and not an experimental environmental-remediation surface.

## Safe hypothesis-validation ladder

### Level 0: classify the claim

Record:

- radionuclide and chemical form;
- activity concentration and uncertainty;
- medium and source geometry;
- radiation type and energy;
- exposure pathway and receptor;
- half-life and daughter products;
- desired endpoint: shielding, removal, immobilization, heat transfer, decay storage, or energy recovery.

If the radionuclide is unknown, no material or reagent can be selected responsibly.

### Level 1: digital evidence screen

- IAEA method evidence and waste-management requirements;
- radionuclide decay and daughter-chain calculation;
- mass/activity balance;
- `RESRAD`-type pathway and dose assessment for soil/water scenarios;
- `PHREEQC` aqueous speciation and mineral/sorption scenarios, with radionuclide activity tracked separately;
- radiation transport/shielding model only with benchmarked nuclear data and expert review;
- sensitivity and uncertainty analysis rather than a single efficiency estimate.

### Level 2: non-radioactive analogue

Qualified laboratories may first test non-radioactive chemical analogues to evaluate flow, sorption, membrane fouling, pH, competing ions, heat transfer, and secondary waste. Chemical similarity does not validate radiation safety or radionuclide behavior by itself.

### Level 3: licensed radiochemical laboratory

Real radionuclides require authorization, dosimetry, contamination control, shielding, trained staff, calibrated detectors, chain of custody, waste acceptance criteria, emergency planning, and regulator-approved disposal.

### Level 4: authorized field pilot

Field use requires site owner and regulatory approval, baseline and control monitoring, worker/public dose assessment, environmental transport modelling, stop criteria, waste-route contracts, and long-term verification.

## First research hypotheses

| ID | Hypothesis | Safe first test | Status |
|---|---|---|---|
| S6A-R5B-H01 | selective media can reduce dissolved Cs/Sr in a defined water matrix | literature + synthetic non-radioactive matrix + PHREEQC/activity balance | planned |
| S6A-R5B-H02 | a membrane/sorbent train can reduce liquid volume requiring radioactive disposal | digital treatment-train and secondary-waste balance | planned |
| S6A-R5B-H03 | water depth materially changes dose behind a defined source geometry | benchmarked shielding calculation; no source handling | planned |
| S6A-R5B-H04 | selected Chornobyl hotspots benefit more from containment than removal | pathway-dose and lifecycle comparison | planned |
| S6A-R5B-H05 | waste-heat recovery can deliver useful heat without changing radiological barriers | thermodynamic and safety-boundary study | planned |
| S6A-R5B-H06 | forest-fire prevention lowers remobilization risk | historical fire, deposition, wind, and monitoring analysis | planned |

## Decision rule

A hypothesis advances only if it reduces measured dose or radionuclide mobility without creating a larger worker exposure, uncontrolled transport pathway, ecological impact, energy burden, or unmanaged radioactive waste stream.

## Sources

- [S6-A-R5b source registry](./S6_A_R5B_SOURCE_REGISTRY.md)
