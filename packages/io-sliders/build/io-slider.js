var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property } from 'io-gui';
import { IoSliderBase } from './io-slider-base.js';
/**
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider" properties='{"value": 0, "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
let IoSlider = class IoSlider extends IoSliderBase {
    static get Frag() {
        return /* glsl */ `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * vec2(uv.x, uv.y - 0.5);
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      float valueInRange = (uValue - uMin) / (uMax - uMin);
      float valueSign = sign(valueInRange);
      float expValueInRange = pow(abs(valueInRange), 1./uExponent) * valueSign;

      // Colors
      vec3 finalCol = io_bgColorField.rgb;
      vec3 gridCol = io_bgColorDimmed.rgb;
      vec3 sliderCol = io_bgColorBlue.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(expPosition, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Slider
      float sliderShape = rectangle(expPosition, vec2(size.x * valueInRange, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorField.rgb, gridShape * sliderShape * 0.125));

      // Lines
      float lineShape1 = lineVertical(translate(position, expValueInRange * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineShape1));
      float lineShape2 = lineVertical(translate(position, expValueInRange * size.x - io_borderWidth, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineShape2));

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
    }
};
__decorate([
    Property(0)
], IoSlider.prototype, "value", void 0);
__decorate([
    Property(0.01)
], IoSlider.prototype, "step", void 0);
__decorate([
    Property(0)
], IoSlider.prototype, "min", void 0);
__decorate([
    Property(1)
], IoSlider.prototype, "max", void 0);
IoSlider = __decorate([
    Register
], IoSlider);
export { IoSlider };
//# sourceMappingURL=io-slider.js.map