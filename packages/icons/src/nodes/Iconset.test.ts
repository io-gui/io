import { describe, it, expect, vi } from 'vitest'
import { IconsetSingleton } from '@io-gui/icons'

describe('Iconset.test', () => {
  it('Should have core API functions defined', () => {
    expect(typeof IconsetSingleton.registerIcons).toBe('function')
    expect(typeof IconsetSingleton.getIcon).toBe('function')
  })
  it('Should register and retrieve icons', () => {
    const testicons = '<svg><g id="dummy"><path></path></g></svg>'
    IconsetSingleton.registerIcons('test', testicons)
    expect(IconsetSingleton.getIcon('test:dummy')).toBe(
      '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g class="icon-id-dummy"><path></path></g></svg>'
    )
  })
  it('Should tell registered icons apart', () => {
    IconsetSingleton.registerIcons('test', '<svg><g id="known"><path></path></g></svg>')
    expect(IconsetSingleton.hasIcon('test:known')).toBe(true)
    expect(IconsetSingleton.hasIcon('test:unknown')).toBe(false)
    expect(IconsetSingleton.hasIcon('test:toString')).toBe(false)
    expect(IconsetSingleton.hasIcon('missing:known')).toBe(false)
    expect(IconsetSingleton.hasIcon('known')).toBe(false)
  })
  it('Should return an empty icon for an unknown reference', () => {
    expect(IconsetSingleton.getIcon('test:unknown')).toBe('<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"></svg>')
  })
  it('Should warn about an id defined twice in one registration', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    IconsetSingleton.registerIcons('test', '<svg><g id="twice"><path d="M1 1"></path></g><g id="twice"><path d="M2 2"></path></g></svg>')
    expect(warn).toHaveBeenCalledWith('Iconset: "test:twice" is defined twice; the last one wins')
    expect(IconsetSingleton.getIcon('test:twice')).toContain('M2 2')
    warn.mockRestore()
  })
  it('Should define each built-in icon once', () => {
    expect(IconsetSingleton.hasIcon('io:slider')).toBe(true)
    expect(IconsetSingleton.getIcon('io:sliders')).not.toContain('translate(0 14)')
  })
})
