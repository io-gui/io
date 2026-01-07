import { describe, it, expect } from 'vitest'
import { IoField } from '@io-gui/inputs'

const element = new IoField()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

describe('IoField.test', () => {
  it('Should have core API functions defined', () => {
    expect(typeof element.getCaretPosition).toBe('function')
    expect(typeof element.setCaretPosition).toBe('function')
  })
  it('Should initialize properties correctly', () => {
    expect(element.value).toBe('')
    expect(element.selected).toBe(false)
    expect(element._reactiveProperties.get('value')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: false,
      type: undefined,
      value: '',
      observer: {type: 'none', observing: false},
    })
    expect(element._reactiveProperties.get('selected')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: true,
      type: Boolean,
      value: false,
      observer: {type: 'none', observing: false},
    })
    expect(element.spellcheck).toBe(false)
  })
  it('has correct default attributes', () => {
    expect(element.getAttribute('icon')).toBe(null)
    expect(element.getAttribute('stroke')).toBe(null)
    expect(element.getAttribute('value')).toBe(null)
    expect(element.getAttribute('selected')).toBe(null)
  })
  it('has correct default innerHTML', () => {
    expect(element.innerHTML).toBe('')
  })
  it('has reactive attributes', () => {
    expect(element.getAttribute('selected')).toBe(null)
    element.selected = true
    expect(element.getAttribute('selected')).toBe('')
    element.selected = false
  })
})
