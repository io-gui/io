import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import packages from './packages.config'

export default defineConfig({
  resolve: packages.resolve,
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

