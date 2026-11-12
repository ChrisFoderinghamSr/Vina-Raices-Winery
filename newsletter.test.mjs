import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('newsletter signup persists a single normalized address across restarts', () => {
  const dir = mkdtempSync(join(tmpdir(), 'winery-'));
  const database = join(dir, 'test.sqlite');
  try {
    for (const [email, status] of [['guest@example.test',200], ['GUEST@example.test',200], ['invalid',400]]) {
      const script = `import { handleRequest } from './server.mjs'; import { Readable } from 'node:stream';
        const req = Readable.from([Buffer.from(JSON.stringify({email:process.env.TEST_EMAIL}))]);
        Object.assign(req,{url:'/api/newsletter', method:'POST', headers:{'content-type':'application/json'}});
        await handleRequest(req, {writeHead(code){console.log(code)},end(){}});`;
      const run = spawnSync(process.execPath, ['--input-type=module','-e',script], {
        cwd: new URL('.',import.meta.url), encoding:'utf8',
        env: {...process.env, NEWSLETTER_DB:database, TEST_EMAIL:email},
      });
      assert.equal(run.status, 0, run.stderr);
      assert.equal(run.stdout.trim(), String(status));
    }
    const db = new DatabaseSync(database);
    try { assert.deepEqual(db.prepare('SELECT email FROM subscribers').all().map(r=>r.email), ['guest@example.test']); }
    finally { db.close(); }
  } finally { rmSync(dir, {recursive:true, force:true}); }
});
