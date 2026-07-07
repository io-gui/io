import { describe, it, expect, afterEach } from 'vitest'
import { IoOverlaySingleton as Overlay } from '@io-gui/core'
import { IoLayout, Layout } from '@io-gui/layout'

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

})
