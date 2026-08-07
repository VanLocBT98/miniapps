import { afterEach, describe, expect, it } from 'vitest'
import { resetApiClient, resolveApiBaseUrl } from './client'

afterEach(() => {
  resetApiClient()
})

describe('resolveApiBaseUrl', () => {
  it('prefers VITE_API_URL', () => {
    expect(resolveApiBaseUrl({ VITE_API_URL: 'https://custom.example/' })).toBe(
      'https://custom.example',
    )
  })

  it('defaults development to localhost:3001', () => {
    expect(resolveApiBaseUrl({ NODE_ENV: 'development' })).toBe('http://localhost:3001')
  })

  it('defaults staging host', () => {
    expect(resolveApiBaseUrl({ VITE_APP_ENV: 'staging' })).toBe(
      'https://staging-api-mini-apps.vercel.app',
    )
  })

  it('defaults production host', () => {
    expect(resolveApiBaseUrl({ NODE_ENV: 'production' })).toBe(
      'https://api-mini-apps.vercel.app',
    )
  })
})
