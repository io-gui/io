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
        flex-grow: 0;
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
      vec3 gridCol = mix(ioColor.rgb, ioBackgroundColorField.rgb, 0.75);
      vec3 sliderColorStart = ioColorFocus.rgb;
      vec3 sliderColorEnd = ioColorLink.rgb;

      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.0, 0.5));

      float gridLineWidth = ioStrokeWidth;
      float gridWidth = abs(size.x / ((uMax - uMin) / uStep));
      float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;

      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      float gridShape = grid(translate(expPosition, - gridOffset, 0.0), gridWidth, size.y + gridLineWidth * 2.0, gridLineWidth);
      finalColor.rgb = mix(gridCol.rgb, finalColor.rgb, gridShape);

      float valueInRange = (uValue - uMin) / (uMax - uMin);
      valueInRange = abs(pow(valueInRange, 1./uExponent));

      vec2 sliderStart = vec2(0.0, size.y * 0.0);
      vec2 sliderEnd = vec2(size.x * min(2.0, max(-1.0, (valueInRange))), 0.0);
      float sliderThickness = ioFieldHeight * 0.125;
      sliderStart.x = min(sliderStart.x, sliderEnd.x);
      vec4 slider = paintSlider(position, sliderStart, sliderEnd, sliderThickness, sliderThickness, sliderColorStart, sliderColorEnd);
      finalColor = mix(finalColor.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalColor, 1.0);
    }`;
  }
}

