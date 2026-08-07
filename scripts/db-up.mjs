#!/usr/bin/env node
/**
 * Idempotent local Postgres start for miniApps.
 * Handles: already-running container, orphan name conflict, missing `docker compose` plugin on PATH.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const NAME = 'miniapps-postgres'
const IMAGE = 'postgres:16-alpine'
const VOLUME = 'miniapps_pg_data'
const PORT = '5433'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function sh(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...opts,
  })
}

function docker(args, opts = {}) {
  return sh('docker', args, opts)
}

function containerState() {
  const res = docker([
    'inspect',
    '-f',
    '{{.State.Running}}',
    NAME,
  ])
  if (res.status !== 0) return null
  return res.stdout.trim() === 'true' ? 'running' : 'stopped'
}

function ensureCliPluginsEnv() {
  const env = { ...process.env }
  const candidates = [
    path.join(process.env.HOME ?? '', '.docker/cli-plugins'),
    '/usr/local/lib/docker/cli-plugins',
    '/Applications/Docker.app/Contents/Resources/cli-plugins',
  ].filter((p) => p && existsSync(p))
  if (candidates.length === 0) return env
  const existing = env.DOCKER_CLI_PLUGIN_EXTRA_DIRS ?? ''
  env.DOCKER_CLI_PLUGIN_EXTRA_DIRS = [existing, ...candidates]
    .filter(Boolean)
    .join(path.delimiter)
  return env
}

function tryComposeUp() {
  const env = ensureCliPluginsEnv()
  const res = spawnSync('docker', ['compose', 'up', '-d', 'postgres'], {
    cwd: root,
    encoding: 'utf8',
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return res
}

function dockerRun() {
  // Prefer named volume used by earlier manual runs / compose project.
  const vols = docker(['volume', 'ls', '-q'])
  const volume =
    vols.stdout
      .split('\n')
      .map((v) => v.trim())
      .find((v) => v === VOLUME || v.endsWith('_miniapps_pg_data')) ?? VOLUME

  console.log(`Starting ${NAME} via docker run (volume=${volume}, port=${PORT})…`)
  const res = docker([
    'run',
    '-d',
    '--name',
    NAME,
    '-e',
    'POSTGRES_USER=miniapps',
    '-e',
    'POSTGRES_PASSWORD=miniapps',
    '-e',
    'POSTGRES_DB=miniapps',
    '-p',
    `${PORT}:5432`,
    '-v',
    `${volume}:/var/lib/postgresql/data`,
    '--health-cmd',
    'pg_isready -U miniapps -d miniapps',
    '--health-interval',
    '5s',
    '--health-timeout',
    '5s',
    '--health-retries',
    '10',
    IMAGE,
  ])
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout)
    process.exit(res.status ?? 1)
  }
  console.log(res.stdout.trim())
}

function sleep(ms) {
  spawnSync(process.execPath, ['-e', `Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,${ms})`], {
    stdio: 'ignore',
  })
}

function waitHealthy(timeoutMs = 30_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const res = docker([
      'inspect',
      '-f',
      '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}',
      NAME,
    ])
    const status = res.stdout.trim()
    if (status === 'healthy') return
    if (status === 'running') {
      const ready = docker([
        'exec',
        NAME,
        'pg_isready',
        '-U',
        'miniapps',
        '-d',
        'miniapps',
      ])
      if (ready.status === 0) return
    }
    sleep(500)
  }
  console.warn('Postgres started but health check timed out — continuing')
}

const state = containerState()
if (state === 'running') {
  console.log(`${NAME} already running on localhost:${PORT}`)
  process.exit(0)
}

if (state === 'stopped') {
  console.log(`Starting existing container ${NAME}…`)
  const res = docker(['start', NAME])
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout)
    process.exit(res.status ?? 1)
  }
  waitHealthy()
  console.log(`${NAME} started`)
  process.exit(0)
}

const compose = tryComposeUp()
if (compose.status === 0) {
  console.log(compose.stdout || `${NAME} started via docker compose`)
  waitHealthy()
  process.exit(0)
}

const err = `${compose.stderr || ''}${compose.stdout || ''}`
if (/already in use|Conflict/i.test(err)) {
  console.warn(
    `Compose conflict for ${NAME}; adopting existing container if present…`,
  )
  const again = containerState()
  if (again === 'running') {
    console.log(`${NAME} already running`)
    process.exit(0)
  }
  if (again === 'stopped') {
    execFileSync('docker', ['start', NAME], { stdio: 'inherit' })
    waitHealthy()
    process.exit(0)
  }
}

if (err.trim()) {
  console.warn('docker compose unavailable or failed; falling back to docker run')
  if (err.includes('unknown command') || err.includes('compose')) {
    // quiet
  } else {
    console.warn(err.trim().slice(0, 400))
  }
}

dockerRun()
waitHealthy()
console.log(`${NAME} ready — DATABASE_URL=postgresql://miniapps:miniapps@localhost:${PORT}/miniapps`)
