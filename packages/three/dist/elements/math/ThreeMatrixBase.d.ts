import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
export type ThreeMatrixBaseProps = ReactiveElementProps & {
    value?: number[];
    disabled?: boolean;
};
/**
 * Input element for vector arrays and objects.
 **/
export declare class ThreeMatrixBase extends ReactiveElement {
    static get Style(): string;
    value: Array<number>;
    disabled: boolean;
    keys: number[];
    constructor(args: ThreeMatrixBaseProps);
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    mutated(): void;
}
