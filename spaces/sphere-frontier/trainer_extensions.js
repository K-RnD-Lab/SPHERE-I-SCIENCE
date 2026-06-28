let extensionReady = false;
let autoSyncTimer = null;
let simulationClock = null;
let suppressNextAutoSync = false;
let syncInFlight = false;

document.addEventListener('DOMContentLoaded', waitForCore);
document.addEventListener('master-prep:render', () => {
  if (extensionReady) renderExtension();
});
document.addEventListener('master-prep:saved', () => {
  if (!extensionReady) return;
  if (suppressNextAutoSync) {
    suppressNextAutoSync = false;
    return;
  }
  const currentState = getState();
  if (currentState.sync?.autoSync) scheduleAutoSync();
});

function waitForCore() {
  if (window.masterPrepTrainer) {
    initExtension();
    return;
  }
  window.setTimeout(waitForCore, 120);
}

function initExtension() {
  if (extensionReady) return;
  extensionReady = true;
  ensureExtensionDefaults();
  bindStaticControls();
  renderExtension();
}

function api() {
  return window.masterPrepTrainer;
}

function getState() {
  return api().getState();
}

function getAppData() {
  return api().getAppData();
}

function cloneState() {
  return structuredClone(getState());
}

function replaceState(nextState, silentAutoSync = false) {
  suppressNextAutoSync = silentAutoSync;
  api().replaceState(nextState);
}

function ensureExtensionDefaults() {
  const next = cloneState();
  if (applyExtensionDefaults(next)) replaceState(next, true);
}

function applyExtensionDefaults(next) {
  let changed = false;
  if (!next.simulation) {
    next.simulation = defaultSimulationState();
    changed = true;
  }
  if (!next.mistakeNotebook) {
    next.mistakeNotebook = defaultNotebookState();
    changed = true;
  }
  if (!next.reviewQueue) {
    next.reviewQueue = defaultReviewQueueState();
    changed = true;
  }
  if (!next.sync) {
    next.sync = defaultSyncState();
    changed = true;
  }
  return changed;
}

function defaultSimulationState() {
  return {
    active: false,
    subject: null,
    sessionId: null,
    questionIds: [],
    currentIndex: 0,
    answers: {},
    startedAt: null,
    deadlineAt: null,
    currentShownAt: null,
    targetCount: 0,
    durationMin: 0,
    partialPool: false,
    lastSummary: null,
  };
}

function defaultNotebookState() {
  return {
    filterSubject: 'all',
    filterStatus: 'all',
    entries: [],
  };
}

function defaultReviewQueueState() {
  return {
    filterSubject: 'current',
    filterStatus: 'due',
    lastOpenedQuestionId: null,
  };
}

function defaultSyncState() {
  return {
    backendUrl: 'http://127.0.0.1:8787',
    autoSync: false,
    lastSyncAt: null,
    lastSyncStatus: 'local-only',
    lastSyncMessage: 'Local browser mode',
  };
}

function bindStaticControls() {
  document.getElementById('backend-url-input')?.addEventListener('change', (event) => {
    const next = cloneState();
    next.sync.backendUrl = event.target.value.trim();
    replaceState(next, true);
  });

  document.getElementById('backend-autosync-toggle')?.addEventListener('change', (event) => {
    const next = cloneState();
    next.sync.autoSync = !!event.target.checked;
    next.sync.lastSyncMessage = next.sync.autoSync ? 'Auto sync enabled' : 'Auto sync disabled';
    replaceState(next, true);
    if (next.sync.autoSync) scheduleAutoSync();
  });

  document.getElementById('backend-check-btn')?.addEventListener('click', checkBackend);
  document.getElementById('backend-sync-btn')?.addEventListener('click', syncNow);
  document.getElementById('backend-pull-btn')?.addEventListener('click', pullFromBackend);
  document.getElementById('simulation-start-btn')?.addEventListener('click', startSimulation);
  document.getElementById('simulation-resume-btn')?.addEventListener('click', renderSimulation);
  document.getElementById('simulation-finish-btn')?.addEventListener('click', finishSimulation);
  document.getElementById('mistake-subject-select')?.addEventListener('change', (event) => {
    const next = cloneState();
    next.mistakeNotebook.filterSubject = event.target.value;
    replaceState(next, true);
  });
  document.getElementById('mistake-status-select')?.addEventListener('change', (event) => {
    const next = cloneState();
    next.mistakeNotebook.filterStatus = event.target.value;
    replaceState(next, true);
  });
  document.getElementById('review-subject-select')?.addEventListener('change', (event) => {
    const next = cloneState();
    next.reviewQueue = next.reviewQueue || defaultReviewQueueState();
    next.reviewQueue.filterSubject = event.target.value;
    replaceState(next, true);
  });
  document.getElementById('review-status-select')?.addEventListener('change', (event) => {
    const next = cloneState();
    next.reviewQueue = next.reviewQueue || defaultReviewQueueState();
    next.reviewQueue.filterStatus = event.target.value;
    replaceState(next, true);
  });
  document.getElementById('review-open-next-btn')?.addEventListener('click', () => openNextReview(false));
  document.getElementById('review-open-any-btn')?.addEventListener('click', () => openNextReview(true));
}

function renderExtension() {
  const next = cloneState();
  const defaulted = applyExtensionDefaults(next);
  const hydrated = hydrateNotebookFromAttempts(next);
  if (defaulted || hydrated) {
    replaceState(next, true);
    return;
  }
  renderBackend();
  renderSimulation();
  renderNotebook();
  renderReviewQueue();
}

