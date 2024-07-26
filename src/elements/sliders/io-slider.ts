import { Register } from '../../core/node.js';
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

  static get GlUtils() {
    return /* glsl */`
      vec3 paintSlider(vec3 dstCol, vec2 p, vec2 size, vec3 colorStart, vec3 colorEnd) {
        vec4 finalCol = vec4(0.0);

        float valueInRange = (uValue - uMin) / (uMax - uMin);
        valueInRange = abs(pow(valueInRange, 1./uExponent));

        vec2 start = vec2(0.0, size.y * 0.0);
        vec2 end = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), 0.0);
        start.x = min(start.x, end.x);

        vec2 pStart = translate(p, start);
        vec2 pEnd = translate(p, end);
        vec2 pCenter = (pStart + pEnd) / 2.0;
        float slotHalfWidth = abs(pStart.x - pEnd.x) / 2.0;

        float slotThickness = iotFieldHeight * 0.125;

        float stroke = iotStrokeWidth / 0.5;

        float strokeShape = min(
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + stroke + stroke)),
          circle(pEnd, 1.0 * slotThickness + stroke + stroke)
        );

        float fillShape = min(
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + stroke)),
          circle(pEnd, 1.0 * slotThickness + stroke)
        );
        float colorShape = min(
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness)),
          circle(pEnd, 1.0 * slotThickness)
        );

        float grad = (p.x - start.x) / (end.x - start.x);
        vec3 sloiotGradient = mix(colorStart, colorEnd, saturate(grad));

        finalCol = mix(iotColorStrong, finalCol, strokeShape);
        finalCol = mix(vec4(iotBackgroundColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(sloiotGradient, 1.0), finalCol, colorShape);

        return compose(dstCol, finalCol);
      }
    `;
  }

  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.0, 0.5));

      vec3 finalCol = iotBackgroundColorField.rgb;

      // Sizes

      // Grid
      float gridThickness = iotStrokeWidth;
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      vec2 gridPosition = translate(expPosition, gridOffset, 0.0);
      float gridShape = grid2d(gridPosition - size.y / 1.9, vec2(gridSize, size.y + gridThickness * 2.0), gridThickness);

      if (gridSize > gridThickness * 2.0) {
        vec3 gridCol = iotColorDimmed.rgb;
        finalCol = compose(finalCol, vec4(gridCol, gridShape));
      }

      // Slider
      finalCol = paintSlider(finalCol, position, size, iotBackgroundColorGreen.rgb, iotBackgroundColorGreen.rgb);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}

