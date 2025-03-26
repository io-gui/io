import { IoField } from 'io-gui';
/**
 * Input element for `String` data type.
 **/
export declare class IoString extends IoField {
    static get Style(): string;
    live: boolean;
    value: string | number | boolean;
    contenteditable: boolean;
    role: string;
    appearance: 'flush' | 'inset' | 'outset';
    _setFromTextNode(): void;
    _tryParseFromTextNode(): void;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    changed(): void;
    valueChanged(): void;
}
//# sourceMappingURL=io-string.d.ts.map