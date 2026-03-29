const config = window.MASTER_PREP_CONFIG || { dataEndpoint: '', links: {}, scoreTargets: {}, actualExamScores: {} };
const SUBJECTS = ['tznk', 'english', 'it'];
const LANG_KEY = 'master-prep-dashboard-lang-v2';

const SUBJECT_META = {
  tznk: { en: 'TZNK', uk: 'ТЗНК' },
  english: { en: 'English', uk: 'Англійська' },
  it: { en: 'IT', uk: 'ІТ' },
};

const COPY = {
  en: {
    heroEyebrow: 'K R&D Lab / S7-I / R1', heroTitle: 'Master Prep Analytics', heroText: 'A blue research cockpit for preparation tracking: study blocks, training sessions, simulation quality, target-score progress, and evidence-based readiness signals.', currentMode: 'Current mode',
    inputsEyebrow: 'Inputs', inputsTitle: 'Current focus and fallback imports', inputsSummary: 'Live Google Sheet data is the main source. CSV uploads are only a manual fallback for snapshots, recovery, or testing.',
    subjectFocus: 'Subject focus', subjectAll: 'All subjects', manualFallback: 'Manual CSV fallback', studyCsv: 'Study log CSV', sessionCsv: 'Session log CSV',
    tabOverview: 'Overview', tabTrainer: 'Trainer', tabSubjects: 'Subjects', tabCharts: 'Charts', tabEfficiency: 'Efficiency', tabSessions: 'Sessions',
    targetEyebrow: 'Target tracking', targetTitle: 'How close you are to the score goal', trendEyebrow: 'Accuracy trend', trendTitle: 'Session trajectory over time', trendSummary: 'Current estimate is based on the latest predicted or actual score when available.',
    goalEyebrow: 'Goal vs Reality', goalTitle: 'Large subject cards for target, estimate, and real result', signalsEyebrow: 'Signals', signalsTitle: 'What the current data suggests',
    trainerEyebrow: 'Interactive workspace', trainerTitle: 'Practice and simulation trainer', trainerSummary: 'This is the same trainer workspace moved into the research case so people can inspect the actual preparation environment, not only the analytics layer.', openTrainer: 'Open full trainer',
    trainerStatusEyebrow: 'Current status', trainerStatusTitle: 'How this trainer fits the case', trainerCard1Title: 'What it already does', trainerCard1Body: 'Runs training sessions, simulations, study logs, exports, and local progress persistence.', trainerCard2Title: 'What comes next', trainerCard2Body: 'It is wired for Google Sheet logging, so one shared dataset can feed both the trainer and the dashboard.', trainerCard3Title: 'Why it matters publicly', trainerCard3Body: 'The dashboard shows the outcomes, while the trainer demonstrates the real preparation environment behind them.',
    subjectEyebrow: 'Subject picture', subjectTitle: 'Average accuracy and study load', modeEyebrow: 'Mode pattern', modeTitle: 'Training versus simulation', resourcesEyebrow: 'Preparation sources', resourcesTitle: 'Resource map',
    chartsEyebrow: 'Chart layer', chartAccuracyTitle: 'Accuracy vs target by subject', chartStudyTitle: 'Study minutes by subject', chartModeTitle: 'Sessions by mode', chartEffortTitle: 'Effort vs accuracy',
    efficiencyEyebrow: 'Efficiency', efficiencyTitle: 'Return on effort', scoreGapEyebrow: 'Score gap', scoreGapTitle: 'Predicted versus actual', sessionsTitle: 'Recent sessions', studyBlocksTitle: 'Study blocks',
    linkLive: 'Live dashboard', linkLiveDesc: 'Public dashboard on Vercel', linkSheet: 'Google Sheet', linkSheetDesc: 'Live source of truth for study and session logs', linkLooker: 'Looker Studio', linkLookerDesc: 'Optional polished public reporting layer', linkApps: 'Apps Script endpoint', linkAppsDesc: 'JSON bridge between Sheet and dashboard', linkRepo: 'Repository', linkRepoDesc: 'Research structure, templates, and case notes',
    modeLoading: 'Loading data...', modeRemote: 'Live Google Sheet', modeLocal: 'Repository CSV snapshot', modeManual: 'Manual CSV upload', modeUnknown: 'Unknown source',
    liveActiveTitle: 'Live mode is active.', liveActiveBody: 'The dashboard is reading the Google Sheet through Apps Script right now.', liveConfiguredTitle: 'Live mode is configured but not active yet.', liveConfiguredBody: 'The Apps Script endpoint is set, but the dashboard fell back to repository CSV data.', liveMissingTitle: 'Live mode is not connected yet.', liveMissingBody: 'Add a public Apps Script web app URL so the dashboard can read the Google Sheet automatically.',
    metricStudy: 'Study minutes', metricSession: 'Session minutes', metricSessions: 'Logged sessions', metricAccuracy: 'Average accuracy', metricSimulation: 'Simulation accuracy', metricQuestions: 'Questions tracked', metricReadiness: 'Readiness signal', metricEstimate: 'Current score estimate',
    readinessHigh: 'High', readinessBuilding: 'Building', readinessEarly: 'Early', readinessNone: 'Not enough data', noSubjectCards: 'No subject cards for this filter yet.', targetSummarySuffix: 'subjects are currently at or above the configured target score.', unlockTarget: 'Add predicted_score values or actual exam results to unlock target tracking.',
    goalSummarySuffix1: 'subjects are at or above target. Actual exam scores logged for', goalSummarySuffix2: 'subjects.', noTrend: 'No session trend yet. Log a few sessions to unlock the line chart.', firstLabel: 'First', latestLabel: 'Latest',
    insightStrongest: 'Strongest subject', insightWeakest: 'Weakest subject', insightMode: 'Most used mode', insightInternal: 'Internal vs external', insightTrainVsSim: 'Training vs simulation', insightInterpretation: 'Interpretation',
    subjectBreakdownEmpty: 'No subject breakdown for this filter yet.', modeBreakdownEmpty: 'No mode rows yet.', chartEmpty: 'Not enough data for this chart yet.', studyLoad: 'Study load', avgAccuracy: 'Average accuracy', targetProgress: 'Target score progress', rowsLabel: 'rows', openSource: 'Open source', resourceSummary: 'Showing {count} source cards for {label}. Learn-stage sources should be used before larger test batches.', noResources: 'No resource rows found for this filter.', noRows: 'No rows for this filter yet.',
    target: 'Target', predicted: 'Predicted', actual: 'Actual', pointsAbove: 'points above target', pointsLeft: 'points left', setTargetHint: 'Set target and predicted score to unlock gap tracking.', statusGoalReached: 'Goal reached', statusOnTrack: 'On track', statusClose: 'Close', statusNeedsPush: 'Needs push', currentEstimate: 'Current estimate', worthIt: 'Worth-it score', needsStudyMinutes: 'Need study minutes to estimate', accuracyPerHour: 'accuracy-points per hour', scoreDataNeeded: 'Need more score data', pointsToTarget: 'points left to target', actualVsPredicted: 'actual vs predicted', internal: 'internal', external: 'external', training: 'training', simulation: 'simulation', review: 'review', unknown: 'unknown', notEnoughData: 'Not enough data yet',
    insightNarrativeNoData: 'Start logging practice and simulation rows to unlock real readiness signals.', insightNarrativeTargets: '{done}/{total} subject targets are already being met or exceeded.', insightNarrativeEfficient: 'Strong efficiency signal: relatively modest logged study time is already producing high accuracy.', insightNarrativeNeedSim: 'You have practice data, but no simulation baseline yet. Add full-run sessions before making readiness claims.', insightNarrativeGeneral: 'The dashboard now has enough structure to show growth, score gaps, and readiness movement over time.',
    sessionId: 'Session ID', date: 'Date', subject: 'Subject', platform: 'Platform', mode: 'Mode', questionsTotal: 'Questions', correct: 'Correct', accuracyPct: 'Accuracy %', minutes: 'Minutes', sessionLabel: 'Session label', predictedScore: 'Predicted score', actualScore: 'Actual score', notes: 'Notes', resourceTitle: 'Resource', resourceType: 'Resource type', stage: 'Stage', focusScore: 'Focus score', energyLevel: 'Energy level',
  },
  uk: {
    heroEyebrow: 'K R&D Lab / S7-I / R1', heroTitle: '????????? ????????????? ??????????', heroText: '????? ????????????? cockpit ??? ??????????? ??????????: ????????? ?????, ??????????? ?????, ?????? ?????????, ??? ?? ???????? ????? ? ??????? ?????????? ?? ?????? ?????.', currentMode: '???????? ?????',
    inputsEyebrow: '?????? ????', inputsTitle: '???????? ????? ? ????????? ??????', inputsSummary: '???????? ???????? ? ???? ???? ? Google Sheet. CSV-???????????? ????????? ???? ?????? fallback ??? ???????, ??????????? ??? ??????????.',
    subjectFocus: '????? ?? ?????????', subjectAll: '??? ????????', manualFallback: '?????? CSV fallback', studyCsv: 'CSV ?????????? ?????', sessionCsv: 'CSV ?????',
    tabOverview: '?????', tabTrainer: '??????', tabSubjects: '????????', tabCharts: '???????', tabEfficiency: '????????????', tabSessions: '?????',
    targetEyebrow: '??????????? ????', targetTitle: '????????? ??????? ?? ?? ????????? ????', trendEyebrow: '????? ????????', trendTitle: '?????????? ????? ? ????', trendSummary: '??????? ?????? ????????? ?? ?????????? predicted ??? actual score, ???? ??? ??? ?.',
    goalEyebrow: '???? vs ??????????', goalTitle: '?????? ?????? ?? ??????????: ????, ?????? ? ????????? ?????????', signalsEyebrow: '???????', signalsTitle: '?? ?????????? ??????? ????',
    trainerEyebrow: '????????????? ???????', trainerTitle: '?????? ??? ???????? ?? ?????????', trainerSummary: '?? ??? ????? ??????? ???????????? ???????, ??????????? ? ????????????? ????, ??? ???? ????? ?? ???? ?????????, ? ? ???? ?????????? ??????????.', openTrainer: '???????? ?????? ??????',
    trainerStatusEyebrow: '???????? ????', trainerStatusTitle: '?? ??? ?????? ?????????? ? ????', trainerCard1Title: '?? ??? ????', trainerCard1Body: '???????? ??????????, ?????????, ????????? ????, ??????? ? ???????? ?????????? ????????.', trainerCard2Title: '?? ????', trainerCard2Body: '??? ??? ??????????? ??? ????????? ? Google Sheet, ??? ???? ???????? ??????? ??????? ? ??????, ? ???????.', trainerCard3Title: '???? ?? ??????? ????????', trainerCard3Body: '??????? ??????? ??????????, ? ?????? ????????, ?? ?? ???? ?????? ??????? ?????? ?????????? ??????????.',
    subjectEyebrow: '??????? ?? ??????????', subjectTitle: '??????? ???????? ? ????????? ????????????', modeEyebrow: '?????? ???????', modeTitle: '???????? ????? ?????????', resourcesEyebrow: '??????? ??????????', resourcesTitle: '????? ????????',
    chartsEyebrow: '??? ????????', chartAccuracyTitle: '???????? vs ???? ?? ??????????', chartStudyTitle: '????????? ??????? ?? ??????????', chartModeTitle: '????? ?? ????????', chartEffortTitle: '??????? vs ????????',
    efficiencyEyebrow: '????????????', efficiencyTitle: '??????? ??? ??????', scoreGapEyebrow: '?????? ? ?????', scoreGapTitle: 'Predicted ????? actual', sessionsTitle: '??????? ?????', studyBlocksTitle: '????????? ?????',
    linkLive: '????? ???????', linkLiveDesc: '????????? ??????? ?? Vercel', linkSheet: 'Google Sheet', linkSheetDesc: '???? ??????? ?????? ??? ?????????? ? ???????? ?????', linkLooker: 'Looker Studio', linkLookerDesc: '???????? polished-??? ??? ????????? ?????????', linkApps: 'Apps Script endpoint', linkAppsDesc: 'JSON-???? ??? Sheet ? ?????????', linkRepo: '???????????', linkRepoDesc: '???????????? ?????????, ??????? ? ??????? ?????',
    modeLoading: '???????????? ?????...', modeRemote: '????? Google Sheet', modeLocal: '?????? CSV ? ???????????', modeManual: '????? CSV-????????????', modeUnknown: '???????? ???????',
    liveActiveTitle: '????? ????? ????????.', liveActiveBody: '??????? ????? ????? ????? Google Sheet ????? Apps Script.', liveConfiguredTitle: '????? ????? ????????????, ??? ?? ?? ???????????.', liveConfiguredBody: 'Apps Script endpoint ???????, ??? ??????? ???? ???? ????? ?? CSV ?? ???????????.', liveMissingTitle: '????? ????? ?? ?? ???????????.', liveMissingBody: '????? ????????? Apps Script web app URL, ??? ??????? ??? ?????? Google Sheet ???????????.',
    metricStudy: '????????? ???????', metricSession: '??????? ???????', metricSessions: '?????????? ?????', metricAccuracy: '??????? ????????', metricSimulation: '???????? ?????????', metricQuestions: '?????????? ???????', metricReadiness: '?????? ??????????', metricEstimate: '??????? ?????? ????',
    readinessHigh: '??????', readinessBuilding: '???????????', readinessEarly: '?????? ????', readinessNone: '???? ?????? ?????', noSubjectCards: '??? ????? ??????? ?? ????? ?????? ?? ??????????.', targetSummarySuffix: '????????? ????? ??? ?? ????? ????????? ???? ??? ????.', unlockTarget: '????? predicted_score ??? actual exam results, ??? ????????? target tracking.', goalSummarySuffix1: '????????? ??? ?? ????? ???? ??? ????. Actual-???? ? ???', goalSummarySuffix2: '?????????.', noTrend: '???? ????? ?????? ?????. ????? ?????? ?????, ??? ???????? ????? ????.', firstLabel: '???????', latestLabel: '???????',
    insightStrongest: '???????????? ???????', insightWeakest: '?????????? ???????', insightMode: '????????????? ?????', insightInternal: '????????? vs ????????', insightTrainVsSim: '???????? vs ?????????', insightInterpretation: '?????????????',
    subjectBreakdownEmpty: '??? ????? ??????? ?? ????? subject-breakdown.', modeBreakdownEmpty: '???? ????? ?????? ?? ????????.', chartEmpty: '??? ????? ??????? ???? ?????? ?????.', studyLoad: '????????? ????????????', avgAccuracy: '??????? ????????', targetProgress: '??? ?? ????', rowsLabel: '??????', openSource: '???????? ???????', resourceSummary: '???????? {count} ?????? ?????? ??? {label}. ????????? ??????? ????? ????????? ?? ??????? ???????? ??????.', noResources: '??? ????? ??????? ?? ???????? ????????.', noRows: '??? ????? ??????? ???? ????? ??????.',
    target: '????', predicted: '???????', actual: '????', pointsAbove: '????? ???? ????', pointsLeft: '????? ?? ????', setTargetHint: '?????? ???? ? predicted score, ??? ???????????? ??????.', statusGoalReached: '???? ?????????', statusOnTrack: '?? ??????????', statusClose: '???????', statusNeedsPush: '???????? ?????????? ?????', currentEstimate: '??????? ??????', worthIt: 'Worth-it ??????', needsStudyMinutes: '???????? ????????? ??????? ??? ??????', accuracyPerHour: '??????? ???????? ?? ??????', scoreDataNeeded: '???????? ?????? score-?????', pointsToTarget: '????? ?? ????', actualVsPredicted: '???? ????? ????????', internal: '?????????', external: '????????', training: '????????', simulation: '?????????', review: '??????????', unknown: '????????', notEnoughData: '???? ?????? ?????',
    insightNarrativeNoData: '????? ???????? ???????? ? ?????????, ??? ??????? ??????? ??????? ??????????.', insightNarrativeTargets: '{done}/{total} ???????? ????????? ??? ????????? ?? ???? ??? ??????????? ??.', insightNarrativeEfficient: '??????? ?????? ????????????: ???????? ???????? ?????????? ??? ??? ??? ?????? ????????.', insightNarrativeNeedSim: '????????? ???? ??? ?, ??? ???????????? ???? ?? ?????. ????? ????? ???????, ???? ??? ?????? ???????? ??? ??????????.', insightNarrativeGeneral: '??????? ??? ??? ????????? ?????????, ??? ?????????? ????, score gaps ? ??? ?????????? ? ????.',
    sessionId: 'Session ID', date: '????', subject: '???????', platform: '?????????', mode: '?????', questionsTotal: '???????', correct: '?????????', accuracyPct: '???????? %', minutes: '???????', sessionLabel: '????? ?????', predictedScore: '????????????? ???', actualScore: '????????? ???', notes: '???????', resourceTitle: '??????', resourceType: '??? ???????', stage: '????', focusScore: '?????', energyLevel: '???????',
  }
};

