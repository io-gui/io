import {RegisterIoElement} from '../../../srcj/components/io-element.js';
import {IoColorSlider} from './color-slider.js';

export class IoColorSliderCyan extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uv.x, uCmyk[1], uCmyk[2], uCmyk[3]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[0], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setIncrease() {
    this.cmyk[0] = Math.min(1, this.cmyk[0] + 0.01);
    this.setValueFromCmyk();
  }
  _setDecrease() {
    this.cmyk[0] = Math.max(0, this.cmyk[0] - 0.01);
    this.setValueFromCmyk();
  }
  _setValue(x) {
    this.cmyk[0] = x;
    this.setValueFromCmyk();
  }
}

RegisterIoElement(IoColorSliderCyan);
