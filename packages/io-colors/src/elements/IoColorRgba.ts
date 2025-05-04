import { Register, Node } from 'io-gui';
import { ioNumber } from 'io-inputs';
import { IoColorBase } from './IoColorBase';
import { ioColorPicker } from './IoColorPicker';

/**
 * Input element for color displayed as vector and an interactive picker.
 **/
@Register
export class IoColorRgba extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 0 1 auto;
        min-width: var(--io_fieldHeight5);
        width: var(--io_fieldHeight10);
      }
      :host > io-number {
        flex: 1 0 0;
      }
      :host > io-number#r {
        border-bottom-color: var(--io_bgColorRed);
      }
      :host > io-number#g {
        border-bottom-color: var(--io_bgColorGreen);
      }
      :host > io-number#b {
        border-bottom-color: var(--io_bgColorBlue);
      }
      :host > io-number#a {
        border-bottom-color: var(--io_color);
      }
      :host > io-color-picker {
        flex-shrink: 0;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
    `;
  }

  _onNumberValueInput(event: CustomEvent) {
    const item = event.composedPath()[0] as HTMLElement;
    const id = item.id as keyof typeof this.value;
    const newValue = event.detail.value;
    const oldValue = event.detail.oldValue;
    const value = this.value as any;
    value[id] = newValue;

    if (!(this.value as unknown as Node)._isNode) {
      // TODO: add oldValue/value
      const detail = {object: this.value, property: id, value: value, oldValue: oldValue};
      this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
    }
  }

  changed() {
    this.template([
      // Consider removing global id collisions.
      ioNumber({id: 'r', value: this.value.r, min: 0, max: 1, step: 0.001, ladder: true, '@value-input': this._onNumberValueInput}),
      ioNumber({id: 'g', value: this.value.g, min: 0, max: 1, step: 0.001, ladder: true, '@value-input': this._onNumberValueInput}),
      ioNumber({id: 'b', value: this.value.b, min: 0, max: 1, step: 0.001, ladder: true, '@value-input': this._onNumberValueInput}),
      this.value.a !== undefined
        ? ioNumber({id: 'a', value: this.value.a, min: 0, max: 1, step: 0.0001, ladder: true, '@value-input': this._onNumberValueInput})
        : null,
      ioColorPicker({id: 'swatch', value: this.value}),
    ]);
  }
}
export const ioColorRgba = IoColorRgba.vConstructor;
