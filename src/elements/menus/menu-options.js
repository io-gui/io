import {IoElement, html} from "../../io.js";
import {IoLayerSingleton, IoThemeSingleton as mixin} from "../../io-elements-core.js";
import {IoMenuLayer} from "./menu-layer.js";
import "./menu-item.js";

export class IoMenuOptions extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.panel}
      }
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        white-space: nowrap;
        user-select: none;
        touch-action: none;
        background-image: none;
        padding: 0;
      }
      :host:not([horizontal]) {
        padding: var(--io-spacing) 0;
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
        border-left-width: 0;
        border-right-width: 0;
        padding: var(--io-spacing) calc(1 * var(--io-spacing));
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
      selectable: false,
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
            IoLayerSingleton.nudgePointer(this, x, y, rect);
            break;
          case 'top':
            IoLayerSingleton.nudgeTop(this, pRect.x, pRect.top, rect) ||
            IoLayerSingleton.nudgeBottom(this, pRect.x, pRect.bottom, rect) ||
            IoLayerSingleton.nudgePointer(this, x, y, rect);
            break;
          case 'left':
            IoLayerSingleton.nudgeLeft(this, pRect.x, pRect.top, rect) ||
            IoLayerSingleton.nudgeRight(this, pRect.right, pRect.top, rect) ||
            IoLayerSingleton.nudgePointer(this, x, y, rect);
            break;
          case 'bottom':
            IoLayerSingleton.nudgeBottom(this, pRect.x, pRect.bottom, rect) ||
            IoLayerSingleton.nudgeTop(this, pRect.x, pRect.top, rect) ||
            IoLayerSingleton.nudgePointer(this, x, y, rect);
            break;
          case 'right':
          default:
            IoLayerSingleton.nudgeRight(this, pRect.right, pRect.top, rect) ||
            IoLayerSingleton.nudgeLeft(this, pRect.x, pRect.top, rect) ||
            IoLayerSingleton.nudgePointer(this, x, y, rect);
            break;
        }
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
        selectable: this.selectable,
        _depth: this._depth + 1,
      }]
    )];
    if (this.horizontal) {
      elements.splice(0, 0, ...this.slotted);
      elements.push(['io-menu-item', {
        label: '☰',
        title: 'select tab',
        value: this.value,
        selectable: this.selectable,
        class: 'io-hamburger',
        _depth: this._depth,
      }]);
    }
    this.template(elements);
    this.setOverflow();
  }
}

IoMenuOptions.Register();
