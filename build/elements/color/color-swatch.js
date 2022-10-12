var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoGl } from '../../core/gl.js';
import { IoColorMixin } from './color.js';
/*
 * Extends `IoColorMixin(IoGl)`.
 *
 * Display element for color.
 *
 * <io-element-demo element="io-color-swatch"
 * properties='{"value": [1, 0.5, 0, 1]}'
 * config='{"value": ["io-properties"]}
 * '></io-element-demo>
 **/
let IoColorSwatch = class IoColorSwatch extends IoColorMixin(IoGl) {
    static get Style() {
        return /* css */ `
    :host {
      box-sizing: border-box;
      align-self: flex-start;
      border-radius: var(--io-border-radius);
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
      min-width: var(--io-field-height);
      min-height: var(--io-field-height);
    }
    :host[aria-invalid] {
      border: var(--io-border-error);
    }
    :host:focus {
      border-color: var(--io-color-focus);
      outline-color: var(--io-color-focus);
    }
    `;
    }
    static get Frag() {
        return /* glsl */ `
      varying vec2 vUv;
      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 6.));

        float alpha = uAlpha;
        float lineWidth = cssStrokeWidth * 2.0;
        vec2 pxUv = vUv * uSize;
        if (pxUv.x < lineWidth) alpha = 1.0;
        if (pxUv.y < lineWidth) alpha = 1.0;
        if (pxUv.x > uSize.x - lineWidth) alpha = 1.0;
        if (pxUv.y > uSize.y - lineWidth) alpha = 1.0;

        gl_FragColor = saturate(vec4(mix(alphaPattern, uRgb.rgb, alpha), 1.0));
      }
    `;
    }
};
IoColorSwatch = __decorate([
    RegisterIoElement
], IoColorSwatch);
export { IoColorSwatch };
//# sourceMappingURL=color-swatch.js.map