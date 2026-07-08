import { ThemeSingleton } from '@io-gui/core'
import { SplitDirection } from '../types/SplitDirection.js'

export function resolveSplitEdge(x: number, y: number, panelRect: DOMRect, tabRects: DOMRect[]): SplitDirection {
  const ndcX = ((x - panelRect.left) / panelRect.width) * 2 - 1
  const ndcY = ((y - panelRect.top) / panelRect.height) * 2 - 1
  const absX = Math.abs(ndcX)
  const absY = Math.abs(ndcY)

  const ndcTabHeight = tabRects.length > 0 ? tabRects[0].height / panelRect.height * 2 : 0

  if ((absX > 0.8 || absY > 0.8 || ndcY < (-0.8 + ndcTabHeight)) && absX < 1 && absY < 1) {
    if (absX > absY) {
      if (ndcX > 0) {
        return 'right'
      } else {
        return 'left'
      }
    } else {
      if (ndcY > 0) {
        return 'bottom'
      } else {
        return 'top'
      }
    }
  }
  return 'center'
}

export function resolveDropIndex(x: number, y: number, tabRects: DOMRect[]): number {
  const s = ThemeSingleton.spacing
  const pickedTabIndex = tabRects.findIndex(rect => (x + s) > rect.left && (x - s) < rect.right && (y + s) > rect.top && (y - s) < rect.bottom)
  if (pickedTabIndex === -1 &&y <= tabRects[0].bottom) {
    return tabRects.length
  }
  return pickedTabIndex
}