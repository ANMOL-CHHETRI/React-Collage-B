import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'QA/tests',
  retries: 0,
  timeout: 60 * 1000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-results.json' }],
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
