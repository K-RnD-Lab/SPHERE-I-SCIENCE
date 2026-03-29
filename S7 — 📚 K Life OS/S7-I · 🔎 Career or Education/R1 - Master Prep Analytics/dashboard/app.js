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
  liveModeNote: document.getElementById('live-mode-note'),
  trendChart: document.getElementById('trend-chart'),
  goalVsReality: document.getElementById('goal-vs-reality'),
  goalVsRealitySummary: document.getElementById('goal-vs-reality-summary'),
  efficiencyGrid: document.getElementById('efficiency-grid'),
  scoreGapGrid: document.getElementById('score-gap-grid'),
  accuracyTargetChart: document.getElementById('accuracy-target-chart'),
  studyMinutesChart: document.getElementById('study-minutes-chart'),
  modeChart: document.getElementById('mode-chart'),
  effortAccuracyChart: document.getElementById('effort-accuracy-chart'),
  tabs: Array.from(document.querySelectorAll('.tab')),
  tabPanels: Array.from(document.querySelectorAll('.tab-panel')),
  langButtons: Array.from(document.querySelectorAll('.lang-pill')),
};

const state = {
  study: [],
  sessions: [],
  resources: [],
  subject: 'all',
  sourceMode: 'loading',
  updatedAt: '',
  lang: loadSavedLang(),
};