const UK_OVERRIDES = {
  heroTitle: 'Аналітика магістерської підготовки',
  heroText: 'Синій research-cockpit для відстеження підготовки: навчальні блоки, тренувальні сесії, якість симуляцій, рух до цільового бала та сигнали готовності.',
  currentMode: 'Поточний режим',
  inputsEyebrow: 'Вхідні дані',
  inputsTitle: 'Поточний фокус і fallback-імпорти',
  inputsSummary: 'Головним джерелом є live-дані з Google Sheet. CSV-завантаження — лише ручний fallback для снапшотів, відновлення або тесту.',
  subjectFocus: 'Фокус по предметах',
  subjectAll: 'Усі предмети',
  manualFallback: 'Ручний CSV fallback',
  studyCsv: 'CSV навчального журналу',
  sessionCsv: 'CSV журналу сесій',
  tabOverview: 'Огляд',
  tabTrainer: 'Тренувальник',
  tabSubjects: 'Предмети',
  tabCharts: 'Графіки',
  tabEfficiency: 'Ефективність',
  tabSessions: 'Сесії',
  targetEyebrow: 'Рух до цілі',
  targetTitle: 'Наскільки ти близько до цільового бала',
  trendEyebrow: 'Тренд точності',
  trendTitle: 'Траєкторія сесій у часі',
  trendSummary: 'Поточна оцінка базується на останьому predicted або actual score, якщо він є.',
  goalEyebrow: 'Goal vs Reality',
  goalTitle: 'Великі картки з ціллю, оцінкою і реальним результатом',
  signalsEyebrow: 'Сигнали',
  signalsTitle: 'Що підказують поточні дані',
  trainerEyebrow: 'Інтерактивний простір',
  trainerTitle: 'Тренувальник для практики та симуляцій',
  trainerSummary: 'Тут живе той самий trainer workspace, що і в research-case, тож можна побачити не лише аналітику, а й сам інструмент підготовки.',
  openTrainer: 'Відкрити повний тренувальник',
  trainerStatusEyebrow: 'Поточний стан',
  trainerStatusTitle: 'Як цей тренер вписується в кейс',
  trainerCard1Title: 'Що він вже робить',
  trainerCard1Body: 'Запускає тренування, симуляції, навчальні логи, експорт та журнал сесій.',
  trainerCard2Title: 'Як він пов’язаний з даними',
  trainerCard2Body: 'Коли Apps Script endpoint відкритий, він може писати у той самий Google Sheet, який читає дашборд.',
  trainerCard3Title: 'Чому це важливо',
  trainerCard3Body: 'Так люди бачать не лише підсумки, а й реальний тренувальний простір, який стоїть за аналітикою.',
  subjectEyebrow: 'По предметах',
  subjectTitle: 'Де вже є сильні зони, а де відставання',
  modeEyebrow: 'Режими',
  modeTitle: 'Тренування проти симуляцій',
  resourcesEyebrow: 'Джерела',
  resourcesTitle: 'Мапа ресурсів',
  chartsEyebrow: 'Шар графіків',
  chartAccuracyTitle: 'Точність проти цілі по предметах',
  chartStudyTitle: 'Хвилини навчання по предметах',
  chartModeTitle: 'Сесії за режимами',
  chartEffortTitle: 'Зусилля проти точності',
  efficiencyEyebrow: 'Ефективність',
  efficiencyTitle: 'Де зусилля справді дає результат',
  scoreGapEyebrow: 'Розриви по балах',
  scoreGapTitle: 'Де оцінка й реальний результат розходяться',
  sessionsTitle: 'Журнал сесій',
  studyBlocksTitle: 'Навчальні блоки',
  linkLive: 'Live dashboard',
  linkLiveDesc: 'Публічний дашборд на Vercel',
  linkSheet: 'Google Sheet',
  linkSheetDesc: 'Live source of truth для study і session logs',
  linkLooker: 'Looker Studio',
  linkLookerDesc: 'Додатковий шар публічної візуалізації',
  linkApps: 'Apps Script endpoint',
  linkAppsDesc: 'JSON-міст між Sheet і dashboard',
  linkRepo: 'Repository',
  linkRepoDesc: 'Структура дослідження, шаблони та case notes',
  modeLoading: 'Завантаження даних...',
  modeRemote: 'Live Google Sheet',
  modeLocal: 'Repository CSV snapshot',
  modeManual: 'Ручно завантажений CSV',
  modeUnknown: 'Невідоме джерело',
  liveActiveTitle: 'Live mode активний.',
  liveActiveBody: 'Дашборд читає актуальні дані з Google Sheet через Apps Script endpoint.',
  liveConfiguredTitle: 'Live mode налаштований, але ще не активний.',
  liveConfiguredBody: 'Apps Script endpoint ще не повертає публічний JSON, тож dashboard тимчасово використовує repository CSV.',
  liveMissingTitle: 'Live mode ще не налаштований.',
  liveMissingBody: 'Додай Apps Script endpoint, щоб dashboard читав live-дані з Google Sheet.',
  metricStudy: 'Хвилини навчання',
  metricSession: 'Хвилини сесій',
  metricSessions: 'Сесій залоговано',
  metricAccuracy: 'Середня точність',
  metricSimulation: 'Точність симуляцій',
  metricQuestions: 'Питань відстежено',
  metricReadiness: 'Сигнал готовності',
  metricEstimate: 'Поточна оцінка',
  readinessHigh: 'Висока',
  readinessBuilding: 'Нарощується',
  readinessEarly: 'Рання стадія',
  readinessNone: 'Ще недостатньо даних',
  noSubjectCards: 'Поки немає достатньо даних по предметах.',
  targetSummarySuffix: 'вже на цілі',
  unlockTarget: 'Додай хоча б кілька сесій, щоб відкрити subject cards.',
  goalSummarySuffix1: 'предмети вже на цілі,',
  goalSummarySuffix2: 'мають реальний result',
  noTrend: 'Поки недостатньо даних для trend chart.',
  firstLabel: 'Перша',
  latestLabel: 'Остання',
  insightStrongest: 'Найсильніший предмет',
  insightWeakest: 'Найслабший предмет',
  insightMode: 'Домінуючий режим',
  insightInternal: 'Внутрішні vs зовнішні',
  insightTrainVsSim: 'Тренування vs симуляції',
  insightInterpretation: 'Інтерпретація',
  subjectBreakdownEmpty: 'Поки немає сесій для subject breakdown.',
  modeBreakdownEmpty: 'Поки немає сесій для mode breakdown.',
  chartEmpty: 'Поки недостатньо даних для графіка.',
  studyLoad: 'Навчальне навантаження',
  avgAccuracy: 'Середня точність',
  targetProgress: 'Рух до цілі',
  rowsLabel: 'рядків',
  openSource: 'Відкрити джерело',
  resourceSummary: 'Зараз доступно {count} ресурсів для фокусу: {label}.',
  noResources: 'Для цього фільтра поки немає ресурсів.',
  noRows: 'Поки немає рядків.',
  target: 'Ціль',
  predicted: 'Predicted',
  actual: 'Actual',
  pointsAbove: 'балів вище',
  pointsLeft: 'балів до цілі',
  setTargetHint: 'Задай target у config.js',
  statusGoalReached: 'Ціль досягнуто',
  statusOnTrack: 'В нормі',
  statusClose: 'Близько',
  statusNeedsPush: 'Треба підсилити',
  currentEstimate: 'Поточна оцінка',
  worthIt: 'Окупність зусиль',
  needsStudyMinutes: 'Потрібно більше хвилин навчання',
  accuracyPerHour: 'Точність за годину',
  scoreDataNeeded: 'Поки недостатньо даних по балах',
  pointsToTarget: 'балів до цілі',
  actualVsPredicted: 'Actual vs predicted',
  internal: 'Внутрішні',
  external: 'Зовнішні',
  training: 'Тренування',
  simulation: 'Симуляція',
  review: 'Повторення',
  unknown: 'Невідомо',
  notEnoughData: 'Недостатньо даних',
  insightNarrativeNoData: 'Поки немає даних, щоб робити висновки.',
  insightNarrativeTargets: 'Вже {done} із {total} предметів дісталися цілі.',
  insightNarrativeEfficient: 'Точність вже сильна, а витрати часу поки помірні.',
  signal: 'Сигнал',
  insightNarrativeNeedSim: 'Додай хоча б одну повну симуляцію, щоб оцінка була чеснішою.',
  insightNarrativeGeneral: 'Підготовка рухається, але ще варто вирівняти баланс між training і simulation.',
  sessionId: 'Session ID',
  date: 'Дата',
  subject: 'Предмет',
  platform: 'Платформа',
  mode: 'Режим',
  questionsTotal: 'Питань всього',
  correct: 'Правильних',
  accuracyPct: 'Точність %',
  minutes: 'Хвилини',
  sessionLabel: 'Мітка сесії',
  predictedScore: 'Predicted score',
  actualScore: 'Actual score',
  notes: 'Нотатки',
  resourceTitle: 'Ресурс',
  resourceType: 'Тип ресурсу',
  stage: 'Етап',
  focusScore: 'Фокус',
  energyLevel: 'Енергія'
};

