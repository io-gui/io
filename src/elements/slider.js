import {html, IoElement} from "../core/element.js";
import {IoCanvas} from "./canvas.js";

export class IoSlider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        min-width: 12em;
      }
      :host > io-number {
        flex: 0 0 3.75em;
        margin-right: var(--io-spacing);
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
      max: 1,
      strict: true,
    };
  }
  _onValueSet(event) {
    this.dispatchEvent('value-set', event.detail, false);
    this.value = event.detail.value;
  }
  _onFocusTo(event) {
    const srcRect = event.target.getBoundingClientRect();
    this.focusTo(event.detail.direction, srcRect);
  }
  changed() {
    this.template([
      ['io-number', {value: this.value, step: this.step, min: this.min, max: this.max, strict: this.strict, label: this.label, title: this.title,
        id: 'number', 'on-value-set': this._onValueSet, 'on-focus-to': this._onFocusTo}],
      ['io-slider-knob', {value: this.value, step: this.step, minValue: this.min, maxValue: this.max, label: this.label, title: this.title,
        id: 'slider', 'on-value-set': this._onValueSet, 'on-focus-to': this._onFocusTo}]
    ]);
  }
}

IoSlider.Register();

export class IoSliderKnob extends IoCanvas {
  static get style() {
    return html`<style>
      :host {
        cursor: ew-resize;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
      }
      :host:focus {
        outline: none;
        border-color: var(--io-focus-color);
      }
      :host[aria-invalid] {
        border-color: var(--io-error-color);
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
      lineColor: [0.4, 0.4, 0.4, 1],
      bg: [0.2, 0.2, 0.2, 1],
      snapWidth: 1,
      slotWidth: 2,
      handleWidth: 4,
      role: 'slider',
      tabindex: 0,
    };
  }
  static get listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.focus();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
  }
  _onTouchmove(event) {
    event.preventDefault();
    this._moveSliderByPointer(event.changedTouches[0]);
  }
  _onTouchend(event) {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onMousedown(event) {
    event.preventDefault();
    this.focus();
    this.addEventListener('mousemove', this._onMousemove);
    this.addEventListener('mouseup', this._onMouseup);
  }
  _onMousemove(event) {
    this._moveSliderByPointer(event);
  }
  _onMouseup(event) {
    this.removeEventListener('mousemove', this._onMousemove);
    this.removeEventListener('mouseup', this._onMouseup);
  }
  _moveSliderByPointer(pointer) {
    const rect = this.getBoundingClientRect();
    const x = (pointer.clientX - rect.x) / rect.width;
    const pos = Math.max(0,Math.min(1, x));
    let value = this.minValue + (this.maxValue - this.minValue) * pos;
    value = Math.round(value / this.step) * this.step;
    value = Math.min(this.maxValue, Math.max(this.minValue, (value)));
    value = Number(value.toFixed(-Math.round(Math.log(this.step) / Math.LN10)));
    this.set('value', value);
  }
  _onKeydown(event) {
    if (event.which == 37) {
      event.preventDefault();
      if (event.shiftKey) this.focusTo('left');
      else this._moveSliderByKey('decrease');
    } else if (event.which == 38) {
      event.preventDefault();
      if (event.shiftKey) this.focusTo('up');
      else this._moveSliderByKey('decrease');
    } else if (event.which == 39) {
      event.preventDefault();
      if (event.shiftKey) this.focusTo('right');
      else this._moveSliderByKey('increase');
    } else if (event.which == 40) {
      event.preventDefault();
      if (event.shiftKey) this.focusTo('down');
      else this._moveSliderByKey('increase');
    } else if (event.which == 33) {
      event.preventDefault();
      this._moveSliderByKey('increase');
    } else if (event.which == 34) {
      event.preventDefault();
      this._moveSliderByKey('decrease');
    } else if (event.which == 36) {
      event.preventDefault();
      this._moveSliderByKey('min');
    } else if (event.which == 35) {
      event.preventDefault();
      this._moveSliderByKey('max');
    }
  }
  _moveSliderByKey(key) {
    let value = Math.round(this.value / this.step) * this.step;
    switch (key) {
      case 'increase':
        value += this.step;
        break;
      case 'decrease':
        value -= this.step;
        break;
      case 'min':
        value = this.minValue;
        break;
      case 'max':
        value = this.maxValue;
        break;
    };
    value = Math.min(this.maxValue, Math.max(this.minValue, (value)));
    value = Number(value.toFixed(-Math.round(Math.log(this.step) / Math.LN10)));
    this.set('value', value);
  }
  changed() {
    super.changed();
    this.setAttribute('aria-invalid', typeof this.value !== 'number' || isNaN(this.value));
    this.setAttribute('aria-valuenow', this.value);
    this.setAttribute('aria-valuemin', this.minValue);
    this.setAttribute('aria-valuemax', this.maxValue);
    this.setAttribute('aria-valuestep', this.step);
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
