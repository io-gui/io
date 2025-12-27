import { defineConfig } from 'vite'
import path from 'node:path'
import packages from './packages.config'
import strip from '@rollup/plugin-strip'

const packageName = process.env.PACKAGE as string
const packageDir = path.resolve('packages', packageName)

const externals = [
  /^@io-gui\//,
  /^three/
]

export default defineConfig({
  root: packageDir,
  plugins: [
    strip({
      functions: [],
      labels: ['debug']
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(packageDir, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js'
    },
    outDir: path.resolve(packageDir, 'bundle'),
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: /^\s*!|Copyright|@license|@License|@preserve|@copyright/i
      }
    },
    sourcemap: true,
    rollupOptions: {
      external: (id) => {
        return externals.some(ext =>
          ext instanceof RegExp ? ext.test(id) : id === ext || id.startsWith(ext + '/')
        )
      },
      output: {
        preserveModules: false,
        inlineDynamicImports: true
      }
    }
  },
  resolve: packages.resolve
})
