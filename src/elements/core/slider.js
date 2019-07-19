import {html, IoElement, IoGl} from "../../io.js";

export class IoSlider extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        align-self: stretch;
        justify-self: stretch;
      }
      :host > io-number {
        flex: 0 0 auto;
        margin-right: var(--io-spacing);
      }
      :host > io-slider-knob {
        flex: 1 1 4.5em;
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
        'on-value-set': this._onValueSet,
      }],
      ['io-slider-knob', {
        id: 'slider',
        value: this.value,
        step: this.step,
        minValue: this.min,
        maxValue: this.max,
        label: this.label,
        title: this.title,
        'on-value-set': this._onValueSet,
      }]
    ]);
  }
}

export class IoSliderKnob extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        cursor: ew-resize;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
        min-height: 1.2em;
        align-self: stretch;
        justify-self: stretch
      }
      :host[aria-invalid] {
        outline: 1px solid var(--io-color-focus);
      }
      :host:focus {
        outline: 1px solid var(--io-color-focus);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      value: 0,
      step: 0.01,
      minValue: 0,
      maxValue: 1000,
    };
  }
  static get Listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  _onTouchstart(event) {
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._onPointerdown(event);
  }
  _onTouchmove(event) {
    this._onPointermove(event);
  }
  _onTouchend() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onMousedown(event) {
    event.preventDefault();
    this.focus();
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    this._onPointerdown(event);
  }
  _onMousemove(event) {
    this._onPointermove(event);
  }
  _onMouseup() {
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  _onPointerdown(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    this._x = pointer.clientX;
    this._y = pointer.clientY;
    this._active = -1;
  }
  _onPointermove(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;

    const dx = Math.abs(this._x - pointer.clientX);
    const dy = Math.abs(this._y - pointer.clientY);

    if (this._active === -1 && dx > 5) {
      this._active = (dx > dy && dy < 20) ? 1 : 0;
    }

    if (this._active !== 1) return;
    if (!event.cancelable) return;

    event.preventDefault();
    this.focus();

    const rect = this.getBoundingClientRect();
    const x = (pointer.clientX - rect.x) / rect.width;
    const pos = Math.max(0,Math.min(1, x));
    let value = (this.maxValue - this.minValue) * pos;
    value = this.minValue + Math.round(value / this.step) * this.step;
    value = Math.min(this.maxValue, Math.max(this.minValue, (value)));
    let d = -Math.round(Math.log(this.step) / Math.LN10);
    d = Math.max(0, Math.min(100, d));
    value = Number(value.toFixed(d));
    this.set('value', value);
  }
  _onKeydown(event) {
    if (event.which == 37) {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('left');
      else this._moveSliderByKey('decrease');
    } else if (event.which == 38) {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('up');
      else this._moveSliderByKey('decrease');
    } else if (event.which == 39) {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('right');
      else this._moveSliderByKey('increase');
    } else if (event.which == 40) {
      event.preventDefault();
      if (!event.shiftKey) this.focusTo('down');
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
    let value = this.value;
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
    }
    value = Math.min(this.maxValue, Math.max(this.minValue, (value)));
    let d = -Math.round(Math.log(this.step) / Math.LN10);
    d = Math.max(0, Math.min(100, d));
    value = Number(value.toFixed(d));
    this.set('value', value);
  }
  changed() {
    super.changed();
    this.setAttribute('aria-invalid', isNaN(this.value) ? 'true' : false);
    this.setAttribute('aria-valuenow', isNaN(this.value) ? 0 : this.value);
    this.setAttribute('aria-valuemin', this.minValue);
    this.setAttribute('aria-valuemax', this.maxValue);
    // this.setAttribute('aria-valuestep', this.step);
  }
  // TODO: implement proper sdf shapes.
  static get Frag() {
    return `
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {

      vec4 finalColor = gBackground;

      float _range = uMaxValue - uMinValue;
      float _progress = (uValue - uMinValue) / _range;
      float _value = mix(uMinValue, uMaxValue, vUv.x);
      float _stepRange = uSize.x / (_range / uStep);

      if (_stepRange > gLineWidth * 2.0) {
        float res = _value / uStep;
        float line = abs(fract(res - 0.5) - 0.5) / abs(dFdx(res)) / gLineWidth;
        if (line < 0.999) line = 0.0;
        finalColor = mix(finalColor, gColor, 1.0 - min(line, 1.0));
      }

      float slot = (abs(0.5 - vUv.y)) * uSize.y;
      slot = (1.0 - slot) + gLineWidth * 2.0;
      slot = clamp(slot, 0.0, 1.0);
      vec4 slotColor = mix(gColorFocus, gColorLink, vUv.x);
      float progress = (vUv.x - _progress) * uSize.x;
      progress = clamp(progress, 0.0, 1.0);
      slotColor = mix(slotColor, mix(gColor, gBackground, 0.5), progress);

      float handle = abs(vUv.x - _progress) * uSize.x;
      handle = (1.0 - handle) + gLineWidth * 2.0;
      handle = clamp(handle, 0.0, 1.0);

      finalColor = mix(finalColor, slotColor, slot);
      finalColor = mix(finalColor, mix(gColorFocus, gColorLink, _progress), handle);
      gl_FragColor = finalColor;
    }`;
  }
}

IoSliderKnob.Register();
IoSlider.Register();
