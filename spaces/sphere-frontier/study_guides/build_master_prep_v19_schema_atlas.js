const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v18_tznk_clear_combinatorics.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v19_schema_atlas.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v19_schema_atlas.pdf");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function schema(title, diagram, scientific, example, trap, drill) {
  return `
    <div class="schema-card">
      <h3>${title}</h3>
      <pre class="schema-box"><code>${esc(diagram)}</code></pre>
      <div class="schema-note"><b>🔬 Науково:</b> ${scientific}</div>
      <div class="schema-note life"><b>🏠 Приклад:</b> ${example}</div>
      <div class="schema-note trap"><b>⚠️ Пастка:</b> ${trap}</div>
      ${drill ? `<div class="schema-note drill"><b>🧪 Міні-дріл:</b> ${drill}</div>` : ""}
    </div>`;
}

function compact(title, diagram, example) {
  return `
    <div class="schema-mini">
      <h4>${title}</h4>
      <pre class="schema-box small"><code>${esc(diagram)}</code></pre>
      <p>${example}</p>
    </div>`;
}

const css = `
    .schema-atlas{background:#fbfdfa;border:1px solid #dce8e1;border-radius:24px;padding:24px;margin:18px 0}
    .schema-atlas h2{margin-top:0}
    .schema-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    .schema-card,.schema-mini{background:#fff;border:1px solid #d9e5df;border-radius:18px;padding:16px;break-inside:avoid}
    .schema-card h3,.schema-mini h4{margin:0 0 10px;color:#193443}
    .schema-box{background:#10202b;color:#edf8f3;border-radius:14px;padding:14px;overflow:hidden;font-family:"Consolas","Courier New",monospace;font-size:12.5px;line-height:1.45;white-space:pre-wrap}
    .schema-box.small{font-size:11.5px}
    .schema-note{border-left:4px solid #7db4a4;background:#f4faf7;border-radius:12px;padding:10px 12px;margin-top:10px;line-height:1.45}
    .schema-note.life{border-left-color:#d5a23a;background:#fff9eb}
    .schema-note.trap{border-left-color:#d04d4d;background:#fff0f0}
    .schema-note.drill{border-left-color:#4d86d0;background:#eef6ff}
    .schema-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:14px 0}
    .schema-map div{border:1px solid #d9e5df;border-radius:14px;padding:10px;background:#fff;min-height:70px}
    .schema-map b{display:block;color:#193443;margin-bottom:4px}
    .schema-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
    @media print{.schema-card,.schema-mini{page-break-inside:avoid}.schema-atlas{page-break-inside:auto}.schema-grid,.schema-columns{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

const atlas = `
  <section class="section page-break">
    <div class="module schema-atlas">
      <div class="kicker">Версія v19 / схемний атлас</div>
      <h2>🗺️ Як читати цей посібник: схема → приклад → пастка</h2>
      <p>Ця версія перебудована під візуальне запам'ятовування. Спочатку дивимося на карту, потім читаємо коротке пояснення, далі одразу перевіряємо себе на типовій пастці з тесту.</p>
      <div class="schema-map">
        <div><b>🔢 IT-база</b>біти, байти, signed/unsigned, код, ООП, алгоритми, БД, мережі, безпека, ML</div>
        <div><b>🧠 ТЗНК</b>логіка, комбінаторика, відсотки, таблиці, графіки, висновки з умов</div>
        <div><b>🇬🇧 English</b>reading evidence, grammar traps, conditionals, tenses, collocations, linkers</div>
      </div>
      <div class="callout science"><b>🔬 Принцип:</b> тест рідко питає “дай визначення”. Частіше він перевіряє, чи видно різницю між сусідніми поняттями: class/object, compiler/linker, GRANT/SELECT, switch/router, combination/arrangement, must/might.</div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module schema-atlas">
      <div class="kicker">Схеми IT / основа</div>
      <h2>💻 IT: карти понять, які найчастіше плутають</h2>
      <div class="schema-grid">
        ${schema(
          "🔢 Дані: bit, byte, binary, signed/unsigned",
          `[ ДАНІ В КОМП'ЮТЕРІ ]\n  |\n  |-- bit  -> 0 або 1\n  |-- byte -> 8 bit\n  |\n  |-- binary number -> запис числа у системі 0/1\n  |     приклад: 10110₂ = 16 + 4 + 2 = 22₁₀\n  |\n  |-- unsigned byte -> 0..255\n  |-- signed byte   -> -128..127`,
          "n бітів дають 2^n різних комбінацій. Якщо число беззнакове, усі комбінації йдуть на невід'ємні значення. Якщо зі знаком, частина діапазону відведена під від'ємні.",
          "8 бітів: 2^8 = 256. Unsigned: 00000000=0, 11111111=255. Signed: 01111111=127, 10000000=-128, 11111111=-1.",
          "101₂ не читаємо як “сто один”. Нижній індекс показує систему числення. 1 byte = 8 bits, а не 10.",
          "Переведи 33₁₀: 32 входить, лишається 1, отже 100001₂."
        )}
        ${schema(
          "🧾 Програма: compiler, interpreter, linker",
          `[ КОД ]\n  |\n  |-- compiler    -> перекладає програму в машинний/об'єктний код\n  |-- interpreter -> виконує поступово, без окремого exe\n  |-- linker      -> збирає об'єктні модулі в один виконуваний файл\n  |-- lexer       -> ріже текст на токени`,
          "Компіляція, інтерпретація, компонування і лексичний аналіз - це різні етапи обробки програми.",
          "C/C++: .c -> compiler -> .o -> linker -> exe. Python: інтерпретатор читає й виконує інструкції.",
          "Якщо в умові “приймає об'єктні модулі і збирає виконуваний модуль” - це linker/компонувальник, не компілятор.",
          "Маркер для linker: багато object modules -> один executable."
        )}
        ${schema(
          "🧱 ООП: class, object, encapsulation, inheritance, polymorphism",
          `[ OOP ]\n  |\n  |-- class          -> креслення / тип\n  |-- object         -> конкретний екземпляр\n  |-- encapsulation  -> дані + методи сховані за інтерфейсом\n  |-- inheritance    -> клас-нащадок отримує властивості базового\n  |-- polymorphism   -> один інтерфейс, різна поведінка`,
          "ООП моделює систему як набір об'єктів зі станом і поведінкою. Наслідування повторно використовує спільне, поліморфізм дозволяє підміняти реалізації.",
          "Кнопка гучності: інтерфейс один - натиснути volume up. Телефон, ноутбук і плеєр реагують по-своєму. Це поліморфізм.",
          "Class не є object. Наслідування не те саме, що композиція: “is-a” проти “has-a”.",
          "Dog is Animal -> inheritance. Car has Engine -> composition."
        )}
        ${schema(
          "📈 Алгоритми: масив, стек, черга, дерево, складність",
          `[ DATA STRUCTURES ]\n  |\n  |-- array -> індексований доступ\n  |-- stack -> LIFO: останній зайшов, перший вийшов\n  |-- queue -> FIFO: перший зайшов, перший вийшов\n  |-- tree  -> ієрархія\n  |-- hash  -> швидкий пошук за ключем\n\n[ COMPLEXITY ]\n  O(1) < O(log n) < O(n) < O(n log n) < O(n^2)`,
          "Структура даних визначає, які операції дешеві або дорогі. Складність описує, як росте час/пам'ять при збільшенні n.",
          "Черга в банку - FIFO. Стос тарілок - LIFO. Телефонна книга навпіл - binary search O(log n).",
          "Binary search працює тільки на відсортованих даних. Binary system і binary search - різні поняття.",
          "Якщо масив не sorted, binary search не гарантує правильний результат."
        )}
        ${schema(
          "🗄️ SQL і моделі даних",
          `[ DATA MODEL ]\n  conceptual -> сутності бізнесу\n  logical    -> таблиці, ключі, зв'язки\n  physical   -> як зберігається в СУБД\n\n[ SQL ]\n  SELECT -> читати\n  WHERE  -> фільтр рядків\n  GROUP BY -> групування\n  HAVING -> фільтр груп\n  JOIN -> об'єднання таблиць\n  GRANT -> права доступу`,
          "Модель даних проходить шлях від сенсу предметної області до фізичного зберігання. SQL розділяє читання, зміну даних і керування доступом.",
          "Студент-Курс-Оплата: conceptual. Таблиці students/courses/payments з PK/FK: logical. Індекси, типи, сторінки: physical.",
          "Нормалізація стосується логічної моделі таблиць, не ER-діаграми як картинки. GRANT - права, не вибірка.",
          "WHERE до GROUP BY; HAVING після GROUP BY."
        )}
        ${schema(
          "🌐 Мережі: packet, switch, router, DNS, DHCP, TCP/UDP",
          `[ NETWORK ]\n  user -> browser -> DNS -> IP\n       -> TCP/UDP -> packets -> router -> server\n\n[ DEVICES ]\n  switch -> всередині локальної мережі, MAC\n  router -> між мережами, IP\n\n[ PROTOCOLS ]\n  DNS  -> name to IP\n  DHCP -> видає IP-налаштування\n  TCP  -> порядок і доставка\n  UDP  -> швидко, без гарантій`,
          "Мережа ділить дані на пакети, доставляє їх через пристрої і протоколи. Рівні моделі розділяють відповідальність.",
          "DNS - телефонна книга. DHCP - адміністратор офісу, що видає адресу. TCP - доставка з підписом. UDP - швидке повідомлення без гарантії.",
          "Switch не замінює router. TCP не “швидший UDP”; TCP надійніший, але має накладні витрати.",
          "HTTP працює поверх TCP; IP відповідає за адресацію між мережами."
        )}
        ${schema(
          "🔐 Безпека: hash, encryption, signature, symmetric/asymmetric",
          `[ CRYPTO ]\n  hash       -> відбиток, не розшифровується\n  encryption -> можна розшифрувати ключем\n  signature  -> підтверджує автора і цілісність\n\n[ KEYS ]\n  symmetric  -> один спільний ключ\n  asymmetric -> public/private key pair`,
          "Геш-функція стискає повідомлення в фіксований відбиток. Шифрування приховує зміст. Підпис доводить, що дані не змінені й походять від власника ключа.",
          "Пароль не зберігають відкритим: зберігають hash. AES/Rijndael шифрує. Купина - українська геш-функція.",
          "Hash не можна “розшифрувати”. AES/Rijndael - шифр, не геш-функція.",
          "Якщо питають криптографічну геш-функцію серед ДСТУ - шукай Купина."
        )}
        ${schema(
          "🤖 ML: supervised, unsupervised, classification, SVM",
          `[ MACHINE LEARNING ]\n  supervised   -> є правильні відповіді в train data\n  unsupervised -> шукаємо структуру без labels\n\n  classification -> клас\n  regression     -> число\n  clustering     -> групи\n\n  SVM -> шукає гіперплощину з найбільшим margin`,
          "Модель вчиться знаходити закономірність у даних. У класифікації відповідь - категорія, у регресії - числове значення.",
          "Email spam/not spam - classification. Ціна квартири - regression. Групи клієнтів без labels - clustering.",
          "SVM не зменшує розмірність; він розділяє класи гіперплощиною, максимізуючи margin.",
          "PCA зменшує розмірність; SVM класифікує."
        )}
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module schema-atlas">
      <div class="kicker">Схеми ТЗНК / комбінаторика й логіка</div>
      <h2>🧠 ТЗНК: дерево рішень без паніки</h2>
      <div class="schema-columns">
        ${schema(
          "🧩 Комбінаторика: яку дію обрати",
          `ПИТАННЯ 1: це один вибір чи кілька кроків?\n  |\n  |-- АБО / один із / будь-який з цих -> ДОДАЄМО\n  |     6 способів для a або 4 для b -> 6 + 4\n  |\n  |-- І / пара / послідовність -> МНОЖИМО\n        5 варіантів першої дії і 4 другої -> 5 * 4\n\nПИТАННЯ 2: якщо обираємо з однієї групи, чи є ролі?\n  |\n  |-- є ролі/місця -> порядок важливий -> НЕ ділимо\n  |-- нема ролей   -> порядок неважливий -> ділимо на перестановки`,
          "Комбінаторика рахує простір можливих результатів. Головне - зрозуміти, що вважається одним і тим самим результатом.",
          "Голова+заступник: Петро/Іван і Іван/Петро - різні. Команда з двох: Петро/Іван і Іван/Петро - однакова.",
          "Не ділимо там, де є посади. Ділимо там, де це просто група.",
          "8 людей, голова і заступник: 8*7=56. 2 людини в комісію з 8: 8*7/2=28."
        )}
        ${schema(
          "🚧 Обмеження: fixed, forbidden, exactly one, at least one",
          `[ ОБМЕЖЕННЯ ]\n  |\n  |-- fixed / вже входить\n  |     команда 3 з 7, капітан уже є -> C(6,2)\n  |\n  |-- forbidden / не входить\n  |     команда 3 з 7, капітан не може -> C(6,3)\n  |\n  |-- incompatible pair / не разом\n  |     усі варіанти - погані разом\n  |\n  |-- exactly one of A,B\n  |     A без B + B без A\n  |\n  |-- at least one of A,B\n        усі - без A і без B`,
          "Обмеження змінює множину допустимих результатів. Найчастіше швидше рахувати всі варіанти і віднімати заборонені.",
          "3 з 7, А і Б не можуть разом: усі C(7,3)=35. Погані: А+Б уже взяли, третій з 5 -> 5. Відповідь 30.",
          "Слово “капітан” не завжди означає роль для призначення. Якщо капітан уже відомий і має входити - його не обираємо.",
          "Капітан уже входить у команду 3 з 7: лишається 2 місця серед 6 -> C(6,2)=15."
        )}
      </div>
      <div class="schema-grid">
        ${compact(
          "🧠 Логіка: implication якщо P, то Q",
          `[ P -> Q ] хибне тільки тоді:\n  P = true, Q = false\n\nОбіцянка: якщо прибереш, отримаєш цукерку\n  прибрав + не дали -> брехня\n  не прибрав + дали -> не брехня`,
          "Не роби висновок “якщо Q, то P”. Умова гарантує наслідок лише в один бік."
        )}
        ${compact(
          "📊 Відсотки",
          `x% від A = A * x / 100\nзростання на x%: A * (1 + x/100)\nпадіння на x%: A * (1 - x/100)\n\n+20%, потім -20%:\n100 -> 120 -> 96, не 100`,
          "Пастка: відсоток завжди від поточної бази, а не від початкової, якщо умова говорить про послідовні зміни."
        )}
        ${compact(
          "📈 Графіки",
          `y = kx + b       -> пряма\n y = x^2          -> парабола\n y = 1/x          -> гіпербола\n y = 2^x          -> експонента\n y = log₂x        -> логарифм`,
          "Експонента швидко росте, логарифм росте повільно. Гіпербола має асимптоти і не проходить через 0."
        )}
        ${compact(
          "📚 Тексти і висновки",
          `Можна стверджувати тільки те, що випливає з умови.\n\n'усі A є B' не означає 'усі B є A'\n'деякі' не означає 'усі'\n'може' не означає 'точно'`,
          "У тестах часто ловлять на категоричності: “жоден”, “усі”, “обов'язково”, якщо в умові цього немає."
        )}
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module schema-atlas">
      <div class="kicker">Схеми English / reading + grammar</div>
      <h2>🇬🇧 English: як бачити пастки в тексті й граматиці</h2>
      <div class="schema-grid">
        ${schema(
          "📖 Reading evidence",
          `[ QUESTION ]\n  |\n  |-- main idea -> шукай загальний сенс, не деталь\n  |-- detail    -> шукай конкретний рядок\n  |-- inference -> висновок з тексту, але без фантазії\n  |-- attitude  -> тон автора: critical/supportive/neutral\n\n[ ANSWER ]\n  must be supported by text`,
          "Reading перевіряє не переклад кожного слова, а доказовість відповіді. Правильний варіант має опору в тексті.",
          "Якщо текст каже 'may help', відповідь 'will definitely solve' занадто сильна.",
          "Найчастіша пастка - знайоме слово в неправильному контексті або відповідь, яка звучить логічно, але не написана в тексті.",
          "Підкреслюй у тексті 3-5 слів, які доводять відповідь."
        )}
        ${schema(
          "⏱️ Tenses: швидка карта",
          `[ TIME + ASPECT ]\n  Present Simple      -> факт/звичка\n  Present Continuous  -> зараз/тимчасово\n  Present Perfect     -> досвід або результат до now\n  Past Simple         -> завершена минула дія\n  Past Perfect        -> раніше за іншу минулу дію\n  Future / be going to -> майбутнє / план`,
          "Час в англійській показує не лише коли, а й як дія пов'язана з моментом мовлення або іншою дією.",
          "I have lost my keys = ключі загублені і зараз це має наслідок. I lost my keys yesterday = факт учора.",
          "Since/for часто ведуть до Present Perfect. Yesterday/last year - Past Simple.",
          "Before he arrived, she had left: she left раніше."
        )}
        ${schema(
          "🔀 Conditionals",
          `[ IF ]\n  Zero: if + Present, Present -> закон/факт\n  First: if + Present, will -> реальна можливість\n  Second: if + Past, would -> уявна ситуація зараз\n  Third: if + Past Perfect, would have V3 -> жаль про минуле`,
          "Conditionals кодують ступінь реальності ситуації: факт, реальний майбутній шанс, уявність, або минуле, яке вже не змінити.",
          "If I study, I will pass. If I studied more, I would pass. If I had studied, I would have passed.",
          "Після if у First Conditional не ставимо will: If I will study - типова помилка.",
          "Маркер regret / past: would have + V3."
        )}
        ${schema(
          "🧩 Use of English: collocations, phrasals, linkers",
          `[ WORD CHOICE ]\n  make a decision\n  do homework\n  take responsibility\n  pay attention\n\n[ LINKERS ]\n  although -> контраст\n  because -> причина\n  therefore -> наслідок\n  unless -> if not`,
          "Use of English перевіряє сталі поєднання, керування дієслів, прийменники і логічні зв'язки між частинами речення.",
          "Although it was raining, we went out. Тут although створює контраст, не причину.",
          "Не перекладай дослівно з української. 'make homework' звучить логічно, але правильно 'do homework'.",
          "Після unless не додавай додаткове not: unless you don't - часто подвійне заперечення."
        )}
      </div>
    </div>
  </section>
`;

let html = fs.readFileSync(inHtml, "utf8");
html = html.replace(/v18/g, "v19");
html = html.replace(/Master Prep Exam Teaching Guide v18/g, "Master Prep Exam Teaching Guide v19");
html = html.replace(/Master Prep Exam Guide v18/g, "Master Prep Exam Guide v19");
html = html.replace("</style>", `${css}\n  </style>`);

const marker = '<section class="section page-break">\n    <div class="module">\n      <div class="kicker">Блок 01</div>';
const idx = html.indexOf(marker);
if (idx < 0) throw new Error("Could not find Block 01 marker");
html = html.slice(0, idx) + atlas + "\n  " + html.slice(idx);

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
