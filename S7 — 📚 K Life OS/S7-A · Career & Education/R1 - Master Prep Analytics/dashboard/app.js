const config = window.MASTER_PREP_CONFIG || { dataEndpoint: '', links: {} };

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
};

const state = { study: [], sessions: [], resources: [], subject: 'all', sourceMode: 'loading', updatedAt: '' };

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
  const subject = state.subject;
  const studyRows = filterBySubject(state.study, subject);
  const sessionRows = filterBySubject(state.sessions, subject);
  const resourceRows = filterResources(state.resources, subject);
  renderSourceStatus();
  renderMetrics(studyRows, sessionRows, resourceRows);
  renderInsights(studyRows, sessionRows);
  renderBreakdowns(sessionRows, studyRows);
  renderResources(resourceRows, subject);
  renderSessions(sessionRows);
  renderStudy(studyRows);
}

function renderLinks() {
  const links = [
    cardLink('Live dashboard', config.links?.liveDashboard, 'Public dashboard on Vercel'),
    cardLink('Google Sheet', config.links?.googleSheet, 'Live source of truth for study and session logs'),
    cardLink('Looker Studio', config.links?.lookerStudio, 'Optional polished public reporting layer'),
    cardLink('Apps Script endpoint', config.links?.appsScript, 'JSON bridge between Sheet and dashboard'),
    cardLink('Repository', config.links?.repository, 'Research structure, CSV templates, and report layer'),
  ].filter(Boolean);
  el.projectLinks.innerHTML = links.join('');
}

function cardLink(label, href, description) {
  if (!href) return '';
  return `<a class="link-card" href="${escapeAttr(href)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(description)}</span></a>`;
}

function renderSourceStatus() {
  const map = {
    loading: 'Loading data…',
    remote_sheet: 'Live mode: this dashboard is reading Google Sheet data through the Apps Script endpoint.',
    local_csv: 'Local mode: default CSV templates from the repository are currently loaded.',
    manual_csv: 'Manual mode: you uploaded CSV files directly in the browser.',
  };
  const suffix = state.updatedAt ? ` Last remote sync: ${state.updatedAt}.` : '';
  el.sourceStatus.textContent = `${map[state.sourceMode] || 'Data mode unknown.'}${suffix}`;
}

function renderMetrics(studyRows, sessionRows, resourceRows) {
  const totalStudy = sum(studyRows.map((row) => toNumber(row.minutes)));
  const totalSession = sum(sessionRows.map((row) => toNumber(row.minutes)));
  const totalSessions = sessionRows.length;
  const avgAccuracy = average(sessionRows.map((row) => toNumber(row.accuracy_pct)));
  const simAccuracy = average(sessionRows.filter((row) => isSimulation(row.mode)).map((row) => toNumber(row.accuracy_pct)));
  const totalQuestions = sum(sessionRows.map((row) => toNumber(firstDefined(row.questions_total, row.answered, row.questions_answered))));
  const readiness = estimateReadiness(sessionRows);

  el.metrics.innerHTML = [
    metric('Study minutes', totalStudy),
    metric('Session minutes', totalSession),
    metric('Logged sessions', totalSessions),
    metric('Average accuracy', `${avgAccuracy}%`),
    metric('Simulation accuracy', simAccuracy ? `${simAccuracy}%` : '—'),
    metric('Readiness signal', readiness),
    metric('Questions tracked', totalQuestions),
    metric('Resource cards', resourceRows.length),
  ].join('');
}

function renderInsights(studyRows, sessionRows) {
  const externalCount = sessionRows.filter((row) => !isInternal(row)).length;
  const internalCount = sessionRows.filter((row) => isInternal(row)).length;
  const cards = [
    insight('Strongest subject', subjectSummary(sessionRows, 'best') || 'Not enough data yet'),
    insight('Weakest subject', subjectSummary(sessionRows, 'worst') || 'Not enough data yet'),
    insight('Most used mode', mostCommon(sessionRows.map((row) => cleanMode(row.mode))) || 'No session mode data yet'),
    insight('Study vs session ratio', ratioLabel(totalStudyMinutes(studyRows), totalSessionMinutes(sessionRows))),
    insight('External vs internal', `${externalCount} external / ${internalCount} internal`),
    insight('What this can prove', insightNarrative(sessionRows, studyRows)),
  ];
  el.insightsGrid.innerHTML = cards.join('');
}

function renderBreakdowns(sessionRows, studyRows) {
  const subjects = ['tznk', 'english', 'it'];
  el.subjectBreakdown.innerHTML = subjects.map((subject) => {
    const subjectSessions = sessionRows.filter((row) => normalizeSubject(row.subject) === subject);
    const subjectStudy = studyRows.filter((row) => normalizeSubject(row.subject) === subject);
    return statCard(
      subject.toUpperCase(),
      `${subjectSessions.length} sessions`,
      `${average(subjectSessions.map((row) => toNumber(row.accuracy_pct)))}% avg accuracy`,
      `${sum(subjectStudy.map((row) => toNumber(row.minutes))) + sum(subjectSessions.map((row) => toNumber(row.minutes)))} total min`
    );
  }).join('');

  const modes = groupCount(sessionRows.map((row) => cleanMode(row.mode) || 'unknown'));
  el.modeBreakdown.innerHTML = Object.entries(modes).map(([mode, count]) => {
    const rows = sessionRows.filter((row) => (cleanMode(row.mode) || 'unknown') === mode);
    return statCard(mode, `${count} rows`, `${average(rows.map((row) => toNumber(row.accuracy_pct)))}% avg accuracy`, `${sum(rows.map((row) => toNumber(row.minutes)))} min`);
  }).join('') || '<p class="empty">No mode rows yet.</p>';
}

