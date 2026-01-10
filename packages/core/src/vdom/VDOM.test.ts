import { describe, it, expect } from 'vitest'
import { Register, IoElement, applyNativeElementProps, constructElement, div, span, ReactivePropertyDefinitions } from '@io-gui/core'

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
  it('Should clear text content when reusing element with undefined children', () => {
    // This test verifies that when a span with text content is reused
    // for a vDOM element with undefined children, the text content is cleared.
    // Bug scenario: IoTab renders [span.drop-marker, span.label("Text"), ...]
    // When tab selection changes, positions shift and span.label becomes span.drop-marker
    // The text content "Text" should be cleared but wasn't due to the bug.

    @Register
    class TestVDOMClearChildren extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          showMarker: false,
        }
      }
      declare showMarker: boolean
      ready() {
        this.changed()
      }
      changed() {
        // Mimics IoTab render pattern where selected tab has a drop-marker span
        // and all tabs have a label span. When showMarker changes, the first
        // span switches between drop-marker (no children) and label (with text).
        if (this.showMarker) {
          this.render([
            span({class: 'drop-marker'}),  // no children - should be empty
            span({class: 'label'}, 'Label Text'),
          ])
        } else {
          this.render([
            span({class: 'label'}, 'Label Text'),
          ])
        }
      }
    }

    const element = new TestVDOMClearChildren()
    document.body.appendChild(element as unknown as HTMLElement)

    // Initial render without marker - just the label span
    expect(element.children.length).toBe(1)
    expect(element.children[0].className).toBe('label')
    expect(element.children[0].textContent).toBe('Label Text')

    // Now show marker - first span should be drop-marker with NO text content
    element.showMarker = true
    expect(element.children.length).toBe(2)
    expect(element.children[0].className).toBe('drop-marker')
    // BUG: The drop-marker span inherited text content from the previous label span
    // because it was reused (same tag 'span') and vChild.children was undefined
    expect(element.children[0].textContent).toBe('')  // This should pass after fix
    expect(element.children[1].className).toBe('label')
    expect(element.children[1].textContent).toBe('Label Text')

    element.remove()
  })
})
