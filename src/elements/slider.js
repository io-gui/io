import {html, IoElement} from "../io-core.js";
import {IoCanvas} from "./canvas.js";

export class IoSlider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        min-width: 12em;
      }
      :host > io-number {
        flex: 0 0 auto;
      }
      :host > io-slider-knob {
        flex: 1 1 auto;
        margin-left: var(--io-theme-spacing);
        border-radius: 2px;
        border: 0;
        /* margin: 0.1em; */
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1,
      strict: true,
    };
  }
  _onValueSet(event) {
    this.dispatchEvent('value-set', event.detail, false);
    this.value = event.detail.value;
  }
  changed() {
    const charLength = (Math.max(Math.max(String(this.min).length, String(this.max).length), String(this.step).length));
    this.template([
      ['io-number', {value: this.value, step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'number', 'on-value-set': this._onValueSet}],
      ['io-slider-knob', {value: this.value, step: this.step, minValue: this.min, maxValue: this.max, id: 'slider', 'on-value-set': this._onValueSet}]
    ]);
    this.$.number.style.setProperty('min-width', charLength + 'em');
  }
}

IoSlider.Register();

export class IoSliderKnob extends IoCanvas {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        cursor: ew-resize;
        touch-action: none;
      }
      :host > img {
        pointer-events: none;
        touch-action: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.01,
      minValue: 0,
      maxValue: 1000,
      startColor: [0.3, 0.9, 1, 1],
      endColor: [0.9, 1, 0.5, 1],
      lineColor: [0.3, 0.3, 0.3, 1],
      bg: [0.5, 0.5, 0.5, 1],
      snapWidth: 2,
      slotWidth: 2,
      handleWidth: 4,
    };
  }
  static get listeners() {
    return {
      'pointerdown': 'onPointerdown',
      'pointermove': 'onPointermove',
      'dragstart': 'preventDefault',
    };
  }
  onPointerdown(event) {
    this.setPointerCapture(event.pointerId);
  }
  onPointermove(event) {
    this.setPointerCapture(event.pointerId);
    if (event.buttons !== 0) {
      event.preventDefault();
      const rect = this.getBoundingClientRect();
      const x = (event.clientX - rect.x) / rect.width;
      const pos = Math.max(0,Math.min(1, x));
      let value = this.minValue + (this.maxValue - this.minValue) * pos;
      value = Math.round(value / this.step) * this.step;
      value = Math.min(this.maxValue, Math.max(this.minValue, (value)));
      this.set('value', value);
    }
  }
  // TODO: implement proper sdf shapes.
  static get frag() {
    return `
    varying vec2 vUv;
    void main(void) {

      vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

      float _range = maxValue - minValue;
      float _progress = (value - minValue) / _range;
      float _value = mix(minValue, maxValue, vUv.x);
      float _stepRange = size.x / (_range / step);

      if (_stepRange > snapWidth * 4.0) {
        float pxValue = _value * size.x / _range;
        float pxStep = step * size.x / _range;
        float snap0 = mod(pxValue, pxStep);
        float snap1 = pxStep - mod(pxValue, pxStep);
        float snap = min(snap0, snap1) * 2.0;
        snap -= snapWidth;
        snap = 1.0 - clamp(snap, 0.0, 1.0);
        finalColor = mix(finalColor, lineColor, snap);
      }

      float slot = (abs(0.5 - vUv.y) * 2.0) * size.y;
      slot = (1.0 - slot) + slotWidth;
      slot = clamp(slot, 0.0, 1.0);
      vec4 slotColor = mix(startColor, endColor, vUv.x);

      float progress = (vUv.x - _progress) * size.x;
      progress = clamp(progress, 0.0, 1.0);
      slotColor = mix(slotColor, lineColor, progress);

      float handle = abs(vUv.x - _progress) * size.x;
      handle = (1.0 - handle) + handleWidth;
      handle = clamp(handle, 0.0, 1.0);

      finalColor = mix(finalColor, slotColor, slot);
      finalColor = mix(finalColor, mix(startColor, endColor, _progress), handle);

      gl_FragColor = finalColor;
    }`;
  }
}

IoSliderKnob.Register();
