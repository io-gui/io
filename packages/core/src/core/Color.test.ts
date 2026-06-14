import { describe, it, expect } from 'vitest'
import { Color } from '@io-gui/core'

describe('Color', () => {
  it('toCss formats rgba', () => {
    const color = new Color(0.5, 0.6, 0.7, 0.8)
    expect(color.toCss()).toBe('rgba(127, 153, 178, 0.8)')
  })

  it('toJSON and applyJSON round-trip rgba', () => {
    const color = new Color(0.2, 0.4, 0.95, 0.8)
    const hex = color.toJSON()
    const roundTrip = new Color(0, 0, 0, 1)
    roundTrip.applyJSON(hex)
    expect(roundTrip.toJSON()).toBe(hex)
    expect(roundTrip.a).toBeCloseTo(color.a)
  })

  it('toJSON packs alpha in the high byte', () => {
    const color = new Color(1, 0.2, 0)
    expect(color.toJSON()).toBe(0xffff3300)
  })

  it('applyJSON reads legacy 24-bit rgb as opaque', () => {
    const color = new Color(0, 0, 0, 1)
    color.applyJSON(0x333333)
    expect(color.r).toBeCloseTo(0.2)
    expect(color.g).toBeCloseTo(0.2)
    expect(color.b).toBeCloseTo(0.2)
    expect(color.a).toBe(1)
  })

  it('applyJSON reads alpha from 32-bit hex', () => {
    const color = new Color(0, 0, 0, 1)
    color.applyJSON(new Color(0, 0, 0, 0.2).toJSON())
    expect(color.r).toBe(0)
    expect(color.g).toBe(0)
    expect(color.b).toBe(0)
    expect(color.a).toBeCloseTo(0.2)
  })
})
