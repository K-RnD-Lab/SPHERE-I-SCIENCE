const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v23_signed_examples.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v24_all_block_maps.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v24_all_block_maps.pdf");

const polishCss = `
    .toc{padding:22px 24px!important;border-radius:18px!important}
    .toc h2{font-size:25px!important;margin-bottom:6px!important}
    .toc .toc-lede{font-size:13px!important;margin-bottom:12px!important}
    .toc-route{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;margin:10px 0 12px!important}
    .toc-route div{padding:10px!important;border-radius:12px!important;font-size:12.5px!important;line-height:1.38!important}
    .toc-table{font-size:11.4px!important;line-height:1.25!important;border:1px solid #e5dece}
    .toc-table th{padding:6px 7px!important}
    .toc-table td{padding:5px 7px!important}
    .toc-table .page{width:38px!important;text-align:center!important;color:#4b6570!important}
    .toc-table .part{width:24%!important}
    .toc-note{font-size:12px!important;margin-top:10px!important;padding:8px 10px!important}
    @media print{
      .toc{padding:18px 20px!important}
      .toc-route div{margin-bottom:6px!important}
      .toc-table{font-size:10.3px!important}
      .toc-table td,.toc-table th{padding:4px 5px!important}
    }
    .v23-focus{border:1px solid #d5e3df;border-radius:16px;background:#fbfdfb;padding:13px 14px;margin:12px 0;break-inside:avoid;page-break-inside:avoid}
    .v23-focus h4{margin:0 0 7px!important;color:#123244!important}
    .v23-flow{background:#10202b;color:#edf8f3;border-radius:13px;padding:12px;margin:8px 0;font-family:"Consolas","Courier New",monospace;font-size:11.3px;line-height:1.45;white-space:pre-wrap}
    .v23-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0}
    .v23-two>div{border:1px solid #dfe7e9;border-radius:14px;background:#fff;padding:11px}
    .v23-warning{border-left:5px solid #c34a42;background:#fff0ee;border-radius:12px;padding:10px 12px;margin:10px 0}
    .v23-story{border-left:5px solid #367a99;background:#edf7fb;border-radius:12px;padding:10px 12px;margin:10px 0}
    @media print{.v23-two{display:block}.v23-two>div{margin-bottom:8px}.v23-flow{font-size:10.6px}}
`;

function requestJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function waitForChrome(port) {
  const url = `http://127.0.0.1:${port}/json/version`;
  for (let i = 0; i < 80; i += 1) {
    try {
      return await requestJson(url);
    } catch {
      await sleep(100);
    }
  }
  throw new Error("Chrome DevTools did not start");
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const events = new Map();

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
      return;
    }
    if (data.method && events.has(data.method)) {
      for (const resolve of events.get(data.method)) resolve(data.params || {});
      events.delete(data.method);
    }
  };

  const opened = new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  return {
    opened,
    close: () => ws.close(),
    send(method, params = {}) {
      const msgId = ++id;
      ws.send(JSON.stringify({ id: msgId, method, params }));
      return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
    },
    once(method) {
      return new Promise((resolve) => {
        if (!events.has(method)) events.set(method, []);
        events.get(method).push(resolve);
      });
    },
  };
}

async function printPdfWithFooter(chrome, htmlPath, pdfPath) {
  const port = 9337 + Math.floor(Math.random() * 200);
  const profileDir = path.join(process.env.TEMP || dir, `chrome-print-${Date.now()}`);
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--disable-extensions",
    `--user-data-dir=${profileDir}`,
    `--remote-debugging-port=${port}`,
    "about:blank",
  ], { stdio: "ignore" });

  try {
    await waitForChrome(port);
    const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;
    const target = await requestJson(`http://127.0.0.1:${port}/json/new?about:blank`, "PUT");
    const client = cdp(target.webSocketDebuggerUrl);
    await client.opened;
    await client.send("Page.enable");
    const loaded = client.once("Page.loadEventFired");
    await client.send("Page.navigate", { url: fileUrl });
    await withTimeout(loaded, 15000, "Page load");
    await sleep(500);
    const result = await client.send("Page.printToPDF", {
      printBackground: true,
      displayHeaderFooter: true,
      preferCSSPageSize: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width:100%;font-family:Arial,sans-serif;font-size:8px;color:#65757c;text-align:center;padding:0 12mm;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>`,
    });
    fs.writeFileSync(pdfPath, Buffer.from(result.data, "base64"));
    client.close();
  } finally {
    child.kill("SIGKILL");
    setTimeout(() => {
      try {
        fs.rmSync(profileDir, { recursive: true, force: true });
      } catch {
        // Chrome can keep a Windows handle open for a moment after kill; the temp profile is harmless.
      }
    }, 1000);
  }
}

