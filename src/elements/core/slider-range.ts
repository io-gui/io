import {RegisterIoElement} from '../../core/io-element.js';
import {IoSlider} from './slider.js';

/*
 * Extends `IoSlider`.
 *
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider-range" properties='{"value": [0, 1], "step": 0.1, "min": -1, "max": 2, "exponent": 1}'></io-element-demo>
 **/

export class IoSliderRange extends IoSlider {
  static get Properties(): any {
    return {
      value: {
        type: Array,
        value: [0, 0],
        observe: true,
      },
    };
  }
  _onPointerdown(event: PointerEvent) {
    super._onPointerdown(event);
    const p = this._getPointerCoord(event);
    const c0 = this._getCoordFromValue(Math.min(this.max, Math.max(this.min, this.value[0])));
    const c1 = this._getCoordFromValue(Math.min(this.max, Math.max(this.min, this.value[1])));
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
        this._setValue(this.horizontal ? v0 : v1, this.value[1]);
      } else if (this._index === 1) {
        this._setValue(this.value[0], this.horizontal ? v0 : v1);
      }
    }
  }
  _setValue(x: number, y: number) {
    this.setValue([Number(x.toFixed(5)), Number(y.toFixed(5))]);
  }
  _onKeydown(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('left');
        else this._setDecrease();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('up');
        else this._setIncrease();
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('right');
        else this._setIncrease();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!event.shiftKey) this.focusTo('down');
        else this._setDecrease();
        break;
      case 'PageUp':
      case '+':
        event.preventDefault();
        this._setIncrease();
        break;
      case 'PageDown':
      case '-':
        event.preventDefault();
        this._setDecrease();
        break;
      case 'Home':
        event.preventDefault();
        this._setMin();
        break;
      default:
        break;
    }
  }
  // TODO: round to step
  _setIncrease() {
    let x = this.value[0] + this.step;
    let y = this.value[1] + this.step;
    x = Math.min(this.max, Math.max(this.min, x));
    y = Math.min(this.max, Math.max(this.min, y));
    this._setValue(x, y);
  }
  _setDecrease() {
    let x = this.value[0] - this.step;
    let y = this.value[1] - this.step;
    x = Math.min(this.max, Math.max(this.min, x));
    y = Math.min(this.max, Math.max(this.min, y));
    this._setValue(x, y);
  }
  _setMin() {
    let x = this.min;
    let y = this.min;
    x = Math.min(this.max, Math.max(this.min, x));
    y = Math.min(this.max, Math.max(this.min, y));
    this._setValue(x, y);
  }
  _setMax() {
    let x = this.max;
    let y = this.max;
    x = Math.min(this.max, Math.max(this.min, x));
    y = Math.min(this.max, Math.max(this.min, y));
    this._setValue(x, y);
  }
  applyAria() {
    super.applyAria();
    this.setAttribute('aria-invalid', (this.value instanceof Array && this.value.length === 2) ? false : 'true');
    this.setAttribute('aria-valuemin', this.min);
    this.setAttribute('aria-valuemax', this.max);
    this.setAttribute('aria-valuestep', this.step);
  }
  static get Frag() {
    return /* glsl */`
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = cssBackgroundColorField.rgb;

      vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
      vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
      vec2 position = size * uv;


      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(cssColor, cssBackgroundColorField, 0.75);

      float lineWidth = cssStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        // TODO: grid with exponent
        float gridWidth = size.x / ((uMax - uMin) / uStep);
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      float knobRadius = cssItemHeight * 0.25;
      float slotWidth = cssItemHeight * 0.125;

      float valueInRangeStart = (uValue[0] - uMin) / (uMax - uMin);
      float signStart = valueInRangeStart < 0.0 ? -1.0 : 1.0;
      valueInRangeStart = abs(pow(valueInRangeStart, 1./uExponent)) * signStart;

      float valueInRangeEnd = (uValue[1] - uMin) / (uMax - uMin);
      float signEnd = valueInRangeEnd < 0.0 ? -1.0 : 1.0;
      valueInRangeEnd = abs(pow(valueInRangeEnd, 1./uExponent)) * signEnd;

      float grad = 0.5;
      if (valueInRangeEnd > valueInRangeStart) {
        grad = (uv.x - valueInRangeStart) / max(valueInRangeEnd - valueInRangeStart, 0.01);
      } else if (valueInRangeEnd < valueInRangeStart) {
        grad = 1.0 - (uv.x - valueInRangeEnd) / max(valueInRangeStart - valueInRangeEnd, 0.01);
      }
      vec4 slotGradient = mix(cssColorFocus, cssColorLink, saturate(grad));

      vec2 sliderStart = vec2(size.x * min(2.0, max(-1.0, (valueInRangeStart))), size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRangeEnd))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}

RegisterIoElement(IoSliderRange);
