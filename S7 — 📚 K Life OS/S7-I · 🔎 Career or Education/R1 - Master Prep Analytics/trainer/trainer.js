const STORAGE_KEY = 'master-prep-lite-v3';
const OWNER_MODE_KEY = 'master-prep-owner-mode-v1';
const TRAINER_CONFIG = window.MASTER_PREP_TRAINER_CONFIG || { endpoint: '' };

const DEFAULT_STATE = {
  settings: {
    lang: 'en',
    subject: 'tznk',
    practiceSize: 10,
    sessionLabel: 's001',
    activeTab: 'resources',
  },
  studyLogs: [],
  sessionLogs: [],
  practiceRuntime: null,
  simulationRuntime: null,
};

const SUBJECTS = {
  tznk: { id: 'tznk', examQuestions: 33, examMinutes: 75 },
  english: { id: 'english', examQuestions: 30, examMinutes: 45 },
  it: { id: 'it', examQuestions: 140, examMinutes: 180 },
};

let runtimeTicker = null;

const UI = {
  en: {
    heroEyebrow: 'PRIVATE PREP ENVIRONMENT',
    heroCopy: 'A lighter prep cockpit for resources, short practice, simulation, and session logs.',
    heroSubcopy: 'Logs are created by this site when you study here or when you manually record an external session.',
    openHub: 'Back to Analytics Hub',
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    importJson: 'Import JSON',
    resetState: 'Reset Local State',
    workspaceKicker: 'WORKSPACE',
    workspaceTitle: 'Today setup',
    workspaceNote: 'Pick one subject, run a compact batch, and keep the history clean enough to export into Google Sheets later.',
    subjectLabel: 'Subject',
    languageLabel: 'Interface Language',
    practiceSizeLabel: 'Practice Batch',
    sessionLabel: 'Session Label',
    workspaceLogNote: 'This site does not pull logs from external platforms automatically. It saves built-in sessions and any manual entries you add.',
    tabResources: 'Resources',
    tabPractice: 'Practice',
    tabSimulation: 'Simulation',
    tabLogs: 'Logs',
    materialsKicker: 'FOUNDATIONS',
    materialsTitle: 'Study blocks',
    materialsCopy: 'Start with concepts, not only with raw tests. Open one source, study for 15-45 minutes, then log it here.',
    resourceLinksKicker: 'READY-MADE RESOURCES',
    resourceLinksTitle: 'Where to learn and where to practice',
    resourceLinksCopy: 'The cards below separate learning sources from test pools and official demos, so the flow is easier to follow.',
    practiceKicker: 'SHORT RUN',
    practiceTitle: 'Practice session',
    startPractice: 'Start Practice',
    nextQuestion: 'Next Question',
    finishPractice: 'Finish And Log',
    practiceHowKicker: 'HOW IT WORKS',
    practiceHowTitle: 'What this log gives you',
    simulationKicker: 'LONGER RUN',
    simulationTitle: 'Simulation',
    startSimulation: 'Start Simulation',
    finishSimulation: 'Finish And Log',
    simulationMetaKicker: 'EXAM MODE',
    simulationMetaTitle: 'Session profile',
    manualLogKicker: 'EXTERNAL SESSION',
    manualLogTitle: 'Quick Log',
    manualLogCopy: 'Use this when you studied or tested yourself on another platform and still want one dashboard.',
    platformLabel: 'Platform',
    modeLabel: 'Mode',
    questionsLabel: 'Questions',
    correctLabel: 'Correct',
    minutesLabel: 'Minutes',
    notesLabel: 'Notes',
    saveManualLog: 'Save Quick Log',
    logsKicker: 'SESSION HISTORY',
    logsTitle: 'Recent logs',
    logsCopy: 'Export CSV to open everything in Google Sheets or attach snapshots to K-R&D Lab later.',
    batchQuestions: 'questions',
    studyMinutes: 'minutes',
    totalStudy: 'Study Minutes',
    totalSessions: 'Logged Sessions',
    totalAccuracy: 'Average Accuracy',
    lastActivity: 'Last Activity',
    noLogs: 'No logs yet. Start with one study block, one short practice run, or one manual external log.',
    noQuestion: 'Start a practice session to load the first question.',
    noSimulation: 'Start a simulation to load an exam-style run.',
    materialButton: 'Open source',
    log15: '+15 min',
    log25: '+25 min',
    log45: '+45 min',
    logged: 'Logged',
    practiceInfo1Title: 'Built-in tracking',
    practiceInfo1Body: 'When you answer questions here, the site records subject, session label, time, and accuracy automatically.',
    practiceInfo2Title: 'External study still fits',
    practiceInfo2Body: 'If you use Testportal, Osvita.ua, Connected, or another source, add one quick log and keep the history in one place.',
    practiceInfo3Title: 'CSV-first flow',
    practiceInfo3Body: 'Your long-term dashboard should live in Google Sheets or K-R&D Lab. This site prepares clean exports for that.',
    modePractice: 'Practice',
    modeSimulation: 'Simulation',
    modeReview: 'Review',
    subject_tznk: 'TZNK',
    subject_english: 'English',
    subject_it: 'IT',
    sessionCompleted: 'Session completed and logged.',
    answerCorrect: 'Correct.',
    answerIncorrect: 'Incorrect.',
    chooseAnswer: 'Choose an answer first.',
    simulationLimited: 'The built-in bank is smaller than the real exam, so the simulation uses the currently available questions for this subject.',
    resourcesLearn: 'Learn concepts',
    resourcesPractice: 'Practice pools',
    resourcesOfficial: 'Official demos',
    openResource: 'Open resource',
    manualSaved: 'Quick log saved.',
    ownerOnly: 'Owner-only control',
    checkAnswer: 'Check Answer',
    finishAndSeeNext: 'Check the answer, then move forward with Next Question.',
    currentQuestion: 'Current question',
    progress: 'Progress',
    score: 'Score',
    sourceTypeLearn: 'Learn',
    sourceTypePractice: 'Practice',
    sourceTypeOfficial: 'Official',
    sourceTypeExtra: 'Extra',
    sessionReady: 'Session ready',
    simulationReady: 'Simulation ready',
    practiceEmpty: 'No questions found for this subject in the local bank.',
    simulationEmpty: 'No simulation questions found for this subject in the local bank.',
    manualSourcePlaceholder: 'Connected / Testportal / Osvita.ua',
    manualNotesPlaceholder: 'logic, grammar, weak spots, timing',
    sessionPlaceholder: 's001',
  },
  uk: {
    heroEyebrow: 'ПРИВАТНИЙ ПРОСТІР ПІДГОТОВКИ',
    heroCopy: 'Легший prep-cockpit для ресурсів, короткої практики, симуляції та журналу сесій.',
    heroSubcopy: 'Логи створює сам цей сайт: або коли ти працюєш тут, або коли вручну заносиш зовнішню сесію.',
    openHub: 'Відкрити хаб у повному екрані',
    exportJson: 'Експорт JSON',
    exportCsv: 'Експорт CSV',
    importJson: 'Імпорт JSON',
    resetState: 'Скинути локальний стан',
    workspaceKicker: 'РОБОЧИЙ ПРОСТІР',
    workspaceTitle: 'Налаштування на сьогодні',
    workspaceNote: 'Обери один предмет, пройди компактний блок і збережи історію так, щоб її потім було легко перенести в Google Sheets.',
    subjectLabel: 'Предмет',
    languageLabel: 'Мова інтерфейсу',
    practiceSizeLabel: 'Розмір практики',
    sessionLabel: 'Мітка сесії',
    workspaceLogNote: 'Сайт не забирає логи із зовнішніх платформ автоматично. Він зберігає вбудовані сесії та ручні записи, які ти додаєш сама.',
    tabResources: 'Ресурси',
    tabPractice: 'Практика',
    tabSimulation: 'Симуляція',
    tabLogs: 'Логи',
    materialsKicker: 'ОСНОВИ',
    materialsTitle: 'Навчальні блоки',
    materialsCopy: 'Починай з понять, а не лише з сирих тестів. Відкрий джерело, повчися 15-45 хвилин і зафіксуй це тут.',
    resourceLinksKicker: 'ГОТОВІ РЕСУРСИ',
    resourceLinksTitle: 'Де вчити теорію і де практикуватися',
    resourceLinksCopy: 'Картки нижче розділяють джерела для вивчення, банки тестів і офіційні демо, щоб шлях був зрозумілішим.',
    practiceKicker: 'КОРОТКИЙ БЛОК',
    practiceTitle: 'Практична сесія',
    startPractice: 'Почати практику',
    nextQuestion: 'Наступне питання',
    finishPractice: 'Завершити й зберегти',
    practiceHowKicker: 'ЯК ЦЕ ПРАЦЮЄ',
    practiceHowTitle: 'Що дають ці логи',
    simulationKicker: 'ДОВШИЙ БЛОК',
    simulationTitle: 'Симуляція',
    startSimulation: 'Почати симуляцію',
    finishSimulation: 'Завершити й зберегти',
    simulationMetaKicker: 'ЕКЗАМЕННИЙ РЕЖИМ',
    simulationMetaTitle: 'Профіль сесії',
    manualLogKicker: 'ЗОВНІШНЯ СЕСІЯ',
    manualLogTitle: 'Швидкий лог',
    manualLogCopy: 'Використовуй це, коли вчилася або тестувалася на іншій платформі, але хочеш мати один дашборд.',
    platformLabel: 'Платформа',
    modeLabel: 'Режим',
    questionsLabel: 'Питань',
    correctLabel: 'Правильних',
    minutesLabel: 'Хвилини',
    notesLabel: 'Нотатки',
    saveManualLog: 'Зберегти швидкий лог',
    logsKicker: 'ІСТОРІЯ СЕСІЙ',
    logsTitle: 'Останні логи',
    logsCopy: 'Експортуй CSV, щоб відкрити все в Google Sheets або додати знімки в K-R&D Lab.',
    batchQuestions: 'питань',
    studyMinutes: 'хвилин',
    totalStudy: 'Хвилини навчання',
    totalSessions: 'Збережені сесії',
    totalAccuracy: 'Середня точність',
    lastActivity: 'Остання активність',
    noLogs: 'Поки що немає логів. Почни з одного навчального блоку, короткої практики або ручного зовнішнього запису.',
    noQuestion: 'Почни практичну сесію, щоб завантажити перше питання.',
    noSimulation: 'Почни симуляцію, щоб завантажити екзаменний прогін.',
    materialButton: 'Відкрити джерело',
    log15: '+15 хв',
    log25: '+25 хв',
    log45: '+45 хв',
    logged: 'Збережено',
    practiceInfo1Title: 'Вбудоване відстеження',
    practiceInfo1Body: 'Коли ти відповідаєш на питання тут, сайт автоматично фіксує предмет, мітку сесії, час і точність.',
    practiceInfo2Title: 'Зовнішнє навчання теж враховується',
    practiceInfo2Body: 'Якщо ти користуєшся Testportal, Osvita.ua, Connected або іншим джерелом, додай один швидкий лог і тримай історію в одному місці.',
    practiceInfo3Title: 'CSV-first підхід',
    practiceInfo3Body: 'Твій довгостроковий дашборд краще вести в Google Sheets або K-R&D Lab. Цей сайт готує чисті експорти для цього.',
    modePractice: 'Практика',
    modeSimulation: 'Симуляція',
    modeReview: 'Повторення',
    subject_tznk: 'ТЗНК',
    subject_english: 'Англійська',
    subject_it: 'ІТ',
    sessionCompleted: 'Сесію завершено й збережено.',
    answerCorrect: 'Правильно.',
    answerIncorrect: 'Неправильно.',
    chooseAnswer: 'Спершу обери відповідь.',
    simulationLimited: 'Вбудований банк менший за реальний іспит, тому симуляція використовує доступні зараз питання цього предмета.',
    resourcesLearn: 'Вивчення понять',
    resourcesPractice: 'Банки практики',
    resourcesOfficial: 'Офіційні демо',
    openResource: 'Відкрити ресурс',
    manualSaved: 'Швидкий лог збережено.',
    ownerOnly: 'Керування лише для owner-mode',
    checkAnswer: 'Перевірити відповідь',
    finishAndSeeNext: 'Спершу перевір відповідь, потім переходь далі через Наступне питання.',
    currentQuestion: 'Поточне питання',
    progress: 'Прогрес',
    score: 'Результат',
    sourceTypeLearn: 'Теорія',
    sourceTypePractice: 'Практика',
    sourceTypeOfficial: 'Офіційно',
    sourceTypeExtra: 'Додатково',
    sessionReady: 'Сесію підготовлено',
    simulationReady: 'Симуляцію підготовлено',
    practiceEmpty: 'Для цього предмета в локальному банку не знайдено питань.',
    simulationEmpty: 'Для цього предмета в локальному банку не знайдено питань для симуляції.',
    manualSourcePlaceholder: 'Connected / Testportal / Osvita.ua',
    manualNotesPlaceholder: 'логіка, граматика, слабкі місця, таймінг',
    sessionPlaceholder: 's001',
  },
};

