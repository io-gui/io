import {html, IoElement} from "../../io.js";
import {IoColorMixin} from "./color.js";
import "./color-picker.js";

export class IoColorVector extends IoColorMixin(IoElement) {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        align-self: stretch;
        justify-self: stretch;
      }
      :host > io-number {
        width: inherit;
        flex: 1 1;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io-spacing);
      }
      :host > io-color-picker {
        width: calc(var(--io-line-height) + calc(2 * var(--io-spacing)));
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [0, 0, 0, 0],
      conversion: 1,
      step: 0.01,
      min: 0,
      max: 1,
    };
  }
  _onValueSet(event) {
    const item = event.composedPath()[0];
    const c = item.id;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    // TODO: test
    const detail = {object: this.value, property: this.linked ? null : c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
  }
  changed() {
    const elements = [];
    const components = Object.keys(this.value);
    for (let i in components) {
      const c = components[i];
      if (this.value[c] !== undefined) {
        elements.push(['io-number', {
          id: c,
          value: this.value[c],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          ladder: true,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    elements.push(this.getSlotted());
    this.template(elements);
  }
  getSlotted() {
    return ['io-color-picker', {id: 'swatch', mode: this.mode, value: this.value}];
  }
}

IoColorVector.Register();
