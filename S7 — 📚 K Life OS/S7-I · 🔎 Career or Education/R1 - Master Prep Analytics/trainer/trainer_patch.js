(() => {
  const MATERIALS = {
    'tznk-foundations': {
      overview: 'Міні-конспект для старту: як читати умову, не губитися в обмеженнях і доводити відповідь, а не вгадувати.',
      sections: [
        { title: 'Що вчити зараз', bullets: [
          'логічні зв’язки: усі, деякі, жоден, лише',
          'порядок і розсадку',
          'множини та перетини',
          'що точно випливає з аргументу'
        ]},
        { title: 'Як працювати', bullets: [
          'перекладати текст у коротку міні-схему',
          'відділяти, що must be true, а що may be true',
          'відсікати варіанти, які не доводяться',
          'для чисел робити малу таблицю або схему'
        ]},
        { title: 'Типові пастки', bullets: [
          'плутанина між «усі» і «деякі»',
          'відповідь за інтуїцією, а не з умови',
          'пропущені слова «лише», «не більше», «щонайменше»'
        ]}
      ],
      links: [
        ['Офіційна сторінка ЄВІ / ЄФВВ 2026', 'https://testportal.gov.ua/osnovne-pro-yevi-yefvv-2026/'],
        ['Банк тренувальних завдань TZNK', 'https://zno.osvita.ua/master/tznpk/list.html']
      ]
    },
    'english-foundations': {
      overview: 'База для English: reading, grammar in context, vocabulary, use of English. Працює не одна граматика, а зміст + контекст.',
      sections: [
        { title: 'Що вчити зараз', bullets: [
          'reading: main idea, detail, reference words',
          'conditionals, modals, passive, tense logic',
          'word formation та collocations',
          'vocabulary in context'
        ]},
        { title: 'Як працювати', bullets: [
          'спочатку рішати за змістом, а потім за граматикою',
          'у gap-fill спершу визначати частину мови',
          'перевіряти все речення, а не одну позицію',
          'вести окремий список типових помилок'
        ]}
      ],
      links: [
        ['Характеристика блоку іноземної мови', 'https://testportal.gov.ua/harakterystyka-bloku-mkt-z-inozemnoyi-movy/'],
        ['Банк тренувальних завдань English', 'https://zno.osvita.ua/master/english/list.html'],
        ['British Council LearnEnglish', 'https://learnenglish.britishcouncil.org/skills/reading']
      ]
    },
    'it-foundations': {
      overview: 'Базовий ІТ-конспект для ЄФВВ: тут важливі точні визначення, а не загальне відчуття.',
      sections: [
        { title: 'Що вчити зараз', bullets: [
          'алгоритми та складність',
          'stack, queue, tree, hash table',
          'SQL: WHERE, GROUP BY, HAVING, JOIN',
          'DNS, HTTPS, auth, HTTP methods'
        ]},
        { title: 'Як працювати', bullets: [
          'вести окремий лист точних визначень',
          'збирати пари, які легко плутаються',
          'перед відповіддю називати тему питання',
          'щодня повторювати канонічні факти'
        ]}
      ],
      links: [
        ['Програма предметного тесту з ІТ', 'https://mon.gov.ua/npa/pro-zatverdzhennya-programi-predmetnogo-testu-z-informacijnih-tehnologij-yedinogo-fahovogo-vstupnogo-viprobuvannya'],
        ['Банк тренувальних завдань IT', 'https://zno.osvita.ua/master/it/list.html'],
        ['SQLBolt', 'https://sqlbolt.com/'],
        ['MDN: HTTP overview', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview']
      ]
    }
  };

  function isUk() {
    return typeof uiLang === 'function' ? uiLang() !== 'en' : true;
  }

  function metric(title, value, note) {
    return `<article class="metric-card"><div class="small-label">${title}</div><strong>${value}</strong><p>${note}</p></article>`;
  }

  function applyMaterialsOverrides() {
    if (!window.renderMaterials || !window.renderOverview || !window.renderFocusQueue || !window.localizedMaterial) return;
    if (!el?.overviewCards || !el?.materialsGrid || !el?.focusQueue) return;

    window.__MP_MATERIALS = MATERIALS;

    renderOverview = function() {
      if (!isUk()) return;
      const attempts = state.attempts || [];
      const correct = attempts.filter((item) => item.isCorrect).length;
      const totalStudySeconds = getTotalStudySeconds();
      const totalFailures = attempts.filter((item) => !item.isCorrect).length;
      const totalMaterialsSeconds = (state.studySessions || []).reduce((sum, item) => sum + Number(item.durationSec || 0), 0);
      el.overviewCards.innerHTML = [
        metric('Відповідей', attempts.length, `${percent(correct, attempts.length)}%`),
        metric('Помилок', totalFailures, attempts.length ? 'Спершу пройди слабкі місця через repeat-incorrect' : 'Поки без даних'),
        metric('Усього часу', formatDuration(totalStudySeconds), `матеріали ${formatDuration(totalMaterialsSeconds)}`),
        metric('Активних предметів', new Set(attempts.map((item) => item.subject)).size || 0, 'Усе зберігається в браузері')
      ].join('');
    };

    renderMaterials = function() {
      const subject = state.settings.subject;
      const materials = appData.materials.filter((item) => item.subject === subject);
      el.materialsGrid.innerHTML = materials.map((item) => {
        const material = localizedMaterial(item);
        const detail = MATERIALS[item.id];
        const sections = detail ? detail.sections.map((section) => `<div class="material-subsection"><h4>${escapeHtml(section.title)}</h4><ul>${section.bullets.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul></div>`).join('') : '';
        const links = detail ? detail.links.map(([label, url]) => `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`).join('') : '';
        return `<article class="material-card"><div class="small-label">${subjectLabel(item.subject)}</div><h3>${escapeHtml(material.title)}</h3><p>${material.summary.map(escapeHtml).join(' ')}</p><ul>${material.checklist.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>${detail ? `<details class="material-details" open><summary>${escapeHtml('Що саме вчити')}</summary><div class="material-detail-body"><p class="material-overview"><strong>${escapeHtml('Коротко')}:</strong> ${escapeHtml(detail.overview)}</p>${sections}<div class="material-links"><h4>${escapeHtml('Джерела для роботи')}</h4><ul>${links}</ul></div></div></details>` : ''}<div class="material-actions"><button type="button" class="ghost" data-material-quick="15" data-material-id="${item.id}">+15 хв</button><button type="button" class="ghost" data-material-quick="25" data-material-id="${item.id}">+25 хв</button><button type="button" class="ghost" data-material-quick="45" data-material-id="${item.id}">+45 хв</button><label class="material-minutes-wrap"><span>Хвилини</span><input type="number" min="5" step="5" value="${item.estimated_minutes || 20}" id="duration-${item.id}"></label><button type="button" data-material-id="${item.id}">${escapeHtml(ui('logMaterialStudy'))}</button></div></article>`;
      }).join('') || `<p class="empty-state">${escapeHtml(ui('noMaterials'))}</p>`;

      el.materialsGrid.querySelectorAll('button[data-material-id]').forEach((button) => {
        button.addEventListener('click', () => {
          const material = materials.find((item) => item.id === button.dataset.materialId);
          const localized = localizedMaterial(material);
          const input = document.getElementById(`duration-${material.id}`);
          logStudySession({
            subject: material.subject,
            activityType: 'material',
            durationMin: Number(input.value || material.estimated_minutes || 20),
            resourceId: material.resource_id,
            title: localized.title,
            block: 'foundations'
          });
        });
      });

      el.materialsGrid.querySelectorAll('button[data-material-quick]').forEach((button) => {
        button.addEventListener('click', () => {
          const material = materials.find((item) => item.id === button.dataset.materialId);
          const localized = localizedMaterial(material);
          logStudySession({
            subject: material.subject,
            activityType: 'material',
            durationMin: Number(button.dataset.materialQuick || 15),
            resourceId: material.resource_id,
            title: localized.title,
            block: 'foundations'
          });
        });
      });
    };

    renderFocusQueue = function() {
      const focus = SUBJECT_ORDER.map((subject) => {
        const wrong = getAttempts(subject).filter((item) => !item.isCorrect);
        if (!wrong.length) return null;
        const blockCount = countBy(wrong, (item) => item.block || ui('generalTag'));
        const top = [...blockCount.entries()].sort((a, b) => b[1] - a[1])[0];
        return {
          title: `${subjectLabel(subject)}: слабке місце — ${top[0]}`,
          note: `${top[1]} зафіксованих помилок у цьому блоці. Спершу повтори матеріал, потім пройди repeat-incorrect.`,
          points: wrong.slice(-3).reverse().map((item) => `${item.questionId}: ${item.topic || item.block || ui('topicTag')}`)
        };
      }).filter(Boolean);

      if (!focus.length) {
        el.focusQueue.innerHTML = `<p class="empty-state">Поки що немає виразного патерну помилок. Почни з матеріалу, а потім дай кілька відповідей.</p>`;
        return;
      }

      el.focusQueue.innerHTML = focus.map((item) => `<article class="focus-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.note)}</p><ul>${item.points.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}</ul></article>`).join('');
    };
  }

  function apply() {
    if (!isUk()) return;
    if (!el?.overviewCards || !el?.materialsGrid || !el?.focusQueue) return;
    applyMaterialsOverrides();
    if (typeof renderOverview === 'function') renderOverview();
    if (typeof renderMaterials === 'function') renderMaterials();
    if (typeof renderFocusQueue === 'function') renderFocusQueue();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(apply, 0), { once: true });
  } else {
    window.setTimeout(apply, 0);
  }
  document.addEventListener('master-prep:render', () => window.setTimeout(apply, 0));
})();
