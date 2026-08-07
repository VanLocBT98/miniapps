/**
 * Deployable applications in this monorepo.
 *
 * Spec aliases: project-a → dashboard, project-b → admin, project-c → booking
 */
export const DEPLOY_APPS = [
  {
    id: 'main',
    label: 'Main',
    packageName: '@repo/main',
    rootDirectory: 'apps/main',
    pathGlobs: ['apps/main/**'],
    projectIdSecret: 'VERCEL_PROJECT_MAIN',
  },
  {
    id: 'project-a',
    label: 'Project A',
    packageName: '@repo/dashboard',
    rootDirectory: 'projects/dashboard',
    pathGlobs: ['projects/dashboard/**'],
    projectIdSecret: 'VERCEL_PROJECT_PROJECT_A',
  },
  {
    id: 'project-b',
    label: 'Project B',
    packageName: '@repo/admin',
    rootDirectory: 'projects/admin',
    pathGlobs: ['projects/admin/**'],
    projectIdSecret: 'VERCEL_PROJECT_PROJECT_B',
  },
  {
    id: 'project-c',
    label: 'Project C',
    packageName: '@repo/booking',
    rootDirectory: 'projects/booking',
    pathGlobs: ['projects/booking/**'],
    projectIdSecret: 'VERCEL_PROJECT_PROJECT_C',
  },
]

/** Shared packages — changes here force rebuild of every deployable app. */
export const SHARED_GLOBS = [
  'packages/**',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'turbo.json',
  'package.json',
]