function buildBlockMapsSection() {
  return `
  <section class="section page-break">
    <div class="module v24-atlas">
      <div class="kicker">Оновлення v24 / карти всіх блоків</div>
      <h2>🗺 Як вчити кожен блок: схема → приклад → пастка → міні-перевірка</h2>
      <p>Цей атлас не замінює основні сторінки посібника. Він працює як “карта перед дорогою”: спершу побачити структуру, потім читати блок, а після цього йти в тренажер. Якщо тема пливе, повертайся до її схеми й проходь рядок за рядком.</p>
      <div class="v24-legend">
        <span>🔬 науковий сенс</span><span>🏠 аналогія</span><span>⚠️ пастка</span><span>🧪 міні-дріл</span>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v24-atlas">
      <div class="kicker">IT / основа</div>
      <h2>💻 Блоки 01-04B: як комп'ютер рахує, виконує код і організовує програму</h2>
      <div class="v24-grid">
        <article class="v24-block-map">
          <h3>🔢 Блок 01: біти, байти, binary, signed/unsigned</h3>
          <div class="v24-flow">дані -> bit 0/1 -> byte = 8 bits -> 2^n комбінацій
  -> unsigned: усі біти = число
  -> signed: перший біт = знак, решта = величина/код</div>
          <p><b>🔬 Сенс:</b> комп'ютер зберігає не “числа”, а біти. Тип даних каже, як їх читати.</p>
          <p><b>🏠 Аналогія:</b> той самий запис 01.02 може бути датою або часом. Так само 11111111 може бути 255 або -1.</p>
          <p><b>⚠️ Ловлять:</b> 2^8 = 256 комбінацій, але значення unsigned: 0..255; signed 8-bit: -128..127.</p>
          <p><b>🧪 Дріл:</b> 33 = 32+1 = 100001₂. -5: 00000101 → інверсія 11111010 → +1 = 11111011.</p>
        </article>
        <article class="v24-block-map">
          <h3>💻 Блок 02: процедурне програмування</h3>
          <div class="v24-flow">input -> змінні -> оператори -> if/else -> loop -> function -> output
кожен рядок змінює стан програми</div>
          <p><b>🔬 Сенс:</b> процедурний код читається як рецепт: крок 1, крок 2, крок 3.</p>
          <p><b>🏠 Аналогія:</b> кавомашина: налити воду, змолоти каву, натиснути кнопку, отримати результат.</p>
          <p><b>⚠️ Ловлять:</b> індексація з 0, межі циклу, присвоєння <code>=</code> проти порівняння, рекурсія без бази.</p>
          <p><b>🧪 Дріл:</b> для циклу завжди роби таблицю: <code>i</code>, умова, тіло, нове значення.</p>
        </article>
        <article class="v24-block-map">
          <h3>🧱 Блок 03: ООП базово</h3>
          <div class="v24-flow">class = шаблон
object = конкретний екземпляр
encapsulation = стан змінюється через методи
inheritance = is-a
polymorphism = одна команда, різна поведінка</div>
          <p><b>🔬 Сенс:</b> ООП групує дані й поведінку в об'єкти, щоб складну систему читати як взаємодію ролей.</p>
          <p><b>🏠 Аналогія:</b> кнопка гучності одна, але телефон, ноутбук і навушники реагують по-своєму.</p>
          <p><b>⚠️ Ловлять:</b> клас ≠ об'єкт; поліморфізм ≠ “просто багато класів”; private сам по собі ще не пояснює інкапсуляцію.</p>
          <p><b>🧪 Дріл:</b> <code>Dog extends Animal</code> → inheritance. <code>Car has Engine</code> → composition.</p>
        </article>
        <article class="v24-block-map">
          <h3>🧩 Блок 03B: композиція, агрегація, тести</h3>
          <div class="v24-flow">is-a -> inheritance
strong has-a -> composition
weak has-a -> aggregation
unit test -> одна частина
integration test -> частини разом</div>
          <p><b>🔬 Сенс:</b> зв'язки між об'єктами показують, хто ким є і хто кого має.</p>
          <p><b>🏠 Аналогія:</b> кімната без будинку зазвичай не існує окремо, а гравець може перейти в іншу команду.</p>
          <p><b>⚠️ Ловлять:</b> “має” не означає “є різновидом”. Машина має двигун, але машина не є двигуном.</p>
          <p><b>🧪 Дріл:</b> якщо видалити ціле, частина логічно зникає? Так → composition, ні → aggregation.</p>
        </article>
        <article class="v24-block-map">
          <h3>📈 Блок 04: алгоритми й структури даних</h3>
          <div class="v24-flow">data structure = як лежать дані
algorithm = як рухаємось
Big-O = як росте час/пам'ять
array / stack / queue / tree / graph / hash</div>
          <p><b>🔬 Сенс:</b> структура даних визначає, які операції швидкі, а які дорогі.</p>
          <p><b>🏠 Аналогія:</b> stack — стопка тарілок, queue — черга до каси, hash — шафка з номером.</p>
          <p><b>⚠️ Ловлять:</b> binary search тільки для sorted data; BFS = queue; DFS = stack/recursion.</p>
          <p><b>🧪 Дріл:</b> порядок росту: <code>O(1) < O(log n) < O(n) < O(n log n) < O(n²)</code>.</p>
        </article>
        <article class="v24-block-map">
          <h3>🖥 Блок 04B: архітектура комп'ютера</h3>
          <div class="v24-flow">CPU виконує інструкції
RAM тримає активні дані
cache близько до CPU і дуже швидкий
disk/SSD зберігає довго
I/O = взаємодія із зовнішнім світом</div>
          <p><b>🔬 Сенс:</b> швидкість системи часто визначає не “сила CPU”, а шлях даних між CPU, пам'яттю, диском і мережею.</p>
          <p><b>🏠 Аналогія:</b> CPU — кухар, RAM — робочий стіл, cache — інгредієнти під рукою, disk — склад.</p>
          <p><b>⚠️ Ловлять:</b> RAM ≠ disk; CPU cache ≠ browser cache; I/O часто повільніше за обчислення.</p>
          <p><b>🧪 Дріл:</b> “що швидше?” зазвичай: cache → RAM → SSD/disk → network.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v24-atlas">
      <div class="kicker">IT / data, math, security, networks, ML</div>
      <h2>🗄 Блоки 05-09: дані, аналітика, безпека, мережі й ML</h2>
      <div class="v24-grid">
        <article class="v24-block-map">
          <h3>🗄 Блок 05: бази даних і SQL</h3>
          <div class="v24-flow">conceptual -> logical -> physical
table -> row -> column
primary key -> foreign key
SELECT -> WHERE -> GROUP BY -> HAVING -> ORDER BY
GRANT -> права доступу</div>
          <p><b>🔬 Сенс:</b> база даних зберігає структуровані факти так, щоб їх можна було пов'язувати й запитувати.</p>
          <p><b>🏠 Аналогія:</b> таблиці як аркуші в зошиті, ключі як ID-картки, foreign key як посилання на іншу картку.</p>
          <p><b>⚠️ Ловлять:</b> WHERE до групування, HAVING після; GRANT, не ALLOW; ER-model показує сутності й зв'язки.</p>
          <p><b>🧪 Дріл:</b> якщо питають “нормалізація таблиць” — це логічна модель, не фізичне зберігання.</p>
        </article>
        <article class="v24-block-map">
          <h3>🏗 Блок 06: OLTP, OLAP, Data Warehouse</h3>
          <div class="v24-flow">OLTP -> щоденні операції
OLAP -> аналітичні запити
Data Warehouse -> історичне сховище
Data Mart -> підмножина для напряму
Dimension -> за чим дивимось
Measure -> що рахуємо</div>
          <p><b>🔬 Сенс:</b> операційні системи оптимізовані для швидких змін, аналітичні — для читання великих зрізів.</p>
          <p><b>🏠 Аналогія:</b> каса магазину — OLTP, місячний звіт продажів — OLAP, архів усіх продажів — warehouse.</p>
          <p><b>⚠️ Ловлять:</b> OLTP ≠ OLAP; dimension ≠ measure; warehouse ≠ одна табличка.</p>
          <p><b>🧪 Дріл:</b> “багато транзакцій зараз” → OLTP. “звіт за роки” → OLAP/warehouse.</p>
        </article>
        <article class="v24-block-map">
          <h3>📐 Блок 06B: функції, графіки, логарифми</h3>
          <div class="v24-flow">linear -> пряма
quadratic -> парабола
1/x -> гіпербола
2^x -> експонента
log x -> повільний ріст, кількість поділів/подвоєнь</div>
          <p><b>🔬 Сенс:</b> графік показує не просто формулу, а характер росту або спадання.</p>
          <p><b>🏠 Аналогія:</b> експонента — снігова куля; логарифм — скільки разів треба поділити навпіл.</p>
          <p><b>⚠️ Ловлять:</b> парабола ≠ експонента; <code>1/x</code> зменшується; <code>log₂(1024)=10</code>.</p>
          <p><b>🧪 Дріл:</b> binary search на 1024 елементах має приблизно 10 кроків.</p>
        </article>
        <article class="v24-block-map">
          <h3>🔐 Блок 07: кібербезпека і криптографія</h3>
          <div class="v24-flow">hash -> відбиток, не розшифровується
encryption -> шифрування/розшифрування з ключем
signature -> цілісність + авторство
authentication -> хто ти
authorization -> що тобі можна</div>
          <p><b>🔬 Сенс:</b> безпека розділяє ролі: приховати, перевірити, підписати, впустити, дозволити.</p>
          <p><b>🏠 Аналогія:</b> пароль на вході — authentication; список доступів до кімнат — authorization.</p>
          <p><b>⚠️ Ловлять:</b> hash не decrypt; Купина — hash; AES/Rijndael, Калина, Струмок — шифри.</p>
          <p><b>🧪 Дріл:</b> “який алгоритм є геш-функцією?” → шукай Купина.</p>
        </article>
        <article class="v24-block-map">
          <h3>🌐 Блок 08: мережі й операційні системи</h3>
          <div class="v24-flow">browser -> DNS -> IP -> TCP/TLS -> HTTP request -> server
process -> програма в роботі
thread -> потік всередині process
driver -> посередник між OS і device</div>
          <p><b>🔬 Сенс:</b> мережа — це шари відповідальності, а ОС керує ресурсами комп'ютера.</p>
          <p><b>🏠 Аналогія:</b> DNS — телефонна книга, TCP — доставка з підтвердженням, UDP — швидке повідомлення без гарантій.</p>
          <p><b>⚠️ Ловлять:</b> DNS ≠ DHCP; TCP ≠ UDP; process ≠ thread; device ≠ driver.</p>
          <p><b>🧪 Дріл:</b> якщо питають “ім'я сайту → IP” — DNS. “видати IP пристрою” — DHCP.</p>
        </article>
        <article class="v24-block-map">
          <h3>🧱 Блок 08B/08C: packets, switch/router, OSI</h3>
          <div class="v24-flow">L2 data link -> frame + MAC + switch
L3 network -> packet + IP + router
L4 transport -> segment/datagram + port + TCP/UDP
L7 application -> HTTP/DNS/SSH</div>
          <p><b>🔬 Сенс:</b> кожен рівень додає свою адресу або роль: MAC, IP, port, protocol.</p>
          <p><b>🏠 Аналогія:</b> IP знаходить будинок, port — квартиру/сервіс, HTTP — мова розмови.</p>
          <p><b>⚠️ Ловлять:</b> switch ≠ router; frame ≠ packet; port не є IP-адресою; CI/CD ≠ container.</p>
          <p><b>🧪 Дріл:</b> MAC → switch/frame; IP → router/packet; port → TCP/UDP; URL/HTTP → application.</p>
        </article>
        <article class="v24-block-map">
          <h3>🤖 Блок 09: Data Science / ML</h3>
          <div class="v24-flow">data -> features + target
train -> model learns
test -> model is checked
classification -> class
regression -> number
clustering -> groups without labels
PCA -> fewer dimensions
SVM -> margin between classes</div>
          <p><b>🔬 Сенс:</b> ML шукає правило в даних, але правило треба перевіряти на нових прикладах.</p>
          <p><b>🏠 Аналогія:</b> тренування на задачнику ≠ екзамен. Якщо запам'ятати відповіді, а не правило, буде overfitting.</p>
          <p><b>⚠️ Ловлять:</b> PCA не класифікує; SVM максимізує margin; train high + test low = overfitting.</p>
          <p><b>🧪 Дріл:</b> spam/not spam → classification; ціна → regression; групи клієнтів без labels → clustering.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v24-atlas">
      <div class="kicker">ТЗНК + English / екзаменаційне мислення</div>
      <h2>🧠 Блоки 10-11B: як розпізнавати пастки, а не вгадувати</h2>
      <div class="v24-grid">
        <article class="v24-block-map">
          <h3>🧠 Блок 10: комбінаторика, логіка, відсотки</h3>
          <div class="v24-flow">АБО -> додавання
І / пара / послідовність -> множення
ролі є -> порядок важливий
ролей нема -> порядок не важливий, ділимо на перестановки
must be true -> тільки те, що точно випливає</div>
          <p><b>🔬 Сенс:</b> комбінаторика рахує не предмети, а сценарії вибору.</p>
          <p><b>🏠 Аналогія:</b> кава або чай — вибір одного; кава і десерт — набір із двох частин.</p>
          <p><b>⚠️ Ловлять:</b> “капітан уже є” ≠ “обрати капітана”; “не разом” часто рахується як усі мінус погані.</p>
          <p><b>🧪 Дріл:</b> команда 3 з 7, капітан уже входить: обрати ще 2 з 6 → C(6,2)=15.</p>
        </article>
        <article class="v24-block-map">
          <h3>🧩 Блок 10B/10C: обмеження й хитрі формулювання</h3>
          <div class="v24-flow">1) знайди всіх кандидатів
2) зафіксуй обов'язкових
3) прибери заборонених
4) виріши: порядок важливий?
5) якщо "хоча б один" -> часто всі - жодного
6) якщо "разом/не разом" -> блок або віднімання поганих</div>
          <p><b>🔬 Сенс:</b> обмеження змінює простір варіантів до того, як рахувати формулу.</p>
          <p><b>🏠 Аналогія:</b> бронювання місць: якщо одне місце вже зайняте, схема посадки змінилася.</p>
          <p><b>⚠️ Ловлять:</b> множення рахує дублікати, якщо порядок неважливий; “рівно один” ≠ “принаймні один”.</p>
          <p><b>🧪 Дріл:</b> двоє не можуть бути разом у команді 3 з 7: C(7,3)-5 = 35-5 = 30.</p>
        </article>
        <article class="v24-block-map">
          <h3>✅ Логіка: імплікація, висновки, таблиці</h3>
          <div class="v24-flow">P -> Q хибне тільки коли:
P істинне, Q хибне

must be true -> доведено умовою
could be true -> не заборонено
cannot be true -> суперечить умові</div>
          <p><b>🔬 Сенс:</b> логіка тесту не питає, що “зазвичай буває”; вона питає, що випливає з умови.</p>
          <p><b>🏠 Аналогія:</b> “якщо прибереш кімнату, отримаєш цукерку” порушено тільки якщо прибрав, а цукерку не дали.</p>
          <p><b>⚠️ Ловлять:</b> якщо гарантовано пройшли A, це не означає, що всі не-A не пройшли.</p>
          <p><b>🧪 Дріл:</b> підкреслюй слова: усі, жоден, деякі, тільки, обов'язково, можливо.</p>
        </article>
        <article class="v24-block-map">
          <h3>🇬🇧 Блок 11: reading + grammar patterns</h3>
          <div class="v24-flow">question -> keyword -> sentence evidence -> eliminate traps
main idea -> не деталь
inference -> висновок з тексту
reference -> до кого/чого відноситься займенник
tone -> attitude автора</div>
          <p><b>🔬 Сенс:</b> reading перевіряє доказ у тексті, не загальну ерудицію.</p>
          <p><b>🏠 Аналогія:</b> відповідь має мати “чек” з тексту. Якщо не можеш показати речення-доказ, це ризик.</p>
          <p><b>⚠️ Ловлять:</b> знайоме слово в неправильному контексті; too broad/too narrow; відповідь “майже правда”, але не з passage.</p>
          <p><b>🧪 Дріл:</b> після вибору відповіді знайди 3-5 слів у тексті, які її доводять.</p>
        </article>
        <article class="v24-block-map">
          <h3>⏱ Блок 11B: tenses, conditionals, collocations</h3>
          <div class="v24-flow">Past Simple -> finished past marker
Present Perfect -> result/experience до now
Past Perfect -> earlier past
First conditional -> real future
Second -> unreal now/future
Third -> unreal past
collocation -> готова пара слів</div>
          <p><b>🔬 Сенс:</b> англійський час обирається не за українським перекладом, а за часовою логікою й маркерами.</p>
          <p><b>🏠 Аналогія:</b> Past Simple — “факт у журналі”; Present Perfect — “наслідок досі на столі”.</p>
          <p><b>⚠️ Ловлять:</b> depend on, not from; evidence uncountable; unless без зайвого not; would have + V3 для минулого жалю.</p>
          <p><b>🧪 Дріл:</b> <code>yesterday/last</code> → Past Simple; <code>since/for/already</code> часто → Present Perfect.</p>
        </article>
      </div>
      <div class="v24-summary">
        <h3>🧭 Як читати будь-яке питання на іспиті</h3>
        <div class="v24-flow">1. Назви блок: IT / ТЗНК / English.
2. Підкресли ключове слово: "не є", "найточніше", "або", "і", "must", "could", marker tense.
3. Визнач тип задачі: визначення, різниця, приклад, наслідок, розрахунок.
4. Прибери варіанти-пастки.
5. Обери відповідь і скажи: "чому не інші?"</div>
      </div>
    </div>
  </section>`;
}

