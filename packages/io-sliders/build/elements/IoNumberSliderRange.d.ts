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
export declare const ioNumberSliderRange: (arg0?: IoElementArgs | Array<import("io-gui").VDOMElement | null> | string, arg1?: Array<import("io-gui").VDOMElement | null> | string) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoNumberSliderRange.d.ts.map