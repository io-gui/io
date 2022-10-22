import { RegisterIoElement } from '../../core/element.js';
import {IoColorSlider} from './color-slider.js';

/*
 * Modifies **green** component the color `value` in **rgb** color space.
 *
 * <io-element-demo element="io-color-slider-green"
 *   properties='{"value": [1, 0.5, 0, 1]}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
@RegisterIoElement
export class IoColorSliderGreen extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 uv = uVertical == 1 ? vUv.yx : vUv;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = vec3(uRgb[0], uv.x, uRgb[2]);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uRgb[1], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setIncrease() {
    this.rgb[1] = Math.min(1, this.rgb[1] + 0.01);
    this.valueFromRgb();
  }
  _setDecrease() {
    this.rgb[1] = Math.max(0, this.rgb[1] - 0.01);
    this.valueFromRgb();
  }
  _inputValue(x: number) {
    this.rgb[1] = x;
    this.valueFromRgb();
  }
}
