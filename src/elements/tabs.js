import {html, IoElement} from "../core/element.js";
import {filterObject} from "../utils/utility-functions.js";
import {IoMenuLayer} from "./menu-layer.js";
import "./menu-item.js";

export class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        align-self: stretch;
        flex-wrap: nowrap;
        flex: 0 0 auto;
        background-color: var(--io-background-color);
      }
      :host > * {
        font-size: 1.2em;
        flex: 0 0 auto;
        border-bottom: var(--io-border-width) solid transparent;
        padding: calc(2 * var(--io-spacing));
      }
      :host > .io-selected-tab {
        border-bottom-color: var(--io-color-link);
        color: var(--io-color-link);
      }
      :host > io-option {
        line-height: 1.1em;
        border: none;
        border-radius: 0;
        margin-left: auto;
        background: none;
        padding: calc(2 * var(--io-spacing)) calc(4 * var(--io-spacing));
      }
      :host > .io-hidden {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: undefined,
      options: Array,
      overflow: {
        type: Boolean,
        reflect: true,
      },
      role: 'navigation',
      _rects: Array,
    };
  }
  static get listeners() {
    return {
      'io-menu-item-clicked': '_onMenuItemClicked',
    };
  }
  _onMenuItemClicked(event) {
    event.stopPropagation();
    this.set('value', event.detail.value);
    IoMenuLayer.singleton.collapseAll();
  }
  _onValueSet(event) {
    this.set('value', event.detail.value);
  }
  resized() {
    this.setOverflow();
  }
  setOverflow() {
    const buttons = this.querySelectorAll('io-menu-item');
    const hamburger = this.querySelector('io-option');
    this._rects.length = buttons.length;

    if (!this._rects.length) return;
    if (!buttons.length) return;

    const selectedIndex = this.options.indexOf(filterObject(this.options, (option) => {
      return option === this.value || option.value === this.value;
    }));

    let end = this.getBoundingClientRect().right;
    let overflow = false;
    let last = Infinity;
    hamburger.className = 'io-hidden';

    for (let i = buttons.length; i--;) {
      const rect = buttons[i].getBoundingClientRect();
      this._rects[i] = this._rects[i] || {};
      this._rects[i].right = rect.right || this._rects[i].right;
      this._rects[i].width = rect.width || this._rects[i].width;

      if (hamburger.className && overflow) {
        hamburger.className = '';
        end -= 1.5 * hamburger.getBoundingClientRect().width;
      }

      if (i === selectedIndex) {
        end -= this._rects[i].width;
        continue;
      }

      last = Math.min(last, this._rects[i].right);

      if (last < end) {
        buttons[i].className = '';
      } else {
        buttons[i].className = 'io-hidden';
        overflow = true;
      }
    }
    this.overflow = overflow;
  }
  valueChanged() {
    this.setOverflow();
  }
  changed() {
    const options = this.options;
    let option = filterObject(options, (option) => {
      return option === this.value || option.value === this.value;
    });
    const elements = [];
    for (let i = 0; i < options.length; i++) {
      const selected = this.value && option === options[i];
      const button = ['io-menu-item', {
        label: options[i].label || options[i].value || options[i],
        value: options[i].value || options[i],
        class: (selected ? 'io-selected-tab' : ''),
      }];
      elements.push(button);
    }
    elements.push(['io-option', {
      label: '☰',
      title: 'select tab',
      value: this.value,
      options: options,
      'on-value-set': this._onValueSet,
    }]);
    this.template(elements);
    this.setOverflow();
  }
}

IoTabs.Register();
