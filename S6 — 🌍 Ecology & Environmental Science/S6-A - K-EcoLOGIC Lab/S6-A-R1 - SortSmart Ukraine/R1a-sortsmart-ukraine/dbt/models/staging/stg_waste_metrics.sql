select
  region_key,
  region_label,
  cast(year as int64) as year,
  metric_code,
  metric_name_en,
  cast(metric_value_total_thsd_t as float64) as metric_value_total_thsd_t,
  cast(metric_value_hazardous_thsd_t as float64) as metric_value_hazardous_thsd_t
from {{ source('sortsmart_raw', 'waste_metrics') }}
where region_key is not null
