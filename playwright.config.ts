import { defineConfig } from '@playwright/test'

const port = Number(process.env.PLAYWRIGHT_PORT ?? '3100')
const origin = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'output/playwright/test-results',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: origin,
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'mobile-chromium',
      use: {
        browserName: 'chromium',
        isMobile: true,
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: `pnpm dev --hostname 127.0.0.1 --port ${port}`,
    url: origin,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
