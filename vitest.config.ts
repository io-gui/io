/**
 * Vitest configuration with browser testing and Node benchmarks
 *
 * Usage:
 *   pnpm test                          - Run unit tests (browser)
 *   pnpm bench                         - Run all *.bench.ts benchmarks (Node)
 *   pnpm test:core                     - Run core package tests
 *   pnpm bench packages/core           - Run benchmarks in one package
 */
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { resolveConfig } from './vite.config'

export default defineConfig({
  resolve: resolveConfig,
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['packages/*/src/**/*.test.ts'],
          browser: {
            enabled: true,
            provider: playwright() as any,
            instances: [{ browser: 'chromium' }],
            screenshotFailures: false,
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'bench',
          include: ['packages/*/src/**/*.bench.ts'],
          browser: { enabled: false },
          setupFiles: ['packages/core/src/testing/bench-setup.ts'],
        },
      },
    ],
  },
})
