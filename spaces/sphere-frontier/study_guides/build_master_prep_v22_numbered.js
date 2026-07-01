const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const dir = __dirname;
const inHtml = path.join(dir, "master_prep_exam_guide_v21_toc_schema_code.html");
const outHtml = path.join(dir, "master_prep_exam_guide_v22_numbered_toc.html");
const outPdf = path.join(dir, "master_prep_exam_guide_v22_numbered_toc.pdf");

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
          <span>Master Prep Exam Guide v22</span>
          <span style="padding:0 8px;color:#b5a36d;">•</span>
          <span>стор. <span class="pageNumber"></span> / <span class="totalPages"></span></span>
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

async function main() {
  let html = fs.readFileSync(inHtml, "utf8");
  html = html.replace(/v21/g, "v22");
  html = html.replace(/Master Prep Exam Teaching Guide v21/g, "Master Prep Exam Teaching Guide v22");
  html = html.replace(/Master Prep Exam Guide v21/g, "Master Prep Exam Guide v22");
  html = html.replace("</style>", `${polishCss}\n  </style>`);

  html = html.replace("<tr><th>Стор.</th><th>Блок</th><th>Що всередині</th><th>Як читати</th></tr>", "<tr><th>№</th><th>Блок</th><th>Що всередині</th><th>Як читати</th></tr>");
  let n = 0;
  html = html.replace(/<td class="page">[^<]+<\/td>/g, () => `<td class="page">${String(++n).padStart(2, "0")}</td>`);
  html = html.replace(
    /<div class="toc-note"><b>Примітка:<\/b>[\s\S]*?<\/div>/,
    `<div class="toc-note"><b>Примітка:</b> у змісті наведено порядок розділів, а справжня PDF-нумерація стоїть у нижньому колонтитулі кожної сторінки. Так навігація не ламається після додавання схем, коду або нових пояснень.</div>`
  );

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
