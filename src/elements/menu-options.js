import {IoElement, html} from "../core/element.js";
import {Option} from "../types/option.js";
import {IoMenuItem} from "./menu-item.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoMenuOptions extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        user-select: none;
        touch-action: none;
        background: var(--io-background-color);
        color: var(--io-color);
        border-radius: var(--io-border-radius);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        box-shadow: var(--io-shadow);
      }
      :host:not([expanded]) {
        visibility: hidden;
      }
      :host[horizontal] {
        flex-direction: row;
        align-self: stretch;
        flex-wrap: nowrap;
      }
      :host[horizontal] > * {
        padding: calc(2 * var(--io-spacing)) calc(4 * var(--io-spacing));
      }
      :host[horizontal] > io-menu-item > .io-menu-hint,
      :host[horizontal] > io-menu-item > .io-menu-more {
        display: none;
      }
      :host[horizontal] > io-menu-item.io-hamburger {
        line-height: 1.1em;
        margin-left: auto;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        value: true,
        reflect: 1
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: 1
      },
      value: null,
      overflow: {
        type: Boolean,
        reflect: 1,
      },
      role: 'listbox',
      $parent: HTMLElement,
      _depth: 0,
      _rects: Array,
    };
  }
  static get listeners() {
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
      item.expanded = false;
      this.set('value', event.detail.value, true);
      this.dispatchEvent('io-menu-item-clicked', event.detail, true);
    }
  }
  resized() {
    this.setOverflow();
  }
  setOverflow() {
    if (this.horizontal) {
      const buttons = this.querySelectorAll('io-menu-item:not(.io-hamburger)');
      const hamburger = this.querySelector('io-menu-item.io-hamburger');
      const rects = this._rects;
      rects.length = buttons.length;

      if (!rects.length) return;
      if (!buttons.length) return;

      let end = this.getBoundingClientRect().right;
      let overflow = false;
      let last = Infinity;
      hamburger.hidden = true;

      for (let i = buttons.length; i--;) {
        const r = buttons[i].getBoundingClientRect();
        rects[i] = rects[i] || {right: 0, width: 0};
        rects[i].right = r.right ? Math.max(rects[i].right, r.right) : rects[i].right;
        rects[i].width = r.width ? Math.max(rects[i].width, r.width) : rects[i].width;

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
          overflow = true;
        }
      }
      this.overflow = overflow;
    }
  }
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
  expandedChanged() {
    if (this.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton._onOptionsExpanded(this);
      if (this.expanded && this.$parent) {
        let rect = this.getBoundingClientRect();
        let pRect = this.$parent.getBoundingClientRect();
        switch (this.position) {
          case 'pointer':
            this._x = this._x - 1 || pRect.x;
            this._y = this._y - 1 || pRect.y;
            break;
          case 'top':
            this.nudgeTop(pRect.x, pRect.top, rect) ||
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect);
            break;
          case 'left':
            this.nudgeLeft(pRect.x, pRect.top, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeTop(pRect.x, pRect.top, rect);
            break;
          case 'bottom':
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeTop(pRect.x, pRect.top, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect);
            break;
          case 'right':
          default:
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect) ||
            this.nudgeBottom(pRect.right, pRect.bottom, rect) ||
            this.nudgeTop(pRect.right, pRect.top, rect);
            break;
        }
        this.style.left = this._x + 'px';
        this.style.top = this._y + 'px';
      }
    }
  }
  changed() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const options = this.options.map(option => { return new Option(option); });
    const elements = [options.map(option =>
      ['io-menu-item', {
        $parent: this,
        option: option,
        value: this.value,
        direction: itemDirection,
        _depth: this._depth + 1,
      }]
    )];
    if (this.horizontal) {
      // TODO: Detect selectedSubOption selected!
      elements.push(['io-menu-item', {
        label: '☰',
        title: 'select tab',
        value: this.value,
        option: {options: this.options},
        class: 'io-hamburger',
      }]);
    }
    this.template(elements);
    this.setOverflow();
  }
}

IoMenuOptions.Register();
