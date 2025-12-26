var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty } from '@io-gui/core';
import { IoSliderBase } from './IoSliderBase.js';
/**
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 **/
let IoSliderRange = class IoSliderRange extends IoSliderBase {
    _index = 0;
    constructor(args = {}) { super(args); }
    _getCoordFromValue(value) {
        const coord = [0, 0];
        const min = this._min;
        const max = this._max;
        coord[0] = (value[0] - min[0]) / (max[0] - min[0]);
        coord[1] = (value[1] - min[1]) / (max[1] - min[1]);
        return coord;
    }
    onPointerdown(event) {
        super.onPointerdown(event);
        const value = this._value;
        const p = this._getPointerCoord(event);
        const c = this._getCoordFromValue(value);
        this._index = Math.abs(c[0] - p[0]) < Math.abs(c[1] - p[0]) ? 0 : 1;
    }
    onPointermoveThrottled(event) {
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
    static get Frag() {
        return /* glsl */ `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * vec2(uv.x, uv.y - 0.5);
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);

      vec2 valueInRange = (uValue - vec2(uMin)) / (vec2(uMax) - vec2(uMin));

      vec2 valueSign = sign(valueInRange);
      vec2 expValueInRange = pow(abs(valueInRange), vec2(1./uExponent)) * valueSign;
      float valueInRangeWidth = valueInRange[1] - valueInRange[0];
      float valueInRangeCenter = (valueInRange[1] + valueInRange[0]) / 2.0;
      float signRange = sign(valueInRangeWidth);

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = signRange > 0.0 ? io_bgColorBlue.rgb : io_bgColorRed.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(expPosition, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Slider
      float sliderShape = rectangle(translate(expPosition, size.x * valueInRangeCenter, 0.0), vec2(size.x * abs(valueInRangeWidth) * 0.5, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorInput.rgb, gridShape * sliderShape * 0.125));

      // Lines
      float maxPos = expValueInRange[0];
      float minPos = expValueInRange[1];

      float lineMinShape1 = lineVertical(translate(position, maxPos * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineMinShape1));
      float lineMinShape2 = lineVertical(translate(position, maxPos * size.x + io_borderWidth * signRange, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineMinShape2));
      
      float lineMaxShape1 = lineVertical(translate(position, minPos * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineMaxShape1));
      float lineMaxShape2 = lineVertical(translate(position, minPos * size.x - io_borderWidth * signRange, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineMaxShape2));

      gl_FragColor = vec4(finalCol, 1.0);
    }
    `;
    }
};
__decorate([
    ReactiveProperty({ type: Array, value: undefined, init: [0, 0] }) // TODO: Remove value: undefined
], IoSliderRange.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 0.01 })
], IoSliderRange.prototype, "step", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 0 })
], IoSliderRange.prototype, "min", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 1 })
], IoSliderRange.prototype, "max", void 0);
IoSliderRange = __decorate([
    Register
], IoSliderRange);
export { IoSliderRange };
export const ioSliderRange = function (arg0) {
    return IoSliderRange.vConstructor(arg0);
};
//# sourceMappingURL=IoSliderRange.js.map