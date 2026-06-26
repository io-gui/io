import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoTabDragIconSingleton, Tab } from '@io-gui/layout'

describe('IoTabDragIcon', () => {
  let tab: Tab
  let mockPanel: { tagName: string }

  beforeEach(() => {
    tab = new Tab({ id: 'drag-tab', label: 'Drag Me', icon: 'io:test' })
    mockPanel = { tagName: 'IO-PANEL' }
    IoTabDragIconSingleton.cancelDrag()
  })

  afterEach(() => {
    tab.dispose()
    IoTabDragIconSingleton.cancelDrag()
  })

  it('starts in idle state', () => {
    expect(IoTabDragIconSingleton.dragging).toBe(false)
    expect(IoTabDragIconSingleton.tab).toBeNull()
  })

  it('does not drag until threshold is exceeded', () => {
    IoTabDragIconSingleton.setStartPosition(100, 100)
    IoTabDragIconSingleton.updateDrag(tab, mockPanel as any, 105, 105, null)
    expect(IoTabDragIconSingleton.dragging).toBe(false)
  })

  it('starts dragging after threshold exceeded', () => {
    IoTabDragIconSingleton.setStartPosition(100, 100)
    IoTabDragIconSingleton.updateDrag(tab, mockPanel as any, 120, 100, null)
    expect(IoTabDragIconSingleton.dragging).toBe(true)
    expect(IoTabDragIconSingleton.tab).toBe(tab)
    expect(IoTabDragIconSingleton.dropSource).toBe(mockPanel)
  })

  it('updates cursor position while dragging', () => {
    IoTabDragIconSingleton.setStartPosition(100, 100)
    IoTabDragIconSingleton.updateDrag(tab, mockPanel as any, 120, 100, null)
    IoTabDragIconSingleton.updateDrag(tab, mockPanel as any, 200, 150, null)
    expect(IoTabDragIconSingleton.style.left).toBe('200px')
    expect(IoTabDragIconSingleton.style.top).toBe('150px')
  })

  it('cancelDrag resets all drag state', () => {
    IoTabDragIconSingleton.setProperties({
      dragging: true,
      tab,
      dropSource: mockPanel as any,
      dropTarget: mockPanel as any,
      splitDirection: 'left',
      dropIndex: 2,
    })
    IoTabDragIconSingleton.cancelDrag()
    expect(IoTabDragIconSingleton.dragging).toBe(false)
    expect(IoTabDragIconSingleton.tab).toBeNull()
    expect(IoTabDragIconSingleton.dropSource).toBeNull()
    expect(IoTabDragIconSingleton.dropTarget).toBeNull()
    expect(IoTabDragIconSingleton.splitDirection).toBe('none')
    expect(IoTabDragIconSingleton.dropIndex).toBe(-1)
  })

  it('renders tab icon and label when tab is set', () => {
    IoTabDragIconSingleton.tab = tab
    IoTabDragIconSingleton.mutated()
    expect(IoTabDragIconSingleton.querySelector('io-icon')).toBeTruthy()
    expect(IoTabDragIconSingleton.textContent).toContain('Drag Me')
  })
})