const el = {
  studyFile: document.getElementById('study-file'), sessionFile: document.getElementById('session-file'), subjectFilter: document.getElementById('subject-filter'), metrics: document.getElementById('metrics'), insightsGrid: document.getElementById('insights-grid'), subjectBreakdown: document.getElementById('subject-breakdown'), modeBreakdown: document.getElementById('mode-breakdown'), resourceGrid: document.getElementById('resource-grid'), resourceSummary: document.getElementById('resource-summary'), sessionsTable: document.getElementById('sessions-table'), studyTable: document.getElementById('study-table'), sourceStatus: document.getElementById('source-status'), projectLinks: document.getElementById('project-links'), targetGrid: document.getElementById('target-grid'), targetSummary: document.getElementById('target-summary'), liveModeNote: document.getElementById('live-mode-note'), trendChart: document.getElementById('trend-chart'), goalVsReality: document.getElementById('goal-vs-reality'), goalVsRealitySummary: document.getElementById('goal-vs-reality-summary'), efficiencyGrid: document.getElementById('efficiency-grid'), scoreGapGrid: document.getElementById('score-gap-grid'), accuracyTargetChart: document.getElementById('accuracy-target-chart'), studyMinutesChart: document.getElementById('study-minutes-chart'), modeChart: document.getElementById('mode-chart'), effortAccuracyChart: document.getElementById('effort-accuracy-chart'), tabs: Array.from(document.querySelectorAll('.tab')), tabPanels: Array.from(document.querySelectorAll('.tab-panel')), langButtons: Array.from(document.querySelectorAll('.lang-pill')),
};

