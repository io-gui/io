import { IoElement, IoElementProps, WithBinding, VDOMElement } from '@io-gui/core';
export type IoVectorProps = IoElementProps & {
    value?: {
        x?: number;
        y?: number;
        z?: number;
        w?: number;
        r?: number;
        g?: number;
        b?: number;
        a?: number;
        u?: number;
        v?: number;
    };
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
export declare class IoVector extends IoElement {
    static get Style(): string;
    value: {
        x?: number;
        y?: number;
        z?: number;
        w?: number;
        r?: number;
        g?: number;
        b?: number;
        a?: number;
        u?: number;
        v?: number;
    };
    conversion: number;
    step: number;
    min: number;
    max: number;
    linkable: boolean;
    linked: boolean;
    ladder: boolean;
    disabled: boolean;
    keys: string[];
    private _ratios;
    _onNumberPointerDown(event: PointerEvent): void;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    changed(): void;
}
export declare const ioVector: (arg0?: IoVectorProps) => VDOMElement;
//# sourceMappingURL=IoVector.d.ts.map