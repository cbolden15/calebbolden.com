import { defineConfig } from '@playwright/test';

// Playwright sets FORCE_COLOR for its subprocesses; remove the conflicting NO_COLOR.
delete process.env.NO_COLOR;

export default defineConfig({
  testDir: './tests/showcase',
  timeout: 30_000,
  workers: 1,
  outputDir: process.env.SHOWCASE_RESULTS ?? '.superpowers/showcase-test-results',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: process.env.SHOWCASE_SERVER === 'production'
      ? 'node tests/showcase/run-standalone.mjs'
      : 'npm run dev -- --hostname localhost --port 3100',
    url: 'http://localhost:3100',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