const state = { study: [], sessions: [], resources: [], subject: 'all', sourceMode: 'loading', updatedAt: '', lang: 'en' };

document.addEventListener('DOMContentLoaded', init);

async function init() {
  state.lang = getSavedLang();
  bindEvents();
  applyTranslations();
  renderLinks();
  await loadInitialData();
  render();
}

function bindEvents() {
  if (el.studyFile) el.studyFile.addEventListener('change', async (event) => { state.study = await readCsvFile(event.target.files?.[0]); state.sourceMode = 'manual_csv'; render(); });
  if (el.sessionFile) el.sessionFile.addEventListener('change', async (event) => { state.sessions = await readCsvFile(event.target.files?.[0]); state.sourceMode = 'manual_csv'; render(); });
  if (el.subjectFilter) el.subjectFilter.addEventListener('change', (event) => { state.subject = event.target.value; render(); });
  el.tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab.dataset.tab)));
  el.langButtons.forEach((button) => button.addEventListener('click', () => { if (button.dataset.lang) setLanguage(button.dataset.lang); }));
}

function activateTab(name) {
  el.tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === name));
  el.tabPanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === name));
}

function getSavedLang() {
  try { const saved = localStorage.getItem(LANG_KEY); return saved === 'uk' ? 'uk' : 'en'; } catch { return 'en'; }
}

function setLanguage(lang) {
  state.lang = lang === 'uk' ? 'uk' : 'en';
  try { localStorage.setItem(LANG_KEY, state.lang); } catch {}
  render();
}

function t(key) { const override = state.lang === 'uk' ? UK_OVERRIDES[key] : undefined; const current = override ?? COPY[state.lang]?.[key]; if (typeof current === 'string' && current && !/^\?+$/.test(current) && !current.includes('????')) return current; return COPY.en[key] ?? key; }
function subjectLabel(subject) { const meta = SUBJECT_META[subject] || SUBJECT_META.tznk; return state.lang === 'uk' ? meta.uk : meta.en; }

