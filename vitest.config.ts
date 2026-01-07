/**
 * Vitest configuration with per-package testing support
 *
 * Usage:
 *   pnpm test              - Run all tests
 *   pnpm test:core         - Run core package tests
 *   pnpm test --project=X  - Run specific package tests (e.g., --project=layout)
 */
import { defineConfig, defineProject } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { resolveConfig } from './vite.config'

const packages = [
  'core',
  'colors',
  'editors',
  'icons',
  'inputs',
  'layout',
  'markdown',
  'menus',
  'navigation',
  'sliders',
  'three',
] as const

export default defineConfig({
  resolve: resolveConfig,
  test: {
    projects: packages.map(pkg =>
      defineProject({
        resolve: resolveConfig,
        test: {
          name: pkg,
          browser: {
            enabled: true,
            provider: playwright() as any,
            instances: [
              { browser: 'chromium' as const, name: `${pkg}-chromium` },
            ],
          },
          include: [`packages/${pkg}/src/**/*.test.ts`],
        },
      })
    ),
  },
})
