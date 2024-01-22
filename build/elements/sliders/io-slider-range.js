var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoSliderBase } from './io-slider-base.js';
/**
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider-range" properties='{"value": [0, 1], "step": 0.1, "min": -1, "max": 2, "exponent": 1}'></io-element-demo>
 **/
let IoSliderRange = class IoSliderRange extends IoSliderBase {
    _index = 0;
    _getCoordFromValue(value) {
        const coord = [0, 0];
        const min = this._min;
        const max = this._max;
        coord[0] = (value[0] - min[0]) / (max[0] - min[0]);
        coord[1] = (value[1] - min[1]) / (max[1] - min[1]);
        return coord;
    }
    _onPointerdown(event) {
        super._onPointerdown(event);
        const value = this._value;
        const p = this._getPointerCoord(event);
        const c = this._getCoordFromValue(value);
        this._index = Math.abs(c[0] - p[0]) < Math.abs(c[1] - p[0]) ? 0 : 1;
    }
    _onPointermoveThrottled(event) {
        if (this._active === 1) {
            if (document.activeElement !== this)
                this.focus();
            const value = this._value;
            const coord = this._getPointerCoord(event);
            const newValue = this._getValueFromCoord(coord);
            if (this._index === 0) {
                this._inputValue([newValue[0], value[1]]);
            }
            else if (this._index === 1) {
                this._inputValue([value[0], newValue[0]]);
            }
        }
    }
    static get GlUtils() {
        return /* glsl */ `
      vec3 paintSliderRange(vec3 dstCol, vec2 p, vec2 size, vec3 colorStart, vec3 colorEnd) {
        vec4 finalCol = vec4(0.0);

        float valueInRangeStart = (uValue[0] - uMin) / (uMax - uMin);
        float signStart = valueInRangeStart < 0.0 ? -1.0 : 1.0;
        valueInRangeStart = abs(pow(valueInRangeStart, 1./uExponent)) * signStart;

        float valueInRangeEnd = (uValue[1] - uMin) / (uMax - uMin);
        valueInRangeEnd = abs(pow(valueInRangeEnd, 1./uExponent));

        vec2 start = vec2(size.x * min(2.0, max(-1.0, (valueInRangeStart))), size.y * 0.5);
        vec2 end = vec2(size.x * min(2.0, max(-1.0, (valueInRangeEnd))), size.y * 0.5);

        vec2 pStart = translate(p, start);
        vec2 pEnd = translate(p, end);
        vec2 pCenter = (pStart + pEnd) / 2.0;
        float slotHalfWidth = abs(pStart.x - pEnd.x) / 2.0;

        float slotThickness = iotFieldHeight * 0.125;
        float knobRadius = iotFieldHeight * 0.25;

        float strokeShape = min(min(
          circle(pStart, knobRadius + iotStrokeWidth + iotStrokeWidth),
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + iotStrokeWidth + iotStrokeWidth))),
          circle(pEnd, knobRadius + iotStrokeWidth + iotStrokeWidth)
        );

        float fillShape   = min(min(
          circle(pStart, knobRadius + iotStrokeWidth),
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + iotStrokeWidth))),
          circle(pEnd, knobRadius + iotStrokeWidth)
        );
        float colorShape  = min(min(
          circle(pStart, knobRadius),
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness))),
          circle(pEnd, knobRadius)
        );

        float grad = (p.x - start.x) / (end.x - start.x);
        vec3 sloiotGradient = mix(colorStart, colorEnd, saturate(grad));

        finalCol = mix(iotColor, finalCol, strokeShape);
        finalCol = mix(vec4(iotBackgroundColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(sloiotGradient, 1.0), finalCol, colorShape);

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
      vec2 position = size * uv;

      // Colors
      vec3 finalCol = iotBackgroundColorField.rgb;
      vec4 gridCol = mix(iotColor, iotBackgroundColorField, 0.85);

      // Sizes
      float gridThickness = iotStrokeWidth;
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;

      // Grid
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
      vec2 gridPosition = translate(expPosition, gridOffset, size.y / 2.);
      float gridShape = grid2d(gridPosition, vec2(gridSize, size.y + gridThickness * 2.0), gridThickness);

      if (gridSize > gridThickness * 2.0) {
        finalCol = compose(finalCol, vec4(gridCol.rgb, gridShape));
      }

      // Line
      vec3 lineCol = mix(iotColorSelected.rgb, iotBackgroundColorField.rgb, 0.75);
      finalCol = paintHorizontalLine(finalCol, gridPosition, lineCol);

      // Slider
      finalCol = paintSliderRange(finalCol, position, size, iotColorSelected.rgb, iotColorLink.rgb);

      gl_FragColor = vec4(finalCol, 1.0);
    }
    `;
    }
};
__decorate([
    Property({ value: null, type: Array, init: [0, 0], observe: true })
], IoSliderRange.prototype, "value", void 0);
__decorate([
    Property(0.01)
], IoSliderRange.prototype, "step", void 0);
__decorate([
    Property(0)
], IoSliderRange.prototype, "min", void 0);
__decorate([
    Property(1)
], IoSliderRange.prototype, "max", void 0);
IoSliderRange = __decorate([
    Register
], IoSliderRange);
export { IoSliderRange };
//# sourceMappingURL=io-slider-range.js.map