import { RegisterIoElement } from '../../core/element.js';
import {IoColorSlider} from './color-slider.js';

/*
 * 2D slider. Modifies **saturation** and **level** of the color `value` in **hsl** color space.
 *
 * <io-element-demo element="io-color-slider-sl"
 *   width="64px" height="64px"
 *   properties='{"value": [1, 0.5, 0, 1], "horizontal": true}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
@RegisterIoElement
export class IoColorSliderSl extends IoColorSlider {
  static get Style() {
    return /* css */`
    :host {
      cursor: move !important;
    }
    `;
  }
  static get Properties(): any {
    return {
      noscroll: true,
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 uv = uVertical == 1 ? vUv.yx : vUv;
        vec2 position = size * uv;

        // SV gradient
        vec3 finalColor = hsl2rgb(vec3(uHsl[0], uv));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsl[1], size.y * uHsl[2]));
        vec4 slider = paintColorSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _onKeydown(event: KeyboardEvent) {
    if (event.shiftKey && event.key === 'ArrowLeft') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsl[1] = Math.max(0, this.hsl[1] - 0.01);
      } else {
        this.hsl[2] = Math.max(0, this.hsl[2] - 0.01);
      }
      this.valueFromHsl();
    } else if (event.shiftKey && event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsl[2] = Math.min(1, this.hsl[2] + 0.01);
      } else {
        this.hsl[1] = Math.min(1, this.hsl[1] + 0.01);
      }
      this.valueFromHsl();
    } else if (event.shiftKey && event.key === 'ArrowRight') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsl[1] = Math.min(1, this.hsl[1] + 0.01);
      } else {
        this.hsl[2] = Math.min(1, this.hsl[2] + 0.01);
      }
      this.valueFromHsl();
    } else if (event.shiftKey && event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsl[2] = Math.max(0, this.hsl[2] - 0.01);
      } else {
        this.hsl[1] = Math.max(0, this.hsl[1] - 0.01);
      }
      this.valueFromHsl();
    } else {
      super._onKeydown(event);
    }
  }
  _inputValue(x: number, y: number) {
    this.hsl[1] = x;
    this.hsl[2] = y;
    this.valueFromHsl();
  }
}
