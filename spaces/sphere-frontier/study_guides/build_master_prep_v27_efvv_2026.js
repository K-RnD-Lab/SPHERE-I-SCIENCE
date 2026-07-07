const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const dir = __dirname;
const bank = JSON.parse(fs.readFileSync(path.join(root, "app_data", "quiz_bank_v1.json"), "utf8"));
const outHtml = path.join(dir, "master_prep_exam_guide_v27_efvv_2026.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v27_efvv_2026.pdf");

const blocks = [
  {
    id: "01",
    key: "algorithms",
    title: "Algorithms and Data Structures",
    emoji: "📈",
    focus: "Big-O, sorting, search, graphs, trees, stacks/queues, classic hard tasks.",
    scheme: `ALGORITHMS
  |
  |-- complexity: O(1), O(log n), O(n), O(n log n), O(n^2)
  |-- sorting: bubble, selection, insertion, merge, quick, heap
  |-- structures: stack, queue, linked list, BST, AVL, heap
  |-- graphs: BFS, DFS, shortest path, planar graph
  |-- task types: search, sort, optimization, dynamic programming`,
    science:
      "An algorithm is a finite procedure for solving a task. Complexity estimates how the number of operations grows when input size n grows. Tests often ask not for exact time in seconds, but for the growth class.",
    analogy:
      "Sorting papers: bubble swaps neighbours, selection chooses the smallest pile item, insertion places a new card into a sorted hand, merge splits piles and merges them, quick chooses a pivot and sends papers left/right.",
    traps: [
      "Binary search needs sorted data.",
      "Quick sort is often O(n log n), but worst case can be O(n^2).",
      "Merge sort has guaranteed O(n log n), but needs extra O(n) memory.",
      "Stack is LIFO, queue is FIFO.",
      "AVL is not just any BST; it is height-balanced.",
    ],
    drill: [
      "If the prompt says pivot/partition -> Quick Sort.",
      "If it says merge sorted halves -> Merge Sort.",
      "If it says repeatedly find minimum -> Selection Sort.",
      "If it says insert into sorted-left -> Insertion Sort.",
    ],
  },
  {
    id: "02",
    key: "architecture",
    title: "Computer Architecture and Data Representation",
    emoji: "💻",
    focus: "CPU, cache, RAM/ROM, compiler/interpreter/linker/JIT, binary, signed/unsigned, IEEE 754.",
    scheme: `COMPUTER DATA
  |
  |-- bit: 0 or 1
  |-- byte: 8 bits
  |-- unsigned: all combinations are non-negative
  |-- signed: first bit helps encode negative values
  |-- floating point: sign + exponent + mantissa`,
    science:
      "The same bits can mean different values depending on the type. 11111111 can be 255 as unsigned 8-bit, but -1 as signed two's complement. The CPU follows the instruction and type context; it does not guess meaning by itself.",
    analogy:
      "The same text '01.02' can mean February 1 in a date or 1 minute 2 seconds in sport. Bits are the same; context gives meaning.",
    traps: [
      "10000000 in 8 bits is 128 unsigned, but -128 signed.",
      "256 needs 9 bits: 1 0000 0000.",
      "IEEE 754 exponent stores biased exponent, not the raw order.",
      "Compiler, interpreter, linker and JIT are different stages/tools.",
    ],
    drill: [
      "1011.01₂ = 1.01101₂ * 2^3, so raw order is 3.",
      "For IEEE single precision exponent field: order + 127.",
      "To get -10 in 8-bit two's complement: 00001010 -> invert 11110101 -> +1 = 11110110.",
    ],
  },
  {
    id: "03",
    key: "databases",
    title: "Databases, SQL and Relational Algebra",
    emoji: "🗄️",
    focus: "Relational model, keys, normalization, ER, SQL clauses, indexes, GRANT, ACID, OLTP/OLAP.",
    scheme: `DATABASE THINKING
  |
  |-- conceptual model: business entities and relations
  |-- logical model: tables, keys, normalization
  |-- physical model: indexes, storage, files
  |-- SQL: SELECT/FROM/WHERE/GROUP BY/HAVING/ORDER BY
  |-- relational algebra: selection, projection, join, difference, union`,
    science:
      "Relational databases model data as relations. A row is a tuple, a column is an attribute, and atomicity means one cell should contain one indivisible value. Relational algebra is the formal language behind SQL operations.",
    analogy:
      "A library catalogue: primary key is the unique inventory number, foreign key points to another card, index is a fast lookup shelf, normalization prevents writing the same author details in every place.",
    traps: [
      "WHERE filters rows before grouping; HAVING filters groups after GROUP BY.",
      "Index usually helps on columns used in WHERE/JOIN, not randomly on every SELECT column.",
      "Only in one table means symmetric difference: (A-B) union (B-A).",
      "Projection π keeps columns; selection σ filters rows.",
    ],
    drill: [
      "Names of cats only in one table: π_name((CatsA - CatsB) ∪ (CatsB - CatsA)).",
      "WHERE email LIKE 'Alex%' -> index email_address.",
      "GRANT gives permissions.",
    ],
  },
  {
    id: "04",
    key: "software_engineering",
    title: "Software Engineering, UML and Design Patterns",
    emoji: "🧱",
    focus: "SDLC, Agile/Scrum, UML diagrams, testing, cohesion/coupling, patterns.",
    scheme: `SOFTWARE ENGINEERING
  |
  |-- lifecycle: waterfall, iterative, agile
  |-- UML structure: class diagram
  |-- UML behaviour: sequence/use case diagrams
  |-- quality: testing, cohesion, coupling
  |-- patterns: creational, structural, behavioural`,
    science:
      "Software engineering organizes development so the system can be specified, built, tested, changed and maintained. UML is a modelling language: each diagram answers a different question about the system.",
    analogy:
      "Class diagram is like a building plan; sequence diagram is like a video of people passing documents; use case diagram is like a list of who uses the service and why.",
    traps: [
      "Class diagram shows static structure; sequence diagram shows message order over time.",
      "Bridge is structural. Singleton, Builder, Prototype are creational.",
      "Unit tests check small units; integration tests check interaction.",
      "Waterfall is sequential; Agile is iterative.",
    ],
    drill: [
      "Attributes/methods/classes -> UML class diagram.",
      "Messages over time -> UML sequence diagram.",
      "Actors and goals -> UML use case diagram.",
    ],
  },
  {
    id: "05",
    key: "cybersecurity",
    title: "Cybersecurity and Cryptography",
    emoji: "🔐",
    focus: "CIA, DAD, DDoS, hashes, Ukrainian crypto standards, access control, signatures.",
    scheme: `SECURITY
  |
  |-- CIA: confidentiality, integrity, availability
  |-- attacker model: disclosure, alteration, denial
  |-- crypto: hash, symmetric, asymmetric, signature
  |-- access: MAC, DAC, RBAC
  |-- attacks: DDoS, ransomware, phishing`,
    science:
      "Information security protects data and services. Confidentiality hides information, integrity prevents unauthorized changes, availability keeps systems usable. Cryptographic hash functions create fixed-size digests and are not reversible encryption.",
    analogy:
      "CIA is a guarded archive: only allowed people read it, pages are not changed, and the archive is open when needed. DDoS attacks the third part: availability.",
    traps: [
      "DDoS attacks availability, not integrity.",
      "Kupyna is a hash function; Kalyna is a block cipher.",
      "Hashing is not encryption because it is not meant to be reversed.",
      "MAC in access control is Mandatory Access Control, not MAC address.",
    ],
    drill: [
      "CIA opposite in attacker language: DAD = Disclosure, Alteration, Denial.",
      "Digital signature checks author and integrity.",
      "RBAC gives permissions through roles.",
    ],
  },
  {
    id: "06",
    key: "math_it",
    title: "Math for IT: Logic, Derivatives, Probability, Sets",
    emoji: "📐",
    focus: "Derivative rules, stationary points, probability, combinatorics, set operations, implication.",
    scheme: `MATH IN IT TESTS
  |
  |-- derivative: rate of change, optimization, ML gradients
  |-- probability: favourable / total
  |-- combinatorics: OR=sum, AND=product, roles=arrangements, no roles=combinations
  |-- sets: union, intersection, difference, symmetric difference
  |-- logic: implication is false only when true -> false`,
    science:
      "Mathematical questions in IT tests usually check the tool, not deep theory. Derivatives support optimization and learning; probability checks risk/counting; set operations mirror database and logic operations.",
    analogy:
      "Derivative is a speedometer for a function. Probability is how many good tickets are in the box. Combinatorics is counting routes without listing all routes by hand.",
    traps: [
      "OR between disjoint choices -> add; AND sequence -> multiply.",
      "Committee/team without roles -> combinations.",
      "Chair/deputy/secretary -> arrangements because roles matter.",
      "P -> Q is false only when P is true and Q is false.",
    ],
    drill: [
      "20 details, 4 defective -> standard probability is 16/20.",
      "d/dx x^3 = 3x^2.",
      "d/dx (1 - e^(-a*x)) = a*e^(-a*x).",
    ],
  },
  {
    id: "07",
    key: "networks",
    title: "Networks, OSI, Subnets and Protocols",
    emoji: "🌐",
    focus: "OSI levels, frames/packets/segments, switch/router, ARP/DNS/DHCP, TCP/UDP, subnet masks.",
    scheme: `NETWORK STACK
  |
  |-- L2: frame, MAC, switch
  |-- L3: packet, IP, router
  |-- L4: TCP/UDP, ports
  |-- L7: HTTP, DNS, SMTP, SSH
  |-- subnet: network bits + host bits`,
    science:
      "OSI separates network communication into layers. Each layer has its own unit and responsibility. Subnetting splits an IP network into smaller address ranges, but network and broadcast addresses reduce usable hosts.",
    analogy:
      "Sending a parcel: MAC is local apartment delivery, IP is city-to-city routing, port is the office room, HTTP/DNS are the application-level services.",
    traps: [
      "Switch -> MAC/frame/L2; router -> IP/packet/L3.",
      "DNS resolves names; DHCP gives network settings.",
      "64 required hosts need more than 64 total addresses, because network and broadcast are reserved.",
      "HTTP 404 means resource not found.",
    ],
    drill: [
      "/26 gives 64 total addresses and 62 usable hosts.",
      "Need 64 usable hosts -> /25, mask 255.255.255.128.",
      "ATM backbone clue -> cell switching.",
    ],
  },
  {
    id: "08",
    key: "operating_systems",
    title: "Operating Systems",
    emoji: "🖥️",
    focus: "Processes, threads, scheduling, deadlock, mutex/semaphore, virtual memory, paging, kernel/user mode.",
    scheme: `OPERATING SYSTEM
  |
  |-- process: program instance with address space
  |-- thread: execution path inside a process
  |-- scheduler: decides who gets CPU
  |-- memory: virtual memory, paging
  |-- sync: mutex, semaphore, race condition, deadlock`,
    science:
      "An operating system manages hardware resources and gives programs safe abstractions: processes, files, memory, devices and scheduling. Many test questions ask what component is responsible for a specific job.",
    analogy:
      "OS is a building manager: gives rooms, schedules elevators, controls keys, handles device requests and prevents tenants from damaging each other.",
    traps: [
      "Process has its own address space; threads share process memory.",
      "Mutex is one-at-a-time access; semaphore can allow limited multiple access.",
      "Deadlock is circular waiting.",
      "Kernel mode has privileged access; user mode is restricted.",
    ],
    drill: [
      "Race condition -> result depends on timing/order of threads.",
      "Driver -> lets OS control hardware.",
      "Buffer -> smooths speed differences in I/O.",
    ],
  },
  {
    id: "09",
    key: "programming",
    title: "Programming Paradigms and Code Tracing",
    emoji: "🧩",
    focus: "Procedural, OOP, functional, encapsulation, inheritance, polymorphism, interfaces, recursion, tracing variables.",
    scheme: `PROGRAMMING PARADIGMS
  |
  |-- procedural: functions/procedures + data
  |-- OOP: class, object, state, methods
  |-- functional: pure functions, less mutable state
  |-- tracing: update variables step by step
  |-- recursion: function calls itself with a smaller case`,
    science:
      "Programming paradigms are ways to organize code and thinking. Procedural code emphasizes steps, OOP emphasizes objects with state and behaviour, functional programming emphasizes transformations through functions.",
    analogy:
      "Procedural is a recipe; OOP is a set of smart devices with their own buttons and state; functional is a clean pipeline where each step transforms input into output.",
    traps: [
      "Class is a template; object is a concrete instance.",
      "Encapsulation is controlled access to state, not just the word private.",
      "Inheritance is is-a; composition is has-a.",
      "Tracing variables must be done line by line, not by guessing.",
    ],
    drill: [
      "Make a table: iteration | a | b | x | y | result.",
      "Limit tracing tasks in practice: enough to build skill, not enough to replace theory.",
      "If assignment changes x, the next line uses the new x.",
    ],
  },
  {
    id: "10",
    key: "ai",
    title: "AI, ML and Data Science",
    emoji: "🤖",
    focus: "kNN, classification/regression/clustering, SVM, neural networks, activation functions, overfitting, IoU.",
    scheme: `MACHINE LEARNING
  |
  |-- supervised: labelled data, classification/regression
  |-- unsupervised: clustering, dimensionality reduction
  |-- kNN: class from nearest labelled neighbours
  |-- SVM: separating hyperplane with margin
  |-- neural net: weights + activation + training`,
    science:
      "Machine learning builds models from data. Training changes parameters, such as weights, so the model makes fewer errors. Evaluation checks whether the learned pattern generalizes beyond training examples.",
    analogy:
      "kNN is asking the nearest neighbours what label they have. SVM is drawing the widest separating road between two groups. A neural network is a chain of adjustable knobs.",
    traps: [
      "kNN with known labels -> supervised learning.",
      "Classification predicts category; regression predicts number.",
      "Sigmoid maps to 0..1; RBF Gaussian looks like e^(-c*x^2).",
      "IoU is for segmentation overlap, not image quality in general.",
    ],
    drill: [
      "Training NN -> changing weights.",
      "Overfitting -> good train score, worse test score.",
      "Recall -> how many true positives were found.",
    ],
  },
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function questionsFor(blockKey, variant = 1) {
  const set = bank.quiz_sets.find((item) => item.id === `exam-it-140-v${variant}`);
  return set.questions.filter((question) => question.block === blockKey);
}

function questionRows(blockKey) {
  return questionsFor(blockKey, 1)
    .slice(0, 6)
    .map((question) => `<li><b>${esc(question.topic.replace(/_/g, " "))}</b>: ${esc(question.prompt)}</li>`)
    .join("");
}

function sortingTable() {
  const rows = [
    ["Bubble", "O(n)", "O(n^2)", "O(n^2)", "yes", "O(1)", "neighbour swaps"],
    ["Selection", "O(n^2)", "O(n^2)", "O(n^2)", "usually no", "O(1)", "find minimum"],
    ["Insertion", "O(n)", "O(n^2)", "O(n^2)", "yes", "O(1)", "insert into sorted-left"],
    ["Merge", "O(n log n)", "O(n log n)", "O(n log n)", "yes", "O(n)", "divide + merge"],
    ["Quick", "O(n log n)", "O(n log n)", "O(n^2)", "usually no", "O(log n)", "pivot + partition"],
    ["Heap", "O(n log n)", "O(n log n)", "O(n log n)", "no", "O(1)", "binary heap"],
    ["Counting", "O(n+k)", "O(n+k)", "O(n+k)", "can be yes", "O(k)", "counters for values"],
    ["Radix", "O(d(n+k))", "O(d(n+k))", "O(d(n+k))", "yes, with stable pass", "O(n+k)", "digit by digit"],
  ];
  return `<table><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Stable?</th><th>Memory</th><th>Exam clue</th></tr>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
    .join("")}</table>`;
}

function tracingExample() {
  return `<div class="example"><h4>Code tracing: enough to pass, not too much</h4><pre><code>x = 2
y = 3
z = 1

for i = 1 to 3:
    z = z + x
    x = x + y
    y = y * 2</code></pre><table><tr><th>i</th><th>x</th><th>y</th><th>z</th></tr><tr><td>0</td><td>2</td><td>3</td><td>1</td></tr><tr><td>1</td><td>5</td><td>6</td><td>3</td></tr><tr><td>2</td><td>11</td><td>12</td><td>8</td></tr><tr><td>3</td><td>23</td><td>24</td><td>19</td></tr></table><p><b>Rule:</b> every next line uses the newest value. Do not mentally jump. Draw the table.</p></div>`;
}

function renderBlock(block) {
  const extra = block.key === "algorithms" ? `<h3>Sorting quick table</h3>${sortingTable()}` : "";
  const trace = block.key === "programming" ? tracingExample() : "";
  return `<section class="page block" id="block-${block.id}">
    <div class="kicker">Block ${block.id} / ${esc(block.key)}</div>
    <h2>${block.emoji} ${esc(block.title)}</h2>
    <p class="focus"><b>Focus:</b> ${esc(block.focus)}</p>
    <div class="grid">
      <div class="card wide"><h3>Schema</h3><pre>${esc(block.scheme)}</pre></div>
      <div class="card"><h3>Scientific explanation</h3><p>${esc(block.science)}</p></div>
      <div class="card"><h3>Life analogy</h3><p>${esc(block.analogy)}</p></div>
      <div class="card"><h3>Typical traps</h3><ul>${block.traps.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>
      <div class="card"><h3>Mini-drill</h3><ul>${block.drill.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>
      <div class="card wide"><h3>What v27 tests ask here</h3><ul>${questionRows(block.key)}</ul></div>
    </div>
    ${extra}
    ${trace}
  </section>`;
}

function renderHtml() {
  const tocRows = blocks
    .map((block, index) => `<tr><td>${index + 3}-${index + 4}</td><td>${block.emoji} ${esc(block.title)}</td><td>${esc(block.focus)}</td></tr>`)
    .join("");
  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<title>Master Prep Exam Guide v27</title>
<style>
  @page { size: A4; margin: 13mm 12mm 16mm; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f7f3ea; color: #102a3a; font-family: Arial, "Segoe UI", sans-serif; line-height: 1.48; }
  .page { page-break-after: always; min-height: 260mm; padding: 10mm 8mm; background: #fffdf8; border-left: 1px solid #eadfce; border-right: 1px solid #eadfce; }
  h1 { font-size: 44px; line-height: 1.02; margin: 0 0 14px; }
  h2 { font-size: 28px; margin: 0 0 12px; }
  h3 { font-size: 17px; margin: 0 0 8px; }
  h4 { font-size: 15px; margin: 0 0 8px; }
  p { margin: 0 0 10px; }
  .subtitle { font-size: 20px; max-width: 740px; color: #47606d; }
  .kicker { color: #d19300; text-transform: uppercase; font-weight: 800; letter-spacing: .08em; font-size: 12px; margin-bottom: 8px; }
  .focus { background: #e8f5ef; display: inline-block; padding: 8px 12px; border-radius: 16px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
  .card, .example { border: 1px solid #dbe7e3; background: #f8fbfa; border-radius: 12px; padding: 12px; break-inside: avoid; }
  .wide { grid-column: 1 / -1; }
  pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; background: #0e2430; color: #f2fbff; padding: 12px; border-radius: 10px; font: 12px/1.42 Consolas, "Courier New", monospace; }
  code { font-family: Consolas, "Courier New", monospace; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0 14px; break-inside: avoid; }
  th, td { border: 1px solid #d7dedb; padding: 7px; vertical-align: top; font-size: 12px; }
  th { background: #eef5f1; text-align: left; }
  ul { margin: 0; padding-left: 18px; }
  li { margin: 0 0 5px; }
  .hero { display: flex; flex-direction: column; justify-content: center; }
  .pillrow { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
  .pill { border: 1px solid #cfe1da; background: #edf8f3; border-radius: 999px; padding: 7px 11px; font-weight: 700; }
  .note { border-left: 5px solid #d19300; padding: 12px 14px; background: #fff6df; border-radius: 8px; margin-top: 18px; }
  .block h2 { border-bottom: 2px solid #e7ece9; padding-bottom: 8px; }
</style>
</head>
<body>
  <section class="page hero">
    <div class="kicker">K RnD Lab / Master Prep / v27</div>
    <h1>ЄФВВ IT 2026: посібник, синхронізований із v27 тестами</h1>
    <p class="subtitle">Не збірник старих питань, а карта понять для складання: 10 блоків програми, 140-питальні варіанти, схеми, пастки, приклади й мінімум трасування коду без перевантаження.</p>
    <div class="pillrow">${blocks.map((block) => `<span class="pill">${block.emoji} ${esc(block.title)}</span>`).join("")}</div>
    <div class="note"><b>Як читати:</b> спочатку схема, потім пастки, потім 6 прикладів того, що питає v27-банк у цьому блоці. Після кожного блоку варто пройти 10-15 питань у practice або цілий variant у simulation.</div>
  </section>
  <section class="page">
    <div class="kicker">Contents</div>
    <h2>Маршрут читання</h2>
    <table><tr><th>Pages</th><th>Block</th><th>What it covers</th></tr>${tocRows}</table>
    <h2>Баланс тесту</h2>
    <p>IT v27 має 10 блоків по 14 питань у кожному варіанті. Це зроблено, щоб тренувати програму 2026, а не повторювати один старий тест.</p>
    <table><tr><th>Variant</th><th>Questions</th><th>Structure</th></tr><tr><td>IT v1</td><td>140</td><td>10 blocks × 14 questions</td></tr><tr><td>IT v2</td><td>140</td><td>same concepts, different formulations</td></tr><tr><td>IT v3</td><td>140</td><td>same concepts, different traps</td></tr></table>
    <div class="note"><b>Про задачі з a, b, x, y, i:</b> вони потрібні, але не мають захопити весь тест. У реальному тренуванні достатньо 10-15 таких задач на варіант; основний бал дає впізнавання понять, моделей, алгоритмів, мереж, БД, ООП, ML і безпеки.</div>
  </section>
  ${blocks.map(renderBlock).join("\n")}
  <section class="page">
    <div class="kicker">TZNK and English</div>
    <h2>Короткий міст до інших двох тестів</h2>
    <div class="grid">
      <div class="card"><h3>🧠 TZNK</h3><p>Тримати три питання: OR чи AND; порядок важливий чи ні; чи є заборонені варіанти, які треба відняти.</p><pre>OR -> add
AND -> multiply
roles -> arrangements
no roles -> combinations
bad cases -> total - forbidden</pre></div>
      <div class="card"><h3>🇬🇧 English</h3><p>Фокус: grammar patterns, reading markers, conditionals, tense logic, connectors. У reading не перекладати все, а ловити reference words, contrast, cause/effect.</p><pre>however -> contrast
therefore -> result
unless -> if not
although -> concession</pre></div>
    </div>
  </section>
</body>
</html>`;
}

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

async function printPdf(htmlPath, pdfPath) {
  const chromeCandidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  const chromePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));
  if (!chromePath) throw new Error("Chrome or Edge was not found");
  const port = 9225 + Math.floor(Math.random() * 500);
  const userDataDir = path.join(process.env.TEMP || dir, `chrome-print-${Date.now()}`);
  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--no-first-run",
    "about:blank",
  ], { stdio: "ignore" });
  try {
    await waitForChrome(port);
    const targets = await requestJson(`http://127.0.0.1:${port}/json/list`);
    const pageTarget = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
    if (!pageTarget) throw new Error("Chrome page target was not found");
    const client = cdp(pageTarget.webSocketDebuggerUrl);
    await client.opened;
    await client.send("Page.enable");
    const loaded = client.once("Page.loadEventFired");
    await client.send("Page.navigate", { url: `file:///${htmlPath.replace(/\\/g, "/")}` });
    await loaded;
    await sleep(400);
    const result = await client.send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: '<div style="width:100%;font-size:8px;color:#102a3a;text-align:center;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    });
    fs.writeFileSync(pdfPath, Buffer.from(result.data, "base64"));
    client.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {
      // Windows can keep Chrome profile files locked for a moment after headless exit.
    }
  }
}

async function main() {
  fs.writeFileSync(outHtml, renderHtml(), "utf8");
  await printPdf(outHtml, outPdf);
  console.log(outPdf);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
