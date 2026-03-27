const VIEW_KEY = 'master-prep-active-view-v1';

function getStoredView() {
  try {
    return window.localStorage.getItem(VIEW_KEY);
  } catch {
    return null;
  }
}

function setStoredView(view) {
  try {
    window.localStorage.setItem(VIEW_KEY, view);
  } catch {
    // ignore storage failures and keep navigation functional
  }
}

function activateView(view) {
  const tabs = Array.from(document.querySelectorAll('[data-view-target]'));
  const panes = Array.from(document.querySelectorAll('.view-pane'));
  const fallback = panes[0]?.dataset.view || 'today';
  const target = panes.some((pane) => pane.dataset.view === view) ? view : fallback;

  tabs.forEach((tab) => {
    const active = tab.dataset.viewTarget === target;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  panes.forEach((pane) => {
    const active = pane.dataset.view === target;
    pane.classList.toggle('is-active', active);
    pane.hidden = !active;
  });

  setStoredView(target);
}

function bindTabButtons() {
  document.querySelectorAll('[data-view-target]').forEach((button) => {
    button.addEventListener('click', () => activateView(button.dataset.viewTarget));
  });

  document.querySelectorAll('[data-open-view]').forEach((button) => {
    button.addEventListener('click', () => activateView(button.dataset.openView));
  });
}

function bindIntentShortcuts() {
  const routeMap = {
    'next-question-btn': 'trainer',
    'reset-session-btn': 'trainer',
    'undo-last-attempt-btn': 'trainer',
    'undo-last-study-btn': 'trainer',
    'simulation-start-btn': 'simulation',
    'simulation-resume-btn': 'simulation',
    'simulation-finish-btn': 'simulation',
    'review-open-next-btn': 'review',
    'review-open-any-btn': 'review',
  };

  Object.entries(routeMap).forEach(([id, view]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      window.setTimeout(() => activateView(view), 0);
    });
  });
}

function init() {
  bindTabButtons();
  bindIntentShortcuts();
  activateView(getStoredView() || 'today');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
