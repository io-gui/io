//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextQueue } from '@io-gui/core'
import { MenuOption } from '@io-gui/menus'
import { IoNavigator, ioNavigator, IoSelector } from '@io-gui/navigation'

describe('IoNavigator', () => {
  let container: HTMLElement
  let navigator: IoNavigator
  let option: MenuOption

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    option = new MenuOption({
      id: 'root',
      options: [
        { id: 'page1', label: 'Page 1' },
        { id: 'page2', label: 'Page 2' },
        { id: 'page3', label: 'Page 3', options: [
          { id: 'page3-1', label: 'Page 3.1' },
          { id: 'page3-2', label: 'Page 3.2' },
        ]},
      ]
    })
  })

  afterEach(() => {
    if (navigator) navigator.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should be defined', () => {
      expect(IoNavigator).toBeDefined()
    })

    it('should have default property values', async () => {
      navigator = new IoNavigator({ option })
      container.appendChild(navigator)

      await nextQueue()

      expect(navigator.elements).toEqual([])
      expect(navigator.widget).toBeNull()
      expect(navigator.menu).toBe('left')
      expect(navigator.depth).toBe(Infinity)
      expect(navigator.select).toBe('shallow')
      expect(navigator.caching).toBe('none')
      expect(navigator.anchor).toBe('')
    })

    it('should accept constructor arguments', () => {
      const elements = [{ tag: 'div', props: { id: 'page1' } }]
      navigator = new IoNavigator({
        option,
        elements,
        menu: 'top',
        depth: 2,
        select: 'deep',
        caching: 'reactive'
      })
      container.appendChild(navigator)

      expect(navigator.menu).toBe('top')
      expect(navigator.depth).toBe(2)
      expect(navigator.select).toBe('deep')
      expect(navigator.caching).toBe('reactive')
      expect(navigator.elements).toBe(elements)
    })

    it('should have Style getter', () => {
      expect(IoNavigator.Style).toBeDefined()
      expect(typeof IoNavigator.Style).toBe('string')
      expect(IoNavigator.Style).toContain(':host')
    })
  })

  describe('Menu positions', () => {
    it('should render io-menu-options for top menu', async () => {
      navigator = new IoNavigator({ option, elements: [], menu: 'top' })
      container.appendChild(navigator)

      await nextQueue()

      expect(navigator.querySelector('io-menu-options')).toBeTruthy()
      expect(navigator.querySelector('io-menu-tree')).toBeNull()
      expect(navigator.querySelector('io-selector')).toBeTruthy()
    })

    it('should render io-menu-tree for left menu', async () => {
      navigator = new IoNavigator({ option, elements: [], menu: 'left' })
      container.appendChild(navigator)

      await nextQueue()

      expect(navigator.querySelector('io-menu-tree')).toBeTruthy()
      expect(navigator.querySelector('io-menu-options')).toBeNull()
      expect(navigator.querySelector('io-selector')).toBeTruthy()
    })

    it('should reflect menu attribute', () => {
      navigator = new IoNavigator({ option, elements: [], menu: 'left' })
      container.appendChild(navigator)

      expect(navigator.getAttribute('menu')).toBe('left')

      navigator.menu = 'top'
      expect(navigator.getAttribute('menu')).toBe('top')
    })

    it('should place selector before menu-tree for left position', async () => {
      navigator = new IoNavigator({ option, elements: [], menu: 'left' })
      container.appendChild(navigator)

      await nextQueue()

      const children = Array.from(navigator.children)
      expect(children[0].tagName.toLowerCase()).toBe('io-selector')
      expect(children[1].tagName.toLowerCase()).toBe('io-menu-tree')
    })
  })

  describe('Select modes', () => {
    it('should use selectedIDImmediate for shallow select', async () => {
      option.selectDefault()
      navigator = new IoNavigator({ option, elements: [], select: 'shallow' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.selected).toBe(option.selectedIDImmediate)
    })

    it('should use selectedID for deep select', async () => {
      option.selectDefault()
      navigator = new IoNavigator({ option, elements: [], select: 'deep' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.selected).toBe(option.selectedID)
    })

    it('should use "*" for all select', async () => {
      navigator = new IoNavigator({ option, elements: [], select: 'all' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.selected).toBe('*')
    })

    it('should use empty string for none select', async () => {
      navigator = new IoNavigator({ option, elements: [], select: 'none' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.selected).toBe('')
    })
  })

  describe('Elements and caching', () => {
    it('should pass elements to io-selector', async () => {
      const elements = [
        { tag: 'div', props: { id: 'page1' } },
        { tag: 'span', props: { id: 'page2' } }
      ]
      navigator = new IoNavigator({ option, elements })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.elements).toBe(elements)
    })

    it('should pass caching mode to io-selector', async () => {
      navigator = new IoNavigator({ option, elements: [], caching: 'proactive' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.caching).toBe('proactive')
    })
  })

  describe('Anchor binding', () => {
    it('should bind anchor to io-selector', async () => {
      navigator = new IoNavigator({ option, elements: [], anchor: 'section1' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      expect(selector.anchor).toBe('section1')

      navigator.anchor = 'section2'
      await nextQueue()

      expect(selector.anchor).toBe('section2')
    })
  })

  describe('Depth property', () => {
    it('should pass depth to menu components', async () => {
      navigator = new IoNavigator({ option, elements: [], menu: 'left', depth: 2 })
      container.appendChild(navigator)

      await nextQueue()

      const menuTree = navigator.querySelector('io-menu-tree')
      expect(menuTree?.depth).toBe(2)
    })
  })

  describe('Option mutation', () => {
    it('should re-render when option is mutated', async () => {
      option.selectDefault()
      navigator = new IoNavigator({ option, elements: [], select: 'shallow' })
      container.appendChild(navigator)

      await nextQueue()

      const selector = navigator.querySelector('io-selector') as IoSelector
      const initialSelected = selector.selected

      option.options[1].selected = true
      navigator.optionMutated()
      await nextQueue()

      expect(selector.selected).not.toBe(initialSelected)
    })
  })

  describe('Factory function', () => {
    it('should export ioNavigator factory function', () => {
      expect(typeof ioNavigator).toBe('function')
    })

    it('should create virtual constructor from factory', () => {
      const vdom = ioNavigator({ option, menu: 'top' })

      expect(vdom).toBeDefined()
      expect(vdom.tag).toBe('io-navigator')
      expect(vdom.props?.menu).toBe('top')
    })
  })
})
