//@ts-nocheck
import { describe, it, expect } from 'vitest'

describe('demos', () => {
  it('IoThemeEditor constructs', async () => {
    const { IoThemeEditor } = await import('./IoThemeEditor.js')
    const el = new IoThemeEditor()
    expect(el).toBeDefined()
    el.dispose()
  })

  it('IoStyleContainer constructs', async () => {
    const { IoStyleContainer } = await import('./IoStyleContainer.js')
    const el = new IoStyleContainer()
    expect(el).toBeDefined()
    el.dispose()
  })

  it('IoElementInspectorDemo constructs', async () => {
    const { IoElementInspectorDemo } = await import('./IoElementInspectorDemo.js')
    expect(IoElementInspectorDemo).toBeDefined()
    expect(IoElementInspectorDemo.prototype).toBeDefined()
  })

  it('IoChangeVisualization constructs', async () => {
    const { IoChangeVisualization } = await import('./IoChangeVisualization.js')
    const el = new IoChangeVisualization()
    expect(el).toBeDefined()
    el.dispose()
  })
})
