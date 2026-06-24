# Nutrition Tracking Schema

## Purpose

This schema supports food-pattern observation without turning nutrition into punishment or perfectionism.

## Daily fields

| Field | Type | Notes |
|---|---|---|
| `date` | date | Local date |
| `sleep_quality_1_5` | integer | Confounder |
| `energy_1_5` | integer | Morning or overall |
| `focus_1_5` | integer | Work/study focus |
| `mood_1_5` | integer | Overall emotional state |
| `stress_1_5` | integer | Context confounder |
| `protein_anchor_count` | integer | Meals with meaningful protein |
| `plant_variety_count` | integer | Rough count, not perfection |
| `hydration_ok` | boolean | Subjective |
| `meal_regularity` | string | regular / irregular / skipped / late |
| `caffeine_timing` | string | none / morning / afternoon / late |
| `food_based_nutrient_sources` | string | Fish, seafood, seeds, nuts, cacao, legumes, greens, etc. |
| `supplements_taken` | string | Names only, no public private dosing |
| `supplement_reason` | string | deficiency / diet gap / clinician-guided / AI-suggested / marketing exposure / other |
| `supplement_stop_rule` | string | What would trigger stopping or review? |
| `digestion_comfort_1_5` | integer | Optional |
| `notes` | text | Symptoms, context, cycle, illness, workload |

## Weekly review fields

| Field | Question |
|---|---|
| `most_stable_energy_day` | What was different? |
| `most_unstable_energy_day` | What confounders were present? |
| `most_sustainable_meal_pattern` | What felt comfortable? |
| `possible_adjustment_next_week` | One small change only |

## Interpretation rule

Do not infer causation from one meal or one supplement.

Look for repeated patterns across several weeks and check confounders:

- sleep
- stress
- workload
- cycle phase
- illness
- caffeine
- medication
- training load
- caloric restriction
- novelty or placebo effect

## Supplement interpretation rule

Track food-based intake and capsule intake separately.

Do not write "omega-3 = 0" if the intended meaning is "omega-3 capsules = 0." Use separate notes for food intake and supplement use.
