import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

// Match Dockerfile's standalone + static + public layout in a fresh owned directory.
const runtime = mkdtempSync(join(tmpdir(), 'showcase-runtime-'));
cpSync('.next/standalone', runtime, { recursive: true });
cpSync('.next/static', join(runtime, '.next/static'), { recursive: true });
cpSync('public', join(runtime, 'public'), { recursive: true });
const env = { ...process.env, HOSTNAME: 'localhost', PORT: '3100', NODE_ENV: 'production', NO_COLOR: '1' };
delete env.FORCE_COLOR;
const child = spawn(process.execPath, ['server.js'], { cwd: runtime, env, stdio: 'inherit' });
console.log(JSON.stringify({ runtime, pid: child.pid, buildId: readFileSync('.next/BUILD_ID', 'utf8').trim(), source: process.cwd() }));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code, signal) => { rmSync(runtime, { recursive: true, force: true }); process.exit(signal ? 0 : code ?? 1); });
