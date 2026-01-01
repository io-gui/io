import { defineConfig } from 'vite'

export const resolveConfig = {
  alias: [
    // Package aliases
    { find: '@io-gui/core', replacement: new URL('./packages/core/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/icons', replacement: new URL('./packages/icons/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/colors', replacement: new URL('./packages/colors/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/editors', replacement: new URL('./packages/editors/src/index.ts', import.meta.url).pathname },
    { find: /\/packages\/editors\/dist\/demos\/(.*)\.js$/, replacement: new URL('./packages/editors/src/demos/$1.ts', import.meta.url).pathname },

    { find: '@io-gui/inputs', replacement: new URL('./packages/inputs/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/layout', replacement: new URL('./packages/layout/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/markdown', replacement: new URL('./packages/markdown/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/menus', replacement: new URL('./packages/menus/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/navigation', replacement: new URL('./packages/navigation/src/index.ts', import.meta.url).pathname },
    { find: '@io-gui/sliders', replacement: new URL('./packages/sliders/src/index.ts', import.meta.url).pathname },

    { find: '@io-gui/three', replacement: new URL('./packages/three/src/index.ts', import.meta.url).pathname },
    { find: /\/packages\/three\/dist\/demos\/(.*)\.js$/, replacement: new URL('./packages/three/src/demos/$1.ts', import.meta.url).pathname },
    { find: /\/packages\/three\/dist\/examples\/(.*)\.js$/, replacement: new URL('./packages/three/src/examples/$1.ts', import.meta.url).pathname },
  ]
}

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    watch: {
      ignored: ['**/packages/three/src_examples/**'],
    },
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  resolve: resolveConfig
})

