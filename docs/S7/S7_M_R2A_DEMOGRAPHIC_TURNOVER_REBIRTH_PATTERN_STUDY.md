# S7-M-R2a Demographic Turnover And Rebirth-Pattern Study

## Research identity

- Sphere: `S7 K Life OS`
- Lane: `S7-M Longitudinal Reviews & Life Wheel Synthesis`
- Combination: `S+T`
- Status: active exploratory study with reproducible data pipeline
- Evidence window: reconstructed population from 1 CE; annual global demographic flows from 1950 to 2023

## Abstract

This study asks whether long-run births and deaths contain repeatable patterns that could explain the intuitive idea of human "renewal" or "rebirth". It separates three claims that must not be mixed:

1. demographic renewal: births and deaths continuously replace population members;
2. statistical synchronization: aggregate births and deaths may co-move or show lagged relationships;
3. literal reincarnation: personal identity or memory transfers from a deceased person to a newborn.

The first two claims are measurable with population data. The third is not testable with aggregate demography. Preliminary results show a clear demographic transition, not a fixed mystical cycle: fertility fell, life expectancy rose, and natural increase slowed. Lagged correlations in the levels are dominated by trends and population age structure; correlations of annual changes are weaker and unstable. The current evidence therefore supports demographic turnover as a measurable process but does not support identity-level reincarnation.

## Research questions

- `RQ1` How did world population change from 1 CE to the present?
- `RQ2` How did annual births, deaths, natural increase, and total turnover change from 1950 to 2023?
- `RQ3` Do births and deaths show stable synchronous or lagged relationships?
- `RQ4` Are apparent relationships preserved after removing common trends through first differences?
- `RQ5` Can any aggregate pattern distinguish reincarnation from ordinary demographic mechanisms?
- `RQ6` What study design would be needed to test individual past-life claims without information leakage?

## Claim ladder

| Level | Claim | Testable here? | Evidence needed |
|---|---|---:|---|
| L1 | people are continuously born and die | yes | annual birth and death counts |
| L2 | demographic renewal changes over time | yes | ratios, rates, fertility, mortality, age structure |
| L3 | births and deaths have lagged statistical association | exploratory | detrended time-series tests and robustness checks |
| L4 | a death causes a later birth | no causal test here | identified causal mechanism and controls |
| L5 | identity or memory transfers between people | no | prospective, blinded individual-level evidence |

## Data and provenance

### Long-run population

The population line from 1 CE is a historical reconstruction. Before modern censuses, values are model-based estimates assembled from sparse historical and archaeological evidence. They are useful for scale and era comparison, not precise annual inference.

### Modern demographic flows

Annual births, deaths, fertility, population, and life expectancy for 1950-2023 are drawn from UN World Population Prospects 2024 through reproducible OWID endpoints. UN estimates combine censuses, vital registration, surveys, indirect estimation, and probabilistic demographic models. They are estimates with varying uncertainty, not a single perfect global register.

## Derived metrics

For year `t`:

```text
natural increase(t) = births(t) - deaths(t)
turnover(t) = births(t) + deaths(t)
birth-death ratio(t) = births(t) / deaths(t)
natural increase rate(t) = natural increase(t) / population(t) * 1000
turnover rate(t) = turnover(t) / population(t) * 1000
```

The birth-death ratio is a population-flow measure. It is not a probability of reincarnation and does not pair one birth with one death.

## Analytical design

### A. Descriptive periodization

- long-run scale: 1 CE, 1000, 1500, 1800, 1900, 1950, 2000, 2023;
- modern flow: annual 1950-2023 series;
- transition context: fertility and life expectancy;
- shock review: war, epidemics, and other mortality disruptions.

### B. Lag scan

For lags from -20 to +20 years, the pipeline computes Pearson correlations between births in year `t` and deaths in year `t + lag`.

Two versions are retained:

- correlation of levels, which is vulnerable to shared trends and autocorrelation;
- correlation of first differences, which compares year-to-year changes and removes much of the trend.

This is an exploratory scan, not a hypothesis-confirming test. Searching many lags increases the chance of finding an apparently impressive coefficient.

## Preliminary quantitative findings

### 1. The world is in a demographic transition, not a stable cycle

| Metric | Earlier point | Later point | Interpretation |
|---|---:|---:|---|
| fertility | 4.85 births per woman in 1950 | 2.25 in 2023 | large decline in family-size rates |
| life expectancy | 46.4 years in 1950 | 73.2 in 2023 | longer survival changes the timing of deaths |
| births | 91.8 million in 1950 | 132.1 million in 2023 | absolute births rose with population, then plateaued |
| deaths | 48.5 million in 1950 | 61.7 million in 2023 | absolute deaths reflect population size, ageing, and shocks |
| natural increase rate | 17.4 per 1,000 in 1950 | 8.7 in 2023 | population renewal is slowing relative to population size |
| turnover rate | 56.3 per 1,000 in 1950 | 23.9 in 2023 | annual entry-plus-exit flow fell substantially per capita |

