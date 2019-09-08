import {IoElement} from "../../io.js";

let lastFocus = null;
{
  window.addEventListener('focusin', () => {
    lastFocus = document.activeElement;
  }, {capture: false});
  window.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.activeElement === document.body) {
        lastFocus = null;
      }
    });
  }, {capture: true});
}

class IoLayer extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: block;
      visibility: hidden;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100000;
      user-select: none;
      overflow: hidden;
      pointer-events: none;
      touch-action: none;
      opacity: 0;
      transition: opacity 0.25s;
      background: transparent;
    }
    :host[expanded] {
      pointer-events: all;
      visibility: visible;
      opacity: 1;
      /* background: rgba(0,0,0,0.2); */
    }
    :host > * {
      position: absolute;
      pointer-events: all;
      touch-action: none;
    }
    :host > *:not([expanded]) {
      visibility: hidden;
      pointer-events: none;
    }
    `;
  }
  static get Properties() {
    return {
      expanded: {
        value: false,
        reflect: 1,
      },
      srcElement: HTMLElement,
    };
  }
  static get Listeners() {
    return {
      'pointerdown': '_onPointerdown',
      'pointermove': '_onPointermove',
      'pointerup': '_onPointerup',
      'touchstart': '_stopPreventDefault',
      'mousedown': '_stopPreventDefault',
      'contextmenu': '_stopPreventDefault',
      'focusin': '_stopPreventDefault',
      'scroll': '_onScroll',
      'wheel': '_onScroll',
    };
  }
  constructor(props) {
    super(props);
    Object.defineProperty(this, 'x', {value: null, writable: true});
    Object.defineProperty(this, 'y', {value: null, writable: true});
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._onWindowResize, {capture: true, passive: true});
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._onWindowResize, {capture: true, passive: true});
  }
  _onScroll(event) {
    event.stopPropagation();
    if (event.composedPath()[0] === this) {
      this.expanded = false;
    }
  }
  _stopPreventDefault(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  _onFocusIn(event) {
    event.stopPropagation();
  }
  _onWindowResize() {
    this.expanded = false;
  }
  _onPointerdown(event) {
    event.stopPropagation();
    if (event.composedPath()[0] === this) {
      this.setPointerCapture(event.pointerId);
    }
  }
  _onPointermove(event) {
    event.stopPropagation();
    this.x = event.clientX;
    this.y = event.clientY;
  }
  _onPointerup(event) {
    event.stopPropagation();
    this.x = null;
    this.y = null;
    if (event.composedPath()[0] === this) {
      this.releasePointerCapture(event.pointerId);
      this._collapseOrFocusSrcElement(event);
    }
  }
  _collapseOrFocusSrcElement(event) {
    const x = event.clientX;
    const y = event.clientY;
    if (this.srcElement) {
      const rect = this.srcElement.getBoundingClientRect();
      if (x > rect.x && x < rect.right && y > rect.y && y < rect.bottom) {
        this.srcElement.focus();
        this.expanded = false;
        return;
      }
    }
    this.expanded = false;
  }
  nudgeDown(element, x, y, elemRect, force) {
    x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
    if (y + elemRect.height < window.innerHeight || force) {
      element.style.left = x + 'px';
      element.style.top = y + 'px';
      return true;
    }
    return false;
  }
  nudgeUp(element, x, y, elemRect, force) {
    x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
    if (y - elemRect.height > 0 || force) {
      element.style.left = x + 'px';
      element.style.top = y - elemRect.height + 'px';
      return true;
    }
    return false;
  }
  nudgeRight(element, x, y, elemRect, force) {
    if (x + elemRect.width < window.innerWidth || force) {
      element.style.left = x + 'px';
      element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
      return true;
    }
    return false;
  }
  nudgeLeft(element, x, y, elemRect, force) {
    if (x - elemRect.width > 0 || force) {
      element.style.left = x - elemRect.width + 'px';
      element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
      return true;
    }
    return false;
  }
  nudgePointer(element, x, y, elemRect) {
    element.style.left = Math.max(0, Math.min(x, window.innerWidth - elemRect.width)) + 'px';
    element.style.top = Math.max(0, Math.min(y, window.innerHeight - elemRect.height)) + 'px';
    return true;
  }
  setElementPosition(element, direction, srcRect) {
    const elemRect = element.getBoundingClientRect();
    const left = srcRect.left;
    const top = srcRect.top;
    const right = srcRect.right;
    const bottom = srcRect.bottom;
    const bottomToHeight = window.innerHeight - bottom;
    const rightToWidth = window.innerWidth - right;
    switch (direction) {
      case 'pointer':
        this.nudgePointer(element, this.x, this.y, elemRect);
        break;
      case 'top':
        this.nudgeUp(element, left, top, elemRect) ||
        this.nudgeDown(element, left, bottom, elemRect) ||
        this.nudgeUp(element, left, top, elemRect, top > bottomToHeight) ||
        this.nudgeDown(element, left, bottom, elemRect, top <= bottomToHeight);
        break;
      case 'left':
        this.nudgeLeft(element, left, top, elemRect) ||
        this.nudgeRight(element, right, top, elemRect) ||
        this.nudgeLeft(element, left, top, elemRect, left > rightToWidth) ||
        this.nudgeRight(element, right, top, elemRect, left <= rightToWidth);
        break;
      case 'bottom':
        this.nudgeDown(element, left, bottom, elemRect) ||
        this.nudgeUp(element, left, top, elemRect) ||
        this.nudgeDown(element, left, bottom, elemRect, bottomToHeight > top) ||
        this.nudgeUp(element, left, top, elemRect, bottomToHeight <= top);
        break;
      case 'right':
      default:
        this.nudgeRight(element, right, top, elemRect) ||
        this.nudgeLeft(element, left, top, elemRect) ||
        this.nudgeRight(element, right, top, elemRect, rightToWidth > left) ||
        this.nudgeLeft(element, left, top, elemRect, rightToWidth <= left);
        break;
    }
  }
  onChildExpanded() {
    this.requestAnimationFrameOnce(this.onChildExpandedDelayed);
  }
  onChildExpandedDelayed() {
    for (let i = this.children.length; i--;) {
      if (this.children[i].expanded) {
        this.expanded = true;
        return;
      }
    }
    this.expanded = false;
  }
  expandedChanged() {
    if (!this.expanded) {
      this.x = null;
      this.y = null;
      for (let i = this.children.length; i--;) {
        this.children[i].expanded = false;
      }
      if (lastFocus) lastFocus.focus();
    }
  }
}

IoLayer.Register();

export const IoLayerSingleton = new IoLayer();
document.body.appendChild(IoLayerSingleton);
