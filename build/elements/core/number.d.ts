import { IoItem } from './item.js';
export declare class IoNumber extends IoItem {
    static get Style(): string;
    static get Properties(): any;
    constructor(properties?: Record<string, any>);
    _onPointerdown(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onFocus(event: FocusEvent): void;
    _onBlur(event: FocusEvent): void;
    _expandLadder(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    _setFromTextNode(): void;
    changed(): void;
    applyAria(): void;
}
//# sourceMappingURL=number.d.ts.map