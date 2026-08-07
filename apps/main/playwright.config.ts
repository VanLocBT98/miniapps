import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT ?? 3000)
/** Prefer IPv4 — CI runners often resolve `localhost` to ::1 while Vite binds 127.0.0.1. */
const HOST = '127.0.0.1'
const ORIGIN = `http://${HOST}:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: ORIGIN,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `pnpm exec vite dev --host ${HOST} --port ${PORT}`,
    url: ORIGIN,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      ...process.env,
      PORT: String(PORT),
      // Keep server/public origins aligned with the IPv4 probe URL.
      APP_URL: ORIGIN,
      VITE_APP_URL: ORIGIN,
      VITE_PORTAL_HOST: ORIGIN,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
