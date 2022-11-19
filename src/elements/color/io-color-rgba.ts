import { RegisterIoElement } from '../../core/element.js';
import { IoColorBase } from './io-color-base.js';

@RegisterIoElement
export class IoColorRgba extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: row;
        flex: 0 1;
        flex-basis: calc(var(--io-field-height) * 10);
      }
      :host > io-number {
        flex-grow: 1;
      }
      :host > io-color-picker {
        flex-shrink: 0;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io-spacing);
      }
    `;
  }

  _onValueInput(event: CustomEvent) {
    const item = event.composedPath()[0];
    const c = (item as any).id as keyof typeof this.value;
    const value = event.detail.value;
    const oldValue = event.detail.oldValue;
    this.value[c] = value;
    const detail = {object: this.value, property: c, value: value, oldValue: oldValue};
    this.dispatchEvent('object-mutated', detail, false, window);
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, false);
  }

  changed() {
    this.template([
      ['io-number', {id: 'r', value: this.value.r, min: 0, max: 1, step: 0.0001, ladder: true, 'on-value-input': this._onValueInput}],
      ['io-number', {id: 'g', value: this.value.g, min: 0, max: 1, step: 0.0001, ladder: true, 'on-value-input': this._onValueInput}],
      ['io-number', {id: 'b', value: this.value.b, min: 0, max: 1, step: 0.0001, ladder: true, 'on-value-input': this._onValueInput}],
      this.value.a !== undefined ? ['io-number', {id: 'a', value: this.value.a, min: 0, max: 1, step: 0.0001, ladder: true, 'on-value-input': this._onValueInput}] : null,
      ['io-color-picker', {id: 'swatch', value: this.value}],
    ]);
  }
}