const MATERIAL_OVERRIDES = {
  tznk: {
    en: {
      title: 'TZNK Foundations',
      minutes: 25,
      summary: [
        'Work with constraints, order, set intersections, and valid conclusions.',
        'Translate text conditions into short symbolic form before choosing an answer.',
        'Avoid intuition-first answers; prove each option from the statement.',
      ],
      checklist: [
        'I can work with all / some / none / only statements.',
        'I can solve order, seating, and set-intersection tasks.',
        'I can explain why a conclusion must follow instead of guessing.',
      ],
    },
    uk: {
      title: 'Основи ТЗНК',
      minutes: 25,
      summary: [
        'Працюй з обмеженнями, порядком, перетинами множин і коректними висновками.',
        'Стискай умову до короткої схеми перед вибором відповіді.',
        'Не покладайся на інтуїцію: доводь кожен варіант з умови.',
      ],
      checklist: [
        'Я вмію працювати з усі / деякі / жоден / лише.',
        'Я вмію розв’язувати задачі на порядок, розсадку та перетини множин.',
        'Я можу пояснити, чому висновок точно випливає з умови.',
      ],
    },
  },
  english: {
    en: {
      title: 'English Foundations',
      minutes: 20,
      summary: [
        'Read for meaning first, then grammar, then collocation.',
        'For gap-fill, identify part of speech before choosing an option.',
        'High-value zones: conditionals, word formation, tense logic, and context vocabulary.',
      ],
      checklist: [
        'I can spot conditional patterns and tense logic.',
        'I can choose the right part of speech in a gap.',
        'I can justify an answer by context, not only by grammar.',
      ],
    },
    uk: {
      title: 'Основи англійської',
      minutes: 20,
      summary: [
        'Спершу зчитуй зміст, потім граматику, а далі сполучуваність слів.',
        'У gap-fill спочатку визначай частину мови, а вже потім варіант.',
        'Найцінніші теми: conditionals, word formation, tense logic і vocabulary in context.',
      ],
      checklist: [
        'Я впізнаю conditional patterns і логіку часів.',
        'Я вмію вибрати правильну частину мови в пропуску.',
        'Я можу обґрунтувати відповідь контекстом, а не лише правилом.',
      ],
    },
  },
  it: {
    en: {
      title: 'IT Foundations',
      minutes: 25,
      summary: [
        'Prioritize exact definitions: complexity, SQL order, protocols, structures, and security basics.',
        'Most mistakes come from almost-correct options from a neighboring topic.',
        'Recall a short list of canonical facts before solving mixed questions.',
      ],
      checklist: [
        'I know binary search complexity and common data structure basics.',
        'I understand WHERE vs HAVING and the SQL query order.',
        'I can distinguish core networking and security concepts.',
      ],
    },
    uk: {
      title: 'Основи ІТ',
      minutes: 25,
      summary: [
        'Спирайся на точні визначення: складність, порядок SQL, протоколи, структури даних і базову безпеку.',
        'Більшість помилок дають майже правильні варіанти із сусідньої теми.',
        'Перед змішаними питаннями повторюй короткий список канонічних фактів.',
      ],
      checklist: [
        'Я знаю складність binary search і базові структури даних.',
        'Я розумію різницю між WHERE і HAVING та порядок SQL-запиту.',
        'Я розрізняю ключові мережеві й безпекові поняття.',
      ],
    },
  },
};
const RESOURCE_MAP = {
  tznk: [
    {
      type: 'learn',
      title: {
        en: 'TZNK structure and block logic',
        uk: 'Структура ТЗНК і логіка блоків',
      },
      description: {
        en: 'Official overview of how the TZNK block works inside the master admission exam.',
        uk: 'Офіційний огляд того, як працює блок ТЗНК у вступному іспиті до магістратури.',
      },
      url: 'https://testportal.gov.ua/osoblyvosti-blokiv-tznk-ta-inozemna-mova-v-testi-yevi/',
    },
    {
      type: 'learn',
      title: {
        en: 'How to prepare for TZNK step by step',
        uk: 'Як підготуватися до ТЗНК покроково',
      },
      description: {
        en: 'A concept-first explainer with task types, traps, and preparation advice.',
        uk: 'Пояснювальний матеріал з типами завдань, типовими пастками й порадами до підготовки.',
      },
      url: 'https://osvita.ua/master/master-zno/91951/',
    },
    {
      type: 'official',
      title: {
        en: 'Official TZNK demo PDF',
        uk: 'Офіційний демо-варіант ТЗНК',
      },
      description: {
        en: 'Use this for real format, timing, and answer-sheet style.',
        uk: 'Використовуй це для реального формату, таймінгу та структури відповідей.',
      },
      url: 'https://testportal.gov.ua/wp-content/uploads/2024/04/TZNK_maket_sajt_2024_03_29_merged.pdf',
    },
    {
      type: 'practice',
      title: {
        en: 'Osvita.ua TZNK question pool',
        uk: 'Банк питань ТЗНК на Osvita.ua',
      },
      description: {
        en: 'A large searchable pool for batch practice and topic drilling.',
        uk: 'Великий банк для практики блоками та точкового тренування по темах.',
      },
      url: 'https://zno.osvita.ua/master/tznpk/list.html',
    },
    {
      type: 'practice',
      title: {
        en: 'Connected logic tests',
        uk: 'Логічні тести Connected',
      },
      description: {
        en: 'Extra practice with explanations for logic-style questions.',
        uk: 'Додаткова практика з поясненнями для логічних завдань.',
      },
      url: 'https://connected.com.ua/tests/',
    },
  ],
  english: [
    {
      type: 'learn',
      title: {
        en: 'Official language program PDF',
        uk: 'Офіційна програма з іноземної мови',
      },
      description: {
        en: 'Start here to see the exact grammar, reading, and vocabulary scope.',
        uk: 'Починай звідси, щоб бачити точний обсяг граматики, reading і vocabulary.',
      },
      url: 'https://mon.gov.ua/static-objects/mon/uploads/public/661/687/704/66168770465de084402330.pdf',
    },
    {
      type: 'learn',
      title: {
        en: 'Osvita.ua English archive',
        uk: 'Архів англійської на Osvita.ua',
      },
      description: {
        en: 'Use the archive to see how reading, use of English, and typical formats repeat over years.',
        uk: 'Архів допомагає побачити, як reading, use of English і типові формати повторюються з року в рік.',
      },
      url: 'https://zno.osvita.ua/master/english/',
    },
    {
      type: 'official',
      title: {
        en: 'Official English demo test',
        uk: 'Офіційний демо-тест з англійської',
      },
      description: {
        en: 'Closest to the official pacing and interface for the language block.',
        uk: 'Найближче до офіційного таймінгу та інтерфейсу мовного блоку.',
      },
      url: 'https://lv.testportal.gov.ua/testmktEnglish/',
    },
    {
      type: 'practice',
      title: {
        en: 'Osvita.ua English question pool',
        uk: 'Банк англійських питань на Osvita.ua',
      },
      description: {
        en: 'A large pool for short sessions instead of solving everything at once.',
        uk: 'Великий банк для коротких сесій замість проходження всього масиву одразу.',
      },
      url: 'https://zno.osvita.ua/master/english/list.html',
    },
    {
      type: 'extra',
      title: {
        en: 'MathCorporation English drills',
        uk: 'Додаткові англійські тренування MathCorporation',
      },
      description: {
        en: 'Extra drills when you want another pool beyond the official archive.',
        uk: 'Додаткові тренування, коли хочеться ще один банк поза офіційним архівом.',
      },
      url: 'https://www.mathcorporation.com/quizzes/english-master-zno?year=all',
    },
  ],
  it: [
    {
      type: 'learn',
      title: {
        en: 'Official IT subject program',
        uk: 'Офіційна програма предметного тесту з ІТ',
      },
      description: {
        en: 'Use it as the boundary of topics: algorithms, databases, networks, security, and software engineering.',
        uk: 'Використовуй її як межу тем: алгоритми, бази даних, мережі, безпека й software engineering.',
      },
      url: 'https://mon.gov.ua/npa/pro-zatverdzhennya-programi-predmetnogo-testu-z-informacijnih-tehnologij-yedinogo-fahovogo-vstupnogo-viprobuvannya',
    },
    {
      type: 'learn',
      title: {
        en: 'Osvita.ua IT exam archive',
        uk: 'Архів тестів ІТ на Osvita.ua',
      },
      description: {
        en: 'Review recurring topics and see how mixed IT questions are structured.',
        uk: 'Переглядай повторювані теми й дивись, як побудовані змішані ІТ-завдання.',
      },
      url: 'https://zno.osvita.ua/master/it/',
    },
    {
      type: 'practice',
      title: {
        en: 'Osvita.ua IT question pool',
        uk: 'Банк ІТ-питань на Osvita.ua',
      },
      description: {
        en: 'A ready-made pool for short drills by topic and mixed practice.',
        uk: 'Готовий банк для коротких тренувань по темах і змішаних проходжень.',
      },
      url: 'https://zno.osvita.ua/master/it/list.html',
    },
    {
      type: 'official',
      title: {
        en: 'Official prep hub for EVI / EFVV',
        uk: 'Офіційний хаб підготовки до ЄВІ / ЄФВВ',
      },
      description: {
        en: 'A central entry point for official updates, demos, and preparation materials.',
        uk: 'Центральна точка входу для офіційних оновлень, демо й матеріалів підготовки.',
      },
      url: 'https://testportal.gov.ua/pidgotovka-yefvv-yevi/',
    },
  ],
};

