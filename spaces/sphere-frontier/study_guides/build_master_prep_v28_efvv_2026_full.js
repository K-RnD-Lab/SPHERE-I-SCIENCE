const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v26_efvv_technology.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v28_efvv_2026_full.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v28_efvv_2026_full.pdf");

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

async function waitForChrome(port) {
  for (let i = 0; i < 80; i += 1) {
    try {
      return await requestJson(`http://127.0.0.1:${port}/json/version`);
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
  const port = 9570 + Math.floor(Math.random() * 200);
  const profileDir = path.join(process.env.TEMP || dir, `chrome-print-v28-${Date.now()}`);
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
    const target = await requestJson(`http://127.0.0.1:${port}/json/new?about:blank`, "PUT");
    const client = cdp(target.webSocketDebuggerUrl);
    await client.opened;
    await client.send("Page.enable");
    const loaded = client.once("Page.loadEventFired");
    await client.send("Page.navigate", { url: `file:///${htmlPath.replace(/\\/g, "/")}` });
    await loaded;
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
      } catch {}
    }, 1000);
  }
}

const css = `
    .v26-atlas{background:#fffdf8;border:1px solid #d9e5df;border-radius:24px;padding:24px;margin:18px 0;break-inside:avoid}
    .v26-atlas h2{margin-top:0;color:#123244}
    .v26-atlas h3{margin:0 0 8px;color:#123244}
    .v26-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0}
    .v26-card{border:1px solid #dbe6e1;border-radius:16px;background:#fbfdfb;padding:14px;break-inside:avoid;page-break-inside:avoid}
    .v26-card p{margin:7px 0;font-size:12.5px;line-height:1.45}
    .v26-flow{background:#10202b;color:#edf8f3;border-radius:13px;padding:11px;margin:8px 0;font-family:"Consolas","Courier New",monospace;font-size:10.8px;line-height:1.38;white-space:pre-wrap}
    .v26-trap{border-left:5px solid #c34a42;background:#fff0ee;border-radius:12px;padding:10px 12px;margin:10px 0;font-size:12.4px}
    .v26-life{border-left:5px solid #367a99;background:#edf7fb;border-radius:12px;padding:10px 12px;margin:10px 0;font-size:12.4px}
    .v26-table{width:100%;border-collapse:collapse;font-size:11.7px;line-height:1.35;margin:10px 0}
    .v26-table th,.v26-table td{border:1px solid #e2e9e4;padding:7px;vertical-align:top}
    .v26-table th{background:#f4faf7;text-align:left}
    @media print{.v26-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v26-flow{font-size:9.8px}.v26-card p{font-size:11.6px}}
`;

