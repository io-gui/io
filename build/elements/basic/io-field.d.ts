import { IoElement } from '../../core/element.js';
export declare class IoField extends IoElement {
    static get Style(): string;
    tabindex: string;
    value: any;
    icon: string;
    appearance: 'flush' | 'inset' | 'outset' | 'neutral';
    stroke: boolean;
    selected: boolean;
    invalid: boolean;
    placeholder: string;
    static get Listeners(): {
        'focus-to': string;
        focus: string;
        pointerdown: string;
        click: string;
    };
    _onFocus(event: FocusEvent): void;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerleave(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onClick(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    _onFocusTo(event: CustomEvent): void;
    focusTo(dir: string): void;
    getCaretPosition(): number;
    setCaretPosition(position: number): void;
    changed(): void;
}
//# sourceMappingURL=io-field.d.ts.map