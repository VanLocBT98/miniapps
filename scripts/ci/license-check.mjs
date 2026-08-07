#!/usr/bin/env node
/**
 * Fail CI when production dependencies use disallowed copyleft licenses.
 */
import { execSync } from 'node:child_process'

const FORBIDDEN = ['GPL', 'AGPL', 'SSPL', 'CPAL']

const raw = execSync('pnpm licenses list --json', {
  encoding: 'utf8',
  maxBuffer: 20 * 1024 * 1024,
})

let data
try {
  data = JSON.parse(raw)
} catch {
  console.error('Unable to parse pnpm licenses output')
  process.exit(1)
}

const hits = []

function consider(license, name, version) {
  const upper = String(license || 'UNKNOWN').toUpperCase()
  if (FORBIDDEN.some((f) => upper.includes(f))) {
    hits.push({ license, name, version })
  }
}

if (Array.isArray(data)) {
  for (const pkg of data) {
    consider(pkg.license, pkg.name, pkg.version)
  }
} else if (data && typeof data === 'object') {
  for (const [license, packages] of Object.entries(data)) {
    if (!Array.isArray(packages)) continue
    for (const pkg of packages) {
      const name = pkg.name ?? pkg
      const version = pkg.versions?.[0] ?? pkg.version
      consider(license, name, version)
    }
  }
}

if (hits.length) {
  console.error('Disallowed licenses found:')
  for (const h of hits) {
    console.error(` - ${h.name}@${h.version ?? '?'} (${h.license})`)
  }
  process.exit(1)
}

console.log('License validation passed.')
