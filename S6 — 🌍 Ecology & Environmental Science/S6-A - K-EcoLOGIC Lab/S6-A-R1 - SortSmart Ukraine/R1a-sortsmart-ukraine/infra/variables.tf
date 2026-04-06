variable "gcp_project_id" {
  type        = string
  description = "GCP project id"
}

variable "gcp_region" {
  type        = string
  description = "Default GCP region"
  default     = "europe-west3"
}

variable "bq_location" {
  type        = string
  description = "BigQuery dataset location"
  default     = "EU"
}