const section = `
  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Оновлення v26 / ЄФВВ Technology після розбору помилок</div>
      <h2>🧭 Карта тем, які тест 2024/2026 реально зачіпає</h2>
      <p>Цей додаток не замінює основні блоки, а закриває “дірки”, які проявилися в тесті: UML, IEEE 754, реляційна алгебра, графи, системний аналіз, OSI, патерни, JIT, підмережі, ML і похідні. Читати краще як карту пасток: питання → схема → чому правильний варіант саме такий.</p>
      <table class="v26-table">
        <thead><tr><th>Зона</th><th>Що питають</th><th>Як не плутати</th></tr></thead>
        <tbody>
          <tr><td>Числа / IEEE 754</td><td>порядок, bias 127, нормалізація</td><td>спочатку рухаємо кому до 1.x, рахуємо справжній порядок p, лише потім p+127</td></tr>
          <tr><td>БД</td><td>атомарність, індекси, SQL WHERE, реляційна алгебра</td><td>рядки = кортежі, стовпці = атрибути, π вибирає стовпці, σ фільтрує рядки</td></tr>
          <tr><td>Графи</td><td>маршрутна матриця, планарність, AVL/BST</td><td>матриця суміжності = пряме ребро, маршрутна = шлях існує; AVL = баланс висот ≤ 1</td></tr>
          <tr><td>ML/AI</td><td>sigmoid, kNN, SVM, IoU, навчання нейромережі</td><td>класифікація = клас, регресія = число, навчання НМ = зміна ваг</td></tr>
          <tr><td>Мережі/безпека</td><td>OSI, пакети/кадри, subnet, DDoS, CIA/DAD</td><td>L2 frame/MAC/switch, L3 packet/IP/router, DDoS б’є по availability</td></tr>
          <tr><td>Парадигми/SE</td><td>процедурне, функціональне, ООП, Bridge, JIT, waterfall</td><td>процедурне = кроки й функції; ООП = об’єкти; functional = чисті перетворення</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">IT / числа і математика</div>
      <h2>🔢 IEEE 754, порядок, похідні, ймовірність</h2>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>Порядок числа з рухомою комою</h3>
          <div class="v26-flow">A₂ = 1011,01₂

1) Нормалізуємо:
   1011,01₂ = 1,01101₂ × 2³

2) Порядок = 3

3) Якщо питають поле exponent IEEE 754:
   bias = 127
   exponent_field = 3 + 127 = 130 = 10000010₂</div>
          <p><b>Науково:</b> порядок показує, на який степінь двійки множиться мантиса. У форматі IEEE 754 у полі exponent зберігається не сам порядок, а зміщене значення.</p>
          <div class="v26-trap"><b>⚠️ Пастка:</b> “порядок” і “зміщений порядок/характеристика” не одне й те саме. Для 1011,01₂ порядок 3, а в полі exponent буде 130.</div>
        </article>
        <article class="v26-card">
          <h3>Похідна як швидкість зміни</h3>
          <div class="v26-flow">lim Δx→0 ((x+Δx)³ - x³) / Δx
= похідна від x³
= 3x²

y = 1 - e^(-a x)
y' = 0 - e^(-a x)·(-a)
y' = a·e^(-a x)</div>
          <p><b>Навіщо в IT:</b> похідні потрібні в ML для градієнтного спуску: модель змінює ваги в напрямку, де помилка зменшується.</p>
          <div class="v26-life"><b>🏠 Аналогія:</b> похідна — це нахил дороги. Якщо нахил великий, значення змінюється швидко; якщо нуль — стаціонарна точка.</div>
        </article>
        <article class="v26-card">
          <h3>Комбінаторика й імовірність у Technology</h3>
          <div class="v26-flow">5 різних елементів у масиві:
порядок важливий -> 5! = 120

20 деталей, 4 браковані:
стандартних = 20 - 4 = 16
P(стандартна) = 16/20 = 0,8</div>
          <p><b>Маркер:</b> “розташування” майже завжди означає порядок, тобто перестановки. “Ймовірність” = сприятливі / усі.</p>
        </article>
        <article class="v26-card">
          <h3>Стаціонарні точки функції двох змінних</h3>
          <div class="v26-flow">f(x,y) = -x³ + 4xy - 2y² + 1

1) fx = -3x² + 4y = 0
2) fy = 4x - 4y = 0 -> y = x
3) -3x² + 4x = 0
   x( -3x + 4 ) = 0
   x = 0 або x = 4/3

точки: (0,0), (4/3,4/3)</div>
          <p><b>Пастка:</b> для двох змінних треба обнулити обидві частинні похідні, а не тільки одну.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">IT / бази даних</div>
      <h2>🗄️ Реляційна алгебра, індекси, моделі даних</h2>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>Реляційна алгебра “Кіт”</h3>
          <div class="v26-flow">Є дві таблиці: CatsA і CatsB
Однаковий запис = збігаються всі атрибути

Потрібні коти, які є лише в одній таблиці:
(CatsA - CatsB) ∪ (CatsB - CatsA)

Потрібно тільки ім’я:
π name ( (CatsA - CatsB) ∪ (CatsB - CatsA) )</div>
          <p><b>Позначення:</b> σ — відібрати рядки; π — залишити стовпці; ∪ — об’єднати; ∩ — спільні; − — різниця.</p>
          <div class="v26-life"><b>🏠 Аналогія:</b> два списки гостей. Викреслюємо тих, хто є в обох списках, а з решти виписуємо лише імена.</div>
        </article>
        <article class="v26-card">
          <h3>Індекс для WHERE</h3>
          <div class="v26-flow">SELECT ...
FROM Customers
WHERE email_address LIKE 'Alex%'
GROUP BY ...
ORDER BY City;

Індекс потрібен на:
email_address</div>
          <p><b>Правило:</b> індекс створюють на полі, за яким шукають або фільтрують. GROUP BY/ORDER BY теж можуть виграти від індексів, але в цьому питанні ключове слово — WHERE.</p>
          <div class="v26-trap"><b>⚠️ Пастка:</b> якщо є WHERE, GROUP BY і ORDER BY, не поспішай обирати останній видимий стовпець. Спитай: “де саме умова відбору?”</div>
        </article>
        <article class="v26-card">
          <h3>Моделі даних</h3>
          <div class="v26-flow">концептуальна -> сутності бізнесу
  "Кіт", "Власник", "Візит"

логічна -> таблиці, ключі, нормалізація
  Cats(id, name, sex, age)

фізична -> як це зберігає конкретна СУБД
  індекси, типи, сторінки, файли</div>
          <p><b>Запам’ятати:</b> нормалізація таблиць — це логічна модель. ER-діаграма часто належить до концептуального/логічного опису, але “нормалізація таблиць” тягне до логічного рівня.</p>
        </article>
        <article class="v26-card">
          <h3>Вимога реляційної моделі</h3>
          <div class="v26-flow">таблиця = відношення
рядок = кортеж
стовпець = атрибут
комірка = атомарне значення</div>
          <p><b>Атомарність:</b> у комірці має бути одне неподільне значення. Не “Оля, Петро, Іра” в одному полі, а окремі рядки/зв’язки.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">IT / графи й алгоритми</div>
      <h2>🌳 Графи, дерева, складність, сортування</h2>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>Матриці графа</h3>
          <div class="v26-flow">Матриця суміжності:
M[i,j] = 1, якщо є пряме ребро i -> j

Маршрутна матриця:
R[i,j] = 1, якщо існує шлях i ... j

Планарний граф:
можна намалювати без перетину ребер</div>
          <p><b>Пастка:</b> “суміжність” = сусіди прямо зараз. “Маршрут” = можна дістатися, навіть через проміжні вершини.</p>
        </article>
        <article class="v26-card">
          <h3>BST, AVL, двобічний список</h3>
          <div class="v26-flow">BST:
ліворуч менші ключі, праворуч більші

AVL:
BST + баланс висот
|height(left) - height(right)| ≤ 1

Doubly linked list:
prev <- node -> next</div>
          <p><b>Запам’ятати:</b> AVL питають через “відрізняються за висотою щонайбільше на 1”. Двобічний список питають через можливість руху вперед і назад.</p>
        </article>
        <article class="v26-card">
          <h3>Складність і сортування</h3>
          <div class="v26-flow">O(n): n = кількість вхідних даних

Merge sort:
worst case O(n log n)

Quick sort:
обрати pivot
менші -> ліворуч
більші -> праворуч</div>
          <p><b>Пастка:</b> quicksort теж часто O(n log n), але в найгіршому може бути O(n²). Якщо питають “найгірший гарантований n log n” серед простих варіантів — це merge sort.</p>
        </article>
                <article class="v26-card wide">
          <h3>🧮 Сортування: повна карта для тесту</h3>
          <div class="v26-flow">Як читати складність:
log n     -> щоразу ділимо простір пошуку навпіл
n         -> один повний прохід по всіх елементах
n log n   -> log n рівнів, на кожному рівні торкаємось n елементів
n^2       -> багато попарних порівнянь, часто вкладені цикли

Bubble sort:
порівнює сусідів і міняє їх місцями; великі значення "спливають" у кінець
best O(n), average/worst O(n^2), stable, memory O(1)

Selection sort:
щоразу шукає мінімум і ставить його на наступну фіксовану позицію
best/average/worst O(n^2), usually not stable, memory O(1)

Insertion sort:
бере наступний елемент і вставляє його в уже відсортовану ліву частину
best O(n), average/worst O(n^2), stable, memory O(1)

Merge sort:
ділить масив навпіл, потім зливає вже відсортовані половини
best/average/worst O(n log n), stable, memory O(n)

Quick sort:
обирає pivot і робить partition: менші ліворуч, більші праворуч
best/average O(n log n), worst O(n^2), usually not stable, memory O(log n)

Heap sort:
будує binary heap і багато разів дістає max/min
best/average/worst O(n log n), not stable, memory O(1)</div>
          <p><b>🧠 Як обрати в тесті:</b> якщо питають гарантоване <code>O(n log n)</code> у найгіршому випадку серед класичних сортувань — думати про <b>Merge Sort</b> або <b>Heap Sort</b>. Якщо в умові є <b>pivot</b>, <b>partition</b>, “менші ліворуч, більші праворуч” — це <b>Quick Sort</b>. Якщо елемент вставляють у вже відсортовану ліву частину — <b>Insertion Sort</b>. Якщо щоразу шукають мінімум — <b>Selection Sort</b>. Якщо міняють місцями сусідні елементи — <b>Bubble Sort</b>.</p>
          <p><b>🏠 Асоціація:</b> insertion — як вставляти карти в руці у правильне місце; selection — щоразу вибирати найменшу книжку з купи; bubble — сусіди міняються місцями, поки найбільший не доїде в кінець; merge — розкласти документи на маленькі стопки й зливати їх; quick — вибрати опорний документ і розкидати решту ліворуч/праворуч.</p>
          <table class="v26-table">
            <tr><th>Алгоритм</th><th>Best</th><th>Average</th><th>Worst</th><th>Stable?</th><th>Пам'ять</th><th>Ключова ознака</th></tr>
            <tr><td>Bubble</td><td>O(n)</td><td>O(n^2)</td><td>O(n^2)</td><td>так</td><td>O(1)</td><td>сусідні обміни</td></tr>
            <tr><td>Selection</td><td>O(n^2)</td><td>O(n^2)</td><td>O(n^2)</td><td>зазвичай ні</td><td>O(1)</td><td>пошук мінімуму</td></tr>
            <tr><td>Insertion</td><td>O(n)</td><td>O(n^2)</td><td>O(n^2)</td><td>так</td><td>O(1)</td><td>вставка в sorted-left</td></tr>
            <tr><td>Merge</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>так</td><td>O(n)</td><td>divide + merge</td></tr>
            <tr><td>Quick</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n^2)</td><td>зазвичай ні</td><td>O(log n)</td><td>pivot + partition</td></tr>
            <tr><td>Heap</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n log n)</td><td>ні</td><td>O(1)</td><td>binary heap</td></tr>
            <tr><td>Counting</td><td>O(n+k)</td><td>O(n+k)</td><td>O(n+k)</td><td>може бути так</td><td>O(k)</td><td>лічильники значень</td></tr>
            <tr><td>Radix</td><td>O(d(n+k))</td><td>O(d(n+k))</td><td>O(d(n+k))</td><td>так, якщо stable pass</td><td>O(n+k)</td><td>по розрядах</td></tr>
          </table>
        </article>
        <article class="v26-card">
          <h3>Типи алгоритмічних задач</h3>
          <div class="v26-flow">пошук -> знайти елемент
сортування -> впорядкувати
графи -> шлях, досяжність, зв’язність
оптимізація -> найкращий варіант
динамічне програмування -> підзадачі + пам’ять
NP-hard/складні -> рюкзак, комівояжер</div>
          <p><b>Для тесту:</b> якщо питають “найкращий набір за обмеженням” — думай про оптимізацію/рюкзак. Якщо “найкоротший шлях” — графи.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">IT / мережі, архітектура, безпека</div>
      <h2>🌐 OSI, subnet, backbone, Harvard, CIA/DAD</h2>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>OSI і PDU</h3>
          <div class="v26-flow">L2 Data Link:
frame + MAC + switch

L3 Network:
packet + IP + router

L4 Transport:
segment/datagram + TCP/UDP

Сусідні рівні взаємодіють через сервіси/інтерфейси.
Однакові рівні різних систем — через протоколи.</div>
          <p><b>Пастка:</b> “між сусідніми рівнями” — це не протокол, а сервіс/інтерфейс. Протокол — між однойменними рівнями на різних машинах.</p>
        </article>
        <article class="v26-card">
          <h3>Підмережі</h3>
          <div class="v26-flow">Адрес у підмережі:
2^(32-prefix)

Придатних хостів:
2^(32-prefix) - 2

/26 -> 64 адреси, 62 хости
/25 -> 128 адрес, 126 хостів

Якщо треба розмістити 64 вузли:
/26 не вистачає придатних хостів
потрібно /25 = 255.255.255.128</div>
          <p><b>Пастка:</b> “64 вузли” не дорівнює “64 адреси”, бо network і broadcast забирають 2 адреси.</p>
        </article>
        <article class="v26-card">
          <h3>Архітектура комп’ютера</h3>
          <div class="v26-flow">Фон Неймана:
команди й дані в одній пам’яті

Гарвардська:
пам’ять команд окремо
пам’ять даних окремо

JIT:
байт-код/проміжний код
-> компіляція гарячих ділянок під час виконання</div>
          <p><b>Аналогія:</b> Гарвардська архітектура — окрема полиця для рецептів і окрема для продуктів. JIT — перекладач, який під час розмови запам’ятовує часті фрази.</p>
        </article>
        <article class="v26-card">
          <h3>Безпека</h3>
          <div class="v26-flow">CIA:
Confidentiality -> не розкривати
Integrity       -> не змінювати
Availability    -> не блокувати

DAD:
Disclosure -> розкриття
Alteration -> зміна
Denial     -> відмова/блокування

DDoS -> Availability</div>
          <p><b>Нормативні “зубчики”:</b> “особливої важливості” → 30 років. Це не логічна задача, а факт для запам’ятовування.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">IT / ML, системи, UML, парадигми</div>
      <h2>🤖 ML, системний аналіз, UML, патерни, парадигми</h2>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>ML-маркери</h3>
          <div class="v26-flow">sigmoid:
f(x)=1/(1+e^(-cx)) -> 0..1

kNN:
supervised, якщо є мітки класів

SVM:
гіперплощина + максимальний margin

IoU:
intersection / union для сегментації

навчання нейромережі:
зміна вагових коефіцієнтів</div>
          <p><b>Пастка:</b> “розбити на train/test” — це підготовка експерименту, але не саме навчання нейромережі.</p>
        </article>
        <article class="v26-card">
          <h3>Системний аналіз</h3>
          <div class="v26-flow">еквіфінальність:
різні початкові стани -> один фінал

проблема:
небажаний стан + немає готового засобу вирішення

SI infection model:
S = susceptible
I = infected
усього 2 стани

нестаціонарна без пам’яті:
y(t)=a(t)x(t)</div>
          <p><b>Пастка:</b> якщо є x(t-1) або інтеграл — система має пам’ять. Якщо параметр залежить від t — нестаціонарна.</p>
        </article>
        <article class="v26-card">
          <h3>UML і патерни</h3>
          <div class="v26-flow">Class diagram:
класи, поля, методи, зв’язки

Sequence diagram:
повідомлення між об’єктами в часі

Bridge:
structural pattern

Singleton / Builder / Prototype:
creational patterns</div>
          <p><b>Bridge:</b> розділяє абстракцію і реалізацію, щоб вони змінювалися незалежно. Наприклад, RemoteControl і Device.</p>
        </article>
        <article class="v26-card">
          <h3>Парадигми програмування</h3>
          <div class="v26-flow">Процедурне:
функції + дані + послідовні кроки

ООП:
об’єкти = стан + методи
інкапсуляція, наслідування, поліморфізм

Функціональне:
чисті функції, композиція, мінімум побічних ефектів

Подієве:
події + обробники</div>
          <p><b>Аналогія:</b> процедурне — рецепт; ООП — кавомашина з кнопками; функціональне — формули; подієве — “натиснули кнопку → спрацювала дія”.</p>
        </article>
      </div>
    </div>
  </section>
`;

