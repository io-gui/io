import { PropertiesDeclaration } from '../../core/io-node.js';
import { IoElement } from '../../core/io-element.js';
export declare class IoItem extends IoElement {
    static get Style(): string;
    static get Properties(): PropertiesDeclaration;
    static get Listeners(): {
        focus: string;
        pointerdown: string;
        click: string;
    };
    constructor(properties?: Record<string, any>);
    _onFocus(event: FocusEvent): void;
    _onBlur(event: FocusEvent): void;
    _onPointerdown(event: PointerEvent): void;
    _onPointermove(event: PointerEvent): void;
    _onPointerleave(event: PointerEvent): void;
    _onPointerup(event: PointerEvent): void;
    _onClick(): void;
    _onKeydown(event: KeyboardEvent): void;
    _onKeyup(event: KeyboardEvent): void;
    getCaretPosition(): number;
    setCaretPosition(position: number): void;
    changed(): void;
}
//# sourceMappingURL=item.d.ts.map