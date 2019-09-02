import {IoElement, html} from "../../io.js";

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
    return html`<style>
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
      background: rgba(0,0,0,0.2);
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
    </style>`;
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
      'touchstart': '_preventDefault',
      'mousedown': '_preventDefault',
      'contextmenu': '_preventDefault',
      'focusin': '_preventDefault',
    };
  }
  constructor(props) {
    super(props);
    Object.defineProperty(this, 'x', {value: null, writable: true});
    Object.defineProperty(this, 'y', {value: null, writable: true});
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowChange, {capture: true, passive: true});
    window.addEventListener('wheel', this._onWindowChange, {capture: true, passive: true});
    window.addEventListener('resize', this._onWindowChange, {capture: true, passive: true});
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowChange, {capture: true, passive: true});
    window.removeEventListener('wheel', this._onWindowChange, {capture: true, passive: true});
    window.removeEventListener('resize', this._onWindowChange, {capture: true, passive: true});
  }
  _preventDefault(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  _onFocusIn(event) {
    event.stopPropagation();
  }
  _onWindowChange() {
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
  // _nudgeAnimate() {
  //   if (this.expanded) {
  //     this.requestAnimationFrameOnce(this._nudgeAnimate);
  //     const x = this.x;
  //     const y = this.y;
  //     if (x === undefined || y === undefined) return;
  //     for (let i = this.children.length; i--;) {
  //       if (this.children[i].expanded) {
  //         const r = this.children[i].getBoundingClientRect();
  //         if (!(r.top < y && r.bottom > y && r.left < x && r.right > x)) continue;
  //         if (r.bottom > window.innerHeight || r.top < 0) {
  //           let ry = r.y;
  //           if (y < 100 && r.top < 0) {
  //             const scrollSpeed = (100 - y) / 5000;
  //             const overflow = r.top;
  //             ry = ry - Math.ceil(overflow * scrollSpeed) + 1;
  //           } else if (y > window.innerHeight - 100 && r.bottom > window.innerHeight) {
  //             const scrollSpeed = (100 - (window.innerHeight - y)) / 5000;
  //             const overflow = (r.bottom - window.innerHeight);
  //             ry = ry - Math.ceil(overflow * scrollSpeed) - 1;
  //           }
  //           this.children[i].style.top = ry + 'px';
  //         }
  //         if (r.right > window.innerWidth || r.left < 0) {
  //           let rx = r.x;
  //           if (x < 100 && r.left < 0) {
  //             const scrollSpeed = (100 - x) / 5000;
  //             const overflow = r.left;
  //             rx = rx - Math.ceil(overflow * scrollSpeed) + 1;
  //           } else if (x > window.innerWidth - 100 && r.right > window.innerWidth) {
  //             const scrollSpeed = (100 - (window.innerWidth - x)) / 5000;
  //             const overflow = (r.right - window.innerWidth);
  //             rx = rx - Math.ceil(overflow * scrollSpeed) - 1;
  //           }
  //           this.children[i].style.left = rx + 'px';
  //         }
  //       }
  //     }
  //   }
  // }
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
    switch (direction) {
      case 'pointer':
        this.nudgePointer(element, this.x, this.y, elemRect);
        break;
      case 'top':
        this.nudgeUp(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeDown(element, srcRect.x, srcRect.bottom, elemRect) ||
        this.nudgeUp(element, srcRect.x, srcRect.top, elemRect, true);
        break;
      case 'left':
        this.nudgeLeft(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeRight(element, srcRect.right, srcRect.top, elemRect) ||
        this.nudgeLeft(element, srcRect.x, srcRect.top, elemRect, true);
        break;
      case 'bottom':
        this.nudgeDown(element, srcRect.x, srcRect.bottom, elemRect) ||
        this.nudgeUp(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeDown(element, srcRect.x, srcRect.bottom, elemRect, true);
        break;
      case 'right':
      default:
        this.nudgeRight(element, srcRect.right, srcRect.top, elemRect) ||
        this.nudgeLeft(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeRight(element, srcRect.right, srcRect.top, elemRect, true);
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
    // else {
    //   this.requestAnimationFrameOnce(this._nudgeAnimate);
    // }
  }
}

IoLayer.Register();

export const IoLayerSingleton = new IoLayer();
document.body.appendChild(IoLayerSingleton);