const v28Section = `
  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Оновлення v28 / ЄВІ + ЄФВВ 2026 / синхронізація з тренажером</div>
      <h2>🧭 Як читати цю версію</h2>
      <p><b>v28</b> повертає повний навчальний формат: схеми, пояснення, приклади з життя, пастки й код. Це не коротка шпаргалка v27 на 24 сторінки, а розширений посібник на базі повної v26-версії, синхронізований з актуальним банком питань <b>3.6-efvv-2026-it-v27-tracing-lite</b>.</p>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>✅ Що актуально в тестах</h3>
          <div class="v26-flow">IT / Computer Science:
3 варіанти × 140 питань
10 блоків × 14 питань

TZNK:
логіка, комбінаторика, відсотки,
умови, обмеження, пастки "або/і"

English:
reading, grammar patterns,
connectors, tenses, conditionals</div>
          <p>Посібник читається як карта помилок: знайшов слабке місце в тесті → відкрив відповідний блок → розібрав схему → пройшов mini-drill.</p>
        </article>
        <article class="v26-card">
          <h3>🧮 Про задачі з x, y, z, i</h3>
          <div class="v26-flow">Було неправильно:
забагато задач на ручне трасування змінних.

Тепер:
1 mixed trace task на IT-варіант.

Формат:
дано x/y/z або a/b/c
є цикл for i
є додавання + множення
треба вести таблицю станів</div>
          <div class="v26-trap"><b>⚠️ Головна пастка:</b> це не має забивати тест. Такі задачі перевіряють уважність до порядку виконання коду, але основний бал у ЄФВВ IT дають теорія, поняття, алгоритми, БД, мережі, безпека, ООП, ML і системне мислення.</div>
        </article>
        <article class="v26-card">
          <h3>🧩 Як розбирати trace, якщо все пливе</h3>
          <div class="v26-flow">x = 2, y = 3, z = 1

for i = 1..3:
    z = z + x
    x = x + y
    y = y * 2

таблиця:
i | x  | y  | z
0 | 2  | 3  | 1
1 | 5  | 6  | 3
2 | 11 | 12 | 8
3 | 23 | 24 | 19</div>
          <p><b>Правило:</b> кожен наступний рядок бере вже оновлені значення. Не тримати все в голові. Таблиця - це не “дитячий спосіб”, а нормальна техніка трасування.</p>
        </article>
        <article class="v26-card">
          <h3>🗂️ Що лишається головним</h3>
          <div class="v26-flow">1) впізнати поняття
2) відрізнити близькі терміни
3) побачити пастку у формулюванні
4) знати базові формули
5) не переносити правило з однієї теми в іншу</div>
          <p>Наприклад: DDoS б'є по availability, Bridge - structural pattern, kNN - supervised learning, GRANT дає права, індекс під WHERE створюють на полі умови, subnet mask рахується від потрібної кількості вузлів.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Оновлення v28 / швидка карта блоків</div>
      <h2>🗺️ Що саме треба закрити перед наступною симуляцією</h2>
      <table class="v26-table">
        <thead><tr><th>Блок</th><th>Що впізнавати</th><th>На чому ловлять</th></tr></thead>
        <tbody>
          <tr><td>Algorithms</td><td>Big-O, сортування, quick/merge/heap, BST/AVL, графи</td><td>плутають best/average/worst, planar graph, AVL vs просте BST</td></tr>
          <tr><td>Architecture</td><td>bit/byte, signed/unsigned, IEEE 754, compiler/interpreter/linker/JIT</td><td>10000000 не 256 у 8 бітах; порядок і biased exponent різні</td></tr>
          <tr><td>Databases</td><td>relational model, atomic attributes, indexes, SQL WHERE, relational algebra</td><td>індекс ставлять під WHERE, symmetric difference = записи лише в одній таблиці</td></tr>
          <tr><td>Software Engineering</td><td>UML, SDLC, Agile/waterfall, testing, patterns</td><td>Bridge structural; Singleton/Builder/Prototype creational</td></tr>
          <tr><td>Cybersecurity</td><td>CIA/DAD, DDoS, hash, access control, secret labels</td><td>DDoS = availability, hash не розшифровують, DAD протилежне CIA</td></tr>
          <tr><td>Math for IT</td><td>похідні, стаціонарні точки, probability, sets, implication</td><td>похідна e^(-ax), P→Q хибне тільки P true і Q false</td></tr>
          <tr><td>Networks</td><td>OSI, switch/router, packets/frames/segments, subnet mask, DNS/DHCP/TCP/UDP</td><td>L2 frame/MAC/switch, L3 packet/IP/router, 64 hosts -> /25 mask 255.255.255.128</td></tr>
          <tr><td>Operating Systems</td><td>process/thread, scheduler, deadlock, mutex/semaphore, paging, kernel/user</td><td>mutex один доступ, semaphore кілька; deadlock = взаємне очікування</td></tr>
          <tr><td>Programming</td><td>procedural/OOP/functional, class/object, interface/realization, recursion</td><td>procedural = functions + data; OOP = class/object; realization = implements</td></tr>
          <tr><td>AI / ML</td><td>kNN, SVM, sigmoid/RBF, NN training, overfitting, IoU</td><td>training NN = changing weights; IoU для segmentation; sigmoid = 1/(1+e^-x)</td></tr>
        </tbody>
      </table>
      <div class="v26-life"><b>🏠 Як вчитись:</b> якщо питання завалилося, не просто дивитися правильну літеру. Записати пару плутанини: “я переплутала індекс із GROUP BY”, “я взяла final x замість z”, “я прийняла Bridge за creational”. Саме ці пари потім закриваються найшвидше.</div>
    </div>
  </section>
`;

