import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoContextMenu, MenuOption } from '@io-gui/menus'

describe('IoContextMenu', () => {
  let parent: HTMLElement
  let option: MenuOption
  let menu: IoContextMenu

  beforeEach(() => {
    parent = document.createElement('div')
    parent.style.display = 'none'
    document.body.appendChild(parent)

    option = new MenuOption({ id: 'ctx', options: [{ id: 'a', label: 'Action' }] })
    menu = new IoContextMenu({ option, button: 0 })
    parent.appendChild(menu as HTMLElement)
  })

  afterEach(() => {
    menu.remove()
    parent.remove()
    option.dispose()
  })

  it('starts collapsed', () => {
    expect(menu.expanded).toBe(false)
  })

  it('creates IoMenuOptions child', () => {
    expect(menu.$options).toBeDefined()
    expect(menu.$options.option).toBe(option)
  })

  it('expands on matching pointerdown', () => {
    const event = new PointerEvent('pointerdown', {
      pointerId: 1,
      button: 0,
      pointerType: 'mouse',
      clientX: 10,
      clientY: 20,
      bubbles: true,
      cancelable: true,
    })
    menu.onPointerdown(event)
    expect(menu.expanded).toBe(true)
  })

  it('prevents default contextmenu when button is 2', () => {
    const menu2 = new IoContextMenu({ option, button: 2 })
    parent.appendChild(menu2 as HTMLElement)

    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    menu2.onContextmenu(event)
    expect(preventSpy).toHaveBeenCalled()

    menu2.remove()
  })

  it('releases pointer listeners on disconnect', () => {
    const parentSpy = vi.spyOn(parent, 'removeEventListener')
    menu.remove()
    expect(parentSpy).toHaveBeenCalledWith('pointerdown', menu.onPointerdown)
  })
})
