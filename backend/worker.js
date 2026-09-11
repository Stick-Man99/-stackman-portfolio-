const ALLOWED_ORIGINS = new Set([
  'https://stick-man99.github.io',
  'http://127.0.0.1:8082',
  'http://localhost:8082',
  'http://127.0.0.1:8083',
  'http://localhost:8083',
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://stick-man99.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}

function isValidUrl(value) {
  if (!value) return true;
  try { return new URL(value).hostname.endsWith('luogu.com.cn'); } catch { return false; }
}

function isValidProblemCode(value) {
  return !value || /^[A-Za-z0-9_\-]{1,40}$/.test(String(value));
}

function toPublicArticle(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author || row.author_nickname || '',
    grade: row.grade || row.grade_range || '',
    category: row.category,
    problem_code: row.problem_code || '',
    luogu_url: row.luogu_url || '',
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) });
    const url = new URL(request.url);

    if (url.pathname === '/articles' && request.method === 'GET') {
      const problemCode = url.searchParams.get('problem_code') || '';
      let query = 'SELECT * FROM submissions WHERE status = ? AND visibility = ?';
      const bindings = ['approved', 'public'];
      if (problemCode) {
        query += ' AND problem_code = ?';
        bindings.push(problemCode);
      }
      query += ' ORDER BY created_at DESC LIMIT 100';
      const result = await env.DB.prepare(query).bind(...bindings).all();
      return json({ items: (result.results || []).map(toPublicArticle) }, 200, origin);
    }

    const articleMatch = url.pathname.match(/^\/articles\/([^/]+)$/);
    if (articleMatch && request.method === 'GET') {
      const result = await env.DB.prepare('SELECT * FROM submissions WHERE id = ? AND status = ? AND visibility = ? LIMIT 1')
        .bind(articleMatch[1], 'approved', 'public').first();
      if (!result) return json({ error: 'not_found' }, 404, origin);
      return json({ item: toPublicArticle(result) }, 200, origin);
    }

    if (url.pathname === '/submissions' && request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body || !body.title || !body.author || !body.category || !body.content) return json({ error: 'invalid_submission' }, 400, origin);
      if (body.title.length > 120 || body.author.length > 40 || body.content.length > 50000 || !isValidUrl(body.luogu_url) || !isValidProblemCode(body.problem_code)) return json({ error: 'invalid_field' }, 400, origin);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      await env.DB.prepare(`INSERT INTO submissions (id,title,author_nickname,grade_range,category,problem_code,luogu_url,visibility,content,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id, body.title.trim(), body.author.trim(), body.grade || '', body.category, body.problem_code || '', body.luogu_url || '', body.visibility || 'public', body.content, 'pending', now, now).run();
      return json({ ok: true, id }, 201, origin);
    }

    if (url.pathname === '/admin/submissions') {
      if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, origin);
      const result = await env.DB.prepare('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 100').all();
      return json({ items: result.results || [] }, 200, origin);
    }

    const match = url.pathname.match(/^\/admin\/submissions\/([^/]+)$/);
    if (match && request.method === 'PATCH') {
      if (!isAdmin(request, env)) return json({ error: 'unauthorized' }, 401, origin);
      const body = await request.json().catch(() => null);
      if (!body || !['pending', 'approved', 'rejected'].includes(body.status)) return json({ error: 'invalid_status' }, 400, origin);
      await env.DB.prepare('UPDATE submissions SET status = ?, review_note = ?, updated_at = ? WHERE id = ?')
        .bind(body.status, body.review_note || '', new Date().toISOString(), match[1]).run();
      return json({ ok: true }, 200, origin);
    }

    return json({ error: 'not_found' }, 404, origin);
  }
};

function isAdmin(request, env) {
  const header = request.headers.get('Authorization') || '';
  return header === `Bearer ${env.ADMIN_TOKEN}` && Boolean(env.ADMIN_TOKEN);
}
