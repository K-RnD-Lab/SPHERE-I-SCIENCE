const config = window.MASTER_PREP_CONFIG || { dataEndpoint: '', links: {}, scoreTargets: {}, actualExamScores: {} };
const SUBJECTS = ['tznk', 'english', 'it'];

const el = {
  studyFile: document.getElementById('study-file'),
  sessionFile: document.getElementById('session-file'),
  subjectFilter: document.getElementById('subject-filter'),
  metrics: document.getElementById('metrics'),
  insightsGrid: document.getElementById('insights-grid'),
  subjectBreakdown: document.getElementById('subject-breakdown'),
  modeBreakdown: document.getElementById('mode-breakdown'),
  resourceGrid: document.getElementById('resource-grid'),
  resourceSummary: document.getElementById('resource-summary'),
  sessionsTable: document.getElementById('sessions-table'),
  studyTable: document.getElementById('study-table'),
  sourceStatus: document.getElementById('source-status'),
  projectLinks: document.getElementById('project-links'),
  targetGrid: document.getElementById('target-grid'),
  targetSummary: document.getElementById('target-summary'),
  trendChart: document.getElementById('trend-chart'),
  efficiencyGrid: document.getElementById('efficiency-grid'),
  scoreGapGrid: document.getElementById('score-gap-grid'),
  tabs: Array.from(document.querySelectorAll('.tab')),
  tabPanels: Array.from(document.querySelectorAll('.tab-panel')),
};

const state = {
  study: [],
  sessions: [],
  resources: [],
  subject: 'all',
  sourceMode: 'loading',
  updatedAt: '',
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindEvents();
  renderLinks();
  await loadInitialData();
  render();
}

function bindEvents() {
  el.studyFile.addEventListener('change', async (event) => {
    state.study = await readCsvFile(event.target.files?.[0]);
    state.sourceMode = 'manual_csv';
    render();
  });

  el.sessionFile.addEventListener('change', async (event) => {
    state.sessions = await readCsvFile(event.target.files?.[0]);
    state.sourceMode = 'manual_csv';
    render();
  });

  el.subjectFilter.addEventListener('change', (event) => {
    state.subject = event.target.value;
    render();
  });

  el.tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });
}

function activateTab(name) {
  el.tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === name));
  el.tabPanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === name));
}

async function loadInitialData() {
  state.resources = await loadResources();
  if (config.dataEndpoint) {
    const ok = await loadRemoteData();
    if (ok) return;
  }
  await loadLocalCsvData();
}

async function loadResources() {
  const text = await fetch('../data/resource_catalog.csv').then((res) => res.text());
  return parseCsv(text);
}

