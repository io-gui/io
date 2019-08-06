import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderSv extends IoColorSlider {
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
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], uv));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsv[1], size.y * uHsv[2]));
        vec4 slider = paintColorSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.valueChanged();
    this.hsv[1] = x;
    this.hsv[2] = y;
    this.setValueFromHsv();
  }
}

IoColorSliderSv.Register();
