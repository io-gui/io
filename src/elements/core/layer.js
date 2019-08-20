import {IoElement, html} from "../../io.js";

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
        /* background: rgba(0,0,0,0.2); */
      }
      :host[expanded] {
        pointer-events: all;
        visibility: visible;
        opacity: 1;
        /* background: rgba(255,0,0,0.2); */
      }
      :host > * {
        position: absolute;
        pointer-events: all;
      }
      :host > *:not([expanded]) {
        visibility: hidden;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      expanded: {
        value: false,
        notify: true,
      },
    };
  }
  static get Properties() {
    return {
      srcElement: HTMLElement
    };
  }
  static get Listeners() {
    return {
      'pointerdown': '_onPointerdown',
      'contextmenu': '_onContextmenu',
    };
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
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
  }
  _onWindowChange() {
    this.expanded = false;
  }
  _onPointerdown(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.setPointerCapture(event.pointerId);
      this.addEventListener('pointermove', this._onPointermove);
      this.addEventListener('pointerup', this._onPointerup);
    }
  }
  _onPointermove(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  _onPointerup(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.releasePointerCapture(event.pointerId);
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    this._collapseOrFocusSrcElement(event);
  }
  _onContextmenu(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  _collapseOrFocusSrcElement(pointer) {
    const x = pointer.clientX;
    const y = pointer.clientY;
    if (this.srcElement) {
      const rect = this.srcElement.getBoundingClientRect();
      if (x > rect.x && x < rect.right && y > rect.y && y < rect.bottom) {
        this.srcElement.focus();
        return;
      }
    }
    this.expanded = false;
  }
  onChildExpanded() {
    for (let i = this.children.length; i--;) {
      if (this.children[i].expanded) { this.expanded = true; return; };
    }
    this.expanded = false;
  }
  nudgeBottom(element, x, y, elemRect, force) {
    if (y + elemRect.height < window.innerHeight || force) {
      element.style.top = y + 'px';
      element.style.left = Math.min(x, Math.max(0, window.innerWidth - elemRect.width)) + 'px';
      return true;
    }
    return false;
  }
  nudgeTop(element, x, y, elemRect, force) {
    if (y - elemRect.height > 0 || force) {
      element.style.top = y - elemRect.height + 'px';
      element.style.left = Math.min(x, Math.max(0, window.innerWidth - elemRect.width)) + 'px';
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
      case 'top':
        this.nudgeTop(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeBottom(element, srcRect.x, srcRect.bottom, elemRect) ||
        this.nudgeTop(element, srcRect.x, srcRect.top, elemRect, true);
        break;
      case 'left':
        this.nudgeLeft(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeRight(element, srcRect.right, srcRect.top, elemRect) ||
        this.nudgeLeft(element, srcRect.x, srcRect.top, elemRect, true);
        break;
      case 'bottom':
        this.nudgeBottom(element, srcRect.x, srcRect.bottom, elemRect) ||
        this.nudgeTop(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeBottom(element, srcRect.x, srcRect.bottom, elemRect, true);
        break;
      case 'right':
      default:
        this.nudgeRight(element, srcRect.right, srcRect.top, elemRect) ||
        this.nudgeLeft(element, srcRect.x, srcRect.top, elemRect) ||
        this.nudgeRight(element, srcRect.right, srcRect.top, elemRect, true);
        break;
    }
  }
  expandedChanged() {
    if (!this.expanded) {
      for (let i = this.children.length; i--;) {
        this.children[i].expanded = false;
      }
    }
  }
}

IoLayer.Register();

export const IoLayerSingleton = new IoLayer();
document.body.appendChild(IoLayerSingleton);
