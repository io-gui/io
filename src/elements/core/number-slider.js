import {html, IoElement} from "../../io.js";
import "./slider.js";

export class IoNumberSlider extends IoElement {
  static get Style() {
    return html`<style>
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
    </style>`;
  }
  static get Properties() {
    return {
      value: 0,
      step: 0.01,
      conversion: 1,
      min: 0,
      max: 1,
    };
  }
  _onNumberSet(event) {
    this.value = event.detail.value;
    this.dispatchEvent('value-set', event.detail, false);
  }
  _onSliderSet(event) {
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
        min: this.min,
        max: this.max,
        label: this.label,
        ladder: true,
        'on-value-set': this._onNumberSet,
      }],
      ['io-slider', {
        id: 'slider',
        value: this.value * this.conversion,
        step: this.step * this.conversion,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        label: this.label,
        'on-value-set': this._onSliderSet,
      }]
    ]);
  }
}

IoNumberSlider.Register();
