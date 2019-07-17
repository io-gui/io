import {IoElement, html} from "../io.js";
import "./menu-item.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoMenuOptions extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        user-select: none;
        touch-action: none;
        background: var(--io-background-color-dark);
        color: var(--io-color);
        border-radius: var(--io-border-radius);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        box-shadow: var(--io-shadow);
      }
      :host:not([horizontal]) {
        padding: calc(2 * var(--io-spacing)) 0;
      }
      :host:not([expanded]) {
        visibility: hidden;
      }
      :host[horizontal] {
        flex-direction: row;
        align-self: stretch;
        justify-self: stretch;
        flex-wrap: nowrap;
      }
      :host[horizontal] > * {
        padding: calc(2 * var(--io-spacing)) calc(4 * var(--io-spacing));
      }
      :host:not([horizontal]) > io-menu-item > * {
        min-width: 0.5em;
        padding: 0 var(--io-spacing);
      }
      :host[horizontal] > io-menu-item > .io-menu-hint,
      :host[horizontal] > io-menu-item > .io-menu-more {
        display: none;
      }
      :host[horizontal] > io-menu-item.io-hamburger {
        margin-left: auto;
      }
      :host[horizontal] > io-menu-item.io-hamburger[hidden] {
        display: inline-block;
        width: 0;
        padding: 0;
        border: 0;
        overflow: hidden;
        visibility: hidden;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'listbox',
      expanded: {
        value: true,
        notify: true,
      },
      overflow: {
        type: Boolean,
        notify: true,
      },
      horizontal: {
        type: Boolean,
        notify: true,
      },
    };
  }
  static get Properties() {
    return {
      options: Array,
      position: 'right',
      value: {
        value: null,
        notify: true,
      },
      slotted: Array,
      $parent: HTMLElement,
      _depth: 0,
      _rects: Array,
    };
  }
  static get Listeners() {
    return {
      'io-menu-item-clicked': '_onMenuItemClicked',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    IoMenuLayer.singleton.registerOptions(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.unregisterOptions(this);
  }
  _onMenuItemClicked(event) {
    const item = event.composedPath()[0];
    if (item !== this) {
      event.stopImmediatePropagation();
      this.set('value', event.detail.value);
      this.dispatchEvent('io-menu-item-clicked', event.detail, true);
      item.expanded = false;
    }
  }
  onResized() {
    this.setOverflow();
  }
  setOverflow() {
    const buttons = this.querySelectorAll('io-menu-item:not(.io-hamburger)');
    if (this.horizontal) {
      const hamburger = this.querySelector('.io-hamburger');
      const rects = this._rects;
      rects.length = buttons.length;

      if (!rects.length) return;
      if (!buttons.length) return;

      let end = this.getBoundingClientRect().right;
      let overflow = false;
      let last = Infinity;
      hamburger.hidden = true;
      const hamburgerOptions = [];

      for (let i = buttons.length; i--;) {
        const r = buttons[i].getBoundingClientRect();
        rects[i] = rects[i] || {right: 0, width: 0};
        if (r.right !== 0) rects[i].right = r.right;
        if (r.width !== 0) rects[i].width = r.width;

        if (hamburger.hidden && overflow) {
          hamburger.hidden = false;
          end -= hamburger.getBoundingClientRect().width;
        }

        if (buttons[i].selected) {
          end -= rects[i].width;
          buttons[i].hidden = false;
          continue;
        }

        last = Math.min(last, rects[i].right);
        if (last < end) {
          buttons[i].hidden = false;
        } else {
         buttons[i].hidden = true;
         hamburgerOptions.push(buttons[i].option);
         overflow = true;
        }
      }
      hamburger.option = {options: hamburgerOptions};
      this.overflow = overflow;
    } else {
      for (let i = buttons.length; i--;) {
        buttons[i].hidden = false;
      }
    }
  }
  // TODO: refactor and unhack nudges.
  nudgeRight(x, y, rect) {
    if (x + rect.width < window.innerWidth) {
      this._x = x;
      this._y = Math.min(y, window.innerHeight - rect.height);
      return true;
    }
    return false;
  }
  nudgeLeft(x, y, rect) {
    if (x - rect.width > 0) {
      this._x = x - rect.width;
      this._y = Math.min(y, window.innerHeight - rect.height);
      return true;
    }
    return false;
  }
  nudgeBottom(x, y, rect) {
    if (y + rect.height < window.innerHeight) {
      this._y = y;
      this._x = Math.min(x, window.innerWidth - rect.width);
      return true;
    }
    return false;
  }
  nudgeTop(x, y, rect) {
    if (y - rect.height > 0) {
      this._y = y - rect.height;
      this._x = Math.min(x, window.innerWidth - rect.width);
      return true;
    }
    return false;
  }
  nudgePointer(x, y, _x, _y, rect) {
    this._x = Math.max(x + 14, Math.min(_x, window.innerWidth - rect.width));
    this._y = Math.max(Math.min(_y, window.innerHeight - rect.height), 0);
    return true;
  }
  expandedChanged() {
    if (this.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton._onOptionsExpanded(this);
      if (this.expanded && this.$parent) {
        let rect = this.getBoundingClientRect();
        let pRect = this.$parent.getBoundingClientRect();
        const x = IoMenuLayer.singleton._x;
        const y = IoMenuLayer.singleton._y;
        switch (this.position) {
          case 'pointer':
            this._x = typeof x === 'number' ? (x - 4) : pRect.x;
            this._y = typeof y === 'number' ? (y - 4) : pRect.y;
            break;
          case 'top':
            this.nudgeTop(pRect.x, pRect.top, rect) ||
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgePointer(x, y, pRect.x, pRect.top - rect.height, rect);
            break;
          case 'left':
            this.nudgeLeft(pRect.x, pRect.top, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgePointer(x, y, pRect.x - rect.width, pRect.top, rect);
            break;
          case 'bottom':
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeTop(pRect.x, pRect.top, rect) ||
            this.nudgePointer(x, y, pRect.x, pRect.bottom, rect);
            break;
          case 'right':
          default:
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect) ||
            this.nudgePointer(x, y, pRect.right, pRect.top, rect);
            break;
        }
        this.style.left = this._x + 'px';
        this.style.top = this._y + 'px';
      }
    }
  }
  changed() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const elements = [this.options.map(option =>
      ['io-menu-item', {
        $parent: this,
        option: option,
        value: this.value,
        direction: itemDirection,
        _depth: this._depth + 1,
      }]
    )];
    if (this.horizontal) {
      elements.splice(0, 0, this.slotted[0]);
      elements.push(['io-menu-item', {
        label: '☰',
        title: 'select tab',
        value: this.value,
        class: 'io-hamburger',
        _depth: this._depth,
      }]);
    }
    this.template(elements);
    this.setOverflow();
  }
}

IoMenuOptions.Register();