Observed extrema in the 1950-2023 series:

- births peak: approximately 146.1 million in 2012;
- deaths peak: approximately 69.7 million in 2021, consistent with a pandemic-era mortality shock;
- absolute natural increase peak: approximately 93.7 million in 1990;
- birth-death ratio peak: about 2.90 in 1987;
- natural increase rate peak: about 22.8 per 1,000 in 1963;
- lowest natural increase rate in this window: about 8.0 per 1,000 in 2021.

### 2. The strongest raw lag is not evidence of a hidden cycle

The largest absolute correlation in the level series occurs around a +12-year lag (`r ~= 0.74`). At the same lag, the correlation of annual changes is approximately `0.04`.

At lag zero:

- levels: `r ~= 0.50`;
- annual changes: `r ~= -0.24`.

The contrast matters. Smooth trending series can correlate because both are shaped by population size and age structure. When the trend is reduced, the apparently strong lag largely disappears. This result does not identify a periodic birth-after-death mechanism.

### 3. One-to-one matching is mathematically unsupported

Births exceeded deaths in every year of the analyzed global series. In 2023 there were about 2.14 births per death. A literal one-death/one-birth interpretation cannot explain the aggregate counts without adding unmeasured assumptions that make the claim unfalsifiable.

## What the data can explain naturally

Apparent birth-death relationships can emerge from:

- cohort size: a large birth cohort later creates a large older population;
- fertility transition: births fall as education, health, urbanization, and reproductive behavior change;
- mortality transition: deaths shift to older ages as survival improves;
- age structure: absolute deaths can rise even while age-specific mortality improves;
- shocks: pandemics, wars, famines, and disasters affect particular years;
- statistical construction: globally aggregated estimates smooth diverse countries and uncertainties.

## Reincarnation evidence review

A 2022 scoping review identified 78 academic studies of claimed past-life memories. Most were observational: 84% focused on children, 60% used case-report designs, and interviews were used in 73%. Such work can catalogue unusual reports, but retrospective case selection cannot by itself rule out cultural transmission, information leakage, selective reporting, interviewer effects, coincidence, or publication bias.

This study therefore uses the classification:

- `demographic renewal`: supported and measurable;
- `unexplained individual report`: possible research object;
- `literal reincarnation`: not established by current aggregate or case-report evidence.

## Prospective protocol for a serious identity-level test

If the literal claim is studied later, the protocol should include:

1. preregistration before candidate matching;
2. timestamped recording of every original statement, including errors and vague claims;
3. no hypnosis or guided regression as evidentiary input;
4. an interviewer who does not know candidate deceased persons;
5. a separate search team that never meets the claimant;
6. a blinded matching panel receiving several plausible decoys;
7. a predefined scoring rule based on information specificity and base rates;
8. explicit audits of family, media, geographic, and digital information leakage;
9. inclusion of negative cases and failed matches;
10. cross-cultural replication by independent teams.

Without these safeguards, a compelling story remains a story rather than a discriminating test.

## Visual outputs

- [Long-run world population](./figures/world-population-long-run.svg)
- [Annual births and deaths](./figures/world-births-deaths-1950-2023.svg)
- [Birth-to-death ratio](./figures/world-birth-death-ratio-1950-2023.svg)
- [Net natural increase](./figures/world-net-natural-increase-1950-2023.svg)
- [Fertility transition](./figures/world-fertility-1950-2023.svg)
- [Life expectancy transition](./figures/world-life-expectancy-1950-2023.svg)
- [Lag-correlation scan](./figures/birth-death-lag-correlations.svg)

## Reproducible data

- [Annual birth/death metrics](./data/world_births_deaths_annual.csv)
- [Birth/death milestones](./data/world_births_deaths_milestones.csv)
- [Demographic transition milestones](./data/world_demographic_transition_milestones.csv)
- [Lag-correlation results](./data/birth_death_lag_correlations.csv)
- [Long-run population milestones](./data/world_population_milestones.csv)

Regenerate:

```powershell
node tools/build_population_pollution_visuals.mjs
```

## Limitations

- pre-modern population values are reconstructions;
- global aggregation hides country and regional heterogeneity;
- annual UN series contain modelled values and uncertainty;
- Pearson lag scans do not account fully for autocorrelation, age structure, or multiple testing;
- ecological correlation cannot infer individual identity;
- the current pipeline does not yet estimate confidence intervals or formal change points.

## Conclusion

The data support a strong, scientifically useful idea of human renewal: populations are continuously reconstructed by births and deaths, and the balance changes through the demographic transition. They do not reveal a stable numerical law linking a particular death to a later birth. Literal reincarnation remains a separate metaphysical and individual-level empirical claim, not a conclusion available from population totals.

## Next analytical phase

- decompose results by world region and development group;
- add age-standardized mortality and age-structure measures;
- estimate change points with uncertainty;
- test lag stability across rolling windows;
- compare observed lag patterns with simulated demographic null models;
- preregister any future individual-level study before collecting cases.
