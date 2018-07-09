import {html, IoElement} from "../core/element.js";
import {IoPointerMixin} from "../mixins/pointer.js";

export class IoSliderKnob extends IoPointerMixin(IoElement) {
  static get style() {
    return html`<style>
      :host {
        cursor: ew-resize;
        background-image: paint(slider);
        --slider-min: 0;
        --slider-max: 10;
        --slider-step: 0.5;
        --slider-value: 1;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1000,
      pointermode: 'absolute',
      cursor: 'ew-resize'
    };
  }
  static get listeners() {
    return {
      'io-pointer-move': '_onPointerMove'
    };
  }
  _onPointerMove(event) {
    event.detail.event.preventDefault();
    let rect = this.getBoundingClientRect();
    let x = (event.detail.pointer[0].position.x - rect.x) / rect.width;
    let pos = Math.max(0,Math.min(1, x));
    let value = this.min + (this.max - this.min) * pos;
    value = Math.round(value / this.step) * this.step;
    value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
    this.set('value', value);
  }
  update() {
    this.style.setProperty('--slider-min', this.min);
    this.style.setProperty('--slider-min', this.min);
    this.style.setProperty('--slider-max', this.max);
    this.style.setProperty('--slider-step', this.step);
    this.style.setProperty('--slider-value', typeof this.value === 'number' ? this.value : NaN);
  }
}

IoSliderKnob.Register();
