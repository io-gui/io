import { VDOMElement } from 'io-gui';
import { IoSliderBase, IoSliderBaseProps } from './IoSliderBase.js';
export type IoSliderRangeProps = IoSliderBaseProps & {};
/**
 * Input element for `Array(2)` data type displayed as slider.
 * It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.
 **/
export declare class IoSliderRange extends IoSliderBase {
    static vConstructor: (arg0?: IoSliderRangeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
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
export declare const ioSliderRange: (arg0?: IoSliderRangeProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoSliderRange.d.ts.map