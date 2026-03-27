(() => {
  const COPY = {
    en: {
      '.workspace-head .section-kicker': 'Workspace',
      '.workspace-head h2': 'Plan for today',
      '.workspace-copy': 'Recommended order: material -> practice -> review -> analytics. Everything is saved automatically in the browser.',
      '.view-tab[data-view-target="today"]': 'Today',
      '.view-tab[data-view-target="trainer"]': 'Trainer',
      '.view-tab[data-view-target="simulation"]': 'Simulation',
      '.view-tab[data-view-target="review"]': 'Review',
      '.view-tab[data-view-target="analytics"]': 'Analytics',
      '.guide-card .section-kicker': 'Quick route',
      '.guide-card h2': 'How to use this space',
      '[data-open-view="trainer"]': 'Open trainer',
      '[data-open-view="simulation"]': 'Open simulation',
      '[data-open-view="review"]': 'Open review',
      '[data-open-view="analytics"]': 'Open analytics',
      '.materials-card .section-kicker': 'Materials',
      '.materials-card h2': 'Materials before testing',
      '.materials-card-note': 'If you log a study block by mistake, use the undo button above.',
      '#undo-last-study-btn': 'Undo Last Study Log',
      '.trainer-shell .section-kicker': 'Trainer',
      '.trainer-shell h2': 'Current practice question',
      '#next-question-btn': 'Next Question',
      '#reset-session-btn': 'Reset Session Queue',
      '#undo-last-attempt-btn': 'Undo Last Answer',
      '.simulation-shell .section-kicker': 'Simulation',
      '.simulation-shell h2': 'Exam simulation',
      '#simulation-start-btn': 'Start Simulation',
      '#simulation-resume-btn': 'Resume Simulation',
      '#simulation-finish-btn': 'Finish And Log',
      '.review-notebook-card .section-kicker': 'Notebook',
      '.review-notebook-card h2': 'Mistake notebook',
      '.review-notebook-card label:nth-of-type(1) > span': 'Subject',
      '.review-notebook-card label:nth-of-type(2) > span': 'Status',
      '#mistake-status-select option[value="all"]': 'All',
      '#mistake-status-select option[value="open"]': 'Open',
      '#mistake-status-select option[value="reviewing"]': 'Reviewing',
      '#mistake-status-select option[value="resolved"]': 'Resolved',
      '.review-queue-card .section-kicker': 'Review loop',
      '.review-queue-card h2': 'Spaced repetition queue',
      '.review-queue-card label:nth-of-type(1) > span': 'Subject',
      '.review-queue-card label:nth-of-type(2) > span': 'Queue',
      '#review-status-select option[value="due"]': 'Due Now',
      '#review-status-select option[value="upcoming"]': 'Upcoming',
      '#review-status-select option[value="resolved"]': 'Resolved',
      '#review-status-select option[value="all"]': 'All',
      '#review-open-next-btn': 'Open next review',
      '#review-open-any-btn': 'Open best available',
      '.hub-card .section-kicker': 'Hub',
      '.hub-card h2': 'Embedded progress hub',
      '.hub-note': 'This embedded report lives in the same browser space and mirrors trainer local progress through the live-local overlay.',
      '.projection-card-shell .section-kicker': 'Projection',
      '.projection-card-shell h2': 'Readiness and score estimate',
      '.projection-note': 'Projected score bands are unofficial heuristics for planning. Official conversions belong to the real admission cycle.',
      '.focus-card-shell .section-kicker': 'Focus',
      '.focus-card-shell h2': 'Where to push harder',
      '.analytics-log-card summary': 'Detailed history and logs',
      '.analytics-log-card label:nth-of-type(1) > span': 'Subject',
      '.analytics-log-card label:nth-of-type(2) > span': 'Status',
      '.analytics-log-card label:nth-of-type(3) > span': 'Period',
      '.analytics-log-card label:nth-of-type(4) > span': 'Date',
      '.analytics-log-card label:nth-of-type(5) > span': 'Week',
      '.analytics-log-card label:nth-of-type(6) > span': 'Session',
      '#history-status-select option[value="all"]': 'All',
      '#history-status-select option[value="correct"]': 'Correct',
      '#history-status-select option[value="incorrect"]': 'Incorrect',
      '#history-period-select option[value="all"]': 'All Time',
      '#history-period-select option[value="today"]': 'Today',
      '#history-period-select option[value="this_week"]': 'This Week',
      '#history-period-select option[value="last_7_days"]': 'Last 7 Days',
      '#history-period-select option[value="specific_day"]': 'Specific Day',
      '#history-period-select option[value="specific_week"]': 'Specific Week',
      '.table-grid > div:nth-of-type(1) h3': 'Attempt log',
      '.table-grid > div:nth-of-type(2) h3': 'Study log',
      '.advanced-details summary': 'Optional Sync, Backups, and GitHub',
      '.advanced-panel .section-kicker': 'Advanced',
      '.advanced-panel h2': 'Backend Sync',
      '.advanced-panel label:nth-of-type(1)': 'Backend URL',
      '.advanced-panel label:nth-of-type(2) > span': 'Auto Sync To Backend',
      '#backend-check-btn': 'Check Backend',
      '#backend-sync-btn': 'Sync Now',
      '#backend-pull-btn': 'Pull From Backend'
    },
    uk: {
      '.workspace-head .section-kicker': 'Робочий простір',
      '.workspace-head h2': 'План на сьогодні',
      '.workspace-copy': 'Рекомендований порядок: матеріал -> практика -> повторення -> аналітика. Усе автоматично зберігається в браузері.',
      '.view-tab[data-view-target="today"]': 'Сьогодні',
      '.view-tab[data-view-target="trainer"]': 'Тренер',
      '.view-tab[data-view-target="simulation"]': 'Симуляція',
      '.view-tab[data-view-target="review"]': 'Повторення',
      '.view-tab[data-view-target="analytics"]': 'Аналітика',
      '.guide-card .section-kicker': 'Швидкий маршрут',
      '.guide-card h2': 'Як цим користуватися',
      '[data-open-view="trainer"]': 'Відкрити тренер',
      '[data-open-view="simulation"]': 'Відкрити симуляцію',
      '[data-open-view="review"]': 'Відкрити повторення',
      '[data-open-view="analytics"]': 'Відкрити аналітику',
      '.materials-card .section-kicker': 'Матеріали',
      '.materials-card h2': 'Матеріали перед тестуванням',
      '.materials-card-note': 'Якщо випадково залогувала блок навчання, скористайся кнопкою скасування вище.',
      '#undo-last-study-btn': 'Скасувати останній запис часу',
      '.trainer-shell .section-kicker': 'Тренер',
      '.trainer-shell h2': 'Поточне тренувальне питання',
      '#next-question-btn': 'Наступне питання',
      '#reset-session-btn': 'Скинути чергу сесії',
      '#undo-last-attempt-btn': 'Скасувати останню відповідь',
      '.simulation-shell .section-kicker': 'Симуляція',
      '.simulation-shell h2': 'Імітація іспиту',
      '#simulation-start-btn': 'Почати симуляцію',
      '#simulation-resume-btn': 'Продовжити симуляцію',
      '#simulation-finish-btn': 'Завершити і зберегти',
      '.review-notebook-card .section-kicker': 'Нотатник',
      '.review-notebook-card h2': 'Зошит помилок',
      '.review-notebook-card label:nth-of-type(1) > span': 'Предмет',
      '.review-notebook-card label:nth-of-type(2) > span': 'Статус',
      '#mistake-status-select option[value="all"]': 'Усе',
      '#mistake-status-select option[value="open"]': 'Відкрито',
      '#mistake-status-select option[value="reviewing"]': 'На повторенні',
      '#mistake-status-select option[value="resolved"]': 'Закрито',
      '.review-queue-card .section-kicker': 'Цикл повторення',
      '.review-queue-card h2': 'Черга інтервального повторення',
      '.review-queue-card label:nth-of-type(1) > span': 'Предмет',
      '.review-queue-card label:nth-of-type(2) > span': 'Черга',
      '#review-status-select option[value="due"]': 'Потрібно зараз',
      '#review-status-select option[value="upcoming"]': 'Незабаром',
      '#review-status-select option[value="resolved"]': 'Закрито',
      '#review-status-select option[value="all"]': 'Усе',
      '#review-open-next-btn': 'Відкрити наступне повторення',
      '#review-open-any-btn': 'Відкрити найкращий доступний варіант',
      '.hub-card .section-kicker': 'Хаб',
      '.hub-card h2': 'Вбудований хаб прогресу',
      '.hub-note': 'Цей вбудований звіт живе в тому самому браузері й підтягує локальний прогрес тренера через live-local шар.',
      '.projection-card-shell .section-kicker': 'Прогноз',
      '.projection-card-shell h2': 'Оцінка готовності та бала',
      '.projection-note': 'Прогнозні діапазони бала тут неофіційні й потрібні лише для планування. Офіційні перерахунки залежать від реальної вступної кампанії.',
      '.focus-card-shell .section-kicker': 'Фокус',
      '.focus-card-shell h2': 'Куди тиснути сильніше',
      '.analytics-log-card summary': 'Детальна історія та логи',
      '.analytics-log-card label:nth-of-type(1) > span': 'Предмет',
      '.analytics-log-card label:nth-of-type(2) > span': 'Статус',
      '.analytics-log-card label:nth-of-type(3) > span': 'Період',
      '.analytics-log-card label:nth-of-type(4) > span': 'Дата',
      '.analytics-log-card label:nth-of-type(5) > span': 'Тиждень',
      '.analytics-log-card label:nth-of-type(6) > span': 'Сесія',
      '#history-status-select option[value="all"]': 'Усе',
      '#history-status-select option[value="correct"]': 'Правильно',
      '#history-status-select option[value="incorrect"]': 'Помилка',
      '#history-period-select option[value="all"]': 'Увесь час',
      '#history-period-select option[value="today"]': 'Сьогодні',
      '#history-period-select option[value="this_week"]': 'Цей тиждень',
      '#history-period-select option[value="last_7_days"]': 'Останні 7 днів',
      '#history-period-select option[value="specific_day"]': 'Конкретний день',
      '#history-period-select option[value="specific_week"]': 'Конкретний тиждень',
      '.table-grid > div:nth-of-type(1) h3': 'Лог спроб',
      '.table-grid > div:nth-of-type(2) h3': 'Лог навчання',
      '.advanced-details summary': 'Необов’язкові синхронізація, бекапи та GitHub',
      '.advanced-panel .section-kicker': 'Додатково',
      '.advanced-panel h2': 'Синхронізація з бекендом',
      '.advanced-panel label:nth-of-type(1)': 'Backend URL',
      '.advanced-panel label:nth-of-type(2) > span': 'Автосинхронізація з бекендом',
      '#backend-check-btn': 'Перевірити бекенд',
      '#backend-sync-btn': 'Синхронізувати зараз',
      '#backend-pull-btn': 'Підтягнути з бекенду'
    }
  };

  const GUIDE = {
    en: [
      ['Materials', 'Open one material card, spend 15-25 minutes on it, then log that time.'],
      ['Practice', 'Answer questions one by one inside the trainer instead of trying to do everything at once.'],
      ['Simulation', 'Launch a longer mock session only when you want an exam-style run.'],
      ['Review and analytics', 'Use review to close weak spots, then open analytics to inspect the bigger pattern.']
    ],
    uk: [
      ['Матеріал', 'Відкрий одну картку з матеріалом, попрацюй 15-25 хвилин і тільки тоді залогуй цей час.'],
      ['Практика', 'Відповідай на питання по одному всередині тренера, а не намагайся охопити все одразу.'],
      ['Симуляція', 'Запускай довший mock-сеанс тільки тоді, коли хочеш режим, близький до іспиту.'],
      ['Повторення й аналітика', 'Повторення закриває слабкі місця, а аналітика показує вже більший патерн прогресу.']
    ]
  };

  function getLang() {
    try {
      return window.masterPrepTrainer?.helpers?.getUiLanguage?.() === 'en' ? 'en' : 'uk';
    } catch {
      return document.documentElement.lang === 'en' ? 'en' : 'uk';
    }
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function applyGuide(lang) {
    document.querySelectorAll('.guide-step').forEach((step, index) => {
      const title = step.querySelector('h3');
      const body = step.querySelector('p');
      const source = GUIDE[lang][index];
      if (!source) return;
      if (title) title.textContent = source[0];
      if (body) body.textContent = source[1];
    });
  }

  function apply() {
    const lang = getLang();
    Object.entries(COPY[lang]).forEach(([selector, value]) => setText(selector, value));
    applyGuide(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(apply, 0), { once: true });
  } else {
    setTimeout(apply, 0);
  }

  document.addEventListener('master-prep:render', () => setTimeout(apply, 0));
})();
