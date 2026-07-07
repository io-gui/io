import { describe, it, expect, afterEach } from 'vitest'
import { IoOverlaySingleton as Overlay } from '@io-gui/core'
import { IoLayout, IoPanel, Layout, Split } from '@io-gui/layout'

describe('IoLayout', () => {

  describe('dispose', () => {

    let layout: IoLayout

    afterEach(() => {
      layout?.remove()
    })

    it('should remove tab drag ghost from overlay on dispose', () => {
      layout = new IoLayout({
        model: new Layout({
          child: { type: 'panel', tabs: [{ id: 'tab1' }] },
        }),
        elements: [],
      })

      const ghost = layout.$tabDragGhost as HTMLElement
      expect(Overlay.contains(ghost)).toBe(true)

      layout.dispose()

      expect(Overlay.contains(ghost)).toBe(false)
    })

  })

  describe('getDropTarget', () => {

    let layout: IoLayout
    let container: HTMLElement

    afterEach(() => {
      layout?.remove()
      container?.remove()
    })

    it('should not throw when panel has zero tabs', () => {
      container = document.createElement('div')
      container.style.cssText = 'position: fixed; top: 0; left: 0; width: 800px; height: 600px;'
      document.body.appendChild(container)

      const layoutModel = new Layout({
        child: {
          type: 'split',
          children: [
            { type: 'panel', tabs: [{ id: 'tab1', selected: true }] },
            { type: 'panel', tabs: [] },
          ],
        },
      })
      layout = new IoLayout({ model: layoutModel, elements: [] })
      container.appendChild(layout)

      const emptyPanel = layout.querySelectorAll('io-panel')[1] as IoPanel
      const rect = emptyPanel.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      const rootSplit = layoutModel.child as Split
      layout.$tabDragGhost.model = rootSplit.children[0].tabs[0]

      expect(() => layout.getDropTarget(x, y)).not.toThrow()
      const result = layout.getDropTarget(x, y)
      expect(result).not.toBeNull()
      expect(result!.tabs.length).toBe(0)
    })

  })

})
