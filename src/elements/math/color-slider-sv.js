import {html} from "../../io.js";
import {IoColorSlider} from "./color-slider.js";
import {chunk} from "../../io-elements-core.js";
import {convert} from "../../../lib/color-convert.js";
import {chunk as colorChunk} from "./gl-chunk.js";

export class IoColorSliderSv extends IoColorSlider {
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

      ${colorChunk}

      ${chunk.translate}
      ${chunk.checker}
      ${chunk.circle}

      void main(void) {
        vec2 position = vUv * uSize;

        // SV gradient
        vec3 finalColor = hsv2rgb(vec3(uHsv[0], vUv.x, vUv.y));

        // Marker
        float posX = uSize.x * uHsv[1];
        float posY = uSize.y * uHsv[2];
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
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, 1 - y));
    switch (this.mode) {
      case 0:
        this.hsv[1] = x;
        this.hsv[2] = y;
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
        this.hsv[1] = x;
        this.hsv[2] = y;
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
        this.value[this.components[1]] = x;
        this.value[this.components[2]] = y;
        break;
      case 2:
        this.hsv[1] = x;
        this.hsv[2] = y;
        const hsl = convert.rgb.hsl(convert.hsv.rgb([
          this.hsv[0] * 100,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]));
        this.value[this.components[0]] = hsl[0] / 100;
        this.value[this.components[1]] = hsl[1] / 100;
        this.value[this.components[2]] = hsl[2] / 100;
        break;
    }
  }
}

IoColorSliderSv.Register();
