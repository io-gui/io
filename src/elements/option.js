import {html} from "../core/element.js";
import {IoMenuItem} from "./menu-item.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoOption extends IoMenuItem {
  static get Style() {
    return html`<style>
      :host {
        white-space: pre;
        display: inline-block;
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-border-radius);
        padding: var(--io-spacing);
        transition: background-color 0.4s;
        height: 1.375em;
      }
      :host:not([label])::after {
        content: '▾';
        padding-left: calc(3 * var(--io-spacing));
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'button',
    };
  }
  static get Properties() {
    return {
      options: Array,
    };
  }
  get _options() {
    if (this.options && this.options.length) {
      return this.options;
    }
    return undefined;
  }
  _onMenuItemClicked(event) {
    // TODO: fires twice
    const item = event.composedPath()[0];
    if (item !== this) {
      event.stopImmediatePropagation();
      this.expanded = false;
      this.set('value', event.detail.value, true);
      this.dispatchEvent('io-menu-item-clicked', event.detail, true);
    }
  }
  _onClick(event) {
    // TODO: dead code?
    IoMenuLayer.singleton._x = event.clientX;
    IoMenuLayer.singleton._y = event.clientY;
    this._toggleExpanded(true);
  }
  _onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      this._toggleExpanded(true);
      this._focusIn();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus = null;
      this.expanded = false;
      this.focusTo('left');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus = null;
      this.expanded = false;
      this.focusTo('up');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus = null;
      this.expanded = false;
      this.focusTo('right');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      IoMenuLayer.singleton.LastFocus = null;
      if (this.expanded) {
        this._focusIn();
      } else {
        this.focusTo('down');
      }
    }
  }
  changed() {
    let valueText;
    if (this.options) {
      const option = this.options.find(option => {return option.value === this.value;});
      if (option) {
        if (option.label) {
          valueText = option.label;
        } else if (typeof option.value === 'object') {
          valueText = `${option.value.constructor.name}` + (option.value instanceof Array ? `(${option.value.length})` : '');
        } else {
          valueText = String(option.value);
        }
      }
    }
    valueText = this.label || valueText || String(this.value);
    if (this._textNode.nodeValue !== valueText) {
      this._textNode.nodeValue = valueText;
    }
    this.title = valueText;
    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

IoOption.Register();
