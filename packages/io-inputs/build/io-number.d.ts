import { IoField } from 'io-gui';
/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
export declare class IoNumber extends IoField {
    static get Style(): string;
    role: string;
    value: number;
    conversion: number;
    step: number;
    min: number;
    max: number;
    ladder: boolean;
    contenteditable: boolean;
    type: string;
    pattern: string;
    inputmode: string;
    spellcheck: string;
    appearance: 'flush' | 'inset' | 'outset';
    private _pointer;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onFocus(event: FocusEvent): void;
    _expandLadder(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    _setFromTextNode(): void;
    init(): void;
    changed(): void;
}
export declare const ioNumber: (arg0?: import("io-gui").IoNodeArgs | import("io-gui").VDOMArray[], arg1?: import("io-gui").VDOMArray[]) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-number.d.ts.map