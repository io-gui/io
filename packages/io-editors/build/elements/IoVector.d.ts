import { IoElement, IoElementProps, PropsWithBinding, VDOMElement } from 'io-gui';
export type IoVectorProps = IoElementProps & PropsWithBinding<{
    value?: {
        x: number;
        y: number;
        z?: number;
        w?: number;
    } | number[];
    conversion?: number;
    step?: number;
    min?: number;
    max?: number;
    linkable?: boolean;
    linked?: boolean;
    ladder?: boolean;
}>;
/**
 * Input element for vector arrays and objects.
 **/
export declare class IoVector extends IoElement {
    static vConstructor: (arg0?: IoVectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: {
        x: number;
        y: number;
        z?: number;
        w?: number;
    } | number[];
    conversion: number;
    step: number;
    min: number;
    max: number;
    linkable: boolean;
    linked: boolean;
    ladder: boolean;
    keys: string[];
    private _ratios;
    _onNumberPointerDown(event: PointerEvent): void;
    _onNumberValueInput(event: CustomEvent): void;
    valueChanged(): void;
    valueMutated(): void;
    changed(): void;
    getSlotted(): VDOMElement | null;
}
export declare const ioVector: (arg0?: IoVectorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoVector.d.ts.map