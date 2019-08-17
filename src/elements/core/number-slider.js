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
        flex: 0 0 4.5em;
        margin-right: var(--io-spacing);
      }
      :host > io-slider {
        flex: 1 1 4.5em;
        min-width: 4.5em;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1,
    };
  }
  _onValueSet(event) {
    this.value = event.detail.value;
    this.dispatchEvent('value-set', event.detail, false);
  }
  changed() {
    this.template([
      ['io-number', {
        id: 'number',
        value: this.value,
        step: this.step,
        min: this.min,
        max: this.max,
        label: this.label,
        title: this.title,
        ladder: true,
        'on-value-set': this._onValueSet,
      }],
      ['io-slider', {
        id: 'slider',
        value: this.value,
        step: this.step,
        min: this.min,
        max: this.max,
        label: this.label,
        title: this.title,
        'on-value-set': this._onValueSet,
      }]
    ]);
  }
}

IoNumberSlider.Register();
