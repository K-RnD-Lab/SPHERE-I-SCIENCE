with latest_year as (
    select max(year) as year
    from {{ ref('stg_waste_metrics') }}
),

latest as (
    select *
    from {{ ref('stg_waste_metrics') }}
    where year = (select year from latest_year)
),

wide as (
    select
        region_key,
        any_value(region_label) as region_label,
        max(case when metric_name_en = 'generated' then metric_value_total_thsd_t end) as generated,
        max(case when metric_name_en = 'recovery' then metric_value_total_thsd_t end) as recovery,
        max(case when metric_name_en = 'incinerated' then metric_value_total_thsd_t end) as incinerated,
        max(case when metric_name_en = 'disposal_on_landfills' then metric_value_total_thsd_t end) as disposal_on_landfills,
        max(case when metric_name_en = 'accumulated_on_landfills' then metric_value_total_thsd_t end) as accumulated_on_landfills
    from latest
    group by 1
),

material_factors as (
    select
        sum(share_of_msw * recyclable_share) as recyclable_share,
        sum(share_of_msw * recyclable_share * co2e_avoided_t_per_t_recycled)
            / nullif(sum(share_of_msw * recyclable_share), 0) as weighted_avoided_factor
    from {{ ref('material_factors') }}
),

joined as (
    select
        o.region_key,
        o.oblast_name_uk,
        o.oblast_name_en,
        l.year,
        coalesce(w.generated, 0) as generated,
        coalesce(w.recovery, 0) as recovery,
        coalesce(w.incinerated, 0) as incinerated,
        coalesce(w.disposal_on_landfills, 0) as disposal_on_landfills,
        coalesce(w.accumulated_on_landfills, 0) as accumulated_on_landfills,
        coalesce(f.facility_count, 0) as facility_count,
        coalesce(f.unique_facility_types, 0) as unique_facility_types,
        m.recyclable_share,
        m.weighted_avoided_factor
    from {{ ref('oblast_reference') }} as o
    cross join latest_year as l
    left join wide as w using (region_key)
    left join {{ ref('stg_waste_facility_counts') }} as f using (region_key)
    cross join material_factors as m
),

scored as (
    select
        *,
        safe_divide(recovery, nullif(generated, 0)) as recovery_rate,
        safe_divide(disposal_on_landfills, nullif(generated, 0)) as landfill_rate,
        generated * recyclable_share as modeled_recyclable_potential_thsd_t
    from joined
),

final as (
    select
        year,
        region_key,
        oblast_name_uk,
        oblast_name_en,
        generated,
        recovery,
        incinerated,
        disposal_on_landfills,
        accumulated_on_landfills,
        facility_count,
        unique_facility_types,
        recovery_rate,
        landfill_rate,
        modeled_recyclable_potential_thsd_t,
        greatest(modeled_recyclable_potential_thsd_t - recovery, 0) as recovery_gap_thsd_t,
        greatest(modeled_recyclable_potential_thsd_t - recovery, 0) * 1000 * weighted_avoided_factor as climate_impact_potential_t_co2e,
        round(
            100 * (
                0.45 * least(greatest(safe_divide(recovery_rate, 0.35), 0), 1) +
                0.30 * safe_divide(facility_count, nullif(max(facility_count) over (), 0)) +
                0.25 * (1 - least(greatest(landfill_rate, 0), 1))
            ),
            1
        ) as sorting_readiness_score
    from scored
)

select *
from final
