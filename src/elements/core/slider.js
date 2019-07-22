import {html, IoElement, IoGl, chunk} from "../../io.js";

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
        min: this.min,
        max: this.max,
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
      min: 0,
      max: 1000,
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
    let value = (this.max - this.min) * pos;
    value = this.min + Math.round(value / this.step) * this.step;
    value = Math.min(this.max, Math.max(this.min, (value)));
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
        value = this.min;
        break;
      case 'max':
        value = this.max;
        break;
    }
    value = Math.min(this.max, Math.max(this.min, (value)));
    let d = -Math.round(Math.log(this.step) / Math.LN10);
    d = Math.max(0, Math.min(100, d));
    value = Number(value.toFixed(d));
    this.set('value', value);
  }
  changed() {
    super.changed();
    this.setAttribute('aria-invalid', isNaN(this.value) ? 'true' : false);
    this.setAttribute('aria-valuenow', isNaN(this.value) ? 0 : this.value);
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    // this.setAttribute('aria-valuestep', this.step);
  }
  // TODO: implement proper sdf shapes.
  static get Frag() {
    return `
    #extension GL_OES_standard_derivatives : enable

    ${chunk.translate}
    ${chunk.circle}
    ${chunk.grid}

    varying vec2 vUv;

    void main(void) {
      vec2 position = vUv * uSize;

      vec4 finalColor = cssBackgroundColorField;
      vec4 slotColorBg = mix(cssColor, cssBackgroundColorField, 0.5);
      vec4 stepColorBg = mix(slotColorBg, cssBackgroundColorField, 0.75);
      vec4 slotColor = mix(cssColorFocus, cssColorLink, vUv.x);

      float lineWidth = cssBorderWidth;
      float slotWidth = cssBorderWidth;

      float stepInPx = uSize.x / ((uMax - uMin) / uStep);

      if (stepInPx > lineWidth * 2.0) {
        float gridWidth = uSize.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * uSize.x;
        float gridShape = grid(translate(position, - gridOffset, 0.0), gridWidth, uSize.y, lineWidth);
        finalColor = mix(stepColorBg, finalColor, gridShape);
      }

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      float valueField = saturate((vUv.x - valueInRange) * uSize.x);
      float slotField = saturate((abs(0.5 - vUv.y)) * uSize.y - slotWidth);

      finalColor = mix(mix(slotColor, slotColorBg, valueField), finalColor, slotField);

      float circleShape = circle(translate(position, valueInRange * uSize.x, 0.5 * uSize.y), uSize.y / 4.0);
      finalColor = mix(slotColor, finalColor, circleShape);

      gl_FragColor = finalColor;
    }`;
  }
}

IoSliderKnob.Register();
IoSlider.Register();
