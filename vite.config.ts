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
  ],
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
  resolve: resolveConfig,
})
