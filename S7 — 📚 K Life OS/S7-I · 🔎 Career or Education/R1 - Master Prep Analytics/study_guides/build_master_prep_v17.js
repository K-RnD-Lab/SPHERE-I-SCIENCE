const fs = require("fs");
const path = require("path");

const dir = __dirname;
const basePath = path.join(dir, "master_prep_exam_guide_v14_full_exam_ready.html");
const outPath = path.join(dir, "master_prep_exam_guide_v17_full_plus_deep_teaching.html");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function code(s) {
  return `<pre><code>${esc(s)}</code></pre>`;
}

function card(title, body, sample = "") {
  return `<div class="card"><h4>${title}</h4><p>${body}</p>${sample ? code(sample) : ""}</div>`;
}

function trap(title, body, sample = "") {
  return `<li><b>${title}</b><span>${body}</span>${sample ? `<em>${esc(sample)}</em>` : ""}</li>`;
}

const deepAppendix = `
  <section class="section page-break">
    <div class="module">
      <div class="kicker">Оновлення v17</div>
      <h2>🧭 Карта підготовки: що саме треба вміти на тесті</h2>
      <div class="goal"><b>Мета:</b> не просто впізнавати правильну відповідь, а розуміти, за якою ознакою вона правильна. На реальному тесті часто перевіряють не термін, а межу між двома схожими термінами.</div>
      <div class="grid">
        ${card("🧠 ТЗНК", "Логіка висловлювань, комбінаторика, відсотки, таблиці, графіки, висновки з тексту. Головне питання: що саме дозволено умовою, а що ми додумали самі?")}
        ${card("🇬🇧 English", "Grammar in context, Use of English, reading for evidence, linkers, collocations. Головне питання: яка граматична роль слова в реченні і де доказ у тексті?")}
        ${card("💻 IT", "Програмування, ООП, алгоритми, архітектура, ОС, мережі, БД, безпека, ML/Data Science. Головне питання: яку роль виконує об'єкт, команда або технологія?")}
      </div>
      <div class="callout science"><b>Науково:</b> екзамен будується на класифікації. Якщо поняття мають схожі слова, тест перевіряє ознаку розрізнення: порядок важливий чи ні, дія одна чи послідовна, права доступу чи запит даних, switch чи router, inheritance чи composition.</div>
      <div class="callout life"><b>Приклад у житті:</b> якщо в меню написано "кава або чай", це правило суми. Якщо написано "напій і десерт", це правило добутку. Якщо "обери 3 людей у комісію", порядок не важливий. Якщо "президент, секретар, бухгалтер", порядок важливий, бо ролі різні.</div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module">
      <div class="kicker">Блок 10 / поглиблено</div>
      <h2>🧠 ТЗНК: комбінаторика без паніки</h2>
      <div class="goal"><b>Фокус:</b> навчитися бачити дію в умові: "або", "і", "порядок важливий", "порядок не важливий", "заборонено", "принаймні", "рівно".</div>
      <h3>Піддисципліни всередині блоку</h3>
      <div class="grid">
        ${card("🧩 Правило суми", "Використовуємо, коли треба обрати один варіант з кількох неперетинних груп: A або B. Варіанти не виконуються разом.", "a можна вибрати 6 способами, b - 4 способами.\nОбрати один: a або b.\nРазом: 6 + 4 = 10")}
        ${card("🧩 Правило добутку", "Використовуємо, коли вибір складається з кількох кроків: спочатку A, потім B. Кожен варіант A може поєднатися з кожним варіантом B.", "3 напої і 4 десерти.\nОбрати напій і десерт.\nРазом: 3 * 4 = 12")}
        ${card("🧮 Перестановки", "Порядок важливий, і використовуються всі об'єкти. Якщо 4 людини стають у чергу, А-Б-В-Г і Б-А-В-Г - різні варіанти.", "4 людини в чергу:\n4! = 4 * 3 * 2 * 1 = 24")}
        ${card("🧮 Розміщення", "Порядок важливий, але використовуються не всі об'єкти. Наприклад, з 8 людей треба обрати президента і секретаря.", "A(8,2) = 8 * 7 = 56\nбо перша роль має 8 варіантів,\nдруга - 7 після першого вибору")}
        ${card("🧮 Комбінації", "Порядок не важливий. Комісія {А, Б, В} - це та сама комісія, що {В, Б, А}. Тому ділимо на кількість перестановок усередині групи.", "C(8,3) = 8 * 7 * 6 / (3 * 2 * 1) = 56")}
        ${card("🚧 Заборонені варіанти", "Спочатку рахуємо всі варіанти, потім віднімаємо ті, які порушують умову. Це часто найпростіший шлях.", "Комісія з 3 людей із 8, А і Б не можуть бути разом.\nУсі: C(8,3)=56\nПогані: А і Б уже взяті, третій з решти 6\nПравильні: 56 - 6 = 50")}
      </div>
      <h3>Як розв'язувати задачу "a - 6 способів, b - 4 способи, обрати один"</h3>
      <div class="grid">
        ${card("Крок 1: знайти ключове слово", "Умова каже: обрати один: a або b. Слово 'або' означає, що ми не будуємо пару (a,b), а відкриваємо дві окремі доріжки.", "доріжка A: 6 варіантів\nдоріжка B: 4 варіанти")}
        ${card("Крок 2: перевірити, чи дії одночасні", "Якщо треба було б обрати a і b, тоді було б 6*4. Але тут треба обрати будь-який один об'єкт з двох типів.", "не пара: (a,b)\nа один вибір: або a, або b")}
        ${card("Крок 3: скласти доріжки", "Коли доріжки альтернативні, додаємо. Коли кроки послідовні, множимо.", "6 + 4 = 10")}
        ${card("Пастка", "Тест часто дає варіант 24, бо мозок бачить два числа і хоче множити. Але множення - тільки коли обидва вибори потрібні одночасно.", "обрати a або b -> +\nобрати a і b -> *")}
      </div>
      <div class="callout trap"><ul>
        ${trap("Слова 'будь-який з цих об'єктів' часто означають суму.", "Бо треба один об'єкт з об'єднання груп, а не набір з двох об'єктів.", "m способів для a, n способів для b -> m+n")}
        ${trap("Слова 'пара', 'послідовність', 'код', 'маршрут' часто означають добуток.", "Бо результат складається з кількох позицій, і кожна позиція має свої варіанти.", "2 літери і 3 цифри -> 26*26*10*10*10")}
        ${trap("'Не разом', 'без', 'крім' часто зручно рахувати через віднімання.", "Усі варіанти мінус заборонені майже завжди простіше, ніж будувати правильні з нуля.")}
        ${trap("'Принаймні один' часто зручно рахувати через доповнення.", "Принаймні один = усі варіанти мінус жодного.", "хоча б одна дівчина = усі команди - команди без дівчат")}
      </ul></div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module">
      <div class="kicker">Блок 10 / логіка</div>
      <h2>🧠 ТЗНК: імплікація, висновки, таблиці, графіки</h2>
      <div class="grid">
        ${card("✅ Імплікація P → Q", "Фраза 'якщо P, то Q' хибна тільки в одному випадку: P істинне, а Q хибне. Обіцянка порушена лише тоді, коли умову виконали, а результат не дали.", "Якщо прибереш кімнату (P), отримаєш цукерку (Q).\nP=true, Q=false -> брехня.\nІнші випадки -> правило не порушено.")}
        ${card("✅ Must be true", "Потрібно вибрати те, що неминуче випливає з умови. Не те, що ймовірно, знайомо або звучить розумно.", "Якщо A>B і B>C,\nто A>C обов'язково.\nА от 'A найбільше у світі' не випливає.")}
        ${card("📊 Таблиці", "Спершу читаємо назви рядків і колонок, потім одиниці виміру. Пастка: порівняти відсотки з різних баз.", "20% від 100 = 20\n20% від 50 = 10\nОднаковий відсоток не означає однакову кількість.")}
        ${card("📈 Графіки функцій", "Лінійна функція дає пряму. Квадратична - параболу. Обернена пропорційність y=1/x має дві гілки. Експонента швидко росте або спадає.", "y=x -> пряма\ny=x^2 -> парабола\ny=1/x -> гіпербола\ny=2^x -> експонента")}
        ${card("🧮 Логарифм", "Логарифм питає: до якого степеня треба піднести основу, щоб отримати число. Це обернена дія до експоненти.", "2^3 = 8\nlog2(8) = 3")}
        ${card("🧮 Відсотки", "Завжди питай: від якої бази рахуємо? Збільшення і зменшення на той самий відсоток не повертає до початкового числа.", "100 + 20% = 120\n120 - 20% = 96")}
      </div>
      <div class="callout science"><b>Науково:</b> логічні задачі перевіряють не пам'ять, а валідність переходу від умови до висновку. Комбінаторика перевіряє структуру простору варіантів: альтернативи додаються, незалежні кроки множаться, порядок або зберігається, або стирається діленням.</div>
      <div class="callout life"><b>Приклад у житті:</b> якщо доставка каже "якщо замовлення до 12:00, привеземо сьогодні", вона збрехала тільки тоді, коли замовлення було до 12:00, а доставка не приїхала сьогодні. Якщо замовлення було після 12:00, правило нічого не обіцяло.</div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module">
      <div class="kicker">Блок 11 / English</div>
      <h2>🇬🇧 English: що реально ловлять</h2>
      <div class="grid">
        ${card("⏱️ Tenses", "Час обираємо не за перекладом, а за маркером і логікою події. Present Perfect - результат до тепер. Past Simple - завершений час у минулому. Past Continuous - дія в процесі в минулому.", "I have already finished.\nI finished yesterday.\nI was reading when he called.")}
        ${card("🔁 Passive voice", "Якщо важливий об'єкт дії, а не виконавець, часто потрібен passive: be + V3.", "The report was prepared yesterday.\nThe data are stored in a database.")}
        ${card("🔀 Conditionals", "Умовні речення перевіряють реальність ситуації: реальна, малоймовірна, минула нереальна.", "If it rains, we will stay home.\nIf I knew, I would tell you.\nIf I had known, I would have told you.")}
        ${card("🧷 Modals", "must - внутрішня необхідність або сильний висновок. have to - зовнішнє правило. should - порада. may/might - можливість.", "You must be tired. -> сильний висновок\nYou have to submit the form. -> правило")}
        ${card("🧱 Articles", "a/an - один із багатьох, the - конкретний або вже відомий. Нульовий артикль часто з абстрактними/загальними поняттями.", "a database -> якась база\nthe database -> конкретна база")}
        ${card("🧲 Collocations", "На тесті часто треба знати не переклад, а природну пару слів: make a decision, do research, depend on, responsible for.", "make a mistake\ndo homework\ndepend on\ninterested in")}
        ${card("🔗 Linkers", "however - контраст, therefore - наслідок, although - контраст усередині речення, because - причина, despite - після нього noun/gerund.", "Although it was late, we continued.\nDespite being tired, we continued.")}
        ${card("🔎 Reading", "Не шукай 'красиву' відповідь. Шукай рядок-доказ. Якщо відповідь ширша за текст або додає припущення, вона підозріла.", "Question asks: why?\nFind because / reason / caused by.\nThen compare wording, not emotion.")}
      </div>
      <div class="callout trap"><ul>
        ${trap("Переклад прийменника дослівно", "Українське 'залежить від' не допомагає, англійською буде depend on.")}
        ${trap("Плутанина despite / although", "Despite + noun/gerund. Although + повне речення з підметом і присудком.", "despite the rain / although it rained")}
        ${trap("Present Perfect vs Past Simple", "Already/just/yet часто тягнуть Perfect, yesterday/last year - Past Simple.")}
        ${trap("Reading: відповідь звучить логічно, але її нема в тексті", "На іспиті правильна відповідь має мати доказ, а не просто бути правдоподібною.")}
      </ul></div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module">
      <div class="kicker">Блоки IT / повна рамка</div>
      <h2>💻 IT: піддисципліни, які треба впізнавати</h2>
      <div class="grid">
        ${card("🧱 Процедурне програмування", "Програма організована як послідовність команд і процедур. Дані й функції часто існують окремо.", "function volumeUp(device) {\n  device.volume += 1;\n}")}
        ${card("🧱 ООП: клас і об'єкт", "Клас - шаблон. Об'єкт - конкретний екземпляр. Інкапсуляція ховає внутрішній стан і дає керований доступ.", "class Speaker {\n  volume = 10;\n  up() { this.volume++; }\n}\nconst jbl = new Speaker();")}
        ${card("🧱 Наслідування", "Новий клас отримує властивості й методи базового класу. Це 'is-a': ноутбук є пристроєм. Пастка: не плутати з композицією, де об'єкт має інший об'єкт.", "class Device {}\nclass Laptop extends Device {}\n// Laptop is a Device")}
        ${card("🧱 Поліморфізм", "Одна команда викликає різну поведінку залежно від об'єкта. Як кнопка гучності: на телефоні змінює звук дзвінка, у плеєрі - медіа, у навушниках - локальний рівень.", "devices.forEach(d => d.volumeUp());\n// method name same,\n// behavior can differ")}
        ${card("📈 Алгоритми і Big-O", "Big-O описує, як росте час/пам'ять при збільшенні входу. O(1) - стало, O(log n) - дуже повільний ріст, O(n) - лінійно, O(n²) - вкладені порівняння.", "binary search -> O(log n)\nlinear scan -> O(n)\nnested loops -> O(n^2)")}
        ${card("🗃️ Структури даних", "Array швидко бере за індексом. Stack - останній зайшов, перший вийшов. Queue - перший зайшов, перший вийшов. Hash table шукає за ключем.", "stack.push(x); stack.pop();\nqueue.enqueue(x); queue.dequeue();")}
        ${card("🗄️ SQL і БД", "SELECT читає, JOIN з'єднує таблиці, WHERE фільтрує рядки до групування, HAVING фільтрує групи після GROUP BY, GRANT дає права.", "SELECT user_id, COUNT(*)\nFROM orders\nWHERE status='paid'\nGROUP BY user_id\nHAVING COUNT(*) > 3;")}
        ${card("🗄️ Моделі даних", "Концептуальна модель описує сутності бізнесу. Логічна - таблиці, ключі, зв'язки. Фізична - як це зберігає конкретна СУБД.", "student - course - enrollment\nPK: student_id\nFK: enrollment.student_id")}
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module">
      <div class="kicker">IT / networks, OS, security, ML</div>
      <h2>🌐 Мережі, sysadmin/devops, безпека, Data Science</h2>
      <div class="grid">
        ${card("🌐 OSI", "OSI - модель із 7 рівнів. Для тесту важливо не вивчити все як вірш, а прив'язати приклади: фізика, кадр, пакет/IP, TCP/UDP, HTTP/DNS.", "L2: Ethernet, MAC, switch\nL3: IP, router\nL4: TCP/UDP, ports\nL7: HTTP, DNS, SMTP")}
        ${card("🌐 Packet / frame / segment", "На L2 часто говорять frame і MAC. На L3 - packet і IP. На L4 - segment/datagram і ports. Пастка: switch не маршрутизує за IP як router.", "switch -> MAC table\nrouter -> routing table / IP\nDNS -> domain to IP")}
        ${card("🖥️ Sysadmin minimum", "Користувачі, права, процеси, журнали, служби, резервні копії, оновлення. На тесті питають роль: хто керує ресурсами і доступом.", "Linux:\nps aux\nsystemctl status nginx\nchmod 640 file\njournalctl -u service")}
        ${card("🛠️ DevOps minimum", "DevOps - не тільки 'деплой'. Це CI/CD, автоматизація, контейнери, моніторинг, інфраструктура як код.", "git push -> CI tests -> build -> deploy\nDockerfile -> image\nKubernetes -> orchestration")}
        ${card("💾 Операційні системи", "ОС керує процесами, пам'яттю, файловою системою, пристроями та доступом. Kernel - ядро, shell - інтерфейс команд.", "process -> scheduler\nRAM -> memory manager\nfile -> filesystem\nUSB -> driver")}
        ${card("🔐 Криптографія", "Hash - односторонній відбиток. Encryption - можна розшифрувати ключем. Digital signature - підтверджує автора й цілісність.", "Kupyna -> hash\nAES/Rijndael -> symmetric encryption\nRSA/ECDSA -> signatures / asymmetric")}
        ${card("🤖 ML / Data Science", "Classification передбачає клас, regression - число, clustering - групи без міток. SVM шукає гіперплощину з максимальним margin.", "classification: spam / not spam\nregression: price\nclustering: customer groups")}
        ${card("📊 Data Engineering зв'язок", "Для екзамену не треба йти вглиб професії, але корисно бачити роль: SQL, сховища, ETL/ELT, якість даних, права доступу, моніторинг пайплайнів.", "source -> extract -> transform -> warehouse\nquality checks -> dashboard")}
      </div>
      <div class="callout trap"><ul>
        ${trap("Switch vs router", "Switch працює переважно на L2 і дивиться на MAC. Router працює на L3 і маршрутизує IP-пакети між мережами.")}
        ${trap("Hash vs encryption", "Hash не 'розшифровують'. Якщо можна повернути оригінал ключем - це шифрування, не хеш.")}
        ${trap("Inheritance vs composition", "Inheritance: Laptop is a Device. Composition: Laptop has a Battery.")}
        ${trap("WHERE vs HAVING", "WHERE до групування, HAVING після групування. Якщо є агрегат COUNT/SUM у фільтрі - часто HAVING.")}
        ${trap("Compiler / interpreter / linker", "Compiler перекладає код, interpreter виконує поступово, linker збирає об'єктні модулі в виконуваний модуль.")}
      </ul></div>
    </div>
  </section>
`;

let html = fs.readFileSync(basePath, "utf8");
html = html.replace("</style>", `
.module h3 { margin-top: 22px; }
.callout.trap li em { display:block; margin-top:6px; color:#0f3b44; font-style:normal; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
</style>`);
html = html.replace("\n</div>\n</body>", `${deepAppendix}\n</div>\n</body>`);
html = html.replace(/v14/g, "v17");
html = html.replace(/Master Prep Exam Teaching Guide v14/g, "Master Prep Exam Teaching Guide v17");
html = html.replace(/Master Prep Exam Guide v14/g, "Master Prep Exam Guide v17");

fs.writeFileSync(outPath, html, "utf8");
console.log(outPath);
