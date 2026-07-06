//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  IoPanel,
  IoTab,
  IoLayout,
  Split,
  Panel,
  Tab,
  Layout,
} from '@io-gui/layout'

function mountSplit(
  container: HTMLElement,
  tree: SplitData
): { layout: IoLayout; layoutModel: Layout; rootSplit: Split } {
  const layoutModel = new Layout({ child: tree })
  const layout = new IoLayout({ model: layoutModel, elements: [] })
  container.appendChild(layout)
  return { layout, layoutModel, rootSplit: layoutModel.child as Split }
}

function resetDragGhost(layout: IoLayout) {
  layout.$tabDragGhost.expanded = false
  layout.$tabDragGhost.setDropTarget(null)
}

/**
 * Integration tests for IoSplit drag-drop flows.
 */
describe('IoSplit Integration - Drag Drop Flows', () => {
  let layout: IoLayout
  let container: HTMLElement

  function mount(tree: SplitData): { layoutModel: Layout; rootSplit: Split } {
    const mounted = mountSplit(container, tree)
    layout = mounted.layout
    return { layoutModel: mounted.layoutModel, rootSplit: mounted.rootSplit }
  }

  function createPointerEvent(
    type: string,
    options: Partial<PointerEventInit> = {}
  ): PointerEvent {
    return new PointerEvent(type, {
      pointerId: 1,
      buttons: type === 'pointerup' ? 0 : 1,
      bubbles: true,
      cancelable: true,
      ...options,
    })
  }

  function simulateDrag(
    ioTab: IoTab,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    complete: boolean = true
  ) {
    ioTab.onPointerdown(createPointerEvent('pointerdown', {
      clientX: startX,
      clientY: startY,
    }))

    ioTab.onPointermove(createPointerEvent('pointermove', {
      clientX: startX + 15,
      clientY: startY,
    }))

    ioTab.onPointermove(createPointerEvent('pointermove', {
      clientX: endX,
      clientY: endY,
    }))

    if (complete) {
      ioTab.onPointerup(createPointerEvent('pointerup', {
        clientX: endX,
        clientY: endY,
      }))
    }
  }

  beforeEach(() => {
    container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 800px;
      height: 600px;
    `
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (layout) {
      layout.remove()
    }
    container.remove()
  })

  describe('Tab Reordering Within Same Panel', () => {
    let rootSplit: Split

    beforeEach(() => {
      ({ rootSplit } = mount({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [
              { id: 'tab1', label: 'Tab 1', selected: true },
              { id: 'tab2', label: 'Tab 2' },
              { id: 'tab3', label: 'Tab 3' },
            ],
          },
        ],
      }))
    })

    it('should initiate drag after moving past threshold', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      ioTab.onPointerdown(createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      }))

      ioTab.onPointermove(createPointerEvent('pointermove', {
        clientX: 105,
        clientY: 50,
      }))
      expect(layout.$tabDragGhost.expanded).toBe(false)

      ioTab.onPointermove(createPointerEvent('pointermove', {
        clientX: 115,
        clientY: 50,
      }))
      expect(layout.$tabDragGhost.expanded).toBe(true)
    })

    it('should set drag ghost position at cursor', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      ioTab.onPointerdown(createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      }))

      ioTab.onPointermove(createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 75,
      }))

      expect(layout.$tabDragGhost.style.left).toBe('200px')
      expect(layout.$tabDragGhost.style.top).toBe('75px')
    })

    it('should set drag ghost model when drag starts', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      ioTab.onPointerdown(createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      }))

      ioTab.onPointermove(createPointerEvent('pointermove', {
        clientX: 115,
        clientY: 50,
      }))

      expect(layout.$tabDragGhost.model.id).toBe('tab1')
    })

    it('should reset drag ghost state on drop completion', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      simulateDrag(ioTab, 100, 50, 200, 50)

      expect(layout.$tabDragGhost.expanded).toBe(false)
      expect(layout.$tabDragGhost.splitDirection).toBe('center')
      expect(layout.$tabDragGhost.dropIndex).toBe(-1)
    })

    it('should trigger select when no drag occurred', () => {
      const panel = rootSplit.children[0] as Panel

      expect(panel.selectedID).toBe('tab1')

      const tabs = layout.querySelectorAll('io-tab') as NodeListOf<IoTab>
      const tab2Element = tabs[1]

      tab2Element.onPointerdown(createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      }))

      tab2Element.onPointermove(createPointerEvent('pointermove', {
        clientX: 102,
        clientY: 50,
      }))

      tab2Element.onPointerup(createPointerEvent('pointerup', {
        clientX: 102,
        clientY: 50,
      }))

      tab2Element.onClick()

      expect(panel.selectedID).toBe('tab2')
    })
  })

  describe('Drag Cancellation', () => {
    let rootSplit: Split

    beforeEach(() => {
      ({ rootSplit } = mount({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [
              { id: 'tab1' },
              { id: 'tab2' },
            ],
          },
        ],
      }))
    })

    it('should keep panel tabs unchanged on pointercancel event', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab
      const panel = rootSplit.children[0] as Panel
      const originalTabCount = panel.tabs.length

      ioTab.onPointerdown(createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      }))

      ioTab.onPointermove(createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 50,
      }))

      expect(layout.$tabDragGhost.expanded).toBe(true)

      ioTab.onPointercancel(createPointerEvent('pointercancel'))

      expect(panel.tabs.length).toBe(originalTabCount)
    })

    it('should reset drop marker when drag ghost drop target is cleared', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      layout.$tabDragGhost.expanded = true
      layout.$tabDragGhost.setDropTarget({
        panel: ioPanel,
        panelRect: ioPanel.getBoundingClientRect(),
        tabs: [...ioPanel.querySelectorAll('io-tab')] as IoTab[],
        tabRects: [...ioPanel.querySelectorAll('io-tab')].map(tab => tab.getBoundingClientRect()),
        dropIndex: 1,
        splitDirection: 'left',
      })

      layout.$tabDragGhost.setDropTarget(null)

      expect(layout.$tabDragGhost.splitDirection).toBe('center')
      expect(layout.$tabDragGhost.dropIndex).toBe(-1)
    })
  })

  describe('TabDragGhost Behavior', () => {
    beforeEach(() => {
      mount({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [{ id: 'tab1', label: 'Tab 1' }],
          },
        ],
      })
    })

    it('should update split direction when drop target is set', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      layout.$tabDragGhost.setDropTarget({
        panel: ioPanel,
        panelRect: ioPanel.getBoundingClientRect(),
        tabs: [...ioPanel.querySelectorAll('io-tab')] as IoTab[],
        tabRects: [...ioPanel.querySelectorAll('io-tab')].map(tab => tab.getBoundingClientRect()),
        dropIndex: -1,
        splitDirection: 'left',
      })

      expect(layout.$tabDragGhost.splitDirection).toBe('left')
    })

    it('should show drag ghost with expanded attribute', () => {
      layout.$tabDragGhost.expanded = true
      expect(layout.$tabDragGhost.hasAttribute('expanded')).toBe(true)

      layout.$tabDragGhost.expanded = false
      expect(layout.$tabDragGhost.hasAttribute('expanded')).toBe(false)
    })

    it('should display tab label in drag ghost', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel
      const tab = ioPanel.model.tabs[0]

      layout.$tabDragGhost.model = tab

      const labelSpan = layout.$tabDragGhost.querySelector('.io-tab-label')
      expect(labelSpan?.textContent).toBe('Tab 1')
    })
  })

  describe('Drop Target Detection', () => {
    it('should detect center split direction from drop target', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })
      layout = new IoLayout({ model: new Layout({ child: split.toJSON() }), elements: [] })
      container.appendChild(layout)

      const ioPanel = layout.querySelector('io-panel') as IoPanel

      layout.$tabDragGhost.setDropTarget({
        panel: ioPanel,
        panelRect: ioPanel.getBoundingClientRect(),
        tabs: [...ioPanel.querySelectorAll('io-tab')] as IoTab[],
        tabRects: [...ioPanel.querySelectorAll('io-tab')].map(tab => tab.getBoundingClientRect()),
        dropIndex: -1,
        splitDirection: 'center',
      })

      expect(layout.$tabDragGhost.splitDirection).toBe('center')
    })

    it('should detect edge directions', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })
      layout = new IoLayout({ model: new Layout({ child: split.toJSON() }), elements: [] })
      container.appendChild(layout)

      const ioPanel = layout.querySelector('io-panel') as IoPanel
      const tabs = [...ioPanel.querySelectorAll('io-tab')] as IoTab[]
      const tabRects = tabs.map(tab => tab.getBoundingClientRect())
      const panelRect = ioPanel.getBoundingClientRect()

      const directions = ['left', 'right', 'top', 'bottom', 'center'] as const
      for (const direction of directions) {
        layout.$tabDragGhost.setDropTarget({
          panel: ioPanel,
          panelRect,
          tabs,
          tabRects,
          dropIndex: -1,
          splitDirection: direction,
        })
        expect(layout.$tabDragGhost.splitDirection).toBe(direction)
      }
    })
  })

  describe('Drop Marker Synchronization', () => {
    beforeEach(() => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })
      layout = new IoLayout({ model: new Layout({ child: split.toJSON() }), elements: [] })
      container.appendChild(layout)
    })

    it('should position drop marker tab for center drop target', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      layout.$tabDragGhost.setDropTarget({
        panel: ioPanel,
        panelRect: ioPanel.getBoundingClientRect(),
        tabs: [...ioPanel.querySelectorAll('io-tab')] as IoTab[],
        tabRects: [...ioPanel.querySelectorAll('io-tab')].map(tab => tab.getBoundingClientRect()),
        dropIndex: 0,
        splitDirection: 'center',
      })

      expect(layout.$tabDragGhost.splitDirection).toBe('center')
      expect(layout.$tabDragGhost.$['drop-marker-tab'].style.width).not.toBe('0px')
    })

    it('should reset drop marker when drag ghost drop target is cleared', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      layout.$tabDragGhost.setDropTarget({
        panel: ioPanel,
        panelRect: ioPanel.getBoundingClientRect(),
        tabs: [...ioPanel.querySelectorAll('io-tab')] as IoTab[],
        tabRects: [...ioPanel.querySelectorAll('io-tab')].map(tab => tab.getBoundingClientRect()),
        dropIndex: 1,
        splitDirection: 'left',
      })

      layout.$tabDragGhost.setDropTarget(null)

      expect(layout.$tabDragGhost.splitDirection).toBe('center')
      expect(layout.$tabDragGhost.dropIndex).toBe(-1)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle drag when no layout ancestor exists', () => {
      const tab = new Tab({ id: 'orphan-tab' })
      const ioTab = new IoTab({ model: tab })
      container.appendChild(ioTab)

      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      expect(() => ioTab.onPointerdown(downEvent)).not.toThrow()

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 50,
      })
      expect(() => ioTab.onPointermove(moveEvent)).not.toThrow()

      ioTab.remove()
      tab.dispose()
    })

    it('should handle rapid drag start/cancel sequences', () => {
      const { rootSplit } = mount({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })

      const ioTab = layout.querySelector('io-tab') as IoTab

      for (let i = 0; i < 5; i++) {
        ioTab.onPointerdown(createPointerEvent('pointerdown', {
          clientX: 100,
          clientY: 50,
        }))

        ioTab.onPointermove(createPointerEvent('pointermove', {
          clientX: 200,
          clientY: 50,
        }))

        ioTab.onPointercancel(createPointerEvent('pointercancel'))
        resetDragGhost(layout)
      }

      expect((rootSplit.children[0] as Panel).tabs.length).toBe(1)
    })
  })
})

describe('IoSplit Integration - Multiple Instances', () => {
  let layout1: IoLayout
  let layout2: IoLayout
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1600px;
      height: 600px;
    `
    document.body.appendChild(container)

    const model1 = new Layout({
      child: { type: 'split', children: [{ type: 'panel', tabs: [{ id: 'layout1-tab' }] }] },
    })
    layout1 = new IoLayout({ model: model1, elements: [] })
    layout1.style.cssText = 'width: 800px; height: 600px; float: left;'
    container.appendChild(layout1)

    const model2 = new Layout({
      child: { type: 'split', children: [{ type: 'panel', tabs: [{ id: 'layout2-tab' }] }] },
    })
    layout2 = new IoLayout({ model: model2, elements: [] })
    layout2.style.cssText = 'width: 800px; height: 600px; float: left;'
    container.appendChild(layout2)
  })

  afterEach(() => {
    layout1.remove()
    layout2.remove()
    container.remove()
  })

  it('should scope drag ghost to containing layout', () => {
    const tab1 = layout1.querySelector('io-tab') as IoTab

    tab1.onPointerdown(new PointerEvent('pointerdown', {
      pointerId: 1,
      buttons: 1,
      clientX: 50,
      clientY: 50,
      bubbles: true,
      cancelable: true,
    }))

    tab1.onPointermove(new PointerEvent('pointermove', {
      pointerId: 1,
      buttons: 1,
      clientX: 65,
      clientY: 50,
      bubbles: true,
      cancelable: true,
    }))

    expect(layout1.$tabDragGhost.expanded).toBe(true)
    expect(layout1.$tabDragGhost.model.id).toBe('layout1-tab')
    expect(layout2.$tabDragGhost.expanded).toBe(false)
  })
})

describe('IoSplit Integration - State Persistence', () => {
  let container: HTMLElement
  let layout: IoLayout

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

  it('should restore layout state from JSON', () => {
    const layoutModel = new Layout({
      child: {
        type: 'split' as const,
        orientation: 'horizontal' as const,
        children: [
          { type: 'panel' as const, tabs: [{ id: 'restored-tab1' }] },
          { type: 'panel' as const, tabs: [{ id: 'restored-tab2' }] },
        ],
      },
    })
    layout = new IoLayout({ model: layoutModel, elements: [] })
    container.appendChild(layout)

    const panels = layout.querySelectorAll('io-panel')
    expect(panels.length).toBe(2)
    expect((panels[0] as IoPanel).model.tabs[0].id).toBe('restored-tab1')
    expect((panels[1] as IoPanel).model.tabs[0].id).toBe('restored-tab2')
  })
})
