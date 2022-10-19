import { IoElement, RegisterIoElement } from '../../core/element.js';
import './slider.js';

@RegisterIoElement
export class IoNumberSlider extends IoElement {
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
      margin-right: var(--io-spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `;
  }
  static get Properties(): any {
    return {
      value: 0,
      step: 0.01,
      conversion: 1,
      min: 0,
      max: 1,
      exponent: 1,
    };
  }
  _onNumberSet(event: CustomEvent) {
    this.value = event.detail.value;
    this.dispatchEvent('value-input', event.detail, false);
  }
  _onSliderSet(event: CustomEvent) {
    event.detail.value = event.detail.value / this.conversion;
    this.value = event.detail.value;
    this.dispatchEvent('value-input', event.detail, false);
  }
  init() {
    this.changed();
  }
  changed() {
    this.template([
      ['io-number', {
        id: 'number',
        value: this.value,
        step: this.step,
        conversion: this.conversion,
        label: this.label,
        'on-value-input': this._onNumberSet,
      }],
      ['io-slider', {
        id: 'slider',
        value: this.value * this.conversion,
        step: this.step * this.conversion,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        exponent: this.exponent,
        label: this.label,
        'on-value-input': this._onSliderSet,
      }]
    ]);
  }
}
