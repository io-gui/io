import { IoElement, RegisterIoElement } from '../../core/element.js';
import './slider.js';

@RegisterIoElement
export class IoNumberSliderRange extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
      flex-basis: 18em;
    }
    :host > io-number {
      flex: 0 0 3.25em;
    }
    :host > io-slider-range {
      margin-left: var(--io-spacing);
      margin-right: var(--io-spacing);
      flex: 1 1 3.25em;
      min-width: 3.25em;
    }
    `;
  }
  static get Properties(): any {
    return {
      value: {
        type: Array,
        value: [0, 0],
        observe: true,
      },
      step: 0.01,
      conversion: 1,
      min: 0,
      max: 1,
      exponent: 1,
    };
  }
  _onNumberSet(event: CustomEvent) {
    const item = event.composedPath()[0];
    if (item === this.$.number0) this.value[0] = event.detail.value;
    if (item === this.$.number1) this.value[1] = event.detail.value;
    event.detail.value = this.value;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-input', event.detail, false);
  }
  _onSliderSet(event: CustomEvent) {
    this.value = event.detail.value;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-input', event.detail, false);
  }
  init() {
    this.changed();
  }
  changed() {
    this.template([
      ['io-number', {
        id: 'number0',
        value: this.value[0],
        step: this.step,
        conversion: this.conversion,
        label: this.label,
        'on-value-input': this._onNumberSet,
      }],
      ['io-slider-range', {
        id: 'slider',
        value: this.value,
        step: this.step,
        min: this.min,
        max: this.max,
        exponent: this.exponent,
        label: this.label,
        'on-value-input': this._onSliderSet,
      }],
      ['io-number', {
        id: 'number1',
        value: this.value[1],
        step: this.step,
        conversion: this.conversion,
        label: this.label,
        'on-value-input': this._onNumberSet,
      }],
    ]);
  }
}
