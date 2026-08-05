import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SERVER_TIMEOUT_MS = 180_000;
const ACTION_TIMEOUT_MS = 60_000;

const isCi = process.env['CI'] !== undefined && process.env['CI'] !== '';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: isCi,
  ...(isCi ? {} : { workers: 1 }),
  forbidOnly: isCi,
  retries: 0,
  reporter: 'list',
  timeout: ACTION_TIMEOUT_MS,
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
    command: isCi ? 'pnpm run start' : 'pnpm run dev:next',
    url: BASE_URL,
    reuseExistingServer: !isCi,
    timeout: SERVER_TIMEOUT_MS,
  },
});
