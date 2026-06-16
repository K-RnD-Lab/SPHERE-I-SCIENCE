# Activity Tracking Schema

## Purpose

This schema supports low-pressure movement observation. It should help identify what is sustainable, not create guilt.

## Daily fields

| Field | Type | Notes |
|---|---|---|
| `date` | date | Local date |
| `sleep_quality_1_5` | integer | Confounder |
| `energy_before_activity_1_5` | integer | Optional |
| `energy_after_activity_1_5` | integer | Optional |
| `focus_1_5` | integer | Overall focus |
| `mood_1_5` | integer | Overall mood |
| `stress_1_5` | integer | Context |
| `walking_minutes` | integer | Approximate |
| `running_minutes` | integer | If applicable |
| `strength_training` | boolean | Gym or home |
| `mobility_recovery_minutes` | integer | Optional |
| `perceived_effort_1_10` | integer | Main activity |
| `soreness_1_5` | integer | Next-day useful too |
| `notes` | text | Cycle, illness, workload, pain, weather |

## Weekly review fields

| Field | Question |
|---|---|
| `most_energizing_activity` | What seemed to help? |
| `most_depleting_activity` | What created fatigue? |
| `best_recovery_pattern` | What made movement repeatable? |
| `next_week_adjustment` | One small change only |

## Interpretation rule

Do not infer causation from one workout.

Look for repeated patterns across several weeks and check confounders:

- sleep
- stress
- workload
- cycle phase
- illness
- caloric restriction
- soreness
- novelty effect
