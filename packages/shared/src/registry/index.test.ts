import { describe, expect, it, beforeEach } from 'vitest'
import {
  clearRegistryCache,
  loadProjectRegistry,
  portalProjectPath,
  getRegistryProject,
} from './index'

describe('loadProjectRegistry', () => {
  beforeEach(() => {
    clearRegistryCache()
  })

  it('injects hosts from env keys', () => {
    const registry = loadProjectRegistry({
      env: {
        VITE_PROJECT_BOOKING_HOST: 'https://booking.vercel.app/',
        VITE_PORTAL_HOST: 'https://main.vercel.app',
      },
      bustCache: true,
    })
    const booking = getRegistryProject(registry, 'booking')
    expect(booking?.host).toBe('https://booking.vercel.app')
    expect(registry.portalHost).toBe('https://main.vercel.app')
  })

  it('keeps host null when env missing', () => {
    const registry = loadProjectRegistry({ env: {}, bustCache: true })
    expect(getRegistryProject(registry, 'dashboard')?.host).toBeNull()
  })

  it('builds portal paths', () => {
    expect(portalProjectPath('booking')).toBe('/project/booking')
    expect(portalProjectPath('booking', 'detail/1')).toBe(
      '/project/booking/detail/1',
    )
  })
})
