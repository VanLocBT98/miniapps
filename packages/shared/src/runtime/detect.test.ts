import { describe, expect, it } from 'vitest'
import { detectRuntime, isPortalMode, portalHomePath } from './detect'

describe('detectRuntime', () => {
  it('defaults to STANDALONE', () => {
    const rt = detectRuntime({
      href: 'https://booking.example.com/detail/1',
      currentHost: 'https://booking.example.com',
    })
    expect(rt.mode).toBe('STANDALONE')
    expect(isPortalMode(rt)).toBe(false)
  })

  it('detects PORTAL from /project/:id path', () => {
    const rt = detectRuntime({
      href: 'https://main.example.com/project/booking/list',
      currentHost: 'https://main.example.com',
    })
    expect(rt.mode).toBe('PORTAL')
    expect(rt.currentProject).toBe('booking')
  })

  it('detects PORTAL from query flags', () => {
    const rt = detectRuntime({
      href: 'https://booking.example.com/detail/1?mode=portal&portalHost=https://main.example.com',
      currentHost: 'https://booking.example.com',
    })
    expect(rt.mode).toBe('PORTAL')
    expect(rt.portalHost).toBe('https://main.example.com')
    expect(portalHomePath(rt)).toBe('https://main.example.com/')
  })
})
