//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NodeArray } from '@io-gui/core'
import { IoTabs, Tab } from '@io-gui/layout'

describe('IoTabs', () => {
  let tabs: Array<Tab>
  let ioTabs: IoTabs
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    tabs = [
      new Tab({ id: 'tab1', label: 'Tab 1' }),
      new Tab({ id: 'tab2', label: 'Tab 2' }),
      new Tab({ id: 'tab3', label: 'Tab 3' }),
    ]
    ioTabs = new IoTabs({ tabs })
    container.appendChild(ioTabs)
  })

  afterEach(() => {
    ioTabs.remove()
    container.remove()
    tabs.forEach(tab => tab.dispose())
  })

  describe('Construction', () => {
    it('should construct with tabs array converted to NodeArray', () => {
      expect(ioTabs.tabs).toBeInstanceOf(NodeArray)
      expect(ioTabs.tabs.length).toBe(tabs.length)
      // Verify same Tab instances are in the NodeArray
      tabs.forEach((tab, i) => {
        expect(ioTabs.tabs[i]).toBe(tab)
      })
    })

  })

  describe('Rendering', () => {
    it('should render io-tab elements for each tab', () => {
      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(3)
    })

    it('should update rendering when tabs change', () => {
      ioTabs.tabs.push(new Tab({ id: 'tab4', label: 'Tab 4' }))

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(4)
    })

    it('should maintain tab order in rendering', () => {
      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements[0].model.id).toBe('tab1')
      expect(tabElements[1].model.id).toBe('tab2')
      expect(tabElements[2].model.id).toBe('tab3')
    })
  })

  describe('Tab Mutation Handling', () => {
    it('should call changed when tabsMutated is invoked', () => {
      const changedSpy = vi.spyOn(ioTabs, 'mutated')
      ioTabs.tabsMutated()
      expect(changedSpy).toHaveBeenCalled()
    })
  })

  describe('Empty State', () => {
    it('should handle empty tabs array', () => {
      const emptyTabs = new NodeArray<Tab>([])
      const emptyIoTabs = new IoTabs({ tabs: emptyTabs })
      container.appendChild(emptyIoTabs)

      const tabElements = emptyIoTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(0)

      emptyIoTabs.remove()
    })
  })

  describe('Single Tab', () => {
    it('should render single tab correctly', () => {
      const singleTab = [new Tab({ id: 'only', label: 'Only Tab' })]
      const singleIoTabs = new IoTabs({ tabs: singleTab })
      container.appendChild(singleIoTabs)

      const tabElements = singleIoTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(1)
      expect(tabElements[0].model.id).toBe('only')

      singleIoTabs.remove()
      singleTab[0].dispose()
    })
  })

  describe('Dynamic Tab Operations', () => {
    it('should handle tab removal', () => {
      const removedTab = ioTabs.tabs.splice(1, 1)[0]
      ioTabs.tabsMutated()

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(2)
      expect(tabElements[0].model.id).toBe('tab1')
      expect(tabElements[1].model.id).toBe('tab3')

      removedTab.dispose()
    })

    it('should handle tab insertion', () => {
      const newTab = new Tab({ id: 'inserted', label: 'Inserted' })
      ioTabs.tabs.splice(1, 0, newTab)
      ioTabs.tabsMutated()

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(4)
      expect(tabElements[1].model.id).toBe('inserted')
    })

    it('should handle tab reorder', () => {
      const movedTab = ioTabs.tabs.splice(0, 1)[0]
      ioTabs.tabs.push(movedTab)
      ioTabs.tabsMutated()

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements[0].model.id).toBe('tab2')
      expect(tabElements[1].model.id).toBe('tab3')
      expect(tabElements[2].model.id).toBe('tab1')
    })
  })

  describe('Static Fields', () => {
    it('should have Style getter', () => {
      expect(IoTabs.Style).toBeDefined()
      expect(typeof IoTabs.Style).toBe('string')
      expect(IoTabs.Style).toContain(':host')
    })
  })
})

describe('IoTabs Factory Function', () => {
  it('should export ioTabs factory function', async () => {
    const { ioTabs } = await import('@io-gui/layout')
    expect(typeof ioTabs).toBe('function')
  })

  it('should create virtual constructor from factory', async () => {
    const { ioTabs } = await import('@io-gui/layout')
    const tabs = [new Tab({ id: 'factory-test' })]
    const vdom = ioTabs({ tabs })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-tabs')

    tabs[0].dispose()
  })
})

