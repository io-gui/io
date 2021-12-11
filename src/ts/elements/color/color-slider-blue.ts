import {RegisterIoElement} from '../../components/io-element.js';
import {IoColorSlider} from './color-slider.js';

/*
 * Modifies **blue** component the color `value` in **rgb** color space.
 *
 * <io-element-demo element="io-color-slider-blue"
 *   properties='{"value": [1, 0.5, 0, 1]}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/

export class IoColorSliderBlue extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = vec3(uRgb[0], uRgb[1], uv.x);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uRgb[2], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setIncrease() {
    this.rgb[2] = Math.min(1, this.rgb[2] + 0.01);
    this.setValueFromRgb();
  }
  _setDecrease() {
    this.rgb[2] = Math.max(0, this.rgb[2] - 0.01);
    this.setValueFromRgb();
  }
  _setValue(x: number) {
    this.rgb[2] = x;
    this.setValueFromRgb();
  }
}

RegisterIoElement(IoColorSliderBlue as any);
