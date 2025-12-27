import { defineConfig, type Plugin } from 'vite'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const packages = [
  'core',
  'icons',
  'inputs',
  'sliders',
  'colors',
  'menus',
  'navigation',
  'editors',
  'layout',
  'markdown',
  'three'
]

/** Additional externals per package (beyond auto-detected peerDependencies) */
const packageExternals: Record<string, (string | RegExp)[]> = {
  markdown: ['dompurify', 'marked', 'marked-highlight'],
  three: ['three/webgpu', 'three/tsl', 'three/addons']
}

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

/**
 * Reads package.json and extracts peer dependencies for externalization
 */
function getPeerDependencies(packageDir: string): string[] {
  const pkgPath = resolve(packageDir, 'package.json')
  if (!existsSync(pkgPath)) return []
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  return Object.keys(pkg.peerDependencies || {})
}

/**
 * Gets the package name from PACKAGE env var.
 * Usage: PACKAGE=core vite build --config vite.bundle.config.ts
 */
function getPackageName(): string {
  const pkg = process.env.PACKAGE
  if (!pkg) {
    throw new Error('PACKAGE environment variable required.\nUsage: PACKAGE=core vite build --config vite.bundle.config.ts')
  }
  if (!packages.includes(pkg)) {
    throw new Error(`Unknown package "${pkg}". Valid packages: ${packages.join(', ')}`)
  }
  return pkg
}

const packageName = getPackageName()
const packageDir = resolve('packages', packageName)
// const peerDeps = getPeerDependencies(packageDir)
// const additionalExternals = packageExternals[packageName] || []

const externals = [
  // ...peerDeps,
  // ...additionalExternals,
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
      entry: resolve(packageDir, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js'
    },
    outDir: resolve(packageDir, 'bundle'),
    emptyOutDir: true,
    minify: 'esbuild',
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
  resolve: {
    alias: {
      '@io-gui/core': resolve('packages/core/src/index.ts'),
      '@io-gui/icons': resolve('packages/icons/src/index.ts'),
      '@io-gui/colors': resolve('packages/colors/src/index.ts'),
      '@io-gui/editors': resolve('packages/editors/src/index.ts'),
      '@io-gui/inputs': resolve('packages/inputs/src/index.ts'),
      '@io-gui/layout': resolve('packages/layout/src/index.ts'),
      '@io-gui/markdown': resolve('packages/markdown/src/index.ts'),
      '@io-gui/menus': resolve('packages/menus/src/index.ts'),
      '@io-gui/navigation': resolve('packages/navigation/src/index.ts'),
      '@io-gui/sliders': resolve('packages/sliders/src/index.ts'),
      '@io-gui/three': resolve('packages/three/src/index.ts'),
    }
  }
})
