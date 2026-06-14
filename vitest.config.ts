/**
 * Vitest configuration with browser testing and Node benchmarks
 *
 * Usage:
 *   pnpm test                          - Run unit tests (browser)
 *   pnpm test:coverage                 - Run core coverage with thresholds
 *   pnpm bench                         - Run all *.bench.ts benchmarks (Node)
 *   pnpm test:core                     - Run core package tests
 *   pnpm bench packages/core           - Run benchmarks in one package
 */
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { resolveConfig } from './vite.config'

const browserUnitConfig = {
  enabled: true,
  provider: playwright() as any,
  instances: [{ browser: 'chromium' as const }],
  screenshotFailures: false,
}

const coreCoverageInclude = ['packages/core/src/**/*.ts']
const coreCoverageExclude = [
  '**/*.test.ts',
  '**/*.bench.ts',
  '**/demos/**',
  '**/testing/**',
  '**/*.glsl.ts',
]

export default defineConfig({
  resolve: resolveConfig,
  test: {
    coverage: {
      provider: 'v8',
      include: coreCoverageInclude,
      exclude: coreCoverageExclude,
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 74,
        functions: 78,
        branches: 58,
        statements: 73,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['packages/*/src/**/*.test.ts'],
          browser: browserUnitConfig,
        },
      },
      {
        extends: true,
        test: {
          name: 'coverage',
          include: ['packages/core/src/**/*.test.ts'],
          browser: browserUnitConfig,
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