const state = loadState();
let appData = { questions: [], materials: [] };
const el = {};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  cacheDom();
  syncOwnerModeFromUrl();
  applyOwnerModeUi();
  appData = await loadAppData();
  bindEvents();
  setSyncStatus(getSyncEndpoint() ? 'Google Sheet sync is connected. New logs will try to save live.' : 'Sheet sync is not connected yet. Logs are saved locally only.', getSyncEndpoint() ? 'good' : 'warn');
  renderAll();
}

function cacheDom() {
  [
    'subject-select', 'language-select', 'practice-size-select', 'session-label-input',
    'export-json-btn', 'export-csv-btn', 'import-json-input', 'reset-state-btn',
    'materials-grid', 'resource-links-grid', 'practice-stats', 'practice-panel', 'practice-info',
    'simulation-stats', 'simulation-panel', 'simulation-meta', 'summary-grid', 'logs-list',
    'manual-source-input', 'manual-mode-select', 'manual-total-input', 'manual-correct-input', 'manual-minutes-input', 'manual-notes-input', 'save-manual-log-btn', 'sync-status',
    'start-practice-btn', 'next-practice-btn', 'finish-practice-btn', 'start-simulation-btn', 'next-simulation-btn', 'finish-simulation-btn'
  ].forEach((id) => {
    el[toKey(id)] = document.getElementById(id);
  });
}

