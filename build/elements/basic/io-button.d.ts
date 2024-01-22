import { IoField } from './io-field.js';
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
 **/
export declare class IoButton extends IoField {
    static get Style(): string;
    action?: any;
    value: any;
    appearance: 'flush' | 'inset' | 'outset' | 'neutral';
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
//# sourceMappingURL=io-button.d.ts.map