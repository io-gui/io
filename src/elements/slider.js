import {html, IoElement} from "../core/element.js";
import "./slider-knob.js";

export class IoSlider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
      }
      :host > io-number {
        flex: 0 0 auto;
        margin-right: 0.5em;
      }
      :host > io-slider-knob {
        flex: 1 1 auto;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1000,
      strict: true,
    };
  }
  changed() {
    const charLength = (Math.max(Math.max(String(this.min).length, String(this.max).length), String(this.step).length));
    this.template([
      ['io-number', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'number'}],
      ['io-slider-knob', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'slider'}]
    ]);
    this.$.number.style.setProperty('min-width', charLength + 'em');
  }
}

IoSlider.Register();
