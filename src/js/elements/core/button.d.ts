import { IoItem } from './item.js';
export declare class IoButton extends IoItem {
    static get Style(): string;
    static get Properties(): any;
    _onPointerdown(event: PointerEvent): void;
    _onPointerleave(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    _onClick(): void;
}
//# sourceMappingURL=button.d.ts.map