function renderBackend() {
  const current = getState();
  const backendUrlInput = document.getElementById('backend-url-input');
  const autoSyncToggle = document.getElementById('backend-autosync-toggle');
  const status = document.getElementById('backend-status');
  if (backendUrlInput) backendUrlInput.value = current.sync?.backendUrl || '';
  if (autoSyncToggle) autoSyncToggle.checked = !!current.sync?.autoSync;
  if (!status) return;

  const attempts = current.attempts?.length || 0;
  const studySessions = current.studySessions?.length || 0;
  const syncStatus = current.sync?.lastSyncStatus || 'local-only';
  const syncMessage = current.sync?.lastSyncMessage || 'Local browser mode';
  const modeNote = syncStatus === 'local-only'
    ? 'Your data is still stored only in this browser. The big report page keeps its old canonical tables until you run backend sync or import an exported JSON.'
    : 'Your trainer can now mirror the current browser state into the canonical repo logs. After sync, the main snapshot report can rebuild from this exact state.';

  status.innerHTML = `
    <p><strong>Status:</strong> ${escapeHtml(syncStatus)}</p>
    <p><strong>Message:</strong> ${escapeHtml(syncMessage)}</p>
    <p><strong>Last sync:</strong> ${escapeHtml(formatDateTime(current.sync?.lastSyncAt) || 'never')}</p>
    <p><strong>Payload preview:</strong> ${attempts} attempts, ${studySessions} study sessions, ${(current.mistakeNotebook?.entries || []).length} notebook entries</p>
    <p><strong>What this means:</strong> ${escapeHtml(modeNote)}</p>
  `;
}

function scheduleAutoSync() {
  if (syncInFlight) return;
  if (autoSyncTimer) window.clearTimeout(autoSyncTimer);
  autoSyncTimer = window.setTimeout(() => {
    syncNow();
  }, 1200);
}

async function checkBackend() {
  try {
    const result = await backendFetch('/api/health');
    updateSyncStatus('backend-ready', `Backend OK. DB entries: ${result.counts?.attempts || 0} attempts.`);
  } catch (error) {
    updateSyncStatus('backend-error', error.message);
  }
}

async function syncNow() {
  const current = getState();
  if (!current.sync?.backendUrl) {
    updateSyncStatus('backend-missing', 'Set backend URL first.');
    return;
  }
  syncInFlight = true;
  try {
    const result = await backendFetch('/api/sync', {
      method: 'POST',
      body: JSON.stringify({ state: current, rebuildReport: true }),
    });
    updateSyncStatus('synced', result.message || 'Sync complete. Report rebuilt.');
  } catch (error) {
    updateSyncStatus('backend-error', error.message);
  } finally {
    syncInFlight = false;
  }
}

async function pullFromBackend() {
  const current = getState();
  if (!current.sync?.backendUrl) {
    updateSyncStatus('backend-missing', 'Set backend URL first.');
    return;
  }
  try {
    const result = await backendFetch('/api/export');
    if (!result.state) throw new Error('Backend returned no state.');
    replaceState(result.state, true);
    updateSyncStatus('pulled', 'State pulled from backend.');
  } catch (error) {
    updateSyncStatus('backend-error', error.message);
  }
}

async function backendFetch(path, options = {}) {
  const current = getState();
  const baseUrl = (current.sync?.backendUrl || '').replace(/\/$/, '');
  if (!baseUrl) throw new Error('Backend URL is empty.');
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }
  return data;
}

function updateSyncStatus(status, message) {
  const next = cloneState();
  next.sync.lastSyncStatus = status;
  next.sync.lastSyncMessage = message;
  next.sync.lastSyncAt = new Date().toISOString();
  replaceState(next, true);
}

function startSimulation() {
  const current = getState();
  if (current.simulation?.active && !confirm('A simulation is already active. Replace it?')) return;
  const subject = current.settings.subject;
  const meta = getSubjectMeta(subject);
  const pool = getAppData().questions.filter((item) => item.subject === subject);
  if (!pool.length) {
    alert('No questions are loaded for this subject yet.');
    return;
  }
  const picked = shuffle(pool).slice(0, Math.min(meta.real_exam_questions, pool.length));
  const now = new Date();
  const next = cloneState();
  next.simulation = {
    active: true,
    subject,
    sessionId: `${current.settings.sessionLabel || 'session'}-exam-${now.getTime()}`,
    questionIds: picked.map((item) => item.id),
    currentIndex: 0,
    answers: {},
    startedAt: now.toISOString(),
    deadlineAt: new Date(now.getTime() + meta.real_exam_minutes * 60000).toISOString(),
    currentShownAt: now.toISOString(),
    targetCount: meta.real_exam_questions,
    durationMin: meta.real_exam_minutes,
    partialPool: picked.length < meta.real_exam_questions,
    lastSummary: next.simulation?.lastSummary || null,
  };
  replaceState(next, true);
}

