import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoMenuTree, Menu } from '@io-gui/menus'

describe('IoMenuTree', () => {
  let model: Menu
  let element: IoMenuTree
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    model = new Menu({
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
    element = new IoMenuTree({ model, depth: 1 })
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
    model.dispose()
  })

  it('has listbox role', () => {
    expect(element.getAttribute('role')).toBe('listbox')
  })

  it('renders leaf options and tree branches', () => {
    expect(element.querySelector('io-option')).toBeTruthy()
    expect(element.querySelector('io-menu-tree-branch')).toBeTruthy()
  })

  it('filters options when search is set', () => {
    element.searchable = true
    element.search = 'Nested'
    element.mutated()
    const options = element.querySelectorAll('io-option')
    expect(options.length).toBe(1)
    expect(options[0].textContent).toContain('Nested')
  })

  it('shows no matches field for empty search results', () => {
    element.searchable = true
    element.search = 'zzzzz'
    element.mutated()
    const field = element.querySelector('io-field')
    expect(field).toBeTruthy()
    expect(field!.getAttribute('aria-label')).toBe('No matches')
  })

  it('persists branch disclosure to the Menu expandedIDs', () => {
    const branch = element.querySelector('io-menu-tree-branch') as any
    expect(branch).toBeTruthy()
    branch.expanded = true
    expect(model.isDisclosed('branch')).toBe(true)
    expect(model.expandedIDs).toContain('branch')
    branch.expanded = false
    expect(model.isDisclosed('branch')).toBe(false)
  })
})