const DASHBOARD_LANG_KEY = 'master-prep-dashboard-lang-v1';
const TRAINER_SETTINGS_KEY = 'master-prep-settings-v2';
const UI = {
  "en": {
    "heroEyebrow": "K R&D Lab / S7-I / R1",
    "heroTitle": "Master Prep Analytics",
    "heroText": "A blue research cockpit for preparation tracking: study blocks, training sessions, simulation quality, target-score progress, and evidence-based readiness signals.",
    "currentMode": "Current mode",
    "inputsEyebrow": "Inputs",
    "inputsTitle": "Current focus and fallback imports",
    "inputsSummary": "Live Google Sheet data is the main source. CSV uploads are only a manual fallback for snapshots, recovery, or testing.",
    "subjectFocus": "Subject focus",
    "subjectAll": "All subjects",
    "subjectTznk": "TZNK",
    "subjectEnglish": "English",
    "subjectIt": "IT",
    "manualFallback": "Manual CSV fallback",
    "studyCsv": "Study log CSV",
    "sessionCsv": "Session log CSV",
    "tabOverview": "Overview",
    "tabTrainer": "Trainer",
    "tabSubjects": "Subjects",
    "tabCharts": "Charts",
    "tabEfficiency": "Efficiency",
    "tabSessions": "Sessions",
    "targetEyebrow": "Target tracking",
    "targetTitle": "How close you are to the score goal",
    "trendEyebrow": "Accuracy trend",
    "trendTitle": "Session trajectory over time",
    "trendSummary": "Current estimate is based on the latest predicted or actual score when available.",
    "goalEyebrow": "Goal vs Reality",
    "goalTitle": "Large subject cards for target, estimate, and real result",
    "signalsEyebrow": "Signals",
    "signalsTitle": "What the current data suggests",
    "trainerEyebrow": "Interactive workspace",
    "trainerTitle": "Practice and simulation trainer",
    "trainerSummary": "This is the same trainer workspace moved into the research case so people can inspect the actual preparation environment, not only the analytics layer.",
    "openTrainer": "Open full trainer",
    "trainerStatusEyebrow": "Current status",
    "trainerStatusTitle": "How this trainer fits the case",
    "trainerCard1Title": "What it already does",
    "trainerCard1Body": "Runs training sessions, simulations, study logs, exports, and local progress persistence.",
    "trainerCard2Title": "What comes next",
    "trainerCard2Body": "We can connect its log actions to the same Apps Script endpoint so training events write into Google Sheet automatically.",
    "trainerCard3Title": "Why it matters publicly",
    "trainerCard3Body": "The dashboard shows the results, while this trainer proves the underlying environment and workflow were real.",
    "subjectEyebrow": "Subject picture",
    "subjectTitle": "Average accuracy and study load",
    "modeEyebrow": "Mode pattern",
    "modeTitle": "Training versus simulation",
    "resourcesEyebrow": "Preparation sources",
    "resourcesTitle": "Resource map",
    "chartsEyebrow": "Chart layer",
    "chartAccuracyTitle": "Accuracy vs target by subject",
    "chartStudyTitle": "Study minutes by subject",
    "chartModeTitle": "Sessions by mode",
    "chartEffortTitle": "Effort vs accuracy",
    "efficiencyEyebrow": "Efficiency",
    "efficiencyTitle": "Return on effort",
    "scoreGapEyebrow": "Score gap",
    "scoreGapTitle": "Predicted versus actual",
    "sessionsTitle": "Recent sessions",
    "studyBlocksTitle": "Study blocks"
  },
  "uk": {
    "heroEyebrow": "K R&D Lab / S7-I / R1",
    "heroTitle": "Master Prep Analytics",
    "heroText": "Блакитна дослідницька панель для відстеження підготовки: навчальні блоки, навчальні сесії, якість моделювання, досягнення цільових балів і сигнали готовності на основі доказів.",
    "currentMode": "Поточний режим",
    "inputsEyebrow": "Вхідні дані",
    "inputsTitle": "Поточний фокус і резервний імпорт",
    "inputsSummary": "Живі дані Google Sheet є основним джерелом. Завантаження файлів CSV є лише резервним способом вручну для моментальних знімків, відновлення чи тестування.",
    "subjectFocus": "Предметна спрямованість",
    "subjectAll": "Всі предмети",
    "subjectTznk": "ТЗНК",
    "subjectEnglish": "Англійська",
    "subjectIt": "ІТ",
    "manualFallback": "Резервний CSV вручну",
    "studyCsv": "Журнал навчання CSV",
    "sessionCsv": "Журнал сеансу CSV",
    "tabOverview": "Огляд",
    "tabTrainer": "Тренер",
    "tabSubjects": "Предмети",
    "tabCharts": "Графіки",
    "tabEfficiency": "Ефективність",
    "tabSessions": "Сесії",
    "targetEyebrow": "Відстеження цілі",
    "targetTitle": "Наскільки ви близькі до забитого голу",
    "trendEyebrow": "Тренд точності",
    "trendTitle": "Траєкторія сеансу в часі",
    "trendSummary": "Поточна оцінка базується на останній прогнозованій або фактичній оцінці, якщо вона доступна.",
    "goalEyebrow": "Мета проти реальності",
    "goalTitle": "Великі тематичні картки для цілі, оцінки та реального результату",
    "signalsEyebrow": "Сигнали",
    "signalsTitle": "Про що свідчать поточні дані",
    "trainerEyebrow": "Інтерактивний робочий простір",
    "trainerTitle": "Тренажер з практики та симуляції",
    "trainerSummary": "Це той самий робочий простір інструктора, який переміщено в дослідницький кейс, щоб люди могли перевіряти фактичне середовище підготовки, а не лише рівень аналітики.",
    "openTrainer": "Відкрити повний тренер",
    "trainerStatusEyebrow": "Поточний стан",
    "trainerStatusTitle": "Як цей тренажер підходить для випадку",
    "trainerCard1Title": "Що воно вже робить",
    "trainerCard1Body": "Запускає навчальні сеанси, симуляції, журнали досліджень, експорт і локальну стійкість прогресу.",
    "trainerCard2Title": "Що буде далі",
    "trainerCard2Body": "Ми можемо зв’язати його дії журналу з тією самою кінцевою точкою Apps Script, щоб події навчання автоматично записувалися в таблицю Google.",
    "trainerCard3Title": "Чому це важливо для громадськості",
    "trainerCard3Body": "Інформаційна панель показує результати, тоді як цей навчальний посібник доводить, що базове середовище та робочий процес були реальними.",
    "subjectEyebrow": "Предметне зображення",
    "subjectTitle": "Середня точність і навчальне навантаження",
    "modeEyebrow": "Шаблон режиму",
    "modeTitle": "Навчання проти симуляції",
    "resourcesEyebrow": "Джерела приготування",
    "resourcesTitle": "Карта ресурсу",
    "chartsEyebrow": "Шар діаграми",
    "chartAccuracyTitle": "Точність проти цілі за предметом",
    "chartStudyTitle": "Учбові хвилинки по предметах",
    "chartModeTitle": "Сеанси за режимом",
    "chartEffortTitle": "Зусилля проти точності",
    "efficiencyEyebrow": "Ефективність",
    "efficiencyTitle": "Віддача від зусиль",
    "scoreGapEyebrow": "Розрив у рахунку",
    "scoreGapTitle": "Прогноз проти фактичного",
    "sessionsTitle": "Останні сесії",
    "studyBlocksTitle": "Навчальні блоки"
  }
};

