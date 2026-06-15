import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoNavigatorDrawer } from '@io-gui/navigation'
import { span } from '@io-gui/core'

describe('IoNavigatorDrawer', () => {
  let element: IoNavigatorDrawer
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    element = new IoNavigatorDrawer({
      direction: 'left',
      menuContent: span('Menu'),
    })
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
  })

  it('reflects direction attribute', () => {
    expect(element.getAttribute('direction')).toBe('left')
    element.direction = 'right'
    expect(element.getAttribute('direction')).toBe('right')
  })

  it('starts collapsed by default', () => {
    expect(element.expanded).toBe(false)
    expect(element.hasAttribute('expanded')).toBe(false)
  })

  it('reflects expanded state', () => {
    element.expanded = true
    expect(element.hasAttribute('expanded')).toBe(true)
  })

  it('renders menu content', () => {
    expect(element.textContent).toContain('Menu')
  })

  it('toggles expanded on handle click', () => {
    const handle = element.querySelector('.io-drawer-handle') as HTMLElement
    expect(handle).toBeTruthy()
    handle.click()
    expect(element.expanded).toBe(true)
    handle.click()
    expect(element.expanded).toBe(false)
  })
})
