import { spawn } from 'node:child_process';

const API_URL = 'http://127.0.0.1:4000/api/content';
const SITE_URLS = ['http://127.0.0.1:5173/', 'http://localhost:5173/', 'http://[::1]:5173/'];
const children = [];

function run(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    windowsHide: true,
  });
  children.push(child);
  return child;
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function isUp(url) {
  try {
    const response = await fetch(url, { redirect: 'manual' });
    return response.ok || response.status === 404;
  } catch {
    return false;
  }
}

async function waitUntil(check, label, timeoutMs = 12000) {
  const started = Date.now();
  while (!(await check())) {
    if (Date.now() - started > timeoutMs) {
      console.error(`${label} did not start in time`);
      shutdown();
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

if (await isUp(API_URL)) {
  console.log('CMS API already running on http://localhost:4000');
} else {
  const api = run(process.execPath, ['server/index.js']);
  api.on('exit', (code) => {
    if (code) {
      console.error(`CMS API exited with code ${code}`);
      shutdown();
      process.exit(code);
    }
  });
  await waitUntil(() => isUp(API_URL), 'CMS API');
}

const siteAlreadyUp = (await Promise.all(SITE_URLS.map(isUp))).some(Boolean);
if (siteAlreadyUp) {
  console.log('Site already running on http://localhost:5173');
  console.log('Admin CMS: http://localhost:5173/admin');
  await new Promise(() => {});
} else {
  const web = run(process.execPath, ['./node_modules/vite/bin/vite.js']);
  web.on('exit', (code) => {
    shutdown();
    process.exit(code ?? 0);
  });
}
