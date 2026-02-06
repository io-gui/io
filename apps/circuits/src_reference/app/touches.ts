/** Touch/mouse input abstraction. */

export function isMobile(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/** Normalise a touch/mouse event to a single coordinate object. */
export function getTouch(event: TouchEvent | MouseEvent): Touch | MouseEvent {
  if ('touches' in event) {
    return event.touches[0] ?? event.changedTouches[0];
  }
  return event;
}

/** Bind a callback to one or more CSS selectors. */
export function bindTouch(
  selectors: string,
  callback: (e: Event) => void,
  eventType?: string,
): void {
  const evt = eventType ?? (isMobile() ? 'touchend' : 'click');
  for (const sel of selectors.split(',')) {
    for (const el of document.querySelectorAll(sel.trim())) {
      el.addEventListener(evt, callback);
    }
  }
}

export function bindTouchStart(
  selectors: string,
  callback: (e: Event) => void,
  eventType?: string,
): void {
  const evt = eventType ?? (isMobile() ? 'touchstart' : 'mousedown');
  for (const sel of selectors.split(',')) {
    for (const el of document.querySelectorAll(sel.trim())) {
      el.addEventListener(evt, callback);
    }
  }
}

export function bindTouchMove(
  selectors: string,
  callback: (e: Event) => void,
  eventType?: string,
): void {
  const evt = eventType ?? (isMobile() ? 'touchmove' : 'mousemove');
  for (const sel of selectors.split(',')) {
    for (const el of document.querySelectorAll(sel.trim())) {
      el.addEventListener(evt, callback);
    }
  }
}

export function bindTouchEnd(
  selectors: string,
  callback: (e: Event) => void,
  eventType?: string,
): void {
  const evt = eventType ?? (isMobile() ? 'touchend' : 'mouseup');
  for (const sel of selectors.split(',')) {
    for (const el of document.querySelectorAll(sel.trim())) {
      el.addEventListener(evt, callback);
    }
  }
}
