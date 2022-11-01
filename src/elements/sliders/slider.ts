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

  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Colors
      vec3 finalCol = ioBackgroundColorField.rgb;
      vec3 gridCol = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.75);
      vec3 sliderColStart = ioColorFocus.rgb;
      vec3 sliderColEnd = ioColorLink.rgb;

      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.0, 0.5));

      // Sizes
      float gridThickness = ioStrokeWidth;
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
      float slotWidth = ioFieldHeight * 0.125;

      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      vec2 gridPosition = translate(expPosition, gridOffset, 0.0);
      float gridShape = grid2d(gridPosition, vec2(gridSize, size.y + gridThickness * 2.0), gridThickness);

      if (gridSize > gridThickness * 2.0) {
        finalCol.rgb = mix(gridCol.rgb, finalCol.rgb, gridShape);
      }

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      valueInRange = abs(pow(valueInRange, 1./uExponent));

      vec2 sliderStart = vec2(0.0, size.y * 0.0);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), 0.0);
      sliderStart.x = min(sliderStart.x, sliderEnd.x);
      vec4 slider = paintSlider(position, sliderStart, sliderEnd, slotWidth, slotWidth, sliderColStart, sliderColEnd);
      finalCol = mix(finalCol.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}