renderSimulation = function() {
  const metaBox = document.getElementById('simulation-meta');
  const panel = document.getElementById('simulation-panel');
  if (!metaBox || !panel) return;

  const current = getState();
  const meta = getSubjectMeta(current.simulation?.active ? current.simulation.subject : current.settings.subject);
  const sim = current.simulation || defaultSimulationState();

  metaBox.innerHTML = [
    badge(meta?.name || current.settings.subject.toUpperCase()),
    badge(`${meta?.real_exam_questions || 0} real questions`),
    badge(`${meta?.real_exam_minutes || 0} minutes`),
    sim.partialPool ? badge(`partial pool: ${sim.questionIds.length}/${sim.targetCount}`) : '',
    sim.active ? `<span class="badge timer-badge${remainingMs(sim) <= 0 ? ' expired' : ''}" id="simulation-timer-value">${escapeHtml(formatRemaining(remainingMs(sim)))}</span>` : '',
  ].filter(Boolean).join('');

  stopSimulationClock();
  if (!sim.active) {
    panel.innerHTML = sim.lastSummary ? renderSimulationSummary(sim.lastSummary) : '<p class="empty-state">Start a subject simulation to approximate the real exam flow. It uses the currently loaded bank, so early simulations may be partial.</p>';
    return;
  }

  startSimulationClock();
  const question = getSimulationQuestion();
  if (!question) {
    panel.innerHTML = '<p class="empty-state">Simulation queue is empty.</p>';
    return;
  }

  const stored = sim.answers[question.id] || {};
  const progress = `${sim.currentIndex + 1}/${sim.questionIds.length}`;
  const answersHtml = Object.entries(question.choices || {}).map(([key, value]) => `
    <label class="answer-option">
      <input type="radio" name="simulation-answer" value="${key}" ${stored.userAnswer === key ? 'checked' : ''}>
      <span><strong>${key}.</strong> ${escapeHtml(value)}</span>
    </label>`).join('');

  panel.innerHTML = `
    <article class="question-card">
      <div class="question-meta">
        <span class="badge">Simulation</span>
        <span class="badge">${escapeHtml(progress)}</span>
        <span class="badge">${escapeHtml(question.block || 'general')}</span>
        <span class="badge">${escapeHtml(question.topic || 'topic')}</span>
      </div>
      <p class="question-prompt">${escapeHtml(question.prompt)}</p>
      <div class="answers-grid">${answersHtml}</div>
      <div class="answer-actions">
        <button id="simulation-prev-btn" type="button" class="ghost">Previous</button>
        <button id="simulation-save-btn" type="button">Save And Next</button>
        <button id="simulation-skip-btn" type="button" class="secondary">Skip</button>
      </div>
      <div class="micro-note">Answered so far: ${Object.keys(sim.answers || {}).length}. Unanswered questions can still be revisited before finishing.</div>
    </article>`;

  document.getElementById('simulation-prev-btn')?.addEventListener('click', () => moveSimulation(-1));
  document.getElementById('simulation-save-btn')?.addEventListener('click', () => saveSimulationAnswer(true));
  document.getElementById('simulation-skip-btn')?.addEventListener('click', () => moveSimulation(1, true));
}

function getSimulationQuestion() {
  const sim = getState().simulation || defaultSimulationState();
  const questionId = sim.questionIds[sim.currentIndex];
  return questionId ? api().getQuestionById(questionId) : null;
}

function moveSimulation(delta, skip = false) {
  const next = cloneState();
  if (!skip) {
    next.simulation.currentShownAt = new Date().toISOString();
  }
  next.simulation.currentIndex = Math.max(0, Math.min(next.simulation.questionIds.length - 1, next.simulation.currentIndex + delta));
  if (skip || delta !== 0) next.simulation.currentShownAt = new Date().toISOString();
  replaceState(next, true);
}

function saveSimulationAnswer(goNext) {
  const question = getSimulationQuestion();
  if (!question) return;
  const selected = document.querySelector('input[name="simulation-answer"]:checked');
  if (!selected) {
    alert('Choose an option first.');
    return;
  }
  const next = cloneState();
  const sim = next.simulation;
  const startedAt = sim.currentShownAt ? new Date(sim.currentShownAt) : new Date();
  const answeredAt = new Date();
  sim.answers[question.id] = {
    userAnswer: selected.value,
    correctAnswer: question.correct_answer,
    isCorrect: selected.value === question.correct_answer,
    answeredAt: answeredAt.toISOString(),
    durationSec: Math.max(1, Math.round((answeredAt - startedAt) / 1000)),
  };
  if (goNext && sim.currentIndex < sim.questionIds.length - 1) {
    sim.currentIndex += 1;
    sim.currentShownAt = new Date().toISOString();
  }
  replaceState(next, true);
}

finishSimulation = function() {
  const current = getState();
  const sim = current.simulation || defaultSimulationState();
  if (!sim.active) {
    alert('No active simulation to finish.');
    return;
  }
  const next = cloneState();
  const questionsById = new Map(getAppData().questions.map((item) => [item.id, item]));
  const answers = Object.entries(sim.answers || {});
  let correct = 0;

  answers.forEach(([questionId, answer]) => {
    const question = questionsById.get(questionId);
    if (!question) return;
    if (answer.isCorrect) correct += 1;
    next.attempts.push({
      timestamp: answer.answeredAt || new Date().toISOString(),
      localTime: api().helpers.formatLocal(new Date(answer.answeredAt || new Date().toISOString())),
      localDate: api().helpers.getLocalDate(new Date(answer.answeredAt || new Date().toISOString())),
      sessionId: sim.sessionId,
      quizId: question.quiz_set_id,
      questionId: question.id,
      questionPrompt: question.prompt,
      subject: question.subject,
      block: question.block,
      topic: question.topic,
      userAnswer: answer.userAnswer,
      correctAnswer: answer.correctAnswer,
      isCorrect: !!answer.isCorrect,
      durationSec: answer.durationSec,
    });
  });

  const started = new Date(sim.startedAt || new Date());
  const finished = new Date();
  next.studySessions.push({
    timestamp: finished.toISOString(),
    localTime: api().helpers.formatLocal(finished),
    localDate: api().helpers.getLocalDate(finished),
    sessionId: sim.sessionId,
    subject: sim.subject,
    activityType: 'mock_test',
    durationSec: Math.max(0, Math.round((finished - started) / 1000)),
    resourceId: `simulation/${sim.subject}`,
    title: `${getSubjectMeta(sim.subject)?.name || sim.subject} exam simulation`,
    block: 'simulation',
  });

  next.simulation = {
    ...defaultSimulationState(),
    lastSummary: {
      subject: sim.subject,
      sessionId: sim.sessionId,
      answered: answers.length,
      total: sim.questionIds.length,
      correct,
      accuracyPct: pct(correct, answers.length),
      startedAt: sim.startedAt,
      finishedAt: finished.toISOString(),
      partialPool: sim.partialPool,
    },
  };
  replaceState(next, false);
}

