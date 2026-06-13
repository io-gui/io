import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { processElementStyle, applyElementStyleToDocument } from './Style.js'

function normalizeStyle(css: string): string {
  return css.replace(/\s+/g, ' ').trim()
}

describe('Style mixin polyfill', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  it('registers mixins as class rules and inlines @apply in the same stylesheet', () => {
    const css = processElementStyle('io-test-a', /* css */`
      --io-flex: {
        display: flex;
        gap: 8px;
      }
      :host {
        @apply --io-flex;
        color: blue;
      }
    `)

    expect(normalizeStyle(css)).toContain('.io-flex { display: flex; gap: 8px; }')
    expect(normalizeStyle(css)).toContain('io-test-a { display: flex; gap: 8px; color: blue; }')
    expect(css).not.toContain('@apply')
    expect(css).not.toContain('--io-flex: {')
  })

  it('replaces every :host selector with the element local name', () => {
    const css = processElementStyle('io-test-b', /* css */`
      :host {
        display: block;
      }
      :host[hidden] {
        display: none;
      }
    `)

    expect(css).not.toContain(':host')
    expect(normalizeStyle(css)).toContain('io-test-b { display: block; }')
    expect(normalizeStyle(css)).toContain('io-test-b[hidden] { display: none; }')
  })

  it('shares mixins across subsequent style processing calls', () => {
    processElementStyle('io-test-provider', /* css */`
      --io-shared: {
        user-select: none;
        cursor: default;
      }
      :host {}
    `)

    const css = processElementStyle('io-test-consumer', /* css */`
      :host {
        @apply --io-shared;
      }
    `)

    expect(normalizeStyle(css)).toContain('io-test-consumer { user-select: none; cursor: default; }')
  })

  it('supports multiple mixin definitions and multiple @apply usages', () => {
    const css = processElementStyle('io-test-multi', /* css */`
      --io-base: {
        box-sizing: border-box;
      }
      --io-padded: {
        padding: 4px;
      }
      :host {
        @apply --io-base;
      }
      :host(.dense) {
        @apply --io-padded;
      }
    `)

    expect(normalizeStyle(css)).toContain('.io-base { box-sizing: border-box; }')
    expect(normalizeStyle(css)).toContain('.io-padded { padding: 4px; }')
    expect(normalizeStyle(css)).toContain('io-test-multi { box-sizing: border-box; }')
    expect(normalizeStyle(css)).toContain('io-test-multi(.dense) { padding: 4px; }')
  })

  it('preserves multi-line mixin bodies when inlining', () => {
    const css = processElementStyle('io-test-multiline', /* css */`
      --io-unselectable: {
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
      }
      :host {
        @apply --io-unselectable;
      }
    `)

    expect(normalizeStyle(css)).toContain('user-select: none')
    expect(normalizeStyle(css)).toContain('-webkit-user-select: none')
    expect(normalizeStyle(css)).toContain('-webkit-touch-callout: none')
  })

  it('warns when @apply references an unknown mixin', () => {
    const css = processElementStyle('io-test-missing', /* css */`
      :host {
        @apply --io-does-not-exist;
      }
    `)

    expect(warnSpy).toHaveBeenCalledWith('IoElement: cound not find mixin:', '--io-does-not-exist')
    expect(normalizeStyle(css)).toBe('io-test-missing { @apply --io-does-not-exist; }')
  })

  it('matches IoElement mixin declaration format', () => {
    const css = processElementStyle('io-element', /* css */`
      :host {
        display: block;
      }
      --io-unselectable: {
        user-select: none;
        -webkit-user-select: none;
      }
      :host {
        @apply --io-unselectable;
      }
    `)

    expect(normalizeStyle(css)).toContain('.io-unselectable { user-select: none; -webkit-user-select: none; }')
    expect(normalizeStyle(css)).toContain('io-element { display: block; }')
    expect(normalizeStyle(css)).toContain('io-element { user-select: none; -webkit-user-select: none; }')
  })

  it('adopts processed styles that affect element computed styles', () => {
    const tag = 'io-style-mixin-test'
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {})
    }

    const index = document.adoptedStyleSheets.length
    applyElementStyleToDocument(tag, /* css */`
      --io-centered: {
        display: grid;
        place-items: center;
      }
      :host {
        @apply --io-centered;
        width: 40px;
        height: 40px;
      }
    `)

    const sheet = document.adoptedStyleSheets[index]
    expect(sheet).toBeDefined()
    expect(sheet.cssRules.length).toBeGreaterThan(0)

    const element = document.createElement(tag)
    document.body.appendChild(element)

    expect(getComputedStyle(element).display).toBe('grid')
    expect(getComputedStyle(element).width).toBe('40px')

    element.remove()
  })
})
