import {html, IoElement} from "../core/element.js";

export class IoSidebar extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
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
      :host[overflow] > :nth-child(n+2):not(.io-selected-tab) {
        display: none;
      }
      :host:not([overflow]) > :nth-child(1) {
        display: none;
      }
      :host > io-button.io-selected-tab {
        border-bottom-color: var(--io-background-color);
        border-bottom-style: solid;
        background: var(--io-background-color);
        color: var(--io-link-color);
        margin-bottom: -1px;
        background-image: none;
      }
      :host > io-option {
        background: none !important;
        border: none;
        padding-left: calc(3 * var(--io-padding));
        padding-right: calc(3 * var(--io-padding));
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      selected: String,
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
  changed() {
    const options = this.options.length ? this.options : this.elements.map(element => { return element[1].name; });
    const elements = [['io-option', {
      label: '☰',
      title: 'select tab',
      value: this.selected,
      options: options,
      'on-value-set': this._onValueSet,
    }]];
    for (let i = 0; i < options.length; i++) {
      const selected = this.selected === options[i];
      const button = ['io-button', {
        label: options[i],
        value: options[i],
        action: this._onSelect,
        className: selected ? 'io-tab io-selected-tab' : 'io-tab',
      }];
      elements.push(button);
    }
    this.template(elements);
  }
}

IoSidebar.Register();