const DYNAMIC_REPLACEMENTS = {
  "Trainer workspace": "Простір тренера",
  "Interactive practice and simulation workspace inside this same project": "Інтерактивна практика та робочий простір для моделювання в цьому ж проекті",
  "Live dashboard": "Живий дашборд",
  "Public dashboard on Vercel": "Публічна інформаційна панель на Vercel",
  "Live source of truth for study and session logs": "Живе джерело правди для навчання та журналів сесій",
  "Optional polished public reporting layer": "Додатковий полірований публічний рівень звітності",
  "JSON bridge between Sheet and dashboard": "Міст JSON між таблицею та інформаційною панеллю",
  "Repository": "Репозиторій",
  "Research structure, templates, and case notes": "Структура дослідження, шаблони та нотатки до випадку",
  "Study minutes": "Учбові хвилинки",
  "Session minutes": "Протокол сесії",
  "Logged sessions": "Зареєстровані сесії",
  "Average accuracy": "Середня точність",
  "Simulation accuracy": "Точність моделювання",
  "Questions tracked": "Питання відстежуються",
  "Readiness signal": "Сигнал готовності",
  "Current score estimate": "Поточна оцінка",
  "No subject cards for this filter yet.": "Для цього фільтра ще немає тематичних карток.",
  "Add predicted_score values or actual exam results to unlock target tracking.": "Додайте значення predicted_score або фактичні результати іспиту, щоб розблокувати цільове відстеження.",
  "Add predicted and actual scores to compare goals against real outcomes.": "Додайте прогнозовані та фактичні результати, щоб порівняти цілі з реальними результатами.",
  "No session trend yet. Log a few sessions to unlock the line chart.": "Тенденції сесії ще немає. Зареєструйте кілька сеансів, щоб розблокувати лінійну діаграму.",
  "Strongest subject": "Найсильніший предмет",
  "Weakest subject": "Найслабший предмет",
  "Most used mode": "Найбільш використовуваний режим",
  "Internal vs external": "Внутрішнє проти зовнішнього",
  "Training vs simulation": "Навчання проти симуляції",
  "Interpretation": "Інтерпретація",
  "Not enough data yet": "Ще недостатньо даних",
  "No mode data yet": "Даних про режим ще немає",
  "Target score progress": "Цільовий прогрес",
  "Study load": "Навчальне навантаження",
  "No subject breakdown for this filter yet.": "Для цього фільтра ще немає розподілу за темами.",
  "No resource rows found for this filter.": "Для цього фільтра не знайдено рядків ресурсів.",
  "Open source": "Відкритий код",
  "No rows for this filter yet.": "Для цього фільтра ще немає рядків.",
  "Current estimate": "Поточний кошторис",
  "Target": "Цільова",
  "Predicted": "Передбачив",
  "Actual": "Фактичний",
  "points above target": "балів вище цілі",
  "points left": "очок залишилося",
  "Set target and predicted score to unlock gap tracking": "Встановіть цільовий і прогнозований бал, щоб розблокувати відстеження розривів",
  "Goal reached": "Мета досягнута",
  "Below target": "Нижче цілі",
  "On track": "На шляху",
  "Close": "Закрити",
  "Needs push": "Потрібен поштовх",
  "Set score inputs": "Встановіть вхідні результати",
  "points above final target.": "балів вище кінцевої мети.",
  "points below final target.": "балів нижче кінцевої мети.",
  "points above the current target line.": "точки над поточною цільовою лінією.",
  "points left to reach the target.": "залишилося очок для досягнення мети.",
  "Add target, predicted, or actual score values to unlock this comparison.": "Щоб розблокувати це порівняння, додайте цільові, прогнозовані чи фактичні значення балів.",
  "TZNK performance path": "Шлях продуктивності ТЗНК",
  "English performance path": "Шлях виконання англійською мовою",
  "IT performance path": "шлях продуктивності ІТ",
  "No subject score data yet.": "Даних про оцінку предмета ще немає.",
  "Minutes": "Хвилини",
  "Sessions": "Сесії",
  "Accuracy": "Точність",
  "Need both study and session data to see effort vs accuracy.": "Потрібні дані дослідження та сеансу, щоб порівняти зусилля та точність.",
  "Effort versus accuracy by subject": "Зусилля проти точності за предметом",
  "Strong efficiency signal: relatively modest logged study time is already producing high accuracy.": "Сильний сигнал ефективності: відносно скромний зареєстрований час дослідження вже забезпечує високу точність.",
  "You have practice data, but no simulation baseline yet. Add full-run sessions before making readiness claims.": "У вас є практичні дані, але ще немає базової лінії моделювання. Додайте повноцінні сесії, перш ніж робити заяви про готовність.",
  "The dashboard now has enough structure to show growth, score gaps, and readiness movement over time.": "Інформаційна панель тепер має достатню структуру, щоб показати зростання, прогалини в балах і рух готовності з часом.",
  "Start logging practice and simulation rows to unlock real readiness signals.": "Почніть вправлятися в журналі та симулювати рядки, щоб розблокувати реальні сигнали готовності.",
  "subject targets are already being met or exceeded.": "предметні цілі вже досягнуті або перевищені.",
  "High": "Високий",
  "Building": "будівля",
  "Early": "Рано",
  "Not enough data": "Недостатньо даних",
  "practice": "практика",
  "simulation": "моделювання",
  "review": "огляд",
  "unknown": "невідомий",
  "all subjects": "всі предмети",
  "Predicted:": "Прогноз:",
  "Actual:": "Факт:",
  "Target:": "Ціль:",
  "No progress line yet": "Поки немає лінії прогресу",
  "of target": "цілі",
  " rows": "рядки",
  " avg accuracy": "середня точність",
  " min": "хв",
  " accuracy-points per hour": "точність балів за годину",
  "Need study minutes to estimate": "Для оцінки потрібні навчальні хвилини",
  " efficiency": "ефективність",
  " actual vs predicted": "фактичне проти прогнозованого",
  " points left to target": "залишилося націлити очок",
  "Need more score data": "Потрібно більше даних про результати",
  "First:": "перший:",
  "Latest:": "Останні:",
  "n/a": "н/д"
};

function getDataEndpoint() {
  const direct = String(config.dataEndpoint || '').trim();
  if (direct) return direct;
  const fallback = String(config.links?.appsScript || '').trim();
  return fallback || '';
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









