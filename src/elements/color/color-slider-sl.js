import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";

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
        vec4 slider = paintColorSlider2D(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.valueChanged();
    this.hsl[1] = x;
    this.hsl[2] = y;
    this.setValueFromHsl();
  }
}

IoColorSliderSl.Register();
