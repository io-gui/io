import { RegisterIoElement } from '../../core/element.js';
import { IoSlider } from './slider.js';

/*
 * Extends `IoGl`.
 *
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider" properties='{"value": 0, "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
@RegisterIoElement
export class IoSlider2d extends IoSlider {
  static get Style() {
    return /* css */`
    :host {
      cursor: crosshair;
      flex-basis: var(--io-field-height);
    }
    :host[horizontal] {
      cursor: crosshair;
      flex-basis: 15em;
    }
    `;
  }
  static get Properties(): any {
    return {
      // value: {
      //   type: Array,
      //   value: [0, 0],
      //   observe: true,
      // },
    };
  }
  _onPointerdown(event: PointerEvent) {
    super._onPointerdown(event);
  //   this.setPointerCapture(event.pointerId);
  //   this.addEventListener('pointermove', this._onPointermove);
  //   this.addEventListener('pointerup', this._onPointerup);
  }
  // _onPointermove(event: PointerEvent) {
  //   if (event.pointerType !== 'touch') this._active = 1;
  //   this.throttle(this._onPointermoveThrottled, event);
  // }
  // _onPointerup(event: PointerEvent) {
  //   this.releasePointerCapture(event.pointerId);
  //   this.removeEventListener('pointermove', this._onPointermove);
  //   this.removeEventListener('pointerup', this._onPointerup);
  // }
  // _getPointerCoord(event: PointerEvent) {
  //   const rect = this.getBoundingClientRect();
  //   const x = Math.pow(Math.max(0, Math.min(1, (event.clientX - rect.x) / rect.width)), this.exponent);
  //   const y = Math.pow(Math.max(0, Math.min(1, 1 - (event.clientY - rect.y) / rect.height)), this.exponent);
  //   return [x, y];
  // }
  // _getValueFromCoord(coord: number) {
  //   let value = this.min * (1 - coord) + this.max * coord;
  //   value = Math.min(this.max, Math.max(this.min, value));
  //   return Math.round(value / this.step) * this.step;
  // }
  // _getCoordFromValue(value: number) {
  //   return (value - this.min) / (this.max - this.min);
  // }
  // // TODO: Implement Slider2D
  // _onPointermoveThrottled(event: PointerEvent) {
  //   if (this._active === 1) {
  //     if (document.activeElement !== this as unknown as Element) this.focus();
  //     const p = this._getPointerCoord(event);
  //     const _x = this._getValueFromCoord(p[0]);
  //     const _y = this._getValueFromCoord(p[1]);
  //     this._inputValue(this.horizontal ? _x : _y, this.horizontal ? _y : _x);
  //   }
  // }
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // _inputValue(x: number, y?: number) {
  //   this.inputValue(Number(x.toFixed(5)));
  // }
  // _onKeydown(event: KeyboardEvent) {
  //   switch (event.key) {
  //     case 'ArrowLeft':
  //       event.preventDefault();
  //       if (!event.shiftKey) this.focusTo('left');
  //       else this._setDecrease();
  //       break;
  //     case 'ArrowUp':
  //       event.preventDefault();
  //       if (!event.shiftKey) this.focusTo('up');
  //       else this._setIncrease();
  //       break;
  //     case 'ArrowRight':
  //       event.preventDefault();
  //       if (!event.shiftKey) this.focusTo('right');
  //       else this._setIncrease();
  //       break;
  //     case 'ArrowDown':
  //       event.preventDefault();
  //       if (!event.shiftKey) this.focusTo('down');
  //       else this._setDecrease();
  //       break;
  //     case 'PageUp':
  //     case '+':
  //       event.preventDefault();
  //       this._setIncrease();
  //       break;
  //     case 'PageDown':
  //     case '-':
  //       event.preventDefault();
  //       this._setDecrease();
  //       break;
  //     case 'Home':
  //       event.preventDefault();
  //       this._setMin();
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // // TODO: round to step
  // _setIncrease() {
  //   let value = this.value + this.step;
  //   value = Math.min(this.max, Math.max(this.min, value));
  //   this._inputValue(value);
  // }
  // _setDecrease() {
  //   let value = this.value - this.step;
  //   value = Math.min(this.max, Math.max(this.min, value));
  //   this._inputValue(value);
  // }
  // _setMin() {
  //   let value = this.min;
  //   value = Math.min(this.max, Math.max(this.min, value));
  //   this._inputValue(value);
  // }
  // _setMax() {
  //   let value = this.max;
  //   value = Math.min(this.max, Math.max(this.min, value));
  //   this._inputValue(value);
  // }
  // init() {
  //   this.changed();
  // }
  // changed() {
  //   super.changed();
  //   this.setAttribute('aria-valuemin', this.min);
  //   this.setAttribute('aria-valuemax', this.max);
  //   this.setAttribute('aria-valuestep', this.step);
  //   if (typeof this.value !== 'number' || isNaN(this.value)) {
  //     this.setAttribute('aria-invalid', 'true');
  //   } else {
  //     this.removeAttribute('aria-invalid');
  //     this.setAttribute('aria-valuenow', this.value);
  //   }
  // }
  // static get GlUtils() {
  //   return /* glsl */`
  //   vec4 paintSlider(vec2 position, vec2 sliderStart, vec2 sliderEnd, float knobRadius, float slotWidth, vec3 color) {
  //     vec4 slotColor = mix(ioColor, ioBackgroundColorField, 0.125);
  //     vec4 sliderColor = vec4(0.0);
  //     float stroke = ioStrokeWidth;

  //     vec2 startPos = translate(position, sliderStart);
  //     vec2 endPos = translate(position, sliderEnd);
  //     vec2 slotCenter = (startPos + endPos) / 2.;
  //     float slotSpan = abs(startPos.x - endPos.x) / 2.0;

  //     float strokeShape = min(min(
  //       circle(startPos, knobRadius + stroke + stroke),
  //       rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke + stroke))),
  //       circle(endPos, knobRadius + stroke + stroke)
  //     );
  //     sliderColor = mix(vec4(slotColor.rgb, 1.0), sliderColor, strokeShape);

  //     float fillShape = min(min(
  //       circle(startPos, knobRadius + stroke),
  //       rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke))),
  //       circle(endPos, knobRadius + stroke)
  //     );
  //     sliderColor = mix(vec4(ioBackgroundColor.rgb, 1.0), sliderColor, fillShape);

  //     float colorShape = min(min(
  //       circle(startPos, knobRadius),
  //       rectangle(slotCenter, vec2(slotSpan, slotWidth))),
  //       circle(endPos, knobRadius)
  //     );
  //     sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);

  //     return sliderColor;
  //   }
  //   \n\n`;
  // }
  // static get Frag() {
  //   return /* glsl */`
  //   #extension GL_OES_standard_derivatives : enable

  //   varying vec2 vUv;

  //   void main(void) {
  //     vec3 finalColor = ioBackgroundColorField.rgb;

  //     vec2 size = uHorizontal == 1 ? uSize : uSize.yx;
  //     vec2 uv = uHorizontal == 1 ? vUv : vUv.yx;
  //     vec2 position = size * uv;


  //     float stepInPx = size.x / ((uMax - uMin) / uStep);
  //     vec4 stepColorBg = mix(ioColor, ioBackgroundColorField, 0.75);

  //     float lineWidth = ioStrokeWidth;
  //     if (stepInPx > lineWidth * 2.0) {
  //       // TODO: grid with exponent
  //       float gridWidth = size.x / ((uMax - uMin) / uStep);
  //       float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
  //       vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
  //       float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
  //       finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
  //     }

  //     vec4 slotGradient = mix(ioColorFocus, ioColorLink, uv.x);
  //     float knobRadius = ioFieldHeight * 0.125;
  //     float slotWidth = ioFieldHeight * 0.125;

  //     float valueInRange = (uValue - uMin) / (uMax - uMin);
  //     float sign = valueInRange < 0.0 ? -1.0 : 1.0;
  //     valueInRange = abs(pow(valueInRange, 1./uExponent)) * sign;

  //     vec2 sliderStart = vec2(0.0, size.y * 0.5);
  //     vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), size.y * 0.5);

  //     vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
  //     finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

  //     gl_FragColor = vec4(finalColor, 1.0);
  //   }`;
  // }
}
