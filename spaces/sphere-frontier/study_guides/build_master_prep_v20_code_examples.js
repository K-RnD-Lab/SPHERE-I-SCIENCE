const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v19_schema_atlas.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v20_schema_code_atlas.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v20_schema_code_atlas.pdf");

const printFixCss = `
    /* v20: PDF print fix. CSS grids can jump to the next page and leave a blank header page. */
    @media print{
      .schema-grid,.schema-columns{display:block!important}
      .schema-card,.schema-mini{break-inside:auto!important;page-break-inside:auto!important;margin:0 0 12px!important}
      .schema-atlas{page-break-inside:auto!important}
      .schema-box{font-size:10.5px!important;line-height:1.38!important}
      .code-lab{page-break-inside:auto!important}
      .code-lab .schema-card{page-break-inside:avoid!important}
    }
`;

const codeExamples = `
  <section class="section page-break">
    <div class="module schema-atlas code-lab">
      <div class="kicker">Схеми IT / код як мікроскоп</div>
      <h2>🧪 Код-вставки: побачити поняття руками</h2>
      <p>Код тут не для зубріння синтаксису. Він показує, що саме означає поняття в тестах: де клас, де об'єкт, де інкапсуляція, де наслідування, де поліморфізм, і чому це не одне й те саме.</p>
      <div class="schema-grid">
        <div class="schema-card">
          <h3>☕ Java OOP: class, object, encapsulation</h3>
          <pre class="schema-box"><code>// class = креслення для майбутніх об'єктів
class BankAccount {
  // private = інкапсуляція: баланс не можна змінити напряму ззовні
  private int balance;

  // constructor = як створюється конкретний object
  BankAccount(int startBalance) {
    balance = startBalance;
  }

  // public method = контрольований спосіб взаємодії
  void deposit(int amount) {
    if (amount > 0) balance += amount;
  }

  int getBalance() {
    return balance;
  }
}

BankAccount acc = new BankAccount(100); // object / екземпляр
acc.deposit(50);
System.out.println(acc.getBalance()); // 150</code></pre>
          <div class="schema-note"><b>🔬 Науково:</b> клас описує структуру і поведінку, об'єкт є конкретним екземпляром цього опису. Інкапсуляція ховає внутрішній стан і дозволяє змінювати його тільки через методи.</div>
          <div class="schema-note life"><b>🏠 Аналогія:</b> банківський рахунок не дає просто написати “баланс = мільйон”. Є каса/додаток/операція, яка перевіряє правила.</div>
          <div class="schema-note trap"><b>⚠️ Пастка:</b> private не означає “даних немає”. Дані є, але доступ до них контрольований.</div>
        </div>

        <div class="schema-card">
          <h3>☕ Java OOP: inheritance + polymorphism</h3>
          <pre class="schema-box"><code>// superclass = спільний тип
abstract class Device {
  abstract void volumeUp();
}

// inheritance: Phone IS-A Device
class Phone extends Device {
  @Override
  void volumeUp() {
    System.out.println("Phone: louder ringtone");
  }
}

// inheritance: Laptop IS-A Device
class Laptop extends Device {
  @Override
  void volumeUp() {
    System.out.println("Laptop: louder speakers");
  }
}

Device a = new Phone();
Device b = new Laptop();

a.volumeUp(); // той самий виклик, інша реакція
b.volumeUp(); // це polymorphism</code></pre>
          <div class="schema-note"><b>🔬 Науково:</b> наслідування описує відношення “is-a”, а поліморфізм дозволяє викликати один метод через спільний тип і отримувати різну реалізацію.</div>
          <div class="schema-note life"><b>🏠 Аналогія:</b> кнопка гучності однакова, але телефон змінює дзвінок, ноутбук - динаміки, плеєр - навушники.</div>
          <div class="schema-note trap"><b>⚠️ Пастка:</b> якщо об'єкт просто “має” інший об'єкт, це не inheritance, а composition.</div>
        </div>

        <div class="schema-card">
          <h3>☕ Composition: has-a, не is-a</h3>
          <pre class="schema-box"><code>class Engine {
  void start() {
    System.out.println("engine starts");
  }
}

class Car {
  // Car HAS-A Engine: машина має двигун
  private Engine engine = new Engine();

  void drive() {
    engine.start();
    System.out.println("car moves");
  }
}</code></pre>
          <div class="schema-note"><b>🔬 Науково:</b> композиція означає, що один об'єкт складається з інших. Це часто краща модель, ніж наслідування, якщо немає відношення “є різновидом”.</div>
          <div class="schema-note trap"><b>⚠️ Пастка:</b> Car is Engine - неправда. Car has Engine - правда.</div>
        </div>

        <div class="schema-card">
          <h3>📈 Алгоритм: binary search працює тільки на sorted array</h3>
          <pre class="schema-box"><code>int[] a = {2, 5, 9, 14, 20}; // sorted
int target = 14;
int left = 0, right = a.length - 1;

while (left <= right) {
  int mid = (left + right) / 2;

  if (a[mid] == target) {
    System.out.println("found");
    break;
  } else if (a[mid] < target) {
    left = mid + 1;   // шукаємо правіше
  } else {
    right = mid - 1;  // шукаємо лівіше
  }
}</code></pre>
          <div class="schema-note"><b>🔬 Науково:</b> binary search кожним кроком відкидає половину простору пошуку, тому має O(log n), але лише коли дані впорядковані.</div>
          <div class="schema-note trap"><b>⚠️ Пастка:</b> binary search не має стосунку до binary number system, окрім слова “binary”.</div>
        </div>

        <div class="schema-card">
          <h3>🗄️ SQL: WHERE, GROUP BY, HAVING, GRANT</h3>
          <pre class="schema-box"><code>-- WHERE фільтрує рядки ДО групування
SELECT student_id, AVG(score) AS avg_score
FROM exam_results
WHERE subject = 'IT'
GROUP BY student_id
HAVING AVG(score) >= 70
ORDER BY avg_score DESC;

-- GRANT не читає дані, а видає право доступу
GRANT SELECT ON exam_results TO analyst;</code></pre>
          <div class="schema-note"><b>🔬 Науково:</b> SQL має різні класи команд: DQL для запитів, DML для зміни даних, DCL для прав доступу. GRANT належить до керування правами.</div>
          <div class="schema-note trap"><b>⚠️ Пастка:</b> HAVING не замінює WHERE. HAVING працює після GROUP BY і фільтрує вже групи.</div>
        </div>

        <div class="schema-card">
          <h3>🌐 Мережі: DNS → TCP → HTTP</h3>
          <pre class="schema-box"><code>1. Browser asks DNS:
   k-rnd-lab.vercel.app -> IP address

2. Browser opens TCP connection:
   client port -> server port 443

3. Browser sends HTTPS request:
   GET /trainer.html HTTP/2

4. Server returns:
   200 OK + HTML/CSS/JS</code></pre>
          <div class="schema-note"><b>🔬 Науково:</b> DNS відповідає за ім'я, TCP - за надійну доставку потоку байтів, HTTP/HTTPS - за зміст запиту і відповіді.</div>
          <div class="schema-note trap"><b>⚠️ Пастка:</b> switch, router, DNS, TCP і HTTP - це не взаємозамінні слова. Вони працюють на різних рівнях і мають різні ролі.</div>
        </div>
      </div>
    </div>
  </section>
`;

let html = fs.readFileSync(inHtml, "utf8");
html = html.replace(/v19/g, "v20");
html = html.replace(/Master Prep Exam Teaching Guide v19/g, "Master Prep Exam Teaching Guide v20");
html = html.replace(/Master Prep Exam Guide v19/g, "Master Prep Exam Guide v20");
html = html.replace("</style>", `${printFixCss}\n  </style>`);

const marker = '<section class="section page-break">\n    <div class="module schema-atlas">\n      <div class="kicker">Схеми ТЗНК / комбінаторика й логіка</div>';
const idx = html.indexOf(marker);
if (idx < 0) throw new Error("Could not find TZNK schema marker");
html = html.slice(0, idx) + codeExamples + "\n  " + html.slice(idx);

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
