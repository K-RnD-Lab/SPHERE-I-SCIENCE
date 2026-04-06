select
  region_key,
  cast(facility_count as float64) as facility_count,
  cast(unique_facility_types as float64) as unique_facility_types
from {{ source('sortsmart_raw', 'waste_facility_counts') }}
