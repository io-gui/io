import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderLevel extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = hsl2rgb(vec3(uHsl[0], uHsl[1], uv.x));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uHsl[2], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setIncrease() {
    this.hsv[2] = Math.min(1, this.hsv[2] + 0.01);
    this.setValueFromHsl();
  }
  _setDecrease() {
    this.hsv[2] = Math.max(0, this.hsv[2] - 0.01);
    this.setValueFromHsl();
  }
  _setValue(x) {
    this.hsl[2] = x;
    this.setValueFromHsl();
  }
}

IoColorSliderLevel.Register();