function applyTranslations() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach((node) => { node.textContent = t(node.dataset.i18n); });
  if (el.subjectFilter) {
    const labels = { all: t('subjectAll'), tznk: subjectLabel('tznk'), english: subjectLabel('english'), it: subjectLabel('it') };
    Array.from(el.subjectFilter.options).forEach((option) => { option.textContent = labels[option.value] || option.textContent; });
  }
  el.langButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.lang === state.lang));
}
async function loadInitialData() {
  state.resources = await loadResources();
  if (getDataEndpoint()) {
    const ok = await loadRemoteData();
    if (ok) return;
  }
  await loadLocalCsvData();
}

async function loadResources() {
  try {
    const res = await fetch('./data/resource_catalog.csv', { cache: 'no-store' });
    if (!res.ok) return [];
    const text = await res.text();
    return parseCsv(text);
  } catch (error) {
    console.warn('Resource catalog unavailable in deploy root.', error);
    return [];
  }
}

function getDataEndpoint() { return String(config.dataEndpoint || '').trim(); }

async function loadRemoteData() {
  try {
    const res = await fetch(getDataEndpoint(), { cache: 'no-store' });
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
  const [studyRows, sessionRows] = await Promise.all([
    fetch('./data/study_log_template.csv', { cache: 'no-store' }).then((res) => (res.ok ? res.text() : '')).then(parseCsv).catch(() => []),
    fetch('./data/session_log_template.csv', { cache: 'no-store' }).then((res) => (res.ok ? res.text() : '')).then(parseCsv).catch(() => []),
  ]);
  state.study = studyRows;
  state.sessions = sessionRows;
  state.sourceMode = 'local_csv';
}

function render() {
  applyTranslations();
  renderLinks();
  const studyRows = filterBySubject(state.study, state.subject);
  const sessionRows = filterBySubject(state.sessions, state.subject);
  const resourceRows = filterResources(state.resources, state.subject);
  [
    () => renderSourceStatus(),
    () => renderLiveModeNote(),
    () => renderMetrics(studyRows, sessionRows),
    () => renderTargetCards(sessionRows),
    () => renderGoalVsReality(sessionRows),
    () => renderTrendChart(sessionRows),
    () => renderInsights(studyRows, sessionRows),
    () => renderBreakdowns(sessionRows, studyRows),
    () => renderCharts(studyRows, sessionRows),
    () => renderEfficiency(studyRows, sessionRows),
    () => renderResources(resourceRows),
    () => renderSessions(sessionRows),
    () => renderStudy(studyRows),
  ].forEach((step) => {
    try {
      step();
    } catch (error) {
      console.warn('Dashboard render step failed.', error);
    }
  });
}

function renderLinks() {
  const links = [
    cardLink(t('linkLive'), config.links?.liveDashboard, t('linkLiveDesc')),
    cardLink(t('linkSheet'), config.links?.googleSheet, t('linkSheetDesc')),
    cardLink(t('linkLooker'), config.links?.lookerStudio, t('linkLookerDesc')),
    cardLink(t('linkApps'), config.links?.appsScript, t('linkAppsDesc')),
    cardLink(t('linkRepo'), config.links?.repository, t('linkRepoDesc')),
  ].filter(Boolean);
  if (el.projectLinks) el.projectLinks.innerHTML = links.join('');
}

function renderLiveModeNote() {
  if (!el.liveModeNote) return;
  if (state.sourceMode === 'remote_sheet') {
    el.liveModeNote.innerHTML = `<strong>${escapeHtml(t('liveActiveTitle'))}</strong><span>${escapeHtml(t('liveActiveBody'))}</span>`;
    return;
  }
  if (getDataEndpoint()) {
    el.liveModeNote.innerHTML = `<strong>${escapeHtml(t('liveConfiguredTitle'))}</strong><span>${escapeHtml(t('liveConfiguredBody'))}</span>`;
    return;
  }
  el.liveModeNote.innerHTML = `<strong>${escapeHtml(t('liveMissingTitle'))}</strong><span>${escapeHtml(t('liveMissingBody'))}</span>`;
}

function renderSourceStatus() {
  if (!el.sourceStatus) return;
  const map = { loading: t('modeLoading'), remote_sheet: t('modeRemote'), local_csv: t('modeLocal'), manual_csv: t('modeManual') };
  const suffix = state.updatedAt ? ` (${state.updatedAt})` : '';
  el.sourceStatus.textContent = `${map[state.sourceMode] || t('modeUnknown')}${suffix}`;
}

function renderMetrics(studyRows, sessionRows) {
  if (!el.metrics) return;
  const totalStudy = sum(studyRows.map((row) => toFiniteNumber(row.minutes)));
  const totalSession = sum(sessionRows.map((row) => toFiniteNumber(row.minutes)));
  const totalSessions = sessionRows.length;
  const avgAccuracy = average(sessionRows.map((row) => toFiniteNumber(row.accuracy_pct)));
  const simulationAccuracy = average(sessionRows.filter((row) => isSimulation(row.mode)).map((row) => toFiniteNumber(row.accuracy_pct)));
  const totalQuestions = sum(sessionRows.map((row) => toFiniteNumber(firstDefined(row.questions_total, row.answered, row.questions_answered))));
  const readiness = estimateReadiness(sessionRows);
  const estimatedScore = average(getCurrentSubjectCards(sessionRows).map((card) => card.currentScoreValue).filter(Number.isFinite));
  el.metrics.innerHTML = [
    metric(t('metricStudy'), totalStudy), metric(t('metricSession'), totalSession), metric(t('metricSessions'), totalSessions), metric(t('metricAccuracy'), `${avgAccuracy}%`), metric(t('metricSimulation'), simulationAccuracy ? `${simulationAccuracy}%` : '-'), metric(t('metricQuestions'), totalQuestions), metric(t('metricReadiness'), readiness), metric(t('metricEstimate'), estimatedScore ? round(estimatedScore, 1) : '-'),
  ].join('');
}

function renderTargetCards(sessionRows) {
  const cards = visibleSubjectCards(sessionRows);
  const fulfilled = cards.filter((card) => Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue) && card.currentScoreValue >= card.targetScore).length;
  if (el.targetSummary) el.targetSummary.textContent = cards.length ? `${fulfilled}/${cards.length} ${t('targetSummarySuffix')}` : t('noSubjectCards');
  if (el.targetGrid) el.targetGrid.innerHTML = cards.length ? cards.map(renderTargetCard).join('') : `<p class="empty">${escapeHtml(t('unlockTarget'))}</p>`;
}

function renderGoalVsReality(sessionRows) {
  const cards = visibleSubjectCards(sessionRows);
  const readyCount = cards.filter((card) => Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue) && card.currentScoreValue >= card.targetScore).length;
  const actualCount = cards.filter((card) => Number.isFinite(card.actualScoreValue)).length;
  if (el.goalVsRealitySummary) el.goalVsRealitySummary.textContent = cards.length ? `${readyCount}/${cards.length} ${t('goalSummarySuffix1')} ${actualCount}/${cards.length} ${t('goalSummarySuffix2')}` : t('noSubjectCards');
  if (!el.goalVsReality) return;
  el.goalVsReality.innerHTML = cards.length ? cards.map((card) => {
    const gap = Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue) ? round(card.targetScore - card.currentScoreValue, 1) : NaN;
    return `<article class="goal-reality-card"><div class="goal-reality-card__top"><strong>${escapeHtml(subjectLabel(card.subject))}</strong><span class="badge">${escapeHtml(goalStateLabel(card, gap))}</span></div><div class="goal-reality-metric-row"><div><span>${escapeHtml(t('currentEstimate'))}</span><strong>${escapeHtml(card.currentScoreLabel)}</strong></div><div><span>${escapeHtml(t('target'))}</span><strong>${escapeHtml(card.targetLabel)}</strong></div><div><span>${escapeHtml(t('predicted'))}</span><strong>${escapeHtml(card.predictedLabel)}</strong></div><div><span>${escapeHtml(t('actual'))}</span><strong>${escapeHtml(card.actualLabel)}</strong></div></div><div class="progress-track"><div class="progress-bar${card.progressPercent >= 100 ? ' is-over' : ''}" style="width:${Math.max(card.progressPercent, 4)}%"></div></div></article>`;
  }).join('') : `<p class="empty">${escapeHtml(t('noSubjectCards'))}</p>`;
}

