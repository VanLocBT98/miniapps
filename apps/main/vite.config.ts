/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(rootDir, '../..')

/** Resolve `@/*` to the importing mini-app's `src/` (dashboard, portfolio, …). */
function workspaceAtAlias(): Plugin {
  return {
    name: 'workspace-at-alias',
    enforce: 'pre',
    async resolveId(id, importer, options) {
      if (!id.startsWith('@/') || !importer) return
      const normalized = importer.replace(/\\/g, '/')
      const fromProjects = normalized.match(/\/projects\/([^/]+)\//)
      const fromPkg = fromProjects ?? normalized.match(/\/node_modules\/@repo\/([^/]+)\//)
      if (!fromPkg) return
      const candidate = path.resolve(
        repoRoot,
        'projects',
        fromPkg[1]!,
        'src',
        id.slice(2),
      )
      return this.resolve(candidate, importer, { ...options, skipSelf: true })
    },
  }
}

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    // Hidden source maps for observability; avoids Vercel 403 spam on .map in DevTools.
    sourcemap: 'hidden',
    rolldownOptions: {
      external: ['postgres'],
    },
  },
  test: {
    exclude: ['**/e2e/**', '**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '~': path.resolve(rootDir, './src'),
      // Explicit paths so Vite SSR module runner resolves workspace @repo/db
      // (bare imports from projects/booking server fns otherwise fail).
      '@repo/db/customers': path.resolve(repoRoot, 'packages/db/src/customers/index.ts'),
      '@repo/db/schema': path.resolve(repoRoot, 'packages/db/src/schema/index.ts'),
      '@repo/db': path.resolve(repoRoot, 'packages/db/src/index.ts'),
    },
  },
  ssr: {
    external: ['postgres'],
    noExternal: ['@repo/db', 'drizzle-orm'],
  },
  // Nitro emits Vercel Build Output API (SSR + assets). Required for production deploy.
  plugins: [
    workspaceAtAlias(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      // On Vercel, Nitro auto-selects the vercel preset (Build Output API).
      // Keep native DB driver external for the server bundle.
      rollupConfig: {
        external: ['postgres'],
      },
    }),
    viteReact(),
  ],
})
