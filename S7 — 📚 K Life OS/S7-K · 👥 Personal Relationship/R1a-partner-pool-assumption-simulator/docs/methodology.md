# Methodology

## Model Type

This is an assumption simulator, not a predictive dating model.

The first version uses multiplicative filters:

```text
estimated_pool = baseline_population
  * age_factor
  * region_factor
  * relationship_status_factor
  * height_factor
  * income_factor
  * education_factor
```

## Output Format

The app should always return a range:

- conservative
- central
- optimistic

The range represents data uncertainty and coefficient instability, not a probability of relationship success.

## Data Labels

Each model input should be labeled as one of:

- `official`
- `administrative`
- `estimated`
- `proxy`
- `demo_assumption`

Current prototype values are `demo_assumption`.

## Ethical Constraints

The app must not:

- rank people as high or low value
- shame criteria or preferences
- imply that demographic filters determine romantic outcomes
- market paid products through scarcity panic
- hide data sources or assumptions

The app should:

- expose sources and confidence levels
- show uncertainty
- explain the biggest narrowing factors
- separate demographic availability from compatibility and mutual interest

## Next Method Work

1. Replace demo population baseline with sourced population estimates.
2. Replace relationship-status factors with age-adjusted distributions.
3. Replace income factors with sourced salary or income bands.
4. Replace height factors with Ukraine-specific data or a clearly labeled proxy.
5. Add source-level confidence labels to the UI.
6. Add scenario comparison for relaxed vs strict criteria.