function injectV24Css(html) {
  const css = `
    .v24-atlas{background:#fffdf8;border:1px solid #d9e5df;border-radius:24px;padding:24px;margin:18px 0}
    .v24-atlas h2{margin-top:0}
    .v24-legend{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
    .v24-legend span{border:1px solid #d9e5df;border-radius:999px;background:#f4faf7;padding:6px 10px;font-weight:700;font-size:12px}
    .v24-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    .v24-block-map{border:1px solid #dbe6e1;border-radius:16px;background:#fbfdfb;padding:14px;break-inside:avoid;page-break-inside:avoid}
    .v24-block-map h3{margin:0 0 8px;color:#123244;font-size:17px}
    .v24-block-map p{margin:7px 0;font-size:12.6px;line-height:1.45}
    .v24-flow{background:#10202b;color:#edf8f3;border-radius:13px;padding:11px;margin:8px 0;font-family:"Consolas","Courier New",monospace;font-size:11px;line-height:1.38;white-space:pre-wrap}
    .v24-summary{margin-top:14px;border-left:5px solid #f4bd2f;background:#fff8df;border-radius:14px;padding:13px}
    @media print{.v24-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v24-flow{font-size:10.2px}.v24-block-map p{font-size:12px}}
  `;
  return html.replace("</style>", `${css}\n</style>`);
}

