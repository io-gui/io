import {html, IoElement} from "../io.js";
import "./button.js";

export class IoBreadcrumbs extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        align-self: stretch;
        justify-self: stretch;
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        padding: var(--io-spacing);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
        padding: var(--io-spacing);
      }
      :host > io-button {
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        background: none;
        padding: 0 var(--io-spacing);
      }
      :host > io-button:hover {
        text-decoration: underline;
      }
      :host > io-button:first-of-type {
        color: var(--io-color);
        overflow: visible;
        text-overflow: clip;
        margin-left: var(--io-spacing);
      }
      :host > io-button:last-of-type {
        overflow: visible;
        text-overflow: clip;
        margin-right: var(--io-spacing);
      }
      :host > io-button:not(:first-of-type):before {
        content: '>';
        margin: 0 var(--io-spacing);
        padding: 0 var(--io-spacing) 0 0;
        opacity: 0.25;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: null,
      options: Array,
      trim: Boolean,
    };
  }
  _onClick(option) {
    this.set('value', option.value);
    if (this.trim) {
      this.options.length = option.index + 1;
      this.dispatchEvent('object-mutated', {object: this.options}, false, window);
    }
  }
  changed() {
    const options = this.options.map(option => {
      return (option.label !== undefined || option.value !== undefined) ? option : {value: option};
    });
    this.template([options.map((option, index) => ['io-button', {
      action: this._onClick,
      value: {index: index, value: option.value},
      label: option.label || option.value
    }])]);
  }
}

IoBreadcrumbs.Register();
