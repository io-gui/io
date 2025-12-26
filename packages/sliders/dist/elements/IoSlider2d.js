var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, Property } from 'io-core';
import { IoSliderBase } from './IoSliderBase.js';
let IoSlider2d = class IoSlider2d extends IoSliderBase {
    static get Style() {
        return /* css */ `
      :host {
        cursor: crosshair;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        flex-grow: 0;
      }
      :host:not([vertical]),
      :host[vertical] {
        min-width: calc(var(--io_fieldHeight) * 5);
        min-height: calc(var(--io_fieldHeight) * 5);
        cursor: crosshair;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    static get GlUtils() {
        return /* glsl */ `
      vec3 paintKnob(vec3 dstCol, vec2 p, vec2 center, vec3 color) {
        vec4 finalCol = vec4(0.0);
        vec2 pCenter = translate(p, center);
        float radius = io_fieldHeight * 0.25;
        float stroke = io_borderWidth;
        float strokeShape = circle(pCenter, radius + stroke + stroke);
        float fillShape   = circle(pCenter, radius + stroke);
        float colorShape  = circle(pCenter, radius);
        finalCol = mix(io_colorStrong, finalCol, strokeShape);
        finalCol = mix(vec4(io_bgColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(color, 1.0), finalCol, colorShape);
        return compose(dstCol, finalCol);
      }
    `;
    }
    static get Frag() {
        return /* glsl */ `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = io_bgColorBlue.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      vec2 gridSize = size / abs((uMax - uMin) / uStep);
      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 gridPosition = translate(position, -gridOffset);
      float gridShape = paintDerivativeGrid2D(gridPosition, gridSize, io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Axis
      float axisShape = lineCross2d(gridPosition, io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, axisShape));

      // Knob
      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, gridPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
    }
};
__decorate([
    ReactiveProperty({ type: Array, value: undefined, init: [0, 0] }) // TODO: Remove value: undefined
], IoSlider2d.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Array, value: undefined, init: [0.01, 0.01] }) // TODO: Remove value: undefined
], IoSlider2d.prototype, "step", void 0);
__decorate([
    ReactiveProperty({ type: Array, value: undefined, init: [-1, -1] }) // TODO: Remove value: undefined
], IoSlider2d.prototype, "min", void 0);
__decorate([
    ReactiveProperty({ type: Array, value: undefined, init: [1, 1] }) // TODO: Remove value: undefined
], IoSlider2d.prototype, "max", void 0);
__decorate([
    Property(true)
], IoSlider2d.prototype, "noscroll", void 0);
IoSlider2d = __decorate([
    Register
], IoSlider2d);
export { IoSlider2d };
export const ioSlider2d = function (arg0) {
    return IoSlider2d.vConstructor(arg0);
};
//# sourceMappingURL=IoSlider2d.js.map