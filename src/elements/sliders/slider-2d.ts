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

  static get GlUtils() {
    return /* glsl */`
    vec4 paintCircle(vec2 position, vec2 circlePos, vec2 sliderEnd, float knobRadius, float slotWidth, vec3 color) {
      vec4 slotColor = mix(ioColor, ioBackgroundColorField, 0.125);
      vec4 sliderColor = vec4(0.0);
      float stroke = ioStrokeWidth;

      vec2 startPos = translate(position, circlePos);
      vec2 endPos = translate(position, sliderEnd);
      vec2 slotCenter = (startPos + endPos) / 2.;
      float slotSpan = abs(startPos.x - endPos.x) / 2.0;

      float strokeShape = min(min(
        circle(startPos, knobRadius + stroke + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke + stroke))),
        circle(endPos, knobRadius + stroke + stroke)
      );
      sliderColor = mix(vec4(slotColor.rgb, 1.0), sliderColor, strokeShape);

      float fillShape = min(min(
        circle(startPos, knobRadius + stroke),
        rectangle(slotCenter, vec2(slotSpan, slotWidth + stroke))),
        circle(endPos, knobRadius + stroke)
      );
      sliderColor = mix(vec4(ioBackgroundColor.rgb, 1.0), sliderColor, fillShape);

      float colorShape = min(min(
        circle(startPos, knobRadius),
        rectangle(slotCenter, vec2(slotSpan, slotWidth))),
        circle(endPos, knobRadius)
      );
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);

      return sliderColor;
    }
    \n\n`;
  }

  // TODO: grid with exponent
  static get Frag() {
    return /* glsl */`
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {

      vec3 finalColor = ioBackgroundColorField.rgb;
      vec3 gridColor = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.95);

      vec2 view = (vUv - 0.5) * 2.0;

      vec2 gridStepInPx = uSize / ((uMax - uMin) / uStep) * 2.0;

      vec2 offset = (uMax + uMin) / (uMax - uMin);

      view += offset;

      vec2 position = uSize * view;

      if (max(gridStepInPx.x, gridStepInPx.y) > ioStrokeWidth * 2.0) {
        float gridShape = grid(position, gridStepInPx.x, gridStepInPx.y, ioStrokeWidth);
        finalColor.rgb = mix(gridColor, finalColor.rgb, gridShape);
        gridShape = grid(position, gridStepInPx.x * 10., gridStepInPx.y * 10., ioStrokeWidth * 2.);
        finalColor.rgb = mix(vec3(1.0, 0.0, 0.0), finalColor.rgb, gridShape);
      }

      float knobRadius = ioFieldHeight * 0.25;
      float slotWidth = ioFieldHeight * 0.125;

      vec2 value2d = (uValue - uMin) / (uMax - uMin);
      value2d -= offset;

      vec4 slotGradient = ioColorLink;

      vec2 circlePos = uSize * value2d;

      vec4 slider = paintCircle(position / 2.0  , circlePos, circlePos, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}