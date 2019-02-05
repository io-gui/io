import {html, IoElement} from "../io-core.js";

export class IoSelectable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
      }
      :host[vertical] {
        flex-direction: row;
      }
      :host > .io-buttons {
        position: relative;
        display: flex;
        flex: 0 1 auto;
        flex-direction: row;
        margin: 0 0 -1px 0;
        padding: 0 0.25em 0 0.15em;
      }
      :host[vertical] > .io-buttons {
        flex-direction: column;
        margin: 0 -1px 0 0;
        padding: 0.15em 0 0.25em 0;
      }
      :host > .io-content {
        flex: 1 1 auto;
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        padding: var(--io-theme-padding);
        background: var(--io-theme-content-bg);
      }
      :host > .io-buttons > io-button {
        margin-left: var(--io-theme-spacing);
        margin-top: var(--io-theme-spacing);
        letter-spacing: 0.145em;
        border-radius: 3px 3px 0 0;
      }
      :host[vertical] > .io-buttons > io-button {
        border-radius: 3px 0 0 3px;
      }
      :host > .io-buttons > io-button.io-selected {
        background: #eee;
        font-weight: 500;
        letter-spacing: 0.09em;
      }
      :host > .io-buttons > io-button:not(.io-selected) {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host[vertical] > .io-buttons > io-button:not(.io-selected) {
        background-image: linear-gradient(270deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host > .io-buttons > io-button:not(.io-selected):hover {
        background-color: rgba(255, 255, 255, 0.5) !important;
      }
      :host:not([vertical]) > .io-buttons > io-button.io-selected {
        border-bottom-color: #eee;
      }
      :host[vertical] > .io-buttons > io-button.io-selected {
        border-right-color: #eee;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      selected: Number,
      vertical: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  select(id) {
    this.selected = id;
  }
  changed() {
    const buttons = [];
    for (let i = 0; i < this.elements.length; i++) {
      const props = this.elements[i][1] || {};
      const label = props.label || props.title || props.name || this.elements[i][0] + '[' + i + ']';
      buttons.push(['io-button', {
        label: label,
        value: i,
        action: this.select,
        className: this.selected === i ? 'io-selected' : ''
      }]);
    }
    this.template([
      ['div', {className: 'io-buttons'}, buttons],
      ['div', {className: 'io-content'}, [this.elements[this.selected]]],
    ]);
  }
}

IoSelectable.Register();
