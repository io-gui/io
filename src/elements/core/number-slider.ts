import {IoElement, RegisterIoElement} from '../../components/io-element.js';
import './slider.js';

/*
 * Extends `IoElement`. Implements `IoNumber` and `IoSlider`.
 *
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 *
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.01, "conversion": 1, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.1, "conversion": 0.2, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/

export class IoNumberSlider extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
    }
    :host > io-number {
      flex: 0 0 calc(2 * var(--io-item-height));
      margin-right: var(--io-spacing);
    }
    :host > io-slider {
      flex: 1 1 calc(2 * var(--io-item-height));
      min-width: calc(2 * var(--io-item-height));
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
    this.dispatchEvent('value-set', event.detail, false);
  }
  _onSliderSet(event: CustomEvent) {
    event.detail.value = event.detail.value / this.conversion;
    this.value = event.detail.value;
    this.dispatchEvent('value-set', event.detail, false);
  }
  changed() {
    this.template([
      ['io-number', {
        id: 'number',
        value: this.value,
        step: this.step,
        conversion: this.conversion,
        label: this.label,
        'on-value-set': this._onNumberSet,
      }],
      ['io-slider', {
        id: 'slider',
        value: this.value * this.conversion,
        step: this.step * this.conversion,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        exponent: this.exponent,
        label: this.label,
        'on-value-set': this._onSliderSet,
      }]
    ]);
  }
}

RegisterIoElement(IoNumberSlider);
