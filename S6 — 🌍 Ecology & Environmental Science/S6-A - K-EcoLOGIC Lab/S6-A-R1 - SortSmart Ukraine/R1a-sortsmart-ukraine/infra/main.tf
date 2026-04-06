terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

resource "google_bigquery_dataset" "raw" {
  dataset_id                 = "sortsmart_raw"
  friendly_name              = "SortSmart raw data"
  description                = "Raw tables for SortSmart Ukraine"
  location                   = var.bq_location
  delete_contents_on_destroy = true
}

resource "google_bigquery_dataset" "analytics" {
  dataset_id                 = "sortsmart_analytics"
  friendly_name              = "SortSmart analytics"
  description                = "Analytics tables for SortSmart Ukraine"
  location                   = var.bq_location
  delete_contents_on_destroy = true
}
