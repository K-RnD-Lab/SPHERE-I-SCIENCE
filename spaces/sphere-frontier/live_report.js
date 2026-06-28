(() => {
  const STORAGE_KEY = 'master-prep-trainer-v1';
  const SUBJECT_ORDER = ['tznk', 'english', 'it'];
  const SUBJECT_LABELS = { tznk: 'TZNK', english: 'English', it: 'IT' };
  const REAL_EXAM_SIZE = { tznk: 33, english: 30, it: 140 };

  function readState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function pct(correct, total) {
    return total ? Math.round((correct / total) * 1000) / 10 : 0;
  }

  function formatDuration(seconds) {
    const total = Math.max(0, Number(seconds || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = Math.floor(total % 60);
    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    return `${secs}s`;
  }

  function formatLocal(value) {
    if (!value) return 'n/a';
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

  function getLastActivity(state) {
    const timestamps = [];
    (state.attempts || []).forEach((item) => item.timestamp && timestamps.push(item.timestamp));
    (state.studySessions || []).forEach((item) => item.timestamp && timestamps.push(item.timestamp));
    if (!timestamps.length) return null;
    return timestamps.sort().slice(-1)[0];
  }

  function getLocalDay(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function getBestStreak(days) {
    if (!days.length) return 0;
    const sorted = [...new Set(days)].sort();
    let best = 1;
    let current = 1;
    for (let index = 1; index < sorted.length; index += 1) {
      const prev = new Date(`${sorted[index - 1]}T00:00:00`);
      const next = new Date(`${sorted[index]}T00:00:00`);
      const diff = Math.round((next - prev) / 86400000);
      if (diff === 1) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 1;
      }
    }
    return best;
  }

  function projectBand(correct, attempts, subject) {
    if (!attempts) return 'n/a';
    const accuracy = correct / attempts;
    const examSize = REAL_EXAM_SIZE[subject] || attempts;
    const projectedRaw = Math.round(accuracy * examSize * 10) / 10;
    const center = 100 + accuracy * 100;
    const confidence = Math.min(1, attempts / Math.max(examSize, 1));
    const spread = Math.round((1 - confidence) * 16 + 6);
    return `${Math.max(100, Math.round(center - spread))}-${Math.min(200, Math.round(center + spread))} (~${projectedRaw})`;
  }

  function summarize(state) {
    const attempts = state.attempts || [];
    const studies = state.studySessions || [];
    const notebookEntries = state.mistakeNotebook?.entries || [];
    const days = [];
    const subjectStats = {};
    SUBJECT_ORDER.forEach((subject) => {
      const subjectAttempts = attempts.filter((item) => item.subject === subject);
      const correct = subjectAttempts.filter((item) => item.isCorrect).length;
      const answerSeconds = subjectAttempts.reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
      const materialSeconds = studies.filter((item) => item.subject === subject && item.activityType === 'material').reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
      const extraStudySeconds = studies.filter((item) => item.subject === subject && item.activityType !== 'material').reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
      const studySeconds = answerSeconds + materialSeconds + extraStudySeconds;
      const actual = state.actualResults?.[subject] || {};
      const notebookOpen = notebookEntries.filter((item) => item.subject === subject && item.status !== 'resolved').length;
      subjectStats[subject] = {
        answered: subjectAttempts.length,
        correct,
        accuracy: pct(correct, subjectAttempts.length),
        studySeconds,
        materialSeconds,
        answerSeconds,
        coverage: pct(subjectAttempts.length, REAL_EXAM_SIZE[subject] || 1),
        projected: projectBand(correct, subjectAttempts.length, subject),
        actualScore: actual.officialScore || 'not entered',
        notebookOpen,
      };
    });
    attempts.forEach((item) => item.timestamp && days.push(getLocalDay(item.timestamp)));
    studies.forEach((item) => item.timestamp && days.push(getLocalDay(item.timestamp)));
    const validDays = days.filter(Boolean);
    const totalCorrect = attempts.filter((item) => item.isCorrect).length;
    const totalStudySeconds = attempts.reduce((sum, item) => sum + Number(item.durationSec || 0), 0) + studies.reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
    const materialTime = studies.filter((item) => item.activityType === 'material').reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
    const quizTime = attempts.reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
    const weakest = SUBJECT_ORDER
      .map((subject) => ({ subject, accuracy: subjectStats[subject].answered ? subjectStats[subject].accuracy : 101 }))
      .filter((item) => item.accuracy <= 100)
      .sort((a, b) => a.accuracy - b.accuracy)[0]?.subject || 'n/a';
    return {
      attempts: attempts.length,
      correct: totalCorrect,
      accuracy: pct(totalCorrect, attempts.length),
      sessions: new Set(attempts.map((item) => item.sessionId).filter(Boolean)).size,
      activeDays: new Set(validDays).size,
      streak: getBestStreak(validDays),
      totalStudySeconds,
      materialTime,
      quizTime,
      weakest,
      actualResults: SUBJECT_ORDER.filter((subject) => (state.actualResults?.[subject]?.officialScore || '').trim()).length,
      notebookTotal: notebookEntries.length,
      notebookOpen: notebookEntries.filter((item) => item.status !== 'resolved').length,
      subjectStats,
      lastActivity: getLastActivity(state),
      syncStatus: state.sync?.lastSyncStatus || 'local-only',
      syncMessage: state.sync?.lastSyncMessage || 'Local browser mode',
    };
  }

  function updateMetric(key, value) {
    const node = document.querySelector(`[data-metric="${key}"] .metric-value`);
    if (node) node.textContent = value;
  }

  function updateSubjectCard(subject, stats) {
    const card = document.querySelector(`.subject-card[data-subject="${subject}"]`);
    if (!card) return;
    const set = (metric, value) => {
      const node = card.querySelector(`[data-subject-metric="${metric}"] span`);
      if (node) node.textContent = value;
    };
    set('answered', stats.answered);
    set('correct', stats.correct);
    set('accuracy', `${stats.accuracy}%`);
    set('study', formatDuration(stats.studySeconds));
    set('materials', formatDuration(stats.materialSeconds));
    set('quiz', formatDuration(stats.answerSeconds));
    set('coverage', `${stats.coverage}%`);
    set('projected', stats.projected);
    set('actual', stats.actualScore);
    set('notebook', stats.notebookOpen);
  }

  function buildCard(title, value, note) {
    return `<div class="live-pill"><strong>${title}</strong><br>${value}<div class="live-note">${note}</div></div>`;
  }

  function overlayCanonical(summary) {
    updateMetric('attempts', summary.attempts);
    updateMetric('correct', summary.correct);
    updateMetric('accuracy', `${summary.accuracy}%`);
    updateMetric('sessions', summary.sessions);
    updateMetric('active-days', summary.activeDays);
    updateMetric('streak', `${summary.streak} day(s)`);
    updateMetric('study-time', formatDuration(summary.totalStudySeconds));
    updateMetric('materials-time', formatDuration(summary.materialTime));
    updateMetric('quiz-time', formatDuration(summary.quizTime));
    updateMetric('weakest', SUBJECT_LABELS[summary.weakest] || 'n/a');
    updateMetric('actual-results', summary.actualResults);
    updateMetric('notebook-total', summary.notebookTotal);
    updateMetric('notebook-open', summary.notebookOpen);
    SUBJECT_ORDER.forEach((subject) => updateSubjectCard(subject, summary.subjectStats[subject]));
  }

  function render() {
    const mount = document.getElementById('live-local-panel');
    if (!mount) return;

    const state = readState();
    if (!state) {
      mount.innerHTML = '<h3>Live Local Sync</h3><p>No trainer local state found in this browser yet. Open trainer.html, answer a few questions, then reload this page.</p>';
      return;
    }

    const summary = summarize(state);
    overlayCanonical(summary);

    mount.innerHTML = `
      <h3>Live Local Sync</h3>
      <p>This block reads the trainer localStorage in the current browser. It updates on page load, every 30 seconds, and on cross-tab storage events.</p>
      <p><strong>Important:</strong> top counters and subject cards now mirror your browser-local trainer state. Deeper canonical charts still refresh after backend sync or after importing an exported JSON into the repo logs.</p>
      <div class="live-grid">
        ${buildCard('Local attempts', summary.attempts, `${summary.accuracy}% accuracy`)}
        ${buildCard('Local study time', formatDuration(summary.totalStudySeconds), 'trainer local state')}
        ${buildCard('Last local activity', formatLocal(summary.lastActivity), 'Europe/Kyiv')}
        ${buildCard('Canonical sync state', summary.syncStatus, summary.syncMessage)}
      </div>
    `;
  }

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) render();
  });

  render();
  window.setInterval(render, 30000);
})();