const v28Appendix = `
  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Додаток v28 / робота над помилками</div>
      <h2>🧯 Якщо знову “все знаю, але в тесті плутаю”</h2>
      <p>Це нормальна ситуація для ЄФВВ: тест часто перевіряє не “чи читали тему”, а чи можна відрізнити близькі поняття під тиском часу. Тому нижче - не нова теорія, а карта швидкого розплутування.</p>
      <table class="v26-table">
        <thead><tr><th>Як виглядає помилка</th><th>Що насправді тренувати</th><th>Міні-дія</th></tr></thead>
        <tbody>
          <tr><td>“Я знала тему, але обрала схоже слово”</td><td>пари понять</td><td>виписати X ≠ Y: compiler ≠ linker, frame ≠ packet, class ≠ object</td></tr>
          <tr><td>“Я порахувала не те число”</td><td>таблиця станів або формула</td><td>підписати, що питають: final z, кількість варіантів, ймовірність, порядок</td></tr>
          <tr><td>“Я взяла занадто категоричну відповідь”</td><td>логіка формулювання</td><td>шукати слова: всі, жоден, лише, обов'язково, може</td></tr>
          <tr><td>“Я переплутала рівень мережі”</td><td>OSI-адресація</td><td>L2 = MAC/frame/switch; L3 = IP/packet/router; L4 = TCP/UDP/segment</td></tr>
          <tr><td>“Я не впізнала ML-термін”</td><td>тип задачі</td><td>classification = клас, regression = число, clustering = групи без міток</td></tr>
        </tbody>
      </table>
      <div class="v26-life"><b>🏠 Побутова аналогія:</b> тест як сортування ключів. Якщо ключі схожі, не треба сильніше тиснути на двері. Треба подивитися на форму зубців: яку саме ознаку питає умова.</div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Додаток v28 / мінімум перед симуляцією</div>
      <h2>⏱️ 30-хвилинний прогрів перед IT-варіантом</h2>
      <div class="v26-grid">
        <article class="v26-card">
          <h3>0-7 хв: формули й числа</h3>
          <div class="v26-flow">2^8 = 256
unsigned byte: 0..255
signed byte: -128..127
IEEE exponent = order + 127
probability = good / total
O(n log n): merge, heap, average quick</div>
        </article>
        <article class="v26-card">
          <h3>7-15 хв: мережі й безпека</h3>
          <div class="v26-flow">DNS -> name to IP
DHCP -> gives IP settings
TCP -> reliable ordered delivery
UDP -> faster, no guarantee
DDoS -> availability
hash -> fingerprint, not decryption</div>
        </article>
        <article class="v26-card">
          <h3>15-23 хв: БД і SQL</h3>
          <div class="v26-flow">WHERE -> filters rows
GROUP BY -> groups rows
HAVING -> filters groups
JOIN -> connects tables
GRANT -> access rights
index -> speeds search by selected field</div>
        </article>
        <article class="v26-card">
          <h3>23-30 хв: OOP / SE / ML</h3>
          <div class="v26-flow">class -> template
object -> instance
inheritance -> is-a
composition -> has-a
Bridge -> structural
kNN -> supervised
NN training -> changing weights</div>
        </article>
      </div>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Додаток v28 / контроль плутанини</div>
      <h2>🧠 Пари, які треба розрізняти автоматично</h2>
      <table class="v26-table">
        <thead><tr><th>Не плутати</th><th>Перше</th><th>Друге</th></tr></thead>
        <tbody>
          <tr><td>compiler / interpreter</td><td>перетворює програму в машинний/об'єктний код до виконання</td><td>виконує код рядок за рядком або через власний runtime</td></tr>
          <tr><td>linker / compiler</td><td>збирає об'єктні модулі в виконуваний файл</td><td>перекладає вихідний код у нижчий рівень</td></tr>
          <tr><td>frame / packet / segment</td><td>frame = L2</td><td>packet = L3, segment = L4</td></tr>
          <tr><td>index / key</td><td>index прискорює пошук</td><td>key ідентифікує або зв'язує записи</td></tr>
          <tr><td>hash / encryption</td><td>hash односторонній відбиток</td><td>encryption можна розшифрувати ключем</td></tr>
          <tr><td>inheritance / realization</td><td>inheritance = успадкування класу</td><td>realization = клас реалізує interface</td></tr>
          <tr><td>classification / regression</td><td>категорія</td><td>числове значення</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="section page-break">
    <div class="module v26-atlas">
      <div class="kicker">Додаток v28 / як проходити варіанти</div>
      <h2>🎯 Стратегія на 140 IT-питань</h2>
      <div class="v26-flow">1) Спершу забрати легку теорію.
2) Не зависати на обчисленнях довше 90 секунд.
3) У задачах на код одразу малювати таблицю.
4) У БД шукати ключові слова WHERE / JOIN / GRANT / ACID.
5) У мережах визначити рівень OSI.
6) У ML визначити: клас, число, група, межа, ваги.
7) Після тесту виписати не всі помилки, а 7-10 пар плутанини.</div>
      <p><b>Фокус:</b> мета не вивчити всю інформатику як університетський курс. Мета - стабільно впізнавати екзаменаційні патерни й не віддавати бали на пастках формулювання.</p>
    </div>
  </section>
`;

async function main() {
  let html = fs.readFileSync(inHtml, "utf8");
  html = html
    .replace(/Master Prep Exam Teaching Guide v25/g, "Master Prep Exam Teaching Guide v26")
    .replace(/Master Prep Exam Guide v25/g, "Master Prep Exam Guide v26")
    .replace(/Версія v25/g, "Версія v26")
    .replace(/Оновлення v25/g, "Оновлення v25/v26")
    .replace(/v25 карти всіх блоків/g, "v25 карти всіх блоків + v26 ЄФВВ Technology");

  html = html
    .replace(/<title>Master Prep Exam Teaching Guide v26<\/title>/, "<title>Master Prep Exam Teaching Guide v28</title>")
    .replace(/Master Prep Exam Teaching Guide v26/g, "Master Prep Exam Teaching Guide v28")
    .replace(/Master Prep Exam Guide v26/g, "Master Prep Exam Guide v28")
    .replace(/master_prep_exam_guide_v26_efvv_technology/g, "master_prep_exam_guide_v28_efvv_2026_full");

  html = html.replace("</body>", `${v28Section}\n${v28Appendix}\n</body>`);
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
