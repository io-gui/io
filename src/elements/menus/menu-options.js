import {IoElement, html} from "../../io.js";
import {IoLayerSingleton, IoThemeSingleton as mixin} from "../../io-elements-core.js";
import "./menu-item.js";

const rects = new WeakMap();

export class IoOptionMenus extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.panel}
      }
      :host {
        align-self: flex-start;
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
      :host[inlayer]:not([expanded]) {
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
        padding: var(--io-spacing) calc(0.5 * var(--io-line-height));
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
  static get Properties() {
    return {
      value: {
        value: null,
        notify: true,
      },
      options: Array,
      expanded: {
        value: false,
        reflect: 1,
      },
      horizontal: {
        type: Boolean,
        reflect: 1,
      },
      position: 'right',
      selectable: false,
      overflow: {
        type: Boolean,
        reflect: 1,
      },
      slotted: Array,
      $parent: HTMLElement,
      _rects: Array,
      role: 'listbox',
    };
  }
  static get Listeners() {
    return {
      'item-clicked': '_onMenuItemClicked',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('inlayer', this.parentElement === IoLayerSingleton);
  }
  _onMenuItemClicked(event) {
    if (event.composedPath()[0] !== this) {
      event.stopImmediatePropagation();
      this.set('value', event.detail.value);
      this.dispatchEvent('item-clicked', event.detail, true);
      this.expanded = false;
    }
  }
  onResized() {
    this.setOverflow();
  }
  setOverflow() {
    const buttons = this.querySelectorAll('io-menu-item:not(.io-hamburger)');
    if (this.horizontal) {
      const hamburger = this.querySelector('.io-hamburger');
      if (!buttons.length) return;

      let end = this.getBoundingClientRect().right;
      let overflow = false;
      let last = Infinity;
      hamburger.hidden = true;
      const hamburgerOptions = [];

      for (let i = buttons.length; i--;) {
        const r = buttons[i].getBoundingClientRect();
        const rect = rects.get(buttons[i]) || {right: 0, width: 0};
        if (r.right !== 0 && r.width !== 0)  {
          rect.right = r.right;
          rect.width = r.width;
          rects.set(buttons[i], rect);
        }

        if (hamburger.hidden && overflow) {
          hamburger.hidden = false;
          end -= hamburger.getBoundingClientRect().width;
        }

        if (buttons[i].selected) {
          end -= rect.width;
          buttons[i].hidden = false;
          continue;
        }

        last = Math.min(last, rect.right);
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
    if (this.parentElement === IoLayerSingleton) {
      if (this.expanded && this.$parent) {
        let rect = this.getBoundingClientRect();
        let pRect = this.$parent.getBoundingClientRect();
        const x = IoLayerSingleton._x;
        const y = IoLayerSingleton._y;
        switch (this.position) {
          case 'pointer':
            IoLayerSingleton.nudgePointer(this, x, y, rect);
            break;
          default:
            IoLayerSingleton.setElementPosition(this, this.position, pRect);
            break;
        }
      }
    }
  }
  changed() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const elements = [];
    if (this.options) {
      elements.push(...[this.options.map(option =>
        ['io-menu-item', {
          $parent: this,
          option: option,
          value: this.value,
          direction: itemDirection,
          selectable: this.selectable,
        }]
      )]);
    }
    if (this.horizontal) {
      elements.splice(0, 0, ...this.slotted);
      elements.push(['io-menu-item', {
        label: '☰',
        title: 'select tab',
        value: this.value,
        selectable: this.selectable,
        class: 'io-hamburger',
      }]);
    }
    this.template(elements);
    this.setOverflow();
    this.setOverflow(); // TODO: unhack
  }
}

IoOptionMenus.Register();
