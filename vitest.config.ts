import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  resolve: {
    alias: {
      '@io-gui/core': new URL('./packages/core/src/index.ts', import.meta.url).pathname,
      '@io-gui/icons': new URL('./packages/icons/src/index.ts', import.meta.url).pathname,
      '@io-gui/colors': new URL('./packages/colors/src/index.ts', import.meta.url).pathname,
      '@io-gui/editors': new URL('./packages/editors/src/index.ts', import.meta.url).pathname,
      '@io-gui/inputs': new URL('./packages/inputs/src/index.ts', import.meta.url).pathname,
      '@io-gui/layout': new URL('./packages/layout/src/index.ts', import.meta.url).pathname,
      '@io-gui/markdown': new URL('./packages/markdown/src/index.ts', import.meta.url).pathname,
      '@io-gui/menus': new URL('./packages/menus/src/index.ts', import.meta.url).pathname,
      '@io-gui/navigation': new URL('./packages/navigation/src/index.ts', import.meta.url).pathname,
      '@io-gui/sliders': new URL('./packages/sliders/src/index.ts', import.meta.url).pathname,
      '@io-gui/three': new URL('./packages/three/src/index.ts', import.meta.url).pathname,
      'three/webgpu': new URL('./packages/three/node_modules/three/build/three.webgpu.js', import.meta.url).pathname,
      'three/tsl': new URL('./packages/three/node_modules/three/build/three.tsl.js', import.meta.url).pathname,
      'three/addons': new URL('./packages/three/node_modules/three/examples/jsm', import.meta.url).pathname,
    },
  },
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