function renderSimulationSummary(summary) {
  return `
    <article class="simulation-summary">
      <h3>Last Simulation Summary</h3>
      <p><strong>Subject:</strong> ${escapeHtml(summary.subject?.toUpperCase() || '-')}</p>
      <p><strong>Session:</strong> ${escapeHtml(summary.sessionId || '-')}</p>
      <p><strong>Answered:</strong> ${summary.answered}/${summary.total}</p>
      <p><strong>Correct:</strong> ${summary.correct}</p>
      <p><strong>Accuracy:</strong> ${summary.accuracyPct}%</p>
      <p><strong>Finished:</strong> ${escapeHtml(formatDateTime(summary.finishedAt) || '-')}</p>
      ${summary.partialPool ? '<p class="micro-note">This run used a partial question pool because the loaded bank is still smaller than the real exam format.</p>' : ''}
    </article>`;
}

function startSimulationClock() {
  stopSimulationClock();
  simulationClock = window.setInterval(() => {
    const sim = getState().simulation;
    const badgeEl = document.getElementById('simulation-timer-value');
    if (!sim?.active || !badgeEl) {
      stopSimulationClock();
      return;
    }
    badgeEl.textContent = formatRemaining(remainingMs(sim));
    badgeEl.classList.toggle('expired', remainingMs(sim) <= 0);
  }, 1000);
}

function stopSimulationClock() {
  if (simulationClock) {
    window.clearInterval(simulationClock);
    simulationClock = null;
  }
}

function remainingMs(sim) {
  return new Date(sim.deadlineAt || new Date()).getTime() - Date.now();
}

function renderNotebook() {
  const current = getState();
  const subjectSelect = document.getElementById('mistake-subject-select');
  const statusSelect = document.getElementById('mistake-status-select');
  const mount = document.getElementById('mistake-notebook');
  if (!mount || !subjectSelect || !statusSelect) return;

  populateNotebookFilters(subjectSelect);
  subjectSelect.value = current.mistakeNotebook?.filterSubject || 'all';
  statusSelect.value = current.mistakeNotebook?.filterStatus || 'all';

  const entries = (current.mistakeNotebook?.entries || [])
    .filter((item) => (current.mistakeNotebook.filterSubject === 'all' || item.subject === current.mistakeNotebook.filterSubject))
    .filter((item) => (current.mistakeNotebook.filterStatus === 'all' || item.status === current.mistakeNotebook.filterStatus))
    .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));

  if (!entries.length) {
    mount.innerHTML = '<p class="empty-state">No notebook entries match current filters yet. Incorrect answers will appear here automatically.</p>';
    return;
  }

  mount.innerHTML = entries.map((entry) => `
    <article class="note-entry">
      <div class="note-meta">
        ${badge(entry.subject.toUpperCase())}
        ${badge(entry.status)}
        ${badge(entry.block || 'general')}
        ${badge(`wrong: ${entry.incorrectCount || 1}`)}
      </div>
      <p><strong>${escapeHtml(entry.questionId)}</strong> ${entry.promptPreview ? `- ${escapeHtml(entry.promptPreview)}` : ''}</p>
      <textarea data-note-id="${escapeHtml(entry.noteId)}">${escapeHtml(entry.note || '')}</textarea>
      <div class="note-actions">
        <label class="inline-form">Status
          <select data-note-status="${escapeHtml(entry.noteId)}">
            <option value="open" ${entry.status === 'open' ? 'selected' : ''}>Open</option>
            <option value="reviewing" ${entry.status === 'reviewing' ? 'selected' : ''}>Reviewing</option>
            <option value="resolved" ${entry.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          </select>
        </label>
        <button type="button" data-save-note="${escapeHtml(entry.noteId)}">Save Note</button>
        <button type="button" data-resolve-note="${escapeHtml(entry.noteId)}" class="ghost">Mark Resolved</button>
        <span class="small-label">Updated: ${escapeHtml(formatDateTime(entry.updatedAt) || '-')}</span>
      </div>
    </article>`).join('');

  mount.querySelectorAll('button[data-save-note]').forEach((button) => {
    button.addEventListener('click', () => saveNotebookEntry(button.dataset.saveNote, false));
  });
  mount.querySelectorAll('button[data-resolve-note]').forEach((button) => {
    button.addEventListener('click', () => saveNotebookEntry(button.dataset.resolveNote, true));
  });
}

function populateNotebookFilters(selectEl) {
  const current = getState();
  const subjects = getAppData().catalog.subjects || [];
  selectEl.innerHTML = ['<option value="all">All</option>'].concat(subjects.map((item) => `<option value="${item.id}">${item.name}</option>`)).join('');
  selectEl.value = current.mistakeNotebook?.filterSubject || 'all';
}

