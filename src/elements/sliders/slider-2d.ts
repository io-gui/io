import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoSliderBase } from './slider-base.js';

@RegisterIoElement
export class IoSlider2d extends IoSliderBase {
  static get Style() {
    return /* css */`
      :host {
        cursor: crosshair;
        border: var(--io-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-color-border-inset);
        min-width: calc(var(--io-field-height) * 4);
        flex-basis: calc(var(--io-field-height) * 4);
        flex-grow: 0;
      }
      :host[horizontal] {
        cursor: crosshair;
      }
    `;
  }

  @IoProperty({value: [0, 0], observe: true})
  declare value: [number, number];

  @IoProperty({value: [0.01, 0.01]})
  declare step: [number, number];

  @IoProperty({value: [-1, -1]})
  declare min: [number, number];

  @IoProperty({value: [1, 1]})
  declare max: [number, number];

  // TODO: grid with exponent
  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = ioBackgroundColorField.rgb;
      vec3 gridCol = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.95);
      vec3 axisCol = mix(ioColorFocus.rgb, ioBackgroundColorField.rgb, 0.75);
      vec3 sliderCol = ioColorLink.rgb;

      // // Sizes
      float gridThickness = ioStrokeWidth;
      vec2  gridSize = size / abs((uMax - uMin) / uStep);
      vec2  gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;

      vec2 offsetPosition = translate(position, -gridOffset);
      float gridShape = grid2d(offsetPosition, gridSize, gridThickness);
      float axisShape = axis2d(offsetPosition, gridThickness);

      if (max(gridSize.x, gridSize.y) > gridThickness * 2.0) {
        finalCol.rgb = mix(gridCol, finalCol.rgb, gridShape);
        finalCol.rgb = mix(axisCol, finalCol.rgb, axisShape);
      }

      vec2 circlePos = uValue / (uMax - uMin) * size;
      vec4 slider = paintKnob(offsetPosition, circlePos, sliderCol);
      finalCol = mix(finalCol.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}