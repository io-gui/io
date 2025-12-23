import { IoElement } from '../elements/IoElement'

/**
 * Nudge direction.
 *
 * @description Nudge direction.
 * @example
 *
 */
export type NudgeDirection = 'none' | 'up' | 'left' | 'down' | 'right' | 'over'

const viewport = {
  get width(): number {
    return window.visualViewport
      ? window.visualViewport.width * window.visualViewport.scale
      : document.documentElement.clientWidth
  },
  get height(): number {
    return window.visualViewport
      ? window.visualViewport.height * window.visualViewport.scale
      : document.documentElement.clientHeight
  },
  get offsetLeft(): number {
    return window.visualViewport ? window.visualViewport.offsetLeft : 0
  },
  get offsetTop(): number {
    return window.visualViewport ? window.visualViewport.offsetTop : 0
  },
}

function nudgeUp(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  x = Math.max(0, Math.min(x, viewport.width - elemRect.width))
  let clipWidth = -1
  let clipHeight = -1
  const fitsHeight = y - elemRect.height >= 0
  const fitsWidth = x + elemRect.width <= viewport.width
  if (fitsHeight || force) {
    if (!fitsHeight) {
      if (doClip) {
        clipHeight = y
        y = 0
      } else {
        y = elemRect.height - y
      }
    } else {
      y = y - elemRect.height
    }
    if (!fitsWidth) {
      if (doClip) {
        clipWidth = viewport.width
      } else {
        x = viewport.width - elemRect.width
      }
    }
    element.style.top = y + 'px'
    element.style.left = x + 'px'
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : ''
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : ''
    return true
  }
  return false
}

function nudgeDown(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  y = y + viewport.offsetTop
  x = x + viewport.offsetLeft
  x = Math.max(0, Math.min(x, viewport.width - elemRect.width))
  let clipWidth = -1
  let clipHeight = -1
  const fitsHeight = y + elemRect.height <= viewport.height
  const fitsWidth = x + elemRect.width <= viewport.width
  if (fitsHeight || force) {
    if (!fitsHeight) {
      if (doClip) {
        clipHeight = viewport.height - y
      } else {
        y = viewport.height - elemRect.height
      }
    }
    if (!fitsWidth) {
      if (doClip) {
        clipWidth = viewport.width
      } else {
        x = viewport.width - elemRect.width
      }
    }
    element.style.top = y + 'px'
    element.style.left = x + 'px'
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : ''
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : ''
    return true
  }
  return false
}

function nudgeLeft(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  y = Math.max(0, Math.min(y, viewport.height - elemRect.height))
  let clipWidth = -1
  let clipHeight = -1
  const fitsWidth = x - elemRect.width >= 0
  const fitsHeight = y + elemRect.height <= viewport.height
  if (fitsWidth || force) {
    if (!fitsWidth) {
      if (doClip) {
        clipWidth = x
        x = 0
      } else {
        x = 0
      }
    } else {
      x = x - elemRect.width
    }
    if (!fitsHeight) {
      if (doClip) {
        clipHeight = viewport.height
      } else {
        y = viewport.height - elemRect.height
      }
    }
    element.style.top = y + 'px'
    element.style.left = x + 'px'
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : ''
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : ''
    return true
  }
  return false
}

function nudgeRight(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  y = Math.max(0, Math.min(y, viewport.height - elemRect.height))
  let clipWidth = -1
  let clipHeight = -1
  const fitsWidth = x + elemRect.width <= viewport.width
  const fitsHeight = y + elemRect.height <= viewport.height
  if (fitsWidth || force) {
    if (!fitsWidth) {
      if (doClip) {
        clipWidth = viewport.width - x
      } else {
        x = viewport.width - elemRect.width
      }
    }
    if (!fitsHeight) {
      if (doClip) {
        clipHeight = viewport.height
      } else {
        y = viewport.height - elemRect.height
      }
    }
    element.style.top = y + 'px'
    element.style.left = x + 'px'
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : ''
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : ''
    return true
  }
  return false
}

export function nudge(element: HTMLElement | IoElement, srcElement: HTMLElement | IoElement, direction: NudgeDirection, doClip?: boolean) {
  const elemRect = element.getBoundingClientRect()
  const srcRect = srcElement.getBoundingClientRect()
  const left = srcRect.left
  const top = srcRect.top
  const right = srcRect.right
  const bottom = srcRect.bottom
  const bottomToHeight = viewport.height - bottom
  const rightToWidth = viewport.width - right
  const x = elemRect.left
  const y = elemRect.top
  switch (direction) {
    case 'none':
      nudgeRight(element, x, y, elemRect, false, doClip) ||
      nudgeLeft(element, x, y, elemRect, false, doClip) ||
      nudgeRight(element, x, y, elemRect, rightToWidth > left, doClip) ||
      nudgeLeft(element, left, top, elemRect, rightToWidth <= left, doClip)
      break
    case 'up':
      nudgeUp(element, left, top, elemRect, false, doClip) ||
      nudgeDown(element, left, bottom, elemRect, false, doClip) ||
      nudgeUp(element, left, top, elemRect, top > bottomToHeight, doClip) ||
      nudgeDown(element, left, bottom, elemRect, top <= bottomToHeight, doClip)
      break
    case 'left':
      nudgeLeft(element, left, top, elemRect, false, doClip) ||
      nudgeRight(element, right, top, elemRect, false, doClip) ||
      nudgeLeft(element, left, top, elemRect, left > rightToWidth, doClip) ||
      nudgeRight(element, right, top, elemRect, left <= rightToWidth, doClip)
      break
    case 'down':
      nudgeDown(element, left, bottom, elemRect, false, doClip) ||
      nudgeUp(element, left, top, elemRect, false, doClip) ||
      nudgeDown(element, left, bottom, elemRect, bottomToHeight > top, doClip) ||
      nudgeUp(element, left, top, elemRect, bottomToHeight <= top, doClip)
      break
    case 'right':
      nudgeRight(element, right, top, elemRect, false, doClip) ||
      nudgeLeft(element, left, top, elemRect, false, doClip) ||
      nudgeRight(element, right, top, elemRect, rightToWidth > left, doClip) ||
      nudgeLeft(element, left, top, elemRect, rightToWidth <= left, doClip)
      break
    case 'over':
    default:
      nudgeRight(element, left, top, elemRect, false, doClip) ||
      nudgeLeft(element, right, top, elemRect, false, doClip) ||
      nudgeRight(element, left, top, elemRect, rightToWidth > left, doClip) ||
      nudgeLeft(element, right, top, elemRect, rightToWidth <= left, doClip)
      break
  }
}