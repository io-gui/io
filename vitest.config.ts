import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { resolveConfig } from './vite.config'

export default defineConfig({
  resolve: resolveConfig,
  test: {
    browser: {
      enabled: true,
      provider: playwright() as any,
      instances: [
        { browser: 'chromium' },
      ],
    },
    include: ['packages/**/src/**/*.test.ts'],
  },
})

