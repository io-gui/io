import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoMenu, Option } from '@io-gui/menus'

describe('IoMenu', () => {
  let model: Option
  let element: IoMenu
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    model = new Option({
      id: 'root',
      options: [
        { id: 'one', label: 'One' },
        { id: 'two', label: 'Two' },
      ],
    })
    element = new IoMenu({ model })
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

  it('renders option elements from model.options', () => {
    const options = element.querySelectorAll('io-option')
    expect(options.length).toBe(2)
    expect(options[0].textContent).toContain('One')
    expect(options[1].textContent).toContain('Two')
  })

  it('reflects horizontal layout', () => {
    element.horizontal = true
    expect(element.hasAttribute('horizontal')).toBe(true)
  })

  it('updates when model changes', () => {
    model.options.push(new Option({ id: 'three', label: 'Three' }))
    element.mutated()
    expect(element.querySelectorAll('io-option').length).toBe(3)
  })
})
