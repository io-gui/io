import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoMenuTree, MenuOption } from '@io-gui/menus'

describe('IoMenuTree', () => {
  let option: MenuOption
  let element: IoMenuTree
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    option = new MenuOption({
      id: 'root',
      options: [
        { id: 'leaf', label: 'Leaf' },
        {
          id: 'branch',
          label: 'Branch',
          options: [{ id: 'nested', label: 'Nested' }],
        },
      ],
    })
    element = new IoMenuTree({ option, depth: 1 })
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

  it('renders leaf items and tree branches', () => {
    expect(element.querySelector('io-menu-item')).toBeTruthy()
    expect(element.querySelector('io-menu-tree-branch')).toBeTruthy()
  })

  it('filters items when search is set', () => {
    element.searchable = true
    element.search = 'Nested'
    element.changed()
    const items = element.querySelectorAll('io-menu-item')
    expect(items.length).toBe(1)
    expect(items[0].textContent).toContain('Nested')
  })

  it('shows no matches field for empty search results', () => {
    element.searchable = true
    element.search = 'zzzzz'
    element.changed()
    const field = element.querySelector('io-field')
    expect(field).toBeTruthy()
    expect(field!.getAttribute('aria-label')).toBe('No matches')
  })
})
