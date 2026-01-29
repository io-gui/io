//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Register, IoElement, ReactiveProperty, nextQueue } from '@io-gui/core'
import { IoSelector, ioSelector } from '@io-gui/navigation'

@Register
class TestContent extends IoElement {
  @ReactiveProperty('default')
  declare content: string

  changed() {
    this.textContent = this.content
  }
}

describe('IoSelector', () => {
  let container: HTMLElement
  let selector: IoSelector

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (selector) selector.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should be defined', () => {
      expect(IoSelector).toBeDefined()
    })

    it('should have default property values', () => {
      selector = new IoSelector()
      container.appendChild(selector)

      expect(selector.elements).toEqual([])
      expect(selector.selected).toBe('')
      expect(selector.anchor).toBe('')
      expect(selector.caching).toBe('reactive')
      expect(selector.loading).toBe(false)
    })

    it('should accept constructor arguments', () => {
      selector = new IoSelector({
        selected: 'test',
        caching: 'proactive',
        elements: [{ tag: 'div', props: { id: 'test' } }]
      })
      container.appendChild(selector)

      expect(selector.selected).toBe('test')
      expect(selector.caching).toBe('proactive')
      expect(selector.elements.length).toBe(1)
    })

    it('should have Style getter', () => {
      expect(IoSelector.Style).toBeDefined()
      expect(typeof IoSelector.Style).toBe('string')
      expect(IoSelector.Style).toContain(':host')
    })

    it('should have scroll listener', () => {
      expect(IoSelector.Listeners).toBeDefined()
      expect(IoSelector.Listeners.scroll).toBe('onScrollChanged')
    })
  })

  describe('Basic selection', () => {
    it('should render selected element', async () => {
      selector = new IoSelector({
        selected: 'first',
        elements: [
          { tag: 'span', props: { id: 'first' } },
          { tag: 'div', props: { id: 'second' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      expect(selector.querySelector('span')).toBeTruthy()
      expect(selector.querySelector('div')).toBeNull()
    })

    it('should switch to different element when selected changes', async () => {
      selector = new IoSelector({
        selected: 'first',
        elements: [
          { tag: 'span', props: { id: 'first' } },
          { tag: 'div', props: { id: 'second' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()
      expect(selector.querySelector('span')).toBeTruthy()

      selector.selected = 'second'
      await nextQueue()

      expect(selector.querySelector('div')).toBeTruthy()
      expect(selector.querySelector('span')).toBeNull()
    })

    it('should render all elements when selected is "*"', async () => {
      selector = new IoSelector({
        selected: '*',
        elements: [
          { tag: 'span', props: { id: 'first' } },
          { tag: 'div', props: { id: 'second' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      expect(selector.querySelector('span')).toBeTruthy()
      expect(selector.querySelector('div')).toBeTruthy()
    })

    it('should render empty when selected is empty string', async () => {
      selector = new IoSelector({
        selected: '',
        elements: [
          { tag: 'span', props: { id: 'first' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      expect(selector.childNodes.length).toBe(0)
    })

    it('should strip hash from selected id', async () => {
      selector = new IoSelector({
        selected: 'first#anchor',
        elements: [
          { tag: 'span', props: { id: 'first' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      expect(selector.querySelector('span')).toBeTruthy()
    })

    it('should warn when selected element not found', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      selector = new IoSelector({
        selected: 'nonexistent',
        elements: [
          { tag: 'span', props: { id: 'first' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      expect(warnSpy).toHaveBeenCalledWith('IoSelector: Could not find elements with id: "nonexistent"!')
      expect(selector.querySelector('span')).toBeTruthy()
      expect(selector.textContent).toContain('Could not find elements with id')

      warnSpy.mockRestore()
    })
  })

  describe('Re-rendering on deep element changes', () => {
    it('should re-render selected element when elements array is updated with same id but different props', async () => {
      selector = new IoSelector({
        caching: 'none',
        selected: 'test-id',
        elements: [
          { tag: 'test-content', props: { id: 'test-id', content: 'initial content' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      const initialChild = selector.querySelector('test-content') as TestContent
      expect(initialChild).toBeTruthy()
      expect(initialChild.content).toBe('initial content')
      expect(initialChild.textContent).toBe('initial content')

      selector.elements = [
        { tag: 'test-content', props: { id: 'test-id', content: 'updated content' } }
      ]

      await nextQueue()

      const updatedChild = selector.querySelector('test-content') as TestContent
      expect(updatedChild).toBeTruthy()
      expect(updatedChild.content).toBe('updated content')
      expect(updatedChild.textContent).toBe('updated content')
    })

    it('should re-render when element tag changes for same id', async () => {
      selector = new IoSelector({
        caching: 'none',
        selected: 'test-id',
        elements: [
          { tag: 'span', props: { id: 'test-id' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()
      expect(selector.querySelector('span')).toBeTruthy()

      selector.elements = [
        { tag: 'div', props: { id: 'test-id' } }
      ]

      await nextQueue()

      expect(selector.querySelector('div')).toBeTruthy()
      expect(selector.querySelector('span')).toBeNull()
    })
  })

  describe('Caching modes', () => {
    it('should not cache elements when caching is "none"', async () => {
      selector = new IoSelector({
        caching: 'none',
        selected: 'first',
        elements: [
          { tag: 'test-content', props: { id: 'first', content: 'first' } },
          { tag: 'test-content', props: { id: 'second', content: 'second' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()
      const firstChild = selector.querySelector('test-content') as TestContent

      selector.selected = 'second'
      await nextQueue()

      selector.selected = 'first'
      await nextQueue()

      const newFirstChild = selector.querySelector('test-content') as TestContent
      expect(newFirstChild).not.toBe(firstChild)
    })

    it('should cache elements when caching is "reactive"', async () => {
      selector = new IoSelector({
        caching: 'reactive',
        selected: 'first',
        elements: [
          { tag: 'test-content', props: { id: 'first', content: 'first' } },
          { tag: 'test-content', props: { id: 'second', content: 'second' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()
      const firstChild = selector.querySelector('test-content') as TestContent

      selector.selected = 'second'
      await nextQueue()

      selector.selected = 'first'
      await nextQueue()

      const cachedFirstChild = selector.querySelector('test-content') as TestContent
      expect(cachedFirstChild).toBe(firstChild)
    })

    it('should reuse cached element (cache preserves original props)', async () => {
      selector = new IoSelector({
        caching: 'reactive',
        selected: 'test-id',
        elements: [
          { tag: 'test-content', props: { id: 'test-id', content: 'cached initial' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      const cachedChild = selector.querySelector('test-content') as TestContent
      expect(cachedChild.content).toBe('cached initial')

      selector.elements = [
        { tag: 'test-content', props: { id: 'test-id', content: 'cached updated' } }
      ]

      await nextQueue()

      const reusedChild = selector.querySelector('test-content') as TestContent
      expect(reusedChild).toBe(cachedChild)
      expect(reusedChild.content).toBe('cached initial')
    })
  })

  describe('Loading state', () => {
    it('should reflect loading attribute', () => {
      selector = new IoSelector({ loading: true })
      container.appendChild(selector)

      expect(selector.getAttribute('loading')).toBe('')
      
      selector.loading = false
      expect(selector.getAttribute('loading')).toBeNull()
    })
  })

  describe('Anchor handling', () => {
    it('should extract anchor from hash format', async () => {
      selector = new IoSelector({
        selected: 'page',
        anchor: 'page#section',
        elements: [{ tag: 'div', props: { id: 'page' } }]
      })
      container.appendChild(selector)

      await nextQueue()

      expect(selector.anchor).toBe('page#section')
    })
  })

  describe('Disposal', () => {
    it('should clean up caches on dispose', async () => {
      selector = new IoSelector({
        caching: 'reactive',
        selected: 'first',
        elements: [
          { tag: 'test-content', props: { id: 'first', content: 'first' } },
          { tag: 'test-content', props: { id: 'second', content: 'second' } }
        ]
      })
      container.appendChild(selector)

      await nextQueue()

      selector.selected = 'second'
      await nextQueue()

      expect(selector._caches['first']).toBeDefined()
      expect(selector._caches['second']).toBeDefined()

      selector.dispose()

      // After dispose, caches should be empty or undefined
      const cacheKeys = selector._caches ? Object.keys(selector._caches) : []
      expect(cacheKeys.length).toBe(0)
    })
  })

  describe('Factory function', () => {
    it('should export ioSelector factory function', () => {
      expect(typeof ioSelector).toBe('function')
    })

    it('should create virtual constructor from factory', () => {
      const vdom = ioSelector({ selected: 'test', elements: [] })

      expect(vdom).toBeDefined()
      expect(vdom.tag).toBe('io-selector')
      expect(vdom.props?.selected).toBe('test')
    })
  })
})
