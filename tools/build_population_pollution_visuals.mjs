import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const urls = {
  population: "https://ourworldindata.org/grapher/population.csv?csvType=full&useColumnShortNames=false",
  births: "https://ourworldindata.org/grapher/annual-number-of-births-by-world-region.csv?csvType=full&useColumnShortNames=false",
  deaths: "https://ourworldindata.org/grapher/annual-number-of-deaths-by-world-region.csv?csvType=full&useColumnShortNames=false",
  fertility: "https://ourworldindata.org/grapher/children-born-per-woman.csv?csvType=full&useColumnShortNames=false",
  lifeExpectancy: "https://ourworldindata.org/grapher/life-expectancy-unwpp.csv?csvType=full&useColumnShortNames=false",
  co2: "https://ourworldindata.org/grapher/annual-co2-emissions-per-country.csv?csvType=full&useColumnShortNames=false",
  pm25: "https://ourworldindata.org/grapher/average-exposure-pm25-pollution.csv?csvType=full&useColumnShortNames=false",
  safeWater: "https://ourworldindata.org/grapher/proportion-using-safely-managed-drinking-water.csv?csvType=full&useColumnShortNames=false",
  safeSanitation: "https://ourworldindata.org/grapher/share-using-safely-managed-sanitation.csv?csvType=full&useColumnShortNames=false",
  pesticides: "https://ourworldindata.org/grapher/pesticide-use-per-hectare-of-cropland.csv?csvType=full&useColumnShortNames=false",
  fertilizers: "https://ourworldindata.org/grapher/fertilizer-use-per-hectare-of-cropland.csv?csvType=full&useColumnShortNames=false",
  waterStress: "https://ourworldindata.org/grapher/freshwater-withdrawals-as-a-share-of-internal-resources.csv?csvType=full&useColumnShortNames=false",
};

const out = {
  demographyData: path.join(root, "docs", "S7", "data"),
  demographyFigures: path.join(root, "docs", "S7", "figures"),
  pollutionData: path.join(root, "docs", "S6", "data"),
  pollutionFigures: path.join(root, "docs", "S6", "figures"),
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"' && quoted && next === '"') {
      cell += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

async function fetchCsv(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "K-RnD-Lab research data fetch/1.0" },
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return parseCsv(await res.text());
}

async function fetchWorldBank(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "K-RnD-Lab research data fetch/1.0" },
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  const payload = await res.json();
  return (payload[1] ?? [])
    .filter((d) => d.value !== null)
    .map((d) => ({
      entity: d.countryiso3code === "UKR" ? "Ukraine" : "World",
      year: Number(d.date),
      value: Number(d.value),
    }))
    .sort((a, b) => a.year - b.year);
}

