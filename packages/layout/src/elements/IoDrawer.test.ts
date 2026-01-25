//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoDrawer, ioDrawer } from '@io-gui/layout'
import { Panel } from '../nodes/Panel.js'
import { Split } from '../nodes/Split.js'
import { Tab } from '../nodes/Tab.js'

describe('IoDrawer', () => {
  let drawer: IoDrawer
  let container: HTMLElement
  let panel: Panel

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    panel = new Panel({
      type: 'panel',
      tabs: [new Tab({ id: 'tab1', label: 'Tab 1' })],
      flex: '0 0 200px'
    })

    drawer = new IoDrawer({
      orientation: 'horizontal',
      direction: 'leading',
      expanded: false,
      child: panel,
      elements: [],
    })
    container.appendChild(drawer)
  })

  afterEach(() => {
    drawer.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should construct with orientation property', () => {
      expect(drawer.orientation).toBe('horizontal')
    })

    it('should construct with direction property', () => {
      expect(drawer.direction).toBe('leading')
    })

    it('should construct with expanded false by default', () => {
      expect(drawer.expanded).toBe(false)
    })

    it('should construct with child property', () => {
      expect(drawer.child).toBe(panel)
    })

    it('should construct with vertical orientation', () => {
      const verticalDrawer = new IoDrawer({
        orientation: 'vertical',
        direction: 'trailing',
        expanded: true,
        child: panel,
        elements: [],
      })
      container.appendChild(verticalDrawer)

      expect(verticalDrawer.orientation).toBe('vertical')
      expect(verticalDrawer.direction).toBe('trailing')
      expect(verticalDrawer.expanded).toBe(true)

      verticalDrawer.remove()
    })
  })

  describe('Attribute Reflection', () => {
    it('should reflect orientation to attribute', () => {
      expect(drawer.getAttribute('orientation')).toBe('horizontal')

      drawer.orientation = 'vertical'
      expect(drawer.getAttribute('orientation')).toBe('vertical')
    })

    it('should reflect direction to attribute', () => {
      expect(drawer.getAttribute('direction')).toBe('leading')

      drawer.direction = 'trailing'
      expect(drawer.getAttribute('direction')).toBe('trailing')
    })

    it('should reflect expanded to attribute when true', () => {
      expect(drawer.hasAttribute('expanded')).toBe(false)

      drawer.expanded = true
      expect(drawer.hasAttribute('expanded')).toBe(true)

      drawer.expanded = false
      expect(drawer.hasAttribute('expanded')).toBe(false)
    })
  })

  describe('Rendering', () => {
    it('should render handle element', () => {
      const handle = drawer.querySelector('.io-drawer-handle')
      expect(handle).not.toBeNull()
    })

    it('should render content element', () => {
      const content = drawer.querySelector('.io-drawer-content')
      expect(content).not.toBeNull()
    })

    it('should render icon in handle', () => {
      const icon = drawer.querySelector('.io-drawer-handle io-icon')
      expect(icon).not.toBeNull()
    })

    it('should render child panel in content', () => {
      const panel = drawer.querySelector('.io-drawer-content io-panel')
      expect(panel).not.toBeNull()
    })

    it('should render child split when child is Split', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'a', label: 'A' }] },
          { type: 'panel', tabs: [{ id: 'b', label: 'B' }] },
        ]
      })
      drawer.child = split

      const splitElement = drawer.querySelector('.io-drawer-content io-split')
      expect(splitElement).not.toBeNull()
    })
  })

  describe('Trailing Direction', () => {
    let trailingDrawer: IoDrawer

    beforeEach(() => {
      trailingDrawer = new IoDrawer({
        orientation: 'horizontal',
        direction: 'trailing',
        expanded: false,
        child: panel,
        elements: [],
      })
      container.appendChild(trailingDrawer)
    })

    afterEach(() => {
      trailingDrawer.remove()
    })

    it('should have trailing direction', () => {
      expect(trailingDrawer.direction).toBe('trailing')
      expect(trailingDrawer.getAttribute('direction')).toBe('trailing')
    })

  })

  describe('Static Properties', () => {
    it('should have Style getter', () => {
      expect(IoDrawer.Style).toBeDefined()
      expect(typeof IoDrawer.Style).toBe('string')
      expect(IoDrawer.Style).toContain(':host')
    })
  })

  describe('Child Mutation', () => {
    it('should re-render on child mutation', () => {
      const renderSpy = vi.spyOn(drawer, 'render')
      drawer.childMutated()
      expect(renderSpy).toHaveBeenCalled()
    })
  })
})

describe('IoDrawer Factory Function', () => {
  it('should export ioDrawer factory function', () => {
    expect(typeof ioDrawer).toBe('function')
  })

  it('should create virtual constructor from factory', () => {
    const panel = new Panel({
      type: 'panel',
      tabs: [new Tab({ id: 'tab1', label: 'Tab 1' })]
    })
    const vdom = ioDrawer({
      orientation: 'horizontal',
      direction: 'leading',
      expanded: false,
      child: panel,
      elements: [],
    })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-drawer')
  })
})
