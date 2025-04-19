import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoField, IoFieldArgs } from './IoField';
export type IoInputBaseArgs = IoFieldArgs & ArgsWithBinding<{
    pressed?: boolean;
}>;
export declare class IoInputBase extends IoField {
    static vConstructor: (arg0?: IoInputBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    static get Listeners(): {
        'focus-to': string;
        focus: string;
        pointerdown: string;
        click: string;
    };
    pressed: boolean;
    constructor(args?: IoInputBaseArgs);
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
export declare const ioInputBase: (arg0?: IoInputBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoInputBase.d.ts.map