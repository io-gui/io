import { IoField } from './field.js';
export declare class IoButton extends IoField {
    static get Style(): string;
    action?: any;
    value: any;
    pressed: boolean;
    role: string;
    _onPointerdown(event: PointerEvent): void;
    _onPointerleave(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    _onClick(): void;
    init(): void;
    changed(): void;
}
//# sourceMappingURL=button.d.ts.map