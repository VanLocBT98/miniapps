#!/usr/bin/env node
/**
 * Requirements action runner helpers.
 *
 * Usage:
 *   node scripts/req-action.mjs next [projectId]
 *   node scripts/req-action.mjs status [projectId]
 *   node scripts/req-action.mjs start <projectId>
 *   node scripts/req-action.mjs stop
 *   node scripts/req-action.mjs done <projectId> <actionId>
 *
 * ACTIONS.md format (under docs/projects/<id>/requirements/ACTIONS.md):
 *
 * ---
 * runMode: manual | continue
 * ---
 *
 * ## Queue
 *
 * ### action-id
 * - [ ] Title
 * - read: `00-overview.md`, `04-data-model.md`
 * - do: Concrete implementation steps for the agent
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runStatePath = path.join(root, '.req', 'req-run.json')
const projectsRoot = path.join(root, 'docs', 'projects')

function listProjects() {
  return fs
    .readdirSync(projectsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== '_TEMPLATE')
    .map((d) => d.name)
}

function actionsPath(projectId) {
  return path.join(projectsRoot, projectId, 'requirements', 'ACTIONS.md')
}

function livingPath(projectId) {
  return path.join(projectsRoot, projectId, 'REQUIREMENTS.md')
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { meta: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return { meta: {}, body: raw }
  const fm = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\n/, '')
  const meta = {}
  for (const line of fm.split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.+)$/)
    if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return { meta, body }
}

function parseQueue(body) {
  const actions = []
  const parts = body.split(/^### /m).slice(1)
  for (const part of parts) {
    const lines = part.split('\n')
    const id = lines[0]?.trim()
    if (!id) continue
    const block = lines.slice(1).join('\n')
    const check = block.match(/^- \[( |x|X)\] (.+)$/m)
    if (!check) continue
    const done = check[1].toLowerCase() === 'x'
    const title = check[2].trim()
    const read =
      block
        .match(/^- read:\s*(.+)$/m)?.[1]
        ?.split(',')
        .map((s) => s.trim().replace(/^[`']|[`']$/g, ''))
        .filter(Boolean) ?? []
    const doMatch = block.match(/^- do:\s*(.+)$/m)
    const doit = (doMatch?.[1] ?? '').trim()
    actions.push({ id, title, done, read, do: doit })
  }
  return actions
}

function loadActions(projectId) {
  const file = actionsPath(projectId)
  if (!fs.existsSync(file)) {
    return { projectId, meta: {}, actions: [], file, missing: true }
  }
  const raw = fs.readFileSync(file, 'utf8')
  const { meta, body } = parseFrontmatter(raw)
  return {
    projectId,
    meta,
    actions: parseQueue(body),
    file,
    missing: false,
    raw,
  }
}

function nextAction(projectId) {
  const data = loadActions(projectId)
  const next = data.actions.find((a) => !a.done)
  return { ...data, next }
}

function readRunState() {
  try {
    return JSON.parse(fs.readFileSync(runStatePath, 'utf8'))
  } catch {
    return null
  }
}

function writeRunState(state) {
  fs.mkdirSync(path.dirname(runStatePath), { recursive: true })
  if (!state) {
    if (fs.existsSync(runStatePath)) fs.unlinkSync(runStatePath)
    return
  }
  fs.writeFileSync(runStatePath, JSON.stringify(state, null, 2) + '\n')
}

function markDone(projectId, actionId) {
  const data = loadActions(projectId)
  if (data.missing) throw new Error(`No ACTIONS.md for ${projectId}`)
  const re = new RegExp(`(### ${actionId}\\n- \\[) \\]`, 'm')
  if (!re.test(data.raw)) {
    throw new Error(`Action ${actionId} not found or already done in ${projectId}`)
  }
  const updated = data.raw.replace(re, '$1x]')
  fs.writeFileSync(data.file, updated)
  return nextAction(projectId)
}

function printNext(projectId) {
  const { next, file, missing, meta, actions } = nextAction(projectId)
  if (missing) {
    console.log(JSON.stringify({ ok: false, error: `Missing ${file}` }, null, 2))
    process.exitCode = 1
    return
  }
  const pending = actions.filter((a) => !a.done).length
  const done = actions.filter((a) => a.done).length
  console.log(
    JSON.stringify(
      {
        ok: true,
        projectId,
        runMode: meta.runMode ?? 'manual',
        file,
        living: livingPath(projectId),
        progress: { done, pending, total: actions.length },
        next: next
          ? {
              id: next.id,
              title: next.title,
              read: next.read.map(
                (r) => `docs/projects/${projectId}/requirements/${r.replace(/^.*\//, '')}`,
              ),
              do: next.do,
            }
          : null,
      },
      null,
      2,
    ),
  )
}

function printStatus(projectId) {
  const ids = projectId ? [projectId] : listProjects()
  const run = readRunState()
  const rows = ids.map((id) => {
    const { actions, missing, meta, next } = nextAction(id)
    if (missing) return { projectId: id, missing: true }
    return {
      projectId: id,
      runMode: meta.runMode ?? 'manual',
      done: actions.filter((a) => a.done).length,
      pending: actions.filter((a) => !a.done).length,
      nextId: next?.id ?? null,
      nextTitle: next?.title ?? null,
      activeRun: run?.projectId === id,
    }
  })
  console.log(JSON.stringify({ activeRun: run, projects: rows }, null, 2))
}

const [cmd, arg1, arg2] = process.argv.slice(2)

switch (cmd) {
  case 'next': {
    const id = arg1 ?? readRunState()?.projectId
    if (!id) {
      console.error('Usage: req-action next <projectId>')
      process.exit(1)
    }
    printNext(id)
    break
  }
  case 'status':
    printStatus(arg1)
    break
  case 'start': {
    if (!arg1) {
      console.error('Usage: req-action start <projectId>')
      process.exit(1)
    }
    const data = nextAction(arg1)
    if (data.missing) {
      console.error(`Missing ACTIONS.md for ${arg1}`)
      process.exit(1)
    }
    writeRunState({
      projectId: arg1,
      startedAt: new Date().toISOString(),
      runMode: data.meta.runMode ?? 'continue',
    })
    // Force continue while a run is active
    if (fs.existsSync(data.file) && data.meta.runMode !== 'continue') {
      const raw = fs.readFileSync(data.file, 'utf8')
      const bumped = raw.replace(/runMode:\s*\w+/, 'runMode: continue')
      if (bumped !== raw) fs.writeFileSync(data.file, bumped)
    }
    printNext(arg1)
    break
  }
  case 'stop':
    writeRunState(null)
    console.log(JSON.stringify({ ok: true, stopped: true }, null, 2))
    break
  case 'done': {
    if (!arg1 || !arg2) {
      console.error('Usage: req-action done <projectId> <actionId>')
      process.exit(1)
    }
    const after = markDone(arg1, arg2)
    console.log(
      JSON.stringify(
        {
          ok: true,
          marked: arg2,
          next: after.next
            ? { id: after.next.id, title: after.next.title }
            : null,
        },
        null,
        2,
      ),
    )
    break
  }
  default:
    console.error(`Unknown command: ${cmd ?? '(none)'}
Commands: next | status | start | stop | done`)
    process.exit(1)
}
