import { describe, it, expect } from 'vitest'
import { IoNumberSliderRange } from '@io-gui/sliders'

const element = new IoNumberSliderRange()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

function reset() {
  element.value = [0, 1]
  element.step = 0.01
  element.min = 0
  element.max = 1
}

describe('io-number-slider-range.test', () => {
  it('has default values', () => {
    reset()
    expect(element.value[0]).toBe(0)
    expect(element.value[1]).toBe(1)
    expect(element.step).toBe(0.01)
    expect(element.min).toBe(0)
    expect(element.max).toBe(1)
  })
  it('matches values', () => {
    reset()
    element.value = [0, 1]
    expect(element.$.number0.innerText).toBe('0')
    element.value = [1, 1]
    expect(element.$.number0.innerText).toBe('1')
    expect(element.$.number1.innerText).toBe('1')
    element.value = [0, 0.1]
    expect(element.$.number1.innerText).toBe('0.1')
    element.value = [0, 0.001]
    expect(element.$.number1.innerText).toBe('0')
  })
  it('has tabIndex attribute', () => {
    reset()
    expect(element.$.number0.getAttribute('tabIndex')).toBe('0')
    expect(element.$.slider.getAttribute('tabIndex')).toBe('0')
  })
  it('has contenteditable attribute on number field', () => {
    reset()
    expect(element.getAttribute('contenteditable')).toBe(null)
    expect(element.$.number0.getAttribute('contenteditable')).toBe('true')
    expect(element.$.number1.getAttribute('contenteditable')).toBe('true')
    expect(element.$.slider.getAttribute('contenteditable')).toBe(null)
  })
  it('has a11y attributes', () => {
    reset()
    expect(element.$.slider.getAttribute('role')).toBe('slider')
    element.min = 0
    expect(element.$.slider.getAttribute('aria-valuemin')).toBe('0')
    element.max = 1
    expect(element.$.slider.getAttribute('aria-valuemax')).toBe('1')
    reset()
  })
})
