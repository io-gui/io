import {html, IoGl} from "../io.js";

export class IoColorPicker extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        cursor: move;
        min-width: 2.75em;
        min-height: 1.375em;
      }
      :host[aria-invalid] {
        outline: 1px solid var(--io-color-focus);
      }
      :host:focus {
        outline: 1px solid var(--io-color-focus);
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
      width: 16,
      thicknes: 3,
      color: [0, 0, 0, 1],
      hsva: [0.5, 0.5, 0.5, 1],
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
        vec3 rgb = hue_to_rgb(hsv.r);
        return ((rgb - 1.0) * hsv.g + 1.0) * hsv.b;
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

        vec2 alphaPos = floor(vUv * size / 32.0 * 3.0);
        float alphaMask = mod(alphaPos.x + mod(alphaPos.y, 2.0), 2.0);
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), alphaMask);

        vec3 currentColor = hsv_to_rgb(hsva.xyz);

        vec3 final = alphaPattern;

        float split = (size.x - width * 2.0) / size.x;

        if (vUv.x <= split) {

          // SV gradient
          final = hsv_to_rgb(vec3(hsva[0], vUv.x / split, vUv.y));

          // Color marker
          float offset = length((vUv - vec2(hsva[1] * split, hsva[2])) * size);

          float distOut = (offset - (0.5 * width - (thicknes / 2.0)));
          float distIn = 1.0 - (offset - (0.5 * width + (thicknes / 2.0)));
          float dist = saturate(min(distOut, distIn));

          float distOut2 = (offset - (0.5 * width - ((thicknes + 2.0) / 2.0)));
          float distIn2 = 1.0 - (offset - (0.5 * width + ((thicknes + 2.0) / 2.0)));
          float dist2 = saturate(min(distOut2, distIn2));

          currentColor = mix(alphaPattern, currentColor, hsva.a);

          final = mix(final, currentColor, saturate(distIn));
          final = mix(final, vec3(0.0), dist2);
          final = mix(final, vec3(1.0), dist);

        }

        if (vUv.x > split) {

          // Hue spectrum
          final = hsv_to_rgb(vec3(vUv.y, 1.0, 1.0));

          // Hue marker
        	float hueMarkerOffset = abs(vUv.y - hsva[0]) * size.y;
          float dist = hueMarkerOffset - thicknes / 2.0;
          float dist2 = hueMarkerOffset - (thicknes + 2.0) / 2.0;
          final = mix(final, vec3(0.0), max(1.0 - dist2, 0.0));
          final = mix(final, vec3(1.0), max(1.0 - dist, 0.0));

        }

        if (vUv.x > (split + 1.0) / 2.0) {

          // Apha gradient
          final = mix(alphaPattern, currentColor, vUv.y);

          // Apha marker
        	float hueMarkerOffset = abs(vUv.y - hsva[3]) * size.y;
          float dist = hueMarkerOffset - thicknes / 2.0;
          float dist2 = hueMarkerOffset - (thicknes + 2.0) / 2.0;
          final = mix(final, vec3(0.0), max(1.0 - dist2, 0.0));
          final = mix(final, vec3(1.0), max(1.0 - dist, 0.0));

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
    this._hueSplit = (rect.width - (this.width * 2) / window.devicePixelRatio) / rect.width;
    this._alphaSplit = (rect.width - (this.width * 1) / window.devicePixelRatio) / rect.width;
    this._mode = 'sv';
    if (x > this._hueSplit) this._mode = 'h';
    if (x > this._alphaSplit) this._mode = 'a';
  }
  _onPointermove(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, (pointer.clientY - rect.y) / rect.height));
    if (this._mode === 'sv') {
      this.hsva[1] = Math.max(0, Math.min(1, x / this._hueSplit));
      this.hsva[2] = Math.max(0, Math.min(1, 1 - y));
    }
    if (this._mode === 'h') {
      this.hsva[0] = Math.max(0, Math.min(1, 1 - y));
    }
    if (this._mode === 'a') {
      this.hsva[3] = Math.max(0, Math.min(1, 1 - y));
    }
    this.dispatchEvent('object-mutated', {object: this.hsva}, false, window);
    this.changed();
  }
}

IoColorPicker.Register();

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