function n(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pick(rows, entity, valueField, years = null) {
  return rows
    .filter((d) => d.Entity === entity && n(d[valueField]) !== null && (!years || years.has(n(d.Year))))
    .map((d) => ({ year: n(d.Year), value: n(d[valueField]) }))
    .sort((a, b) => a.year - b.year);
}

function findValueField(rows, patterns) {
  const fields = Object.keys(rows[0] ?? {}).filter((key) => !["Entity", "Code", "Year"].includes(key));
  const match = fields.find((field) => patterns.some((pattern) => pattern.test(field)));
  if (!match) throw new Error(`No value field matched ${patterns.join(", ")}. Available: ${fields.join(" | ")}`);
  return match;
}

function joinBirthDeath(births, deaths) {
  const deathMap = new Map(deaths.map((d) => [d.year, d.value]));
  return births
    .filter((d) => deathMap.has(d.year))
    .map((d) => {
      const deathsValue = deathMap.get(d.year);
      return {
        year: d.year,
        births: d.value,
        deaths: deathsValue,
        net: d.value - deathsValue,
        turnover: d.value + deathsValue,
        birth_death_ratio: d.value / deathsValue,
      };
    });
}

function joinByYear(left, right, leftKey, rightKey) {
  const rightMap = new Map(right.map((d) => [d.year, d.value]));
  return left
    .filter((d) => rightMap.has(d.year))
    .map((d) => ({ year: d.year, [leftKey]: d.value, [rightKey]: rightMap.get(d.year) }));
}

function pearson(xs, ys) {
  if (xs.length !== ys.length || xs.length < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let numerator = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    numerator += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  return dx2 && dy2 ? numerator / Math.sqrt(dx2 * dy2) : null;
}

function lagCorrelations(rows, minLag = -20, maxLag = 20) {
  const byYear = new Map(rows.map((d) => [d.year, d]));
  const changes = new Map();
  for (const row of rows) {
    const previous = byYear.get(row.year - 1);
    if (previous) changes.set(row.year, { births: row.births - previous.births, deaths: row.deaths - previous.deaths });
  }
  const output = [];
  for (let lag = minLag; lag <= maxLag; lag++) {
    const levelPairs = rows
      .map((d) => [d.births, byYear.get(d.year + lag)?.deaths])
      .filter(([, death]) => death !== undefined);
    const changePairs = [...changes.entries()]
      .map(([year, d]) => [d.births, changes.get(year + lag)?.deaths])
      .filter(([, death]) => death !== undefined);
    output.push({
      lag,
      level_correlation: pearson(levelPairs.map((d) => d[0]), levelPairs.map((d) => d[1])),
      change_correlation: pearson(changePairs.map((d) => d[0]), changePairs.map((d) => d[1])),
      level_n: levelPairs.length,
      change_n: changePairs.length,
    });
  }
  return output;
}

function csv(rows, columns) {
  return [columns.join(","), ...rows.map((r) => columns.map((c) => r[c]).join(","))].join("\n") + "\n";
}

function fmt(value) {
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(value >= 10e9 ? 0 : 1)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(value >= 10e6 ? 0 : 1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(value >= 10e3 ? 0 : 1)}k`;
  return `${Math.round(value * 10) / 10}`;
}

function lineSvg({ title, subtitle, series, width = 960, height = 520, yLabel = "", logY = false, note = "" }) {
  series = series.filter((item) => item.values.length > 0);
  if (!series.length) throw new Error(`No chart data available for: ${title}`);
  const margin = { top: 58, right: 36, bottom: 58, left: 86 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const all = series.flatMap((s) => s.values);
  const minX = Math.min(...all.map((d) => d.year));
  const maxX = Math.max(...all.map((d) => d.year));
  const rawMinY = Math.min(...all.map((d) => d.value).filter((v) => v > 0 || !logY));
  const rawMaxY = Math.max(...all.map((d) => d.value));
  const yMin = logY ? Math.log10(Math.max(rawMinY, 1)) : Math.min(0, rawMinY);
  const yMax = logY ? Math.log10(rawMaxY) : rawMaxY;
  const x = (year) => margin.left + ((year - minX) / (maxX - minX)) * plotW;
  const y = (value) => {
    const v = logY ? Math.log10(Math.max(value, 1)) : value;
    return margin.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
  };
  const colors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea"];
  const xTicks = Array.from(new Set([minX, 1, 1000, 1500, 1800, 1900, 1950, 2000, maxX].filter((v) => v >= minX && v <= maxX)));
  const yTicks = logY
    ? [1e8, 5e8, 1e9, 2e9, 4e9, 8e9].filter((v) => v >= rawMinY && v <= rawMaxY)
    : [0, rawMaxY * 0.25, rawMaxY * 0.5, rawMaxY * 0.75, rawMaxY];
  const paths = series.map((s, i) => {
    const d = s.values.map((p, idx) => `${idx ? "L" : "M"}${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
    const last = s.values.at(-1);
    return `<path d="${d}" fill="none" stroke="${colors[i % colors.length]}" stroke-width="3"/><text x="${x(last.year) - 8}" y="${y(last.value) - 8}" text-anchor="end" font-size="13" fill="${colors[i % colors.length]}">${s.name}: ${fmt(last.value)}</text>`;
  }).join("\n");
  const grid = yTicks.map((t) => `<line x1="${margin.left}" x2="${width - margin.right}" y1="${y(t)}" y2="${y(t)}" stroke="#d4d4d8" stroke-width="1"/><text x="${margin.left - 10}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="#52525b">${fmt(t)}</text>`).join("\n");
  const xt = xTicks.map((t) => `<line x1="${x(t)}" x2="${x(t)}" y1="${height - margin.bottom}" y2="${height - margin.bottom + 6}" stroke="#71717a"/><text x="${x(t)}" y="${height - margin.bottom + 24}" text-anchor="middle" font-size="12" fill="#52525b">${t < 0 ? `${Math.abs(t)} BCE` : t}</text>`).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
<rect width="100%" height="100%" fill="#fafafa"/>
<text x="${margin.left}" y="30" font-size="23" font-weight="700" fill="#111827">${title}</text>
<text x="${margin.left}" y="52" font-size="13" fill="#52525b">${subtitle}</text>
${grid}
<line x1="${margin.left}" x2="${width - margin.right}" y1="${height - margin.bottom}" y2="${height - margin.bottom}" stroke="#71717a"/>
<line x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${height - margin.bottom}" stroke="#71717a"/>
${xt}
<text x="${margin.left}" y="${margin.top - 12}" font-size="12" fill="#52525b">${yLabel}</text>
${paths}
${note ? `<text x="${margin.left}" y="${height - 16}" font-size="12" fill="#71717a">${note}</text>` : ""}
</svg>\n`;
}

function barSvg({ title, subtitle, rows, keys, width = 960, height = 520, yLabel = "", note = "" }) {
  const margin = { top: 62, right: 30, bottom: 72, left: 86 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const maxY = Math.max(...rows.flatMap((r) => keys.map((k) => r[k])));
  const xBand = plotW / rows.length;
  const barW = xBand / (keys.length + 1.4);
  const y = (v) => margin.top + plotH - (v / (maxY || 1)) * plotH;
  const colors = ["#2563eb", "#dc2626", "#16a34a"];
  const yTicks = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];
  const grid = yTicks.map((t) => `<line x1="${margin.left}" x2="${width - margin.right}" y1="${y(t)}" y2="${y(t)}" stroke="#d4d4d8"/><text x="${margin.left - 10}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="#52525b">${fmt(t)}</text>`).join("\n");
  const bars = rows.map((r, i) => keys.map((k, j) => {
    const x = margin.left + i * xBand + j * barW + barW * 0.7;
    return `<rect x="${x}" y="${y(r[k])}" width="${barW}" height="${height - margin.bottom - y(r[k])}" fill="${colors[j]}"><title>${r.year} ${k}: ${fmt(r[k])}</title></rect>`;
  }).join("\n") + `<text x="${margin.left + i * xBand + xBand / 2}" y="${height - margin.bottom + 23}" text-anchor="middle" font-size="12" fill="#52525b">${r.year}</text>`).join("\n");
  const legend = keys.map((k, i) => `<rect x="${margin.left + i * 155}" y="${height - 34}" width="12" height="12" fill="${colors[i]}"/><text x="${margin.left + i * 155 + 18}" y="${height - 23}" font-size="12" fill="#374151">${k}</text>`).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
<rect width="100%" height="100%" fill="#fafafa"/>
<text x="${margin.left}" y="30" font-size="23" font-weight="700" fill="#111827">${title}</text>
<text x="${margin.left}" y="52" font-size="13" fill="#52525b">${subtitle}</text>
${grid}
<line x1="${margin.left}" x2="${width - margin.right}" y1="${height - margin.bottom}" y2="${height - margin.bottom}" stroke="#71717a"/>
<line x1="${margin.left}" x2="${margin.left}" y1="${margin.top}" y2="${height - margin.bottom}" stroke="#71717a"/>
<text x="${margin.left}" y="${margin.top - 12}" font-size="12" fill="#52525b">${yLabel}</text>
${bars}
${legend}
${note ? `<text x="${margin.left}" y="${height - 8}" font-size="12" fill="#71717a">${note}</text>` : ""}
</svg>\n`;
}

async function legacyMain() {
  for (const dir of Object.values(out)) await mkdir(dir, { recursive: true });
  const [populationRows, birthRows, deathRows, co2Rows, pm25Rows] = await Promise.all(Object.values(urls).map(fetchCsv));

  const longYears = new Set([1, 1000, 1500, 1800, 1900, 1950, 2000, 2023]);
  const worldPopulation = pick(populationRows, "World", "Population", longYears);
  const worldBirthsDeaths = joinBirthDeath(pick(birthRows, "World", "Births"), pick(deathRows, "World", "Deaths"));
  const milestoneYears = new Set([1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2023]);
  const birthDeathMilestones = worldBirthsDeaths.filter((d) => milestoneYears.has(d.year));

  await writeFile(path.join(out.demographyData, "world_population_milestones.csv"), csv(worldPopulation, ["year", "value"]));
  await writeFile(path.join(out.demographyData, "world_births_deaths_milestones.csv"), csv(birthDeathMilestones, ["year", "births", "deaths", "net"]));
  await writeFile(path.join(out.demographyFigures, "world-population-long-run.svg"), lineSvg({
    title: "World population long-run baseline",
    subtitle: "Selected milestones from OWID population series; early years are historical reconstructions, not census counts.",
    series: [{ name: "Population", values: worldPopulation }],
    yLabel: "People, log scale",
    logY: true,
    note: "Source: OWID population grapher, HYDE / Gapminder / UN WPP processing."
  }));
  await writeFile(path.join(out.demographyFigures, "world-births-deaths-1950-2023.svg"), barSvg({
    title: "Global annual births and deaths",
    subtitle: "Milestone years from UN WPP via OWID; this is demographic turnover, not evidence for reincarnation.",
    rows: birthDeathMilestones,
    keys: ["births", "deaths"],
    yLabel: "People per year",
    note: "Source: OWID annual births/deaths by world region, UN WPP 2024."
  }));

  const co2World = pick(co2Rows, "World", "Annual CO₂ emissions", new Set([1850, 1900, 1950, 1970, 1990, 2000, 2010, 2022, 2023]));
  const co2Ukraine = pick(co2Rows, "Ukraine", "Annual CO₂ emissions", new Set([1990, 2000, 2010, 2015, 2020, 2021, 2022, 2023]));
  const pmWorld = pick(pm25Rows, "World", "PM2.5 air pollution, mean annual exposure (micrograms per cubic meter)", new Set([1990, 2000, 2010, 2015, 2019, 2020, 2021, 2022]));
  const pmUkraine = pick(pm25Rows, "Ukraine", "PM2.5 air pollution, mean annual exposure (micrograms per cubic meter)", new Set([1990, 2000, 2010, 2015, 2019, 2020, 2021, 2022]));

  await writeFile(path.join(out.pollutionData, "co2_world_ukraine_milestones.csv"), csv([...co2World.map((d) => ({ entity: "World", ...d })), ...co2Ukraine.map((d) => ({ entity: "Ukraine", ...d }))], ["entity", "year", "value"]));
  await writeFile(path.join(out.pollutionData, "pm25_world_ukraine_milestones.csv"), csv([...pmWorld.map((d) => ({ entity: "World", ...d })), ...pmUkraine.map((d) => ({ entity: "Ukraine", ...d }))], ["entity", "year", "value"]));
  await writeFile(path.join(out.pollutionFigures, "co2-world-ukraine-milestones.svg"), lineSvg({
    title: "CO2 emissions: world and Ukraine milestones",
    subtitle: "Territorial annual CO2 emissions; Ukraine shown separately where modern national data are available.",
    series: [
      { name: "World", values: co2World },
      { name: "Ukraine", values: co2Ukraine },
    ],
    yLabel: "Tonnes CO2, log scale",
    logY: true,
    note: "Source: OWID CO2 grapher / Global Carbon Project."
  }));
  await writeFile(path.join(out.pollutionFigures, "pm25-world-ukraine-milestones.svg"), lineSvg({
    title: "PM2.5 exposure: world and Ukraine",
    subtitle: "Mean annual exposure in micrograms per cubic meter; lower is better.",
    series: [
      { name: "World", values: pmWorld },
      { name: "Ukraine", values: pmUkraine },
    ],
    yLabel: "Micrograms per cubic meter",
    note: "Source: World Bank WDI via OWID grapher."
  }));
}

async function buildDemography({ populationRows, birthRows, deathRows, fertilityRows, lifeExpectancyRows, fields }) {
  const longYears = new Set([1, 1000, 1500, 1800, 1900, 1950, 2000, 2023]);
  const milestoneYears = new Set([1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2023]);
  const worldPopulation = pick(populationRows, "World", fields.population, longYears);
  const populationAnnual = new Map(pick(populationRows, "World", fields.population).map((d) => [d.year, d.value]));
  const worldBirthsDeaths = joinBirthDeath(
    pick(birthRows, "World", fields.births),
    pick(deathRows, "World", fields.deaths),
  ).filter((d) => d.year <= 2023);

  for (const row of worldBirthsDeaths) {
    row.net_rate_per_1000 = populationAnnual.has(row.year) ? (row.net / populationAnnual.get(row.year)) * 1000 : null;
    row.turnover_rate_per_1000 = populationAnnual.has(row.year) ? (row.turnover / populationAnnual.get(row.year)) * 1000 : null;
  }

  const birthDeathMilestones = worldBirthsDeaths.filter((d) => milestoneYears.has(d.year));
  const lagSummary = lagCorrelations(worldBirthsDeaths);
  const demographicTransition = joinByYear(
    pick(fertilityRows, "World", fields.fertility).filter((d) => d.year >= 1950 && d.year <= 2023),
    pick(lifeExpectancyRows, "World", fields.lifeExpectancy).filter((d) => d.year >= 1950 && d.year <= 2023),
    "fertility",
    "life_expectancy",
  );
  const transitionMilestones = demographicTransition.filter((d) => milestoneYears.has(d.year));

  await writeFile(path.join(out.demographyData, "world_population_milestones.csv"), csv(worldPopulation, ["year", "value"]));
  await writeFile(path.join(out.demographyData, "world_births_deaths_annual.csv"), csv(worldBirthsDeaths, ["year", "births", "deaths", "net", "turnover", "birth_death_ratio", "net_rate_per_1000", "turnover_rate_per_1000"]));
  await writeFile(path.join(out.demographyData, "world_births_deaths_milestones.csv"), csv(birthDeathMilestones, ["year", "births", "deaths", "net", "turnover", "birth_death_ratio", "net_rate_per_1000", "turnover_rate_per_1000"]));
  await writeFile(path.join(out.demographyData, "world_demographic_transition_milestones.csv"), csv(transitionMilestones, ["year", "fertility", "life_expectancy"]));
  await writeFile(path.join(out.demographyData, "birth_death_lag_correlations.csv"), csv(lagSummary, ["lag", "level_correlation", "change_correlation", "level_n", "change_n"]));

  const figures = [
    ["world-population-long-run.svg", { title: "World population long-run baseline", subtitle: "Selected milestones; early years are reconstructions, not census counts.", series: [{ name: "Population", values: worldPopulation }], yLabel: "People, log scale", logY: true, note: "Source: OWID population series, HYDE / Gapminder / UN WPP." }],
    ["world-birth-death-ratio-1950-2023.svg", { title: "Birth-to-death ratio: demographic replacement flow", subtitle: "Above 1 means births exceeded deaths; this does not measure identity transfer.", series: [{ name: "Births / deaths", values: worldBirthsDeaths.map((d) => ({ year: d.year, value: d.birth_death_ratio })) }], yLabel: "Ratio", note: "Derived from UN WPP 2024 births and deaths via OWID." }],
    ["world-net-natural-increase-1950-2023.svg", { title: "Global net natural increase", subtitle: "Annual births minus annual deaths; migration cancels at the world level.", series: [{ name: "Births - deaths", values: worldBirthsDeaths.map((d) => ({ year: d.year, value: d.net })) }], yLabel: "People per year", note: "Derived from UN WPP 2024 births and deaths via OWID." }],
    ["world-fertility-1950-2023.svg", { title: "Global fertility transition", subtitle: "Average births per woman under period fertility rates.", series: [{ name: "Fertility", values: demographicTransition.map((d) => ({ year: d.year, value: d.fertility })) }], yLabel: "Births per woman", note: "Source: UN WPP 2024 via OWID." }],
    ["world-life-expectancy-1950-2023.svg", { title: "Global life expectancy transition", subtitle: "Annual estimates combine observed evidence and demographic modelling.", series: [{ name: "Life expectancy", values: demographicTransition.map((d) => ({ year: d.year, value: d.life_expectancy })) }], yLabel: "Years", note: "Source: UN WPP 2024 via OWID." }],
    ["birth-death-lag-correlations.svg", { title: "Exploratory birth-death lag correlations", subtitle: "Annual levels and year-to-year changes, lags from -20 to +20 years.", series: [{ name: "Levels", values: lagSummary.map((d) => ({ year: d.lag, value: d.level_correlation })) }, { name: "Annual changes", values: lagSummary.map((d) => ({ year: d.lag, value: d.change_correlation })) }], yLabel: "Pearson correlation", note: "Exploratory only: trends, age structure and shocks prevent causal interpretation." }],
  ];
  for (const [name, config] of figures) await writeFile(path.join(out.demographyFigures, name), lineSvg(config));
  await writeFile(path.join(out.demographyFigures, "world-births-deaths-1950-2023.svg"), barSvg({
    title: "Global annual births and deaths",
    subtitle: "Milestone years; demographic turnover is not evidence for reincarnation.",
    rows: birthDeathMilestones,
    keys: ["births", "deaths"],
    yLabel: "People per year",
    note: "Source: UN WPP 2024 via OWID.",
  }));
}

async function buildPollution({ co2Rows, pm25Rows, safeWaterRows, safeSanitationRows, pesticideRows, fertilizerRows, waterStressRows, fields }) {
  const co2Years = new Set([1850, 1900, 1950, 1970, 1990, 2000, 2010, 2022, 2023]);
  const uaCo2Years = new Set([1990, 2000, 2010, 2015, 2020, 2021, 2022, 2023]);
  const pmYears = new Set([1990, 2000, 2010, 2015, 2019, 2020, 2021, 2022]);
  const waterYears = new Set([2000, 2005, 2010, 2015, 2020, 2022, 2023, 2024]);
  const stressYears = new Set([1992, 1997, 2002, 2007, 2012, 2017, 2022]);
  const landYears = new Set([1992, 2000, 2005, 2010, 2015, 2020, 2022, 2023]);
  const co2World = pick(co2Rows, "World", fields.co2, co2Years);
  const co2Ukraine = pick(co2Rows, "Ukraine", fields.co2, uaCo2Years);
  const pmWorld = pick(pm25Rows, "World", fields.pm25, pmYears);
  const pmUkraine = pick(pm25Rows, "Ukraine", fields.pm25, pmYears);
  const safeWaterWorld = pick(safeWaterRows, "World", fields.safeWater, waterYears);
  const safeWaterUkraine = pick(safeWaterRows, "Ukraine", fields.safeWater, waterYears);
  const safeSanitationWorld = pick(safeSanitationRows, "World", fields.safeSanitation, waterYears);
  const safeSanitationUkraine = pick(safeSanitationRows, "Ukraine", fields.safeSanitation, waterYears);
  const waterStressWorld = pick(waterStressRows, "World", fields.waterStress, stressYears);
  const waterStressUkraine = pick(waterStressRows, "Ukraine", fields.waterStress, stressYears);
  const pesticidesWorld = pick(pesticideRows, "World", fields.pesticides, landYears);
  const pesticidesUkraine = pick(pesticideRows, "Ukraine", fields.pesticides, landYears);
  const fertilizersWorld = pick(fertilizerRows, "World", fields.fertilizers, landYears);
  const fertilizersUkraine = pick(fertilizerRows, "Ukraine", fields.fertilizers, landYears);
  const entityRows = (worldRows, ukraineRows) => [
    ...worldRows.map((d) => ({ entity: "World", ...d })),
    ...ukraineRows.map((d) => ({ entity: "Ukraine", ...d })),
  ];

  const snapshots = [
    ["co2_world_ukraine_milestones.csv", entityRows(co2World, co2Ukraine)],
    ["pm25_world_ukraine_milestones.csv", entityRows(pmWorld, pmUkraine)],
    ["safe_water_world_ukraine_milestones.csv", entityRows(safeWaterWorld, safeWaterUkraine)],
    ["safe_sanitation_world_ukraine_milestones.csv", entityRows(safeSanitationWorld, safeSanitationUkraine)],
    ["water_stress_world_ukraine_milestones.csv", entityRows(waterStressWorld, waterStressUkraine)],
    ["pesticide_intensity_world_ukraine_milestones.csv", entityRows(pesticidesWorld, pesticidesUkraine)],
    ["fertilizer_intensity_world_ukraine_milestones.csv", entityRows(fertilizersWorld, fertilizersUkraine)],
  ];
  for (const [name, rows] of snapshots) await writeFile(path.join(out.pollutionData, name), csv(rows, ["entity", "year", "value"]));

  const figures = [
    ["co2-world-ukraine-milestones.svg", { title: "CO2 emissions: world and Ukraine milestones", subtitle: "Territorial annual CO2 emissions; totals are shown on a log scale.", series: [{ name: "World", values: co2World }, { name: "Ukraine", values: co2Ukraine }], yLabel: "Tonnes CO2, log scale", logY: true, note: "Source: OWID CO2 dataset / Global Carbon Project." }],
    ["pm25-world-ukraine-milestones.svg", { title: "PM2.5 exposure: world and Ukraine", subtitle: "Mean annual exposure; the reference line is the WHO annual guideline.", series: [{ name: "World", values: pmWorld }, { name: "Ukraine", values: pmUkraine }, { name: "WHO guideline", values: [{ year: 1990, value: 5 }, { year: 2022, value: 5 }] }], yLabel: "Micrograms per cubic meter", note: "Source: World Bank WDI via OWID; WHO guideline: 5 micrograms/m3." }],
    ["safe-water-world-ukraine.svg", { title: "Safely managed drinking water", subtitle: "On premises, available when needed and free from priority contamination.", series: [{ name: "World", values: safeWaterWorld }, { name: "Ukraine", values: safeWaterUkraine }], yLabel: "Share of population, %", note: "Source: WHO/UNICEF JMP 2025 via OWID. Coverage is not ambient water quality." }],
    ["safe-sanitation-world-ukraine.svg", { title: "Safely managed sanitation", subtitle: "Service coverage is a pressure-control indicator, not direct river-quality evidence.", series: [{ name: "World", values: safeSanitationWorld }, { name: "Ukraine", values: safeSanitationUkraine }], yLabel: "Share of population, %", note: "Source: WHO/UNICEF JMP 2025 via OWID." }],
    ["water-stress-world-ukraine.svg", { title: "Freshwater withdrawal pressure", subtitle: "Withdrawal as a share of available freshwater resources; higher means more stress.", series: [{ name: "World", values: waterStressWorld }, { name: "Ukraine", values: waterStressUkraine }], yLabel: "Water stress, %", note: "Source: FAO AQUASTAT via World Bank ER.H2O.FWST.ZS." }],
    ["pesticide-intensity-world-ukraine.svg", { title: "Pesticide use intensity", subtitle: "Use per hectare; quantity alone does not encode toxicity or persistence.", series: [{ name: "World", values: pesticidesWorld }, { name: "Ukraine", values: pesticidesUkraine }], yLabel: "kg active ingredient per hectare", note: "Source: FAOSTAT 2025 via OWID." }],
    ["fertilizer-intensity-world-ukraine.svg", { title: "Fertilizer use intensity", subtitle: "Nutrient use per hectare; not a direct measure of nutrient runoff.", series: [{ name: "World", values: fertilizersWorld }, { name: "Ukraine", values: fertilizersUkraine }], yLabel: "kg nutrients per hectare", note: "Source: FAOSTAT 2025 via OWID." }],
  ];
  for (const [name, config] of figures) await writeFile(path.join(out.pollutionFigures, name), lineSvg(config));
}

async function main() {
  for (const dir of Object.values(out)) await mkdir(dir, { recursive: true });
  const populationRows = await fetchCsv(urls.population);
  const birthRows = await fetchCsv(urls.births);
  const deathRows = await fetchCsv(urls.deaths);
  const fertilityRows = await fetchCsv(urls.fertility);
  const lifeExpectancyRows = await fetchCsv(urls.lifeExpectancy);
  const co2Rows = await fetchCsv(urls.co2);
  const pm25Rows = await fetchCsv(urls.pm25);
  const safeWaterRows = await fetchCsv(urls.safeWater);
  const safeSanitationRows = await fetchCsv(urls.safeSanitation);
  const pesticideRows = await fetchCsv(urls.pesticides);
  const fertilizerRows = await fetchCsv(urls.fertilizers);
  const waterStressRows = await fetchCsv(urls.waterStress);

  const fields = {
    population: findValueField(populationRows, [/^Population$/i, /population/i]),
    births: findValueField(birthRows, [/birth/i]),
    deaths: findValueField(deathRows, [/death/i]),
    fertility: findValueField(fertilityRows, [/fertility/i, /children.*woman/i]),
    lifeExpectancy: findValueField(lifeExpectancyRows, [/life expectancy/i]),
    co2: findValueField(co2Rows, [/annual.*co.*emission/i]),
    pm25: findValueField(pm25Rows, [/pm2\.5/i]),
    safeWater: findValueField(safeWaterRows, [/safely managed drinking water/i]),
    safeSanitation: findValueField(safeSanitationRows, [/safely managed sanitation/i]),
    pesticides: findValueField(pesticideRows, [/pesticide/i]),
    fertilizers: findValueField(fertilizerRows, [/fertilizer/i]),
    waterStress: findValueField(waterStressRows, [/water stress/i, /freshwater withdrawal/i]),
  };

  await buildDemography({ populationRows, birthRows, deathRows, fertilityRows, lifeExpectancyRows, fields });
  await buildPollution({ co2Rows, pm25Rows, safeWaterRows, safeSanitationRows, pesticideRows, fertilizerRows, waterStressRows, fields });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
