#!/usr/bin/env node
/**
 * Detect which deployable apps changed vs a git base ref.
 * Usage: node scripts/ci/detect-changed-apps.mjs [baseRef]
 * Prints JSON: { apps: [...], filter: "@repo/main|@repo/dashboard", all: boolean }
 */
import { execSync } from 'node:child_process'
import { DEPLOY_APPS, SHARED_GLOBS } from './apps.mjs'

const baseRef = process.argv[2] || process.env.BASE_REF || 'origin/main'

function changedFiles() {
  try {
    execSync(`git rev-parse --verify ${baseRef}`, { stdio: 'ignore' })
  } catch {
    // First push / missing base — treat as all changed
    return null
  }
  const out = execSync(`git diff --name-only ${baseRef}...HEAD`, {
    encoding: 'utf8',
  })
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function matchGlob(file, glob) {
  // Very small glob: prefix/** or exact
  if (glob.endsWith('/**')) {
    const prefix = glob.slice(0, -3)
    return file === prefix.slice(0, -1) || file.startsWith(prefix)
  }
  return file === glob || file.startsWith(`${glob}/`)
}

const files = changedFiles()
if (files === null) {
  const result = {
    apps: DEPLOY_APPS,
    filter: DEPLOY_APPS.map((a) => a.packageName).join('|'),
    turboFilter: DEPLOY_APPS.map((a) => `--filter=${a.packageName}`).join(' '),
    all: true,
  }
  console.log(JSON.stringify(result))
  process.exit(0)
}

const sharedHit = files.some((f) => SHARED_GLOBS.some((g) => matchGlob(f, g)))
const selected = sharedHit
  ? DEPLOY_APPS
  : DEPLOY_APPS.filter((app) =>
      files.some((f) => app.pathGlobs.some((g) => matchGlob(f, g))),
    )

const apps = selected.length ? selected : []
const result = {
  apps,
  filter: apps.map((a) => a.packageName).join('|'),
  turboFilter: apps.map((a) => `--filter=${a.packageName}`).join(' '),
  all: sharedHit,
  files,
}
console.log(JSON.stringify(result))
