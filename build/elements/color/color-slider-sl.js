var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoColorSlider } from './color-slider.js';
/*
 * 2D slider. Modifies **saturation** and **level** of the color `value` in **hsl** color space.
 *
 * <io-element-demo element="io-color-slider-sl"
 *   width="64px" height="64px"
 *   properties='{"value": [1, 0.5, 0, 1], "horizontal": true}'
 *   config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
let IoColorSliderSl = class IoColorSliderSl extends IoColorSlider {
    static get Style() {
        return /* css */ `
    :host {
      cursor: move !important;
    }
    `;
    }
    static get Properties() {
        return {
            noscroll: true,
        };
    }
    static get Frag() {
        return /* glsl */ `
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
    _onKeydown(event) {
        if (event.shiftKey && event.key === 'ArrowLeft') {
            event.preventDefault();
            if (this.horizontal) {
                this.hsl[1] = Math.max(0, this.hsl[1] - 0.01);
            }
            else {
                this.hsl[2] = Math.max(0, this.hsl[2] - 0.01);
            }
            this.valueFromHsl();
        }
        else if (event.shiftKey && event.key === 'ArrowUp') {
            event.preventDefault();
            if (this.horizontal) {
                this.hsl[2] = Math.min(1, this.hsl[2] + 0.01);
            }
            else {
                this.hsl[1] = Math.min(1, this.hsl[1] + 0.01);
            }
            this.valueFromHsl();
        }
        else if (event.shiftKey && event.key === 'ArrowRight') {
            event.preventDefault();
            if (this.horizontal) {
                this.hsl[1] = Math.min(1, this.hsl[1] + 0.01);
            }
            else {
                this.hsl[2] = Math.min(1, this.hsl[2] + 0.01);
            }
            this.valueFromHsl();
        }
        else if (event.shiftKey && event.key === 'ArrowDown') {
            event.preventDefault();
            if (this.horizontal) {
                this.hsl[2] = Math.max(0, this.hsl[2] - 0.01);
            }
            else {
                this.hsl[1] = Math.max(0, this.hsl[1] - 0.01);
            }
            this.valueFromHsl();
        }
        else {
            super._onKeydown(event);
        }
    }
    _inputValue(x, y) {
        this.hsl[1] = x;
        this.hsl[2] = y;
        this.valueFromHsl();
    }
};
IoColorSliderSl = __decorate([
    RegisterIoElement
], IoColorSliderSl);
export { IoColorSliderSl };
//# sourceMappingURL=color-slider-sl.js.map