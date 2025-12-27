import { describe, it, expect } from 'vitest'
import { IoSlider2d } from '@io-gui/sliders'

const element = new IoSlider2d()

describe('IoSlider2d', () => {
  it('has default values', () => {
    expect(element.value).toEqual([0, 0])
    expect(element.step).toEqual([0.01, 0.01])
    expect(element.min).toEqual([-1, -1])
    expect(element.max).toEqual([1, 1])
  })
  it('has tabIndex attribute', () => {
    expect(element.getAttribute('tabIndex')).toBe('0')
  })
  it('has contenteditable attribute on number field', () => {
    expect(element.getAttribute('contenteditable')).toBe(null)
  })
  it('has a11y attributes', () => {
    expect(element.getAttribute('role')).toBe('slider')
    element.value = [0.1, 0.1]
    expect(element.getAttribute('aria-valuenow')).toBe('0.1')
    element.min = [0, 0]
    expect(element.getAttribute('aria-valuemin')).toBe('0')
    element.max = [1, 1]
    expect(element.getAttribute('aria-valuemax')).toBe('1')
  })
})
