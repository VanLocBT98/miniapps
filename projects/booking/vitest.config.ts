import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const alias = { '@': path.resolve(rootDir, './src') }
const setupFiles = ['./vitest.setup.ts']

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    // Vitest 4: use projects instead of removed environmentMatchGlobs.
    // RTL files also carry `/** @vitest-environment jsdom */`.
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          setupFiles,
        },
      },
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles,
        },
      },
    ],
  },
})
