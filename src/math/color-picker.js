/*
GLSL Color Space Utility Functions
(c) 2015 tobspr
-------------------------------------------------------------------------------
The MIT License (MIT)
Copyright (c) 2015
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-------------------------------------------------------------------------------
Most formulars / matrices are from:
https://en.wikipedia.org/wiki/SRGB
Some are from:
http://www.chilliant.com/rgb2hsv.html
https://www.fourcc.org/fccyvrgb.php
https://github.com/tobspr/GLSL-Color-Spaces/blob/master/ColorSpaces.inc.glsl
*/

import {html, IoGl} from "../io.js";

export class IoColorPicker extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        width: 165px;
        height: 133px;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      wheelWidth: 32,
      radius: 24,
      thicknes: 3,
      color: [0, 0, 0, 1],
      hsv: [0.5, 0.5, 0.5],
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      #ifndef saturate
        #define saturate(v) clamp(v, 0., 1.)
      #endif

      vec3 hue_to_rgb(float hue) {
        float R = abs(hue * 6. - 3.) - 1.;
        float G = 2. - abs(hue * 6. - 2.);
        float B = 2. - abs(hue * 6. - 4.);
        return saturate(vec3(R,G,B));
      }

      vec3 hsv_to_rgb(vec3 hsv) {
        vec3 rgb = hue_to_rgb(hsv.x);
        return ((rgb - 1.0) * hsv.y + 1.0) * hsv.z;
      }

      vec3 sv2Color(in vec2 sv, in vec3 color) {
        vec3 val = mix(vec3(0.0), vec3(1.0), sv.y);
        return mix(val, color, sv.x);
      }

      const int stopCount = 6;
      vec3 getStop(int i) {
        vec3 result = vec3(0);
        if (i == 0) result = vec3(1.0, 0.0, 0.0);
        else if (i == 1) result = vec3(1.0, 0.0, 1.0);
        else if (i == 2) result = vec3(0.0, 0.0, 1.0);
        else if (i == 3) result = vec3(0.0, 1.0, 1.0);
        else if (i == 4) result = vec3(0.0, 1.0, 0.0);
        else if (i == 5) result = vec3(1.0, 1.0, 0.0);
        return result;
      }

      void main(void) {
        vec3 final = background.rgb;

        // hue gradient and color marker

        vec3 hueColor = hue_to_rgb(hsv[0]);

        float split = (size.x - wheelWidth) / size.x;

        if (vUv.x <= split) {
          vec2 sv = mix(
            mix(vec2(0.0, 0.0), vec2(0.0, 0.0), vUv.x / split),
            mix(vec2(0.0, 1.0), vec2(1.0, 1.0), vUv.x / split),
            vUv.y
          );
          final = sv2Color(sv.xy, hueColor);

          // Color marker
          vec2 offset = vec2(vUv.x, vUv.y) - vec2(hsv[1] * split, hsv[2]);
          float distOut = (length(offset * size) - (radius - (thicknes / 2.0)));
          float distIn = 1.0 - (length(offset * size) - (radius + thicknes / 2.0));
          float dist = saturate(min(distOut, distIn));
          final = mix(final, hsv_to_rgb(hsv), saturate(distIn));
          final = mix(final, vec3(1.0), dist);
        }

        // Hue wheel and hue marker
        if (vUv.x > split) {
          const float frac = 1.0 / float(stopCount);
          for (int i = 0; i < stopCount; ++i) {
            if (vUv.y <= frac * float(i + 1)) {
              int n = i + 1;
              if (n == stopCount) {
                n = 0;
              };
              final = mix(getStop(i), getStop(n), (vUv.y - frac * float(i)) * 1.0 / frac);
              break;
            }
          }

          // Hue marker
        	float offset = abs(1.0 - vUv.y - hsv[0]);
          float dist = (offset * size.y) - thicknes / 2.0;
          dist = max(1.0 - dist, 0.0);
          final = mix(final, vec3(1.0), dist);
        }

        gl_FragColor = vec4(final, 1.0);
      }
    `;
  }
  static get Listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._onPointerdown(event);
  }
  _onTouchmove(event) {
    event.preventDefault();
    this._onPointermove(event);
  }
  _onTouchend() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onMousedown(event) {
    event.preventDefault();
    this.focus();
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    this._onPointerdown(event);
  }
  _onMousemove(event) {
    this._onPointermove(event);
  }
  _onMouseup() {
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  _onPointerdown(event) {

    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = (pointer.clientX - rect.x) / rect.width;
    this._wheelX = (rect.width - this.wheelWidth / window.devicePixelRatio) / rect.width;
    this._mode = x < this._wheelX ? 'sv' : 'hue';
  }
  _onPointermove(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, (pointer.clientY - rect.y) / rect.height));
    if (this._mode === 'sv') {
      this.hsv[1] = Math.max(0, Math.min(1, x / this._wheelX));
      this.hsv[2] = Math.max(0, Math.min(1, 1 - y));
    }
    if (this._mode === 'hue') {
      this.hsv[0] = Math.max(0, Math.min(1, y));
    }
    this.dispatchEvent('object-mutated', {object: this.hsv}, false, window);
    this.changed();
  }
}

IoColorPicker.Register();
