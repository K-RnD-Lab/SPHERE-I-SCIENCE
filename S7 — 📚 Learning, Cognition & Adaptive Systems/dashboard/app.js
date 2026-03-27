const el = {
  studyFile: document.getElementById('study-file'),
  sessionFile: document.getElementById('session-file'),
  subjectFilter: document.getElementById('subject-filter'),
  metrics: document.getElementById('metrics'),
  resourceGrid: document.getElementById('resource-grid'),
  resourceSummary: document.getElementById('resource-summary'),
  sessionsTable: document.getElementById('sessions-table'),
  studyTable: document.getElementById('study-table'),
};

const state = { study: [], sessions: [], resources: [], subject: 'all' };

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindEvents();
  await loadDefaultData();
  render();
}

function bindEvents() {
  el.studyFile.addEventListener('change', async (event) => {
    state.study = await readCsvFile(event.target.files?.[0]);
    render();
  });

  el.sessionFile.addEventListener('change', async (event) => {
    state.sessions = await readCsvFile(event.target.files?.[0]);
    render();
  });

  el.subjectFilter.addEventListener('change', (event) => {
    state.subject = event.target.value;
    render();
  });
}

async function loadDefaultData() {
  const [studyText, sessionText, resourceText] = await Promise.all([
    fetch('../data/study_log_template.csv').then((res) => res.text()),
    fetch('../data/session_log_template.csv').then((res) => res.text()),
    fetch('../data/resource_catalog.csv').then((res) => res.text()),
  ]);

  state.study = parseCsv(studyText);
  state.sessions = parseCsv(sessionText);
  state.resources = parseCsv(resourceText);
}

function render() {
  const subject = state.subject;
  const studyRows = filterBySubject(state.study, subject);
  const sessionRows = filterBySubject(state.sessions, subject);
  const resourceRows = filterResources(state.resources, subject);

  renderMetrics(studyRows, sessionRows, resourceRows);
  renderResources(resourceRows, subject);
  renderSessions(sessionRows);
  renderStudy(studyRows);
}

function renderMetrics(studyRows, sessionRows, resourceRows) {
  const totalStudyMinutes = sum(studyRows.map((row) => Number(row.minutes || 0)));
  const totalSessions = sessionRows.length;
  const avgAccuracy = totalSessions
    ? Math.round(sum(sessionRows.map((row) => Number(row.accuracy_pct || 0))) / totalSessions)
    : 0;
  const totalQuestions = sum(sessionRows.map((row) => Number(row.questions_total || 0)));

  el.metrics.innerHTML = [
    metric('Study minutes', totalStudyMinutes),
    metric('Logged sessions', totalSessions),
    metric('Average accuracy', `${avgAccuracy}%`),
    metric('Questions tracked', totalQuestions),
    metric('Resource cards', resourceRows.length),
  ].join('');
}

function renderResources(rows, subject) {
  const label = subject === 'all' ? 'all subjects' : subject.toUpperCase();
  el.resourceSummary.textContent = `Showing ${rows.length} source cards for ${label}.`;

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
      </div>
      <h3>${escapeHtml(row.title)}</h3>
      <p>${escapeHtml(row.why_use)}</p>
      <a href="${escapeAttr(row.url)}" target="_blank" rel="noreferrer">Open source</a>
    </article>
  `).join('');
}

function renderSessions(rows) {
  el.sessionsTable.innerHTML = renderTable(rows, ['date','subject','platform','mode','questions_total','correct','accuracy_pct','minutes','session_label','notes']);
}

function renderStudy(rows) {
  el.studyTable.innerHTML = renderTable(rows, ['date','subject','resource_title','resource_type','stage','minutes','notes']);
}

function renderTable(rows, columns) {
  if (!rows.length) return '<p class="empty">No rows for this filter yet.</p>';
  const head = columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('');
  const body = rows.map((row) => `<tr>${columns.map((col) => `<td>${escapeHtml(row[col] ?? '')}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function metric(label, value) {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function filterBySubject(rows, subject) {
  if (subject === 'all') return rows;
  return rows.filter((row) => (row.subject || '').toLowerCase() === subject);
}

function filterResources(rows, subject) {
  if (subject === 'all') return rows;
  return rows.filter((row) => row.subject === 'all' || (row.subject || '').toLowerCase() === subject);
}

function sum(values) {
  return values.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0);
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