function toKey(id) {
  return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/-/g, '');
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_STATE);
    return mergeDeep(clone(DEFAULT_STATE), JSON.parse(raw));
  } catch {
    return clone(DEFAULT_STATE);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getSyncEndpoint() {
  return String(TRAINER_CONFIG.endpoint || '').trim();
}

function setSyncStatus(message, level = 'warn') {
  if (!el.syncStatus) return;
  el.syncStatus.textContent = message;
  el.syncStatus.className = `micro-note sync-note ${level}`;
}

async function postRowToSheet(type, row) {
  const endpoint = getSyncEndpoint();
  if (!endpoint) {
    setSyncStatus('Sheet sync is not connected yet. Logs are saved locally only.', 'warn');
    return false;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ type, row }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload.ok) throw new Error(payload.error || 'Unknown sync error');
    setSyncStatus(`Saved to Google Sheet at ${new Date().toLocaleTimeString()}.`, 'good');
    return true;
  } catch (error) {
    console.warn('Sheet sync failed.', error);
    setSyncStatus('Sheet sync failed. The log is still saved locally in this browser.', 'bad');
    return false;
  }
}

function toStudySheetRow(item) {
  return {
    entry_id: item.id,
    date: String(item.loggedAt || '').slice(0, 10),
    subject: item.subject,
    resource_title: item.source || '',
    resource_type: 'study_block',
    stage: item.label || 'study',
    minutes: item.durationMin || 0,
    focus_score: '',
    energy_level: '',
    notes: item.notes || '',
  };
}

