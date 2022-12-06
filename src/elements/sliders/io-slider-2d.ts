import { RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoSliderBase } from './io-slider-base.js';

@RegisterIoElement
export class IoSlider2d extends IoSliderBase {
  static get Style() {
    return /* css */`
      :host {
        cursor: crosshair;
        border: var(--io-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-border-color-inset);
        min-width: var(--io-field-height4);
        min-height: var(--io-field-height4);
        flex-basis: var(--io-field-height4);
        flex-grow: 0;
      }
      :host[horizontal] {
        cursor: crosshair;
      }
    `;
  }

  @Property({value: [0, 0], observe: true})
  declare value: [number, number];

  @Property({value: [0.01, 0.01]})
  declare step: [number, number];

  @Property({value: [-1, -1]})
  declare min: [number, number];

  @Property({value: [1, 1]})
  declare max: [number, number];

  @Property(true)
  declare noscroll: boolean;

  static get GlUtils() {
    return /* glsl */`
      vec3 paintKnob(vec3 dstCol, vec2 p, vec2 center, vec3 color) {
        vec4 finalCol = vec4(0.0);
        vec2 pCenter = translate(p, center);
        float radius = ioFieldHeight * 0.25;
        float strokeShape = circle(pCenter, radius + ioStrokeWidth + ioStrokeWidth);
        float fillShape   = circle(pCenter, radius + ioStrokeWidth);
        float colorShape  = circle(pCenter, radius);
        finalCol = mix(ioColor, finalCol, strokeShape);
        finalCol = mix(vec4(ioBackgroundColor.rgb, 1.0), finalCol, fillShape);
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
      vec3 finalCol = ioBackgroundColorField.rgb;
      vec3 gridCol = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.95);
      vec3 axisCol = mix(ioColorFieldSelected.rgb, ioBackgroundColorField.rgb, 0.75);
      vec3 sliderCol = ioColorLink.rgb;

      // // Sizes
      float gridThickness = ioStrokeWidth;
      vec2  gridSize = size / abs((uMax - uMin) / uStep);
      vec2  gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;

      vec2 offsetPosition = translate(position, -gridOffset);
      float gridShape = grid2d(offsetPosition, gridSize, gridThickness);
      float axisShape = lineCross2d(offsetPosition, gridThickness);

      if (max(gridSize.x, gridSize.y) > gridThickness * 2.0) {
        finalCol = compose(finalCol, vec4(gridCol, gridShape));
        finalCol = compose(finalCol, vec4(axisCol, axisShape));
      }

      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, offsetPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
}