import { IoElement, RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import '../basic/number.js';
import './slider.js';

@RegisterIoElement
export class IoNumberSlider extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
      flex-basis: var(--io-field-height);
      flex-grow: 1;
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

  @IoProperty({value: 0})
  declare value: number;

  @IoProperty(0.01)
  declare step: number;

  @IoProperty(0)
  declare min: number;

  @IoProperty(1)
  declare max: number;

  @IoProperty(1)
  declare exponent: number;

  @IoProperty(1)
  declare conversion: number;

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
