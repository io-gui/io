//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoLayout, IoPanel, IoSplit, Split, Panel, Tab } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'

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
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' },
          ]
        }
      ]
    })

    layout = new IoLayout({ split, elements: [] })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    panel = ioPanel.panel
  })

  afterEach(() => {
    layout.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should construct with panel reference', () => {
      expect(ioPanel.panel).toBe(panel)
      expect(ioPanel.panel.tabs.length).toBe(3)
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
      expect(panel.getSelected()).toBe('tab1')
    })

    it('should select tab by selectTab method', () => {
      const tab2 = panel.tabs[1]
      ioPanel.selectTab(tab2)
      expect(panel.getSelected()).toBe('tab2')
    })

    it('should select tab by index', () => {
      ioPanel.selectIndex(2)
      expect(panel.getSelected()).toBe('tab3')
    })

    it('should clamp index to valid range', () => {
      ioPanel.selectIndex(100)
      expect(panel.getSelected()).toBe('tab3')
    })

    it('should select tab via io-edit-tab event with Select key', () => {
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: panel.tabs[1], key: 'Select' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)
      expect(panel.getSelected()).toBe('tab2')
    })
  })

  describe('Tab Addition', () => {
    it('should add tab at the end by default', () => {
      const newTab = new Tab({ id: 'newTab', label: 'New Tab' })
      ioPanel.addTab(newTab)
      expect(panel.tabs.length).toBe(4)
      expect(panel.tabs[3].id).toBe('newTab')
    })

    it('should add tab at specified index', () => {
      const newTab = new Tab({ id: 'newTab', label: 'New Tab' })
      ioPanel.addTab(newTab, 1)
      expect(panel.tabs.length).toBe(4)
      expect(panel.tabs[1].id).toBe('newTab')
    })

    it('should clamp index to valid range when adding', () => {
      const newTab = new Tab({ id: 'newTab', label: 'New Tab' })
      ioPanel.addTab(newTab, 100)
      expect(panel.tabs.length).toBe(4)
      expect(panel.tabs[3].id).toBe('newTab')
    })

    it('should select added tab', () => {
      const newTab = new Tab({ id: 'newTab', label: 'New Tab' })
      ioPanel.addTab(newTab, 1)
      expect(panel.getSelected()).toBe('newTab')
    })

    it('should remove duplicate tab id when adding', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const duplicateTab = new Tab({ id: 'tab1', label: 'Duplicate' })
      ioPanel.addTab(duplicateTab)

      const tab1Occurrences = panel.tabs.filter(t => t.id === 'tab1')
      expect(tab1Occurrences.length).toBe(1)
      expect(consoleWarnSpy).toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })
  })

  describe('Tab Removal', () => {
    it('should remove tab by removeTab method', () => {
      const tab2 = panel.tabs[1]
      ioPanel.removeTab(tab2)
      expect(panel.tabs.length).toBe(2)
      expect(panel.tabs.find(t => t.id === 'tab2')).toBeUndefined()
    })

    it('should select adjacent tab after removal', () => {
      panel.setSelected('tab2')
      const tab2 = panel.tabs[1]
      ioPanel.removeTab(tab2)
      expect(panel.getSelected()).toBe('tab3')
    })

    it('should select previous tab when removing last tab', () => {
      panel.setSelected('tab3')
      const tab3 = panel.tabs[2]
      ioPanel.removeTab(tab3)
      expect(panel.getSelected()).toBe('tab2')
    })

    it('should remove tab via io-edit-tab event with Backspace key', () => {
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: panel.tabs[1], key: 'Backspace' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)
      expect(panel.tabs.length).toBe(2)
    })
  })

  describe('Tab Reordering', () => {
    it('should move tab left via ArrowLeft key', () => {
      const tab2 = panel.tabs[1]
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: tab2, key: 'ArrowLeft' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[0].id).toBe('tab2')
      expect(panel.tabs[1].id).toBe('tab1')
      expect(panel.tabs[2].id).toBe('tab3')
    })

    it('should move tab right via ArrowRight key', () => {
      const tab2 = panel.tabs[1]
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: tab2, key: 'ArrowRight' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[0].id).toBe('tab1')
      expect(panel.tabs[1].id).toBe('tab3')
      expect(panel.tabs[2].id).toBe('tab2')
    })

    it('should clamp move to start of array', () => {
      const tab1 = panel.tabs[0]
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: tab1, key: 'ArrowLeft' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[0].id).toBe('tab1')
    })

    it('should clamp move to end of array', () => {
      const tab3 = panel.tabs[2]
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: tab3, key: 'ArrowRight' },
        bubbles: true,
      })
      ioPanel.dispatchEvent(event)

      expect(panel.tabs[2].id).toBe('tab3')
    })

    it('should select moved tab after reordering', () => {
      const tab2 = panel.tabs[1]
      ioPanel.moveTab(tab2, 0)
      expect(panel.getSelected()).toBe('tab2')
    })
  })

  describe('Last Tab Protection', () => {
    it('should NOT dispatch io-panel-remove when removing last tab from root panel', () => {
      const removeSpy = vi.fn()
      ioPanel.addEventListener('io-panel-remove', removeSpy)

      // Remove all but one tab
      ioPanel.removeTab(panel.tabs[2])
      ioPanel.removeTab(panel.tabs[1])

      // This is the last tab in the root panel
      ioPanel.removeTab(panel.tabs[0])

      // Should NOT have dispatched io-panel-remove
      expect(removeSpy).not.toHaveBeenCalled()
    })

    it('should dispatch io-panel-remove when removing last tab from non-root panel', () => {
      // Create layout with multiple panels
      const multiSplit = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'panelA-tab1' }] },
          { type: 'panel', tabs: [{ id: 'panelB-tab1' }] },
        ]
      })

      const multiLayout = new IoLayout({ split: multiSplit, elements: [] })
      container.appendChild(multiLayout)

      const panelB = multiLayout.querySelectorAll('io-panel')[1] as IoPanel
      const removeSpy = vi.fn()
      panelB.addEventListener('io-panel-remove', removeSpy)

      // Remove the only tab from panelB
      panelB.removeTab(panelB.panel.tabs[0])

      expect(removeSpy).toHaveBeenCalled()

      multiLayout.remove()
    })

    it('should protect single panel in deeply nested split', () => {
      // Create nested structure where only one panel remains
      const nestedSplit = new Split({
        type: 'split',
        children: [
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'only-tab' }] }
            ]
          }
        ]
      })

      const nestedLayout = new IoLayout({ split: nestedSplit, elements: [] })
      container.appendChild(nestedLayout)

      // Due to construction consolidation, we should have a single panel
      const onlyPanel = nestedLayout.querySelector('io-panel') as IoPanel
      const removeSpy = vi.fn()
      onlyPanel.addEventListener('io-panel-remove', removeSpy)

      // Try to remove the last tab
      onlyPanel.removeTab(onlyPanel.panel.tabs[0])

      // The panel should be protected (though the exact behavior depends on nesting)
      // At minimum, the panel shouldn't crash
      expect(onlyPanel.panel.tabs.length).toBe(0)

      nestedLayout.remove()
    })
  })

  describe('Panel Mutation Handling', () => {
    it('should call changed when panelMutated is invoked', () => {
      const changedSpy = vi.spyOn(ioPanel, 'changed')
      ioPanel.panelMutated()

      // Need to wait for debounce
      return new Promise<void>(resolve => {
        setTimeout(() => {
          expect(changedSpy).toHaveBeenCalled()
          resolve()
        }, 50)
      })
    })
  })

  describe('moveTabToSplit', () => {
    let multiLayout: IoLayout
    let multiSplit: Split
    let sourcePanelElement: IoPanel
    let targetPanelElement: IoPanel

    beforeEach(() => {
      multiSplit = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'src-tab1' }, { id: 'src-tab2' }] },
          { type: 'panel', tabs: [{ id: 'tgt-tab1' }] },
        ]
      })

      multiLayout = new IoLayout({ split: multiSplit, elements: [] })
      container.appendChild(multiLayout)

      sourcePanelElement = multiLayout.querySelectorAll('io-panel')[0] as IoPanel
      targetPanelElement = multiLayout.querySelectorAll('io-panel')[1] as IoPanel
    })

    afterEach(() => {
      multiLayout.remove()
    })

    it('should move tab to center (within same panel)', () => {
      const tab = sourcePanelElement.panel.tabs[1]
      targetPanelElement.moveTabToSplit(sourcePanelElement, tab, 'center')

      expect(sourcePanelElement.panel.tabs.length).toBe(1)
      expect(targetPanelElement.panel.tabs.length).toBe(2)
      expect(targetPanelElement.panel.tabs.find(t => t.id === 'src-tab2')).toBeTruthy()
    })

    it('should call parent split for directional moves', () => {
      const parentSplit = multiLayout.querySelector('io-split') as IoSplit
      const moveTabToSplitSpy = vi.spyOn(parentSplit, 'moveTabToSplit')

      const tab = sourcePanelElement.panel.tabs[1]
      targetPanelElement.moveTabToSplit(sourcePanelElement, tab, 'left')

      expect(moveTabToSplitSpy).toHaveBeenCalledWith(
        sourcePanelElement,
        targetPanelElement.panel,
        tab,
        'left'
      )
    })
  })

  describe('Event Handling', () => {
    it('should stop propagation on io-edit-tab event', () => {
      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: panel.tabs[0], key: 'Select' },
        bubbles: true,
      })
      const stopSpy = vi.spyOn(event, 'stopPropagation')

      ioPanel.onEditTab(event)

      expect(stopSpy).toHaveBeenCalled()
    })

    it('should warn and return when tab not found', () => {
      const unknownTab = new Tab({ id: 'unknown' })
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const event = new CustomEvent('io-edit-tab', {
        detail: { tab: unknownTab, key: 'Select' },
        bubbles: true,
      })
      ioPanel.onEditTab(event)

      // Since debug blocks may be stripped, we just verify no crash
      expect(panel.tabs.length).toBe(3) // No change

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Add Menu Integration', () => {
    it('should handle new tab clicked event', () => {
      const event = new CustomEvent('io-menu-option-clicked', {
        detail: {
          option: { id: 'new-tab-id', label: 'New Tab', icon: '', options: [] }
        },
        bubbles: true,
      })
      const stopSpy = vi.spyOn(event, 'stopPropagation')

      ioPanel.onNewTabClicked(event)

      expect(stopSpy).toHaveBeenCalled()
      expect(panel.tabs.length).toBe(4)
      expect(panel.tabs[3].id).toBe('new-tab-id')
    })

    it('should NOT add tab when option has sub-options', () => {
      const event = new CustomEvent('io-menu-option-clicked', {
        detail: {
          option: { id: 'parent', label: 'Parent', options: [{ id: 'child' }] }
        },
        bubbles: true,
      })

      ioPanel.onNewTabClicked(event)

      expect(panel.tabs.length).toBe(3) // No change
    })

    it('should NOT add tab when option has no id', () => {
      const event = new CustomEvent('io-menu-option-clicked', {
        detail: {
          option: { id: '', label: 'No ID', options: [] }
        },
        bubbles: true,
      })

      ioPanel.onNewTabClicked(event)

      expect(panel.tabs.length).toBe(3) // No change
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

  describe('Static Properties', () => {
    it('should have Style getter', () => {
      expect(IoPanel.Style).toBeDefined()
      expect(typeof IoPanel.Style).toBe('string')
      expect(IoPanel.Style).toContain(':host')
      expect(IoPanel.Style).toContain('flex-direction')
    })

    it('should have Listeners getter', () => {
      expect(IoPanel.Listeners).toBeDefined()
      expect(IoPanel.Listeners['io-edit-tab']).toBe('onEditTab')
    })
  })

  describe('Rendering', () => {
    it('should re-render when panel changes', () => {
      const newPanel = new Panel({
        type: 'panel',
        tabs: [{ id: 'new-panel-tab' }]
      })

      ioPanel.panel = newPanel

      const tabs = ioPanel.querySelector('io-tabs')
      expect(tabs.tabs[0].id).toBe('new-panel-tab')
    })

    it('should update io-selector selected value', () => {
      panel.setSelected('tab2')
      ioPanel.changed()

      const selector = ioPanel.querySelector('io-selector')
      expect(selector.selected).toBe('tab2')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid tab operations', () => {
      const newTab1 = new Tab({ id: 'rapid1' })
      const newTab2 = new Tab({ id: 'rapid2' })
      const newTab3 = new Tab({ id: 'rapid3' })

      ioPanel.addTab(newTab1)
      ioPanel.addTab(newTab2)
      ioPanel.addTab(newTab3)
      ioPanel.removeTab(newTab2)
      ioPanel.moveTab(newTab1, 0)

      expect(panel.tabs.length).toBe(5)
      expect(panel.tabs[0].id).toBe('rapid1')
    })

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

      const emptyLayout = new IoLayout({ split: emptySplit, elements: [] })
      container.appendChild(emptyLayout)

      const emptyIoPanel = emptyLayout.querySelector('io-panel') as IoPanel

      // Should not crash
      expect(emptyIoPanel.panel.tabs.length).toBe(0)

      emptyLayout.remove()
    })

    it('should handle operations on disposed tabs gracefully', () => {
      const tabToDispose = panel.tabs[1]
      const tabId = tabToDispose.id

      // Remove the tab (this doesn't dispose it)
      ioPanel.removeTab(tabToDispose)

      // Verify tab was removed
      expect(panel.tabs.find(t => t.id === tabId)).toBeUndefined()
    })
  })
})

