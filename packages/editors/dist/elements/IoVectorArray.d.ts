import { IoElement, IoElementProps, WithBinding, VDOMElement } from '@io-gui/core';
export type IoVectorArrayProps = IoElementProps & {
    value?: number[];
    conversion?: number;
    step?: number;
    min?: number;
    max?: number;
    linkable?: boolean;
    linked?: WithBinding<boolean>;
    ladder?: boolean;
    disabled?: boolean;
};
/**
 * Input element for vector arrays and objects.
 **/
export declare class IoVectorArray extends IoElement {
    static get Style(): string;
    value: number[];
    conversion: number;
    step: number;
    min: number;
    max: number;
    linkable: boolean;
    linked: boolean;
    ladder: boolean;
    disabled: boolean;
    keys: number[];
    private _ratios;
    _onNumberPointerDown(event: PointerEvent): void;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    changed(): void;
}
export declare const ioVectorArray: (arg0?: IoVectorArrayProps) => VDOMElement;
//# sourceMappingURL=IoVectorArray.d.ts.map