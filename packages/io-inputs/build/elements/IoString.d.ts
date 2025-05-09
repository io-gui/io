import { VDOMElement, Binding } from 'io-gui';
import { IoField, IoFieldProps } from './IoField';
export type IoStringProps = Omit<IoFieldProps, 'value'> & {
    value?: string | Binding<string>;
    live?: boolean | Binding<boolean>;
    placeholder?: string | Binding<string>;
    appearance?: 'neutral' | 'inset' | 'outset';
};
/**
 * Input element for `String` data type.
 **/
export declare class IoString extends IoField {
    static vConstructor: (arg0?: IoStringProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: string;
    live: boolean;
    placeholder: string;
    appearance: 'neutral' | 'inset' | 'outset';
    contentEditable: boolean;
    role: string;
    constructor(args?: IoStringProps);
    get textNode(): any;
    set textNode(value: any);
    _setFromTextNode(): void;
    _tryParseFromTextNode(): void;
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    init(): void;
    valueChanged(): void;
    changed(): void;
}
export declare const ioString: (arg0?: IoStringProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoString.d.ts.map