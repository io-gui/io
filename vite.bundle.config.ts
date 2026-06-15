import { defineConfig } from 'vite'
import fs from 'node:fs'
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

  return common
}

function readLicenseBanner(bundleRoot: string): string {
  const indexPath = path.resolve(bundleRoot, 'src/index.ts')
  const source = fs.readFileSync(indexPath, 'utf8')
  const match = source.match(/^\/\*![\s\S]*?\*\//)
  return match ? `${match[0]}\n` : ''
}

const externals = getExternals(bundleRoot)
const licenseBanner = readLicenseBanner(rootDir)

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
        banner: licenseBanner,
        comments: {
          annotation: true,
          legal: true,
        },
      },
    },
  },
  resolve: resolveConfig,
})
