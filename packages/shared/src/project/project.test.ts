import { describe, expect, it } from 'vitest'
import { createProject, getNavigationForUser } from './index'

describe('createProject', () => {
  it('normalizes basePath and navigation', () => {
    const project = createProject({
      id: 'demo',
      name: 'Demo',
      basePath: 'demo',
      navigation: [{ id: 'home', label: 'Home', path: 'home' }],
      permissions: ['demo:view'],
      pages: [],
    })

    expect(project.basePath).toBe('/demo')
    expect(project.navigation[0]?.permissions).toEqual([])
  })

  it('filters navigation by permissions', () => {
    const project = createProject({
      id: 'demo',
      name: 'Demo',
      basePath: '/demo',
      navigation: [
        { id: 'a', label: 'A', path: '/demo', permissions: ['demo:view'] },
        { id: 'b', label: 'B', path: '/demo/secret', permissions: ['demo:admin'] },
      ],
      permissions: ['demo:view', 'demo:admin'],
      pages: [],
    })

    const nav = getNavigationForUser([project], ['demo:view'])
    expect(nav.map((n) => n.id)).toEqual(['a'])
  })
})
