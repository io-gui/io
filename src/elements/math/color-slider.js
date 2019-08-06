import {html} from "../../io.js";
import {IoSlider} from "../../io-elements-core.js";
import {IoColorMixin} from "./color.js";

export class IoColorSlider extends IoColorMixin(IoSlider) {
  static get Properties() {
    return {
      value: [1, 1, 1, 1],
      step: 0.01,
      min: 0,
      max: 1,
    };
  }
  static get GlUtils() {
    return /* glsl */`
    vec4 paintSlider2D(vec2 position, vec3 color) {
      vec4 sliderColor = vec4(0.0);
      float radius = cssItemHeight / 5.0;
      float stroke = cssStrokeWidth;
      vec2 width = (uHorizontal == 1) ? vec2(stroke * 2.0, uSize.y) : vec2(uSize.x, stroke * 2.0);
      float strokeShape = circle(position, radius + stroke);
      sliderColor = mix(vec4(cssColor.rgb, 1.0), sliderColor, strokeShape);
      float fillShape = circle(position, radius);
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);
      float colorShape = circle(position, radius - stroke);
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);
      return sliderColor;
    }
    \n\n`;
  }
  valueMutated() {
    this.valueChanged();
  }
  setAria() {
    // TODO
  }
  _onKeydown(event) {
    super._onKeydown(event);
    this._notifyValueChange();
  }
  _setIncrease() {}
  _setDecrease() {}
  _setMin() {}
  _setMax() {}
  _onPointermoveDebounced(event) {
    super._onPointermoveDebounced(event);
    this._notifyValueChange();
  }
  _notifyValueChange() {
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    this.valueChanged();
    this.changed();
  }
  _setValue(x, y) {
    // NOTE: implement in subclass
    x, y;
  }
}

IoColorSlider.Register();
