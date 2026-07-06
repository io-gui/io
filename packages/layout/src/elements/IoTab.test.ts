//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoTab, Tab, IoLayout, Layout } from '@io-gui/layout'

function mountTabInLayout(container: HTMLElement, tabData: { id: string, label?: string, icon?: string, selected?: boolean }) {
  const layoutModel = new Layout({
    child: {
      type: 'split',
      children: [{ type: 'panel', tabs: [tabData] }],
    },
  })
  const layout = new IoLayout({ model: layoutModel, elements: [] })
  container.appendChild(layout)
  return {
    layout,
    ioTab: layout.querySelector('io-tab') as IoTab,
  }
}

describe('IoTab', () => {
  let tab: Tab
  let ioTab: IoTab
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    tab = new Tab({ id: 'test-tab', label: 'Test Tab', icon: 'io:test' })
    ioTab = new IoTab({ model: tab })
    container.appendChild(ioTab)
  })

  afterEach(() => {
    ioTab.remove()
    container.remove()
    tab.dispose()
  })

  describe('Construction', () => {
    it('should construct with a Tab domain model', () => {
      expect(ioTab.model).toBe(tab)
    })

    it('should have expected default properties', () => {
      expect(ioTab.overflow).toBe(false)
    })

    it('should set tab property as reactive', () => {
      const newTab = new Tab({ id: 'new-tab' })
      ioTab.model = newTab
      expect(ioTab.model).toBe(newTab)
      newTab.dispose()
    })
  })

  describe('Rendering', () => {
    it('should render icon from tab.icon', () => {
      const icon = ioTab.querySelector('.io-tab-icon')
      expect(icon).toBeTruthy()
    })

    it('should render label from tab.label', () => {
      const span = ioTab.querySelector('.io-tab-label')
      expect(span?.textContent).toBe('Test Tab')
    })

    it('should update selected attribute when tab.selected changes', () => {
      expect(ioTab.hasAttribute('selected')).toBe(false)
      tab.selected = true
      expect(ioTab.hasAttribute('selected')).toBe(true)
    })

    it('should update label when tab.label changes', () => {
      tab.label = 'Updated Label'
      const span = ioTab.querySelector('.io-tab-label')
      expect(span?.textContent).toBe('Updated Label')
    })

    it('should update icon when tab.icon changes', () => {
      const icon = ioTab.querySelector('.io-tab-icon') as HTMLElement
      expect(icon).toBeTruthy()
      tab.icon = 'io:new-icon'
      expect(icon.getAttribute('value')).toBe('io:new-icon')
    })

    it('should not render icon when tab has no icon', () => {
      const noIconTab = new Tab({ id: 'no-icon' })
      const noIconIoTab = new IoTab({ model: noIconTab })
      container.appendChild(noIconIoTab)

      const icon = noIconIoTab.querySelector('.io-tab-icon')
      expect(icon).toBeNull()

      noIconIoTab.remove()
      noIconTab.dispose()
    })
  })

  describe('Tab Mutation Handling', () => {
    it('should call changed when modelMutated is invoked', () => {
      const changedSpy = vi.spyOn(ioTab, 'mutated')
      ioTab.modelMutated()
      expect(changedSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Overflow Detection', () => {
    it('should set overflow attribute based on text overflow', () => {
      expect(ioTab.overflow).toBe(false)
    })

    it('should detect overflow on resize', () => {
      const span = ioTab.querySelector('.io-tab-label') as HTMLElement
      Object.defineProperty(span, 'scrollWidth', { value: 200, configurable: true })
      Object.defineProperty(span, 'clientWidth', { value: 100, configurable: true })

      ioTab.onResized()
      expect(ioTab.overflow).toBe(true)
    })

    it('should not set overflow when text fits', () => {
      const span = ioTab.querySelector('.io-tab-label') as HTMLElement
      Object.defineProperty(span, 'scrollWidth', { value: 50, configurable: true })
      Object.defineProperty(span, 'clientWidth', { value: 100, configurable: true })

      ioTab.onResized()
      expect(ioTab.overflow).toBe(false)
    })
  })

  describe('Pointer Events - Basic', () => {
    it('should capture pointer on pointerdown', () => {
      const captureSpy = vi.spyOn(ioTab, 'setPointerCapture')
      const event = new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      })

      ioTab.onPointerdown(event)

      expect(captureSpy).toHaveBeenCalledWith(1)
    })

    it('should release pointer capture on pointerup', () => {
      const releaseSpy = vi.spyOn(ioTab, 'releasePointerCapture')
      const event = new PointerEvent('pointerup', {
        pointerId: 1,
        buttons: 0,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      })

      ioTab.onPointerup(event)

      expect(releaseSpy).toHaveBeenCalledWith(1)
    })

    it('should dispatch drag cancel on pointerleave', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      const event = new PointerEvent('pointerleave', {
        bubbles: true,
        cancelable: true,
      })

      ioTab.onPointerleave(event)

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({ phase: 'cancel' }),
      }))
    })

    it('should prevent touchmove default', () => {
      const event = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
      })
      const preventSpy = vi.spyOn(event, 'preventDefault')

      ioTab.onTouchmove(event)

      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe('Drag Events', () => {
    it('should not dispatch drag start until 10px threshold is exceeded', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 105,
        clientY: 105,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler).not.toHaveBeenCalled()
    })

    it('should dispatch drag start after moving more than 10px horizontally', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({
        detail: { model: tab, phase: 'start', x: 115, y: 100 },
      }))
    })

    it('should dispatch drag start after moving more than 10px vertically', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 115,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({ phase: 'start' }),
      }))
    })

    it('should dispatch drag start when threshold exceeded during pointermove', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 0,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({ phase: 'start' }),
      }))
    })

    it('should dispatch drag move and end events during drag', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 200,
        clientY: 150,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointerup(new PointerEvent('pointerup', {
        pointerId: 1,
        buttons: 0,
        clientX: 200,
        clientY: 150,
        bubbles: true,
        cancelable: true,
      }))

      const phases = handler.mock.calls.map(call => call[0].detail.phase)
      expect(phases).toEqual(['start', 'move', 'end'])
    })

    it('should position drag ghost at cursor when mounted in layout', () => {
      const { layout, ioTab: layoutTab } = mountTabInLayout(container, { id: 'drag-tab', label: 'Drag Tab' })

      layoutTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      layoutTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      expect(layout.$tabDragGhost.expanded).toBe(true)
      expect(layout.$tabDragGhost.style.left).toBe('115px')
      expect(layout.$tabDragGhost.style.top).toBe('100px')

      layoutTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 200,
        clientY: 150,
        bubbles: true,
        cancelable: true,
      }))

      expect(layout.$tabDragGhost.style.left).toBe('200px')
      expect(layout.$tabDragGhost.style.top).toBe('150px')

      layout.remove()
    })
  })

  describe('Pointer Cancel', () => {
    it('should dispatch drag cancel on pointer cancel', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-drag', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointercancel(new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({ phase: 'cancel' }),
      }))
    })

    it('should stop propagation on cancel', () => {
      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      const cancelEvent = new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      const stopSpy = vi.spyOn(cancelEvent, 'stopPropagation')

      ioTab.onPointercancel(cancelEvent)

      expect(stopSpy).toHaveBeenCalled()
    })
  })

  describe('Click Behavior', () => {
    it('should dispatch io-tab-action with select action on click when not dragging', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-action', handler)

      ioTab.onClick()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.model).toBe(tab)
      expect(handler.mock.calls[0][0].detail.action).toBe('select')
    })

    it('should NOT invoke onClick when dragging', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-action', handler)

      ioTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      ioTab.onClick()

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Close Click', () => {
    it('should dispatch io-tab-action with delete action on close click', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-action', handler)

      ioTab.onClose(new PointerEvent('click', { bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.model).toBe(tab)
      expect(handler.mock.calls[0][0].detail.action).toBe('delete')
    })
  })

  describe('Keyboard Events', () => {
    const shiftKeys = [
      ['Backspace', 'delete'],
      ['ArrowLeft', 'move-left'],
      ['ArrowRight', 'move-right'],
      ['Home', 'move-start'],
      ['End', 'move-end'],
    ] as const

    shiftKeys.forEach(([key, action]) => {
      it(`should dispatch io-tab-action on Shift+${key}`, () => {
        const handler = vi.fn()
        ioTab.addEventListener('io-tab-action', handler)

        const event = new KeyboardEvent('keydown', {
          key,
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        })
        const preventSpy = vi.spyOn(event, 'preventDefault')

        ioTab.onKeydown(event)

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler.mock.calls[0][0].detail.model).toBe(tab)
        expect(handler.mock.calls[0][0].detail.action).toBe(action)
        expect(preventSpy).toHaveBeenCalled()
      })
    })

    it('should NOT dispatch io-tab-action without Shift modifier', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-action', handler)

      const event = new KeyboardEvent('keydown', {
        key: 'Backspace',
        shiftKey: false,
        bubbles: true,
        cancelable: true,
      })

      ioTab.onKeydown(event)

      expect(handler).not.toHaveBeenCalled()
    })

    it('should call super.onKeydown for non-shift keys', () => {
      const handler = vi.fn()
      ioTab.addEventListener('io-tab-action', handler)

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
        cancelable: true,
      })

      expect(() => ioTab.onKeydown(event)).not.toThrow()
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Drag End', () => {
    it('should collapse drag ghost after drop in layout', () => {
      const { layout, ioTab: layoutTab } = mountTabInLayout(container, { id: 'drop-tab' })

      layoutTab.onPointerdown(new PointerEvent('pointerdown', {
        pointerId: 1,
        buttons: 1,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      layoutTab.onPointermove(new PointerEvent('pointermove', {
        pointerId: 1,
        buttons: 1,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      expect(layout.$tabDragGhost.expanded).toBe(true)

      layoutTab.onPointerup(new PointerEvent('pointerup', {
        pointerId: 1,
        buttons: 0,
        clientX: 115,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      }))

      expect(layout.$tabDragGhost.expanded).toBe(false)

      layout.remove()
    })
  })

  describe('Edge Cases', () => {
    it('should handle tab with empty label', () => {
      const emptyLabelTab = new Tab({ id: 'empty-label', label: '' })
      const emptyLabelIoTab = new IoTab({ model: emptyLabelTab })
      container.appendChild(emptyLabelIoTab)

      const span = emptyLabelIoTab.querySelector('.io-tab-label')
      expect(span?.textContent).toBe('empty-label')

      emptyLabelIoTab.remove()
      emptyLabelTab.dispose()
    })

    it('should handle tab with very long label', () => {
      const longLabel = 'A'.repeat(500)
      const longTab = new Tab({ id: 'long', label: longLabel })
      const longIoTab = new IoTab({ model: longTab })
      container.appendChild(longIoTab)

      const span = longIoTab.querySelector('.io-tab-label')
      expect(span?.textContent).toBe(longLabel)

      longIoTab.remove()
      longTab.dispose()
    })

    it('should handle tab with unicode characters', () => {
      const unicodeTab = new Tab({ id: 'unicode', label: '日本語タブ 🎉' })
      const unicodeIoTab = new IoTab({ model: unicodeTab })
      container.appendChild(unicodeIoTab)

      const span = unicodeIoTab.querySelector('.io-tab-label')
      expect(span?.textContent).toBe('日本語タブ 🎉')

      unicodeIoTab.remove()
      unicodeTab.dispose()
    })

    it('should handle rapid selection changes', () => {
      for (let i = 0; i < 10; i++) {
        tab.selected = i % 2 === 0
        expect(ioTab.hasAttribute('selected')).toBe(i % 2 === 0)
      }
    })

    it('should handle changing tab reference', () => {
      const newTab = new Tab({ id: 'new-tab', label: 'New Tab' })
      ioTab.model = newTab

      expect(ioTab.model).toBe(newTab)
      const span = ioTab.querySelector('.io-tab-label')
      expect(span?.textContent).toBe('New Tab')

      newTab.dispose()
    })
  })

  describe('Static Fields', () => {
    it('should have Style getter', () => {
      expect(IoTab.Style).toBeDefined()
      expect(typeof IoTab.Style).toBe('string')
      expect(IoTab.Style).toContain(':host')
    })

    it('should inherit IoField listeners', () => {
      expect(IoTab.Listeners).toBeDefined()
      expect(IoTab.Listeners.click).toBe('onClick')
    })
  })

  describe('Attribute Reflection', () => {
    it('should reflect overflow to attribute', () => {
      ioTab.overflow = true
      expect(ioTab.hasAttribute('overflow')).toBe(true)

      ioTab.overflow = false
      expect(ioTab.hasAttribute('overflow')).toBe(false)
    })

    it('should update selected attribute synchronously', () => {
      tab.selected = true
      expect(ioTab.hasAttribute('selected')).toBe(true)

      tab.selected = false
      expect(ioTab.hasAttribute('selected')).toBe(false)
    })
  })
})

describe('IoTab Factory Function', () => {
  it('should export ioTab factory function', async () => {
    const { ioTab } = await import('@io-gui/layout')
    expect(typeof ioTab).toBe('function')
  })

  it('should create virtual constructor from factory', async () => {
    const { ioTab, Tab } = await import('@io-gui/layout')
    const tab = new Tab({ id: 'factory-test' })
    const vdom = ioTab({ model: tab })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-tab')

    tab.dispose()
  })
})
