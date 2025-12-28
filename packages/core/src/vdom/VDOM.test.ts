import { describe, it, expect } from 'vitest'
import { applyNativeElementProps, constructElement, div } from '@io-gui/core'

describe('VDOM', () => {
  it('Should construct an native DIV element', () => {
    const element = constructElement(div())
    expect(element).toBeDefined()
    expect(element.localName).toBe('div')
  })
  it('Should apply native element properties to the native DIV element', () => {
    const element = document.createElement('div')

    applyNativeElementProps(element, {
      tabIndex: 0,
      contentEditable: true,
      spellcheck: false,
    })

    expect(element.tabIndex).toBe(0)
    expect(element.contentEditable).toBe('true')
    expect(element.spellcheck).toBe(false)

    expect(element.getAttribute('tabindex')).toBe('0')
    expect(element.getAttribute('contenteditable')).toBe('true')
    expect(element.getAttribute('spellcheck')).toBe('false')

    applyNativeElementProps(element, {
      tabIndex: undefined,
      contentEditable: undefined,
      spellcheck: undefined,
    })

    expect(element.tabIndex).toBe(-1)
    expect(element.contentEditable).toBe('inherit')
    expect(element.spellcheck).toBe(true)

    expect(element.getAttribute('tabindex')).toBe(null)
    expect(element.getAttribute('contenteditable')).toBe(null)
    expect(element.getAttribute('spellcheck')).toBe(null)
  })
  it('Should reset properties to defaults if they are not in the props when the element is updated after initial applyNativeElementProps', () => {
    const element = document.createElement('div')
    applyNativeElementProps(element, {
      tabIndex: 0,
      contentEditable: true,
      spellcheck: false,
    })

    expect(element.tabIndex).toBe(0)
    expect(element.contentEditable).toBe('true')
    expect(element.spellcheck).toBe(false)

    expect(element.getAttribute('tabindex')).toBe('0')
    expect(element.getAttribute('contenteditable')).toBe('true')
    expect(element.getAttribute('spellcheck')).toBe('false')

    applyNativeElementProps(element, {
      tabIndex: 1,
      contentEditable: undefined,
      spellcheck: undefined,
    })

    expect(element.tabIndex).toBe(1)
    expect(element.contentEditable).toBe('inherit')
    expect(element.spellcheck).toBe(true)

    expect(element.getAttribute('tabindex')).toBe('1')
    expect(element.getAttribute('contenteditable')).toBe(null)
    expect(element.getAttribute('spellcheck')).toBe(null)
  })
})
