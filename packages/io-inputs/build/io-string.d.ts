import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';
export type IoStringArgs = IoInputBaseArgs & ArgsWithBinding<{
    live?: boolean;
    value?: string;
    placeholder?: string;
    spellcheck?: 'true' | 'false';
}>;
/**
 * Input element for `String` data type.
 **/
export declare class IoString extends IoInputBase {
    static vConstructor: (arg0?: IoStringArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    live: boolean;
    value: string;
    type: string;
    role: string;
    appearance: 'flush' | 'inset' | 'outset';
    placeholder: string;
    spellcheck: string;
    constructor(args?: IoStringArgs);
    _setFromTextNode(): void;
    _tryParseFromTextNode(): void;
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    init(): void;
    disabledChanged(): void;
    changed(): void;
    valueChanged(): void;
}
export declare const ioString: (arg0?: IoStringArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-string.d.ts.map