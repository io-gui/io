import { Register } from '../../core/decorators/register.js';
import { Property } from '../../core/internals/property.js';
import { IoSliderBase } from './io-slider-base.js';

/**
 * Input element for `Number` data type displayed as slider.
 * It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider" properties='{"value": 0, "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
@Register
export class IoSlider extends IoSliderBase {

  @Property(0)
  declare value: number;

  @Property(0.01)
  declare step: number;

  @Property(0)
  declare min: number;

  @Property(1)
  declare max: number;

  static get Frag() {
    return /* glsl */`
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
      vec3 finalCol = iotBgColorField.rgb;
      vec3 gridCol = iotBgColorDimmed.rgb;
      vec3 sliderCol = iotBgColorBlue.rgb;
      vec3 lineCol1 = iotColor.rgb;
      vec3 lineCol2 = iotBgColor.rgb;

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(expPosition, gridOffset, 0.0), vec2(gridSize, 0.0), iotBorderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Slider
      float sliderShape = rectangle(expPosition, vec2(size.x * valueInRange, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(iotBgColorField.rgb, gridShape * sliderShape * 0.125));

      // Lines
      float lineShape1 = lineVertical(translate(position, expValueInRange * size.x, 0.0), iotBorderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineShape1));
      float lineShape2 = lineVertical(translate(position, expValueInRange * size.x - iotBorderWidth, 0.0), iotBorderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineShape2));

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}

