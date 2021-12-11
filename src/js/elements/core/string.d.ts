import { IoItem } from './item.js';
export declare class IoString extends IoItem {
    static get Style(): string;
    static get Properties(): any;
    _setFromTextNode(): void;
    _tryParseFromTextNode(): void;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(): void;
    _onPointermove(): void;
    _onPointerup(): void;
    _onKeyup(event: KeyboardEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    changed(): void;
    applyAria(): void;
}
//# sourceMappingURL=string.d.ts.map