async function buildV24() {
  let html = fs.readFileSync(inHtml, "utf8");
  html = html.replace(/v23/g, "v24");
  html = html.replace(/Master Prep Exam Teaching Guide v23/g, "Master Prep Exam Teaching Guide v24");
  html = html.replace(/Master Prep Exam Guide v23/g, "Master Prep Exam Guide v24");
  html = html.replace(/PDF-версії v23/g, "PDF-версії v24");
  html = html.replace(
    `<tr><td class="page">86-100</td><td class="part">🧩 Додатки</td><td>IT-професії, фінальний чеклист, додаткові пояснення, поглиблені ТЗНК/English/IT рамки.</td><td>Використовувати як довідник, коли тест показав слабке місце.</td></tr>`,
    `<tr><td class="page">86-100</td><td class="part">🧩 Додатки</td><td>IT-професії, фінальний чеклист, додаткові пояснення, поглиблені ТЗНК/English/IT рамки.</td><td>Використовувати як довідник, коли тест показав слабке місце.</td></tr>
          <tr><td class="page">101-108</td><td class="part">🗺️ v24 карти всіх блоків</td><td>Схеми навчання для кожного блоку: IT, data, security, networks, ML, ТЗНК, English.</td><td>Читати перед повторенням блоку або після помилки в тесті.</td></tr>`
  );
  html = html.replace(/4 \/ 100/g, "4 / 108");
  html = injectV24Css(html);
  const section = buildBlockMapsSection();
  if (!html.includes("</body>")) throw new Error("HTML body end not found");
  html = html.replace(/\s*<\/div>\s*<\/body>/, `${section}\n</div>\n</body>`);
  fs.writeFileSync(outHtml, html, "utf8");

  const chromeCandidates = [
    "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
    "C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
  ];
  const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
  if (!chrome) throw new Error("Chrome/Edge not found");
  await printPdfWithFooter(chrome, outHtml, outPdf);
  console.log(outPdf);
}