async function loadRemoteData() {
  try {
    const res = await fetch(config.dataEndpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Endpoint error ${res.status}`);
    const payload = await res.json();
    state.study = normalizeRows(payload.study || []);
    state.sessions = normalizeRows(payload.sessions || []);
    state.resources = normalizeRows(payload.resources || state.resources || []);
    state.updatedAt = payload.updatedAt || '';
    state.sourceMode = 'remote_sheet';
    return true;
  } catch (error) {
    console.warn('Remote data unavailable, falling back to local CSV.', error);
    return false;
  }
}

async function loadLocalCsvData() {
  const [studyText, sessionText] = await Promise.all([
    fetch('../data/study_log_template.csv').then((res) => res.text()),
    fetch('../data/session_log_template.csv').then((res) => res.text()),
  ]);
  state.study = parseCsv(studyText);
  state.sessions = parseCsv(sessionText);
  state.sourceMode = 'local_csv';
}

function render() {
  const studyRows = filterBySubject(state.study, state.subject);
  const sessionRows = filterBySubject(state.sessions, state.subject);
  const resourceRows = filterResources(state.resources, state.subject);
  renderSourceStatus();
  renderMetrics(studyRows, sessionRows);
  renderTargetCards(sessionRows);
  renderTrendChart(sessionRows);
  renderInsights(studyRows, sessionRows);
  renderBreakdowns(sessionRows, studyRows);
  renderEfficiency(studyRows, sessionRows);
  renderResources(resourceRows);
  renderSessions(sessionRows);
  renderStudy(studyRows);
}

function renderLinks() {
  const links = [
    cardLink('Live dashboard', config.links?.liveDashboard, 'Public dashboard on Vercel'),
    cardLink('Google Sheet', config.links?.googleSheet, 'Live source of truth for study and session logs'),
    cardLink('Looker Studio', config.links?.lookerStudio, 'Optional polished public reporting layer'),
    cardLink('Apps Script endpoint', config.links?.appsScript, 'JSON bridge between Sheet and dashboard'),
    cardLink('Repository', config.links?.repository, 'Research structure, templates, and case notes'),
  ].filter(Boolean);
  el.projectLinks.innerHTML = links.join('');
}

function renderSourceStatus() {
  const map = {
    loading: 'Loading data',
    remote_sheet: 'Live Google Sheet',
    local_csv: 'Repository CSV snapshot',
    manual_csv: 'Manual CSV upload',
  };
  const suffix = state.updatedAt ? ` (${state.updatedAt})` : '';
  el.sourceStatus.textContent = `${map[state.sourceMode] || 'Unknown source'}${suffix}`;
}

function renderMetrics(studyRows, sessionRows) {
  const totalStudy = sum(studyRows.map((row) => toFiniteNumber(row.minutes)));
  const totalSession = sum(sessionRows.map((row) => toFiniteNumber(row.minutes)));
  const totalSessions = sessionRows.length;
  const avgAccuracy = average(sessionRows.map((row) => toFiniteNumber(row.accuracy_pct)));
  const simulationAccuracy = average(sessionRows.filter((row) => isSimulation(row.mode)).map((row) => toFiniteNumber(row.accuracy_pct)));
  const totalQuestions = sum(sessionRows.map((row) => toFiniteNumber(firstDefined(row.questions_total, row.answered, row.questions_answered))));
  const readiness = estimateReadiness(sessionRows);
  const estimatedScore = average(getCurrentSubjectCards(sessionRows).map((card) => card.currentScoreValue).filter(Number.isFinite));

  el.metrics.innerHTML = [
    metric('Study minutes', totalStudy),
    metric('Session minutes', totalSession),
    metric('Logged sessions', totalSessions),
    metric('Average accuracy', `${avgAccuracy}%`),
    metric('Simulation accuracy', simulationAccuracy ? `${simulationAccuracy}%` : '-'),
    metric('Questions tracked', totalQuestions),
    metric('Readiness signal', readiness),
    metric('Current score estimate', estimatedScore ? round(estimatedScore, 1) : '-'),
  ].join('');
}

function renderTargetCards(sessionRows) {
  const cards = getCurrentSubjectCards(sessionRows);
  const visibleCards = state.subject === 'all' ? cards : cards.filter((card) => card.subject === state.subject);
  const fulfilled = visibleCards.filter((card) => Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue) && card.currentScoreValue >= card.targetScore).length;
  el.targetSummary.textContent = visibleCards.length
    ? `${fulfilled}/${visibleCards.length} subjects are currently at or above the configured target score.`
    : 'No subject cards for this filter yet.';

  el.targetGrid.innerHTML = visibleCards.length
    ? visibleCards.map(renderTargetCard).join('')
    : '<p class="empty">Add predicted_score values or actual exam results to unlock target tracking.</p>';
}

function renderTrendChart(sessionRows) {
  const rows = sessionRows
    .filter((row) => Number.isFinite(toFiniteNumber(row.accuracy_pct)))
    .sort((a, b) => safeDate(a.date) - safeDate(b.date));

  if (!rows.length) {
    el.trendChart.innerHTML = '<p class="empty">No session trend yet. Log a few sessions to unlock the line chart.</p>';
    return;
  }

  const points = rows.map((row, index) => {
    const x = rows.length === 1 ? 320 : 28 + (index * (584 / Math.max(rows.length - 1, 1)));
    const y = 172 - ((clamp(toFiniteNumber(row.accuracy_pct), 0, 100) / 100) * 136);
    return { x, y, row };
  });

  const polyline = points.map((point) => `${round(point.x, 1)},${round(point.y, 1)}`).join(' ');
  const dots = points.map((point) => `<circle cx="${round(point.x, 1)}" cy="${round(point.y, 1)}" r="4.5" fill="#70d6ff" />`).join('');
  const guides = [20, 40, 60, 80].map((tick) => {
    const y = 172 - ((tick / 100) * 136);
    return `<line x1="24" y1="${round(y, 1)}" x2="612" y2="${round(y, 1)}" stroke="rgba(157,178,203,0.16)" stroke-width="1" />
      <text x="0" y="${round(y + 4, 1)}" fill="#9db2cb" font-size="11">${tick}%</text>`;
  }).join('');

  const first = rows[0];
  const last = rows[rows.length - 1];
  el.trendChart.innerHTML = `
    <svg viewBox="0 0 620 190" role="img" aria-label="Accuracy trend over time">
      ${guides}
      <polyline points="${polyline}" fill="none" stroke="url(#trendStroke)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${dots}
      <defs>
        <linearGradient id="trendStroke" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#70d6ff"></stop>
          <stop offset="100%" stop-color="#8a8bff"></stop>
        </linearGradient>
      </defs>
    </svg>
    <div class="chart-caption">
      <span><strong>First:</strong> ${escapeHtml(first.date || 'n/a')} / ${round(toFiniteNumber(first.accuracy_pct), 1)}%</span>
      <span><strong>Latest:</strong> ${escapeHtml(last.date || 'n/a')} / ${round(toFiniteNumber(last.accuracy_pct), 1)}%</span>
    </div>
  `;
}

function renderInsights(studyRows, sessionRows) {
  const internalCount = sessionRows.filter(isInternalSession).length;
  const externalCount = sessionRows.length - internalCount;
  const trainingRows = sessionRows.filter((row) => cleanMode(row.mode).includes('train'));
  const simulationRows = sessionRows.filter((row) => isSimulation(row.mode));

  el.insightsGrid.innerHTML = [
    insight('Strongest subject', subjectSummary(sessionRows, 'best') || 'Not enough data yet'),
    insight('Weakest subject', subjectSummary(sessionRows, 'worst') || 'Not enough data yet'),
    insight('Most used mode', mostCommon(sessionRows.map((row) => cleanMode(row.mode))) || 'No mode data yet'),
    insight('Internal vs external', `${internalCount} internal / ${externalCount} external`),
    insight('Training vs simulation', `${trainingRows.length} training / ${simulationRows.length} simulation`),
    insight('Interpretation', insightNarrative(studyRows, sessionRows)),
  ].join('');
}

function renderBreakdowns(sessionRows, studyRows) {
  const subjectCards = getCurrentSubjectCards(sessionRows).filter((card) => state.subject === 'all' || card.subject === state.subject);
  el.subjectBreakdown.innerHTML = subjectCards.length
    ? subjectCards.map((card) => `
      <article class="stack-card">
        <div class="subject-line">
          <strong>${escapeHtml(card.subject.toUpperCase())}</strong>
          <span>${escapeHtml(card.currentLabel)}</span>
        </div>
        <div class="bar-stack">
          ${miniBar('Average accuracy', card.avgAccuracy, 100, `${card.avgAccuracy}%`)}
          ${miniBar('Target score progress', card.currentScoreValue, card.targetScore || 100, `${card.currentScoreLabel} / ${card.targetLabel}`)}
          ${miniBar('Study load', card.studyMinutes, maxSubjectStudy(studyRows) || 1, `${card.studyMinutes} min`)}
        </div>
      </article>
    `).join('')
    : '<p class="empty">No subject breakdown for this filter yet.</p>';

  const modeStats = Object.entries(groupRows(sessionRows, (row) => cleanMode(row.mode) || 'unknown'));
  el.modeBreakdown.innerHTML = modeStats.length
    ? modeStats.map(([mode, rows]) => `
      <article class="stack-card">
        <strong>${escapeHtml(mode)}</strong>
        <span>${rows.length} rows</span>
        <span>${average(rows.map((row) => toFiniteNumber(row.accuracy_pct)))}% avg accuracy</span>
        <span>${sum(rows.map((row) => toFiniteNumber(row.minutes)))} min</span>
      </article>
    `).join('')
    : '<p class="empty">No mode rows yet.</p>';
}

function renderEfficiency(studyRows, sessionRows) {
  const cards = getCurrentSubjectCards(sessionRows).filter((card) => state.subject === 'all' || card.subject === state.subject);
  const efficiencyCards = cards.map((card) => {
    const efficiencyScore = card.studyMinutes ? round(card.avgAccuracy / Math.max(card.studyMinutes / 60, 0.25), 1) : 0;
    const label = card.studyMinutes ? `${efficiencyScore} accuracy-points per hour` : 'Need study minutes to estimate';
    return insight(`${card.subject.toUpperCase()} efficiency`, label);
  });
  el.efficiencyGrid.innerHTML = efficiencyCards.length ? efficiencyCards.join('') : '<p class="empty">Not enough data for efficiency cards yet.</p>';

  el.scoreGapGrid.innerHTML = cards.length
    ? cards.map((card) => {
      const gapText = Number.isFinite(card.actualScoreValue) && Number.isFinite(card.predictedScoreValue)
        ? `${round(card.actualScoreValue - card.predictedScoreValue, 1)} actual vs predicted`
        : Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue)
          ? `${round(card.targetScore - card.currentScoreValue, 1)} points left to target`
          : 'Need more score data';
      return `
        <article class="stack-card">
          <strong>${escapeHtml(card.subject.toUpperCase())}</strong>
          <span>Predicted: ${escapeHtml(card.predictedLabel)}</span>
          <span>Actual: ${escapeHtml(card.actualLabel)}</span>
          <span>Target: ${escapeHtml(card.targetLabel)}</span>
          <span>${escapeHtml(gapText)}</span>
        </article>
      `;
    }).join('')
    : '<p class="empty">No score-gap rows yet.</p>';
}

function renderResources(rows) {
  const label = state.subject === 'all' ? 'all subjects' : state.subject.toUpperCase();
  el.resourceSummary.textContent = `Showing ${rows.length} source cards for ${label}. Learn-stage sources should be used before larger test batches.`;

  if (!rows.length) {
    el.resourceGrid.innerHTML = '<p class="empty">No resource rows found for this filter.</p>';
    return;
  }

  el.resourceGrid.innerHTML = rows.map((row) => `
    <article class="resource-card">
      <div class="badge-row">
        <span class="badge">${escapeHtml(row.subject)}</span>
        <span class="badge">${escapeHtml(row.resource_type)}</span>
        <span class="badge">${escapeHtml(row.stage)}</span>
        <span class="badge priority-${escapeHtml((row.priority || '').toLowerCase())}">${escapeHtml(row.priority)}</span>
      </div>
      <h3>${escapeHtml(row.title)}</h3>
      <p>${escapeHtml(row.why_use)}</p>
      <a href="${escapeAttr(row.url)}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `).join('');
}

function renderSessions(rows) {
  el.sessionsTable.innerHTML = renderTable(rows, ['date', 'subject', 'platform', 'mode', 'questions_total', 'correct', 'accuracy_pct', 'minutes', 'session_label', 'predicted_score', 'actual_score', 'notes']);
}

function renderStudy(rows) {
  el.studyTable.innerHTML = renderTable(rows, ['date', 'subject', 'resource_title', 'resource_type', 'stage', 'minutes', 'focus_score', 'energy_level', 'notes']);
}

function renderTable(rows, columns) {
  if (!rows.length) return '<p class="empty">No rows for this filter yet.</p>';
  const head = columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('');
  const body = rows.map((row) => `<tr>${columns.map((col) => `<td>${escapeHtml(row[col] ?? '')}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function getCurrentSubjectCards(sessionRows) {
  const groupedSessions = groupRows(sessionRows, (row) => normalizeSubject(row.subject));
  const groupedStudy = groupRows(state.study, (row) => normalizeSubject(row.subject));

  return SUBJECTS.map((subject) => {
    const rows = groupedSessions[subject] || [];
    const studyRows = groupedStudy[subject] || [];
    const latestPredicted = latestNumeric(rows, 'predicted_score');
    const configActual = toFiniteNumber(config.actualExamScores?.[subject]);
    const latestActual = Number.isFinite(configActual) ? configActual : latestNumeric(rows, 'actual_score');
    const currentScore = firstFinite(latestActual, latestPredicted, NaN);
    const targetScore = toFiniteNumber(config.scoreTargets?.[subject]);
    const avgAccuracy = average(rows.map((row) => toFiniteNumber(row.accuracy_pct)));
    const studyMinutes = sum(studyRows.map((row) => toFiniteNumber(row.minutes)));
    const sessionMinutes = sum(rows.map((row) => toFiniteNumber(row.minutes)));
    const progressPercent = Number.isFinite(targetScore) && targetScore > 0 && Number.isFinite(currentScore)
      ? clamp((currentScore / targetScore) * 100, 0, 140)
      : 0;

    return {
      subject,
      avgAccuracy,
      studyMinutes,
      sessionMinutes,
      targetScore,
      currentScoreValue: currentScore,
      predictedScoreValue: latestPredicted,
      actualScoreValue: latestActual,
      progressPercent,
      targetLabel: Number.isFinite(targetScore) ? `${targetScore}` : '—',
      currentLabel: Number.isFinite(currentScore) ? `${round(currentScore, 1)}` : 'No score yet',
      currentScoreLabel: Number.isFinite(currentScore) ? `${round(currentScore, 1)}` : '—',
      predictedLabel: Number.isFinite(latestPredicted) ? `${round(latestPredicted, 1)}` : '—',
      actualLabel: Number.isFinite(latestActual) ? `${round(latestActual, 1)}` : '—',
    };
  });
}

function renderTargetCard(card) {
  const gap = Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue)
    ? round(card.targetScore - card.currentScoreValue, 1)
    : NaN;
  const barClass = card.progressPercent >= 100 ? 'progress-bar is-over' : 'progress-bar';
  const statusText = Number.isFinite(gap)
    ? gap <= 0
      ? `${Math.abs(gap)} points above target`
      : `${gap} points left`
    : 'Set target and predicted score to unlock gap tracking';

  return `
    <article class="target-card">
      <div class="target-topline">
        <strong>${escapeHtml(card.subject.toUpperCase())}</strong>
        <span class="target-score">${escapeHtml(card.currentScoreLabel)}</span>
      </div>
      <p>Target ${escapeHtml(card.targetLabel)} · Predicted ${escapeHtml(card.predictedLabel)} · Actual ${escapeHtml(card.actualLabel)}</p>
      <div class="progress-track">
        <div class="${barClass}" style="width:${Math.max(card.progressPercent, 4)}%"></div>
      </div>
      <div class="progress-meta">
        <span>${escapeHtml(statusText)}</span>
        <strong>${escapeHtml(`${round(card.progressPercent || 0)}%`)}</strong>
      </div>
    </article>
  `;
}

function cardLink(label, href, description) {
  if (!href) return '';
  return `<a class="link-card" href="${escapeAttr(href)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(description)}</span></a>`;
}

function metric(label, value) {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function insight(label, value) {
  return `<article class="insight-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function miniBar(label, value, maxValue, tail) {
  const percent = maxValue ? clamp((value / maxValue) * 100, 0, 100) : 0;
  return `
    <div class="mini-bar">
      <div class="mini-bar__meta">
        <span>${escapeHtml(label)}</span>
        <span>${escapeHtml(tail)}</span>
      </div>
      <div class="mini-bar__track">
        <div class="mini-bar__fill" style="width:${percent}%"></div>
      </div>
    </div>
  `;
}

function filterBySubject(rows, subject) {
  if (subject === 'all') return rows;
  return rows.filter((row) => normalizeSubject(row.subject) === subject);
}

function filterResources(rows, subject) {
  if (subject === 'all') return rows;
  return rows.filter((row) => normalizeSubject(row.subject) === subject || normalizeSubject(row.subject) === 'all');
}

function estimateReadiness(rows) {
  const simulationAccuracy = average(rows.filter((row) => isSimulation(row.mode)).map((row) => toFiniteNumber(row.accuracy_pct)));
  const overallAccuracy = average(rows.map((row) => toFiniteNumber(row.accuracy_pct)));
  const latestPredicted = latestNumeric(rows, 'predicted_score');
  const signal = firstFinite(simulationAccuracy, overallAccuracy, latestPredicted, 0);
  if (!signal) return 'Not enough data';
  if (signal >= 85) return 'High';
  if (signal >= 70) return 'Building';
  return 'Early';
}

function subjectSummary(rows, kind) {
  const entries = SUBJECTS.map((subject) => {
    const subjectRows = rows.filter((row) => normalizeSubject(row.subject) === subject);
    return { subject, value: average(subjectRows.map((row) => toFiniteNumber(row.accuracy_pct))) };
  }).filter((entry) => entry.value > 0);

  if (!entries.length) return '';
  entries.sort((a, b) => kind === 'best' ? b.value - a.value : a.value - b.value);
  return `${entries[0].subject.toUpperCase()} (${entries[0].value}%)`;
}

function mostCommon(values) {
  const counts = values.filter(Boolean).reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries[0] ? `${entries[0][0]} (${entries[0][1]})` : '';
}

function insightNarrative(studyRows, sessionRows) {
  const avgAccuracy = average(sessionRows.map((row) => toFiniteNumber(row.accuracy_pct)));
  const studyMin = sum(studyRows.map((row) => toFiniteNumber(row.minutes)));
  const simCount = sessionRows.filter((row) => isSimulation(row.mode)).length;
  const cards = getCurrentSubjectCards(sessionRows).filter((card) => Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue));
  const onTrack = cards.filter((card) => card.currentScoreValue >= card.targetScore).length;

  if (!sessionRows.length) return 'Start logging practice and simulation rows to unlock real readiness signals.';
  if (onTrack && cards.length) return `${onTrack}/${cards.length} subject targets are already being met or exceeded.`;
  if (avgAccuracy >= 80 && studyMin < 300) return 'Strong efficiency signal: relatively modest logged study time is already producing high accuracy.';
  if (simCount === 0) return 'You have practice data, but no simulation baseline yet. Add full-run sessions before making readiness claims.';
  return 'The dashboard now has enough structure to show growth, score gaps, and readiness movement over time.';
}

function isSimulation(mode) {
  return cleanMode(mode).includes('sim');
}

function isInternalSession(row) {
  const flag = String(firstDefined(row.is_internal, '')).toLowerCase();
  return flag === 'true' || flag === '1' || flag === 'yes';
}

function groupRows(rows, keyFn) {
  return rows.reduce((acc, row) => {
    const key = keyFn(row) || 'unknown';
    acc[key] ||= [];
    acc[key].push(row);
    return acc;
  }, {});
}

function maxSubjectStudy(studyRows) {
  return Math.max(0, ...SUBJECTS.map((subject) => {
    const rows = studyRows.filter((row) => normalizeSubject(row.subject) === subject);
    return sum(rows.map((row) => toFiniteNumber(row.minutes)));
  }));
}

function latestNumeric(rows, field) {
  const sorted = [...rows].sort((a, b) => safeDate(a.date) - safeDate(b.date));
  const values = sorted.map((row) => toFiniteNumber(row[field])).filter((value) => Number.isFinite(value));
  return values.length ? values[values.length - 1] : NaN;
}

function safeDate(value) {
  const parsed = new Date(value || 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function firstFinite() {
  return Array.from(arguments).find((value) => Number.isFinite(value));
}

function normalizeRows(rows) {
  return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
}

function sum(values) {
  return Math.round(values.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0));
}

function average(values) {
  const clean = values.filter(Number.isFinite);
  if (!clean.length) return 0;
  return round(clean.reduce((acc, value) => acc + value, 0) / clean.length, 1);
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function firstDefined() {
  return Array.from(arguments).find((value) => value !== undefined && value !== null && value !== '');
}

async function readCsvFile(file) {
  if (!file) return [];
  const text = await file.text();
  return parseCsv(text);
}

function parseCsv(text) {
  const normalized = (text || '').trim();
  if (!normalized) return [];
  const lines = normalized.split(/\r?\n/);
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).filter(Boolean).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });
    return row;
  });
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells;
}

function normalizeSubject(value) {
  return String(value || '').trim().toLowerCase();
}

function cleanMode(value) {
  return String(value || '').trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