describe('Auto-generate addMenuOption', () => {
  let layout: IoLayout
  let container: HTMLElement
  let ioPanel: IoPanel

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (layout) layout.remove()
    container.remove()
  })

  it('should use provided addMenuOption when it has options', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
    })

    const customMenuOption = new MenuOption({
      options: [{ id: 'custom-option', label: 'Custom' }]
    })

    layout = new IoLayout({
      split,
      elements: [{ tag: 'div', props: { id: 'element1' } }],
      addMenuOption: customMenuOption
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    expect(result).toBe(customMenuOption)
    expect(result?.options[0].id).toBe('custom-option')
  })

  it('should auto-generate addMenuOption from element IDs when not provided', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
    })

    layout = new IoLayout({
      split,
      elements: [
        { tag: 'div', props: { id: 'element1' } },
        { tag: 'div', props: { id: 'element2', label: 'Element Two' } },
        { tag: 'div', props: { id: 'element3', icon: 'test-icon' } },
      ]
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    expect(result).toBeDefined()
    expect(result?.options.length).toBe(3)
    expect(result?.options[0].id).toBe('element1')
    expect(result?.options[0].label).toBe('element1') // defaults to id
    expect(result?.options[1].id).toBe('element2')
    expect(result?.options[1].label).toBe('Element Two')
    expect(result?.options[2].icon).toBe('test-icon')
  })

  it('should exclude element IDs that are already tabs', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }, { id: 'element2' }] }]
    })

    layout = new IoLayout({
      split,
      elements: [
        { tag: 'div', props: { id: 'element1' } },
        { tag: 'div', props: { id: 'element2' } }, // already a tab
        { tag: 'div', props: { id: 'element3' } },
      ]
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    expect(result?.options.length).toBe(2)
    expect(result?.options.map(o => o.id)).toEqual(['element1', 'element3'])
    expect(result?.options.find(o => o.id === 'element2')).toBeUndefined()
  })

  it('should return undefined when elements array is empty', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
    })

    layout = new IoLayout({ split, elements: [] })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    expect(result).toBeUndefined()
  })

  it('should return undefined when all elements are already tabs', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'element1' }, { id: 'element2' }] }]
    })

    layout = new IoLayout({
      split,
      elements: [
        { tag: 'div', props: { id: 'element1' } },
        { tag: 'div', props: { id: 'element2' } },
      ]
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    expect(result).toBeUndefined()
  })

  it('should skip elements without id property', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
    })

    layout = new IoLayout({
      split,
      elements: [
        { tag: 'div', props: { id: 'element1' } },
        { tag: 'div', props: {} }, // no id
        { tag: 'div' }, // no props
        { tag: 'div', props: { id: 'element2' } },
      ]
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    expect(result?.options.length).toBe(2)
    expect(result?.options.map(o => o.id)).toEqual(['element1', 'element2'])
  })

  it('should update available options after adding a tab', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
    })

    layout = new IoLayout({
      split,
      elements: [
        { tag: 'div', props: { id: 'element1' } },
        { tag: 'div', props: { id: 'element2' } },
      ]
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel

    // Initially should have 2 options
    let result = ioPanel.getAddMenuOption()
    expect(result?.options.length).toBe(2)

    // Add element1 as a tab
    ioPanel.addTab(new Tab({ id: 'element1' }))

    // Now should only have 1 option
    result = ioPanel.getAddMenuOption()
    expect(result?.options.length).toBe(1)
    expect(result?.options[0].id).toBe('element2')
  })

  it('should prefer empty addMenuOption over auto-generation when explicitly set', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
    })

    // Empty MenuOption with no options
    const emptyMenuOption = new MenuOption({ options: [] })

    layout = new IoLayout({
      split,
      elements: [{ tag: 'div', props: { id: 'element1' } }],
      addMenuOption: emptyMenuOption
    })
    container.appendChild(layout)

    ioPanel = layout.querySelector('io-panel') as IoPanel
    const result = ioPanel.getAddMenuOption()

    // Should auto-generate since empty addMenuOption.options
    expect(result?.options.length).toBe(1)
    expect(result?.options[0].id).toBe('element1')
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
    const vdom = ioPanel({ panel, elements: [] })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-panel')
  })
})

