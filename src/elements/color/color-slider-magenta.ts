import { RegisterIoElement } from '../../core/element.js';
import {IoColorSlider} from './color-slider.js';

/*
 * Modifies **magenta** component the color `value` in **cmyk** color space.
 *
 * <io-element-demo element="io-color-slider-magenta"
 *   properties='{"value": [1, 0.5, 1, 0]}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
@RegisterIoElement
export class IoColorSliderMagenta extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uCmyk[0], uv.x, uCmyk[2], uCmyk[3]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[1], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setIncrease() {
    this.cmyk[1] = Math.min(1, this.cmyk[1] + 0.01);
    this.valueFromCmyk();
  }
  _setDecrease() {
    this.cmyk[1] = Math.max(0, this.cmyk[1] - 0.01);
    this.valueFromCmyk();
  }
  _inputValue(x: number) {
    this.cmyk[1] = x;
    this.valueFromCmyk();
  }
}
