#!/usr/bin/env node
/**
 * stop hook: if a requirements run is active, auto-continue with the next ACTION.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const runStatePath = path.join(root, '.req', 'req-run.json')

function readStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

const input = readStdin()
if (input.status && input.status !== 'completed') {
  process.stdout.write('{}\n')
  process.exit(0)
}

if (!fs.existsSync(runStatePath)) {
  process.stdout.write('{}\n')
  process.exit(0)
}

let run
try {
  run = JSON.parse(fs.readFileSync(runStatePath, 'utf8'))
} catch {
  process.stdout.write('{}\n')
  process.exit(0)
}

const projectId = run?.projectId
if (!projectId) {
  process.stdout.write('{}\n')
  process.exit(0)
}

const result = spawnSync(
  process.execPath,
  [path.join(root, 'scripts', 'req-action.mjs'), 'next', projectId],
  { encoding: 'utf8' },
)

let payload
try {
  payload = JSON.parse(result.stdout || '{}')
} catch {
  process.stdout.write('{}\n')
  process.exit(0)
}

if (!payload.ok || !payload.next) {
  // Queue empty → clear run
  try {
    fs.unlinkSync(runStatePath)
  } catch {
    /* ignore */
  }
  process.stdout.write(
    JSON.stringify({
      followup_message: `Requirements run for \`${projectId}\` is complete (no pending ACTIONS). Append CHANGELOG, prune living REQUIREMENTS, then stop.`,
    }) + '\n',
  )
  process.exit(0)
}

const n = payload.next
const readList = (n.read ?? []).map((p) => `\`${p}\``).join(', ')
const msg = [
  `Continue requirements run for \`${projectId}\` — next ACTION only:`,
  ``,
  `**${n.id}**: ${n.title}`,
  readList ? `Read first: ${readList}` : null,
  ``,
  n.do || '(see ACTIONS.md)',
  ``,
  `When done: \`pnpm req:done ${projectId} ${n.id}\`, append \`docs/projects/${projectId}/CHANGELOG.md\`, check off related items in \`11-todo.md\` if present, then stop so the hook can pick the next ACTION.`,
]
  .filter(Boolean)
  .join('\n')

process.stdout.write(JSON.stringify({ followup_message: msg }) + '\n')
process.exit(0)
