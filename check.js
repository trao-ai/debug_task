import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const PORT = 4100 + Math.floor(Math.random() * 400);
const BASE = `http://localhost:${PORT}`;
const TOTAL = 9;
const NONCE = Math.random().toString(36).slice(2, 8);
const CREATE_TITLE = `Progress check ${NONCE}`;
const RENAME_TITLE = `Renamed ${NONCE}`;
const MISSING_ID = 9000 + Math.floor(Math.random() * 1000);
const results = [];

function record(ok) {
  results.push(ok);
}

function probeImport(specifier) {
  const code = `import('${specifier}').then(() => process.exit(0), (e) => { console.error(e.code || e.name); process.exit(1); });`;
  const run = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', timeout: 5000 });
  return { ok: run.status === 0, error: (run.stderr || '').trim() };
}

async function getJson(path) {
  try {
    const res = await fetch(`${BASE}${path}`);
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch {
    return { status: 0, body: null };
  }
}

async function send(method, path, payload) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch {
    return { status: 0, body: null };
  }
}

async function listCount() {
  const { body } = await getJson('/tasks');
  return Array.isArray(body) ? body.length : -1;
}

async function startServer() {
  const child = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'ignore', 'ignore'],
  });
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) return null;
    try {
      const res = await fetch(`${BASE}/tasks`);
      if (res.status > 0) return child;
    } catch {
      await delay(150);
    }
  }
  child.kill();
  return null;
}

async function runtimeChecks() {
  {
    const { status, body } = await getJson('/tasks/1');
    record(status === 200 && body !== null && !Array.isArray(body) && body.id === 1);
  }

  {
    const before = await listCount();
    const { status, body } = await send('POST', '/tasks', { title: CREATE_TITLE });
    const returned = status === 201 && body !== null && body.title === CREATE_TITLE && body.id !== undefined;
    const inList = returned && (await getJson('/tasks')).body.some((t) => t.id === body.id);
    const after = await listCount();
    record(returned && inList && after === before + 1);
    await delay(250);
  }

  {
    const before = await listCount();
    const { status } = await send('POST', '/tasks', { title: '   ' });
    await delay(250);
    const after = await listCount();
    record(status === 400 && after === before);
  }

  let statusUpdate = null;
  let titleUpdate = null;
  {
    statusUpdate = await send('PUT', '/tasks/2', { status: 'done' });
    titleUpdate = await send('PUT', '/tasks/3', { title: RENAME_TITLE });
    record(
      statusUpdate.status === 200 &&
        statusUpdate.body?.status === 'done' &&
        statusUpdate.body?.title === 'Write API documentation' &&
        titleUpdate.body?.title === RENAME_TITLE &&
        titleUpdate.body?.status === 'pending'
    );
  }

  {
    const { body } = await getJson('/tasks');
    const task2 = Array.isArray(body) ? body.find((t) => t.id === 2) : null;
    const task3 = Array.isArray(body) ? body.find((t) => t.id === 3) : null;
    const consistent =
      task2 !== null &&
      task3 !== null &&
      task2?.status === statusUpdate?.body?.status &&
      task2?.title === statusUpdate?.body?.title &&
      task3?.title === titleUpdate?.body?.title &&
      task3?.status === titleUpdate?.body?.status;
    record(consistent);
  }

  {
    const before = await listCount();
    const { status } = await send('DELETE', `/tasks/${MISSING_ID}`);
    const after = await listCount();
    record(status === 404 && after === before);
  }

  {
    const done = await getJson('/tasks/search?status=done');
    const pending = await getJson('/tasks/search?status=pending');
    const okDone = Array.isArray(done.body) && done.body.length > 0 && done.body.every((t) => t.status === 'done');
    const okPending = Array.isArray(pending.body) && pending.body.length > 0 && pending.body.every((t) => t.status === 'pending');
    record(okDone && okPending);
  }
}

function report() {
  while (results.length < TOTAL) record(false);
  const passing = results.filter(Boolean).length;
  const suffix = passing === TOTAL ? ' — everything looks fixed!' : ` — ${TOTAL - passing} to go.`;
  console.log(`\nTask Manager API — ${passing}/${TOTAL} fixed${suffix}\n`);
  process.exitCode = passing === TOTAL ? 0 : 1;
}

const appProbe = probeImport('./src/app.js');
const loggerProbe = probeImport('./src/middleware/logger.js');

record(appProbe.ok || !appProbe.error.includes('ERR_MODULE_NOT_FOUND'));
record(loggerProbe.ok);

if (!appProbe.ok || !loggerProbe.ok) {
  for (let i = 0; i < 7; i += 1) record(false);
  report();
} else {
  const child = await startServer();
  if (!child) {
    for (let i = 0; i < 7; i += 1) record(false);
    report();
  } else {
    try {
      await runtimeChecks();
    } catch {
      // fall through — report() pads unrecorded checks as failing
    } finally {
      child.kill();
    }
    report();
  }
}
