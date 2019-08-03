import {convert} from "../../../lib/color-convert.js";
import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderHue extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 position = vUv * uSize;

        // Hue spectrum
        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        vec3 finalColor = hsv2rgb(vec3(axis, uHsv[1], uHsv[2]));

        // Marker
        float posX = uSize.x * ((uHorizontal == 1) ? uHsv[0] : 0.5);
        float posY = uSize.y * ((uHorizontal == 1) ? 0.5 : uHsv[0]);
        float radius = cssItemHeight / 5.0;
        float widthX = (uHorizontal == 1) ? cssStrokeWidth * 2.0 : uSize.x;
        float widthY = (uHorizontal == 1) ? uSize.y : cssStrokeWidth * 2.0;

        vec2 markerPos = translate(position, posX, posY);

        markerPos.y = min(
          mod(uSize.y + markerPos.y, uSize.y),
          mod(uSize.y - markerPos.y, uSize.y)
        );

        gl_FragColor = vec4(vec3(markerPos.y), 1.0);

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
    const h = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
    switch (this.mode) {
      case 0:
        this.hsv[0] = h;
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
        break;
    }
  }
}

IoColorSliderHue.Register();
