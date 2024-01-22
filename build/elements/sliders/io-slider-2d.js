var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoSliderBase } from './io-slider-base.js';
let IoSlider2d = class IoSlider2d extends IoSliderBase {
    static get Style() {
        return /* css */ `
      :host {
        cursor: crosshair;
        border: var(--iotBorder);
        border-radius: var(--iotBorderRadius);
        border-color: var(--iotBorderColorInset);
        flex-grow: 0;
      }
      :host:not([vertical]),
      :host[vertical] {
        width: var(--iotFieldHeight4);
        height: var(--iotFieldHeight4);
        min-width: var(--iotFieldHeight4);
        min-height: var(--iotFieldHeight4);
        cursor: crosshair;
      }
    `;
    }
    static get GlUtils() {
        return /* glsl */ `
      vec3 paintKnob(vec3 dstCol, vec2 p, vec2 center, vec3 color) {
        vec4 finalCol = vec4(0.0);
        vec2 pCenter = translate(p, center);
        float radius = iotFieldHeight * 0.25;
        float strokeShape = circle(pCenter, radius + iotStrokeWidth + iotStrokeWidth);
        float fillShape   = circle(pCenter, radius + iotStrokeWidth);
        float colorShape  = circle(pCenter, radius);
        finalCol = mix(iotColor, finalCol, strokeShape);
        finalCol = mix(vec4(iotBackgroundColor.rgb, 1.0), finalCol, fillShape);
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
      vec3 finalCol = iotBackgroundColorField.rgb;
      vec3 gridCol = mix(iotColor.rgb, iotBackgroundColorField.rgb, 0.95);
      vec3 axisCol = mix(iotColorSelected.rgb, iotBackgroundColorField.rgb, 0.75);
      vec3 sliderCol = iotColorLink.rgb;

      // // Sizes
      float gridThickness = iotStrokeWidth;
      vec2  gridSize = size / abs((uMax - uMin) / uStep);
      vec2  gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;

      vec2 offsetPosition = translate(position, -gridOffset);
      float gridShape = grid2d(offsetPosition, gridSize, gridThickness);
      float axisShape = lineCross2d(offsetPosition, gridThickness);

      if (max(gridSize.x, gridSize.y) > gridThickness * 2.0) {
        finalCol = compose(finalCol, vec4(gridCol, gridShape));
        finalCol = compose(finalCol, vec4(axisCol, axisShape));
      }

      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, offsetPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
    }
};
__decorate([
    Property({ value: null, type: Array, init: [0, 0], observe: true })
], IoSlider2d.prototype, "value", void 0);
__decorate([
    Property({ value: null, type: Array, init: [0.01, 0.01] })
], IoSlider2d.prototype, "step", void 0);
__decorate([
    Property({ value: null, type: Array, init: [-1, -1] })
], IoSlider2d.prototype, "min", void 0);
__decorate([
    Property({ value: null, type: Array, init: [1, 1] })
], IoSlider2d.prototype, "max", void 0);
__decorate([
    Property(true)
], IoSlider2d.prototype, "noscroll", void 0);
IoSlider2d = __decorate([
    Register
], IoSlider2d);
export { IoSlider2d };
//# sourceMappingURL=io-slider-2d.js.map