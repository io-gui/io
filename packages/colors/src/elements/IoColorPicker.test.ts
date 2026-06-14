import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextQueue } from '@io-gui/core'
import { IoColorPicker, IoColorPanelSingleton as Panel } from '@io-gui/colors'

describe('IoColorPicker.test', () => {
  afterEach(() => {
    Panel.expanded = false
    Panel.value = {r: 1, g: 1, b: 1, a: 1}
  })

  it('Should be defined', () => {
    expect(IoColorPicker).toBeDefined()
  })

  it('disconnect without expand does not warn about missing panel listeners', () => {
    const picker = new IoColorPicker()
    document.body.appendChild(picker as HTMLElement)
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    document.body.removeChild(picker as HTMLElement)

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('disconnect after expand removes panel listeners once', async () => {
    const picker = new IoColorPicker()
    picker.value = {r: 0.5, g: 0.5, b: 0.5, a: 1}
    document.body.appendChild(picker as HTMLElement)
    await nextQueue()
    picker.expand()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    document.body.removeChild(picker as HTMLElement)

    expect(Panel.expanded).toBe(false)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('disconnect after collapse does not warn about missing panel listeners', async () => {
    const picker = new IoColorPicker()
    picker.value = {r: 0.5, g: 0.5, b: 0.5, a: 1}
    document.body.appendChild(picker as HTMLElement)
    await nextQueue()
    picker.expand()
    picker.collapse()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    document.body.removeChild(picker as HTMLElement)

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