function hydrateNotebookFromAttempts(nextState) {
  let changed = false;
  const entries = nextState.mistakeNotebook?.entries || [];
  const byId = new Map(entries.map((item) => [item.noteId, item]));
  const wrongAttemptsById = new Map();

  nextState.attempts.filter((item) => !item.isCorrect).forEach((attempt) => {
    const noteId = `${attempt.subject}:${attempt.questionId}`;
    const bucket = wrongAttemptsById.get(noteId) || [];
    bucket.push(attempt);
    wrongAttemptsById.set(noteId, bucket);
  });

  entries.forEach((entry) => {
    const relatedAttempts = wrongAttemptsById.get(entry.noteId) || [];
    if (relatedAttempts.length) return;

    const hasManualNote = Boolean(String(entry.note || '').trim());
    if (!hasManualNote) {
      byId.delete(entry.noteId);
      changed = true;
      return;
    }

    if (entry.incorrectCount !== 0 || entry.status !== 'resolved') {
      entry.incorrectCount = 0;
      entry.status = 'resolved';
      entry.updatedAt = new Date().toISOString();
      changed = true;
    }
  });

  wrongAttemptsById.forEach((relatedAttempts, noteId) => {
    const lastAttempt = relatedAttempts[relatedAttempts.length - 1];
    const existing = byId.get(noteId);
    if (!existing) {
      byId.set(noteId, {
        noteId,
        questionId: lastAttempt.questionId,
        subject: lastAttempt.subject,
        block: lastAttempt.block,
        topic: lastAttempt.topic,
        promptPreview: shorten(lastAttempt.questionPrompt || '', 140),
        note: '',
        status: 'open',
        incorrectCount: relatedAttempts.length,
        createdAt: relatedAttempts[0].timestamp,
        updatedAt: lastAttempt.timestamp,
        lastAttemptAt: lastAttempt.timestamp,
      });
      changed = true;
      return;
    }

    if (
      existing.incorrectCount !== relatedAttempts.length
      || existing.lastAttemptAt !== lastAttempt.timestamp
      || existing.promptPreview !== shorten(lastAttempt.questionPrompt || '', 140)
    ) {
      existing.incorrectCount = relatedAttempts.length;
      existing.lastAttemptAt = lastAttempt.timestamp;
      existing.updatedAt = lastAttempt.timestamp;
      existing.promptPreview = shorten(lastAttempt.questionPrompt || '', 140);
      if (existing.status === 'resolved') existing.status = 'reviewing';
      changed = true;
    }
  });

  if (changed) {
    nextState.mistakeNotebook.entries = [...byId.values()].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
  }
  return changed;
}

function saveNotebookEntry(noteId, resolve) {
  const current = cloneState();
  const entry = (current.mistakeNotebook?.entries || []).find((item) => item.noteId === noteId);
  if (!entry) return;
  const textEl = document.querySelector(`textarea[data-note-id="${cssEscape(noteId)}"]`);
  const statusEl = document.querySelector(`select[data-note-status="${cssEscape(noteId)}"]`);
  entry.note = textEl ? textEl.value.trim() : entry.note;
  entry.status = resolve ? 'resolved' : (statusEl ? statusEl.value : entry.status);
  entry.updatedAt = new Date().toISOString();
  replaceState(current, false);
}

function countIncorrectAttempts(attempts, subject, questionId) {
  return attempts.filter((item) => item.subject === subject && item.questionId === questionId && !item.isCorrect).length;
}

function renderReviewQueue() {
  const current = getState();
  const summaryMount = document.getElementById('review-queue-summary');
  const listMount = document.getElementById('review-queue');
  const subjectSelect = document.getElementById('review-subject-select');
  const statusSelect = document.getElementById('review-status-select');
  if (!summaryMount || !listMount || !subjectSelect || !statusSelect) return;

  populateReviewFilters(subjectSelect);
  subjectSelect.value = current.reviewQueue?.filterSubject || 'current';
  statusSelect.value = current.reviewQueue?.filterStatus || 'due';

  const allEntries = buildReviewQueueEntries();
  const filtered = filterReviewQueueEntries(allEntries, current.reviewQueue || defaultReviewQueueState());
  const dueNow = allEntries.filter((item) => item.queueStatus === 'due').length;
  const upcoming = allEntries.filter((item) => item.queueStatus === 'upcoming').length;
  const resolved = allEntries.filter((item) => item.queueStatus === 'resolved').length;

  summaryMount.innerHTML = [
    badge(`due now: ${dueNow}`),
    badge(`upcoming: ${upcoming}`),
    badge(`resolved: ${resolved}`),
    badge(`visible: ${filtered.length}`),
  ].join('');

  if (!filtered.length) {
    listMount.innerHTML = '<p class="empty-state">No review items match this filter yet. Once you miss a question, it will enter the review queue automatically.</p>';
    return;
  }

  listMount.innerHTML = filtered.slice(0, 12).map((item) => `
    <article class="review-entry ${item.queueStatus}">
      <div class="note-meta">
        ${badge(item.subject.toUpperCase())}
        ${badge(item.queueStatus)}
        ${badge(item.stage)}
        ${badge(`wrong: ${item.incorrectCount}`)}
        ${badge(`streak: ${item.correctStreak}`)}
      </div>
      <p><strong>${escapeHtml(item.questionId)}</strong> ${item.promptPreview ? `- ${escapeHtml(item.promptPreview)}` : ''}</p>
      <p class="micro-note">${escapeHtml(item.scheduleNote)}</p>
      <div class="note-actions">
        <span class="small-label">Last attempt: ${escapeHtml(item.lastAttemptHuman)}</span>
        <span class="small-label">Next review: ${escapeHtml(item.nextReviewHuman)}</span>
        <button type="button" data-review-open="${escapeHtml(item.reviewKey)}">Open Review</button>
      </div>
    </article>`).join('');

  listMount.querySelectorAll('button[data-review-open]').forEach((button) => {
    button.addEventListener('click', () => openReviewEntry(button.dataset.reviewOpen));
  });
}

