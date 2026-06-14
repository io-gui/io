import { describe, it, expect } from 'vitest'
import { IoOverlaySingleton, IoElement, Register, ReactivePropertyDefinitions, nextQueue } from '@io-gui/core'

@Register
class OverlayChild extends IoElement {
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    return { expanded: { type: Boolean, value: false } }
  }
  declare expanded: boolean
}

describe('IoOverlay', () => {
  it('Should initialize properties correctly', () => {
    expect(IoOverlaySingleton.expanded).toEqual(false)
    expect(IoOverlaySingleton._reactiveProperties.get('expanded')).toEqual({
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
    await nextQueue()
    expect(IoOverlaySingleton.expanded).toBe(true)
    IoOverlaySingleton.removeChild(child as HTMLElement)
    child.dispose()
  })
  it('expandedChanged collapses children', async () => {
    const child = new OverlayChild()
    IoOverlaySingleton.appendChild(child as HTMLElement)
    child.expanded = true
    await nextQueue()
    IoOverlaySingleton.expanded = false
    await nextQueue()
    expect(child.expanded).toBe(false)
    IoOverlaySingleton.removeChild(child as HTMLElement)
    child.dispose()
  })
})
