import { IoElement, IoElementArgs, ArgsWithBinding } from 'io-gui';
export type IoNumberSliderRangeArgs = IoElementArgs & ArgsWithBinding<{
    value?: [number, number];
    step?: number;
    min?: number;
    max?: number;
    exponent?: number;
    conversion?: number;
}>;
/**
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 *
 * <io-element-demo element="io-number-slider-range" properties='{"value": [0, 2], "step": 0.05, "min": -1, "max": 2}'></io-element-demo>
 **/
export declare class IoNumberSliderRange extends IoElement {
    static get Style(): string;
    value: [number, number];
    step: number;
    min: number;
    max: number;
    exponent: number;
    conversion: number;
    constructor(args?: IoNumberSliderRangeArgs);
    _onNumberSet(event: CustomEvent): void;
    _onSliderSet(event: CustomEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioNumberSliderRange: (arg0?: IoElementArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-number-slider-range.d.ts.map