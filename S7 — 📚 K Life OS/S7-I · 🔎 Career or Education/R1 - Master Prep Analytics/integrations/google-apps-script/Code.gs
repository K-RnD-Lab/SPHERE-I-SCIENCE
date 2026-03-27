function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const payload = {
    updatedAt: new Date().toISOString(),
    study: readSheet(ss, 'StudyLog'),
    sessions: readSheet(ss, 'SessionLog'),
    resources: readSheet(ss, 'Resources'),
  };

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = parseRequestBody(e);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const type = String(body.type || '').trim();
  const row = body.row || {};

  if (!type || !row) return jsonResponse({ ok: false, error: 'Missing type or row payload.' });

  const sheetName = type === 'study' ? 'StudyLog' : type === 'session' ? 'SessionLog' : '';
  if (!sheetName) return jsonResponse({ ok: false, error: 'Unsupported row type.' });

  appendObjectRow(ss.getSheetByName(sheetName), row);
  return jsonResponse({ ok: true, updatedAt: new Date().toISOString() });
}

function parseRequestBody(e) {
  const contents = e && e.postData && e.postData.contents
    ? String(e.postData.contents)
    : '';

  if (contents) {
    try {
      return JSON.parse(contents);
    } catch (error) {
      // Ignore and continue with form-style payloads.
    }
  }

  const params = e && e.parameter ? e.parameter : {};
  let row = params.row || {};

  if (typeof row === 'string') {
    try {
      row = JSON.parse(row);
    } catch (error) {
      row = {};
    }
  }

  return {
    type: params.type || '',
    row: row || {},
  };
}

function readSheet(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1)
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
}

function appendObjectRow(sheet, row) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const values = headers.map(header => row[header] ?? '');
  sheet.appendRow(values);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
