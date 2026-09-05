import { ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
export type IoNumberSliderProps = ReactiveElementProps & {
    value?: WithBinding<number>;
    step?: WithBinding<number>;
    min?: WithBinding<number>;
    max?: WithBinding<number>;
    exponent?: WithBinding<number>;
    conversion?: WithBinding<number>;
    disabled?: WithBinding<boolean>;
};
/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 **/
export declare class IoNumberSlider extends ReactiveElement {
    static get Style(): string;
    value: number;
    step: number;
    min: number;
    max: number;
    exponent: number;
    conversion: number;
    disabled: boolean;
    constructor(args?: IoNumberSliderProps);
    _onNumberSet(event: CustomEvent): void;
    _onSliderSet(event: CustomEvent): void;
    ready(): void;
    mutated(): void;
}
export declare const ioNumberSlider: (arg0?: IoNumberSliderProps) => import("@io-gui/core").VDOMElement;
