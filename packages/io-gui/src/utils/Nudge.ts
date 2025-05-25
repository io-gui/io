import { IoElement } from '../elements/IoElement';

/**
 * Nudge direction.
 *
 * @description Nudge direction.
 * @example
 *
 */
export type NudgeDirection = 'none' | 'up' | 'left' | 'down' | 'right';

function nudgeDown(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean) {
  x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
  const fits = y + elemRect.height < window.innerHeight;
  if (fits || force) {
    if (!fits) y = window.innerHeight - elemRect.height;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    return true;
  }
  return false;
}

function nudgeUp(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean) {
  x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
  const fits = y - elemRect.height > 0;
  if (fits || force) {
    if (!fits) y = 0;
    element.style.left = x + 'px';
    element.style.top = y - elemRect.height + 'px';
    return true;
  }
  return false;
}

function nudgeRight(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean) {
  const fits = x + elemRect.width < window.innerWidth;
  if (fits || force) {
    if (!fits) x = window.innerWidth - elemRect.width;
    element.style.left = x + 'px';
    element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
    return true;
  }
  return false;
}

function nudgeLeft(element: HTMLElement | IoElement, x: number, y: number, elemRect: DOMRect, force?: boolean) {
  const fits = x - elemRect.width > 0;
  if (fits || force) {
    if (!fits) x = 0;
    element.style.left = x - elemRect.width + 'px';
    element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
    return true;
  }
  return false;
}

function nudgeInPlace(element: HTMLElement | IoElement, elemRect: DOMRect) {
  element.style.left = Math.max(0, Math.min(elemRect.left, window.innerWidth - elemRect.width)) + 'px';
  element.style.top = Math.max(0, Math.min(elemRect.top, window.innerHeight - elemRect.height)) + 'px';
  return true;
}

export function nudge(element: HTMLElement | IoElement, srcElement: HTMLElement | IoElement, direction: NudgeDirection) {
  const elemRect = element.getBoundingClientRect();
  const srcRect = srcElement.getBoundingClientRect();
  const left = srcRect.left;
  const top = srcRect.top;
  const right = srcRect.right;
  const bottom = srcRect.bottom;
  const bottomToHeight = window.innerHeight - bottom;
  const rightToWidth = window.innerWidth - right;
  switch (direction) {
    case 'none':
      nudgeInPlace(element, elemRect);
      break;
    case 'up':
      nudgeUp(element, left, top, elemRect) ||
      nudgeDown(element, left, bottom, elemRect) ||
      nudgeUp(element, left, top, elemRect, top > bottomToHeight) ||
      nudgeDown(element, left, bottom, elemRect, top <= bottomToHeight);
      break;
    case 'left':
      nudgeLeft(element, left, top, elemRect) ||
      nudgeRight(element, right, top, elemRect) ||
      nudgeLeft(element, left, top, elemRect, left > rightToWidth) ||
      nudgeRight(element, right, top, elemRect, left <= rightToWidth);
      break;
    case 'down':
      nudgeDown(element, left, bottom, elemRect) ||
      nudgeUp(element, left, top, elemRect) ||
      nudgeDown(element, left, bottom, elemRect, bottomToHeight > top) ||
      nudgeUp(element, left, top, elemRect, bottomToHeight <= top);
      break;
    case 'right':
    default:
      nudgeRight(element, right, top, elemRect) ||
      nudgeLeft(element, left, top, elemRect) ||
      nudgeRight(element, right, top, elemRect, rightToWidth > left) ||
      nudgeLeft(element, left, top, elemRect, rightToWidth <= left);
      break;
  }
}