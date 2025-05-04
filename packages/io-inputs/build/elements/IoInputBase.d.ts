import { VDOMElement, PropsWithBinding } from 'io-gui';
import { IoField, IoFieldProps } from './IoField';
export type IoInputBaseProps = IoFieldProps & PropsWithBinding<{
    pressed?: boolean;
}>;
export declare class IoInputBase extends IoField {
    static vConstructor: (arg0?: IoInputBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    static get Listeners(): {
        'focus-to': string;
        focus: string;
        pointerdown: string;
        click: string;
    };
    pressed: boolean;
    pattern: string;
    spellcheck: boolean;
    constructor(args?: IoInputBaseProps);
    onFocus(event: FocusEvent): void;
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onClick(event?: MouseEvent): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    onFocusTo(event: CustomEvent): void;
    focusTo(dir: string): void;
    getCaretPosition(): number;
    setCaretPosition(position: number): void;
}
export declare const ioInputBase: (arg0?: IoInputBaseProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoInputBase.d.ts.map