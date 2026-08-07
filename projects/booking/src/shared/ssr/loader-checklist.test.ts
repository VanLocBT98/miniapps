import { describe, expect, it } from 'vitest'
import { bookingSsrLoaderChecklist } from './loader-checklist'
import * as apis from '@/shared/services/apis/apis'
import { bookingDetailHead, bookingListHead } from './booking-head'

describe('bookingSsrLoaderChecklist', () => {
  it('covers list + detail nested routes', () => {
    const routes = bookingSsrLoaderChecklist.map((r) => r.route)
    expect(routes).toContain('/booking')
    expect(routes).toContain('/booking/$bookingId')
    expect(routes).toContain('/booking/$bookingId/documents')
  })

  it('references exported query option factories', () => {
    for (const entry of bookingSsrLoaderChecklist) {
      for (const name of entry.queries) {
        expect(apis).toHaveProperty(name)
        expect(typeof (apis as Record<string, unknown>)[name]).toBe(
          name === 'bookingsQueryOptions' ? 'object' : 'function',
        )
      }
    }
  })

  it('head helpers are serializable plain objects', () => {
    const detail = bookingDetailHead(undefined)
    const list = bookingListHead()
    expect(JSON.parse(JSON.stringify(detail))).toEqual(detail)
    expect(JSON.parse(JSON.stringify(list))).toEqual(list)
  })
})