function renderTrendChart(sessionRows) {
  if (!el.trendChart) return;
  const rows = sessionRows.filter((row) => Number.isFinite(toFiniteNumber(row.accuracy_pct))).sort((a, b) => safeDate(a.date) - safeDate(b.date));
  if (!rows.length) {
    el.trendChart.innerHTML = `<p class="empty">${escapeHtml(t('noTrend'))}</p>`;
    return;
  }
  const points = rows.map((row, index) => {
    const x = rows.length === 1 ? 320 : 28 + (index * (584 / Math.max(rows.length - 1, 1)));
    const y = 172 - ((clamp(toFiniteNumber(row.accuracy_pct), 0, 100) / 100) * 136);
    return { x, y, row };
  });
  const polyline = points.map((point) => `${round(point.x, 1)},${round(point.y, 1)}`).join(' ');
  const dots = points.map((point) => `<circle cx="${round(point.x, 1)}" cy="${round(point.y, 1)}" r="4.5" fill="#70d6ff" />`).join('');
  const guides = [20, 40, 60, 80].map((tick) => { const y = 172 - ((tick / 100) * 136); return `<line x1="24" y1="${round(y, 1)}" x2="612" y2="${round(y, 1)}" stroke="rgba(157,178,203,0.16)" stroke-width="1" /><text x="0" y="${round(y + 4, 1)}" fill="#9db2cb" font-size="11">${tick}%</text>`; }).join('');
  const first = rows[0]; const last = rows[rows.length - 1];
  el.trendChart.innerHTML = `<svg viewBox="0 0 620 190" role="img" aria-label="Accuracy trend over time">${guides}<polyline points="${polyline}" fill="none" stroke="url(#trendStroke)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>${dots}<defs><linearGradient id="trendStroke" x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" stop-color="#70d6ff"></stop><stop offset="100%" stop-color="#8a8bff"></stop></linearGradient></defs></svg><div class="chart-caption"><span><strong>${escapeHtml(t('firstLabel'))}:</strong> ${escapeHtml(first.date || 'n/a')} / ${round(toFiniteNumber(first.accuracy_pct), 1)}%</span><span><strong>${escapeHtml(t('latestLabel'))}:</strong> ${escapeHtml(last.date || 'n/a')} / ${round(toFiniteNumber(last.accuracy_pct), 1)}%</span></div>`;
}
function renderInsights(studyRows, sessionRows) {
  if (!el.insightsGrid) return;
  const internalCount = sessionRows.filter(isInternalSession).length;
  const externalCount = sessionRows.length - internalCount;
  const trainingRows = sessionRows.filter((row) => cleanMode(row.mode).includes('train') || cleanMode(row.mode).includes('practice'));
  const simulationRows = sessionRows.filter((row) => isSimulation(row.mode));
  el.insightsGrid.innerHTML = [
    insight(t('insightStrongest'), subjectSummary(sessionRows, 'best') || t('notEnoughData')),
    insight(t('insightWeakest'), subjectSummary(sessionRows, 'worst') || t('notEnoughData')),
    insight(t('insightMode'), mostCommon(sessionRows.map((row) => cleanMode(row.mode))) || t('notEnoughData')),
    insight(t('insightInternal'), `${internalCount} ${t('internal')} / ${externalCount} ${t('external')}`),
    insight(t('insightTrainVsSim'), `${trainingRows.length} ${t('training')} / ${simulationRows.length} ${t('simulation')}`),
    insight(t('insightInterpretation'), insightNarrative(studyRows, sessionRows)),
  ].join('');
}

function renderBreakdowns(sessionRows, studyRows) {
  if (el.subjectBreakdown) {
    const subjectCards = visibleSubjectCards(sessionRows);
    el.subjectBreakdown.innerHTML = subjectCards.length ? subjectCards.map((card) => `<article class="stack-card"><div class="subject-line"><strong>${escapeHtml(subjectLabel(card.subject))}</strong><span>${escapeHtml(card.currentLabel)}</span></div><div class="bar-stack">${miniBar(t('avgAccuracy'), card.avgAccuracy, 100, `${card.avgAccuracy}%`)}${miniBar(t('targetProgress'), card.currentScoreValue, card.targetScore || 100, `${card.currentScoreLabel} / ${card.targetLabel}`)}${miniBar(t('studyLoad'), card.studyMinutes, maxSubjectStudy(studyRows) || 1, `${card.studyMinutes} min`)}</div></article>`).join('') : `<p class="empty">${escapeHtml(t('subjectBreakdownEmpty'))}</p>`;
  }
  if (el.modeBreakdown) {
    const modeStats = Object.entries(groupRows(sessionRows, (row) => cleanMode(row.mode) || 'unknown'));
    el.modeBreakdown.innerHTML = modeStats.length ? modeStats.map(([mode, rows]) => `<article class="stack-card"><strong>${escapeHtml(localizeMode(mode))}</strong><span>${rows.length} ${escapeHtml(t('rowsLabel'))}</span><span>${average(rows.map((row) => toFiniteNumber(row.accuracy_pct)))}% ${escapeHtml(t('avgAccuracy').toLowerCase())}</span><span>${sum(rows.map((row) => toFiniteNumber(row.minutes)))} min</span></article>`).join('') : `<p class="empty">${escapeHtml(t('modeBreakdownEmpty'))}</p>`;
  }
}

function renderCharts(studyRows, sessionRows) {
  const cards = visibleSubjectCards(sessionRows);
  renderBarChart(el.accuracyTargetChart, cards.map((card) => ({ label: subjectLabel(card.subject), left: `${card.avgAccuracy}%`, right: `${t('target')} ${card.targetLabel}`, value: card.avgAccuracy, max: Math.max(card.targetScore || 100, 100) })));
  renderBarChart(el.studyMinutesChart, cards.map((card) => ({ label: subjectLabel(card.subject), left: `${card.studyMinutes} min`, right: card.sessionMinutes ? `${card.sessionMinutes} session min` : '-', value: card.studyMinutes, max: Math.max(maxSubjectStudy(studyRows), 1) })));
  const grouped = groupRows(sessionRows, (row) => cleanMode(row.mode) || 'unknown');
  const modeStats = Object.entries(grouped).map(([mode, rows]) => ({ label: localizeMode(mode), left: `${rows.length} ${t('rowsLabel')}`, right: `${average(rows.map((row) => toFiniteNumber(row.accuracy_pct)))}%`, value: rows.length, max: Math.max(...Object.values(grouped).map((r) => r.length), 1) }));
  renderBarChart(el.modeChart, modeStats);
  renderBarChart(el.effortAccuracyChart, cards.map((card) => ({ label: subjectLabel(card.subject), left: card.studyMinutes ? `${round(card.avgAccuracy / Math.max(card.studyMinutes / 60, 0.25), 1)} ${t('accuracyPerHour')}` : t('needsStudyMinutes'), right: `${card.avgAccuracy}%`, value: card.studyMinutes ? round(card.avgAccuracy / Math.max(card.studyMinutes / 60, 0.25), 1) : 0, max: Math.max(...cards.map((item) => item.studyMinutes ? round(item.avgAccuracy / Math.max(item.studyMinutes / 60, 0.25), 1) : 0), 1) })));
}

