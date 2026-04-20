# Science S1 To S6 Summary Map

## Purpose

This document is the canonical architecture map for `SPHERE-I-SCIENCE`.

Its role is to keep `S1-S6` stable for years ahead while allowing research items, case studies, and tools to change underneath without breaking the structure.

## Core principle

Each science sphere should have:

1. a stable long-term scientific identity
2. a small set of stable sub-lanes
3. concrete research items inside those sub-lanes

Use this pattern:

- `Sx` = sphere
- `Sx-A`, `Sx-B`, `Sx-C` = stable sub-lanes
- `Sx-A-R1`, `Sx-A-R2` = research cases
- `Sx-A-R1a`, `Sx-A-R1b` = substudies if needed

## Boundary with technology

Keep this split stable:

- `SCIENCE` = research question, biological/environmental interpretation, scientific case
- `TECHNOLOGY` = reusable engine, tool, pipeline, app shell, infrastructure

Many projects will be:

- `S + T`

That is correct.

But the scientific home should still remain inside the relevant `S` sphere.

## S1 Biomedical & Oncology

### Role

Biomedical and translational oncology block.

### Stable sub-lanes

- `S1-A` PHYLO-GENOMICS
- `S1-B` PHYLO-RNA
- `S1-C` PHYLO-DRUG
- `S1-D` PHYLO-LNP
- `S1-E` PHYLO-BIOMARKERS
- `S1-F` PHYLO-RARE

### Strongest current strategic directions

- oncology variant and biomarker triage
- RNA therapeutics and delivery prioritization

### Structural note

`S1` already has the strongest lane-level map.
Its main problem is not taxonomy but execution clutter:

- flagship program
- case study
- archive

need to be separated more cleanly.

## S2 Plant Science & Phytochemistry

### Role

Plant-intrinsic biology, phytochemistry, and plant bioactivity.

### Stable sub-lanes

- `S2-A` Plant Omics & Trait Signatures
- `S2-B` Phytochemicals & Natural Products
- `S2-C` Stress Biology & Resilience
- `S2-D` Plant-Pathogen & Defense Systems
- `S2-E` Translational Plant Bioactivity

### Strongest starting directions

- `S2-B` phytochemical atlas and candidate prioritization
- `S2-C` plant stress response and resilience signatures

## S3 Agricultural Biology & Biofertilizers

### Role

Field-facing agro-biology and intervention systems.

### Stable sub-lanes

- `S3-A` Soil & Rhizosphere Microbiomes
- `S3-B` Biofertilizer Design & Validation
- `S3-C` Crop Stress & Yield Systems
- `S3-D` Agro-Intervention Analytics
- `S3-E` Field Translation & Practical Deployment

### Strongest starting directions

- `S3-A` rhizosphere microbiome scoring for crop support
- `S3-B` biofertilizer efficacy and intervention validation

## S4 Biochemistry & Metabolomics

### Role

Cross-domain biochemical and metabolomic bridge.

### Stable sub-lanes

- `S4-A` Metabolomics & Signature Discovery
- `S4-B` Pathway Chemistry & Perturbation
- `S4-C` Enzyme, Target & Substrate Logic
- `S4-D` Cross-Domain Mechanism Models
- `S4-E` Translational Chemical Inference

### Strongest starting directions

- `S4-A` metabolite signature classifier and interpretation layer
- `S4-B` pathway perturbation maps and mechanism prioritization

## S5 Neuroscience & Aging

### Role

Brain, cognition, neuroinflammation, aging, and vulnerability.

### Stable sub-lanes

- `S5-A` Neuroinflammation & Biomarkers
- `S5-B` Cognitive Aging & Vulnerability
- `S5-C` Neurodegeneration Models
- `S5-D` Brain Resilience & Recovery
- `S5-E` Longitudinal Brain Risk Systems

### Strongest starting directions

- `S5-A` neuroinflammation signal panels
- `S5-B` cognitive aging risk and vulnerability profiles

## S6 Ecology & Environmental Science

### Role

Environmental systems, monitoring, ecological signals, and public-interest environmental science.

### Stable sub-lanes

- `S6-A` Environmental Sentinel Systems
- `S6-B` Environmental Microbiomes
- `S6-C` Biodiversity & Ecosystem Signals
- `S6-D` Pollution, Stress & Response Networks
- `S6-E` Climate-Linked Ecological Change

### Strongest starting directions

- `S6-A` environmental monitoring and sentinel systems
- `S6-D` pollution, stress, and response networks

### Structural note

`K-EcoLOGIC Lab` should be treated as the public-facing program label inside `S6-A`, not as a separate science sphere.

## Recommended order of development

If the goal is to build a durable and practical scientific architecture, the best order is:

1. `S1`
2. `S2`
3. `S3`
4. `S4`
5. `S5`
6. `S6`

Reason:

- `S1` is already the deepest and most complex
- `S2` and `S3` create a clean plant/agro split
- `S4` becomes stronger once its neighboring biology lanes are fixed
- `S5` is high-value and human-relevant
- `S6` benefits from the environmental sentinel logic already emerging through `K-EcoLOGIC Lab`

## How to expand from here

The correct next stage is:

1. keep `S1-S6` stable
2. for each sub-lane, define:
   - `R1`
   - `R2`
3. for each research item, add:
   - `R1a`
   - `R1b`
   if substudies are actually needed

## Anti-chaos rule

Do not create new letters every time a new project appears.

Use a new letter only when a scientific direction is truly different and durable.

Otherwise:

- place the work inside the correct existing letter
- add it as `R1`, `R2`, or `R1a`

That is the cleanest way to keep the system readable over long horizons.
