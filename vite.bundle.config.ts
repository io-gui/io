import { defineConfig } from 'vite'
import path from 'node:path'
import { resolveConfig } from './vite.config'
import strip from '@rollup/plugin-strip'

const bundleRoot = process.env.BUNDLE_ROOT as string
const rootDir = path.resolve(bundleRoot)

function getExternals(bundleRoot: string): RegExp[] {
  const common = [/^@io-gui\//]

  if (bundleRoot.endsWith('three')) {
    return [...common, /^three/]
  }

  if (bundleRoot.endsWith('markdown')) {
    return [...common, /^marked/, /^dompurify/, /^marked-highlight/]
  }

  return common
}

const externals = getExternals(bundleRoot)

export default defineConfig({
  root: rootDir,
  esbuild: {
    legalComments: 'inline',
  },
  plugins: [
    strip({
      functions: [],
      labels: ['debug'],
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: path.resolve(rootDir, 'dist'),
    emptyOutDir: false,
    minify: 'terser',
    terserOptions: {
      mangle: false,
      compress: {
        keep_fnames: true,
        keep_classnames: true,
        keep_infinity: true,
      },
      format: {
        comments:
          /^\s*!|Copyright|@license|@License|@preserve|@copyright|SPDX-License-Identifier/i,
      },
    },
    sourcemap: true,
    rollupOptions: {
      external: (id) => {
        return externals.some((ext) =>
          ext instanceof RegExp
            ? ext.test(id)
            : id === ext || id.startsWith(ext + '/'),
        )
      },
      output: {
        preserveModules: false,
        inlineDynamicImports: true,
      },
    },
  },
  resolve: resolveConfig,
})
