var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoColorSlider } from './color-slider.js';
/*
 * Modifies **cyan** component the color `value` in **cmyk** color space.
 *
 * <io-element-demo element="io-color-slider-cyan"
 *   properties='{"value": [1, 0.5, 1, 0]}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
let IoColorSliderCyan = class IoColorSliderCyan extends IoColorSlider {
    static get Frag() {
        return /* glsl */ `
      varying vec2 vUv;

      void main(void) {
        vec2 size = (uHorizontal == 1) ? uSize : uSize.yx;
        vec2 uv = uHorizontal == 1 ? vUv.xy : vUv.yx;
        vec2 position = size * uv;

        // Value gradient
        vec3 finalColor = cmyk2rgb(vec4(uv.x, uCmyk[1], uCmyk[2], uCmyk[3]));

        // Marker
        vec2 markerPos = translate(position, vec2(size.x * uCmyk[0], size.y * 0.5));
        vec4 slider = paintColorSlider(markerPos, uRgb);
        finalColor = mix(finalColor, slider.rgb, slider.a);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
    }
    _setIncrease() {
        this.cmyk[0] = Math.min(1, this.cmyk[0] + 0.01);
        this.valueFromCmyk();
    }
    _setDecrease() {
        this.cmyk[0] = Math.max(0, this.cmyk[0] - 0.01);
        this.valueFromCmyk();
    }
    _inputValue(x) {
        this.cmyk[0] = x;
        this.valueFromCmyk();
    }
};
IoColorSliderCyan = __decorate([
    RegisterIoElement
], IoColorSliderCyan);
export { IoColorSliderCyan };
//# sourceMappingURL=color-slider-cyan.js.map