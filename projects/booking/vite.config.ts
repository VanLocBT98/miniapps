import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

/** Standalone SPA: stub Start server fns so the client build never pulls them in. */
function stubServerFns(): Plugin {
  const stub = path.resolve(rootDir, './src/server/customer-fns.browser.ts')
  return {
    name: 'stub-booking-server-fns',
    enforce: 'pre',
    resolveId(id) {
      const normalized = id.replace(/\\/g, '/')
      if (
        id === '@/server/customer-fns' ||
        normalized.endsWith('/server/customer-fns') ||
        normalized.endsWith('/server/customer-fns.ts')
      ) {
        return stub
      }
    },
  }
}

export default defineConfig({
  plugins: [stubServerFns(), tailwindcss(), react()],
  build: {
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    port: 5176,
  },
})
