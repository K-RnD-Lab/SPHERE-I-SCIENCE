# R1a Partner Pool Assumption Simulator Report

## Summary

This report tracks the research basis for a transparent partner-pool simulator. The current version defines the problem, ethical boundary, candidate data sources, and prototype model structure.

## Current Finding

The strongest first version should avoid claiming a precise count of eligible partners. It should present a range:

- conservative estimate
- central estimate
- optimistic estimate

This is necessary because Ukrainian demographic data is affected by migration, war displacement, incomplete income reporting, changing household structure, and limited current anthropometric distributions.

## Method Principle

The simulator should estimate:

```text
reachable demographic pool
= baseline population
  x age filter
  x region filter
  x relationship-status filter
  x height filter
  x income filter
  x education filter
  x data-quality adjustment
```

## Known Limitations

- Official population counts may lag current mobility and displacement.
- Relationship status is not the same as real availability.
- Income data is noisy because of informal work, self-employment, and underreporting.
- Height distributions likely require proxy datasets.
- Mutual attraction, values, safety, social networks, and chance are outside this model.

## Next Evidence Tasks

- Validate population by age and sex from current Ukrainian demographic sources.
- Identify a defensible relationship-status distribution by age band.
- Identify salary/income distributions usable for scenario modeling.
- Decide whether height uses Ukraine-specific data or a proxy with low-confidence labeling.
- Document all assumptions in `data/sources.yml` and `docs/methodology.md`.
