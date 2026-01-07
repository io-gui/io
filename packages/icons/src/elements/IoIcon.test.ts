import { describe, it, expect } from 'vitest'
import { IoIcon, IconsetSingleton } from '@io-gui/icons'

const element = new IoIcon({ value: '' })
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

describe('IoIcon.test', () => {
  it('Should initialize properties correctly', () => {
    expect(element.value).toBe('')
    expect(element.stroke).toBe(false)
    expect(element._reactiveProperties.get('value')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: true,
      type: String,
      value: '',
      observer: {type: 'none', observing: false},
    })
    expect(element._reactiveProperties.get('stroke')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: true,
      type: Boolean,
      value: false,
      observer: {type: 'none', observing: false},
    })
  })
  it('has correct default attributes', () => {
    expect(element.getAttribute('value')).toBe(null)
    expect(element.getAttribute('stroke')).toBe(null)
  })
  it('has correct default innerHTML', () => {
    expect(element.innerHTML).toBe('')
  })
  it('should set innerHTML to match value property', () => {
    element.value = 'io:check'
    expect(element.innerHTML).toBe(IconsetSingleton.getIcon('io:check'))
    element.value = '#'
    expect(element.innerHTML).toBe('#')
    element.value = ''
  })
  it('has reactive attributes', () => {
    element.value = 'text'
    expect(element.getAttribute('value')).toBe('text')
    element.value = ''
    element.stroke = true
    expect(element.getAttribute('stroke')).toBe('')
    element.stroke = false
  })
})