function renderBarChart(container, items) {
  if (!container) return;
  if (!items.length) { container.innerHTML = `<p class="empty">${escapeHtml(t('chartEmpty'))}</p>`; return; }
  container.innerHTML = items.map((item) => { const percent = item.max ? clamp((item.value / item.max) * 100, 0, 100) : 0; return `<article class="chart-stack-card"><div class="chart-bar-row"><div class="chart-bar-row__meta"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.left)}</span></div><div class="chart-bar-row__tail">${escapeHtml(item.right || '')}</div></div><div class="mini-bar__track"><div class="mini-bar__fill" style="width:${percent}%"></div></div></article>`; }).join('');
}

function renderEfficiency(studyRows, sessionRows) {
  const cards = visibleSubjectCards(sessionRows);
  if (el.efficiencyGrid) {
    const efficiencyCards = cards.map((card) => { const efficiencyScore = card.studyMinutes ? round(card.avgAccuracy / Math.max(card.studyMinutes / 60, 0.25), 1) : 0; const label = card.studyMinutes ? `${efficiencyScore} ${t('accuracyPerHour')}` : t('needsStudyMinutes'); return insight(`${subjectLabel(card.subject)} ${t('worthIt').toLowerCase()}`, label); });
    el.efficiencyGrid.innerHTML = efficiencyCards.length ? efficiencyCards.join('') : `<p class="empty">${escapeHtml(t('chartEmpty'))}</p>`;
  }
  if (el.scoreGapGrid) {
    el.scoreGapGrid.innerHTML = cards.length ? cards.map((card) => { const gapText = Number.isFinite(card.actualScoreValue) && Number.isFinite(card.predictedScoreValue) ? `${round(card.actualScoreValue - card.predictedScoreValue, 1)} ${t('actualVsPredicted')}` : Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue) ? `${round(card.targetScore - card.currentScoreValue, 1)} ${t('pointsToTarget')}` : t('scoreDataNeeded'); return `<article class="stack-card"><strong>${escapeHtml(subjectLabel(card.subject))}</strong><span>${escapeHtml(t('predicted'))}: ${escapeHtml(card.predictedLabel)}</span><span>${escapeHtml(t('actual'))}: ${escapeHtml(card.actualLabel)}</span><span>${escapeHtml(t('target'))}: ${escapeHtml(card.targetLabel)}</span><span>${escapeHtml(gapText)}</span></article>`; }).join('') : `<p class="empty">${escapeHtml(t('chartEmpty'))}</p>`;
  }
}

function renderResources(rows) {
  if (el.resourceSummary) {
    const label = state.subject === 'all' ? t('subjectAll').toLowerCase() : subjectLabel(state.subject);
    el.resourceSummary.textContent = t('resourceSummary').replace('{count}', rows.length).replace('{label}', label);
  }
  if (!el.resourceGrid) return;
  if (!rows.length) { el.resourceGrid.innerHTML = `<p class="empty">${escapeHtml(t('noResources'))}</p>`; return; }
  el.resourceGrid.innerHTML = rows.map((row) => `<article class="resource-card"><div class="badge-row"><span class="badge">${escapeHtml(subjectLabel(normalizeSubject(row.subject) || 'tznk'))}</span><span class="badge">${escapeHtml(row.resource_type || '')}</span><span class="badge">${escapeHtml(row.stage || '')}</span><span class="badge priority-${escapeHtml((row.priority || '').toLowerCase())}">${escapeHtml(row.priority || '')}</span></div><h3>${escapeHtml(row.title || '')}</h3><p>${escapeHtml(row.why_use || '')}</p><a href="${escapeAttr(row.url || '#')}" target="_blank" rel="noreferrer">${escapeHtml(t('openSource'))}</a></article>`).join('');
}

function renderSessions(rows) { if (el.sessionsTable) el.sessionsTable.innerHTML = renderTable(rows, ['date', 'subject', 'platform', 'mode', 'questions_total', 'correct', 'accuracy_pct', 'minutes', 'session_label', 'predicted_score', 'actual_score', 'notes']); }
function renderStudy(rows) { if (el.studyTable) el.studyTable.innerHTML = renderTable(rows, ['date', 'subject', 'resource_title', 'resource_type', 'stage', 'minutes', 'focus_score', 'energy_level', 'notes']); }

function renderTable(rows, columns) {
  if (!rows.length) return `<p class="empty">${escapeHtml(t('noRows'))}</p>`;
  const head = columns.map((col) => `<th>${escapeHtml(headerLabel(col))}</th>`).join('');
  const body = rows.map((row) => `<tr>${columns.map((col) => `<td>${escapeHtml(formatCell(col, row[col]))}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function visibleSubjectCards(sessionRows) { const cards = getCurrentSubjectCards(sessionRows); return state.subject === 'all' ? cards : cards.filter((card) => card.subject === state.subject); }
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
    const progressPercent = Number.isFinite(targetScore) && targetScore > 0 && Number.isFinite(currentScore) ? clamp((currentScore / targetScore) * 100, 0, 140) : 0;
    return { subject, avgAccuracy, studyMinutes, sessionMinutes, targetScore, currentScoreValue: currentScore, predictedScoreValue: latestPredicted, actualScoreValue: latestActual, progressPercent, targetLabel: Number.isFinite(targetScore) ? `${targetScore}` : '-', currentLabel: Number.isFinite(currentScore) ? `${round(currentScore, 1)}` : t('notEnoughData'), currentScoreLabel: Number.isFinite(currentScore) ? `${round(currentScore, 1)}` : '-', predictedLabel: Number.isFinite(latestPredicted) ? `${round(latestPredicted, 1)}` : '-', actualLabel: Number.isFinite(latestActual) ? `${round(latestActual, 1)}` : '-' };
  });
}

function renderTargetCard(card) {
  const gap = Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue) ? round(card.targetScore - card.currentScoreValue, 1) : NaN;
  const statusText = Number.isFinite(gap) ? (gap <= 0 ? `${Math.abs(gap)} ${t('pointsAbove')}` : `${gap} ${t('pointsLeft')}`) : t('setTargetHint');
  return `<article class="target-card"><div class="target-topline"><strong>${escapeHtml(subjectLabel(card.subject))}</strong><span class="target-score">${escapeHtml(card.currentScoreLabel)}</span></div><p>${escapeHtml(t('target'))} ${escapeHtml(card.targetLabel)} ? ${escapeHtml(t('predicted'))} ${escapeHtml(card.predictedLabel)} ? ${escapeHtml(t('actual'))} ${escapeHtml(card.actualLabel)}</p><div class="progress-track"><div class="progress-bar${card.progressPercent >= 100 ? ' is-over' : ''}" style="width:${Math.max(card.progressPercent, 4)}%"></div></div><div class="progress-meta"><span>${escapeHtml(statusText)}</span><strong>${escapeHtml(`${round(card.progressPercent || 0)}%`)}</strong></div></article>`;
}

function goalStateLabel(card, gap) {
  if (!Number.isFinite(card.currentScoreValue) || !Number.isFinite(card.targetScore)) return t('notEnoughData');
  if (gap <= 0) return t('statusGoalReached');
  if (gap <= 5) return t('statusOnTrack');
  if (gap <= 12) return t('statusClose');
  return t('statusNeedsPush');
}