function renderResources(rows, subject) {
  const label = subject === 'all' ? 'all subjects' : subject.toUpperCase();
  el.resourceSummary.textContent = `Showing ${rows.length} source cards for ${label}. Focus on learn-stage cards before large practice batches.`;
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
  el.sessionsTable.innerHTML = renderTable(rows, ['date','subject','platform','mode','questions_total','correct','accuracy_pct','minutes','session_label','predicted_score','actual_score','notes']);
}

function renderStudy(rows) {
  el.studyTable.innerHTML = renderTable(rows, ['date','subject','resource_title','resource_type','stage','minutes','focus_score','energy_level','notes']);
}

function renderTable(rows, columns) {
  if (!rows.length) return '<p class="empty">No rows for this filter yet.</p>';
  const head = columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('');
  const body = rows.map((row) => `<tr>${columns.map((col) => `<td>${escapeHtml(row[col] ?? '')}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function metric(label, value) { return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`; }
function insight(label, value) { return `<article class="insight-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`; }
function statCard(title, line1, line2, line3) { return `<article class="stack-card"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(line1)}</span><span>${escapeHtml(line2)}</span><span>${escapeHtml(line3)}</span></article>`; }
function filterBySubject(rows, subject) { if (subject === 'all') return rows; return rows.filter((row) => normalizeSubject(row.subject) === subject); }
function filterResources(rows, subject) { if (subject === 'all') return rows; return rows.filter((row) => normalizeSubject(row.subject) === subject || normalizeSubject(row.subject) === 'all'); }
function totalStudyMinutes(rows) { return sum(rows.map((row) => toNumber(row.minutes))); }
function totalSessionMinutes(rows) { return sum(rows.map((row) => toNumber(row.minutes))); }
function estimateReadiness(rows) { const sim = average(rows.filter((row) => isSimulation(row.mode)).map((row) => toNumber(row.accuracy_pct))); const overall = average(rows.map((row) => toNumber(row.accuracy_pct))); const score = sim || overall; if (!score) return 'Not enough data'; if (score >= 85) return 'High'; if (score >= 70) return 'Building'; return 'Early'; }
function subjectSummary(rows, kind) { const map = {}; rows.forEach((row) => { const subject = normalizeSubject(row.subject); if (!subject || subject === 'all') return; map[subject] ||= []; map[subject].push(toNumber(row.accuracy_pct)); }); const entries = Object.entries(map).map(([subject, values]) => ({ subject, value: average(values) })); if (!entries.length) return ''; entries.sort((a, b) => kind === 'best' ? b.value - a.value : a.value - b.value); return `${entries[0].subject.toUpperCase()} (${entries[0].value}%)`; }
function mostCommon(values) { const counts = groupCount(values.filter(Boolean)); const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]); return entries[0] ? `${entries[0][0]} (${entries[0][1]})` : ''; }
function groupCount(values) { return values.reduce((acc, value) => { acc[value] = (acc[value] || 0) + 1; return acc; }, {}); }
function insightNarrative(sessionRows, studyRows) { const avgAcc = average(sessionRows.map((row) => toNumber(row.accuracy_pct))); const studyMin = totalStudyMinutes(studyRows); const simCount = sessionRows.filter((row) => isSimulation(row.mode)).length; if (!sessionRows.length) return 'Start logging practice and simulation rows to unlock evidence-based patterns.'; if (avgAcc >= 80 && studyMin < 300) return 'Strong efficiency signal: relatively modest logged study time is already producing high accuracy.'; if (simCount === 0) return 'You have practice data, but no simulation baseline yet. Add full-run sessions before making readiness claims.'; return 'The current dataset is enough for trend tracking, but the strongest public insights will come after repeated simulation cycles.'; }
function isSimulation(mode) { return cleanMode(mode).includes('sim'); }
function isInternal(row) { const flag = String(firstDefined(row.is_internal, '')).toLowerCase(); return flag === 'true' || flag === '1' || flag === 'yes'; }
function normalizeSubject(value) { return String(value || '').trim().toLowerCase(); }
function cleanMode(value) { return String(value || '').trim().toLowerCase(); }
function normalizeRows(rows) { return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : []; }
function sum(values) { return Math.round(values.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0)); }
function average(values) { const clean = values.filter((value) => Number.isFinite(value)); if (!clean.length) return 0; return Math.round(sum(clean) / clean.length); }
function toNumber(value) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
function firstDefined(...values) { return values.find((value) => value !== undefined && value !== null && value !== ''); }
function ratioLabel(study, session) { if (!study || !session) return 'Need both study and session rows'; return `${Math.round((study / Math.max(session, 1)) * 100) / 100}:1 study-to-session`; }
async function readCsvFile(file) { if (!file) return []; const text = await file.text(); return parseCsv(text); }
function parseCsv(text) { const normalized = (text || '').trim(); if (!normalized) return []; const lines = normalized.split(/\r?\n/); const headers = splitCsvLine(lines[0]); return lines.slice(1).filter(Boolean).map((line) => { const cells = splitCsvLine(line); const row = {}; headers.forEach((header, index) => { row[header] = cells[index] ?? ''; }); return row; }); }
function splitCsvLine(line) { const cells = []; let current = ''; let inQuotes = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"') { if (inQuotes && next === '"') { current += '"'; i += 1; } else { inQuotes = !inQuotes; } } else if (char === ',' && !inQuotes) { cells.push(current); current = ''; } else { current += char; } } cells.push(current); return cells; }
function escapeHtml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function escapeAttr(value) { return escapeHtml(value); }
