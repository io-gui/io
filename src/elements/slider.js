import {html, IoElement} from "../core/element.js";
import "./slider-slider.js";

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
      :host > .slider {
        flex: 1 1 auto;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1000
    };
  }
  update() {
    const charLength = (Math.max(Math.max(String(this.min).length, String(this.max).length), String(this.step).length));
    this.render([
      ['io-number', {value: this.bind('value'), step: this.step, id: 'number'}],
      ['io-slider-slider', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, className: 'slider', id: 'slider'}]
    ]);
    this.$.number.style.setProperty('min-width', charLength + 'em');
  }
}

IoSlider.Register();
