import {RegisterIoElement} from '../../iogui.js';
import {IoSlider} from '../core/slider.js';
import {IoColorMixin} from './color.js';

/*
 * Extends `IoColorMixin(IoSlider)`.
 *
 * Base class for color sliders for any color type.
 **/
@RegisterIoElement
export class IoColorSlider extends IoColorMixin(IoSlider) {
  static get Properties(): any {
    return {
      value: [1, 1, 1, 1],
      step: 0.001,
      min: 0,
      max: 1,
    };
  }
  static get GlUtils() {
    return /* glsl */`
    vec4 paintColorSlider(vec2 position, vec3 color) {
      // return paintSlider(position, color);
      vec4 slotColor = vec4(.2, .2, .2, 1.);
      vec4 fillColor = vec4(.8, .8, .8, 1.);
      vec4 sliderColor = vec4(0.);
      float slotWidth = cssStrokeWidth * 1.5;
      float radius = cssFieldHeight / 4.;
      float stroke = cssStrokeWidth;
      float strokeShape = min(circle(position, radius + stroke), rectangle(position - vec2(0., 2500.), vec2(slotWidth + stroke, 5000.)));
      sliderColor = mix(vec4(slotColor.rgb, 1.), sliderColor, strokeShape);
      float fillShape = min(circle(position, radius), rectangle(position - vec2(0., 2500.), vec2(slotWidth, 5000.)));
      sliderColor = mix(fillColor, sliderColor, fillShape);
      float colorShape = min(circle(position, radius - stroke), rectangle(position - vec2(0., 2500.), vec2(slotWidth - stroke, 5000.)));
      sliderColor = mix(vec4(color, 1.), sliderColor, colorShape);
      return sliderColor;
    }
    vec4 paintColorSlider2D(vec2 position, vec3 color) {
      vec4 sliderColor = vec4(0.);
      float radius = cssLineHeight / 2.;
      float stroke = cssStrokeWidth;
      vec4 slotColor = vec4(.2, .2, .2, 1.);
      vec4 fillColor = vec4(.8, .8, .8, 1.);
      vec2 width = (uHorizontal == 1) ? vec2(stroke * 2., uSize.y) : vec2(uSize.x, stroke * 2.);
      float strokeShape = circle(position, radius + stroke);
      sliderColor = mix(slotColor, sliderColor, strokeShape);
      float fillShape = circle(position, radius);
      sliderColor = mix(fillColor, sliderColor, fillShape);
      float colorShape = circle(position, radius - stroke);
      sliderColor = mix(vec4(color, 1.), sliderColor, colorShape);
      return sliderColor;
    }
    \n\n`;
  }
  valueMutated() {
    this.valueChanged();
  }
  applyAria() {
    // TODO
  }
  _onKeydown(event: KeyboardEvent) {
    super._onKeydown(event);
    this._notifyValueInput();
  }
  _setIncrease() {
  }
  _setDecrease() {
  }
  _setMin() {
    this._inputValue(0, 0);
  }
  _setMax() {
    this._inputValue(1, 1);
  }
  _onPointermoveThrottled(event: PointerEvent) {
    super._onPointermoveThrottled(event);
    this._notifyValueInput();
  }
  _notifyValueInput() {
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-input', {property: 'value', value: this.value}, false);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _inputValue(x: number, y?: number) {
    // NOTE: implement in subclass
  }
}
