import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoSliderBase } from './io-slider-base.js';

@Register
export class IoSlider2d extends IoSliderBase {
  static get Style() {
    return /* css */`
      :host {
        cursor: crosshair;
        border: var(--iotBorder);
        border-radius: var(--iotBorderRadius);
        border-color: var(--iotBorderColorInset);
        flex-grow: 0;
      }
      :host:not([vertical]),
      :host[vertical] {
        width: var(--iotFieldHeight5);
        height: var(--iotFieldHeight5);
        min-width: var(--iotFieldHeight5);
        min-height: var(--iotFieldHeight5);
        cursor: crosshair;
      }
    `;
  }

  @Property({value: null, type: Array, init: [0, 0]})
  declare value: [number, number];

  @Property({value: null, type: Array, init: [0.01, 0.01]})
  declare step: [number, number];

  @Property({value: null, type: Array, init: [-1, -1]})
  declare min: [number, number];

  @Property({value: null, type: Array, init: [1, 1]})
  declare max: [number, number];

  @Property(true)
  declare noscroll: boolean;

  static get GlUtils() {
    return /* glsl */`
      vec3 paintKnob(vec3 dstCol, vec2 p, vec2 center, vec3 color) {
        vec4 finalCol = vec4(0.0);
        vec2 pCenter = translate(p, center);
        float radius = iotFieldHeight * 0.25;
        float stroke = iotBorderWidth;
        float strokeShape = circle(pCenter, radius + stroke + stroke);
        float fillShape   = circle(pCenter, radius + stroke);
        float colorShape  = circle(pCenter, radius);
        finalCol = mix(iotColorStrong, finalCol, strokeShape);
        finalCol = mix(vec4(iotBgColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(color, 1.0), finalCol, colorShape);
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
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = iotBgColorField.rgb;
      vec3 gridCol = iotBgColorDimmed.rgb;
      vec3 sliderCol = iotBgColorBlue.rgb;
      vec3 lineCol1 = iotColor.rgb;
      vec3 lineCol2 = iotBgColor.rgb;

      // Grid
      vec2 gridSize = size / abs((uMax - uMin) / uStep);
      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 gridPosition = translate(position, -gridOffset);
      float gridShape = paintDerivativeGrid2D(gridPosition, gridSize, iotBorderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Axis
      float axisShape = lineCross2d(gridPosition, iotBorderWidth);
      finalCol = compose(finalCol, vec4(gridCol, axisShape));

      // Knob
      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, gridPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}