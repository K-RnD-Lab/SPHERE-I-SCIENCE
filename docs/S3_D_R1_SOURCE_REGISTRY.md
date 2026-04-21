# S3-D-R1 Source Registry

## Research home

- Sphere: `S3`
- Lane: `S3-D Agro-Intervention Analytics`
- Research line: `S3-D-R1 Intervention Comparison Frameworks`

## Purpose

This file is the first real evidence layer for `S3-D-R1`.

It tracks:

- which intervention-comparison sources we actually use
- which sources support field ranking versus conceptual framing
- how recommendation logic should be constrained by context

## Current active scope

For the first execution pass, `S3-D-R1` is deliberately narrowed to:

- comparison of field-relevant agricultural intervention classes
- response heterogeneity
- context-aware recommendation logic

This is a better first scope than trying to produce a universal agronomy engine.

## Current source set

### 1. Global field meta-analysis of microbial inoculants

Source:

- https://www.sciencedirect.com/science/article/abs/pii/S0304423823009378

Use in project:

- supports the idea that intervention effects are real but variable
- useful for ranking general confidence in microbial intervention classes

Evidence role:

- synthesis-level comparison layer

### 2. PGPR inoculants from lab to land: challenges and limitations

Source:

- https://www.sciencedirect.com/science/article/pii/S0944501324003112

Use in project:

- supports why many interventions fail to translate from laboratory conditions
- useful for the negative side of the recommendation logic

Evidence role:

- failure-mode framing

### 3. Soil microbiome indicators predict response to AMF

Source:

- https://www.nature.com/articles/s41564-023-01520-w

Use in project:

- supports the idea that intervention choice should sometimes follow response prediction rather than blind application
- useful for a high-value “predict before deploy” recommendation branch

Evidence role:

- response-prediction logic

### 4. Integrated nutrient management review

Source:

- https://www.mdpi.com/2077-0472/14/8/1330

Use in project:

- supports comparison across biological, organic, and reduced-mineral intervention combinations
- useful for mixed-intervention framing

Evidence role:

- integrated intervention framing

### 5. Dual inoculation with AMF and Rhizobium in semi-arid legumes

Source:

- https://www.sciencedirect.com/science/article/pii/S240584402400848X

Use in project:

- supports dual-inoculation comparison against simpler approaches
- useful for the “combination intervention” branch

Evidence role:

- field comparison and combination logic

### 6. Diversified cropping systems and fertilization strategies

Source:

- https://www.sciencedirect.com/science/article/pii/S0048969724031012

Use in project:

- supports the idea that not every useful intervention is a microbial inoculant
- useful for comparing microbiome-linked interventions with broader field-management patterns

Evidence role:

- field-system comparison framing

### 7. Beneficial microbes plus sensor technologies for smart agriculture

Source:

- https://www.mdpi.com/1424-8220/25/21/6631

Use in project:

- supports the future-facing connection between intervention choice and data-driven timing or dosing
- useful as a forward-looking bridge, not as the main evidence base

Evidence role:

- future-facing decision-support extension

## Current research stance

At this stage, `S3-D-R1` should be treated as:

- a comparison and recommendation-logic project

not as:

- a universal prescription system
- a product selection tool detached from field context

## What to collect next

The next useful sources should include:

- direct head-to-head intervention studies
- field comparisons under nutrient stress
- response prediction studies in additional crops
- comparison studies that include “no benefit” or negative outcomes

## Claim discipline

From this registry, we may claim:

- that intervention classes differ in plausibility and field robustness
- that context fit is central
- that response prediction is a serious next step for better deployment

We should not yet claim:

- universal intervention rankings
- fixed best-in-class recommendations across crops
- that recommendation logic is already production-grade
