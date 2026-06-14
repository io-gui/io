import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoMenuItem, MenuOption } from '@io-gui/menus'

describe('IoMenuItem', () => {
  let option: MenuOption
  let element: IoMenuItem
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    option = new MenuOption({
      id: 'item',
      label: 'Item Label',
      hint: 'hint text',
      options: [
        { id: 'sub', label: 'Sub Item' },
      ],
    })
    element = new IoMenuItem({ option, depth: 1 })
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
    option.dispose()
  })

  it('renders label and hint from option', () => {
    expect(element.querySelector('.label')?.textContent).toBe('Item Label')
    expect(element.querySelector('.hint')?.textContent).toBe('hint text')
  })

  it('reflects expanded attribute', () => {
    expect(element.hasAttribute('expanded')).toBe(false)
    element.expanded = true
    expect(element.hasAttribute('expanded')).toBe(true)
  })

  it('reports hasmore when option has sub-options and depth > 0', () => {
    expect(element.hasmore).toBe(true)
    element.depth = 0
    expect(element.hasmore).toBe(false)
  })

  it('dispatches io-menu-option-clicked on click for leaf option', () => {
    const leaf = new MenuOption({ id: 'leaf', label: 'Leaf', mode: 'select' })
    const leafItem = new IoMenuItem({ option: leaf, depth: 1 })
    container.appendChild(leafItem as HTMLElement)

    const handler = vi.fn()
    leafItem.addEventListener('io-menu-option-clicked', handler)
    leafItem.onClick()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler.mock.calls[0][0].detail.option).toBe(leaf)

    leafItem.remove()
    leaf.dispose()
  })
})
