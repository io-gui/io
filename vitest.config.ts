/**
 * Vitest configuration with browser testing and browser benchmarks
 */

import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { resolveConfig } from './vite.config'

function browserConfig(instanceName: string) {
  return {
    enabled: true,
    provider: playwright(),
    instances: [{ browser: 'chromium' as const, name: instanceName }],
    screenshotFailures: false,
  }
}

export default defineConfig({
  resolve: resolveConfig,
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['packages/*/src/**/*.test.ts'],
          browser: browserConfig('unit-chromium'),
          fileParallelism: false,
          testTimeout: 120_000,
          benchmark: {
            include: ['packages/*/src/**/*.bench.ts'],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'coverage',
          include: ['packages/core/src/**/*.test.ts'],
          browser: browserConfig('coverage-chromium'),
          benchmark: {
            include: [],
          },
        },
      },
    ],
  },
})
