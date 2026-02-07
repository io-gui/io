/**
 * Vitest configuration with browser testing
 *
 * Usage:
 *   pnpm test                          - Run all tests
 *   pnpm test:core                     - Run core package tests
 *   pnpm test packages/core            - Run tests in specific package
 *   pnpm test --testNamePattern="foo"  - Run tests matching pattern
 */
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { resolveConfig } from './vite.config'

export default defineConfig({
  resolve: resolveConfig,
  test: {
    browser: {
      enabled: true,
      provider: playwright() as any,
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
    },
    include: ['packages/*/src/**/*.test.ts', 'apps/*/src/**/*.test.ts'],
  },
})