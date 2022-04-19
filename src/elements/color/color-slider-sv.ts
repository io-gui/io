import {RegisterIoElement} from '../../iogui.js';
import {IoColorSlider} from './color-slider.js';

/*
 * 2D slider. Modifies **saturation** and **value** of the color `value` in **hsv** color space.
 *
 * <io-element-demo element="io-color-slider-sv"
 *   width="64px" height="64px"
 *   properties='{"value": [1, 0.5, 0, 1], "horizontal": true}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/

export class IoColorSliderSv extends IoColorSlider {
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
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // SV gradient
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], uv));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsv[1], size.y * uHsv[2]));
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
        this.hsv[1] = Math.max(0, this.hsv[1] - 0.01);
      } else {
        this.hsv[2] = Math.max(0, this.hsv[2] - 0.01);
      }
      this.setValueFromHsv();
    } else if (event.shiftKey && event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsv[2] = Math.min(1, this.hsv[2] + 0.01);
      } else {
        this.hsv[1] = Math.min(1, this.hsv[1] + 0.01);
      }
      this.setValueFromHsv();
    } else if (event.shiftKey && event.key === 'ArrowRight') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsv[1] = Math.min(1, this.hsv[1] + 0.01);
      } else {
        this.hsv[2] = Math.min(1, this.hsv[2] + 0.01);
      }
      this.setValueFromHsv();
    } else if (event.shiftKey && event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.horizontal) {
        this.hsv[2] = Math.max(0, this.hsv[2] - 0.01);
      } else {
        this.hsv[1] = Math.max(0, this.hsv[1] - 0.01);
      }
      this.setValueFromHsv();
    } else {
      super._onKeydown(event);
    }
  }
  _setValue(x: number, y: number) {
    this.hsv[1] = x;
    this.hsv[2] = y;
    this.setValueFromHsv();
  }
}

RegisterIoElement(IoColorSliderSv as any);
