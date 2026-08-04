import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SERVER_TIMEOUT_MS = 180_000;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: process.env['CI'] !== undefined && process.env['CI'] !== '',
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev:next',
    url: BASE_URL,
    reuseExistingServer: process.env['CI'] === undefined,
    timeout: SERVER_TIMEOUT_MS,
  },
});
