import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const urls = {
  population: "https://ourworldindata.org/grapher/population.csv?csvType=full&useColumnShortNames=false",
  births: "https://ourworldindata.org/grapher/annual-number-of-births-by-world-region.csv?csvType=full&useColumnShortNames=false",
  deaths: "https://ourworldindata.org/grapher/annual-number-of-deaths-by-world-region.csv?csvType=full&useColumnShortNames=false",
  co2: "https://ourworldindata.org/grapher/annual-co2-emissions-per-country.csv?csvType=full&useColumnShortNames=false",
  pm25: "https://ourworldindata.org/grapher/average-exposure-pm25-pollution.csv?csvType=full&useColumnShortNames=false",
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
  const res = await fetch(url, { headers: { "User-Agent": "K-RnD-Lab research data fetch/1.0" } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return parseCsv(await res.text());
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

function joinBirthDeath(births, deaths) {
  const deathMap = new Map(deaths.map((d) => [d.year, d.value]));
  return births
    .filter((d) => deathMap.has(d.year))
    .map((d) => ({ year: d.year, births: d.value, deaths: deathMap.get(d.year), net: d.value - deathMap.get(d.year) }));
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

async function main() {
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
