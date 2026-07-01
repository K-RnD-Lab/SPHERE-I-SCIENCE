const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v20_schema_code_atlas.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v21_toc_schema_code.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v21_toc_schema_code.pdf");

const css = `
    .toc{background:#fffdf7;border:1px solid #ded8c9;border-radius:24px;padding:26px;margin:18px 0}
    .toc h2{margin:0 0 8px;color:#183342}
    .toc .toc-lede{font-size:14px;line-height:1.55;color:#4d5c63;margin:0 0 16px}
    .toc-table{width:100%;border-collapse:collapse;font-size:12.5px;line-height:1.35}
    .toc-table th{background:#f1efe6;color:#183342;text-align:left;padding:8px;border-bottom:1px solid #d7d1c2}
    .toc-table td{padding:8px;border-bottom:1px solid #ebe6d9;vertical-align:top}
    .toc-table .page{width:68px;text-align:right;font-weight:700;color:#12384a;white-space:nowrap}
    .toc-table .part{width:26%;font-weight:700;color:#183342}
    .toc-chip{display:inline-block;background:#eaf6f1;border:1px solid #cfe5dc;border-radius:999px;padding:2px 8px;margin:1px 3px 1px 0;font-size:11.5px}
    .toc-route{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0}
    .toc-route div{border:1px solid #ded8c9;border-radius:16px;background:#fff;padding:12px}
    .toc-route b{display:block;color:#183342;margin-bottom:4px}
    .toc-note{background:#eef6ff;border-left:4px solid #4d86d0;border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13px;line-height:1.45}
    @media print{
      .toc{page-break-inside:auto}
      .toc-route{display:block}
      .toc-route div{margin-bottom:8px}
      .toc-table{font-size:11.5px}
      .toc-table td,.toc-table th{padding:6px}
    }
`;

