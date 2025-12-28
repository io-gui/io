#!/usr/bin/env node
import { spawn } from 'node:child_process'

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

async function bundle(pkg) {
  return new Promise((resolve, reject) => {
    console.log(`\nBundling @io-gui/${pkg}...`)
    const proc = spawn('vite', ['build', '--config', 'vite.bundle.config.ts'], {
      env: { ...process.env, PACKAGE: pkg },
      stdio: 'inherit'
    })
    proc.on('close', code => code === 0 ? resolve() : reject(new Error(`Failed to bundle ${pkg}`)))
  })
}

for (const pkg of packages) {
  await bundle(pkg)
}