async function main() {
  await buildV24();
  return;

  let html = fs.readFileSync(inHtml, "utf8");
  html = html.replace(/v21/g, "v23");
  html = html.replace(/Master Prep Exam Teaching Guide v21/g, "Master Prep Exam Teaching Guide v23");
  html = html.replace(/Master Prep Exam Guide v21/g, "Master Prep Exam Guide v23");
  html = html.replace("</style>", `${polishCss}\n  </style>`);

  html = html.replace("<tr><th>№</th><th>Блок</th><th>Що всередині</th><th>Як читати</th></tr>", "<tr><th>Стор.</th><th>Блок</th><th>Що всередині</th><th>Як читати</th></tr>");
  const tocTable = `
      <table class="toc-table">
        <thead>
          <tr><th>Стор.</th><th>Блок</th><th>Що всередині</th><th>Як читати</th></tr>
        </thead>
        <tbody>
          <tr><td class="page">1</td><td class="part">Обкладинка</td><td>Назва, призначення, фокус на ЄВІ/ЄФВВ: IT, ТЗНК, English.</td><td>Зрозуміти рамку: це не загальна IT-книга, а підготовка до тестового формату.</td></tr>
          <tr><td class="page">2-3</td><td class="part">🗺️ Навігація</td><td>Повна карта блоків: IT, ТЗНК, English, додатки.</td><td>Швидко побачити, які теми є в документі.</td></tr>
          <tr><td class="page">4-5</td><td class="part">🧭 Блок 00</td><td>Як вчитися, щоб не плутатися: ключові слова, пастки, спосіб читання питань.</td><td>Прочитати перед усіма тестами, як інструкцію до мислення.</td></tr>
          <tr><td class="page">6-7</td><td class="part">📑 Зміст і маршрут</td><td>План читання, секції, сторінкові орієнтири.</td><td>Повертатися сюди, коли губиться “де я зараз і навіщо це читаю”.</td></tr>
          <tr><td class="page">8</td><td class="part">🗺️ Схемний атлас</td><td><span class="toc-chip">IT</span><span class="toc-chip">ТЗНК</span><span class="toc-chip">English</span> Загальна карта трьох дисциплін.</td><td>Спочатку проглянути очима всі блоки, не вчитуватися глибоко.</td></tr>
          <tr><td class="page">9-13</td><td class="part">💻 IT-схеми</td><td>Bit/byte, signed/unsigned, compiler/interpreter/linker, OOP, algorithms, SQL, networks, security, ML.</td><td>Читати як “що з чим плутають”. Кожну схему закривати прикладом і пасткою.</td></tr>
          <tr><td class="page">14-18</td><td class="part">🧪 Код як мікроскоп</td><td>Java OOP, composition, binary search, SQL, DNS/TCP/HTTPS.</td><td>Не зубрити синтаксис. Дивитися, де саме клас, об'єкт, метод, роль, запит, право доступу.</td></tr>
          <tr><td class="page">19-21</td><td class="part">🧠 ТЗНК-схеми</td><td>Комбінаторика: додавання/множення, ролі/без ролей, fixed/forbidden, exactly one, at least one; логіка, відсотки, графіки.</td><td>Кожну задачу починати з дерева: АБО чи І? ролі є? обмеження є?</td></tr>
          <tr><td class="page">22-24</td><td class="part">🇬🇧 English-схеми</td><td>Reading evidence, tenses, conditionals, collocations, linkers.</td><td>Не перекладати все підряд. Шукати доказ у тексті й граматичні маркери.</td></tr>
          <tr><td class="page">25-30</td><td class="part">🔢 Блок 01-02</td><td>Бінарний рахунок, представлення даних, процедурне програмування, виконання коду.</td><td>Після схем повернутися сюди для повнішого пояснення і дрілів.</td></tr>
          <tr><td class="page">31-42</td><td class="part">🧱 Блок 03-04B</td><td>ООП, наслідування, композиція, тестування, алгоритми, структури даних, CPU/RAM/cache/I/O.</td><td>Читати разом із Java-вставками вище.</td></tr>
          <tr><td class="page">43-51</td><td class="part">🗄️ Блок 05-06B</td><td>Бази даних, SQL, OLTP/OLAP/Data Warehouse, функції, графіки, логарифми, експонента.</td><td>Підкреслювати різниці: WHERE/HAVING, conceptual/logical/physical, OLTP/OLAP.</td></tr>
          <tr><td class="page">52-66</td><td class="part">🔐 Блок 07-09</td><td>Кібербезпека, криптографія, мережі, OSI/TCP-IP, sysadmin/devops база, Data Science/ML.</td><td>Особливо ловити терміни, які звучать схоже, але мають різні ролі.</td></tr>
          <tr><td class="page">67-76</td><td class="part">🧠 Блок 10-10C</td><td>ТЗНК: логіка, комбінаторика, перестановки, пропуски, обмеження, розбір “капітан”, “не разом”, “рівно один”.</td><td>Це читати повільно. Після кожного прикладу пробувати змінити умову і перерахувати.</td></tr>
          <tr><td class="page">77-82</td><td class="part">🇬🇧 Блок 11-11B</td><td>English grammar patterns, reading markers, усі базові часи, conditionals, типові пастки.</td><td>Після блоку одразу пройти English variant у тренажері.</td></tr>
          <tr><td class="page">83-97</td><td class="part">🧩 Додатки</td><td>IT-професії, фінальний чеклист, додаткові пояснення, поглиблені ТЗНК/English/IT рамки.</td><td>Використовувати як довідник, коли тест показав слабке місце.</td></tr>
        </tbody>
      </table>`;
  html = html.replace(/<table class="toc-table">[\s\S]*?<\/table>/, tocTable);
  html = html.replace(
    /<div class="toc-note"><b>Примітка:<\/b>[\s\S]*?<\/div>/,
    `<div class="toc-note"><b>Примітка:</b> у змісті наведено діапазони сторінок для поточної PDF-версії v23. Точний номер поточної сторінки завжди видно в нижньому колонтитулі у форматі <b>4 / 97</b>.</div>`
  );

  const schemaAnchor = `<div class="schema-note life"><b>🏠 Приклад:</b> 8 бітів: 2^8 = 256. Unsigned: 00000000=0, 11111111=255. Signed: 01111111=127, 10000000=-128, 11111111=-1.</div>`;
  const schemaExtra = `
      <div class="v23-focus">
        <h4>🧩 Як не плутати signed і unsigned</h4>
        <div class="v23-flow">[ 8 однакових бітів: 11111111 ]
  |
  |-- якщо тип unsigned -> усі біти є числом
  |      128+64+32+16+8+4+2+1 = 255
  |
  |-- якщо тип signed -> перший біт зліва є знаком
         1....... означає "мінус", тому 11111111 = -1</div>
        <p><b>Науково:</b> біти самі не мають “плюса” чи “мінуса”. Значення задає тип даних у програмі. Той самий байт можна прочитати як 255 або як -1, якщо програма дивиться на нього різними “окулярами”.</p>
        <p><b>Аналогія:</b> запис <code>01.02</code> може бути датою “1 лютого” або часом “1 хвилина 2 секунди”. Символи ті самі, контекст інший. Так само <code>11111111</code> залежить від signed/unsigned.</p>
      </div>
      <div class="v23-focus">
        <h4>🔁 Two's complement: чому -10 = 11110110</h4>
        <div class="v23-flow">+10 = 00001010
крок 1: інверсія бітів        -> 11110101
крок 2: додати 1 справа       -> 11110110

перевірка:
  00001010
+ 11110110
-----------
1 00000000  <- дев'ятий біт не влазить, лишається 00000000</div>
        <p><b>Чому +1 додається справа?</b> Бо це звичайне число <code>1</code>, найменший розряд. Як у десятковій системі <code>153 + 1</code> додає одиницю під останню цифру, так у binary одиниця заходить справа і переноситься лівіше, якщо зустрічає <code>1+1=10</code>.</p>
      </div>
      <div class="v23-story">
        <b>🌍 Реальний приклад:</b> ліміт 32-bit integer став помітним, коли лічильник переглядів YouTube для “Gangnam Style” перетнув 2 147 483 647. Це максимум для signed 32-bit integer: <code>2^31 - 1</code>. Рішенням було перейти на більший тип лічильника.
      </div>
      <div class="v23-warning">
        <b>⚠️ Обережно з легендами:</b> історію про “Nuclear Gandhi” часто розповідають як приклад unsigned overflow <code>1 - 2 -> 255</code>, але для оригінальної Civilization це радше відома ігрова легенда, а не надійно підтверджений факт. Для іспиту важлива сама механіка: якщо unsigned-лічильник не має мінусів, віднімання нижче нуля може “перекинути” значення до максимуму.
      </div>`;
  if (!html.includes(schemaAnchor)) throw new Error("v23 schema anchor not found");
  html = html.replace(schemaAnchor, `${schemaAnchor}${schemaExtra}`);

  const byteAnchor = `<pre><code>00000000 = 0
11111111 = 255
Тому unsigned byte часто має діапазон 0..255</code></pre>`;
  const byteExtra = `
      <div class="examples">
        <div class="example-card">
          <h4>Signed byte: чому максимум саме 127</h4>
          <p>У signed 8-bit перший біт зліва показує знак. Для додатних чисел він має бути <code>0</code>, тому для величини лишається 7 бітів.</p>
          <pre><code>01111111
розряди: 64 32 16 8 4 2 1
сума: 64+32+16+8+4+2+1 = 127

10000000 вже починається з 1,
тому у signed це не +128, а -128.</code></pre>
        </div>
        <div class="example-card">
          <h4>Unsigned vs signed як “режим читання”</h4>
          <p>Комп'ютер не вгадує тип. Тип задає код, формат файлу або інструкція процесора.</p>
          <pre><code>байт у пам'яті: 11111111

unsigned char -> 255
signed char   -> -1

ті самі біти, різні правила читання</code></pre>
        </div>
        <div class="example-card">
          <h4>Як зробити від'ємне число</h4>
          <p>Для two's complement: взяти додатне число, перевернути біти, додати 1 справа.</p>
          <pre><code>+5 = 00000101
інверсія = 11111010
+1       = 11111011

отже, -5 = 11111011</code></pre>
        </div>
        <div class="example-card">
          <h4>Що таке overflow</h4>
          <p>Overflow - це коли результат потребує більше бітів, ніж виділено. Зайвий старший біт відкидається або фіксується як помилка залежно від мови/режиму.</p>
          <pre><code>unsigned 8-bit:
255 = 11111111
255 + 1 = 1 00000000

у 8 бітах лишається 00000000,
тобто лічильник повернувся до 0.</code></pre>
        </div>
      </div>
      <div class="callout life"><b>🏠 Аналогія з лічильником:</b> якщо старий лічильник має лише 3 цифри, після 999 наступне значення знову 000. У 8-бітному unsigned те саме: після 255 наступне значення може стати 0.</div>
      <div class="callout science"><b>🔬 Чому це питають на іспитах:</b> тема перевіряє не “зубріння бітів”, а розуміння меж типів даних. У реальному коді неправильний тип може зламати лічильник, індекс масиву, розмір файлу, рейтинг, баланс або кількість переглядів.</div>`;
  if (!html.includes(byteAnchor)) throw new Error("v23 byte anchor not found");
  html = html.replace(byteAnchor, `${byteAnchor}${byteExtra}`);

  const pageRangeFixes = [
    ["9-13", "9-14"],
    ["14-18", "15-19"],
    ["19-21", "20-22"],
    ["22-24", "23-25"],
    ["25-30", "26-33"],
    ["31-42", "34-45"],
    ["43-51", "46-54"],
    ["52-66", "55-69"],
    ["67-76", "70-79"],
    ["77-82", "80-85"],
    ["83-97", "86-100"],
  ];
  for (const [from, to] of pageRangeFixes) {
    html = html.replace(new RegExp(`<td class="page">${from}</td>`, "g"), `<td class="page">${to}</td>`);
  }
  html = html.replace(/4 \/ 97/g, "4 / 100").replace(/v22/g, "v23");

  fs.writeFileSync(outHtml, html, "utf8");

  const chromeCandidates = [
    "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe",
    "C:\\\\Program Files\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
    "C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe",
  ];
  const chrome = chromeCandidates.find((candidate) => fs.existsSync(candidate));
  if (!chrome) throw new Error("Chrome/Edge not found");
  await printPdfWithFooter(chrome, outHtml, outPdf);
  console.log(outPdf);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
