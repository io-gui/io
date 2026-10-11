import { defineConfig } from 'vite'

function packageAlias(packageName: string) {
  return [
    {
      find: `@io-gui/${packageName}`,
      replacement: new URL(
        `./packages/${packageName}/src/index.ts`,
        import.meta.url,
      ).pathname,
    },
    {
      find: new RegExp(`/packages/${packageName}/dist/demos/(.*)\\.js$`),
      replacement: new URL(
        `./packages/${packageName}/src/demos/$1.ts`,
        import.meta.url,
      ).pathname,
    },
    {
      find: './dist/index.js',
      replacement: './src/index.ts',
    },
  ]
}

export const resolveConfig = {
  alias: [
    ...packageAlias('core'),
    ...packageAlias('icons'),
    ...packageAlias('colors'),
    ...packageAlias('editors'),
    ...packageAlias('inputs'),
    ...packageAlias('layout'),
    ...packageAlias('markdown'),
    ...packageAlias('menus'),
    ...packageAlias('navigation'),
    ...packageAlias('sliders'),
    ...packageAlias('three'),
    {
      find: /\/packages\/three\/dist\/examples\/(.*)\.js$/,
      replacement: new URL(
        './packages/three/src/examples/$1.ts',
        import.meta.url,
      ).pathname,
    },
    // WebGPU only: addons that import bare 'three' share the three/webgpu build (as in index.html's import map)
    // instead of pulling in the WebGL build next to it.
    {
      find: /^three$/,
      replacement: 'three/webgpu',
    },
  ],
}

// Oxc resolves tsconfig per file and honors `exclude`, so *.test.ts files
// (excluded from package tsconfigs) would miss `experimentalDecorators`.
export const oxcConfig = {
  decorator: { legacy: true },
}

const DEV_HOST = 'dev.tabanovic.xyz'

export default defineConfig({
  root: '.',
  server: {
    host: true,
    port: 3000,
    allowedHosts: [DEV_HOST],
    watch: {
      ignored: ['**/packages/three/src_examples/**'],
    },
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    // Scan the demos up front: index.html loads them by path, which the scanner can't follow, and the default scan
    // also crawls src_examples/*.html, whose missing packages abort it. Deps found later re-bundle three into new
    // chunks; a page that misses the reload then runs two copies of three.
    entries: ['index.html', 'packages/*/src/demos/**/*.ts'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  resolve: resolveConfig,
  oxc: oxcConfig,
})
