import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";
import {convert} from "../../../lib/color-convert.js";

export class IoColorSliderHs extends IoColorSlider {
  static get Style() {
    return html`<style>
      :host {
        cursor: move;
      }
    </style>`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 position = vUv * uSize;

        // HS gradient
        vec3 finalColor = hsv2rgb(vec3(vUv.x, vUv.y, uHsv[2]));
        float saturation = uHsv[1];
        if (uMode == 2.0) {
          saturation = uHsl[1];
          finalColor = hsl2rgb(vec3(vUv.x, vUv.y, uHsl[2]));
        }

        // Marker
        float posX = uSize.x * uHsv[0];
        float posY = uSize.y * uHsv[1];
        float radius = min(cssItemHeight / 2., min(uSize.x / 4., uSize.y / 4.));

        vec2 markerPos = translate(position, posX, posY);

        float circleStrokeShape = circle(markerPos, radius + cssStrokeWidth);
        finalColor = mix(cssColor.rgb, finalColor, circleStrokeShape);

        float circleShape = circle(markerPos, radius);
        finalColor = mix(cssBackgroundColor.rgb, finalColor, circleShape);

        float circleInnerShape = circle(markerPos, radius - cssStrokeWidth);
        finalColor = mix(uRgb, finalColor, circleInnerShape);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.valueChanged();
    const h = Math.max(0, Math.min(1, x));
    const s = Math.max(0, Math.min(1, 1 - y))
    switch (this.mode) {
      case 0:
        this.hsv[0] = h;
        this.hsv[1] = s;
        const rgb = convert.hsv.rgb([
          this.hsv[0] * 360,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]);
        this.value[this.components[0]] = rgb[0] / 255;
        this.value[this.components[1]] = rgb[1] / 255;
        this.value[this.components[2]] = rgb[2] / 255;
        break;
      case 3:
        this.hsv[0] = h;
        this.hsv[1] = s;
        const cmyk = convert.rgb.cmyk(convert.hsv.rgb([
          this.hsv[0] * 360,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]));
        this.value[this.components[0]] = cmyk[0] / 100;
        this.value[this.components[1]] = cmyk[1] / 100;
        this.value[this.components[2]] = cmyk[2] / 100;
        this.value[this.components[3]] = cmyk[3] / 100;
        break;
      case 1:
      case 2:
        this.value[this.components[0]] = h;
        this.value[this.components[1]] = s;
        break;
    }
  }
}

IoColorSliderHs.Register();
