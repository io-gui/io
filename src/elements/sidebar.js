import {html, IoElement} from "../core/element.js";
import {filterObject, validateOptionObject} from "../utils/utility-functions.js";

export class IoSidebar extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-wrap: nowrap;
        overflow: auto;
        flex: 0 0 auto;
        line-height: 1.5em;
        padding: 0 var(--io-spacing);
      }
      :host[overflow] {
        font-size: 1.2em;
      }
      :host:not([overflow]) {
        -webkit-overflow-scrolling: touch;
        flex-direction: column;
      }
      :host io-collapsable,
      :host io-boolean,
      :host .io-content,
      :host io-button {
        flex: 0 0 auto;
        margin: 0;
        padding: var(--io-spacing);
        border: none;
        background: none;
      }
      :host:not([overflow]) io-collapsable > io-button {
        padding-left: 0.5em;
        padding-right: 0.5em;
      }
      :host .io-content {
        display: flex;
        flex-direction: column;
        padding-left: 1em;
      }
      :host io-button.io-selected-tab {
        color: var(--io-color-link);
        text-decoration: underline;
      }
      :host > span {
        color: var(--io-color);
        display: inline-block;
        cursor: default;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: var(--io-spacing);
        padding-left: calc(3 * var(--io-spacing));
        padding-right: calc(3 * var(--io-spacing));
      }
      :host > io-option {
        background: none !important;
        border: none;
        padding-left: calc(3 * var(--io-spacing));
        padding-right: calc(3 * var(--io-spacing));
      }
    </style>`;
  }
  static get properties() {
    return {
      selected: String,
      label: String,
      options: Array,
      overflow: {
        type: Boolean,
        reflect: true,
      },
      role: 'navigation',
    };
  }
  _onSelect(id) {
    this.set('selected', id);
  }
  _onValueSet(event) {
    this.set('selected', event.detail.value);
  }
  _addOptions(options) {
    const elements = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].options) {
        elements.push(['io-collapsable', {
          label: options[i].label,
          expanded: true,
          elements: [...this._addOptions(options[i].options)]
        }]);
      } else {
        const selected = this.selected && (this.selected === options[i] || this.selected === options[i].value);
        elements.push(['io-button', {
          label: options[i].label || options[i].value || options[i],
          value: options[i].value || options[i],
          action: this._onSelect,
          class: (selected ? 'io-selected-tab' : '') + ' io-tab',
        }]);
      }
    }
    return elements;
  }
  changed() {
    const options = this.options.map(validateOptionObject);
    let selectedOption = filterObject(options, option => { return option.value === this.selected; });
    if (this.overflow) {
      const label = selectedOption ? (selectedOption.label || String(selectedOption.value)) : String(this.selected).split('#')[0];
      this.template([['io-option', {
        label: '☰ ' + label,
        title: 'select tab',
        value: this.selected,
        options: this.options,
        'on-value-set': this._onValueSet,
      }]]);
    } else {
      this.template([...this._addOptions(this.options)]);
    }
  }
}

IoSidebar.Register();
