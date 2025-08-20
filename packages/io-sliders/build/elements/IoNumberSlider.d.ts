import { IoElement, IoElementProps, WithBinding } from 'io-core';
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
export declare const ioNumberSlider: (arg0?: IoNumberSliderProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoNumberSlider.d.ts.map