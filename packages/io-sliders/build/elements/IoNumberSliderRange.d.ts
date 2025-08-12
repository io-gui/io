import { IoElement, IoElementProps, WithBinding } from 'io-core';
export type IoNumberSliderRangeProps = IoElementProps & {
    value?: WithBinding<[number, number]>;
    step?: number;
    min?: number;
    max?: number;
    exponent?: number;
    conversion?: number;
};
/**
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 **/
export declare class IoNumberSliderRange extends IoElement {
    static get Style(): string;
    value: [number, number];
    step: number;
    min: number;
    max: number;
    exponent: number;
    conversion: number;
    constructor(args?: IoNumberSliderRangeProps);
    _onNumberSet(event: CustomEvent): void;
    _onSliderSet(event: CustomEvent): void;
    ready(): void;
    changed(): void;
}
export declare const ioNumberSliderRange: (arg0?: IoNumberSliderRangeProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoNumberSliderRange.d.ts.map