# S7-R1 Master Prep Analytics

A CSV-first research case for magistracy preparation, learning systems, cognition, and evidence-based progress tracking.

This project belongs to:
- `K R&D Lab`
- `SPHERE I — SCIENCE`
- `📚 S7 — Learning, Cognition & Adaptive Systems`

It can also be mirrored publicly through:
- `SPHERE II — ENTREPRENEURSHIP`
- `E4 — Applied Investigations & Public Cases`

---

## Public entry points

Use these as public-facing bridges once you replace the placeholders:

- **Live dashboard (Vercel):** [replace with your public dashboard](https://REPLACE_ME.vercel.app)
- **Google Sheet:** [replace with your source spreadsheet](https://docs.google.com/spreadsheets/d/REPLACE_ME/edit)
- **Looker Studio:** [replace with your report layer](https://lookerstudio.google.com/reporting/REPLACE_ME)
- **Apps Script endpoint:** [replace with your JSON endpoint](https://script.google.com/macros/s/REPLACE_ME/exec)

---

## What this project should prove

This repo is meant to help answer questions like:
- Can relatively modest but structured effort still produce strong scores?
- Which subject improves faster per hour invested?
- Does training inside the custom hub match real external simulation results?
- Are predicted results close to actual exam-facing results?
- Which sources produce the best return for the time invested?

---

## Live data architecture

### Recommended setup

- **Google Sheet** = live source of truth
- **Apps Script web app** = JSON endpoint for the dashboard
- **Vercel** = public dashboard deployment
- **GitHub** = research structure, snapshots, and report layer

That means:
- do **not** write every log directly into GitHub
- use the Sheet for continuous updates
- use GitHub for case-study snapshots and structure

---

## Files and roles

- `data/resource_catalog.csv`  
  categorized preparation sources for TZNK, English, and IT

- `data/study_log_template.csv`  
  live study-block template for theory and concept work

- `data/session_log_template.csv`  
  live session template for training, simulation, and review

- `dashboard/`  
  static dashboard that can run from local CSV **or** from the Apps Script endpoint

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

### Insight metrics
- study vs session ratio
- external vs internal sessions
- most used mode
- training vs simulation split
- predicted vs actual score fields for later comparison

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

You do **not** need a separate repo just for the dashboard.
You can deploy the subfolder:
- `SPHERE-I-SCIENCE / 📚 S7 / S7-R1 / dashboard`

In Vercel:
- import the repo `K-RnD-Lab/SPHERE-I-SCIENCE`
- set `Root Directory` to the `dashboard` folder inside `S7-R1`
- keep it as a static project
- update `config.js` with the real Apps Script URL

---

## Looker Studio or built-in dashboard?

### Built-in dashboard
Best for:
- quick live check
- simple public status page
- direct Vercel publishing
- low maintenance

### Looker Studio
Best for:
- prettier stakeholder-facing reporting
- more polished charts
- separate public report link

Recommendation:
- start with the built-in dashboard
- add Looker later only if you want a cleaner public report layer

---

## Exam-format note

For EVI / TZNK / English and the usual IT admission test flow, the official prep materials and demos are test-format based rather than essay-style open responses. I would still treat the yearly official characteristics and demo materials as the final source of truth for the exact structure.

Official entry points:
- [UCEQA 2026 overview](https://testportal.gov.ua/osnovne-pro-yevi-yefvv-2026/)
- [UCEQA preparation hub](https://testportal.gov.ua/pidgotovka-yefvv-yevi/)
- [TZNK demo PDF](https://testportal.gov.ua/wp-content/uploads/2024/04/TZNK_maket_sajt_2024_03_29_merged.pdf)
- [English demo](https://lv.testportal.gov.ua/testmktEnglish/)

---

## Suggested next step

1. create the Google Sheet tabs
2. deploy the Apps Script endpoint
3. paste the endpoint URL into `dashboard/config.js`
4. deploy the dashboard on Vercel
5. start logging sessions immediately
