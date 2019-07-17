import {IoElement, html} from "../../io.js";

export class IoMathLayer extends IoElement {
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
        transition: opacity 0.1s;
      }
      :host[expanded] {
        visibility: visible;
        pointer-events: all;
        opacity: 1;
      }
      :host > * {
        position: absolute;
      }
      :host > *:not([expanded]) {
        display: none;
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
  static get Listeners() {
    return {
      'mousedown': '_onMousedown',
      'touchstart': '_onTouchstart',
      'contextmenu': '_onContextmenu',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowScroll);
    window.addEventListener('wheel', this._onWindowScroll);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onWindowScroll);
    window.removeEventListener('wheel', this._onWindowScroll);
  }
  _onWindowScroll() {
    this.expanded = false;
  }
  _onMousedown(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  _onTouchstart(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  _onContextmenu(event) {
    if (event.composedPath()[0] === this) {
      event.preventDefault();
      this.expanded = false;
    }
  }
  onChildExpanded(event) {
    const elem = event.composedPath()[0];
    if (elem.expanded) {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i] !== elem) this.children[i].expanded = false;
      }
    }
    setTimeout(()=> {
      this.expanded = elem.expanded;
    }, 100);
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
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].expanded = false;
      }
    }
  }
}

IoMathLayer.Register();

IoMathLayer.singleton = new IoMathLayer();
document.body.appendChild(IoMathLayer.singleton);
