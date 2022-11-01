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
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {

      vec3 finalCol = ioBackgroundColorField.rgb;
      vec3 gridCol = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.95);
      vec3 circleColor = ioColorLink.rgb;

      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 view = (uv - 0.5) * 2.0;

      vec2 gridWidth = abs(size / ((uMax - uMin) / uStep)) * 2.0;

      vec2 offset = (uMax + uMin) / (uMax - uMin);

      view += offset;

      vec2 position = size * view;

      if (max(gridWidth.x, gridWidth.y) > ioStrokeWidth * 2.0) {
        float gridShape = grid(position, gridWidth.x, gridWidth.y, ioStrokeWidth);
        finalCol.rgb = mix(gridCol, finalCol.rgb, gridShape);
        gridShape = grid(position, gridWidth.x * 10., gridWidth.y * 10., ioStrokeWidth * 2.);
        finalCol.rgb = mix(vec3(1.0, 0.0, 0.0), finalCol.rgb, gridShape);
      }

      float knobRadius = ioFieldHeight * 0.25;

      vec2 value2d = (uValue - uMin) / (uMax - uMin);
      value2d -= offset;

      vec2 circlePos = size * value2d;

      vec4 slider = paintCircle(position / 2.0, circlePos, knobRadius, circleColor);
      finalCol = mix(finalCol.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}