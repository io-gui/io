import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderAlpha extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));
        vec3 finalColor = alphaPattern;

        // Apha gradient
        finalColor = mix(finalColor, vec3(1.0), uv.x);

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uAlpha, size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, vec3(1.0));
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  setAria() {
    // TODO
    const hasAlpha = this.value[this.components[3]] !== undefined;
    this.setAttribute('aria-invalid', !hasAlpha ? 'true' : false);
  }
  _setIncrease() {
  }
  _setDecrease() {
  }
  _setMin() {
    this.value[this.components[c]] = 0;
  }
  _setMax() {
    this.value[this.components[c]] = 1;
  }
  _setValue(x) {
    this.valueChanged();
    const c = this.mode === 3 ? 4 : 3;
    const hasAlpha = this.value[this.components[c]] !== undefined;
    if (hasAlpha) this.value[this.components[c]] = x;
  }
}

IoColorSliderAlpha.Register();
