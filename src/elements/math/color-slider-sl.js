import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";
import {convert} from "../../../lib/color-convert.js";

export class IoColorSliderSl extends IoColorSlider {
  static get Style() {
    return html`<style>
      :host {
        cursor: move !important;
      }
    </style>`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // SV gradient
        vec3 finalColor = hsl2rgb(vec3(uHsl[0], uv));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsl[1], size.y * uHsl[2]));
        vec4 slider = paintSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.valueChanged();
    this.hsl[1] = x;
    this.hsl[2] = y;
    switch (this.mode) {
      case 0: {
        const rgb = convert.hsl.rgb([
          this.hsl[0] * 360,
          this.hsl[1] * 100,
          this.hsl[2] * 100,
        ]);
        this.value[this.components[0]] = rgb[0] / 255;
        this.value[this.components[1]] = rgb[1] / 255;
        this.value[this.components[2]] = rgb[2] / 255;
        break;
      }
      case 3: {
        const cmyk = convert.rgb.cmyk(convert.hsl.rgb([
          this.hsl[0] * 360,
          this.hsl[1] * 100,
          this.hsl[2] * 100,
        ]));
        this.value[this.components[0]] = cmyk[0] / 100;
        this.value[this.components[1]] = cmyk[1] / 100;
        this.value[this.components[2]] = cmyk[2] / 100;
        this.value[this.components[3]] = cmyk[3] / 100;
        break;
      }
      case 1: {
        const hsv = convert.rgb.hsv(convert.hsl.rgb([
          this.hsl[0] * 100,
          this.hsl[1] * 100,
          this.hsl[2] * 100,
        ]));
        this.value[this.components[0]] = hsv[0] / 100;
        this.value[this.components[1]] = hsv[1] / 100;
        this.value[this.components[2]] = hsv[2] / 100;
        break;
      }
      case 2: {
        this.value[this.components[1]] = this.hsl[1];
        this.value[this.components[2]] = this.hsl[2];
        break;
      }
    }
  }
}

IoColorSliderSl.Register();
