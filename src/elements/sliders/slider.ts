import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoSliderBase } from './slider-base.js';

@RegisterIoElement
export class IoSlider extends IoSliderBase {
  static get Style() {
    return /* css */`
      :host {
        cursor: ew-resize;
        border: var(--io-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-color-border-inset);
        flex-basis: calc(var(--io-field-height) * 10);
        flex-grow: 1;
        min-width: var(--io-field-height);
        min-height: var(--io-field-height);
      }
      :host[vertical] {
        cursor: ns-resize;
        flex-basis: var(--io-field-height);
        flex-shrink: 0;
      }
    `;
  }

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
    #extension GL_OES_standard_derivatives : enable

    varying vec2 vUv;

    void main(void) {
      vec3 finalColor = ioBackgroundColorField.rgb;

      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * uv;


      float stepInPx = size.x / ((uMax - uMin) / uStep);
      vec4 stepColorBg = mix(ioColor, ioBackgroundColorField, 0.75);

      float lineWidth = ioStrokeWidth;
      if (stepInPx > lineWidth * 2.0) {
        // TODO: grid with exponent
        float gridWidth = stepInPx;
        float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;
        vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
        float gridShape = grid(translate(expPosition, - gridOffset, size.y / 2.), gridWidth, size.y + lineWidth * 2.0, lineWidth);
        finalColor.rgb = mix(stepColorBg.rgb, finalColor.rgb, gridShape);
      }

      vec4 slotGradient = mix(ioColorFocus, ioColorLink, uv.x);
      float knobRadius = ioFieldHeight * 0.125;
      float slotWidth = ioFieldHeight * 0.125;

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      float sign = valueInRange < 0.0 ? -1.0 : 1.0;
      valueInRange = abs(pow(valueInRange, 1./uExponent)) * sign;

      vec2 sliderStart = vec2(0.0, size.y * 0.5);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), size.y * 0.5);

      vec4 slider = paintSlider(position, sliderStart, sliderEnd, knobRadius, slotWidth, slotGradient.rgb);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}

