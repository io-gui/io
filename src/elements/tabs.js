import {html, IoElement} from "../core/element.js";

export class IoTabs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
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
      overflow: {
        type: Boolean,
        reflect: true,
      },
      role: 'navigation',
      _overflowWidth: 0,
    };
  }
  _onSelect(id) {
    this.set('selected', id);
  }
  _onValueSet(event) {
    this.set('selected', event.detail.value);
  }
  resized() {
    if (!this.overflow) {
      this._overflowWidth = this.children[this.children.length - 1].getBoundingClientRect().right;
    }
    this.overflow = this.getBoundingClientRect().right < this._overflowWidth;
  }
  changed() {
    const options = [];
    const elements = [['io-option', {
      label: '☰',
      title: 'select tab',
      value: this.selected,
      options: options,
      'on-value-set': this._onValueSet,
    }]];
    for (let i = 0; i < this.elements.length; i++) {
      options.push(this.elements[i][1].name);
      const selected = this.selected === this.elements[i][1].name;
      const button = ['io-button', {
        label: this.elements[i][1].name,
        value: this.elements[i][1].name,
        action: this._onSelect,
        className: selected ? 'io-tab io-selected-tab' : 'io-tab',
      }];
      elements.push(button);
    }
    this.template(elements);
  }
}

IoTabs.Register();
