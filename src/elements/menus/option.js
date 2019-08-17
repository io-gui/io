import {html} from "../../io.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuItem} from "./menu-item.js";

export class IoMenuOption extends IoMenuItem {
  static get Style() {
    return html`<style>
      :host {
        text-align: center;
        border-radius: var(--io-border-radius);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        padding-left: calc(2 * var(--io-spacing));
        padding-right: calc(2 * var(--io-spacing));
      }
      :host {
        text-align: left;
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
      _depth: 100,
    };
  }
  get _options() {
    if (this.options && this.options.length) {
      return this.options;
    }
    return undefined;
  }
  _onMenuItemClicked(event) {
    const item = event.composedPath()[0];
    if (item !== this) {
      event.stopImmediatePropagation();
      this.set('value', event.detail.value);
      // this.dispatchEvent('io-menu-item-clicked', event.detail, true);
      item.expanded = false;
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
    valueText = this.label || (valueText || String(this.value)) + ' ▾';
    this.textNode = valueText;
    this.title = valueText;
    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

IoMenuOption.Register();
