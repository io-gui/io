import {html, IoElement} from "../io-core.js";

export class IoSelectable extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
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
        max-width: 12em;
      }
      :host > .io-hamburger {
        display: none;
        flex: 0 0 auto;

        padding: calc(var(--io-theme-padding) * 8) calc(var(--io-theme-padding) * 2);
        margin: calc(var(--io-theme-spacing) * 2) calc(var(--io-theme-spacing) * -1) 0 var(--io-theme-spacing) !important;
        border-top-right-radius: 0;
        border-top-bottom-radius: 0;
        border-right-width: 0;
        background-image: linear-gradient(270deg, rgba(0, 0, 0, 0.125), transparent 0.75em);
      }
      :host > .io-overflow-buttons {
        display: none;
      }
      :host[overflow] > .io-buttons {
        height: 0px;
        visibility: hidden;
      }
      :host[overflow] > .io-overflow-buttons {
        height: auto;
        visibility: visible;
        display: flex;
        align-items: flex-start;
      }
      :host[overflow] > .io-overflow-buttons > .io-hamburger {
        margin-left: var(--io-theme-spacing);
        margin-top: var(--io-theme-spacing);
        letter-spacing: 0.145em;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 0;
      }
      @media only screen and (max-width: 36em) {
        :host[vertical] {
          align-items: flex-start;
        }
        :host[vertical] > .io-buttons {
          display: none;
        }
        :host[vertical] > .io-content {
          margin: var(--io-theme-spacing);
        }
        :host[vertical] > .io-hamburger {
          display: block;
        }
      }
      :host > .io-content {
        flex: 1 1 auto;
        align-self: stretch;
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        background: var(--io-theme-content-bg);
        overflow: auto;
      }
      :host > .io-content > *{
        margin: var(--io-theme-spacing);
      }
      :host > .io-buttons > io-button {
        margin-left: var(--io-theme-spacing);
        margin-top: var(--io-theme-spacing);
        letter-spacing: 0.145em;
        border-radius: 3px 3px 0 0;
        font-weight: 500;
      }
      :host:not([vertical]) > .io-buttons > io-button {
        overflow: hidden;
        text-overflow: clip;
      }
      :host[vertical] > .io-buttons > io-button {
        border-radius: 3px 0 0 3px;
      }
      :host:not([vertical]) > .io-buttons > io-button.io-selected {
        overflow: visible;
        text-overflow: clip;
      }
      :host > .io-buttons > io-button.io-selected {
        background: var(--io-theme-content-bg);
        font-weight: 600;
        letter-spacing: 0.11em;
      }
      :host > .io-overflow-buttons > io-option.io-hamburger,
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
      overflow: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  select(id) {
    this.selected = id;
  }
  resized() {
    const rect = this.getBoundingClientRect();
    const rectButtons = this.$.buttons.getBoundingClientRect();
    this.overflow = !this.vertical && rect.width <= rectButtons.width;
  }
  changed() {
    const buttons = [];
    const options = [];
    for (let i = 0; i < this.elements.length; i++) {
      const props = this.elements[i][1] || {};
      const label = props.label || props.title || props.name || this.elements[i][0] + '[' + i + ']';
      buttons.push(['io-button', {
        label: label,
        value: i,
        action: this.select,
        className: this.selected === i ? 'io-selected' : ''
      }]);
      options.push({
        value: i,
        label: label,
      });
    }
    const hamburger = ['io-option', {className: 'io-hamburger', hamburger: true, value: this.bind('selected'), options: options}];

    this.template([
      hamburger,
      ['div', {id: 'buttons', className: 'io-buttons'}, buttons],
      ['div', {id: 'overflow-buttons', className: 'io-buttons io-overflow-buttons'}, [hamburger, buttons[this.selected]]],
      ['div', {className: 'io-content'}, [this.elements[this.selected]]],
    ]);
  }
}

IoSelectable.Register();