function cardLink(label, href, description) { if (!href) return ''; return `<a class="link-card" href="${escapeAttr(href)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(description)}</span></a>`; }
function metric(label, value) { return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`; }
function insight(label, value) { return `<article class="insight-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`; }
function miniBar(label, value, maxValue, tail) { const percent = maxValue ? clamp((value / maxValue) * 100, 0, 100) : 0; return `<div class="mini-bar"><div class="mini-bar__meta"><span>${escapeHtml(label)}</span><span>${escapeHtml(tail)}</span></div><div class="mini-bar__track"><div class="mini-bar__fill" style="width:${percent}%"></div></div></div>`; }

function filterBySubject(rows, subject) { if (subject === 'all') return rows; return rows.filter((row) => normalizeSubject(row.subject) === subject); }
function filterResources(rows, subject) { if (subject === 'all') return rows; return rows.filter((row) => normalizeSubject(row.subject) === subject || normalizeSubject(row.subject) === 'all'); }

function estimateReadiness(rows) {
  const simulationAccuracy = average(rows.filter((row) => isSimulation(row.mode)).map((row) => toFiniteNumber(row.accuracy_pct)));
  const overallAccuracy = average(rows.map((row) => toFiniteNumber(row.accuracy_pct)));
  const latestPredicted = latestNumeric(rows, 'predicted_score');
  const signal = firstFinite(simulationAccuracy, overallAccuracy, latestPredicted, 0);
  if (!signal) return t('readinessNone');
  if (signal >= 85) return t('readinessHigh');
  if (signal >= 70) return t('readinessBuilding');
  return t('readinessEarly');
}

function subjectSummary(rows, kind) {
  const entries = SUBJECTS.map((subject) => { const subjectRows = rows.filter((row) => normalizeSubject(row.subject) === subject); return { subject, value: average(subjectRows.map((row) => toFiniteNumber(row.accuracy_pct))) }; }).filter((entry) => entry.value > 0);
  if (!entries.length) return '';
  entries.sort((a, b) => kind === 'best' ? b.value - a.value : a.value - b.value);
  return `${subjectLabel(entries[0].subject)} (${entries[0].value}%)`;
}

function mostCommon(values) { const counts = values.filter(Boolean).reduce((acc, value) => { acc[value] = (acc[value] || 0) + 1; return acc; }, {}); const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]); return entries[0] ? `${localizeMode(entries[0][0])} (${entries[0][1]})` : ''; }

function insightNarrative(studyRows, sessionRows) {
  const avgAccuracy = average(sessionRows.map((row) => toFiniteNumber(row.accuracy_pct)));
  const studyMin = sum(studyRows.map((row) => toFiniteNumber(row.minutes)));
  const simCount = sessionRows.filter((row) => isSimulation(row.mode)).length;
  const cards = getCurrentSubjectCards(sessionRows).filter((card) => Number.isFinite(card.targetScore) && Number.isFinite(card.currentScoreValue));
  const onTrack = cards.filter((card) => card.currentScoreValue >= card.targetScore).length;
  if (!sessionRows.length) return t('insightNarrativeNoData');
  if (onTrack && cards.length) return t('insightNarrativeTargets').replace('{done}', onTrack).replace('{total}', cards.length);
  if (avgAccuracy >= 80 && studyMin < 300) return t('insightNarrativeEfficient');
  if (simCount === 0) return t('insightNarrativeNeedSim');
  return t('insightNarrativeGeneral');
}

function isSimulation(mode) { return cleanMode(mode).includes('sim'); }
function isInternalSession(row) { const flag = String(firstDefined(row.is_internal, '')).toLowerCase(); return flag === 'true' || flag === '1' || flag === 'yes'; }
function localizeMode(mode) { const clean = cleanMode(mode); if (clean.includes('sim')) return t('simulation'); if (clean.includes('review')) return t('review'); if (clean.includes('practice') || clean.includes('train')) return t('training'); return clean || t('unknown'); }
function headerLabel(column) { const map = { session_id: t('sessionId'), date: t('date'), subject: t('subject'), platform: t('platform'), mode: t('mode'), questions_total: t('questionsTotal'), correct: t('correct'), accuracy_pct: t('accuracyPct'), minutes: t('minutes'), session_label: t('sessionLabel'), predicted_score: t('predictedScore'), actual_score: t('actualScore'), notes: t('notes'), resource_title: t('resourceTitle'), resource_type: t('resourceType'), stage: t('stage'), focus_score: t('focusScore'), energy_level: t('energyLevel') }; return map[column] || column; }
function formatCell(column, value) { if (column === 'subject') return SUBJECT_META[normalizeSubject(value)] ? subjectLabel(normalizeSubject(value)) : value; if (column === 'mode') return localizeMode(value); return value ?? ''; }
function groupRows(rows, keyFn) { return rows.reduce((acc, row) => { const key = keyFn(row) || 'unknown'; acc[key] ||= []; acc[key].push(row); return acc; }, {}); }
function maxSubjectStudy(studyRows) { return Math.max(0, ...SUBJECTS.map((subject) => { const rows = studyRows.filter((row) => normalizeSubject(row.subject) === subject); return sum(rows.map((row) => toFiniteNumber(row.minutes))); })); }
function latestNumeric(rows, field) { const sorted = [...rows].sort((a, b) => safeDate(a.date) - safeDate(b.date)); const values = sorted.map((row) => toFiniteNumber(row[field])).filter((value) => Number.isFinite(value)); return values.length ? values[values.length - 1] : NaN; }
function safeDate(value) { const parsed = new Date(value || 0).getTime(); return Number.isFinite(parsed) ? parsed : 0; }
function firstFinite() { return Array.from(arguments).find((value) => Number.isFinite(value)); }
function normalizeRows(rows) { return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : []; }
function sum(values) { return Math.round(values.reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0)); }
function average(values) { const clean = values.filter(Number.isFinite); if (!clean.length) return 0; return round(clean.reduce((acc, value) => acc + value, 0) / clean.length, 1); }
function round(value, digits = 0) { const factor = 10 ** digits; return Math.round(value * factor) / factor; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function toFiniteNumber(value) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : NaN; }
function firstDefined() { return Array.from(arguments).find((value) => value !== undefined && value !== null && value !== ''); }
async function readCsvFile(file) { if (!file) return []; const text = await file.text(); return parseCsv(text); }
function parseCsv(text) { const normalized = (text || '').trim(); if (!normalized) return []; const lines = normalized.split(/\r?\n/); const headers = splitCsvLine(lines[0]); return lines.slice(1).filter(Boolean).map((line) => { const cells = splitCsvLine(line); const row = {}; headers.forEach((header, index) => { row[header] = cells[index] ?? ''; }); return row; }); }
function splitCsvLine(line) { const cells = []; let current = ''; let inQuotes = false; for (let i = 0; i < line.length; i += 1) { const char = line[i]; const next = line[i + 1]; if (char === '"') { if (inQuotes && next === '"') { current += '"'; i += 1; } else { inQuotes = !inQuotes; } } else if (char === ',' && !inQuotes) { cells.push(current); current = ''; } else { current += char; } } cells.push(current); return cells; }
function normalizeSubject(value) { return String(value || '').trim().toLowerCase(); }
function cleanMode(value) { return String(value || '').trim().toLowerCase(); }
function escapeHtml(value) { return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function escapeAttr(value) { return escapeHtml(value); }
