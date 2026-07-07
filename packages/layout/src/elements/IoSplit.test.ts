//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { Split, IoSplit, Layout, Panel } from '@io-gui/layout'

describe('IoSplit View Element', () => {
  let layout: IoSplit
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.visibility = 'hidden'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (layout) {
      layout.remove()
    }
    container.remove()
  })

  describe('updateVisibleAutoSize', () => {
    it('Should reflect hasVisibleAutoSize when no child grows', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}], size: '200px'},
          {type: 'panel', tabs: [{id: 'tab2'}], size: '300px'}
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.appendChild(layout)

      layout.ensureOneHasAutoSize()

      expect(layout.hasVisibleAutoSize).toBe(false)
    })

    it('Should reflect hasVisibleAutoSize when at least one child has auto size', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}], size: '200px'},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.appendChild(layout)

      layout.ensureOneHasAutoSize()

      expect(layout.hasVisibleAutoSize).toBe(true)
    })
  })

  describe('Rendering', () => {
    it('Should render io-panel for Panel children', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.appendChild(layout)

      const panels = layout.querySelectorAll('io-panel')
      expect(panels.length).toBe(2)
    })

    it('Should render io-split for Split children', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {
            type: 'split',
            children: [
              {type: 'panel', tabs: [{id: 'tab2'}]},
              {type: 'panel', tabs: [{id: 'tab3'}]}
            ]
          }
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.appendChild(layout)

      const splits = layout.querySelectorAll('io-split')
      expect(splits.length).toBe(1)
    })

    it('Should render io-divider between children', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]},
          {type: 'panel', tabs: [{id: 'tab3'}]}
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.appendChild(layout)

      const dividers = layout.querySelectorAll('io-divider')
      expect(dividers.length).toBe(2)
    })

    it('Should set orientation attribute', () => {
      const split = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.appendChild(layout)

      expect(layout.getAttribute('orientation')).toBe('vertical')
    })
  })

  describe('Drawer collapse on resize', () => {
    async function flushFrames(count = 3) {
      for (let i = 0; i < count; i++) await nextFrame()
    }

    it('Should restore all panel content after drawers are removed on expand', async () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1', label: 'Panel 1'}], size: '200px'},
          {type: 'panel', tabs: [{id: 'tab2', label: 'Panel 2'}]},
          {type: 'panel', tabs: [{id: 'tab3', label: 'Panel 3'}], size: '200px'},
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.style.cssText = 'position:fixed;width:800px;height:400px;'
      container.appendChild(layout)
      await flushFrames()

      expect(layout.querySelectorAll(':scope > io-panel').length).toBe(3)
      expect(layout.querySelectorAll(':scope > io-drawer').length).toBe(0)

      container.style.width = '350px'
      layout.onResized()
      await flushFrames()

      expect(layout.leadingCollapsedChildModel).not.toBeNull()
      expect(layout.trailingCollapsedChildModel).not.toBeNull()
      expect(layout.querySelectorAll(':scope > io-drawer').length).toBe(2)

      container.style.width = '800px'
      layout.onResized()
      await flushFrames()

      expect(layout.leadingCollapsedChildModel).toBeNull()
      expect(layout.trailingCollapsedChildModel).toBeNull()
      expect(layout.querySelectorAll(':scope > io-drawer').length).toBe(0)

      const panels = layout.querySelectorAll(':scope > io-panel')
      expect(panels.length).toBe(3)
      panels.forEach(panel => {
        expect(panel.querySelectorAll('io-tab').length).toBeGreaterThan(0)
        expect(panel.querySelector('io-selector')).not.toBeNull()
        expect(panel.getBoundingClientRect().width).toBeGreaterThan(0)
      })
    })

    it('Should restore leading drawer panel after expand', async () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1', label: 'Panel 1'}], size: '200px'},
          {type: 'panel', tabs: [{id: 'tab2', label: 'Panel 2'}]},
        ]
      })

      layout = new IoSplit({model: split, elements: []})
      container.style.cssText = 'position:fixed;width:800px;height:400px;'
      container.appendChild(layout)
      await flushFrames()

      container.style.width = '250px'
      layout.onResized()
      await flushFrames()

      expect(layout.leadingCollapsedChildModel).not.toBeNull()

      container.style.width = '800px'
      layout.onResized()
      await flushFrames()

      expect(layout.leadingCollapsedChildModel).toBeNull()
      const panels = layout.querySelectorAll(':scope > io-panel')
      expect(panels.length).toBe(2)
      panels.forEach(panel => {
        expect(panel.querySelectorAll('io-tab').length).toBeGreaterThan(0)
        expect(panel.getBoundingClientRect().width).toBeGreaterThan(0)
      })
    })
  })

  describe('calculateCollapsedDrawers', () => {
    it('Should not throw when model children is empty', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })

      layout = new IoSplit({ model: split, elements: [] })
      container.style.cssText = 'position:fixed;width:800px;height:400px;'
      container.appendChild(layout)

      split.children.splice(0, split.children.length)

      expect(() => layout.calculateCollapsedDrawers()).not.toThrow()
      expect(layout.leadingCollapsedChildModel).toBeNull()
      expect(layout.trailingCollapsedChildModel).toBeNull()
    })

    it('Should not throw when nested split consolidates sole panel child', async () => {
      const layoutModel = new Layout({
        child: {
          type: 'split',
          children: [
            {
              type: 'split',
              size: '350px',
              children: [
                { type: 'panel', tabs: [{ id: 'Inputs' }] },
                { type: 'panel', tabs: [{ id: 'Getting Started' }] },
              ],
            },
            { type: 'panel', tabs: [{ id: 'Theme Editor' }] },
          ],
        },
      })

      const rootSplit = layoutModel.child as Split
      const innerSplit = rootSplit.children[0] as Split
      const innerIoSplit = new IoSplit({ model: innerSplit, elements: [] })
      container.style.cssText = 'position:fixed;width:800px;height:400px;'
      container.appendChild(innerIoSplit)
      await nextFrame()

      const panelToEmpty = innerSplit.children[0] as Panel
      while (panelToEmpty.tabs.length > 0) {
        panelToEmpty.removeTab(panelToEmpty.tabs[0])
      }

      expect(() => layoutModel.normalize()).not.toThrow()
      await nextFrame()

      innerIoSplit.remove()
    })
  })

  describe('Static Fields', () => {
    it('Should have Style getter', () => {
      expect(IoSplit.Style).toBeDefined()
      expect(typeof IoSplit.Style).toBe('string')
      expect(IoSplit.Style).toContain(':host')
      expect(IoSplit.Style).toContain('flex-direction')
      expect(IoSplit.Style).toContain('hasvisibleautosize')
    })

    it('Should have Listeners getter', () => {
      expect(IoSplit.Listeners).toBeDefined()
      expect(IoSplit.Listeners['io-divider-move']).toBe('onDividerMove')
      expect(IoSplit.Listeners['io-divider-move-end']).toBe('onDividerMoveEnd')
    })
  })
})
