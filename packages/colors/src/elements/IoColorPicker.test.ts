import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { IoColorPicker } from './IoColorPicker.js'
import { IoColorPanelSingleton as Panel } from './IoColorPanelSingleton.js'

describe('IoColorPicker.test', () => {
  afterEach(() => {
    Panel.src = null
    Panel.expanded = false
  })

  it('Should be defined', () => {
    expect(IoColorPicker).toBeDefined()
  })

  it('disconnect without expand does not warn about missing panel listeners', () => {
    const picker = new IoColorPicker()
    document.body.appendChild(picker as HTMLElement)
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    document.body.removeChild(picker as HTMLElement)

    expect(Panel.src).toBe(null)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('disconnect after expand collapses the panel', async () => {
    const picker = new IoColorPicker()
    picker.value = {r: 0.5, g: 0.5, b: 0.5, a: 1}
    document.body.appendChild(picker as HTMLElement)
    await nextFrame()
    picker.expand()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    document.body.removeChild(picker as HTMLElement)

    expect(Panel.expanded).toBe(false)
    expect(Panel.src).toBe(null)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('disconnect after collapse does not warn about missing panel listeners', async () => {
    const picker = new IoColorPicker()
    picker.value = {r: 0.5, g: 0.5, b: 0.5, a: 1}
    document.body.appendChild(picker as HTMLElement)
    await nextFrame()
    picker.expand()
    picker.collapse()
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    document.body.removeChild(picker as HTMLElement)

    expect(Panel.src).toBe(null)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('expanding another picker transfers panel ownership', async () => {
    const pickerA = new IoColorPicker()
    const pickerB = new IoColorPicker()
    pickerA.value = {r: 1, g: 0, b: 0, a: 1}
    pickerB.value = {r: 0, g: 1, b: 0, a: 1}
    document.body.appendChild(pickerA as HTMLElement)
    document.body.appendChild(pickerB as HTMLElement)
    await nextFrame()
    pickerA.expand()

    expect(pickerA.expanded).toBe(true)
    expect(pickerB.expanded).toBe(false)

    pickerB.expand()

    expect(Panel.src).toBe(pickerB)
    expect(pickerA.expanded).toBe(false)
    expect(pickerB.expanded).toBe(true)

    document.body.removeChild(pickerA as HTMLElement)
    document.body.removeChild(pickerB as HTMLElement)
  })
})
