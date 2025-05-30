import { IoElement } from '../elements/IoElement';

/**
 * Nudge direction.
 *
 * @description Nudge direction.
 * @example
 *
 */
export type NudgeDirection = 'none' | 'up' | 'left' | 'down' | 'right';

function nudgeUp(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
  let clipWidth = -1;
  let clipHeight = -1;
  const fitsWidth = elemRect.width <= window.innerWidth;
  const fitsHeight = y - elemRect.height >= 0;
  if (fitsHeight || force) {
    if (!fitsHeight) {
      if (doClip) {
        clipHeight = y;
        y = 0;
      } else {
        y = elemRect.height - y;
      }
    } else {
      y = y - elemRect.height;
    }
    if (doClip && !fitsWidth) {
      clipWidth = window.innerWidth;
    }
    element.style.top = y + 'px';
    element.style.left = x + 'px';
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : null;
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : null;
    return true;
  }
  return false;
}

function nudgeDown(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
  let clipWidth = -1;
  let clipHeight = -1;
  const fitsHeight = y + elemRect.height <= window.innerHeight;
  const fitsWidth = elemRect.width <= window.innerWidth;
  if (fitsHeight || force) {
    if (!fitsHeight) {
      if (doClip) {
        clipHeight = window.innerHeight - y;
      } else {
        y = window.innerHeight - elemRect.height;
      }
    }
    if (doClip && !fitsWidth) {
      clipWidth = window.innerWidth;
    }
    element.style.top = y + 'px';
    element.style.left = x + 'px';
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : null;
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : null;
    return true;
  }
  return false;
}

function nudgeLeft(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  y = Math.max(0, Math.min(y, window.innerHeight - elemRect.height));
  let clipWidth = -1;
  let clipHeight = -1;
  const fitsWidth = x - elemRect.width >= 0;
  const fitsHeight = elemRect.height <= window.innerHeight;
  if (fitsWidth || force) {
    if (!fitsWidth) {
      if (doClip) {
        clipWidth = x;
        x = 0;
      } else {
        x = 0;
      }
    } else {
      x = x - elemRect.width;
    }
    if (doClip && !fitsHeight) {
      clipHeight = window.innerHeight;
    }
    element.style.top = y + 'px';
    element.style.left = x + 'px';
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : null;
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : null;
    return true;
  }
  return false;
}

function nudgeRight(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean, doClip?: boolean) {
  y = Math.max(0, Math.min(y, window.innerHeight - elemRect.height));
  let clipWidth = -1;
  let clipHeight = -1;
  const fitsWidth = x + elemRect.width <= window.innerWidth;
  const fitsHeight = elemRect.height <= window.innerHeight;
  if (fitsWidth || force) {
    if (!fitsWidth) {
      if (doClip) {
        clipWidth = window.innerWidth - x;
      } else {
        x = window.innerWidth - elemRect.width;
      }
    }
    if (doClip && !fitsHeight) {
      clipHeight = window.innerHeight;
    }
    element.style.top = y + 'px';
    element.style.left = x + 'px';
    element.style.width = clipWidth !== -1 ? clipWidth + 'px' : null;
    element.style.height = clipHeight !== -1 ? clipHeight + 'px' : null;
    return true;
  }
  return false;
}

export function nudge(element: HTMLElement | IoElement, srcElement: HTMLElement | IoElement, direction: NudgeDirection, doClip?: boolean) {
  const elemRect = element.getBoundingClientRect();
  const srcRect = srcElement.getBoundingClientRect();
  const left = srcRect.left;
  const top = srcRect.top;
  const right = srcRect.right;
  const bottom = srcRect.bottom;
  const bottomToHeight = window.innerHeight - bottom;
  const rightToWidth = window.innerWidth - right;
  const x = elemRect.left;
  const y = elemRect.top;
  switch (direction) {
    case 'none':
      nudgeRight(element, x, y, elemRect, false, doClip) ||
      nudgeLeft(element, x, y, elemRect, false, doClip) ||
      nudgeRight(element, x, y, elemRect, rightToWidth > left, doClip) ||
      nudgeLeft(element, left, top, elemRect, rightToWidth <= left, doClip);
      break;
    case 'up':
      nudgeUp(element, left, top, elemRect, false, doClip) ||
      nudgeDown(element, left, bottom, elemRect, false, doClip) ||
      nudgeUp(element, left, top, elemRect, top > bottomToHeight, doClip) ||
      nudgeDown(element, left, bottom, elemRect, top <= bottomToHeight, doClip);
      break;
    case 'left':
      nudgeLeft(element, left, top, elemRect, false, doClip) ||
      nudgeRight(element, right, top, elemRect, false, doClip) ||
      nudgeLeft(element, left, top, elemRect, left > rightToWidth, doClip) ||
      nudgeRight(element, right, top, elemRect, left <= rightToWidth, doClip);
      break;
    case 'down':
      nudgeDown(element, left, bottom, elemRect, false, doClip) ||
      nudgeUp(element, left, top, elemRect, false, doClip) ||
      nudgeDown(element, left, bottom, elemRect, bottomToHeight > top, doClip) ||
      nudgeUp(element, left, top, elemRect, bottomToHeight <= top, doClip);
      break;
    case 'right':
    default:
      nudgeRight(element, right, top, elemRect, false, doClip) ||
      nudgeLeft(element, left, top, elemRect, false, doClip) ||
      nudgeRight(element, right, top, elemRect, rightToWidth > left, doClip) ||
      nudgeLeft(element, left, top, elemRect, rightToWidth <= left, doClip);
      break;
  }
}