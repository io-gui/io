//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { NodeArray } from '@io-gui/core'
import { IoTabs, Tab } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'

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

    it('should have default overflow value of -1', () => {
      expect(ioTabs.overflow).toBe(-1)
    })

    it('should not have addMenuOption by default', () => {
      expect(ioTabs.addMenuOption).toBeUndefined()
    })

    it('should accept addMenuOption', () => {
      const menuOption = new MenuOption({ options: [{ id: 'new', label: 'New Tab' }] })
      const tabsWithMenu = new IoTabs({ tabs, addMenuOption: menuOption })
      container.appendChild(tabsWithMenu)

      expect(tabsWithMenu.addMenuOption).toBe(menuOption)

      tabsWithMenu.remove()
    })
  })

  describe('Rendering', () => {
    it('should render io-tab elements for each tab', () => {
      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(3)
    })

    it('should render hamburger menu', () => {
      const hamburger = ioTabs.querySelector('io-tabs-hamburger')
      expect(hamburger).toBeTruthy()
    })

    it('should not render add menu when addMenuOption is undefined', () => {
      const addMenu = ioTabs.querySelector('.add-tab')
      expect(addMenu).toBeNull()
    })

    it('should not render add menu when addMenuOption has no options', () => {
      const emptyMenuOption = new MenuOption({ options: [] })
      const tabsWithEmptyMenu = new IoTabs({ tabs, addMenuOption: emptyMenuOption })
      container.appendChild(tabsWithEmptyMenu)

      const addMenu = tabsWithEmptyMenu.querySelector('.add-tab')
      expect(addMenu).toBeNull()

      tabsWithEmptyMenu.remove()
    })

    it('should render add menu when addMenuOption has options', () => {
      const menuOption = new MenuOption({ options: [{ id: 'new', label: 'New Tab' }] })
      const tabsWithMenu = new IoTabs({ tabs, addMenuOption: menuOption })
      container.appendChild(tabsWithMenu)

      const addMenu = tabsWithMenu.querySelector('.add-tab')
      expect(addMenu).toBeTruthy()

      tabsWithMenu.remove()
    })

    it('should update rendering when tabs change', () => {
      ioTabs.tabs.push(new Tab({ id: 'tab4', label: 'Tab 4' }))

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(4)
    })

    it('should maintain tab order in rendering', () => {
      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements[0].tab.id).toBe('tab1')
      expect(tabElements[1].tab.id).toBe('tab2')
      expect(tabElements[2].tab.id).toBe('tab3')
    })
  })

  describe('Tab Mutation Handling', () => {
    it('should call changed when tabsMutated is invoked', () => {
      const changedSpy = vi.spyOn(ioTabs, 'changed')
      ioTabs.tabsMutated()
      expect(changedSpy).toHaveBeenCalled()
    })

    it('should reset overflow to -1 when tabs mutate', () => {
      ioTabs.overflow = 500
      ioTabs.tabsMutated()
      expect(ioTabs.overflow).toBe(-1)
    })

    it('should call onResized after mutation', () => {
      const resizedSpy = vi.spyOn(ioTabs, 'onResized')
      ioTabs.tabsMutated()
      expect(resizedSpy).toHaveBeenCalled()
    })
  })

  describe('Overflow Detection', () => {
    it('should not change overflow when no children', () => {
      const emptyTabs = new NodeArray<Tab>([])
      const emptyIoTabs = new IoTabs({ tabs: emptyTabs })
      container.appendChild(emptyIoTabs)

      emptyIoTabs.onResized()
      expect(emptyIoTabs.overflow).toBe(-1)

      emptyIoTabs.remove()
    })

    it('should set overflow when last element exceeds container', () => {
      // Mock getBoundingClientRect for container
      vi.spyOn(ioTabs, 'getBoundingClientRect').mockReturnValue({
        right: 200,
        width: 200,
        left: 0,
        top: 0,
        bottom: 40,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect)

      // Mock last child's getBoundingClientRect to exceed container
      const lastChild = ioTabs.children[ioTabs.children.length - 1]
      if (lastChild) {
        vi.spyOn(lastChild, 'getBoundingClientRect').mockReturnValue({
          right: 300,
          width: 100,
          left: 200,
          top: 0,
          bottom: 40,
          height: 40,
          x: 200,
          y: 0,
          toJSON: () => ({})
        } as DOMRect)
      }

      ioTabs.onResized()
      expect(ioTabs.overflow).toBe(200)
    })

    it('should not set overflow when last element fits', () => {
      vi.spyOn(ioTabs, 'getBoundingClientRect').mockReturnValue({
        right: 500,
        width: 500,
        left: 0,
        top: 0,
        bottom: 40,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect)

      const lastChild = ioTabs.children[ioTabs.children.length - 1]
      if (lastChild) {
        vi.spyOn(lastChild, 'getBoundingClientRect').mockReturnValue({
          right: 300,
          width: 100,
          left: 200,
          top: 0,
          bottom: 40,
          height: 40,
          x: 200,
          y: 0,
          toJSON: () => ({})
        } as DOMRect)
      }

      ioTabs.onResized()
      expect(ioTabs.overflow).toBe(-1)
    })

    it('should have hysteresis when recovering from overflow', () => {
      // First trigger overflow
      ioTabs.overflow = 200

      // Container is now wider but not by 32px margin
      vi.spyOn(ioTabs, 'getBoundingClientRect').mockReturnValue({
        right: 220,
        width: 220,
        left: 0,
        top: 0,
        bottom: 40,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect)

      const lastChild = ioTabs.children[ioTabs.children.length - 1]
      if (lastChild) {
        vi.spyOn(lastChild, 'getBoundingClientRect').mockReturnValue({
          right: 200,
          width: 100,
          left: 100,
          top: 0,
          bottom: 40,
          height: 40,
          x: 100,
          y: 0,
          toJSON: () => ({})
        } as DOMRect)
      }

      ioTabs.onResized()
      // Should still be in overflow state (not recovered)
      expect(ioTabs.overflow).toBe(200)
    })

    it('should recover from overflow when width exceeds threshold', () => {
      ioTabs.overflow = 200

      // Container is wider by more than 32px
      vi.spyOn(ioTabs, 'getBoundingClientRect').mockReturnValue({
        right: 250,
        width: 250,
        left: 0,
        top: 0,
        bottom: 40,
        height: 40,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect)

      const lastChild = ioTabs.children[ioTabs.children.length - 1]
      if (lastChild) {
        vi.spyOn(lastChild, 'getBoundingClientRect').mockReturnValue({
          right: 200,
          width: 100,
          left: 100,
          top: 0,
          bottom: 40,
          height: 40,
          x: 100,
          y: 0,
          toJSON: () => ({})
        } as DOMRect)
      }

      ioTabs.onResized()
      expect(ioTabs.overflow).toBe(-1)
    })
  })

  describe('Overflow Attribute Reflection', () => {
    it('should reflect overflow to attribute', () => {
      expect(ioTabs.getAttribute('overflow')).toBe('-1')

      ioTabs.overflow = 200
      expect(ioTabs.getAttribute('overflow')).toBe('200')
    })
  })

  describe('Empty State', () => {
    it('should handle empty tabs array', () => {
      const emptyTabs = new NodeArray<Tab>([])
      const emptyIoTabs = new IoTabs({ tabs: emptyTabs })
      container.appendChild(emptyIoTabs)

      const tabElements = emptyIoTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(0)

      // Should still have hamburger
      const hamburger = emptyIoTabs.querySelector('io-tabs-hamburger')
      expect(hamburger).toBeTruthy()

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
      expect(tabElements[0].tab.id).toBe('only')

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
      expect(tabElements[0].tab.id).toBe('tab1')
      expect(tabElements[1].tab.id).toBe('tab3')

      removedTab.dispose()
    })

    it('should handle tab insertion', () => {
      const newTab = new Tab({ id: 'inserted', label: 'Inserted' })
      ioTabs.tabs.splice(1, 0, newTab)
      ioTabs.tabsMutated()

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(4)
      expect(tabElements[1].tab.id).toBe('inserted')
    })

    it('should handle tab reorder', () => {
      const movedTab = ioTabs.tabs.splice(0, 1)[0]
      ioTabs.tabs.push(movedTab)
      ioTabs.tabsMutated()

      const tabElements = ioTabs.querySelectorAll('io-tab')
      expect(tabElements[0].tab.id).toBe('tab2')
      expect(tabElements[1].tab.id).toBe('tab3')
      expect(tabElements[2].tab.id).toBe('tab1')
    })
  })

  describe('Static Properties', () => {
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

