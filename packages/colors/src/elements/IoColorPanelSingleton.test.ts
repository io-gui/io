import { describe, it, expect } from 'vitest'
import { nextQueue } from '@io-gui/core'
import { IoColorPanelSingleton } from '@io-gui/colors'

const element = IoColorPanelSingleton

describe('IoColorPanelSingleton.test', () => {
  it('Should initialize properties correctly', () => {
    expect(element.expanded).toBe(false)
  })
  it('has correct sliders', async () => {
    expect(element.children.length).toBe(3)
    expect(element.children[0].localName).toBe('io-color-slider')
    expect((element.children[0] as any).channel).toBe('sv')
    expect(element.children[1].localName).toBe('io-color-slider')
    expect((element.children[1] as any).channel).toBe('h')
    expect(element.children[2].localName).toBe('io-color-slider')
    expect((element.children[2] as any).channel).toBe('a')
    element.value = {r: 0.5, g: 0.5, b: 0.5}
    await nextQueue()
    expect(element.children[2]).toBe(undefined)
  })
})
