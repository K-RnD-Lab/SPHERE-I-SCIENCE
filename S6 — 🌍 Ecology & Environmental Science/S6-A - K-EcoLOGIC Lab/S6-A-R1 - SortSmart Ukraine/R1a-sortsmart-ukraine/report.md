# Report - K-EcoLOGIC Lab: SortSmart Ukraine

## Summary

SortSmart Ukraine is a nationwide environmental data project focused on waste sorting readiness, recovery potential, and modeled climate impact across Ukraine.

The project combines official open data on waste generation and management, official waste-facility registry data, and transparent material-recovery assumptions to build a region-level analytical model.

## Problem

Ukraine has a long-standing mixed-waste problem. Public sorting habits remain inconsistent, visible infrastructure is fragmented, and decision-makers often lack a single analytical layer that connects:

- waste generation
- recovery performance
- landfill dependence
- available facilities
- realistic material-priority opportunities

## Research Question

Which Ukrainian regions show the strongest and weakest waste-sorting readiness, where is the largest recovery gap, and what modeled climate benefit could be unlocked by improving diversion from landfill?

## Data Sources

Primary sources currently included:

1. `data.gov.ua` waste generation and management workbook
2. `data.gov.ua` waste-facility registry workbook
3. `data.gov.ua` air-quality package metadata and latest monthly files
4. local material-factor assumptions used only for scenario modeling

## Pipeline

The implemented pipeline follows this flow:

1. download raw state datasets
2. normalize region names into a shared oblast key
3. build normalized tables for waste metrics and facility counts
4. calculate readiness and recovery-gap marts
5. render a dashboard for story-level interpretation

## Core Outputs

The current mart exposes:

- `sorting_readiness_score`
- `recovery_rate`
- `landfill_rate`
- `modeled_recyclable_potential_thsd_t`
- `recovery_gap_thsd_t`
- `climate_impact_potential_t_co2e`
- `priority_material`

## Why It Matters

This is not just a passive awareness dashboard. It is designed as an action-support layer for:

- identifying the biggest infrastructure gaps
- prioritizing the most meaningful material streams
- framing region-level waste interventions
- supporting activism and public-interest reporting with current open data

## Current Limitations

- the climate-impact layer is modeled, not directly measured
- some official workbooks may drift in schema and require parser updates
- air-quality data is currently a context layer rather than the primary scoring engine

## Next Steps

1. run the pipeline against the local environment
2. validate the parsed tables
3. load the results into BigQuery
4. run dbt models
5. capture dashboard screenshots
6. submit the project and complete peer reviews
