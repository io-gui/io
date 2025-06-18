import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
export type IoNumberSliderProps = IoElementProps & {
    value?: WithBinding<number>;
    step?: number;
    min?: number;
    max?: number;
    exponent?: number;
    conversion?: number;
};
/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 **/
export declare class IoNumberSlider extends IoElement {
    static vConstructor: (arg0?: IoNumberSliderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: number;
    step: number;
    min: number;
    max: number;
    exponent: number;
    conversion: number;
    constructor(args?: IoNumberSliderProps);
    _onNumberSet(event: CustomEvent): void;
    _onSliderSet(event: CustomEvent): void;
    ready(): void;
    changed(): void;
}
export declare const ioNumberSlider: (arg0?: IoNumberSliderProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNumberSlider.d.ts.map