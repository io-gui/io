import { IoElement, VDOMElement, IoElementArgs, ArgsWithBinding } from 'io-gui';
export type IoNumberSliderArgs = IoElementArgs & ArgsWithBinding<{
    value?: number;
    step?: number;
    min?: number;
    max?: number;
    exponent?: number;
    conversion?: number;
}>;
/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 **/
export declare class IoNumberSlider extends IoElement {
    static vConstructor: (arg0?: IoNumberSliderArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: number;
    step: number;
    min: number;
    max: number;
    exponent: number;
    conversion: number;
    constructor(args?: IoNumberSliderArgs);
    _onNumberSet(event: CustomEvent): void;
    _onSliderSet(event: CustomEvent): void;
    init(): void;
    changed(): void;
}
export declare const ioNumberSlider: (arg0?: IoNumberSliderArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNumberSlider.d.ts.map