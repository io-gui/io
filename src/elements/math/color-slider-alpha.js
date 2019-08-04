import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderAlpha extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));
        vec3 finalColor = alphaPattern;

        // Apha gradient
        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        finalColor = mix(finalColor, vec3(1.0), axis);

        // Marker
        vec2 markerPos = translateSlider(position, vec2(uAlpha, 0.5));
        vec4 slider = paintSlider(markerPos, vec3(1.0));
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  valueChanged() {
    super.valueChanged();
    const hasAlpha = this.value[this.components[3]] !== undefined;
    this.setAttribute('aria-invalid', !hasAlpha ? 'true' : false);
  }
  _setValue(_x, _y) {
    this.valueChanged();
    const y = Math.max(0, Math.min(1, this.horizontal ? _x : (1 - _y)));
    const c = this.mode === 3 ? 4 : 3;
    const hasAlpha = this.value[this.components[c]] !== undefined;
    if (hasAlpha) this.value[this.components[c]] = y;
  }
}

IoColorSliderAlpha.Register();