function populateReviewFilters(selectEl) {
  const current = getState();
  const subjects = getAppData().catalog.subjects || [];
  selectEl.innerHTML = ['<option value="current">Current Subject</option>', '<option value="all">All</option>']
    .concat(subjects.map((item) => `<option value="${item.id}">${item.name}</option>`)).join('');
  selectEl.value = current.reviewQueue?.filterSubject || 'current';
}

buildReviewQueueEntries = function() {
  const current = getState();
  const questionMap = new Map(getAppData().questions.map((item) => [item.id, item]));
  const grouped = new Map();
  const attempts = [...(current.attempts || [])].sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || '')));

  attempts.forEach((attempt) => {
    const key = `${attempt.subject}:${attempt.questionId}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        reviewKey: key,
        subject: attempt.subject,
        questionId: attempt.questionId,
        attempts: [],
        notebookEntry: null,
      });
    }
    grouped.get(key).attempts.push(attempt);
  });

  (current.mistakeNotebook?.entries || []).forEach((entry) => {
    const key = `${entry.subject}:${entry.questionId}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        reviewKey: key,
        subject: entry.subject,
        questionId: entry.questionId,
        attempts: [],
        notebookEntry: entry,
      });
      return;
    }
    grouped.get(key).notebookEntry = entry;
  });

  const now = Date.now();
  return [...grouped.values()].map((group) => {
    const question = questionMap.get(group.questionId);
    const attemptsForQuestion = group.attempts || [];
    const incorrectCount = attemptsForQuestion.filter((item) => !item.isCorrect).length || Number(group.notebookEntry?.incorrectCount || 0);
    const lastAttempt = attemptsForQuestion.at(-1) || null;
    const correctStreak = getCorrectStreak(attemptsForQuestion);
    const lastIncorrect = [...attemptsForQuestion].reverse().find((item) => !item.isCorrect) || null;
    const lastTimestamp = lastAttempt?.timestamp || group.notebookEntry?.lastAttemptAt || group.notebookEntry?.updatedAt || group.notebookEntry?.createdAt || null;
    const baseTimestamp = lastAttempt?.isCorrect ? (lastAttempt.timestamp || lastTimestamp) : (lastIncorrect?.timestamp || lastTimestamp);
    const intervalDays = getReviewIntervalDays(lastAttempt, correctStreak);
    const dueAt = baseTimestamp ? addDays(baseTimestamp, intervalDays) : null;
    const queueStatus = getQueueStatus(group.notebookEntry, lastAttempt, dueAt, now);
    const stage = lastAttempt?.isCorrect ? (correctStreak >= 3 ? 'strengthening' : 'recovering') : 'relearn';
    const promptPreview = group.notebookEntry?.promptPreview || question?.prompt || attemptsForQuestion.at(-1)?.questionPrompt || '';
    const priority = getReviewPriority(queueStatus, dueAt, incorrectCount, correctStreak);
    return {
      reviewKey: group.reviewKey,
      subject: group.subject,
      questionId: group.questionId,
      promptPreview: shorten(promptPreview, 140),
      incorrectCount,
      correctStreak,
      lastAttempt,
      lastAttemptHuman: formatDateTime(lastTimestamp) || '-',
      dueAt,
      nextReviewHuman: formatDateTime(dueAt) || 'now',
      queueStatus,
      stage,
      priority,
      scheduleNote: describeReviewSchedule(queueStatus, intervalDays, correctStreak, group.notebookEntry?.status || 'open'),
      available: !!question,
    };
  }).filter((item) => item.incorrectCount > 0).sort((a, b) => b.priority - a.priority || String(a.nextReviewHuman).localeCompare(String(b.nextReviewHuman)));
}

function filterReviewQueueEntries(entries, reviewState) {
  const currentSubject = getState().settings.subject;
  const subjectFilter = reviewState?.filterSubject || 'current';
  const statusFilter = reviewState?.filterStatus || 'due';
  return entries
    .filter((item) => item.available)
    .filter((item) => {
      if (subjectFilter === 'current') return item.subject === currentSubject;
      if (subjectFilter === 'all') return true;
      return item.subject === subjectFilter;
    })
    .filter((item) => {
      if (statusFilter === 'all') return true;
      return item.queueStatus === statusFilter;
    });
}

function openNextReview(includeUpcoming) {
  const entries = buildReviewQueueEntries();
  const reviewState = getState().reviewQueue || defaultReviewQueueState();
  const filtered = filterReviewQueueEntries(entries, reviewState);
  const filteredDue = filtered.filter((item) => item.queueStatus === 'due');
  const target = filteredDue[0] || (includeUpcoming ? filtered[0] || entries[0] : null);
  if (!target) {
    alert('No review question is ready under the current filter yet.');
    return;
  }
  openReviewEntry(target.reviewKey);
}

