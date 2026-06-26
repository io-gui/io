import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoMenuOptions, MenuOption } from '@io-gui/menus'

describe('IoMenuOptions', () => {
  let option: MenuOption
  let element: IoMenuOptions
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    option = new MenuOption({
      id: 'root',
      options: [
        { id: 'one', label: 'One' },
        { id: 'two', label: 'Two' },
      ],
    })
    element = new IoMenuOptions({ option })
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
    option.dispose()
  })

  it('has listbox role', () => {
    expect(element.getAttribute('role')).toBe('listbox')
  })

  it('renders menu items from option.options', () => {
    const items = element.querySelectorAll('io-menu-item')
    expect(items.length).toBe(2)
    expect(items[0].textContent).toContain('One')
    expect(items[1].textContent).toContain('Two')
  })

  it('reflects horizontal layout', () => {
    element.horizontal = true
    expect(element.hasAttribute('horizontal')).toBe(true)
  })

  it('updates when option changes', () => {
    option.options.push(new MenuOption({ id: 'three', label: 'Three' }))
    element.mutated()
    expect(element.querySelectorAll('io-menu-item').length).toBe(3)
  })
})
