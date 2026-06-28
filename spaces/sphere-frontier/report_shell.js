(() => {
  function injectStyles() {
    if (document.getElementById('report-shell-style')) return;
    const style = document.createElement('style');
    style.id = 'report-shell-style';
    style.textContent = `
      .report-shell { display: grid; gap: 18px; }
      .report-nav-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 14px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05); position: sticky; top: 14px; z-index: 10; }
      .report-nav { display: flex; flex-wrap: wrap; gap: 10px; }
      .report-tab { border: 1px solid #cbd5e1; border-radius: 999px; background: white; color: #0f172a; padding: 10px 14px; cursor: pointer; }
      .report-tab.active { background: #1d4ed8; color: white; border-color: transparent; }
      .report-pane { display: none; gap: 16px; }
      .report-pane.active { display: grid; }
      .report-fold { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 16px 20px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05); }
      .report-fold summary { cursor: pointer; font-weight: 700; color: #1d4ed8; }
      .report-fold-body { margin-top: 16px; display: grid; gap: 16px; }
      @media (max-width: 760px) { body { padding: 16px; } .report-nav-card { top: 8px; } }
    `;
    document.head.appendChild(style);
  }

  function activateView(view) {
    document.querySelectorAll('.report-tab').forEach((button) => {
      button.classList.toggle('active', button.dataset.reportView === view);
    });
    document.querySelectorAll('.report-pane').forEach((pane) => {
      pane.classList.toggle('active', pane.dataset.reportPane === view);
    });
  }

  function foldExtras(pane, startIndex, title) {
    const children = Array.from(pane.children);
    if (children.length <= startIndex) return;
    const details = document.createElement('details');
    details.className = 'report-fold';
    details.innerHTML = `<summary>${title}</summary><div class="report-fold-body"></div>`;
    const body = details.querySelector('.report-fold-body');
    children.slice(startIndex).forEach((child) => body.appendChild(child));
    pane.appendChild(details);
  }

  function buildTabs() {
    if (document.querySelector('.report-shell')) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const topLevel = Array.from(document.body.children).filter((node) => !node.matches('.hero, script'));
    if (!topLevel.length) return;

    const shell = document.createElement('section');
    shell.className = 'report-shell';

    const navCard = document.createElement('section');
    navCard.className = 'report-nav-card';
    navCard.innerHTML = [
      '<div class="report-nav">',
      '<button type="button" class="report-tab active" data-report-view="overview">Overview</button>',
      '<button type="button" class="report-tab" data-report-view="subjects">Subjects</button>',
      '<button type="button" class="report-tab" data-report-view="history">History</button>',
      '</div>',
    ].join('');

    const overview = document.createElement('div');
    overview.className = 'report-pane active';
    overview.dataset.reportPane = 'overview';

    const subjects = document.createElement('div');
    subjects.className = 'report-pane';
    subjects.dataset.reportPane = 'subjects';

    const history = document.createElement('div');
    history.className = 'report-pane';
    history.dataset.reportPane = 'history';

    let bucket = overview;
    topLevel.forEach((node) => {
      if (node.id === 'subject-summary') bucket = subjects;
      if (node.id === 'history-logs') bucket = history;
      bucket.appendChild(node);
    });

    foldExtras(subjects, 3, 'Additional subject cuts');
    foldExtras(history, 1, 'Detailed logs');

    shell.append(navCard, overview, subjects, history);
    hero.insertAdjacentElement('afterend', shell);

    navCard.querySelectorAll('[data-report-view]').forEach((button) => {
      button.addEventListener('click', () => activateView(button.dataset.reportView));
    });
  }

  function init() {
    injectStyles();
    buildTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
