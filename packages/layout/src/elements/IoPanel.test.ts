//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoPanel, IoSplit, IoLayout, Split, Panel, Tab, Layout } from '@io-gui/layout'

describe('IoPanel', () => {
  let panel: Panel
  let ioPanel: IoPanel
  let layout: IoLayout
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    const split = new Split({
      type: 'split',
      children: [
        {
          type: 'panel',
          tabs: [
            { id: 'tab1', label: 'Tab 1', selected: true },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' },
          ]
        }
      ]
    })

    layout = new IoLayout({ model: new Layout({ child: split.toJSON() }) })

    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    panel = ioPanel.model
  })

  afterEach(() => {
    layout.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should construct with panel reference', () => {
      expect(ioPanel.model).toBe(panel)
      expect(ioPanel.model.tabs.length).toBe(3)
    })

    it('should render io-tabs element', () => {
      const tabs = ioPanel.querySelector('io-tabs')
      expect(tabs).toBeTruthy()
    })

    it('should render io-selector element', () => {
      const selector = ioPanel.querySelector('io-selector')
      expect(selector).toBeTruthy()
    })

    it('should pass panel.tabs to io-tabs', () => {
      const ioTabs = ioPanel.querySelector('io-tabs')
      expect(ioTabs.tabs.length).toBe(3)
      expect(ioTabs.tabs[0].id).toBe('tab1')
    })
  })

  describe('Tab Selection', () => {
    it('should select first tab by default', () => {
      expect(panel.selectedID).toBe('tab1')
    })

    it('should select tab via model selectByIndex', () => {
      panel.selectByIndex(1)
      expect(panel.selectedID).toBe('tab2')
    })

    it('should select tab via io-tab-action event with select action', () => {
      const event = new CustomEvent('io-tab-action', {
        detail: { model: panel.tabs[1], action: 'select' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)
      expect(panel.selectedID).toBe('tab2')
    })
  })

  describe('Tab Reordering', () => {
    it('should move tab left via move-left action', () => {
      const tab2 = panel.tabs[1]
      const event = new CustomEvent('io-tab-action', {
        detail: { model: tab2, action: 'move-left' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[0].id).toBe('tab2')
      expect(panel.tabs[1].id).toBe('tab1')
      expect(panel.tabs[2].id).toBe('tab3')
    })

    it('should move tab right via move-right action', () => {
      const tab2 = panel.tabs[1]
      const event = new CustomEvent('io-tab-action', {
        detail: { model: tab2, action: 'move-right' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[0].id).toBe('tab1')
      expect(panel.tabs[1].id).toBe('tab3')
      expect(panel.tabs[2].id).toBe('tab2')
    })

    it('should keep tab at start via move-start action', () => {
      const tab1 = panel.tabs[0]
      const event = new CustomEvent('io-tab-action', {
        detail: { model: tab1, action: 'move-start' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[0].id).toBe('tab1')
    })

    it('should keep tab at end via move-end action', () => {
      const tab3 = panel.tabs[2]
      const event = new CustomEvent('io-tab-action', {
        detail: { model: tab3, action: 'move-end' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[2].id).toBe('tab3')
    })

    it('should select moved tab after reordering', () => {
      const tab2 = panel.tabs[1]
      const event = new CustomEvent('io-tab-action', {
        detail: { model: tab2, action: 'move-left' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)
      expect(panel.selectedID).toBe('tab2')
    })
  })

  describe('Panel Mutation Handling', () => {
    it('should call changed when modelMutated is invoked', () => {
      const changedSpy = vi.spyOn(ioPanel, 'mutated')
      ioPanel.modelMutated()

      // Need to wait for debounce
      return new Promise<void>(resolve => {
        setTimeout(() => {
          expect(changedSpy).toHaveBeenCalled()
          resolve()
        }, 50)
      })
    })
  })

  describe('Event Handling', () => {
    it('should stop propagation on io-tab-action event', () => {
      const event = new CustomEvent('io-tab-action', {
        detail: { model: panel.tabs[0], action: 'select' },
        bubbles: true,
      })
      const stopSpy = vi.spyOn(event, 'stopPropagation')

      ioPanel.onTabAction(event)

      expect(stopSpy).toHaveBeenCalled()
    })

    it('should ignore unknown tab without changing panel', () => {
      const unknownTab = new Tab({ id: 'unknown' })

      const event = new CustomEvent('io-tab-action', {
        detail: { model: unknownTab, action: 'select' },
        bubbles: true,
      })
      ioPanel.onTabAction(event)

      expect(panel.tabs.length).toBe(3)
      expect(panel.selectedID).toBe('tab1')
    })
  })

  describe('Focus Management', () => {
    it('should focus tab element after selection', () => {
      // The panel already has io-tab elements rendered by io-tabs
      const tabElements = ioPanel.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(3)

      // Spy on focus of the first tab
      const focusSpy = vi.spyOn(tabElements[0] as HTMLElement, 'focus')

      // Call the focus method directly
      ioPanel.focusTabDebounced(0)

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should clamp focus index to valid range', () => {
      const tabElements = ioPanel.querySelectorAll('io-tab')
      const lastTab = tabElements[tabElements.length - 1] as HTMLElement
      const focusSpy = vi.spyOn(lastTab, 'focus')

      // Call with out-of-bounds index
      ioPanel.focusTabDebounced(100)

      // Should focus the last tab instead of throwing
      expect(focusSpy).toHaveBeenCalled()
    })
  })

  describe('Static Fields', () => {
    it('should have Style getter', () => {
      expect(IoPanel.Style).toBeDefined()
      expect(typeof IoPanel.Style).toBe('string')
      expect(IoPanel.Style).toContain(':host')
      expect(IoPanel.Style).toContain('flex-direction')
    })

    it('should have Listeners getter', () => {
      expect(IoPanel.Listeners).toBeDefined()
      expect(IoPanel.Listeners['io-tab-action']).toBe('onTabAction')
    })
  })

  describe('Rendering', () => {
    it('should re-render when panel changes', () => {
      const newPanel = new Panel({
        type: 'panel',
        tabs: [{ id: 'new-panel-tab' }]
      })

      ioPanel.model = newPanel

      const tabs = ioPanel.querySelector('io-tabs')
      expect(tabs.tabs[0].id).toBe('new-panel-tab')
    })

    it('should update io-selector selected value', () => {
      panel.selectByIndex(1)
      ioPanel.mutated()

      const selector = ioPanel.querySelector('io-selector')
      expect(selector.selected).toBe('tab2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty panel after construction', () => {
      const emptyPanel = new Panel({
        type: 'panel',
        tabs: []
      })

      const emptySplit = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'protector' }] },
        ]
      })
      // Manually set the first child to empty panel
      emptySplit.children[0] = emptyPanel

      const emptyLayout = new IoSplit({ model: emptySplit, elements: [] })
      container.appendChild(emptyLayout)

      const emptyIoPanel = emptyLayout.querySelector('io-panel') as IoPanel

      // Should not crash
      expect(emptyIoPanel.model.tabs.length).toBe(0)

      emptyLayout.remove()
    })
  })
})

describe('IoPanel Factory Function', () => {
  it('should export ioPanel factory function', async () => {
    const { ioPanel } = await import('@io-gui/layout')
    expect(typeof ioPanel).toBe('function')
  })

  it('should create virtual constructor from factory', async () => {
    const { ioPanel, Panel } = await import('@io-gui/layout')
    const panel = new Panel({ type: 'panel', tabs: [{ id: 'factory-test' }] })
    const vdom = ioPanel({ model: panel, elements: [] })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-panel')
  })
})
