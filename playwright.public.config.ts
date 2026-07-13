import { defineConfig } from '@playwright/test'

import baseConfig from './playwright.config'

const port = Number(process.env.PLAYWRIGHT_PORT ?? '3100')
const origin = `http://127.0.0.1:${port}`

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: `node scripts/serve-static-export.mjs --port ${port}`,
    url: origin,
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
