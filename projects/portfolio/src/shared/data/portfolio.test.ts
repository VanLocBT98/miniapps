import { describe, expect, it } from 'vitest'
import { getPortfolioData } from '../services/apis/apis'

describe('portfolio data', () => {
  it('parses canonical JSON', () => {
    const data = getPortfolioData()
    expect(data.profile.name).toBe('Van Loc')
    expect(data.profile.nickname).toBe('Leo')
    expect(data.profile.githubUsername).toBe('VanLocBT98')
    expect(data.meta.siteTitle).toBe('Leo Portfolio')
    expect(data.nav.length).toBeGreaterThan(0)
    expect(data.experiences.length).toBeGreaterThan(0)
    expect(data.three.enabled).toBe(true)
    expect(data.three.pointCount).toBeGreaterThan(0)
  })
})
