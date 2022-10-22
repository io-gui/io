import { RegisterIoElement } from '../../core/element.js';
import { IoSlider } from './slider.js';

@RegisterIoElement
export class IoSlider2d extends IoSlider {
  static get Style() {
    return /* css */`
    :host {
      cursor: ns-resize;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      border-color: var(--io-color-border-inset);
      flex-basis: var(--io-field-height);
    }
    :host[horizontal] {
      cursor: ew-resize;
      flex-basis: calc(var(--io-field-height) * 10);
    }
    `;
  }
  static get Properties(): any {
    return {
      value: {
        type: Array,
        value: [0, 0],
        observe: true,
      },
      step: {
        type: Array,
        value: [0.01, 0.01],
      },
      min: {
        type: Array,
        value: [-1, -1],
      },
      max: {
        type: Array,
        value: [1, 1],
      },
    };
  }
  _onPointerdown(event: PointerEvent) {
    super._onPointerdown(event);
    const p = this._getPointerCoord(event);
    const c0 = this._getCoordFromValue(Math.min(this.max[0], Math.max(this.min[0], this.value[0])));
    const c1 = this._getCoordFromValue(Math.min(this.max[1], Math.max(this.min[1], this.value[1])));
    if (this.horizontal) {
      this._index = Math.abs(c0 - p[0]) < Math.abs(c1 - p[0]) ? 0 : 1;
    } else {
      this._index = Math.abs(c0 - p[1]) < Math.abs(c1 - p[1]) ? 0 : 1;
    }
  }
  _onPointermoveThrottled(event: PointerEvent) {
    if (this._active === 1) {
      if (document.activeElement !== this as unknown as HTMLElement) this.focus();
      const p = this._getPointerCoord(event);
      const v0 = this._getValueFromCoord(p[0]);
      const v1 = this._getValueFromCoord(p[1]);
      if (this._index === 0) {
        this._inputValue(this.horizontal ? v0 : v1, this.value[1]);
      } else if (this._index === 1) {
        this._inputValue(this.value[0], this.horizontal ? v0 : v1);
      }
    }
  }
  _inputValue(x: number, y: number) {
    this.value[0] = Number(x.toFixed(5));
    this.value[1] = Number(y.toFixed(5));
    this.inputValue(this.value);
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
  }
  // TODO: round to step
  _setIncrease() {
    // let x = this.value[0] + this.step[0];
    // let y = this.value[1] + this.step[1];
    // x = Math.min(this.max[0], Math.max(this.min[0], x));
    // y = Math.min(this.max[1], Math.max(this.min[1], y));
    // this._inputValue(x, y);
  }
  _setDecrease() {
    // let x = this.value[0] - this.step[0];
    // let y = this.value[1] - this.step[1];
    // x = Math.min(this.max[0], Math.max(this.min[0], x));
    // y = Math.min(this.max[1], Math.max(this.min[1], y));
    // this._inputValue(x, y);
  }
  _setMin() {
    // let x = this.min[0];
    // let y = this.min[1];
    // x = Math.min(this.max[0], Math.max(this.min[0], x));
    // y = Math.min(this.max[1], Math.max(this.min[1], y));
    // this._inputValue(x, y);
  }
  _setMax() {
    // let x = this.max[0];
    // let y = this.max[1];
    // x = Math.min(this.max[0], Math.max(this.min[0], x));
    // y = Math.min(this.max[1], Math.max(this.min[1], y));
    // this._inputValue(x, y);
  }
  init() {
    this.changed();
  }
  changed() {
    super.changed();
    this.setAttribute('value', this.value);
    this.setAttribute('aria-valuenow', this.value); // TODO vec2
    this.setAttribute('aria-valuemin', this.min); // TODO vec2
    this.setAttribute('aria-valuemax', this.max); // TODO vec2
    this.setAttribute('aria-valuestep', this.step); // TODO vec2
    if (!(this.value instanceof Array && this.value.length === 2)) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
  static get Frag() {
    return /* glsl */`
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = ioBackgroundColorField.rgb;

      vec2 size = uSize;
      vec2 uv = vUv;
      vec2 position = size * uv;

      vec2 stepInPx = size / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(ioColor, ioBackgroundColorField, 0.95);

      float lineWidth = ioStrokeWidth;
      if (max(stepInPx.x, stepInPx.y) > lineWidth * 2.0) {
        // TODO: grid with exponent
        vec2 gridOffset = mod(uMin, uStep) / (uMax - uMin) * size;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, -gridOffset.x, -gridOffset.y), stepInPx.x, stepInPx.y, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      // float knobRadius = ioFieldHeight * 0.25;
      // float slotWidth = ioFieldHeight * 0.125;

      // float valueInRangeStart = (uValue[0] - uMin) / (uMax - uMin);
      // float signStart = valueInRangeStart < 0.0 ? -1.0 : 1.0;
      // valueInRangeStart = abs(pow(valueInRangeStart, 1./uExponent)) * signStart;

      // float valueInRangeEnd = (uValue[1] - uMin) / (uMax - uMin);
      // float signEnd = valueInRangeEnd < 0.0 ? -1.0 : 1.0;
      // valueInRangeEnd = abs(pow(valueInRangeEnd, 1./uExponent)) * signEnd;

      // float grad = 0.5;
      // if (valueInRangeEnd > valueInRangeStart) {
      //   grad = (uv.x - valueInRangeStart) / max(valueInRangeEnd - valueInRangeStart, 0.01);
      // } else if (valueInRangeEnd < valueInRangeStart) {
      //   grad = 1.0 - (uv.x - valueInRangeEnd) / max(valueInRangeStart - valueInRangeEnd, 0.01);
      // }
      // vec4 slotGradient = mix(ioColorFocus, ioColorLink, saturate(grad));
      // vec2 sliderStart = vec2(size.x * min(2.0, max(-1.0, (valueInRangeStart))), size.y * 0.5);
      // vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRangeEnd))), size.y * 0.5);
      // vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      // finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}