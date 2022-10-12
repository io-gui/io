import { IoField } from './field.js';
export declare class IoString extends IoField {
    static get Style(): string;
    live: boolean;
    value: string;
    contenteditable: boolean;
    role: string;
    _setFromTextNode(): void;
    _tryParseFromTextNode(): void;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(): void;
    _onPointermove(): void;
    _onPointerup(): void;
    _onKeyup(event: KeyboardEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    changed(): void;
    valueChanged(): void;
}
//# sourceMappingURL=string.d.ts.map