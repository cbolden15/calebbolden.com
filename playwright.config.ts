import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/showcase',
  timeout: 30_000,
  workers: 1,
  outputDir: '.superpowers/showcase-test-results',
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3100', trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: process.env.SHOWCASE_SERVER === 'production'
      ? 'npm run start -- --hostname localhost --port 3100'
      : 'npm run dev -- --hostname localhost --port 3100',
    url: 'http://localhost:3100',
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
