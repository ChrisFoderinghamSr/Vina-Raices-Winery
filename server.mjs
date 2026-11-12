import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(process.env.NEWSLETTER_DB || resolve(root, 'newsletter.sqlite'));
db.exec('CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, subscribed_at TEXT DEFAULT CURRENT_TIMESTAMP)');
const subscribe = db.prepare('INSERT OR IGNORE INTO subscribers(email) VALUES (?)');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp', '.svg':'image/svg+xml', '.mp3':'audio/mpeg', '.ico':'image/x-icon' };

export async function handleRequest(req, res) {
  const finish = (status, body) => { res.writeHead(status, { 'Content-Type':'text/plain; charset=utf-8' }); res.end(body); };
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/api/newsletter') {
      if (req.method !== 'POST') return finish(405, 'Use POST.');
      if (req.headers['content-type']?.split(';')[0] !== 'application/json') return finish(415, 'Expected JSON.');
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 2048) return finish(413, 'Request too large.');
        chunks.push(chunk);
      }
      let data;
      try { data = JSON.parse(Buffer.concat(chunks)); } catch { return finish(400, 'Invalid request.'); }
      const email = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return finish(400, 'Invalid email.');
      subscribe.run(email);
      return finish(200, 'Subscription received.');
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return finish(405, 'Use GET.');
    const relative = path === '/' ? 'index.html' : path.slice(1);
    if (relative !== 'index.html' && !/^(assets|css|js)\/[\w./ -]+$/.test(relative)) return finish(404, 'Page unavailable.');
    if (relative.split('/').some(part => part.startsWith('.'))) return finish(404, 'Page unavailable.');
    const file = resolve(root, relative);
    if (!file.startsWith(root + sep) || !(await stat(file).catch(() => null))?.isFile()) return finish(404, 'Page unavailable.');
    res.writeHead(200, { 'Content-Type': mime[extname(file).toLowerCase()] || 'application/octet-stream' });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch { if (!res.headersSent) finish(500, 'Please try again later.'); else res.destroy(); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createServer(handleRequest).listen(Number(process.env.PORT || 8080), process.env.HOST || '127.0.0.1');
}
