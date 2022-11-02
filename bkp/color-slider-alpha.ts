import { RegisterIoElement } from '../../core/element.js';
import {IoColorSlider} from './color-slider.js';

/*
 * Modifies **alpha** component the color `value`.
 *
 * <io-element-demo element="io-color-slider-alpha"
 *   properties='{"value": [1, 0.5, 0, 1]}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
@RegisterIoElement
export class IoColorSliderAlpha extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 uv = uVertical == 1 ? vUv.yx : vUv;
        vec2 position = size * uv;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 6.));
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
  changed() {
    // TODO: improve.
    const i = this.mode === 3 ? 4 : 3;
    const components = Object.keys(this.value);
    const hasAlpha = this.value[components[i]] !== undefined;
    if (!hasAlpha) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }
  _setIncrease() {
    const i = this.mode === 3 ? 4 : 3;
    const components = Object.keys(this.value);
    this.value[components[i]] = Math.min(1, this.value[components[i]] + 0.01);
  }
  _setDecrease() {
    const i = this.mode === 3 ? 4 : 3;
    const components = Object.keys(this.value);
    this.value[components[i]] = Math.max(0, this.value[components[i]] - 0.01);
  }
  _setMin() {
    const i = this.mode === 3 ? 4 : 3;
    const components = Object.keys(this.value);
    this.value[components[i]] = 0;
  }
  _setMax() {
    const i = this.mode === 3 ? 4 : 3;
    const components = Object.keys(this.value);
    this.value[components[i]] = 1;
  }
  _inputValue(x: number) {
    const i = this.mode === 3 ? 4 : 3;
    const components = Object.keys(this.value);
    const hasAlpha = this.value[components[i]] !== undefined;
    if (hasAlpha) this.value[components[i]] = x;
  }
}
