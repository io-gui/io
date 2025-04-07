import { IoElement, VDOMArray, IoElementArgs, ArgsWithBinding } from 'io-gui';
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
 *
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.01, "conversion": 1, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.1, "conversion": 0.2, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
export declare class IoNumberSlider extends IoElement {
    static vConstructor: (arg0?: IoNumberSliderArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
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
export declare const ioNumberSlider: (arg0?: IoNumberSliderArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-number-slider.d.ts.map