const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v17_full_plus_deep_teaching.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v18_tznk_clear_combinatorics.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v18_tznk_clear_combinatorics.pdf");

const appendix = `
  <section class="section page-break">
    <div class="module">
      <div class="kicker">Блок 10C / дуже повільно і без плутанини</div>
      <h2>🧠 Комбінаторика: як не плутати додавання, множення, ролі й команди</h2>
      <div class="goal"><b>Ціль:</b> навчитися не вгадувати формулу, а бачити сценарій. На тесті спершу читаємо умову як маленьку історію: кого вже взяли, кого треба добрати, чи є ролі, чи є заборонені пари.</div>

      <div class="callout science">
        <b>🔬 Науково, але людською мовою:</b><br>
        Комбінаторика рахує кількість різних результатів. Два результати різні лише тоді, коли для умови тесту вони справді відрізняються. Якщо Петро-Іван і Іван-Петро виконують одну й ту саму роль “два члени команди”, це один результат. Якщо Петро — голова, а Іван — заступник, то обмін ролями дає інший результат.
      </div>

      <h3>🧭 Перше дерево рішень</h3>
      <div class="examples">
        <div class="example-card">
          <h4>1. АБО → додавання</h4>
          <p>Обираємо один шлях із кількох альтернатив. Результат не складається з двох частин.</p>
          <pre><code>3 перші страви або 6 других
беремо одну страву
3 + 6 = 9</code></pre>
        </div>
        <div class="example-card">
          <h4>2. І → множення</h4>
          <p>Один результат складається з кількох частин. Кожен варіант першої частини поєднується з кожним варіантом другої.</p>
          <pre><code>5 сиропів і 4 присипки
кава = сироп + присипка
5 * 4 = 20</code></pre>
        </div>
        <div class="example-card">
          <h4>3. Є ролі → не ділимо</h4>
          <p>Голова і заступник — це різні бейджі. Якщо люди помінялися бейджами, результат змінився.</p>
          <pre><code>8 людей
голова: 8 варіантів
заступник: 7 варіантів
8 * 7 = 56</code></pre>
        </div>
        <div class="example-card">
          <h4>4. Просто група → ділимо</h4>
          <p>Якщо всі рівноправні, порядок усередині групи не створює новий результат.</p>
          <pre><code>2 гравці з 10 на перевірку
10 * 9 = 90 рахує А-Б і Б-А
90 / 2 = 45</code></pre>
        </div>
      </div>

      <h3>🧩 Капітан: два різні типи задач</h3>
      <div class="examples">
        <div class="example-card">
          <h4>Капітан уже відомий і має входити</h4>
          <p>Капітана не обираємо. Він уже сидить у команді. Треба лише добрати решту.</p>
          <pre><code>Команда з 3 із 7.
Капітан уже входить.

1 місце зайняте капітаном.
Залишилось 2 місця.
Кандидатів без капітана: 6.

C(6,2) = 6 * 5 / 2 = 15</code></pre>
        </div>
        <div class="example-card">
          <h4>Капітана треба призначити</h4>
          <p>Тут “капітан” — роль, яку ще треба видати комусь. Роль важлива, тому порядок/призначення важливе.</p>
          <pre><code>Із 7 людей обрати:
капітан, спікер, секретар.

капітан: 7
спікер: 6
секретар: 5

7 * 6 * 5 = 210</code></pre>
        </div>
      </div>

      <div class="callout trap">
        <b>⚠️ Пастка зі словом “капітан”:</b>
        <ul>
          <li><b>“Капітан клубу має входити”</b><span> — капітан уже є конкретною людиною. Його не обираємо, просто фіксуємо всередині.</span><em>Команда з 3 із 7 → добрати 2 із 6.</em></li>
          <li><b>“Обрати капітана команди”</b><span> — капітан ще не визначений. Це роль, отже вибір ролі рахується множенням.</span><em>Капітан і заступник із 8 → 8*7.</em></li>
        </ul>
      </div>

      <h3>🚫 Двоє не можуть бути разом</h3>
      <div class="examples">
        <div class="example-card">
          <h4>Швидкий спосіб: усі мінус погані</h4>
          <p>Коли заборонено “разом”, часто найпростіше порахувати всі команди й відняти ті, де заборона порушена.</p>
          <pre><code>Команда з 3 із 7.
А і Б не можуть бути разом.

Усі команди:
C(7,3) = 35

Погані команди:
А і Б уже всередині,
треба добрати 1 із решти 5:
C(5,1) = 5

Добрі:
35 - 5 = 30</code></pre>
        </div>
        <div class="example-card">
          <h4>Повільний спосіб: розбити на випадки</h4>
          <p>Цей спосіб довший, але добре навчає логіки.</p>
          <pre><code>Випадок 1: немає ні А, ні Б
C(5,3) = 10

Випадок 2: є А, немає Б
C(5,2) = 10

Випадок 3: є Б, немає А
C(5,2) = 10

Разом:
10 + 10 + 10 = 30</code></pre>
        </div>
      </div>

      <h3>🎯 Рівно один vs хоча б один</h3>
      <div class="examples">
        <div class="example-card">
          <h4>Рівно один із двох</h4>
          <p>Входить А або Б, але не обидва. Спершу обираємо, хто саме з двох, потім добираємо решту.</p>
          <pre><code>Команда з 3 із 7.
Рівно один із А/Б.

хто з двох: 2 способи
добрати ще 2 із решти 5:
C(5,2)=10

2 * 10 = 20</code></pre>
        </div>
        <div class="example-card">
          <h4>Хоча б один із двох</h4>
          <p>Може входити один, а можуть входити обидва. Найлегше: усі мінус жодного.</p>
          <pre><code>Усі команди:
C(7,3)=35

Погані: немає ні А, ні Б.
Тоді обираємо 3 із решти 5:
C(5,3)=10

35 - 10 = 25</code></pre>
        </div>
      </div>

      <div class="callout life">
        <b>🏠 Аналогія, яку варто тримати:</b><br>
        Команда без ролей — це “люди в одній кімнаті”: неважливо, хто зайшов першим. Ролі — це “бейджі на грудях”: якщо бейджі поміняли, результат інший. Заборонена пара — це “ці двоє не сидять за одним столом”: або рахуємо всі столи й викидаємо погані, або чесно розписуємо випадки.
      </div>

      <div class="callout trap">
        <b>🧪 Міні-дрил перед тестом:</b>
        <ul>
          <li><b>Якщо бачиш “або”</b><span> — перевір, чи це альтернативи. Якщо так, додаємо.</span><em>суп або салат → 3+6</em></li>
          <li><b>Якщо бачиш “і”</b><span> — перевір, чи один результат складається з кількох частин. Якщо так, множимо.</span><em>сироп і присипка → 5*4</em></li>
          <li><b>Якщо бачиш посади</b><span> — ролі різні, не ділимо.</span><em>голова+заступник → 8*7</em></li>
          <li><b>Якщо бачиш команду/комісію/пару</b><span> — ролей нема, ділимо на перестановки всередині групи.</span><em>3 з 7 → 7*6*5/(3*2*1)</em></li>
          <li><b>Якщо є “не разом”</b><span> — часто найшвидше: усі мінус погані.</span><em>C(7,3)-5</em></li>
        </ul>
      </div>
    </div>
  </section>
`;

let html = fs.readFileSync(inHtml, "utf8");
html = html.replace(/v17/g, "v18");
html = html.replace(
  /Master Prep Exam Teaching Guide v17/g,
  "Master Prep Exam Teaching Guide v18"
);
html = html.replace(
  /Master Prep Exam Guide v17/g,
  "Master Prep Exam Guide v18"
);

const marker = '<section class="section page-break">\n    <div class="module">\n      <div class="kicker">Блок 11</div>';
const idx = html.indexOf(marker);
if (idx < 0) throw new Error("Could not find Block 11 marker");
html = html.slice(0, idx) + appendix + "\n  " + html.slice(idx);

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
    `file:///${outHtml.replace(/\\\\/g, "/")}`,
  ]);
  console.log(outPdf);
} else {
  console.log(outHtml);
  console.warn("Chrome/Edge not found; PDF was not generated.");
}
