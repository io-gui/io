import {chunk} from "../../io-elements-core.js";
import {chunk as colorChunk} from "./gl-chunk.js";
import {convert} from "../../../lib/color-convert.js";
import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderLevel extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${colorChunk}

      ${chunk.translate}
      ${chunk.checker}
      ${chunk.circle}
      ${chunk.rectangle}

      void main(void) {
        vec2 position = vUv * uSize;

        // Value gradient
        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        vec3 finalColor = hsl2rgb(vec3(uHsl[0], uHsl[1], axis));

        // Marker
        float posX = uSize.x * ((uHorizontal == 1) ? uHsl[2] : 0.5);
        float posY = uSize.y * ((uHorizontal == 1) ? 0.5 : uHsl[2]);
        float radius = cssItemHeight / 5.0;
        float widthX = (uHorizontal == 1) ? cssStrokeWidth * 2.0 : uSize.x;
        float widthY = (uHorizontal == 1) ? uSize.y : cssStrokeWidth * 2.0;

        vec2 markerPos = translate(position, posX, posY);

        float circleStrokeShape = circle(markerPos, radius + cssStrokeWidth);
        float rectStrokeShape = rectangle(markerPos, vec2(widthX + cssStrokeWidth, widthY + cssStrokeWidth));
        finalColor = mix(cssColor.rgb, finalColor, min(rectStrokeShape, circleStrokeShape));

        float circleShape = circle(markerPos, radius);
        float rectShape = rectangle(markerPos, vec2(widthX, widthY));
        finalColor = mix(cssBackgroundColor.rgb, finalColor, min(rectShape, circleShape));

        float circleInnerShape = circle(markerPos, radius - cssStrokeWidth);
        float rectInnerShape = rectangle(markerPos, vec2(widthX - cssStrokeWidth, widthY - cssStrokeWidth));
        finalColor = mix(uRgb, finalColor, min(rectInnerShape, circleInnerShape));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.valueChanged();
    const l = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
    switch (this.mode) {
      case 0:
        this.hsl[2] = l;
        const rgb = convert.hsl.rgb([
          this.hsl[0] * 360,
          this.hsl[1] * 100,
          this.hsl[2] * 100,
        ]);
        this.value[this.components[0]] = rgb[0] / 255;
        this.value[this.components[1]] = rgb[1] / 255;
        this.value[this.components[2]] = rgb[2] / 255;
        break;
      case 3:
        this.hsl[2] = l;
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
      case 1:
        this.hsl[2] = l;
        const hsv = convert.rgb.hsv(convert.hsl.rgb([
          this.hsl[0] * 100,
          this.hsl[1] * 100,
          this.hsl[2] * 100,
        ]));
        this.value[this.components[0]] = hsv[0] / 100;
        this.value[this.components[1]] = hsv[1] / 100;
        this.value[this.components[2]] = hsv[2] / 100;
        break;
      case 2:
        this.value[this.components[2]] = l;
        break;
    }
  }
}

IoColorSliderLevel.Register();
