import { describe, it, expect, beforeEach } from 'vitest'
import {
  Theme,
  ThemeSingleton,
  $Theme,
  $ThemeID,
  THEMES,
  Color,
  StorageNode,
  Storage,
  nextQueue,
} from '@io-gui/core'

const LIGHT = THEMES.light
const DARK = THEMES.dark

function themeWith(json: typeof LIGHT) {
  return new Theme().applyJSON(json)
}

function getDocumentCssVar(name: string): string {
  for (const sheet of document.adoptedStyleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule instanceof CSSStyleRule) {
        const value = rule.style.getPropertyValue(name)
        if (value) return value.trim()
      }
    }
  }
  return ''
}

describe('Theme', () => {
  describe('property definitions', () => {
    it('registers color properties as Color type', () => {
      expect(ThemeSingleton._reactiveProperties.get('borderColor')!.type).toBe(Color)
    })

    it('registers numeric properties as Number type', () => {
      expect(ThemeSingleton._reactiveProperties.get('spacing')!.type).toBe(Number)
    })
  })

  describe('live instances', () => {
    it('keeps Color instances on color properties', () => {
      expect(ThemeSingleton.borderColor).toBeInstanceOf(Color)
      expect(ThemeSingleton.bgColor.toCss()).toMatch(/^rgba\(/)
    })

    it('wires ThemeSingleton through $Theme binding', () => {
      expect($Theme.value).toBe(ThemeSingleton)
      expect(ThemeSingleton).toBeInstanceOf(Theme)
      expect($ThemeID.value).toBeDefined()
      expect(THEMES[$ThemeID.value as keyof typeof THEMES]).toBeDefined()
    })
  })

  describe('serialization', () => {
    it('toJSON serializes colors as hex numbers', () => {
      const theme = themeWith(LIGHT)
      const json = theme.toJSON()
      expect(json.borderColor).toBe(LIGHT.borderColor)
      expect(json.shadowColor).toBe(LIGHT.shadowColor)
      expect(typeof json.spacing).toBe('number')
      theme.dispose()
    })
  })

  describe('applyJSON', () => {
    it('applies a different preset', () => {
      const theme = themeWith(LIGHT)
      theme.applyJSON(DARK)
      expect(theme.bgColor.toHex()).toBe(DARK.bgColor)
      expect(theme.borderColor.toHex()).toBe(DARK.borderColor)
      theme.dispose()
    })

    it('applies serialized JSON', () => {
      const theme = themeWith(LIGHT)
      theme.applyJSON({ ...LIGHT, spacing: 8 })
      expect(theme.spacing).toBe(8)
      theme.dispose()
    })

    it('restores shadow alpha', () => {
      const theme = themeWith(LIGHT)
      const shadowHex = Color.toHex(0, 0, 0, 0.5)
      theme.applyJSON({ ...LIGHT, shadowColor: shadowHex })
      expect(theme.shadowColor.a).toBeCloseTo(0.5)
      expect(theme.shadowColor.toHex()).toBe(shadowHex)
      theme.dispose()
    })
  })

  describe('changed()', () => {
    it('derives spacing multiples and fieldHeight', () => {
      const theme = themeWith({ ...LIGHT, spacing: 4, lineHeight: 20, borderWidth: 1 })
      theme.changed()
      expect(theme.spacing2).toBe(8)
      expect(theme.spacing3).toBe(12)
      expect(theme.spacing5).toBe(20)
      expect(theme.spacing8).toBe(32)
      expect(theme.fieldHeight).toBe(20 + 2 * (4 + 1))
      theme.dispose()
    })

    it('syncs fontSize and lineHeight', () => {
      const theme = themeWith(LIGHT)
      theme.fontSize = 30
      theme.fontSizeChanged()
      expect(theme.lineHeight).toBe(30)
      theme.lineHeight = 10
      theme.lineHeightChanged()
      expect(theme.fontSize).toBe(10)
      theme.dispose()
    })

    it('writes CSS custom properties to the document stylesheet', () => {
      const theme = themeWith(LIGHT)
      theme.changed()
      expect(getDocumentCssVar('--io_borderColor')).toBe(theme.borderColor.toCss())
      expect(getDocumentCssVar('--io_spacing')).toBe(`${theme.spacing}px`)
      expect(getDocumentCssVar('--io_shadowColor')).toBe(theme.shadowColor.toCss())
      theme.dispose()
    })

    it('writes composite CSS variables', () => {
      expect(getDocumentCssVar('--io_border')).toContain('var(--io_borderWidth)')
      expect(getDocumentCssVar('--io_shadow')).toContain('var(--io_shadowColor)')
    })
  })

  describe('storage hydration', () => {
    const key = 'test-theme-hydrate'

    beforeEach(() => {
      Storage.permit()
      localStorage.removeItem('Storage:' + key)
    })

    it('hydrates Theme node from localStorage JSON', () => {
      const serialized = { ...LIGHT, spacing: 7 }
      localStorage.setItem('Storage:' + key, JSON.stringify(serialized))
      const theme = themeWith(LIGHT)
      const node = new StorageNode({ key, value: theme, storage: 'local' })
      expect(node.value.spacing).toBe(7)
      expect(node.value.borderColor).toBeInstanceOf(Color)
      expect(node.value.shadowColor.a).toBeCloseTo(0.2)
      node.dispose()
    })

    it('persists Theme via toJSON when mutation is dispatched', async () => {
      const theme = themeWith(LIGHT)
      const node = new StorageNode({ key, value: theme, storage: 'local' })
      theme.spacing = 9
      theme.dispatchMutation()
      await nextQueue()
      const stored = JSON.parse(localStorage.getItem('Storage:' + key)!)
      expect(stored.spacing).toBe(9)
      expect(stored.shadowColor).toBe(LIGHT.shadowColor)
      node.dispose()
    })
  })
})
