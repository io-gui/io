import { defineConfig } from 'vite'
import packages from './packages.config'

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  resolve: packages.resolve
})

