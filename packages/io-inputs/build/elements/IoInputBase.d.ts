import { VDOMElement, ArgsWithBinding } from 'io-gui';
import { IoField, IoFieldArgs } from './IoField';
export type IoInputBaseArgs = IoFieldArgs & ArgsWithBinding<{
    tabindex?: '-1' | '0' | '' | '1' | '2' | '3';
    name?: string;
    label?: string;
    value?: any;
    icon?: string;
    type?: string;
}>;
export declare class IoInputBase extends IoField {
    static vConstructor: (arg0?: IoInputBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    tabindex: string;
    name: string;
    label: string;
    value: any;
    icon: string;
    type: string;
    static get Listeners(): {
        'focus-to': string;
        focus: string;
        pointerdown: string;
        click: string;
    };
    constructor(args?: IoInputBaseArgs);
    onFocus(event: FocusEvent): void;
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointermove(event: PointerEvent): void;
    onPointerleave(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onClick(): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    onFocusTo(event: CustomEvent): void;
    focusTo(dir: string): void;
    getCaretPosition(): number;
    setCaretPosition(position: number): void;
    changed(): void;
}
export declare const ioInputBase: (arg0?: IoInputBaseArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoInputBase.d.ts.map