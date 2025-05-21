import { IoElement } from '../elements/IoElement';
import { ThemeSingleton } from '../nodes/Theme';

let focusBacktrack = new WeakMap();
type Direction = 'left' | 'right' | 'down' | 'up';
const backtrackDir: Record<Direction, Direction> = {
  left: 'right',
  right: 'left',
  down: 'up',
  up: 'down'
};

function setFocusBacktrack(element: HTMLElement | IoElement, dir: Direction, source: HTMLElement | IoElement) {
  focusBacktrack.set(element, {
    dir: backtrackDir[dir],
    source: source
  });
}

function getRectDistance(rect1: DOMRect, rect2: DOMRect) {
  if (rect1.right > rect2.left && rect2.right > rect1.left && rect1.bottom > rect2.top && rect2.bottom > rect1.top) {
    return 0;
  }
  let dx = 0, dy = 0;
  const MIN_DISTANCE = ThemeSingleton.fieldHeight / 2;

  if (rect1.right < rect2.left) dx = Math.max(MIN_DISTANCE, rect2.left - rect1.right);
  else if (rect2.right < rect1.left) dx = Math.max(MIN_DISTANCE, rect1.left - rect2.right);
  if (rect1.bottom < rect2.top) dy = Math.max(MIN_DISTANCE, rect2.top - rect1.bottom);
  else if (rect2.bottom < rect1.top) dy = Math.max(MIN_DISTANCE, rect1.top - rect2.bottom);

  return (dx**2 + dy**2)**0.5;
}

function getCenterDistance(rect1: DOMRect, rect2: DOMRect) {
  let c1 = {x: rect1.x + rect1.width / 2, y: rect1.y + rect1.height / 2};
  let c2 = {x: rect2.x + rect2.width / 2, y: rect2.y + rect2.height / 2};
  return ((c1.x - c2.x)**2 + (c1.y - c2.y)**2)**0.5;
}

function onIoFocusTo(event: CustomEvent) {
  const src = event.detail.source;
  const srcRect = src.getBoundingClientRect();
  const dir = event.detail.direction;

  let closestElement = src;
  let closestDistance = Infinity;
  let closestCenterDistance = Infinity;

  const backtrack = focusBacktrack.get(src);

  if (backtrack && backtrack.dir === dir) {
    const source = backtrack.source;
    let visible = true;
    if (!source.offsetParent || source === src) {
      visible = false;
    } else {
      const sStyle = window.getComputedStyle(source);
      if (sStyle.visibility !== 'visible' || sStyle.display === 'none') {
        visible = false;
      }
    }
    if (visible) {
      source.focus();
      setFocusBacktrack(source, dir, src);
      return;
    }
  }

  const focusableCandidates = Array.from(document.querySelectorAll(`[tabIndex="${src.tabIndex || 0}"]:not([disabled]):not([inert]):not([hidden])`)) as HTMLElement[];

  for (let i = focusableCandidates.length; i--;) {

    const candidate = focusableCandidates[i];

    if (!candidate.offsetParent || candidate === src) {
      continue;
    }
    const sStyle = window.getComputedStyle(candidate);
    if (sStyle.visibility !== 'visible' || sStyle.display === 'none') {
      continue;
    }

    const rect = candidate.getBoundingClientRect();

    if (dir === 'right' && rect.left < srcRect.right) continue;
    if (dir === 'left' && rect.right > srcRect.left) continue;
    if (dir === 'down' && rect.top < srcRect.bottom) continue;
    if (dir === 'up' && rect.bottom > srcRect.top) continue;

    const distance = getRectDistance(srcRect, rect);
    const centerDistance = getCenterDistance(srcRect, rect);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestCenterDistance = centerDistance;
      closestElement = candidate;
    } else if (distance === closestDistance && centerDistance < closestCenterDistance) {
      closestCenterDistance = centerDistance;
      closestElement = candidate;
    }
  }

  if (closestElement !== src) {
    (closestElement as any).focus();
    setFocusBacktrack(closestElement, dir, src);
  }
}

document.addEventListener('io-focus-to', onIoFocusTo as EventListener);
