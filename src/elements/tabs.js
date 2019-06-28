import {html, IoElement} from "../core/element.js";
import {filterObject} from "../utils/utility-functions.js";
import {Option} from "../types/option.js";
import {IoMenuLayer} from "./menu.js";

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
      selected: String,
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
    event.stopImmediatePropagation();
    if (event.detail.value) {
      this.set('selected', event.detail.value);
      IoMenuLayer.singleton.collapseAll();
    }
  }
  _onValueSet(event) {
    if (event.detail.value) {
      this.set('selected', event.detail.value);
    }
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

    // TODO: Detect selectedSubOption as selectedIndex!
    const selectedIndex = this.options.indexOf(filterObject(this.options, (option) => {
      return option === this.selected || option.value === this.selected;
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
      const selectedClass = buttons[i].className.search('io-selected-tab') !== -1;
      if (last < end) {
        buttons[i].className = selectedClass ? 'io-selected-tab' : '';
      } else {
        buttons[i].className = selectedClass ? 'io-selected-tab io-hidden' : 'io-hidden';
        overflow = true;
      }
    }
    this.overflow = overflow;
  }
  selectedChanged() {
    this.setOverflow();
  }
  changed() {
    const options = this.options.map(option => { return new Option(option); });
    let selectedOption = filterObject(options, option => { return option.value === this.selected; });
    const elements = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      let selectedSubOption = filterObject(option.options || [], option => { return option.value === this.selected; });
      const selected = this.selected && (selectedOption === option || selectedOption === selectedSubOption);
      const button = ['io-menu-item', {
        label: option.label,
        value: option.value,
        action: option.action,
        button: option.button,
        options: option.options || [],
        class: selected ? 'io-selected-tab' : '',
      }];
      elements.push(button);
    }
    elements.push(['io-option', {
      label: '☰',
      title: 'select tab',
      value: this.selected,
      options: options,
      'on-value-set': this._onValueSet,
    }]);
    this.template(elements);
    this.setOverflow();
  }
}

IoTabs.Register();