function toSessionSheetRow(item) {
  const isInternal = item.source === 'built-in' || item.source === 'Master Trainer';
  return {
    session_id: item.id,
    date: String(item.finishedAt || item.startedAt || '').slice(0, 10),
    subject: item.subject,
    platform: isInternal ? 'Master Trainer' : (item.source || 'External'),
    mode: item.kind || 'training',
    source_group: isInternal ? 'internal' : 'external',
    is_internal: isInternal ? 'true' : 'false',
    questions_total: item.questionsTotal || 0,
    correct: item.correctCount || 0,
    accuracy_pct: item.accuracyPct || 0,
    minutes: item.durationMin || 0,
    session_label: item.label || '',
    predicted_score: item.predictedScore || '',
    actual_score: item.actualScore || '',
    notes: item.notes || '',
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(base, patch) {
  if (Array.isArray(base) || Array.isArray(patch)) return patch ?? base;
  const out = { ...base };
  Object.entries(patch || {}).forEach(([key, value]) => {
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? mergeDeep(base[key] || {}, value)
      : value;
  });
  return out;
}

function stopRuntimeTicker() {
  if (runtimeTicker) {
    window.clearInterval(runtimeTicker);
    runtimeTicker = null;
  }
}

function startRuntimeTicker() {
  if (!state.practiceRuntime && !state.simulationRuntime) {
    stopRuntimeTicker();
    return;
  }
  if (runtimeTicker) return;
  runtimeTicker = window.setInterval(() => {
    if (!state.practiceRuntime && !state.simulationRuntime) {
      stopRuntimeTicker();
      return;
    }
    if (state.practiceRuntime) renderPracticeRuntime();
    if (state.simulationRuntime) renderSimulationRuntime();
  }, 1000);
}

function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getRuntimeTimeProfile(runtime) {
  const subjectMeta = SUBJECTS[runtime.subject] || { examQuestions: runtime.questions.length || 1, examMinutes: runtime.questions.length || 1 };
  const examQuestions = Math.max(1, Number(subjectMeta.examQuestions) || runtime.questions.length || 1);
  const examMinutes = Math.max(1, Number(subjectMeta.examMinutes) || runtime.questions.length || 1);
  const targetMinutes = runtime.mode === 'simulation'
    ? examMinutes
    : Math.max(5, Math.round(((runtime.questions.length || 1) / examQuestions) * examMinutes));
  const targetSeconds = targetMinutes * 60;
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(runtime.startedAt).getTime()) / 1000));
  const remainingSeconds = Math.max(0, targetSeconds - elapsedSeconds);
  const overrunSeconds = Math.max(0, elapsedSeconds - targetSeconds);

  let badgeClass = 'timer-good';
  if (overrunSeconds > 0 || remainingSeconds <= 60) {
    badgeClass = 'timer-bad';
  } else if (remainingSeconds <= 300) {
    badgeClass = 'timer-warn';
  }

  return {
    examQuestions,
    examMinutes,
    targetMinutes,
    targetSeconds,
    elapsedSeconds,
    remainingSeconds,
    overrunSeconds,
    badgeClass,
  };
}

function runtimeTimerLabel(runtime) {
  const profile = getRuntimeTimeProfile(runtime);
  const lead = profile.overrunSeconds > 0
    ? `Over pace: +${formatClock(profile.overrunSeconds)}`
    : `Time left: ${formatClock(profile.remainingSeconds)}`;
  return `${lead} | official pace: ${runtime.questions.length}/${profile.examQuestions}`;
}

async function loadAppData() {
  const [materialsRes, bankRes] = await Promise.all([
    fetch('app_data/materials_manifest.json').then((res) => res.json()),
    fetch('app_data/quiz_bank_v1.json').then((res) => res.json()),
  ]);

  const questions = (bankRes.quiz_sets || []).flatMap((set) => set.questions || []);
  const materials = (materialsRes.materials || []).map((item) => normalizeMaterial(item));
  return { questions, materials };
}

function normalizeMaterial(item) {
  const override = MATERIAL_OVERRIDES[item.subject] || {};
  return {
    id: item.id,
    subject: item.subject,
    sourceUrl: getPrimaryLearnUrl(item.subject),
    en: override.en,
    uk: override.uk,
  };
}

function getPrimaryLearnUrl(subject) {
  const firstLearn = (RESOURCE_MAP[subject] || []).find((entry) => entry.type === 'learn');
  return firstLearn ? firstLearn.url : '#';
}

function bindEvents() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
  });

  el.subjectSelect?.addEventListener('change', (event) => {
    state.settings.subject = event.target.value;
    resetRuntimes();
    saveState();
    renderAll();
  });

  el.languageSelect?.addEventListener('change', (event) => {
    state.settings.lang = event.target.value;
    saveState();
    renderAll();
  });

  el.practiceSizeSelect?.addEventListener('change', (event) => {
    state.settings.practiceSize = Number(event.target.value) || 10;
    saveState();
    renderAll();
  });

  el.sessionLabelInput?.addEventListener('input', (event) => {
    state.settings.sessionLabel = event.target.value.trim() || 's001';
    saveState();
  });

  el.startPracticeBtn?.addEventListener('click', startPracticeSession);
  el.nextPracticeBtn?.addEventListener('click', nextPracticeQuestion);
  el.finishPracticeBtn?.addEventListener('click', finishPracticeSession);
  el.startSimulationBtn?.addEventListener('click', startSimulationSession);
  el.nextSimulationBtn?.addEventListener('click', nextSimulationQuestion);
  el.finishSimulationBtn?.addEventListener('click', finishSimulationSession);
  el.saveManualLogBtn?.addEventListener('click', saveManualLog);
  el.exportJsonBtn?.addEventListener('click', exportJson);
  el.exportCsvBtn?.addEventListener('click', exportCsv);
  el.importJsonInput?.addEventListener('change', importJson);
  el.resetStateBtn?.addEventListener('click', resetState);
}

function renderAll() {
  applyI18n();
  renderControls();
  renderMaterials();
  renderResourceLinks();
  renderPracticeInfo();
  renderPracticeRuntime();
  renderSimulationRuntime();
  renderSummary();
  renderLogs();
  if (state.practiceRuntime || state.simulationRuntime) {
    startRuntimeTicker();
  } else {
    stopRuntimeTicker();
  }
  setActiveTab(state.settings.activeTab || 'resources', false);
}

function applyI18n() {
  document.documentElement.lang = state.settings.lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });

  if (el.sessionLabelInput) el.sessionLabelInput.placeholder = t('sessionPlaceholder');
  if (el.manualSourceInput) el.manualSourceInput.placeholder = t('manualSourcePlaceholder');
  if (el.manualNotesInput) el.manualNotesInput.placeholder = t('manualNotesPlaceholder');
}

