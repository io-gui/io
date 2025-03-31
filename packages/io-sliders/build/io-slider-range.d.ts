import { IoSliderBase } from './io-slider-base.js';
/**
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 *
 * Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.
 *
 * <io-element-demo element="io-slider-range" properties='{"value": [0, 1], "step": 0.1, "min": -1, "max": 2, "exponent": 1}'></io-element-demo>
 **/
export declare class IoSliderRange extends IoSliderBase {
    value: [number, number];
    step: number;
    min: number;
    max: number;
    _index: number;
    _getCoordFromValue(value: [number, number]): number[];
    _onPointerdown(event: PointerEvent): void;
    _onPointermoveThrottled(event: PointerEvent): void;
    static get Frag(): string;
}
export declare const ioSliderRange: (arg0?: import("io-gui").IoNodeArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-slider-range.d.ts.map