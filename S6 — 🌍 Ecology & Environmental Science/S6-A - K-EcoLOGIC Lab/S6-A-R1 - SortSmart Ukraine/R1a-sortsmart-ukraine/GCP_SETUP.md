# GCP Setup For SortSmart Ukraine

This guide covers the minimum cloud setup needed for the `K-EcoLOGIC Lab: SortSmart Ukraine` project.

## Recommended Path

Use a small dedicated GCP project with BigQuery enabled.

Recommended project style:

- one dedicated project for this work
- one service account for local development
- one budget with alerts
- EU location for BigQuery

This project should stay within the free or near-zero range if we keep the dataset small.

## Billing Or Sandbox

Two valid paths:

- easiest: attach billing to the new project and add a tiny budget alert
- strict free path: use BigQuery Sandbox without billing

For this project, I recommend billing enabled plus a tiny budget because it reduces friction and should still stay at zero or near zero cost for a small student project.

## What You Need To Create

1. A GCP project
2. BigQuery API enabled
3. A service account key for local execution
4. Environment variables for local runs
5. A BigQuery dataset bootstrap run

## Suggested Names

- GCP project name: `K-EcoLOGIC Lab`
- GCP project id: something like `k-ecologic-lab-2026`
- service account name: `sortsmart-bq`

## Console Steps

### 1. Create the project

- Open Google Cloud Console
- Create a new project
- Name it `K-EcoLOGIC Lab`
- Save the project id

### 2. Set a budget

- Open Billing
- Create a budget for the new project
- Set a very small alert threshold
- Recommended: 50%, 90%, and 100% alerts on a tiny monthly budget

### 3. Enable APIs

Enable:

- BigQuery API
- IAM API

Optional later:

- Cloud Resource Manager API

### 4. Create a service account

- Go to IAM & Admin -> Service Accounts
- Create service account
- Name: `sortsmart-bq`

### 5. Grant roles

Grant this service account:

- `BigQuery Admin`
- `BigQuery Job User`

### 6. Create a JSON key

- Open the new service account
- Keys -> Add key -> Create new key -> JSON
- Save the JSON locally in a safe place

Recommended local path:

- `C:\Users\kolisnyk.o\.secrets\sortsmart-bq.json`

## Local Environment Variables

In PowerShell:

```powershell
$env:GOOGLE_CLOUD_PROJECT = "your-project-id"
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\kolisnyk.o\.secrets\sortsmart-bq.json"
```

Optional:

```powershell
$env:BQ_DATASET = "sortsmart_raw"
$env:BQ_LOCATION = "EU"
```

## First Cloud Validation

After the local pipeline succeeds, the easiest path is:

```powershell
.\setup_bigquery.ps1 -ProjectId "your-project-id" -KeyFile "C:\Users\kolisnyk.o\.secrets\sortsmart-bq.json"
```

Optional flags:

- `-Dataset "sortsmart_raw"`
- `-Location "EU"`

If you want to run each step manually, bootstrap the BigQuery dataset with:

```powershell
python -m sortsmart_ukraine.warehouse.bootstrap_bigquery
```

Then validate the cloud load path:

```powershell
python -m sortsmart_ukraine.warehouse.load_bigquery
```

Then set up dbt:

1. Copy `dbt/profiles.example.yml`
2. Save it as `C:\Users\kolisnyk.o\.dbt\profiles.yml`
3. Replace:
   - `your-project-id`
   - dataset if you want something other than `sortsmart_raw`
   - keyfile path if you saved the JSON somewhere else

Then run:

```powershell
dbt debug --project-dir dbt
dbt seed --project-dir dbt
dbt run --project-dir dbt
```

## Minimal Values To Send Back To Codex

After setup, send:

- project id
- whether billing is enabled
- whether the JSON key is saved
- whether local env vars are set

Do not paste the private key contents.
