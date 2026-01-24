//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoLayout, ioLayout, Split, Panel, IoSplit, IoPanel } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'

describe('IoLayout', () => {
  let layout: IoLayout
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (layout) {
      layout.remove()
    }
    container.remove()
  })

  describe('Construction', () => {
    it('should construct with split and elements', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      expect(layout.split).toBe(split)
      expect(layout.elements).toEqual([])
    })

    it('should accept elements array', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })
      const elements = [
        { tag: 'div', props: { id: 'tab1' } }
      ]

      layout = new IoLayout({ split, elements })
      container.appendChild(layout)

      expect(layout.elements).toBe(elements)
    })

    it('should accept optional addMenuOption', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })
      const menuOption = new MenuOption({ options: [{ id: 'new', label: 'New Tab' }] })

      layout = new IoLayout({ split, elements: [], addMenuOption: menuOption })
      container.appendChild(layout)

      expect(layout.addMenuOption).toBe(menuOption)
    })

    it('should have no addMenuOption value by default', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      // The property has a type definition but no instance value
      expect(layout.addMenuOption instanceof MenuOption).toBe(false)
    })
  })

  describe('Rendering', () => {
    it('should render io-split as child', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split')
      expect(ioSplit).toBeTruthy()
    })

    it('should pass split to io-split', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.split).toBe(split)
    })

    it('should pass elements to io-split', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })
      const elements = [{ tag: 'div', props: { id: 'tab1' } }]

      layout = new IoLayout({ split, elements })
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.elements).toBe(elements)
    })

    it('should pass addMenuOption to io-split', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })
      const menuOption = new MenuOption({ options: [{ id: 'new', label: 'New Tab' }] })

      layout = new IoLayout({ split, elements: [], addMenuOption: menuOption })
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.addMenuOption).toBe(menuOption)
    })

    it('should render nested structure correctly', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'panelA' }] },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'panelB' }] },
              { type: 'panel', tabs: [{ id: 'panelC' }] }
            ]
          }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioSplits = layout.querySelectorAll('io-split')
      expect(ioSplits.length).toBe(2)

      const ioPanels = layout.querySelectorAll('io-panel')
      expect(ioPanels.length).toBe(3)
    })

    it('should render dividers between panels', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          { type: 'panel', tabs: [{ id: 'tab2' }] },
          { type: 'panel', tabs: [{ id: 'tab3' }] }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const dividers = layout.querySelectorAll('io-divider')
      expect(dividers.length).toBe(2)
    })
  })

  describe('Reactive Updates', () => {
    it('should re-render when split changes', () => {
      const split1 = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'original' }] }]
      })

      layout = new IoLayout({ split: split1, elements: [] })
      container.appendChild(layout)

      expect(layout.split.children[0].tabs[0].id).toBe('original')

      const split2 = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'replaced' }] }]
      })

      layout.split = split2
      expect(layout.split).toBe(split2)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.split).toBe(split2)
    })

    it('should re-render when elements change', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })
      const elements1 = [{ tag: 'div', props: { id: 'tab1' } }]

      layout = new IoLayout({ split, elements: elements1 })
      container.appendChild(layout)

      const elements2 = [{ tag: 'span', props: { id: 'tab1' } }]
      layout.elements = elements2

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.elements).toBe(elements2)
    })

    it('should propagate split mutations to child elements', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }, { id: 'tab2' }] }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      // Add a new tab to the panel
      const panel = split.children[0] as Panel
      const newTab = { id: 'tab3', label: 'Tab 3', selected: false }
      panel.tabs.push(newTab)

      // The mutation should propagate through the reactive system
      const ioPanel = layout.querySelector('io-panel') as IoPanel
      expect(ioPanel.panel.tabs.length).toBe(3)
    })
  })

  describe('Complex Layouts', () => {
    it('should handle deeply nested splits', () => {
      const split = new Split({
        type: 'split',
        children: [
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              {
                type: 'split',
                orientation: 'horizontal',
                children: [
                  { type: 'panel', tabs: [{ id: 'deep1' }] },
                  { type: 'panel', tabs: [{ id: 'deep2' }] }
                ]
              },
              { type: 'panel', tabs: [{ id: 'mid' }] }
            ]
          },
          { type: 'panel', tabs: [{ id: 'side' }] }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const panels = layout.querySelectorAll('io-panel')
      expect(panels.length).toBe(4)
    })

    it('should apply construction consolidation correctly', () => {
      // Single split child should be consolidated
      const split = new Split({
        type: 'split',
        children: [
          {
            type: 'split',
            orientation: 'horizontal',
            children: [
              { type: 'panel', tabs: [{ id: 'A' }] },
              { type: 'panel', tabs: [{ id: 'B' }] }
            ]
          }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      // Due to consolidation, root split should have adopted the child's children
      expect(split.children.length).toBe(2)
      expect(split.orientation).toBe('horizontal')
    })

    it('should handle single panel layout', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'only' }] }]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const panels = layout.querySelectorAll('io-panel')
      expect(panels.length).toBe(1)

      const dividers = layout.querySelectorAll('io-divider')
      expect(dividers.length).toBe(0)
    })

    it('should handle multiple tabs per panel', () => {
      const split = new Split({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [
              { id: 'tab1', label: 'Tab 1' },
              { id: 'tab2', label: 'Tab 2' },
              { id: 'tab3', label: 'Tab 3' }
            ]
          }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioTabs = layout.querySelector('io-tabs')
      expect(ioTabs).toBeTruthy()

      const tabElements = layout.querySelectorAll('io-tab')
      expect(tabElements.length).toBe(3)
    })
  })

  describe('Static Properties', () => {
    it('should have Style getter', () => {
      expect(IoLayout.Style).toBeDefined()
      expect(typeof IoLayout.Style).toBe('string')
      expect(IoLayout.Style).toContain(':host')
      expect(IoLayout.Style).toContain('position: relative')
    })

    it('should have flex styling for full-size layout', () => {
      expect(IoLayout.Style).toContain('flex: 1 1 100%')
    })

    it('should constrain child io-split size', () => {
      expect(IoLayout.Style).toContain(':host > io-split')
      expect(IoLayout.Style).toContain('max-width: 100%')
      expect(IoLayout.Style).toContain('max-height: 100%')
    })
  })

  describe('Element Integration', () => {
    it('should display correct content based on selected tab', () => {
      const split = new Split({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [
              { id: 'content-a', label: 'A', selected: true },
              { id: 'content-b', label: 'B' }
            ]
          }
        ]
      })
      const elements = [
        { tag: 'div', props: { id: 'content-a' }, children: ['Content A'] },
        { tag: 'div', props: { id: 'content-b' }, children: ['Content B'] }
      ]

      layout = new IoLayout({ split, elements })
      container.appendChild(layout)

      const selector = layout.querySelector('io-selector')
      expect(selector).toBeTruthy()
      expect(selector.selected).toBe('content-a')
    })

    it('should switch displayed content when selection changes', () => {
      const split = new Split({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [
              { id: 'first', label: 'First', selected: true },
              { id: 'second', label: 'Second' }
            ]
          }
        ]
      })
      const elements = [
        { tag: 'div', props: { id: 'first' } },
        { tag: 'div', props: { id: 'second' } }
      ]

      layout = new IoLayout({ split, elements })
      container.appendChild(layout)

      const panel = split.children[0] as Panel
      panel.setSelected('second')

      const selector = layout.querySelector('io-selector')
      // After mutation propagation, selector should update
      const ioPanel = layout.querySelector('io-panel') as IoPanel
      ioPanel.changed()

      expect(selector.selected).toBe('second')
    })
  })

  describe('Orientation', () => {
    it('should support horizontal orientation', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'left' }] },
          { type: 'panel', tabs: [{ id: 'right' }] }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.getAttribute('orientation')).toBe('horizontal')
    })

    it('should support vertical orientation', () => {
      const split = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          { type: 'panel', tabs: [{ id: 'top' }] },
          { type: 'panel', tabs: [{ id: 'bottom' }] }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      expect(ioSplit.getAttribute('orientation')).toBe('vertical')
    })

    it('should handle mixed orientations', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'left' }] },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'top-right' }] },
              { type: 'panel', tabs: [{ id: 'bottom-right' }] }
            ]
          }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const ioSplits = layout.querySelectorAll('io-split')
      expect(ioSplits[0].getAttribute('orientation')).toBe('horizontal')
      expect(ioSplits[1].getAttribute('orientation')).toBe('vertical')
    })
  })

  describe('Flex Values', () => {
    it('should apply flex values from split', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'fixed' }], flex: '0 0 200px' },
          { type: 'panel', tabs: [{ id: 'grow' }], flex: '1 1 auto' }
        ]
      })

      layout = new IoLayout({ split, elements: [] })
      container.appendChild(layout)

      const panels = layout.querySelectorAll('io-panel')
      expect(panels[0].style.flex).toBe('0 0 200px')
      expect(panels[1].style.flex).toBe('1 1 auto')
    })
  })
})

describe('IoLayout Factory Function', () => {
  it('should export ioLayout factory function', () => {
    expect(typeof ioLayout).toBe('function')
  })

  it('should create virtual constructor from factory', () => {
    const split = new Split({
      type: 'split',
      children: [{ type: 'panel', tabs: [{ id: 'factory-test' }] }]
    })
    const vdom = ioLayout({ split, elements: [] })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-layout')
  })
})

