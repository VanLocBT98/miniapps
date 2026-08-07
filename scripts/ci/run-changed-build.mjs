#!/usr/bin/env node
import { execSync } from 'node:child_process'

const base = process.argv[2] || process.env.BASE_REF || 'origin/main'
const result = JSON.parse(
  execSync(`node scripts/ci/detect-changed-apps.mjs ${base}`, { encoding: 'utf8' }),
)

if (!result.apps?.length) {
  console.log('No deployable app changes detected.')
  process.exit(0)
}

const filters = result.apps.map((a) => `--filter=${a.packageName}`).join(' ')
console.log(`Building: ${result.apps.map((a) => a.id).join(', ')}`)
execSync(`pnpm turbo run build ${filters}`, { stdio: 'inherit' })
