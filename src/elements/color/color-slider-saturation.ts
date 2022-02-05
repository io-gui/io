import {RegisterIoElement} from '../../core/io-element.js';
import {IoColorSlider} from './color-slider.js';

/*
 * Modifies **saturation** component the color `value` in **hsv** or **hsl** color space.
 *
 * <io-element-demo element="io-color-slider-saturation"
 *   properties='{"value": [1, 0.5, 0, 1]}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/

export class IoColorSliderSaturation extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Saturation gradient
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], uv.x, uHsv[2]));
        float saturation = uHsv[1];
        if (uMode == 2.0) {
          saturation = uHsl[1];
          finalColor = hsl2rgb(vec3(uHsl[0], uv.x, uHsl[2]));
        }

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * saturation, size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setIncrease() {
    this.hsv[1] = Math.min(1, this.hsv[1] + 0.01);
    this.setValueFromHsv();
  }
  _setDecrease() {
    this.hsv[1] = Math.max(0, this.hsv[1] - 0.01);
    this.setValueFromHsv();
  }
  _setValue(x: number) {
    this.hsv[1] = x;
    this.setValueFromHsv();
  }
}

RegisterIoElement(IoColorSliderSaturation as any);
