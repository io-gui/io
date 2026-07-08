import { describe, it, expect } from 'vitest'
import { IoOverlaySingleton, ReactiveElement, Register, PropertyDefinitions, nextFrame } from '@io-gui/core'

@Register
class OverlayChild extends ReactiveElement {
  static override get Properties(): PropertyDefinitions {
    return { expanded: { type: Boolean, value: false } }
  }
  declare expanded: boolean
}

describe('IoOverlay', () => {
  it('Should initialize properties correctly', () => {
    expect(IoOverlaySingleton.expanded).toEqual(false)
    expect(IoOverlaySingleton._properties.get('expanded')).toEqual({
      binding: undefined,
      init: undefined,
      reflect: true,
      type: Boolean,
      value: false,
      observer: {type: 'none', observing: false},
    })
  })
  it('expanded toggles when child expands', async () => {
    const child = new OverlayChild()
    IoOverlaySingleton.appendChild(child as HTMLElement)
    child.expanded = true
    await nextFrame()
    expect(IoOverlaySingleton.expanded).toBe(true)
    IoOverlaySingleton.removeChild(child as HTMLElement)
    child.dispose()
  })
  it('expandedChanged collapses children', async () => {
    const child = new OverlayChild()
    IoOverlaySingleton.appendChild(child as HTMLElement)
    child.expanded = true
    await nextFrame()
    IoOverlaySingleton.expanded = false
    await nextFrame()
    expect(child.expanded).toBe(false)
    IoOverlaySingleton.removeChild(child as HTMLElement)
    child.dispose()
  })
})
