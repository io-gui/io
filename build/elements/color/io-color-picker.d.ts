import { IoElement } from '../../core/element.js';
import './io-color-swatch.js';
export declare class IoColorPicker extends IoElement {
    static get Style(): string;
    value: {
        r: number;
        g: number;
        b: number;
        a?: number;
    };
    static get Listeners(): any;
    tabindex: string;
    _onClick(event: FocusEvent): void;
    get expanded(): boolean;
    _onKeydown(event: KeyboardEvent): void;
    _onValueSet(): void;
    toggle(): void;
    expand(): void;
    collapse(): void;
    changed(): void;
}
//# sourceMappingURL=io-color-picker.d.ts.map