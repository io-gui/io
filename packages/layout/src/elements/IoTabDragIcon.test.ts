import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { tabDragIconSingleton, Tab } from '@io-gui/layout'

describe('IoTabDragIcon', () => {
  let tab: Tab
  let mockPanel: { tagName: string }

  beforeEach(() => {
    tab = new Tab({ id: 'drag-tab', label: 'Drag Me', icon: 'io:test' })
    mockPanel = { tagName: 'IO-PANEL' }
    tabDragIconSingleton.cancelDrag()
  })

  afterEach(() => {
    tab.dispose()
    tabDragIconSingleton.cancelDrag()
  })

  it('starts in idle state', () => {
    expect(tabDragIconSingleton.dragging).toBe(false)
    expect(tabDragIconSingleton.tab).toBeNull()
  })

  it('does not drag until threshold is exceeded', () => {
    tabDragIconSingleton.setStartPosition(100, 100)
    tabDragIconSingleton.updateDrag(tab, mockPanel as any, 105, 105, null)
    expect(tabDragIconSingleton.dragging).toBe(false)
  })

  it('starts dragging after threshold exceeded', () => {
    tabDragIconSingleton.setStartPosition(100, 100)
    tabDragIconSingleton.updateDrag(tab, mockPanel as any, 120, 100, null)
    expect(tabDragIconSingleton.dragging).toBe(true)
    expect(tabDragIconSingleton.tab).toBe(tab)
    expect(tabDragIconSingleton.dropSource).toBe(mockPanel)
  })

  it('updates cursor position while dragging', () => {
    tabDragIconSingleton.setStartPosition(100, 100)
    tabDragIconSingleton.updateDrag(tab, mockPanel as any, 120, 100, null)
    tabDragIconSingleton.updateDrag(tab, mockPanel as any, 200, 150, null)
    expect(tabDragIconSingleton.style.left).toBe('200px')
    expect(tabDragIconSingleton.style.top).toBe('150px')
  })

  it('cancelDrag resets all drag state', () => {
    tabDragIconSingleton.setProperties({
      dragging: true,
      tab,
      dropSource: mockPanel as any,
      dropTarget: mockPanel as any,
      splitDirection: 'left',
      dropIndex: 2,
    })
    tabDragIconSingleton.cancelDrag()
    expect(tabDragIconSingleton.dragging).toBe(false)
    expect(tabDragIconSingleton.tab).toBeNull()
    expect(tabDragIconSingleton.dropSource).toBeNull()
    expect(tabDragIconSingleton.dropTarget).toBeNull()
    expect(tabDragIconSingleton.splitDirection).toBe('none')
    expect(tabDragIconSingleton.dropIndex).toBe(-1)
  })

  it('renders tab icon and label when tab is set', () => {
    tabDragIconSingleton.tab = tab
    tabDragIconSingleton.mutated()
    expect(tabDragIconSingleton.querySelector('io-icon')).toBeTruthy()
    expect(tabDragIconSingleton.textContent).toContain('Drag Me')
  })
})
