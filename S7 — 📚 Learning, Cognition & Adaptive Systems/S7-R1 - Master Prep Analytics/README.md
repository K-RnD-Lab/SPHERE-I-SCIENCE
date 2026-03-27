# S7 Master Prep Analytics

A CSV-first research case for magistracy preparation, learning systems, cognition, and evidence-based progress tracking.

This project belongs to:
- `K R&D Lab`
- `SPHERE I — SCIENCE`
- `S7 — Learning, Cognition & Adaptive Systems`

It can also be mirrored publicly through:
- `SPHERE II — ENTREPRENEURSHIP`
- `E4 — Applied Investigations & Public Cases`

It is not an LMS and not a replacement for official exam platforms.
It is a structured research-and-operations layer that helps you:
- study from existing sources
- practice on existing platforms
- log real work in a repeatable way
- visualize progress
- turn the preparation process into a measurable research case

---

## What This Repo Should Show

This repo should eventually show four things at once:

1. The preparation process  
What was studied, practiced, repeated, and measured.

2. The learning system behind the preparation  
How the workflow, schedule, and decision rules evolved.

3. The measurable outcomes  
Accuracy trends, session counts, study minutes, weak spots, and improvement windows.

4. The research case itself  
A public narrative about how an evidence-based learning system was built and refined.

---

## Output Model

### 1. data/
The source of truth.

Use CSV files for:
- study blocks
- practice sessions
- simulation results
- resource cataloging

### 2. dashboard/
The quick visual layer.

Use this for:
- current totals
- subject breakdowns
- recent sessions
- rolling accuracy
- consistency snapshots

### 3. report.md
The long-form readable case.

Use this for:
- question and context
- method
- data logic
- observations
- exported charts
- decisions and next changes

### 4. figures/
The presentation layer.

Use exported charts here for:
- README visuals
- public posts
- slides
- K-R&D Lab cross-linking

---

## Folder Map

- `data/resource_catalog.csv`  
  A categorized map of sources for TZNK, English, and IT.

- `data/study_log_template.csv`  
  A template for theory, concept review, and source-based study blocks.

- `data/session_log_template.csv`  
  A template for practice, simulation, and review sessions.

- `dashboard/`  
  A static browser dashboard that reads CSV files and visualizes the current prep picture.

- `report.md`  
  The main case-study narrative for publication and reflection.

- `figures/`  
  Exported charts and screenshots for public presentation.

---

## Suggested Workflow

1. Pick one resource from `resource_catalog.csv`.
2. Study for 15–45 minutes.
3. Add one row to `study_log_template.csv`.
4. Practice on an external platform or in your own trainer.
5. Add one row to `session_log_template.csv`.
6. Open `dashboard/index.html` for quick status.
7. Periodically export charts into `figures/`.
8. Summarize changes and insights in `report.md`.

---

## What To Measure

Minimum useful metrics:
- total study minutes
- total practice minutes
- total sessions
- simulations completed
- rolling accuracy by subject
- top weak topics
- top improved topics
- resource usage by platform
- weekly consistency

Good public-case metrics:
- before vs after by subject
- weak spot reduction over time
- simulation readiness trend
- source mix: official vs external
- decision changes after evidence

---

## Why This Fits S7

This repo is not a biomedical line and not only a business case.
It is first a research line about:
- learning systems
- cognition
- adaptive preparation
- measurable progress
- human performance over time

That makes `S7 — Learning, Cognition & Adaptive Systems` its natural home.

`E4` can still mirror it later as a public case about systems thinking, iteration, and visible progress.
