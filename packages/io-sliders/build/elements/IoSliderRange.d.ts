import { WithBinding } from 'io-core';
import { IoSliderBase, IoSliderBaseProps } from './IoSliderBase.js';
export type IoSliderRangeProps = IoSliderBaseProps & {
    value?: WithBinding<[number, number]>;
    step?: number;
    min?: number;
    max?: number;
};
/**
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 **/
export declare class IoSliderRange extends IoSliderBase {
    value: [number, number];
    step: number;
    min: number;
    max: number;
    _index: number;
    constructor(args?: IoSliderRangeProps);
    _getCoordFromValue(value: [number, number]): number[];
    onPointerdown(event: PointerEvent): void;
    onPointermoveThrottled(event: PointerEvent): void;
    static get Frag(): string;
}
export declare const ioSliderRange: (arg0?: IoSliderRangeProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoSliderRange.d.ts.map