function openReviewEntry(reviewKey) {
  const entry = buildReviewQueueEntries().find((item) => item.reviewKey === reviewKey);
  if (!entry) {
    alert('This review entry is no longer available.');
    return;
  }
  const next = cloneState();
  next.reviewQueue = next.reviewQueue || defaultReviewQueueState();
  next.reviewQueue.lastOpenedQuestionId = entry.questionId;
  replaceState(next, true);
  api().setCurrentQuestion(entry.questionId, { switchSubject: true, trackSession: true });
  document.getElementById('question-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getCorrectStreak(attempts) {
  let streak = 0;
  for (let index = attempts.length - 1; index >= 0; index -= 1) {
    if (attempts[index].isCorrect) streak += 1;
    else break;
  }
  return streak;
}

function getReviewIntervalDays(lastAttempt, correctStreak) {
  if (!lastAttempt || !lastAttempt.isCorrect) return 0;
  if (correctStreak <= 1) return 1;
  if (correctStreak === 2) return 3;
  if (correctStreak === 3) return 7;
  if (correctStreak === 4) return 14;
  return 30;
}

function getQueueStatus(notebookEntry, lastAttempt, dueAt, nowMs) {
  if (!lastAttempt || !lastAttempt.isCorrect) return 'due';
  if (notebookEntry?.status === 'resolved' && dueAt && new Date(dueAt).getTime() > nowMs) return 'resolved';
  if (!dueAt) return 'due';
  return new Date(dueAt).getTime() <= nowMs ? 'due' : 'upcoming';
}

function getReviewPriority(queueStatus, dueAt, incorrectCount, correctStreak) {
  const dueMs = dueAt ? new Date(dueAt).getTime() : 0;
  if (queueStatus === 'due') return 1_000_000 - dueMs + incorrectCount * 1000 - correctStreak * 25;
  if (queueStatus === 'upcoming') return 500_000 - dueMs + incorrectCount * 500 - correctStreak * 10;
  return 100_000 - dueMs + incorrectCount * 100;
}

function describeReviewSchedule(queueStatus, intervalDays, correctStreak, notebookStatus) {
  if (queueStatus === 'due' && correctStreak === 0) return 'Answered incorrectly last time. Review this now.';
  if (queueStatus === 'due') return `Review is due now after a ${intervalDays}-day spacing interval.`;
  if (queueStatus === 'resolved') return `Notebook marked resolved. Next spacing step is ${intervalDays} day(s).`;
  return `Next repetition in ${intervalDays} day(s). Notebook status: ${notebookStatus}.`;
}

function addDays(timestamp, days) {
  const base = new Date(timestamp);
  if (Number.isNaN(base.getTime())) return null;
  base.setDate(base.getDate() + Number(days || 0));
  return base.toISOString();
}

function getSubjectMeta(subjectId) {
  return (getAppData().catalog.subjects || []).find((item) => item.id === subjectId) || null;
}

function badge(text) {
  return `<span class="badge">${escapeHtml(text)}</span>`;
}

function shuffle(items) {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function pct(correct, total) {
  return total ? Math.round((correct / total) * 1000) / 10 : 0;
}

function formatRemaining(ms) {
  const safe = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(date);
}

function shorten(value, limit) {
  const text = String(value || '');
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 3)).trimEnd()}...`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function cssEscape(value) {
  return String(value).replaceAll('"', '\\"');
}

// === BILINGUAL EXT OVERRIDE START ===
function extQuestion(question) { return api().helpers.getLocalizedQuestion(question); }
function extSubject(subjectId) { return api().helpers.getSubjectLabel(subjectId); }
function renderSimulation() { const metaBox = document.getElementById('simulation-meta'); const panel = document.getElementById('simulation-panel'); if (!metaBox || !panel) return; const current = getState(); const meta = getSubjectMeta(current.simulation?.active ? current.simulation.subject : current.settings.subject); const sim = current.simulation || defaultSimulationState(); metaBox.innerHTML = [badge(extSubject(current.simulation?.active ? current.simulation.subject : current.settings.subject)), badge(`${meta?.real_exam_questions || 0} real questions`), badge(`${meta?.real_exam_minutes || 0} minutes`), sim.partialPool ? badge(`partial pool: ${sim.questionIds.length}/${sim.targetCount}`) : '', sim.active ? `<span class="badge timer-badge${remainingMs(sim) <= 0 ? ' expired' : ''}" id="simulation-timer-value">${escapeHtml(formatRemaining(remainingMs(sim)))}</span>` : ''].filter(Boolean).join(''); stopSimulationClock(); if (!sim.active) { panel.innerHTML = sim.lastSummary ? renderSimulationSummary(sim.lastSummary) : '<p class="empty-state">Start a subject simulation to approximate the real exam flow. It uses the currently loaded bank, so early simulations may be partial.</p>'; return; } startSimulationClock(); const question = getSimulationQuestion(); if (!question) { panel.innerHTML = '<p class="empty-state">Simulation queue is empty.</p>'; return; } const q = extQuestion(question); const stored = sim.answers[question.id] || {}; const progress = `${sim.currentIndex + 1}/${sim.questionIds.length}`; const answersHtml = Object.entries(q.choices || {}).map(([key, value]) => `<label class="answer-option"><input type="radio" name="simulation-answer" value="${key}" ${stored.userAnswer === key ? 'checked' : ''}><span><strong>${key}.</strong> ${escapeHtml(value)}</span></label>`).join(''); panel.innerHTML = `<article class="question-card"><div class="question-meta"><span class="badge">Simulation</span><span class="badge">${escapeHtml(progress)}</span><span class="badge">${escapeHtml(question.block || 'general')}</span><span class="badge">${escapeHtml(question.topic || 'topic')}</span><span class="badge">${escapeHtml(q.displayLanguage?.toUpperCase() || 'EN')}</span></div><p class="question-prompt">${escapeHtml(q.prompt)}</p><div class="answers-grid">${answersHtml}</div><div class="answer-actions"><button id="simulation-prev-btn" type="button" class="ghost">Previous</button><button id="simulation-save-btn" type="button">Save And Next</button><button id="simulation-skip-btn" type="button" class="secondary">Skip</button></div><div class="micro-note">Answered so far: ${Object.keys(sim.answers || {}).length}. Unanswered questions can still be revisited before finishing.</div></article>`; document.getElementById('simulation-prev-btn')?.addEventListener('click', () => moveSimulation(-1)); document.getElementById('simulation-save-btn')?.addEventListener('click', () => saveSimulationAnswer(true)); document.getElementById('simulation-skip-btn')?.addEventListener('click', () => moveSimulation(1, true)); }
function finishSimulation() { const current = getState(); const sim = current.simulation || defaultSimulationState(); if (!sim.active) { alert('No active simulation to finish.'); return; } const next = cloneState(); const questionsById = new Map(getAppData().questions.map((item) => [item.id, item])); const answers = Object.entries(sim.answers || {}); let correct = 0; answers.forEach(([questionId, answer]) => { const question = questionsById.get(questionId); if (!question) return; const q = extQuestion(question); if (answer.isCorrect) correct += 1; next.attempts.push({ entryId: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: answer.answeredAt || new Date().toISOString(), localTime: api().helpers.formatLocal(new Date(answer.answeredAt || new Date().toISOString())), localDate: api().helpers.getLocalDate(new Date(answer.answeredAt || new Date().toISOString())), sessionId: sim.sessionId, quizId: question.quiz_set_id, questionId: question.id, questionPrompt: q.prompt, questionPromptCanonical: question.prompt, questionLanguage: q.displayLanguage, subject: question.subject, block: question.block, topic: question.topic, userAnswer: answer.userAnswer, correctAnswer: answer.correctAnswer, isCorrect: !!answer.isCorrect, durationSec: answer.durationSec }); }); const started = new Date(sim.startedAt || new Date()); const finished = new Date(); next.studySessions.push({ entryId: `study-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: finished.toISOString(), localTime: api().helpers.formatLocal(finished), localDate: api().helpers.getLocalDate(finished), sessionId: sim.sessionId, subject: sim.subject, activityType: 'mock_test', durationSec: Math.max(0, Math.round((finished - started) / 1000)), resourceId: `simulation/${sim.subject}`, title: `${extSubject(sim.subject)} exam simulation`, block: 'simulation' }); next.simulation = { ...defaultSimulationState(), lastSummary: { subject: sim.subject, sessionId: sim.sessionId, answered: answers.length, total: sim.questionIds.length, correct, accuracyPct: pct(correct, answers.length), startedAt: sim.startedAt, finishedAt: finished.toISOString(), partialPool: sim.partialPool } }; replaceState(next, false); }
function buildReviewQueueEntries() { const current = getState(); const questionMap = new Map(getAppData().questions.map((item) => [item.id, item])); const grouped = new Map(); const attempts = [...(current.attempts || [])].sort((a, b) => String(a.timestamp || '').localeCompare(String(b.timestamp || ''))); attempts.forEach((attempt) => { const key = `${attempt.subject}:${attempt.questionId}`; if (!grouped.has(key)) grouped.set(key, { reviewKey: key, subject: attempt.subject, questionId: attempt.questionId, attempts: [], notebookEntry: null }); grouped.get(key).attempts.push(attempt); }); (current.mistakeNotebook?.entries || []).forEach((entry) => { const key = `${entry.subject}:${entry.questionId}`; if (!grouped.has(key)) { grouped.set(key, { reviewKey: key, subject: entry.subject, questionId: entry.questionId, attempts: [], notebookEntry: entry }); return; } grouped.get(key).notebookEntry = entry; }); const now = Date.now(); return [...grouped.values()].map((group) => { const question = questionMap.get(group.questionId); const q = question ? extQuestion(question) : null; const attemptsForQuestion = group.attempts || []; const incorrectCount = attemptsForQuestion.filter((item) => !item.isCorrect).length || Number(group.notebookEntry?.incorrectCount || 0); const lastAttempt = attemptsForQuestion.at(-1) || null; const correctStreak = getCorrectStreak(attemptsForQuestion); const lastIncorrect = [...attemptsForQuestion].reverse().find((item) => !item.isCorrect) || null; const lastTimestamp = lastAttempt?.timestamp || group.notebookEntry?.lastAttemptAt || group.notebookEntry?.updatedAt || group.notebookEntry?.createdAt || null; const baseTimestamp = lastAttempt?.isCorrect ? (lastAttempt.timestamp || lastTimestamp) : (lastIncorrect?.timestamp || lastTimestamp); const intervalDays = getReviewIntervalDays(lastAttempt, correctStreak); const dueAt = baseTimestamp ? addDays(baseTimestamp, intervalDays) : null; const queueStatus = getQueueStatus(group.notebookEntry, lastAttempt, dueAt, now); const stage = lastAttempt?.isCorrect ? (correctStreak >= 3 ? 'strengthening' : 'recovering') : 'relearn'; const promptPreview = group.notebookEntry?.promptPreview || q?.prompt || attemptsForQuestion.at(-1)?.questionPrompt || ''; const priority = getReviewPriority(queueStatus, dueAt, incorrectCount, correctStreak); return { reviewKey: group.reviewKey, subject: group.subject, questionId: group.questionId, promptPreview: shorten(promptPreview, 140), incorrectCount, correctStreak, lastAttempt, lastAttemptHuman: formatDateTime(lastTimestamp) || '-', dueAt, nextReviewHuman: formatDateTime(dueAt) || 'now', queueStatus, stage, priority, scheduleNote: describeReviewSchedule(queueStatus, intervalDays, correctStreak, group.notebookEntry?.status || 'open'), available: !!question }; }).filter((item) => item.incorrectCount > 0).sort((a, b) => b.priority - a.priority || String(a.nextReviewHuman).localeCompare(String(b.nextReviewHuman))); }
// === BILINGUAL EXT OVERRIDE END ===
