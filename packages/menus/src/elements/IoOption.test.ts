import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoOption, Option } from '@io-gui/menus'

describe('IoOption', () => {
  let model: Option
  let element: IoOption
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    model = new Option({
      id: 'item',
      label: 'Item Label',
      hint: 'hint text',
      options: [
        { id: 'sub', label: 'Sub Item' },
      ],
    })
    element = new IoOption({ model, depth: 1 })
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
    model.dispose()
  })

  it('renders label and hint from model', () => {
    expect(element.querySelector('.label')?.textContent).toBe('Item Label')
    expect(element.querySelector('.hint')?.textContent).toBe('hint text')
  })

  it('reflects expanded attribute', () => {
    expect(element.hasAttribute('expanded')).toBe(false)
    element.expanded = true
    expect(element.hasAttribute('expanded')).toBe(true)
  })

  it('reports hasmore when model has sub-options and depth > 0', () => {
    expect(element.hasmore).toBe(true)
    element.depth = 0
    expect(element.hasmore).toBe(false)
  })

  it('dispatches io-option-clicked on click for leaf option', () => {
    const leaf = new Option({ id: 'leaf', label: 'Leaf', mode: 'select' })
    const leafElement = new IoOption({ model: leaf, depth: 1 })
    container.appendChild(leafElement as HTMLElement)

    const handler = vi.fn()
    leafElement.addEventListener('io-option-clicked', handler)
    leafElement.onClick()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.option).toBe(leaf)

    leafElement.remove()
    leaf.dispose()
  })
})
