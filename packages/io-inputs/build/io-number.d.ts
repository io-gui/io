import { VDOMArray, ArgsWithBinding } from 'io-gui';
import { IoInputBase, IoInputBaseArgs } from './io-input-base';
export type IoNumberArgs = IoInputBaseArgs & ArgsWithBinding<{
    value?: number;
    conversion?: number;
    step?: number;
    min?: number;
    max?: number;
    ladder?: boolean;
}>;
/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
export declare class IoNumber extends IoInputBase {
    static vConstructor: (arg0?: IoNumberArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    static get Style(): string;
    value: number;
    conversion: number;
    step: number;
    min: number;
    max: number;
    ladder: boolean;
    type: string;
    role: string;
    pattern: string;
    inputmode: string;
    appearance: 'flush' | 'inset' | 'outset';
    placeholder: string;
    spellcheck: string;
    private _pointer;
    constructor(args?: IoNumberArgs);
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    onFocus(event: FocusEvent): void;
    _expandLadder(): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    _setFromTextNode(): void;
    init(): void;
    disabledChanged(): void;
    changed(): void;
}
export declare const ioNumber: (arg0?: IoNumberArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-number.d.ts.map