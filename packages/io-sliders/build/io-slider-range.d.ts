import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoSliderBase, IoSliderBaseArgs } from './io-slider-base.js';
export type IoSliderRangeArgs = IoSliderBaseArgs & ArgsWithBinding<{}>;
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
    onPointerdown(event: PointerEvent): void;
    onPointermoveThrottled(event: PointerEvent): void;
    static get Frag(): string;
    static vDOM: (arg0?: IoSliderRangeArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioSliderRange: (arg0?: IoSliderRangeArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-slider-range.d.ts.map