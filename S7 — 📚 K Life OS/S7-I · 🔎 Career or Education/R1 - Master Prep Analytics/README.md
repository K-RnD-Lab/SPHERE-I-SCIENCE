# R1 - Master Prep Analytics

A combined research case for magistracy preparation, learning systems, cognition, live dashboarding, and the actual trainer workspace used in practice.

This project belongs to:
- `K R&D Lab`
- `SPHERE I - SCIENCE`
- `?? S7 - K Life OS`
- `S7-I · ?? Career or Education`

---

## What now lives here

This space now contains both layers of the case:
- `trainer/` = the migrated interactive prep workspace from the former `master_prep_2026` repo
- `dashboard/` = the public analytics layer with charts, targets, and a trainer preview

That means the preparation environment and the public proof layer now live in one research structure.

---

## Public entry points

Replace placeholders with your real links when each layer is ready:

- **Live dashboard (Vercel):** [replace with your public dashboard](https://REPLACE_ME.vercel.app)
- **Google Sheet:** [replace with your source spreadsheet](https://docs.google.com/spreadsheets/d/REPLACE_ME/edit)
- **Looker Studio:** [replace with your report layer](https://lookerstudio.google.com/reporting/REPLACE_ME)
- **Apps Script endpoint:** [replace with your JSON endpoint](https://script.google.com/macros/s/REPLACE_ME/exec)

---

## What this project should prove

This repo is meant to help answer questions like:
- Can relatively modest but structured effort still produce strong scores?
- Which subject improves faster per hour invested?
- Does the custom trainer match external simulation results?
- Are predicted results close to actual exam-facing results?
- Which sources produce the best return for the time invested?

---

## Live data architecture

### Recommended setup

- **Google Sheet** = live source of truth
- **Apps Script web app** = JSON endpoint for the dashboard
- **Vercel** = public dashboard deployment
- **GitHub** = research structure, trainer, snapshots, and report layer

That means:
- do **not** write every log directly into GitHub
- use the Sheet for continuous updates
- use GitHub for case-study structure, trainer code, and snapshots

---

## Files and roles

- `trainer/`
  full practice and simulation workspace preserved inside this repo

- `dashboard/`
  public analytics layer that can run from local CSV **or** from the Apps Script endpoint

- `data/resource_catalog.csv`
  categorized preparation sources for TZNK, English, and IT

- `data/study_log_template.csv`
  live study-block template for theory and concept work

- `data/session_log_template.csv`
  live session template for training, simulation, and review

- `docs/GOOGLE_SHEETS_SETUP.md`
  exact setup for Sheet tabs and Apps Script

- `integrations/google-apps-script/Code.gs`
  starter Apps Script endpoint logic

- `report.md`
  longer case-study narrative and interpretation layer

---

## Key metrics already supported

### Core effort metrics
- total study minutes
- total session minutes
- total logged sessions
- questions tracked
- weekly consistency potential

### Performance metrics
- average accuracy
- simulation accuracy
- strongest subject
- weakest subject
- readiness signal
- current estimate versus target
- predicted versus actual score gap

### Insight metrics
- study vs session ratio
- external vs internal sessions
- most used mode
- training vs simulation split
- progress to target by subject
- efficiency per subject

This is enough to catch signals like:
- low effort, strong output
- high effort, weak transfer
- internal trainer overestimating or underestimating real performance
- simulation readiness lagging behind practice confidence

---

## Recommended logging logic

### Study rows
Log when you:
- read official program docs
- study concepts
- review explanations
- build foundations before test drills

### Session rows
Log when you:
- train in your custom hub
- do an external batch on Osvita.ua / Testportal / other source
- run a timed simulation
- review mistake patterns

Use `mode` consistently, for example:
- `training`
- `simulation`
- `review`

Use `source_group` consistently, for example:
- `internal`
- `external`

Use `is_internal` as:
- `true` for your own hub/trainer
- `false` for external platforms

---

## Vercel deployment idea

You do **not** need a separate repo just for the public layer.
Deploy this repo with `Root Directory` pointed to:
- `S7-I / R1 / dashboard`

That public build now also contains a `Trainer` tab and a deployable `dashboard/trainer/` copy for demonstration.

---

## Suggested next step

1. publish the Apps Script endpoint as a public web app
2. paste the endpoint URL into `dashboard/config.js`
3. keep training in `trainer/` or `dashboard/trainer/`, with new logs posting into Google Sheet automatically when Apps Script is public
4. let the Vercel dashboard read live Google Sheet data
5. use local export only as backup once live sheet sync is active

