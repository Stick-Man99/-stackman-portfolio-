const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const DATA_FILE = process.env.SUBMISSION_DATA_FILE || path.join(process.cwd(), 'data', 'submissions.json');
const ALLOWED_ORIGINS = new Set([
  'https://stick-man99.github.io',
  'http://127.0.0.1:8082',
  'http://localhost:8082',
  'http://127.0.0.1:8083',
  'http://localhost:8083',
]);

let writeQueue = Promise.resolve();

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://stick-man99.github.io',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Vary': 'Origin',
  };
}

function sendJson(response, status, body, origin) {
  const payload = JSON.stringify(body);
  response.writeHead(status, { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' });
  response.end(payload);
}

async function readStore() {
  try {
    const value = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function saveStore(items) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const tempFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(items, null, 2), 'utf8');
    await fs.rename(tempFile, DATA_FILE);
  });
  return writeQueue;
}

function isLuoguUrl(value) {
  if (!value) return true;
  try {
    const hostname = new URL(value).hostname;
    return hostname === 'luogu.com.cn' || hostname.endsWith('.luogu.com.cn');
  } catch {
    return false;
  }
}

function isValidProblemCode(value) {
  return !value || /^[A-Za-z0-9_\-]{1,40}$/.test(String(value));
}

function isAdmin(request) {
  return Boolean(ADMIN_TOKEN) && request.headers.authorization === `Bearer ${ADMIN_TOKEN}`;
}

function toPublicArticle(item) {
  return {
    id: item.id,
    title: item.title,
    author: item.author,
    grade: item.grade,
    category: item.category,
    problem_code: item.problem_code || '',
    luogu_url: item.luogu_url,
    content: item.content,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body, 'utf8') > 1024 * 1024) {
        reject(new Error('body_too_large'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('invalid_json')); }
    });
    request.on('error', reject);
  });
}

async function handle(request, response) {
  const origin = request.headers.origin || '';
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'OPTIONS') {
    response.writeHead(204, corsHeaders(origin));
    response.end();
    return;
  }
  if (url.pathname === '/health' && request.method === 'GET') {
    sendJson(response, 200, { ok: true }, origin);
    return;
  }
  if (url.pathname === '/articles' && request.method === 'GET') {
    const items = await readStore();
    const problemCode = url.searchParams.get('problem_code') || '';
    const articles = items
      .filter((item) => item.status === 'approved' && item.visibility === 'public')
      .filter((item) => !problemCode || item.problem_code === problemCode)
      .map(toPublicArticle);
    sendJson(response, 200, { items: articles }, origin);
    return;
  }
  const articleMatch = url.pathname.match(/^\/articles\/([^/]+)$/);
  if (articleMatch && request.method === 'GET') {
    const items = await readStore();
    const item = items.find((entry) => entry.id === articleMatch[1] && entry.status === 'approved' && entry.visibility === 'public');
    if (!item) return sendJson(response, 404, { error: 'not_found' }, origin);
    sendJson(response, 200, { item: toPublicArticle(item) }, origin);
    return;
  }
  if (url.pathname === '/submissions' && request.method === 'POST') {
    const body = await readBody(request);
    if (!body.title || !body.author || !body.category || !body.content) return sendJson(response, 400, { error: 'invalid_submission' }, origin);
    if (String(body.title).length > 120 || String(body.author).length > 40 || String(body.content).length > 50000 || !isLuoguUrl(body.luogu_url) || !isValidProblemCode(body.problem_code)) return sendJson(response, 400, { error: 'invalid_field' }, origin);
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      title: String(body.title).trim(),
      author: String(body.author).trim(),
      grade: String(body.grade || ''),
      category: String(body.category),
      problem_code: String(body.problem_code || '').trim(),
      luogu_url: String(body.luogu_url || ''),
      visibility: String(body.visibility || 'public'),
      content: String(body.content),
      status: 'pending',
      created_at: now,
      updated_at: now,
    };
    const items = await readStore();
    items.unshift(item);
    await saveStore(items);
    sendJson(response, 201, { ok: true, id: item.id }, origin);
    return;
  }
  if (url.pathname === '/admin/submissions' && request.method === 'GET') {
    if (!isAdmin(request)) return sendJson(response, 401, { error: 'unauthorized' }, origin);
    sendJson(response, 200, { items: await readStore() }, origin);
    return;
  }
  const match = url.pathname.match(/^\/admin\/submissions\/([^/]+)$/);
  if (match && request.method === 'PATCH') {
    if (!isAdmin(request)) return sendJson(response, 401, { error: 'unauthorized' }, origin);
    const body = await readBody(request);
    if (!['pending', 'approved', 'rejected'].includes(body.status)) return sendJson(response, 400, { error: 'invalid_status' }, origin);
    const items = await readStore();
    const item = items.find((entry) => entry.id === match[1]);
    if (!item) return sendJson(response, 404, { error: 'not_found' }, origin);
    item.status = body.status;
    item.review_note = String(body.review_note || '');
    item.updated_at = new Date().toISOString();
    await saveStore(items);
    sendJson(response, 200, { ok: true }, origin);
    return;
  }
  sendJson(response, 404, { error: 'not_found' }, origin);
}

const server = http.createServer((request, response) => {
  handle(request, response).catch((error) => {
    const status = error.message === 'body_too_large' ? 413 : 500;
    sendJson(response, status, { error: status === 413 ? 'body_too_large' : 'server_error' }, request.headers.origin || '');
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Stack Man submission API listening on http://${HOST}:${PORT}`);
  if (!ADMIN_TOKEN) console.warn('ADMIN_TOKEN is not configured; admin routes are disabled.');
});
