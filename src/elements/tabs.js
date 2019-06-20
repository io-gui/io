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
      :host[overflow="0"] > :nth-child(n+2) { display: none; }
      :host[overflow="1"] > :nth-child(n+3) { display: none; }
      :host[overflow="2"] > :nth-child(n+4) { display: none; }
      :host[overflow="3"] > :nth-child(n+5) { display: none; }
      :host[overflow="4"] > :nth-child(n+6) { display: none; }
      :host[overflow="5"] > :nth-child(n+7) { display: none; }
      :host[overflow="6"] > :nth-child(n+8) { display: none; }
      :host[overflow="7"] > :nth-child(n+9) { display: none; }
      :host[overflow="8"] > :nth-child(n+10) { display: none; }
      :host[overflow="9"] > :nth-child(n+11) { display: none; }
      :host[overflow="10"] > :nth-child(n+12) { display: none; }
      :host[overflow="11"] > :nth-child(n+13) { display: none; }
      :host[overflow="12"] > :nth-child(n+14) { display: none; }
      :host > :nth-child(1) {
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
        display: none;
        line-height: 1.3em;
        background: none !important;
        border: none;
        margin-right: 0;
      }
      :host:not([overflow="Infinity"]) > io-option {
        display: inline-block;
      }
    </style>`;
  }
  static get properties() {
    return {
      selected: String,
      options: Array,
      overflow: {
        value: Infinity,
        type: Number,
        reflect: true,
      },
      role: 'navigation',
      _rights: Array,
    };
  }
  _onSelect(id) {
    this.set('selected', id);
  }
  _onValueSet(event) {
    this.set('selected', event.detail.value);
  }
  resized() {
    this.__properties['overflow'].value = Math.min(this.children.length);
    this._rights.length = this.children.length;
    for (let i = 0; i < this.children.length; i++) {
      this._rights[i] = this.children[i].getBoundingClientRect().right || this._rights[i];
    }
    const right = this.getBoundingClientRect().right;
    let last = 0;
    let overflow = 0;
    while (last <= (this._rights.length - 1) && (this._rights[last] < right || this._rights[last] === undefined)) {
      overflow = last;
      last++;
    }
    this.overflow = overflow === (this._rights.length - 1) ? Infinity : overflow;
  }
  changed() {
    const options = this.options;
    const elements = [['io-option', {
      label: '☰',
      title: 'select tab',
      value: this.selected,
      options: options,
      'on-value-set': this._onValueSet,
    }]];
    for (let i = 0; i < options.length; i++) {
      const selected = this.selected === options[i] || this.selected === options[i].value;
      const button = ['io-button', {
        label: options[i].label || options[i],
        value: options[i].value || options[i],
        action: this._onSelect,
        className: (selected ? 'io-selected-tab' : '') + ' io-tab',
      }];
      elements.push(button);
    }
    this.template(elements);
  }
}

IoTabs.Register();
