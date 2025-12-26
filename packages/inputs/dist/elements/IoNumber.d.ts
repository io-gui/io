import { WithBinding } from '@io-gui/core';
import { IoField, IoFieldProps } from './IoField.js';
export type IoNumberProps = IoFieldProps & {
    value?: WithBinding<number>;
    live?: boolean;
    conversion?: number;
    step?: number;
    min?: number;
    max?: number;
    ladder?: boolean;
};
/**
 * Input element for `Number` data type.
 * It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
 * If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
 * Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.
 **/
export declare class IoNumber extends IoField {
    static get Style(): string;
    value: number;
    live: boolean;
    conversion: number;
    step: number;
    min: number;
    max: number;
    ladder: boolean;
    appearance: 'neutral' | 'inset' | 'outset';
    contentEditable: string;
    pattern: string;
    inputMode: string;
    role: string;
    constructor(args?: IoNumberProps);
    get textNode(): string | null;
    set textNode(value: string | null);
    onBlur(event: FocusEvent): void;
    onPointerdown(event: PointerEvent): void;
    onPointerup(event: PointerEvent): void;
    expandLadder(): void;
    collapseLadder(): void;
    onKeydown(event: KeyboardEvent): void;
    onKeyup(event: KeyboardEvent): void;
    _setFromTextNode(): void;
    ready(): void;
    changed(): void;
}
export declare const ioNumber: (arg0?: IoNumberProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoNumber.d.ts.map