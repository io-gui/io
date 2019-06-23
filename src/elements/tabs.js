import {html, IoElement} from "../core/element.js";
import {filterObject} from "../utils/utility-functions.js";

export class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        align-self: stretch;
        flex-wrap: nowrap;
        overflow: visible;
        flex: 0 1 auto;
      }
      :host > * {
        flex: 0 0 auto;
        margin-right: var(--io-spacing);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
      }
      :host > .io-selected-tab {
        border-bottom-color: var(--io-background-color);
        border-bottom-style: solid;
        background: var(--io-background-color);
        color: var(--io-link-color);
        margin-bottom: -1px;
        background-image: none;
      }
      :host > io-option {
        line-height: 1.3em;
        background: none !important;
        border: none;
        margin-right: 0;
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
  _onSelect(id) {
    this.set('selected', id);
  }
  _onValueSet(event) {
    this.set('selected', event.detail.value);
  }
  resized() {
    this.setOverflow();
  }
  setOverflow() {
    const buttons = this.querySelectorAll('io-button');
    const hamburger = this.querySelector('io-option');
    this._rects.length = buttons.length;

    if (!this._rects.length) return;
    if (!buttons.length) return;

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
        end -= hamburger.getBoundingClientRect().width;
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
  selectedChanged() {
    this.setOverflow();
  }
  changed() {
    const options = this.options;
    let option = filterObject(options, (option) => {
      return option === this.selected || option.value === this.selected;
    });
    const elements = [];
    for (let i = 0; i < options.length; i++) {
      const selected = this.selected && option === options[i];
      const button = ['io-button', {
        label: options[i].label || options[i].value || options[i],
        value: options[i].value || options[i],
        action: this._onSelect,
        class: (selected ? 'io-selected-tab' : ''),
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
  }
}

IoTabs.Register();
