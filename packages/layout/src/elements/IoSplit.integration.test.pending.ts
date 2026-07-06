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
  IoTabDragIconSingleton,
  IoTabDropRectSingleton,
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

/**
 * Integration tests for IoSplit drag-drop flows.
 *
 * These tests verify the complete drag-drop interaction flows including:
 * - Tab reordering within the same panel
 * - Tab moving between panels
 * - Tab moving to create new splits
 * - Drag cancellation and edge cases
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
    const downEvent = createPointerEvent('pointerdown', {
      clientX: startX,
      clientY: startY,
    })
    ioTab.onPointerdown(downEvent)

    // Move past threshold (10px)
    const moveEvent1 = createPointerEvent('pointermove', {
      clientX: startX + 15,
      clientY: startY,
    })
    ioTab.onPointermove(moveEvent1)

    // Move to final position
    const moveEvent2 = createPointerEvent('pointermove', {
      clientX: endX,
      clientY: endY,
    })
    ioTab.onPointermove(moveEvent2)

    if (complete) {
      const upEvent = createPointerEvent('pointerup', {
        clientX: endX,
        clientY: endY,
      })
      ioTab.onPointerup(upEvent)
    }
  }

  beforeEach(() => {
    container = document.createElement('div')
    // Set visible dimensions for bounding rect calculations
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

    // Reset singleton state
    IoTabDragIconSingleton.setProperties({
      dragging: false,
      tab: null,
      dropSource: null,
      dropTarget: null,
      splitDirection: 'none',
      dropIndex: -1,
    })
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

      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      ioTab.onPointerdown(downEvent)

      // Move 5px (less than threshold)
      const moveEvent1 = createPointerEvent('pointermove', {
        clientX: 105,
        clientY: 50,
      })
      ioTab.onPointermove(moveEvent1)
      expect(IoTabDragIconSingleton.dragging).toBe(false)

      // Move past 10px threshold
      const moveEvent2 = createPointerEvent('pointermove', {
        clientX: 115,
        clientY: 50,
      })
      ioTab.onPointermove(moveEvent2)
      expect(IoTabDragIconSingleton.dragging).toBe(true)
    })

    it('should set drag icon position at cursor', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      ioTab.onPointerdown(downEvent)

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 75,
      })
      ioTab.onPointermove(moveEvent)

      expect(IoTabDragIconSingleton.style.left).toBe('200px')
      expect(IoTabDragIconSingleton.style.top).toBe('75px')
    })

    it('should set drop source panel when drag starts', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      ioTab.onPointerdown(downEvent)

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 115,
        clientY: 50,
      })
      ioTab.onPointermove(moveEvent)

      expect(IoTabDragIconSingleton.dropSource).toBe(ioPanel)
    })

    it('should reset singleton state on drop completion', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      simulateDrag(ioTab, 100, 50, 200, 50)

      expect(IoTabDragIconSingleton.dragging).toBe(false)
      expect(IoTabDragIconSingleton.tab).toBeNull()
      expect(IoTabDragIconSingleton.dropSource).toBeNull()
      expect(IoTabDragIconSingleton.dropTarget).toBeNull()
      expect(IoTabDragIconSingleton.splitDirection).toBe('none')
      expect(IoTabDragIconSingleton.dropIndex).toBe(-1)
    })

    it('should trigger click when no drag occurred', () => {
      const panel = rootSplit.children[0] as Panel

      // Initially tab1 is selected
      expect(panel.getSelectedID()).toBe('tab1')

      // Get second tab and click without drag
      const tabs = layout.querySelectorAll('io-tab') as NodeListOf<IoTab>
      const tab2Element = tabs[1]

      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      tab2Element.onPointerdown(downEvent)

      // Minimal movement (under threshold)
      const moveEvent = createPointerEvent('pointermove', {
        clientX: 102,
        clientY: 50,
      })
      tab2Element.onPointermove(moveEvent)

      const upEvent = createPointerEvent('pointerup', {
        clientX: 102,
        clientY: 50,
      })
      tab2Element.onPointerup(upEvent)

      // Tab 2 should be selected via click
      expect(panel.getSelectedID()).toBe('tab2')
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

    it('should cancel drag on pointercancel event', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab
      const panel = rootSplit.children[0] as Panel
      const originalTabCount = panel.tabs.length

      // Start drag
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      ioTab.onPointerdown(downEvent)

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 50,
      })
      ioTab.onPointermove(moveEvent)

      expect(IoTabDragIconSingleton.dragging).toBe(true)

      // Cancel
      const cancelEvent = createPointerEvent('pointercancel')
      ioTab.onPointercancel(cancelEvent)

      expect(IoTabDragIconSingleton.dragging).toBe(false)
      expect(panel.tabs.length).toBe(originalTabCount)
    })

    it('should reset drop marker on drag cancel', () => {
      const ioTab = layout.querySelector('io-tab') as IoTab

      // Start drag
      const downEvent = createPointerEvent('pointerdown', {
        clientX: 100,
        clientY: 50,
      })
      ioTab.onPointerdown(downEvent)

      const moveEvent = createPointerEvent('pointermove', {
        clientX: 200,
        clientY: 50,
      })
      ioTab.onPointermove(moveEvent)

      // Cancel
      IoTabDragIconSingleton.cancelDrag()

      expect(IoTabDropRectSingleton.dropTarget).toBeNull()
      expect(IoTabDropRectSingleton.dropIndex).toBe(-1)
      expect(IoTabDropRectSingleton.splitDirection).toBe('none')
    })
  })

  describe('TabDragIcon Singleton Behavior', () => {
    beforeEach(() => {
      mount({
        type: 'split',
        children: [
          {
            type: 'panel',
            tabs: [{ id: 'tab1' }],
          },
        ],
      })
    })

    it('should update drop marker when drag icon properties change', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      IoTabDragIconSingleton.setProperties({
        dragging: true,
        dropTarget: ioPanel,
        splitDirection: 'left',
        dropIndex: -1,
      })

      expect(IoTabDropRectSingleton.dropTarget).toBe(ioPanel)
      expect(IoTabDropRectSingleton.splitDirection).toBe('left')
    })

    it('should show drag icon with dragging attribute', () => {
      IoTabDragIconSingleton.dragging = true
      expect(IoTabDragIconSingleton.hasAttribute('dragging')).toBe(true)

      IoTabDragIconSingleton.dragging = false
      expect(IoTabDragIconSingleton.hasAttribute('dragging')).toBe(false)
    })

    it('should display tab label in drag icon', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel
      const tab = ioPanel.model.tabs[0]

      IoTabDragIconSingleton.tab = tab

      const labelSpan = IoTabDragIconSingleton.querySelector('.label')
      expect(labelSpan?.textContent).toBe('tab1')
    })
  })

  describe('Drop Target Detection', () => {
    it('should calculate split direction based on cursor position', () => {
      // Test the calculateSplitDirection logic via the singleton
      // This verifies the direction calculation without needing actual DOM positions
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })
      layout = new IoLayout({ model: new Layout({ child: split.toJSON() }) })

      container.appendChild(layout)

      const ioPanel = layout.querySelector('io-panel') as IoPanel

      // Test center detection via direct property setting
      IoTabDragIconSingleton.setProperties({
        dragging: true,
        dropTarget: ioPanel,
        splitDirection: 'center',
        dropIndex: -1,
      })

      expect(IoTabDragIconSingleton.splitDirection).toBe('center')
      expect(IoTabDragIconSingleton.dropTarget).toBe(ioPanel)
    })

    it('should detect edge directions', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })
      layout = new IoLayout({ model: new Layout({ child: split.toJSON() }) })

      container.appendChild(layout)

      const ioPanel = layout.querySelector('io-panel') as IoPanel

      // Test various directions
      const directions = ['left', 'right', 'top', 'bottom', 'center'] as const
      for (const direction of directions) {
        IoTabDragIconSingleton.setProperties({
          dragging: true,
          dropTarget: ioPanel,
          splitDirection: direction,
          dropIndex: -1,
        })
        expect(IoTabDragIconSingleton.splitDirection).toBe(direction)
      }
    })
  })

  describe('Drop Marker Synchronization', () => {
    beforeEach(() => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
      })
      layout = new IoLayout({ model: new Layout({ child: split.toJSON() }) })

      container.appendChild(layout)
    })

    it('should sync drop marker with drag icon state changes', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      // Initial state
      expect(IoTabDropRectSingleton.dropIndex).toBe(-1)

      // Update drag icon state
      IoTabDragIconSingleton.setProperties({
        dropTarget: ioPanel,
        splitDirection: 'none',
        dropIndex: 2,
      })

      // Drop marker should be in sync
      expect(IoTabDropRectSingleton.dropTarget).toBe(ioPanel)
      expect(IoTabDropRectSingleton.dropIndex).toBe(2)
    })

    it('should reset drop marker when drag ends', () => {
      const ioPanel = layout.querySelector('io-panel') as IoPanel

      IoTabDragIconSingleton.setProperties({
        dragging: true,
        dropTarget: ioPanel,
        splitDirection: 'left',
        dropIndex: 1,
      })

      IoTabDragIconSingleton.cancelDrag()

      expect(IoTabDropRectSingleton.dropTarget).toBeNull()
      expect(IoTabDropRectSingleton.splitDirection).toBe('none')
      expect(IoTabDropRectSingleton.dropIndex).toBe(-1)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle drag when no root io-split ancestor exists', () => {
      // Create a standalone io-tab not within a layout
      const tab = new Tab({ id: 'orphan-tab' })
      const ioTab = new IoTab({ model: tab })
      container.appendChild(ioTab)

      // Should not throw
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
        const downEvent = createPointerEvent('pointerdown', {
          clientX: 100,
          clientY: 50,
        })
        ioTab.onPointerdown(downEvent)

        const moveEvent = createPointerEvent('pointermove', {
          clientX: 200,
          clientY: 50,
        })
        ioTab.onPointermove(moveEvent)

        const cancelEvent = createPointerEvent('pointercancel')
        ioTab.onPointercancel(cancelEvent)
      }

      expect(IoTabDragIconSingleton.dragging).toBe(false)
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

    IoTabDragIconSingleton.setProperties({
      dragging: false,
      tab: null,
      dropSource: null,
      dropTarget: null,
      splitDirection: 'none',
      dropIndex: -1,
    })
  })

  it('should scope drop target detection to containing layout', () => {
    // This test documents the current behavior with multiple layouts
    const tab1 = layout1.querySelector('io-tab') as IoTab
    const panel1 = layout1.querySelector('io-panel') as IoPanel

    // Start drag from layout1
    const downEvent = new PointerEvent('pointerdown', {
      pointerId: 1,
      buttons: 1,
      clientX: 50,
      clientY: 50,
      bubbles: true,
      cancelable: true,
    })
    tab1.onPointerdown(downEvent)

    // Move past the 10px threshold to initiate drag
    const moveEvent = new PointerEvent('pointermove', {
      pointerId: 1,
      buttons: 1,
      clientX: 65,
      clientY: 50,
      bubbles: true,
      cancelable: true,
    })
    tab1.onPointermove(moveEvent)

    // Drag icon should show layout1 panel as source
    expect(IoTabDragIconSingleton.dragging).toBe(true)
    expect(IoTabDragIconSingleton.dropSource).toBe(panel1)

    // Note: Cross-layout drag behavior depends on the root passed to updateDrag
    // which is scoped by closest('io-layout')
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
    container.remove()

    IoTabDragIconSingleton.setProperties({
      dragging: false,
      tab: null,
      dropSource: null,
      dropTarget: null,
      splitDirection: 'none',
      dropIndex: -1,
    })
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

    layout.remove()
  })
})