function renderControls() {
  const subjectOptions = Object.keys(SUBJECTS)
    .map((id) => `<option value="${id}" ${state.settings.subject === id ? 'selected' : ''}>${escapeHtml(t(`subject_${id}`))}</option>`)
    .join('');
  el.subjectSelect.innerHTML = subjectOptions;
  el.languageSelect.value = state.settings.lang;
  el.practiceSizeSelect.value = String(state.settings.practiceSize);
  el.sessionLabelInput.value = state.settings.sessionLabel;

  if (el.manualModeSelect) {
    el.manualModeSelect.innerHTML = [
      ['practice', t('modePractice')],
      ['simulation', t('modeSimulation')],
      ['review', t('modeReview')],
    ].map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`).join('');
  }
}
function renderMaterials() {
  const material = appData.materials.find((item) => item.subject === state.settings.subject);
  if (!material) {
    el.materialsGrid.innerHTML = '';
    return;
  }

  const localized = material[state.settings.lang] || material.en;
  el.materialsGrid.innerHTML = `
    <article class="material-card">
      <div class="badge-row">
        <span class="badge">${escapeHtml(t(`subject_${material.subject}`))}</span>
        <span class="badge">${escapeHtml(String(localized.minutes))} ${escapeHtml(t('studyMinutes'))}</span>
      </div>
      <h3>${escapeHtml(localized.title)}</h3>
      <ul>${localized.summary.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
      <ul>${localized.checklist.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
      <div class="card-actions">
        <a class="resource-link" href="${escapeAttr(material.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t('materialButton'))}</a>
        <button type="button" data-study-log="15">${escapeHtml(t('log15'))}</button>
        <button type="button" data-study-log="25">${escapeHtml(t('log25'))}</button>
        <button type="button" data-study-log="45">${escapeHtml(t('log45'))}</button>
      </div>
    </article>
  `;

  el.materialsGrid.querySelectorAll('[data-study-log]').forEach((button) => {
    button.addEventListener('click', () => logStudyBlock(material, Number(button.dataset.studyLog)));
  });
}

function renderResourceLinks() {
  const cards = (RESOURCE_MAP[state.settings.subject] || []).map((entry) => {
    const title = entry.title[state.settings.lang] || entry.title.en;
    const description = entry.description[state.settings.lang] || entry.description.en;
    return `
      <article class="resource-card">
        <div class="badge-row">
          <span class="badge">${escapeHtml(t(`sourceType${capitalize(entry.type)}`))}</span>
          <span class="badge">${escapeHtml(t(`subject_${state.settings.subject}`))}</span>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        <div class="card-actions">
          <a class="resource-link" href="${escapeAttr(entry.url)}" target="_blank" rel="noreferrer">${escapeHtml(t('openResource'))}</a>
        </div>
      </article>
    `;
  }).join('');

  el.resourceLinksGrid.innerHTML = cards;
}

function renderPracticeInfo() {
  const items = [
    ['practiceInfo1Title', 'practiceInfo1Body'],
    ['practiceInfo2Title', 'practiceInfo2Body'],
    ['practiceInfo3Title', 'practiceInfo3Body'],
  ];

  el.practiceInfo.innerHTML = items.map(([titleKey, bodyKey]) => `
    <article class="info-card">
      <h3>${escapeHtml(t(titleKey))}</h3>
      <p>${escapeHtml(t(bodyKey))}</p>
    </article>
  `).join('');
}

function startPracticeSession() {
  const subjectQuestions = shuffle(getQuestionsForSubject(state.settings.subject)).slice(0, state.settings.practiceSize);
  if (!subjectQuestions.length) {
    el.practicePanel.innerHTML = `<p>${escapeHtml(t('practiceEmpty'))}</p>`;
    return;
  }

  state.practiceRuntime = {
    mode: 'practice',
    subject: state.settings.subject,
    label: state.settings.sessionLabel,
    startedAt: new Date().toISOString(),
    index: 0,
    questions: subjectQuestions,
    answers: {},
    score: { correct: 0, answered: 0 },
  };
  saveState();
  renderPracticeRuntime();
  startRuntimeTicker();
}

function nextPracticeQuestion() {
  if (!state.practiceRuntime) return;
  const runtime = state.practiceRuntime;
  if (runtime.index < runtime.questions.length - 1) {
    runtime.index += 1;
    saveState();
    renderPracticeRuntime();
  }
}

async function finishPracticeSession() {
  await finishRuntime('practiceRuntime');
}

function renderPracticeRuntime() {
  const runtime = state.practiceRuntime;
  if (!runtime) {
    el.practiceStats.innerHTML = `<span class="badge">${escapeHtml(t('sessionReady'))}</span>`;
    el.practicePanel.innerHTML = `<p>${escapeHtml(t('noQuestion'))}</p>`;
    return;
  }
  renderRuntimeInto(runtime, el.practiceStats, el.practicePanel, 'practice');
}

function startSimulationSession() {
  const subject = state.settings.subject;
  const all = shuffle(getQuestionsForSubject(subject));
  const target = Math.min(all.length, SUBJECTS[subject].examQuestions);
  const questions = all.slice(0, target);
  if (!questions.length) {
    el.simulationPanel.innerHTML = `<p>${escapeHtml(t('simulationEmpty'))}</p>`;
    return;
  }

  state.simulationRuntime = {
    mode: 'simulation',
    subject,
    label: `${state.settings.sessionLabel}-exam`,
    startedAt: new Date().toISOString(),
    index: 0,
    questions,
    answers: {},
    score: { correct: 0, answered: 0 },
  };
  saveState();
  renderSimulationRuntime();
  startRuntimeTicker();
}

function nextSimulationQuestion() {
  if (!state.simulationRuntime) return;
  const runtime = state.simulationRuntime;
  if (runtime.index < runtime.questions.length - 1) {
    runtime.index += 1;
    saveState();
    renderSimulationRuntime();
  }
}

async function finishSimulationSession() {
  await finishRuntime('simulationRuntime');
}

function renderSimulationRuntime() {
  const runtime = state.simulationRuntime;
  if (!runtime) {
    el.simulationStats.innerHTML = `<span class="badge">${escapeHtml(t('simulationReady'))}</span>`;
    el.simulationPanel.innerHTML = `<p>${escapeHtml(t('noSimulation'))}</p>`;
    el.simulationMeta.innerHTML = `<article class="info-card"><p>${escapeHtml(t('simulationLimited'))}</p></article>`;
    return;
  }
  renderRuntimeInto(runtime, el.simulationStats, el.simulationPanel, 'simulation');
  const timeProfile = getRuntimeTimeProfile(runtime);
  el.simulationMeta.innerHTML = `
    <article class="info-card">
      <h3>${escapeHtml(t(`subject_${runtime.subject}`))}</h3>
      <p>Official pace: ${escapeHtml(`${timeProfile.examQuestions} ${t('batchQuestions')} / ${timeProfile.examMinutes} ${t('studyMinutes')}`)}</p>
      <p>${escapeHtml(t('simulationLimited'))}</p>
    </article>
  `;
}

function renderRuntimeInto(runtime, statsNode, panelNode, prefix) {
  const current = runtime.questions[runtime.index];
  const answer = runtime.answers[current.id];
  const progress = `${runtime.index + 1}/${runtime.questions.length}`;
  const accuracy = runtime.score.answered ? `${Math.round((runtime.score.correct / runtime.score.answered) * 100)}%` : '0%';
  const timerProfile = getRuntimeTimeProfile(runtime);
  const timerLabel = runtimeTimerLabel(runtime);
  statsNode.innerHTML = `
    <span class="badge">${escapeHtml(t(`subject_${runtime.subject}`))}</span>
    <span class="badge">${escapeHtml(t('progress'))}: ${escapeHtml(progress)}</span>
    <span class="badge">${escapeHtml(t('score'))}: ${escapeHtml(accuracy)}</span>
    <span class="badge badge-timer ${timerProfile.badgeClass}">${escapeHtml(timerLabel)}</span>
  `;

  const choices = Object.entries(current.choices || {}).map(([key, value]) => `
    <label class="answer-option">
      <input type="radio" name="${prefix}-answer" value="${escapeAttr(key)}" ${answer?.selected === key ? 'checked' : ''} ${answer?.checked ? 'disabled' : ''}>
      <span><strong>${escapeHtml(key)}.</strong> ${escapeHtml(value)}</span>
    </label>
  `).join('');

  const feedback = answer?.checked ? `
    <div class="feedback ${answer.correct ? 'good' : 'bad'}">
      <strong>${escapeHtml(answer.correct ? t('answerCorrect') : t('answerIncorrect'))}</strong>
      <p>${escapeHtml(current.explanation || '')}</p>
    </div>
  ` : `<p class="micro-note">${escapeHtml(t('finishAndSeeNext'))}</p>`;

  panelNode.innerHTML = `
    <article class="question-card">
      <div class="badge-row">
        <span class="badge">${escapeHtml(t('currentQuestion'))}</span>
        <span class="badge">${escapeHtml(current.block || '')}</span>
        <span class="badge">${escapeHtml(current.topic || '')}</span>
      </div>
      <p class="question-prompt">${escapeHtml(current.prompt)}</p>
      <div class="answer-list">${choices}</div>
      <div class="card-actions">
        <button type="button" id="${prefix}-check-btn">${escapeHtml(t('checkAnswer'))}</button>
      </div>
      ${feedback}
    </article>
  `;

  panelNode.querySelector(`#${prefix}-check-btn`)?.addEventListener('click', () => checkCurrentAnswer(prefix));
}

function checkCurrentAnswer(prefix) {
  const runtime = prefix === 'practice' ? state.practiceRuntime : state.simulationRuntime;
  if (!runtime) return;
  const current = runtime.questions[runtime.index];
  const selected = document.querySelector(`input[name="${prefix}-answer"]:checked`)?.value;
  if (!selected) {
    alert(t('chooseAnswer'));
    return;
  }
  if (runtime.answers[current.id]?.checked) return;

  const correct = selected === current.correct_answer;
  runtime.answers[current.id] = { selected, checked: true, correct };
  runtime.score.answered += 1;
  if (correct) runtime.score.correct += 1;
  saveState();
  prefix === 'practice' ? renderPracticeRuntime() : renderSimulationRuntime();
}

async function finishRuntime(runtimeKey) {
  const runtime = state[runtimeKey];
  if (!runtime) return;
  const finishedAt = new Date().toISOString();
  const startedAt = new Date(runtime.startedAt);
  const durationMin = Math.max(1, Math.round((new Date(finishedAt) - startedAt) / 60000));
  const questionsTotal = runtime.questions.length;
  const questionsAnswered = runtime.score.answered;
  const correctCount = runtime.score.correct;
  const accuracyPct = questionsAnswered ? Math.round((correctCount / questionsAnswered) * 100) : 0;

  state.sessionLogs.unshift({
    id: `${runtime.mode}-${Date.now()}`,
    kind: runtime.mode,
    subject: runtime.subject,
    label: runtime.label,
    source: 'built-in',
    questionsTotal,
    questionsAnswered,
    correctCount,
    accuracyPct,
    durationMin,
    startedAt: runtime.startedAt,
    finishedAt,
    notes: '',
  });

  state[runtimeKey] = null;
  if (!state.practiceRuntime && !state.simulationRuntime) {
    stopRuntimeTicker();
  }
  saveState();
  renderAll();
  await postRowToSheet('session', toSessionSheetRow(state.sessionLogs[0]));
  alert(t('sessionCompleted'));
}

async function logStudyBlock(material, minutes) {
  const localized = material[state.settings.lang] || material.en;
  state.studyLogs.unshift({
    id: `study-${Date.now()}`,
    kind: 'study',
    subject: material.subject,
    label: state.settings.sessionLabel,
    source: localized.title,
    sourceUrl: material.sourceUrl,
    durationMin: minutes,
    loggedAt: new Date().toISOString(),
    notes: '',
  });
  saveState();
  renderSummary();
  renderLogs();
  await postRowToSheet('study', toStudySheetRow(state.studyLogs[0]));
}

async function saveManualLog() {
  const total = Number(el.manualTotalInput.value || 0);
  const correct = Number(el.manualCorrectInput.value || 0);
  const durationMin = Number(el.manualMinutesInput.value || 0);
  const accuracyPct = total ? Math.round((correct / total) * 100) : 0;

  state.sessionLogs.unshift({
    id: `manual-${Date.now()}`,
    kind: el.manualModeSelect.value || 'practice',
    subject: state.settings.subject,
    label: state.settings.sessionLabel,
    source: (el.manualSourceInput.value || 'external').trim(),
    questionsTotal: total,
    questionsAnswered: total,
    correctCount: correct,
    accuracyPct,
    durationMin,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    notes: (el.manualNotesInput.value || '').trim(),
  });

  saveState();
  el.manualSourceInput.value = '';
  el.manualCorrectInput.value = '0';
  el.manualTotalInput.value = '10';
  el.manualMinutesInput.value = '25';
  el.manualNotesInput.value = '';
  renderSummary();
  renderLogs();
  await postRowToSheet('session', toSessionSheetRow(state.sessionLogs[0]));
  alert(t('manualSaved'));
}

function renderSummary() {
  const totalStudy = state.studyLogs.reduce((sum, item) => sum + (Number(item.durationMin) || 0), 0);
  const totalSessions = state.sessionLogs.length;
  const accuracyItems = state.sessionLogs.filter((item) => Number.isFinite(item.accuracyPct));
  const avgAccuracy = accuracyItems.length
    ? Math.round(accuracyItems.reduce((sum, item) => sum + item.accuracyPct, 0) / accuracyItems.length)
    : 0;
  const lastItem = [...state.sessionLogs, ...state.studyLogs]
    .sort((a, b) => new Date(b.finishedAt || b.loggedAt) - new Date(a.finishedAt || a.loggedAt))[0];

  const cards = [
    [t('totalStudy'), `${totalStudy} ${t('studyMinutes')}`],
    [t('totalSessions'), String(totalSessions)],
    [t('totalAccuracy'), `${avgAccuracy}%`],
    [t('lastActivity'), lastItem ? formatDate(lastItem.finishedAt || lastItem.loggedAt) : '—'],
  ];

  el.summaryGrid.innerHTML = cards.map(([title, value]) => `
    <article class="metric-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(value)}</p>
    </article>
  `).join('');
}

function renderLogs() {
  const items = [...state.sessionLogs, ...state.studyLogs]
    .sort((a, b) => new Date(b.finishedAt || b.loggedAt) - new Date(a.finishedAt || a.loggedAt));

  if (!items.length) {
    el.logsList.innerHTML = `<p>${escapeHtml(t('noLogs'))}</p>`;
    return;
  }

  el.logsList.innerHTML = items.map((item) => {
    const mode = item.kind === 'study' ? t('materialsTitle') : t(`mode${capitalize(item.kind)}`);
    const total = item.kind === 'study'
      ? `${item.durationMin} ${t('studyMinutes')}`
      : `${item.correctCount}/${item.questionsAnswered || item.questionsTotal} · ${item.accuracyPct}%`;
    return `
      <article class="log-card">
        <div class="badge-row">
          <span class="badge">${escapeHtml(mode)}</span>
          <span class="badge">${escapeHtml(t(`subject_${item.subject}`))}</span>
          <span class="badge">${escapeHtml(item.label || '—')}</span>
        </div>
        <h3>${escapeHtml(item.source || 'built-in')}</h3>
        <p>${escapeHtml(total)}</p>
        <p>${escapeHtml(formatDate(item.finishedAt || item.loggedAt))}</p>
        ${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ''}
      </article>
    `;
  }).join('');
}

function setActiveTab(tabName, persist = true) {
  state.settings.activeTab = tabName;
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === tabName);
  });
  document.querySelectorAll('.pane').forEach((pane) => {
    const active = pane.dataset.pane === tabName;
    pane.classList.toggle('is-active', active);
    pane.hidden = !active;
  });
  if (persist) saveState();
}

function syncOwnerModeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('owner') === '1') {
    localStorage.setItem(OWNER_MODE_KEY, 'true');
  }
  const lang = params.get('lang');
  if (lang === 'en' || lang === 'uk') {
    state.settings.lang = lang;
  }
  const tab = params.get('tab');
  if (tab && ['resources','practice','simulation','logs'].includes(tab)) {
    state.settings.activeTab = tab;
  }
  const subject = params.get('subject');
  if (subject && Object.hasOwn(SUBJECTS, subject)) {
    state.settings.subject = subject;
  }
}

function isOwnerMode() {
  return localStorage.getItem(OWNER_MODE_KEY) === 'true';
}

function applyOwnerModeUi() {
  document.querySelectorAll('[data-owner-only]').forEach((node) => {
    node.hidden = !isOwnerMode();
  });
}

function exportJson() {
  downloadFile(`master-prep-${Date.now()}.json`, JSON.stringify(state, null, 2), 'application/json');
}

function exportCsv() {
  const rows = [];
  state.studyLogs.forEach((item) => {
    rows.push({
      log_type: 'study',
      subject: item.subject,
      label: item.label,
      source: item.source,
      questions_total: '',
      questions_answered: '',
      correct_count: '',
      accuracy_pct: '',
      duration_min: item.durationMin,
      logged_at: item.loggedAt,
      notes: item.notes || '',
      source_url: item.sourceUrl || '',
    });
  });
  state.sessionLogs.forEach((item) => {
    rows.push({
      log_type: item.kind,
      subject: item.subject,
      label: item.label,
      source: item.source,
      questions_total: item.questionsTotal,
      questions_answered: item.questionsAnswered,
      correct_count: item.correctCount,
      accuracy_pct: item.accuracyPct,
      duration_min: item.durationMin,
      logged_at: item.finishedAt,
      notes: item.notes || '',
      source_url: '',
    });
  });

  const header = ['log_type','subject','label','source','questions_total','questions_answered','correct_count','accuracy_pct','duration_min','logged_at','notes','source_url'];
  const lines = [header.join(',')].concat(rows.map((row) => header.map((key) => csvCell(row[key])).join(',')));
  downloadFile(`master-prep-${Date.now()}.csv`, lines.join('\n'), 'text/csv;charset=utf-8');
}

function importJson(event) {
  if (!isOwnerMode()) return;
  const file = event.target.files?.[0];
  if (!file) return;
  file.text().then((text) => {
    const parsed = JSON.parse(text);
    const merged = mergeDeep(clone(DEFAULT_STATE), parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    Object.assign(state, merged);
    renderAll();
  }).catch(() => {
    alert('Import failed.');
  }).finally(() => {
    event.target.value = '';
  });
}

function resetState() {
  if (!isOwnerMode()) return;
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, clone(DEFAULT_STATE));
  saveState();
  renderAll();
}

function resetRuntimes() {
  state.practiceRuntime = null;
  state.simulationRuntime = null;
}

function getQuestionsForSubject(subject) {
  return appData.questions.filter((question) => question.subject === subject);
}

function t(key) {
  return UI[state.settings.lang]?.[key] ?? UI.en[key] ?? key;
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(state.settings.lang === 'uk' ? 'uk-UA' : 'en-US');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const normalized = String(value ?? '');
  return `"${normalized.replace(/"/g, '""')}"`;
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






