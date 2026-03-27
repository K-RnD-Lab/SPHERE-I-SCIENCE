# Google Sheet Setup

## 1. Create one spreadsheet

Recommended file name:
`S7-R1 Master Prep Analytics`

Create these tabs exactly:
- `Resources`
- `StudyLog`
- `SessionLog`

## 2. Paste the template headers

### Resources
Use the contents of:
- `data/resource_catalog.csv`

### StudyLog
Use the contents of:
- `data/study_log_template.csv`

### SessionLog
Use the contents of:
- `data/session_log_template.csv`

## 3. Deploy Apps Script

1. Open the Sheet.
2. Go to `Extensions -> Apps Script`.
3. Replace the default code with `integrations/google-apps-script/Code.gs`.
4. Click `Deploy -> New deployment`.
5. Type: `Web app`.
6. Execute as: `Me`.
7. Access: `Anyone with the link`.
8. Copy the `/exec` URL.

## 4. Connect dashboard config

Open:
- `dashboard/config.js`

Replace:
- `dataEndpoint`
- `googleSheet`
- `appsScript`
- `liveDashboard`
- `lookerStudio`

If `dataEndpoint` is empty, the dashboard falls back to local CSV files.

## 5. Recommended logging rules

### StudyLog rows
Use for:
- theory review
- concept learning
- reading official program PDFs
- reviewing explanatory sources

### SessionLog rows
Use for:
- trainer sessions
- simulation sessions
- external platform practice
- review sessions after mistakes

## 6. Best starter workflow

- Keep Google Sheet as the live source of truth.
- Use Vercel to publish the dashboard.
- Use Looker Studio only if you want a more polished public reporting layer.
- Push CSV snapshots or report updates to GitHub only when you want a research checkpoint.