const toc = `
  <section class="section page-break">
    <div class="module toc">
      <div class="kicker">Зміст / як читати посібник</div>
      <h2>📑 План підготовки і навігація по блоках</h2>
      <p class="toc-lede">Цей посібник краще читати не як книжку “від першої до останньої сторінки”, а як тренувальну карту: спочатку подивитися схеми, потім кодові приклади, далі перейти до повних блоків теорії і після цього відкривати тести.</p>

      <div class="toc-route">
        <div><b>1. Швидкий вхід</b>Схеми дають карту понять: що з чим не плутати і які слова-маркери ловити в тестах.</div>
        <div><b>2. Наглядність</b>Кодові вставки показують, як IT-поняття виглядають “руками”: class, object, inheritance, SQL, network request.</div>
        <div><b>3. Закріплення</b>Основні блоки нижче дають теорію, приклади, пастки й міні-дріли перед тренажером.</div>
      </div>

      <table class="toc-table">
        <thead>
          <tr><th>Стор.</th><th>Блок</th><th>Що всередині</th><th>Як читати</th></tr>
        </thead>
        <tbody>
          <tr><td class="page">1</td><td class="part">Обкладинка</td><td>Назва, призначення, фокус на ЄВІ/ЄФВВ: IT, ТЗНК, English.</td><td>Зрозуміти рамку: це не загальна IT-книга, а підготовка до тестового формату.</td></tr>
          <tr><td class="page">2-3</td><td class="part">📑 Зміст і маршрут</td><td>План читання, секції, сторінкові орієнтири.</td><td>Повертатися сюди, коли губиться “де я зараз і навіщо це читаю”.</td></tr>
          <tr><td class="page">4</td><td class="part">🗺️ Схемний атлас</td><td><span class="toc-chip">IT</span><span class="toc-chip">ТЗНК</span><span class="toc-chip">English</span> Загальна карта трьох дисциплін.</td><td>Спочатку проглянути очима всі блоки, не вчитуватися глибоко.</td></tr>
          <tr><td class="page">5-11</td><td class="part">💻 IT-схеми</td><td>Bit/byte, signed/unsigned, compiler/interpreter/linker, OOP, algorithms, SQL, networks, security, ML.</td><td>Читати як “що з чим плутають”. Кожну схему закривати прикладом і пасткою.</td></tr>
          <tr><td class="page">12-17</td><td class="part">🧪 Код як мікроскоп</td><td>Java OOP, composition, binary search, SQL, DNS/TCP/HTTPS.</td><td>Не зубрити синтаксис. Дивитися, де саме клас, об'єкт, метод, роль, запит, право доступу.</td></tr>
          <tr><td class="page">18-22</td><td class="part">🧠 ТЗНК-схеми</td><td>Комбінаторика: додавання/множення, ролі/без ролей, fixed/forbidden, exactly one, at least one; логіка, відсотки, графіки.</td><td>Кожну задачу починати з дерева: АБО чи І? ролі є? обмеження є?</td></tr>
          <tr><td class="page">23-26</td><td class="part">🇬🇧 English-схеми</td><td>Reading evidence, tenses, conditionals, collocations, linkers.</td><td>Не перекладати все підряд. Шукати доказ у тексті й граматичні маркери.</td></tr>
          <tr><td class="page">27-31</td><td class="part">🔢 Блок 01-02</td><td>Бінарний рахунок, представлення даних, процедурне програмування, виконання коду.</td><td>Після схем повернутися сюди для повнішого пояснення і дрілів.</td></tr>
          <tr><td class="page">32-38</td><td class="part">🧱 Блок 03-04B</td><td>ООП, наслідування, композиція, тестування, алгоритми, структури даних, CPU/RAM/cache/I/O.</td><td>Читати разом із Java-вставками вище.</td></tr>
          <tr><td class="page">39-45</td><td class="part">🗄️ Блок 05-06B</td><td>Бази даних, SQL, OLTP/OLAP/Data Warehouse, функції, графіки, логарифми, експонента.</td><td>Підкреслювати різниці: WHERE/HAVING, conceptual/logical/physical, OLTP/OLAP.</td></tr>
          <tr><td class="page">46-53</td><td class="part">🔐 Блок 07-09</td><td>Кібербезпека, криптографія, мережі, OSI/TCP-IP, sysadmin/devops база, Data Science/ML.</td><td>Особливо ловити терміни, які звучать схоже, але мають різні ролі.</td></tr>
          <tr><td class="page">54-63</td><td class="part">🧠 Блок 10-10C</td><td>ТЗНК: логіка, комбінаторика, перестановки, пропуски, обмеження, розбір “капітан”, “не разом”, “рівно один”.</td><td>Це читати повільно. Після кожного прикладу пробувати змінити умову і перерахувати.</td></tr>
          <tr><td class="page">64-71</td><td class="part">🇬🇧 Блок 11-11B</td><td>English grammar patterns, reading markers, усі базові часи, conditionals, типові пастки.</td><td>Після блоку одразу пройти English variant у тренажері.</td></tr>
          <tr><td class="page">72+</td><td class="part">🧩 Deep teaching appendix</td><td>Додаткові пояснення, професійні прив'язки, sysadmin/devops, English toolkit.</td><td>Використовувати як довідник, коли тест показав слабке місце.</td></tr>
        </tbody>
      </table>

      <div class="toc-note"><b>Примітка:</b> сторінки є навігаційними орієнтирами для PDF-версії. Якщо браузер або PDF-переглядач масштабує файл інакше, назви блоків залишаються головним способом швидко знайти потрібну частину.</div>
    </div>
  </section>
`;

let html = fs.readFileSync(inHtml, "utf8");
html = html.replace(/v20/g, "v21");
html = html.replace(/Master Prep Exam Teaching Guide v20/g, "Master Prep Exam Teaching Guide v21");
html = html.replace(/Master Prep Exam Guide v20/g, "Master Prep Exam Guide v21");
html = html.replace("</style>", `${css}\n  </style>`);

const marker = '<section class="section page-break">\n    <div class="module schema-atlas">\n      <div class="kicker">Версія v21 / схемний атлас</div>';
const idx = html.indexOf(marker);
if (idx < 0) throw new Error("Could not find schema atlas marker");
html = html.slice(0, idx) + toc + "\n  " + html.slice(idx);

fs.writeFileSync(outHtml, html, "utf8");

const chromeCandidates = [
  "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
  "C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
  "C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
];
const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
if (chrome) {
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outPdf}`,
    `file:///${outHtml.replace(/\\/g, "/")}`,
  ]);
  console.log(outPdf);
} else {
  console.log(outHtml);
  console.warn("Chrome/Edge not found; PDF was not generated.");
}
