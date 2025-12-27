import { defineConfig, type Plugin } from 'vite'
import path from 'node:path'
import packages from './packages.config'

/**
 * Vite plugin to strip labeled statement blocks (e.g., `debug: { ... }`)
 * Replaces @rollup/plugin-strip functionality for labeled blocks
 */
function stripLabels(labels: string[] = ['debug']): Plugin {
  const labelPattern = new RegExp(
    `(?:^|\\n)([ \\t]*)(${labels.join('|')}):\\s*\\{`,
    'g'
  )

  return {
    name: 'vite-plugin-strip-labels',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('.ts') && !id.endsWith('.js')) return null
      if (!labels.some(label => code.includes(`${label}:`))) return null

      let result = code
      let match: RegExpExecArray | null

      while ((match = labelPattern.exec(code)) !== null) {
        const startIndex = match.index + (match[0].startsWith('\n') ? 1 : 0)
        const openBraceIndex = code.indexOf('{', startIndex)

        if (openBraceIndex === -1) continue

        let braceCount = 1
        let endIndex = openBraceIndex + 1

        while (braceCount > 0 && endIndex < code.length) {
          const char = code[endIndex]
          if (char === '{') braceCount++
          else if (char === '}') braceCount--
          endIndex++
        }

        const blockToRemove = code.slice(startIndex, endIndex)
        result = result.replace(blockToRemove, '')

        labelPattern.lastIndex = 0
        code = result
      }

      if (result !== code) {
        return { code: result, map: null }
      }
      return null
    }
  }
}

const packageName = process.env.PACKAGE as string
const packageDir = path.resolve('packages', packageName)

const externals = [
  /^@io-gui\//,
  /^three/
]

export default defineConfig({
  root: packageDir,
  plugins: [
    stripLabels(['debug'])
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
        comments: /^\s*!|Copyright|@license|@preserve|@copyright/i
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
