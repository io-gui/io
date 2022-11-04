import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoSliderBase } from './slider-base.js';

@RegisterIoElement
export class IoSlider extends IoSliderBase {

  @IoProperty(0)
  declare value: number;

  @IoProperty(0.01)
  declare step: number;

  @IoProperty(0)
  declare min: number;

  @IoProperty(1)
  declare max: number;

  static get GlUtils() {
    return /* glsl */`
      vec4 paintSlider(vec2 p, vec2 size, vec3 colorStart, vec3 colorEnd) {
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

        float slotThickness = ioFieldHeight * 0.125;

        float strokeShape = min(
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + ioStrokeWidth + ioStrokeWidth)),
          circle(pEnd, slotThickness + ioStrokeWidth + ioStrokeWidth)
        );

        float fillShape   = min(
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + ioStrokeWidth)),
          circle(pEnd, slotThickness + ioStrokeWidth)
        );
        float colorShape  = min(
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness)),
          circle(pEnd, slotThickness)
        );

        float grad = (p.x - start.x) / (end.x - start.x);
        vec3 slotGradient = mix(colorStart, colorEnd, saturate(grad));

        finalCol = mix(ioColor, finalCol, strokeShape);
        finalCol = mix(vec4(ioBackgroundColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(slotGradient, 1.0), finalCol, colorShape);

        return finalCol;
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

      // Colors
      vec3 finalCol = ioBackgroundColorField.rgb;
      vec3 gridCol = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.75);
      vec3 sliderColStart = ioColorFocus.rgb;
      vec3 sliderColEnd = ioColorLink.rgb;

      // Sizes
      float gridThickness = ioStrokeWidth;
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;

      // Grid
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      vec2 gridPosition = translate(expPosition, gridOffset, 0.0);
      float gridShape = grid2d(gridPosition, vec2(gridSize, size.y + gridThickness * 2.0), gridThickness);

      if (gridSize > gridThickness * 2.0) {
        finalCol.rgb = mix(gridCol.rgb, finalCol.rgb, gridShape);
      }

      // Slider
      vec4 slider = paintSlider(position, size, sliderColStart, sliderColEnd);
      finalCol = mix(finalCol.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}

