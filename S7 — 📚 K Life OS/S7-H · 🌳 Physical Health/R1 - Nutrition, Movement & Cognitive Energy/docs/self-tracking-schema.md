# Self-Tracking Schema

## Purpose

This schema supports low-pressure self-observation. It is not meant to turn health into obsessive tracking.

## Daily fields

| Field | Type | Notes |
|---|---|---|
| `date` | date | Local date |
| `sleep_quality_1_5` | integer | Subjective |
| `energy_1_5` | integer | Morning or overall |
| `focus_1_5` | integer | Work/study focus |
| `mood_1_5` | integer | Overall emotional state |
| `stress_1_5` | integer | Context confounder |
| `walking_minutes` | integer | Approximate |
| `running_minutes` | integer | If applicable |
| `strength_training` | boolean | Gym or home |
| `mobility_recovery_minutes` | integer | Optional |
| `protein_anchor_count` | integer | Number of meals with meaningful protein |
| `plant_variety_count` | integer | Rough count, not perfection |
| `hydration_ok` | boolean | Subjective |
| `caffeine_timing` | string | none / morning / afternoon / late |
| `supplements_taken` | string | Names only, no public private dosing |
| `notes` | text | Symptoms, context, cycle, illness, workload |

## Weekly review fields

| Field | Question |
|---|---|
| `best_energy_day` | What was different? |
| `worst_energy_day` | What confounders were present? |
| `most_sustainable_meal_pattern` | What felt comfortable? |
| `most_sustainable_activity_pattern` | What was repeatable? |
| `possible_adjustment_next_week` | One small change only |

## Interpretation rule

Do not infer causation from one day.

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
